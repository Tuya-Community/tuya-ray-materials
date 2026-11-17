import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Input,
  router,
  navigateBack,
  showToast,
  setClipboardData,
  getCdnUrl,
} from '@ray-js/ray';
import { NavBar, Popup, DatetimePicker } from '@ray-js/smart-ui';
import dayjs from 'dayjs';
import { getFitOfflineLimitPassword, renameFitOfflineTempPwd } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/**
 * 时间限制离线密码获取页（生效期内可多次使用）。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/password/addOfflineUnlimitedPsw.js（pwdType='0'）：
 * - 需先选择「生效时间 / 失效时间」（整点粒度，datetohour），失效须晚于生效；
 * - 选齐时间后点「获取密码」拿密码并自动复制；获取后可命名、隐藏返回箭头；
 * - 「完成」若填名先改名，再回退 2 层（offlineUnlimitedPsw → chooseOpenModeType → openMode）。
 *
 * 数据源：`@ray-js/lock-sdk` 的 `getFitOfflineLimitPassword({effectiveTime,invalidTime})`
 * （云端 offlinepwd.get v1.0，pwdType='0'）+ `renameFitOfflineTempPwd`。无需选择门锁，直接绑定当前配件。
 */

const PLACEHOLDER = '* * * * * * * * * *';
const BACK_DELTA = 2;
const MAX_NAME_LEN = 20;
/** 单位换算：毫秒 → 秒 */
const toSec = (ms: number) => Math.floor(ms / 1000);
/** 向下取整到整点（对齐 RN datetohour：分秒归零） */
const floorToHour = (ms: number) => dayjs(ms).startOf('hour').valueOf();

const cdn = (name: string) => getCdnUrl(name, cdnImage);
const fmt = (ms: number) => dayjs(ms).format('YYYY-MM-DD HH:00');

type PickerTarget = 'start' | 'end' | null;

export function OfflineUnlimitedPsw() {
  const { themeColor } = templateConfig;

  const now = Date.now();
  const yearLater = dayjs(now).add(1, 'year').valueOf();

  // 生效时间默认当前整点（对齐 RN startTime=now / showStartTime=now）
  const [startMs, setStartMs] = useState<number>(floorToHour(now));
  // 失效时间需用户选择（null 表示未选，对齐 RN endTime='' / showEndTime=''）
  const [endMs, setEndMs] = useState<number | null>(null);
  // 是否已选齐时间：生效时间恒有默认，仅失效时间选定后成立（对齐 RN hasChooseTime 由失效选择驱动）
  const hasChooseTime = endMs !== null;

  // 当前打开的选择器（对齐 RN showStartPicker/showEndPicker）
  const [picker, setPicker] = useState<PickerTarget>(null);
  // 选择器临时值（毫秒）
  const [pickerValue, setPickerValue] = useState<number>(floorToHour(now));

  const [hasGetPwd, setHasGetPwd] = useState(false);
  const [psw, setPsw] = useState(PLACEHOLDER);
  const [pwdId, setPwdId] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = (title: string) => showToast({ title, icon: 'none' });

  const errText = (err: any) => {
    const e = typeof err === 'string' ? JSON.parse(err) : err;
    return e?.errorMsg || e?.errorCode || e?.message || Strings.getLang('addError');
  };

  const copy = (value: string) => {
    setClipboardData({ data: value });
    toast(Strings.getLang('pswCopied'));
  };

  // 打开选择器（拿到密码后不允许再改时间，对齐 RN showXxxPicker 的 hasGetPwd 拦截）
  const openPicker = (target: 'start' | 'end') => {
    if (hasGetPwd) return;
    // 失效选择器默认值：已选用已选值，否则取生效时间 +1 小时（对齐 RN endDate = start+1h）
    const base = target === 'start' ? startMs : endMs ?? dayjs(startMs).add(1, 'hour').valueOf();
    setPickerValue(base);
    setPicker(target);
  };

  const onPickerConfirm = (e: { detail: number }) => {
    const ms = floorToHour(e.detail);
    if (picker === 'start') {
      setStartMs(ms);
    } else if (picker === 'end') {
      setEndMs(ms);
    }
    setPicker(null);
  };

  // 获取密码（对齐 RN getPsw）
  const getPsw = async () => {
    if (loading || endMs === null) return;
    if (startMs >= endMs) {
      toast(Strings.getLang('endTLessThanStartT'));
      return;
    }
    setLoading(true);
    try {
      const { password, pwdId: id } = await getFitOfflineLimitPassword({
        effectiveTime: toSec(startMs),
        invalidTime: toSec(endMs),
      });
      setPsw(password);
      setPwdId(id);
      setHasGetPwd(true);
      copy(password);
    } catch (err) {
      toast(errText(err));
    } finally {
      setLoading(false);
    }
  };

  const onNameChange = (value: string) => {
    if (value.length > MAX_NAME_LEN) {
      toast(Strings.getLang('nameToLong'));
      return;
    }
    setName(value);
  };

  // 底部按钮（对齐 RN bottomPress）
  const onBottomPress = async () => {
    if (!hasChooseTime) return;
    if (!hasGetPwd) {
      getPsw();
      return;
    }
    const trimmed = name.trim();
    if (trimmed && pwdId) {
      try {
        await renameFitOfflineTempPwd({ pwdId: Number(pwdId), name: trimmed });
      } catch (err) {
        console.warn('renameFitOfflineTempPwd fail', err);
      }
    }
    navigateBack({ delta: BACK_DELTA });
  };

  const bottomText = !hasChooseTime
    ? Strings.getLang('chooseTime')
    : hasGetPwd
    ? Strings.getLang('done')
    : Strings.getLang('getPsw');
  const bottomTip = !hasChooseTime
    ? Strings.getLang('chooseTimeFirst')
    : hasGetPwd
    ? Strings.getLang('unlimitedHasGet')
    : Strings.getLang('unlimitedPswOffTip');
  const disabled = !hasChooseTime || loading;

  const renderPicker = (label: string, target: 'start' | 'end', ms: number | null) => (
    <View className={styles.timeRow} onClick={() => openPicker(target)}>
      <Text className={styles.timeLabel}>{label}</Text>
      <View className={styles.timeValueWrap}>
        <Text className={ms !== null ? styles.timeValue : styles.timePlaceholder}>
          {ms !== null ? fmt(ms) : Strings.getLang('timeChoose')}
        </Text>
        {!hasGetPwd && <View className={styles.arrow} />}
      </View>
    </View>
  );

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title=" "
        leftArrow={!hasGetPwd}
        onClickLeft={() => !hasGetPwd && router.back()}
      />

      <View className={styles.topWrap}>
        <Text className={styles.topTitle}>
          {hasGetPwd
            ? Strings.getLang('addUnlimitedPswTitle')
            : Strings.getLang('unlimitedPswTitle')}
        </Text>
        <Text className={styles.topSubTitle}>{Strings.getLang('addPswSubtitle')}</Text>
      </View>

      <View className={styles.pswWrap}>
        {hasChooseTime && (
          <View className={styles.pwdBg}>
            <Image className={styles.pwdBgImg} src={cdn('pwdBg.png')} />
            <Text
              className={`${styles.pwdText} ${hasGetPwd ? styles.pwdTextActive : ''}`}
              style={hasGetPwd ? { color: themeColor } : undefined}
            >
              {psw}
            </Text>
          </View>
        )}
        {hasGetPwd && (
          <View>
            <Text
              className={styles.copyText}
              style={{ color: themeColor }}
              onClick={() => copy(psw)}
            >
              {Strings.getLang('copy')}
            </Text>
            <View className={styles.nameItem}>
              <Text className={styles.nameLabel}>{Strings.getLang('pswName')}</Text>
              <Input
                className={styles.nameInput}
                value={name}
                maxLength={MAX_NAME_LEN}
                placeholder={Strings.getLang('inputName')}
                placeholderStyle="color: rgba(51,51,51,0.2)"
                onInput={(e: { detail: { value: string } }) => onNameChange(e.detail.value)}
              />
            </View>
          </View>
        )}
        <View className={styles.timeGroup}>
          {renderPicker(Strings.getLang('effectiveTime'), 'start', startMs)}
          {renderPicker(Strings.getLang('invalidTime'), 'end', endMs)}
        </View>
      </View>

      <View className={styles.bottomWrap}>
        <Text className={styles.bottomTip}>{bottomTip}</Text>
        <View
          className={styles.btn}
          style={{ backgroundColor: themeColor, opacity: disabled ? 0.5 : 1 }}
          onClick={() => !disabled && onBottomPress()}
        >
          <Text className={styles.btnText}>{bottomText}</Text>
        </View>
      </View>

      {/* 时间选择器弹窗（对齐 RN Popup.datePicker，mode datetohour） */}
      <Popup show={picker !== null} position="bottom" round onClose={() => setPicker(null)}>
        <DatetimePicker
          type="datetime"
          value={pickerValue}
          minDate={now}
          maxDate={yearLater}
          title={Strings.getLang(picker === 'end' ? 'invalidTime' : 'effectiveTime')}
          confirmButtonText={Strings.getLang('confirm')}
          cancelButtonText={Strings.getLang('cancel')}
          // 隐藏分钟列，仅到小时（对齐 RN datetohour）
          columnStyles={{ minute: { display: 'none' } }}
          onConfirm={onPickerConfirm}
          onCancel={() => setPicker(null)}
        />
      </Popup>
    </View>
  );
}

export default OfflineUnlimitedPsw;
