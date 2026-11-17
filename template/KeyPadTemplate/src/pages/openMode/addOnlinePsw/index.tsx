import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Input,
  ScrollView,
  router,
  navigateBack,
  showToast,
  setClipboardData,
  useQuery,
} from '@ray-js/ray';
import { NavBar, Switch, Popup, DatetimePicker } from '@ray-js/smart-ui';
import { useDevice } from '@ray-js/panel-sdk';
import dayjs from 'dayjs';
import { addFitTempPwd, updateFitTempPwd } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import { templateConfig } from '@/config';
import { reConnectBle } from '@/utils/reConnectBle';
import styles from './index.module.less';

/**
 * 添加 / 编辑在线临时密码页（一次性 / 不限次数）。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/password/addOnlinePsw.js：
 * - 新增：输入 / 随机生成数字密码（位数由本地配置决定，使用 0-9 数字）+ 可选命名（≤20）+ 生效/失效时间（失效须晚于生效）；
 *   仅不限次数密码（isUnlimited=true）可开「重复」：选每周星期 + 每日生效/失效时段；「保存」调 `addFitTempPwd`
 *   （SDK 组装 EffectiveConfig：type once/limit + 生效期 + 周重复 + 每日时段），回退 3 层到 openMode（RN popN(3)）。
 * - 编辑（query isEdit=1，对齐 RN editPsw → addOnlinePsw isEdit=true）：无密码框，仅改名 + 生效期 + 重复，
 *   「保存」调 `updateFitTempPwd({id,name,effective})`（设备 tempPwdEdit + 云端 opmode 更新），回退 1 层（RN pop()）。
 *   编辑仅对 opModeType=1 且 opModeSubType=0（时效临时）开放，故编辑态 isUnlimited 恒为 true。
 *
 * 新增入口：openMode → chooseOpenModeType(password) → chooseLockList(选门锁) → 本页（query 带 lockDevId + isUnlimited）。
 * 编辑入口：openMode 密码列表项菜单「编辑」→ 本页（query 带 isEdit=1 + editData）。
 *
 * 说明：RN 的「短信通知」分区依赖手机号下发，fit SDK 的 addFitTempPwd 不接收手机号参数（仅用当前账号国家码），
 * 故本页不迁移短信通知。
 */

const MAX_NAME_LEN = 20;
/** 新增回退层数：openMode→chooseOpenModeType→chooseLockList→本页（对齐 RN popN(3)） */
const ADD_BACK_DELTA = 3;
/** 编辑回退层数：openMode→本页（对齐 RN uploadOnLineTempPwd pop()） */
const EDIT_BACK_DELTA = 1;
/** 每日时段默认（对齐 RN scheduleItem effectiveTime:480=08:00 / invalidTime:540=09:00） */
const DEFAULT_DAILY_START = 480;
const DEFAULT_DAILY_END = 540;

const toSec = (ms: number) => Math.floor(ms / 1000);
const fmtDateTime = (ms: number) => dayjs(ms).format('YYYY-MM-DD HH:mm');
/** 分钟数 → HH:mm */
const minToHHmm = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(h)}:${pad(m)}`;
};
/** HH:mm → 分钟数 */
const hhmmToMin = (v: string) => {
  const [h, m] = v.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};
/** workingDay 位图 → weeks[7]（索引 i = bit i，对齐 SDK formatWeek/parseWeek） */
const workingDayToWeeks = (workingDay: number): number[] =>
  // eslint-disable-next-line no-bitwise
  Array.from({ length: 7 }, (_, i) => (workingDay >> i) & 1);

/** 周标签（对齐 RN WeekView day0~day6 = 周日~周六，与 workingDay bit0~bit6 对应） */
const WEEK_KEYS = ['day0', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6'] as const;

interface OnlineEditData {
  id: number;
  name: string;
  effectiveTime: number; // 秒
  invalidTime: number; // 秒
  schedule: {
    allDay: boolean;
    effectiveTime: number;
    invalidTime: number;
    workingDay: number;
  } | null;
}

type PickerTarget = 'effective' | 'invalid' | 'dailyStart' | 'dailyEnd' | null;

export function AddOnlinePsw() {
  const query = useQuery() as {
    lockDevId?: string;
    isUnlimited?: string;
    isEdit?: string;
    editData?: string;
  };
  const { lockDevId = '', isUnlimited: isUnlimitedQuery = 'false' } = query;
  const isEdit = query.isEdit === '1';
  // 编辑态入参（对齐 RN editPsw 透传的 pswData，miniapp 经 editData query 传 JSON）
  const edit = useMemo<OnlineEditData | null>(() => {
    if (!isEdit || !query.editData) return null;
    try {
      return JSON.parse(decodeURIComponent(query.editData));
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, query.editData]);
  // 编辑态恒为时效临时（可重复）；新增态由 query isUnlimited 决定
  const isUnlimited = isEdit ? true : isUnlimitedQuery === 'true';

  const { themeColor } = templateConfig;
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);

  const { minLength: minPswLen, maxLength: maxPswLen } = templateConfig.password;
  const minDigit = 0;
  const maxDigit = 9;
  const pwdTitle =
    minPswLen === maxPswLen
      ? Strings.formatValue('pwdLenTitle', minPswLen)
      : Strings.formatValue('pwdRangeTitle', minPswLen, maxPswLen);

  const now = Date.now();
  const yearLater = dayjs(now).add(10, 'year').valueOf();

  const [password, setPassword] = useState('');
  const [name, setName] = useState(edit?.name || '');
  const [loading, setLoading] = useState(false);
  const [reconnectSeconds, setReconnectSeconds] = useState(0);

  // 生效时间：新增默认当前（对齐 RN effectiveDate=now），编辑取原值；失效时间新增需选（null），编辑取原值
  const [effectiveMs, setEffectiveMs] = useState<number>(edit ? edit.effectiveTime * 1000 : now);
  const [invalidMs, setInvalidMs] = useState<number | null>(edit ? edit.invalidTime * 1000 : null);

  // 重复相关（仅不限次数密码）：allDay = !repeat（对齐 RN schedule[0].allDay）
  const [repeat, setRepeat] = useState(edit?.schedule ? !edit.schedule.allDay : false);
  const [dailyStart, setDailyStart] = useState(
    edit?.schedule ? edit.schedule.effectiveTime : DEFAULT_DAILY_START
  );
  const [dailyEnd, setDailyEnd] = useState(
    edit?.schedule ? edit.schedule.invalidTime : DEFAULT_DAILY_END
  );
  // 周重复位图：索引 0~6 = 周日~周六（对齐 RN workingDay bit0~bit6，默认全选 127）
  const [weeks, setWeeks] = useState<number[]>(
    edit?.schedule ? workingDayToWeeks(edit.schedule.workingDay) : [1, 1, 1, 1, 1, 1, 1]
  );

  const [picker, setPicker] = useState<PickerTarget>(null);

  const toast = (title: string) => showToast({ title, icon: 'none' });

  const errText = (err: any) => {
    const e =
      typeof err === 'string'
        ? (() => {
            try {
              return JSON.parse(err);
            } catch {
              return { message: err };
            }
          })()
        : err;
    return e?.errorMsg || e?.errorCode || e?.message || Strings.getLang('addError');
  };

  // 密码输入：仅保留 0-9 数字，长度由本地配置限制。
  const onPswInput = (value: string) => {
    setPassword(
      value.replace(new RegExp(`[^${minDigit}-${maxDigit}]`, 'g'), '').slice(0, maxPswLen)
    );
  };

  // 随机生成密码（对齐 RN getRandomPassword：默认长度=最短位数，逐位取可用数字集内随机值）
  const genRandom = () => {
    let result = '';
    for (let i = 0; i < minPswLen; i++) {
      result += (minDigit + Math.floor(Math.random() * (maxDigit - minDigit + 1))).toString();
    }
    setPassword(result);
  };

  const copy = () => {
    setClipboardData({ data: password });
    toast(Strings.getLang('pswCopied'));
  };

  const onNameInput = (value: string) => {
    if (value.length > MAX_NAME_LEN) {
      toast(Strings.getLang('nameToLong'));
      return;
    }
    setName(value);
  };

  const toggleWeek = (idx: number) => {
    setWeeks(prev => prev.map((v, i) => (i === idx ? (v ? 0 : 1) : v)));
  };

  // 打开日期/时间选择器
  const openPicker = (target: Exclude<PickerTarget, null>) => setPicker(target);

  const onPickerConfirm = (e: { detail: number | string }) => {
    if (picker === 'effective') {
      setEffectiveMs(e.detail as number);
    } else if (picker === 'invalid') {
      setInvalidMs(e.detail as number);
    } else if (picker === 'dailyStart') {
      setDailyStart(hhmmToMin(e.detail as string));
    } else if (picker === 'dailyEnd') {
      setDailyEnd(hhmmToMin(e.detail as string));
    }
    setPicker(null);
  };

  // 保存（对齐 RN addTempPsw / updateTempPsw → beforeSaveCheck → addFitTempPwd / updateFitTempPwd）
  const onSave = async () => {
    if (loading) return;
    if (!deviceOnline) {
      await reConnectBle({ onTick: sec => setReconnectSeconds(sec) })
        .catch(error => {
          console.log('Operation failed', error);
        })
        .finally(() => setReconnectSeconds(0));
      return;
    }
    // 密码校验（仅新增，对齐 RN beforeSaveCheck 的 !isEdit 分支）
    if (!isEdit) {
      if (password === '') {
        toast(Strings.getLang('pswCanNotNull'));
        return;
      }
      if (password.length < minPswLen) {
        toast(Strings.getLang('pswNotMatch'));
        return;
      }
    } else if (name.trim() === '') {
      // 编辑态名称必填（updateFitTempPwd 名称为空会抛 1054）
      toast(Strings.getLang('nameCanNotNull'));
      return;
    }
    if (invalidMs === null) {
      toast(Strings.getLang('invalidTimeCanNotNull'));
      return;
    }
    if (effectiveMs >= invalidMs) {
      toast(Strings.getLang('timeChooseError'));
      return;
    }
    // 重复校验（仅不限次数密码开启重复时，对齐 RN saveTempPsw）
    if (isUnlimited && repeat) {
      if (dailyStart >= dailyEnd) {
        toast(Strings.getLang('timeChooseError1'));
        return;
      }
      if (weeks.every(v => v === 0)) {
        toast(Strings.getLang('weekNotNull'));
        return;
      }
    }

    const effective = {
      effectiveDate: toSec(effectiveMs),
      expiredDate: toSec(invalidMs),
      repeat: (isUnlimited && repeat ? 'week' : 'none') as 'week' | 'none',
      ...(isUnlimited && repeat
        ? {
            weeks: weeks as any,
            effectiveTime: dailyStart,
            expiredTime: dailyEnd,
          }
        : {}),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateFitTempPwd({ id: Number(edit?.id), name: name.trim(), effective });
        navigateBack({ delta: EDIT_BACK_DELTA });
      } else {
        await addFitTempPwd({
          lockDevId,
          type: isUnlimited ? 'limit' : 'once',
          password,
          name: name.trim() || undefined,
          effective,
        });
        navigateBack({ delta: ADD_BACK_DELTA });
      }
    } catch (err) {
      toast(errText(err));
    } finally {
      setLoading(false);
    }
  };

  const renderTimeRow = (
    label: string,
    target: Exclude<PickerTarget, null>,
    display: string | null
  ) => (
    <View className={styles.row} onClick={() => openPicker(target)}>
      <Text className={styles.itemLabel}>{label}</Text>
      <View className={styles.valueWrap}>
        <Text className={display !== null ? styles.value : styles.placeholder}>
          {display !== null ? display : Strings.getLang('pleaseChoose')}
        </Text>
        <View className={styles.arrow} />
      </View>
    </View>
  );

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={isEdit ? Strings.getLang('edit') : ' '}
        leftArrow
        onClickLeft={() => router.back()}
      />

      <ScrollView className={styles.scroll} scrollY>
        {/* 顶部标题 + 密码输入（编辑态不改密码，隐藏，对齐 RN !isEdit && renderPsw / topWarp） */}
        {!isEdit && (
          <>
            <View className={styles.topWrap}>
              <Text className={styles.topTitle}>
                {Strings.getLang(
                  isUnlimited ? 'addOnlinePswTitle_true' : 'addOnlinePswTitle_false'
                )}
              </Text>
              <Text className={styles.topSubTitle}>{Strings.getLang('addOnlinePswSubTitle')}</Text>
            </View>

            <View className={styles.pswWrap}>
              <Text className={styles.pwdTextTitle}>{pwdTitle}</Text>
              <View className={styles.pswBox}>
                <Input
                  className={styles.pswInput}
                  type="number"
                  value={password}
                  maxLength={maxPswLen}
                  placeholder=""
                  onInput={(e: { detail: { value: string } }) => onPswInput(e.detail.value)}
                />
                <Text
                  className={styles.randomBtn}
                  style={{ color: themeColor }}
                  onClick={genRandom}
                >
                  {Strings.getLang('random')}
                </Text>
              </View>
              {password !== '' && (
                <Text className={styles.copyText} style={{ color: themeColor }} onClick={copy}>
                  {Strings.getLang('copy')}
                </Text>
              )}
            </View>
          </>
        )}

        {/* 命名 */}
        <View className={styles.nameItem}>
          <Text className={styles.itemLabel}>{Strings.getLang('pswName')}</Text>
          <Input
            className={styles.nameInput}
            value={name}
            maxLength={MAX_NAME_LEN}
            placeholder={Strings.getLang('inputName')}
            placeholderStyle="color: rgba(51,51,51,0.2)"
            onInput={(e: { detail: { value: string } }) => onNameInput(e.detail.value)}
          />
        </View>

        {/* 生效 / 失效时间 */}
        <View className={styles.group}>
          {renderTimeRow(Strings.getLang('effectiveTime'), 'effective', fmtDateTime(effectiveMs))}
          {renderTimeRow(
            Strings.getLang('invalidTime'),
            'invalid',
            invalidMs !== null ? fmtDateTime(invalidMs) : null
          )}
        </View>

        {/* 重复（仅不限次数密码） */}
        {isUnlimited && (
          <View className={styles.group}>
            <View className={styles.row}>
              <Text className={styles.itemLabel}>{Strings.getLang('repeat')}</Text>
              <Switch
                checked={repeat}
                activeColor={themeColor}
                onChange={(e: { detail: boolean }) => setRepeat(e.detail)}
              />
            </View>
            {repeat && (
              <View>
                {renderTimeRow(Strings.getLang('_startTime'), 'dailyStart', minToHHmm(dailyStart))}
                {renderTimeRow(Strings.getLang('_endTime'), 'dailyEnd', minToHHmm(dailyEnd))}
                <View className={styles.weekRow}>
                  {WEEK_KEYS.map((k, idx) => {
                    const active = weeks[idx] === 1;
                    return (
                      <View
                        key={k}
                        className={`${styles.weekDay} ${active ? styles.weekDayActive : ''}`}
                        style={
                          active
                            ? { backgroundColor: themeColor, borderColor: themeColor }
                            : undefined
                        }
                        onClick={() => toggleWeek(idx)}
                      >
                        <Text
                          className={`${styles.weekText} ${active ? styles.weekTextActive : ''}`}
                        >
                          {Strings.getLang(k)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View className={styles.bottomWrap}>
        <View
          className={styles.btn}
          style={{ backgroundColor: themeColor, opacity: loading ? 0.5 : 1 }}
          onClick={onSave}
        >
          <Text className={styles.btnText}>{Strings.getLang('save')}</Text>
        </View>
      </View>

      {/* 日期时间选择器（生效/失效：datetime；每日时段：time） */}
      <Popup show={picker !== null} position="bottom" round onClose={() => setPicker(null)}>
        {(picker === 'effective' || picker === 'invalid') && (
          <DatetimePicker
            type="datetime"
            // 失效时间未选时，选择器默认落在「生效时间 + 1 小时」（对齐 RN invalidDate = effectiveDate + 1h）
            value={
              picker === 'effective'
                ? effectiveMs
                : invalidMs ?? dayjs(effectiveMs).add(1, 'hour').valueOf()
            }
            minDate={picker === 'invalid' ? effectiveMs : now}
            maxDate={yearLater}
            title={Strings.getLang(picker === 'invalid' ? 'invalidTime' : 'effectiveTime')}
            confirmButtonText={Strings.getLang('confirm')}
            cancelButtonText={Strings.getLang('cancel')}
            onConfirm={onPickerConfirm}
            onCancel={() => setPicker(null)}
          />
        )}
        {(picker === 'dailyStart' || picker === 'dailyEnd') && (
          <DatetimePicker
            type="time"
            value={minToHHmm(picker === 'dailyStart' ? dailyStart : dailyEnd)}
            title={Strings.getLang(picker === 'dailyEnd' ? '_endTime' : '_startTime')}
            confirmButtonText={Strings.getLang('confirm')}
            cancelButtonText={Strings.getLang('cancel')}
            onConfirm={onPickerConfirm}
            onCancel={() => setPicker(null)}
          />
        )}
      </Popup>

      {reconnectSeconds > 0 && (
        <View className={styles.reconnectMask}>
          <View className={styles.reconnectBox}>
            <Text className={styles.reconnectText}>
              {Strings.formatValue('connectBle', String(reconnectSeconds))}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default AddOnlinePsw;
