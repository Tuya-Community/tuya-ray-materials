import React, { useEffect, useState } from 'react';
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
  useQuery,
} from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import dayjs from 'dayjs';
import {
  getFitOfflineOncePassword,
  getFitOfflineClearAllCode,
  getFitOfflinePwdAvailable,
  revokeFitOfflineTempPwd,
  renameFitOfflineTempPwd,
} from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/**
 * 离线密码获取页（一次性密码 / 清空所有码 / 清空单个码）。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/password/addOfflinePsw.js（pwdType 1 / 9 / 8）：
 * - pwdType='1' 一次性密码：进入校验获取次数上限，点获取拿密码，失效前仅一次；
 * - pwdType='9' 清空所有码：进入校验上限，清除所有至少用过一次的时间限制离线密码；
 * - pwdType='8' 清空单个码：从 choosePswList 选定一条密码进入（带 pwdId/pwdName/pwdTime），
 *   无需校验上限，生成的清空码有效期与被清空密码相同。
 * 三者拿码后均可命名（`offlinepwd.name.update` 按 pwdId 定位）、自动复制到剪贴板；
 * 「完成」回退：清空单个从列表进入回退 3 层，其余回退 2 层（对齐 RN popN(3)/popN(2)）。
 *
 * 数据源：`@ray-js/lock-sdk`
 * - `getFitOfflinePwdAvailable(pwdType)` 可获取性校验（一次性/清空所有）；
 * - `getFitOfflineOncePassword()` / `getFitOfflineClearAllCode()` / `revokeFitOfflineTempPwd({pwdId})`；
 * - `renameFitOfflineTempPwd({pwdId,name})` 命名。均无需选择门锁，直接绑定当前配件。
 */

const PLACEHOLDER = ' * * * * * * * * * *';
/** 名称最大长度（对齐 RN maxLength 20） */
const MAX_NAME_LEN = 20;

const cdn = (name: string) => getCdnUrl(name, cdnImage);
/** 时间戳(秒) -> MM-DD HH:00（对齐 RN dateFormat('MM-dd hh:00')，整点展示） */
const formatHour = (sec: number) => dayjs(Number(sec) * 1000).format('MM-DD HH:00');

type PwdType = '1' | '9' | '8';

export function AddOfflinePsw() {
  // 密码类型（对齐 RN props.pwdType）：1 一次性 / 9 清空所有 / 8 清空单个
  const query = useQuery() as {
    pwdType?: PwdType;
    pwdId?: string;
    pwdName?: string;
    pwdTime?: string;
    isPopN?: string;
    isPswToClear?: string;
  };
  const pwdType: PwdType = query.pwdType || '1';
  const isClearOne = pwdType === '8';
  const isClearCode = pwdType === '8' || pwdType === '9';
  // 清空单个：被清空密码信息（对齐 RN pswData）
  const chosenName = query.pwdName ? decodeURIComponent(query.pwdName) : '';
  const chosenTime = query.pwdTime ? decodeURIComponent(query.pwdTime) : '';
  // 回退层数（对齐 RN bottomPress：isPopN→popN(3) / isPswToClear→pop() / 其余→popN(2)）：
  // 从 choosePswList 选择进入回退 3 层；从密码列表删除直接进入回退 1 层；其余（一次性/清空所有）回退 2 层。
  const backDelta = query.isPopN === '1' ? 3 : query.isPswToClear === '1' ? 1 : 2;

  const { themeColor } = templateConfig;
  const [canGet, setCanGet] = useState(true);
  const [nextGetTime, setNextGetTime] = useState(0);
  const [hasGetPwd, setHasGetPwd] = useState(false);
  const [psw, setPsw] = useState(PLACEHOLDER);
  const [pwdId, setPwdId] = useState('');
  const [gmtExpired, setGmtExpired] = useState(0);
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

  // 进入判断整点 60 分钟内获取次数是否超限（仅一次性/清空所有，对齐 RN getPswAvailable）
  useEffect(() => {
    if (isClearOne) return; // 清空单个不校验（对齐 RN 仅 pwdType 1/9 调 getPswAvailable）
    (async () => {
      try {
        const res = await getFitOfflinePwdAvailable(pwdType);
        if (res?.available !== true) {
          setCanGet(false);
          setNextGetTime(res?.nextAvailableTime || 0);
        }
      } catch (err) {
        toast(errText(err));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取密码 / 清空码（对齐 RN getPsw / getOnceClear）
  const getPsw = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = isClearOne
        ? await revokeFitOfflineTempPwd({ pwdId: Number(query.pwdId) })
        : pwdType === '9'
        ? await getFitOfflineClearAllCode()
        : await getFitOfflineOncePassword();
      // 清空单个走 revoke 返回 effectiveConfig.expiredDate，其余返回 gmtExpired
      const exp = 'gmtExpired' in res ? res.gmtExpired : res.effectiveConfig?.expiredDate ?? 0;
      setPsw(res.password);
      setPwdId(res.pwdId);
      setGmtExpired(exp);
      setHasGetPwd(true);
      copy(res.password);
    } catch (err) {
      toast(errText(err));
    } finally {
      setLoading(false);
    }
  };

  // 名称输入（对齐 RN onChangeText：超长提示且不写入）
  const onNameChange = (value: string) => {
    if (value.length > MAX_NAME_LEN) {
      toast(Strings.getLang('nameToLong'));
      return;
    }
    setName(value);
  };

  // 底部按钮（对齐 RN bottomPress）：未获取→获取；已获取→填名则先改名，再回退
  const onBottomPress = async () => {
    if (!hasGetPwd) {
      getPsw();
      return;
    }
    const trimmed = name.trim();
    if (trimmed && pwdId) {
      try {
        await renameFitOfflineTempPwd({ pwdId: Number(pwdId), name: trimmed });
      } catch (err) {
        // 改名失败不阻塞回退（对齐 RN upDateOffLineTempPwdNameAsync 仅 warn）
        console.warn('renameFitOfflineTempPwd fail', err);
      }
    }
    navigateBack({ delta: backDelta });
  };

  const topTitle = hasGetPwd
    ? Strings.getLang(isClearCode ? 'clearCodeHasGet' : 'oncePswHasGet')
    : Strings.getLang(isClearCode ? 'addClearCode' : 'addOncePsw');
  const bottomText = hasGetPwd
    ? Strings.getLang('done')
    : Strings.getLang(isClearCode ? 'getClearCode' : 'getPsw');

  const bottomTip = !canGet
    ? Strings.formatString(Strings.getLang('canNotGet'), formatHour(nextGetTime))
    : hasGetPwd
    ? Strings.formatString(Strings.getLang('oncePswInvalidTip'), formatHour(gmtExpired))
    : isClearOne
    ? Strings.getLang('clearOnceTip')
    : Strings.getLang(pwdType === '9' ? 'clearCodeTip' : 'oncePswTip');

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title=" "
        // 已获取后隐藏返回（对齐 RN opacity:0 + pointerEvents:none）
        leftArrow={!hasGetPwd}
        onClickLeft={() => !hasGetPwd && router.back()}
      />

      <View className={styles.topWrap}>
        <Text className={styles.topTitle}>{topTitle}</Text>
        {pwdType === '9' && (
          <Text className={styles.topSubTitle}>{Strings.getLang('clearCodeTitle')}</Text>
        )}
        {isClearOne && (
          <Text className={styles.topSubTitle}>{Strings.getLang('clearCodeOneTitle')}</Text>
        )}
        <Text className={styles.topSubTitle}>{Strings.getLang('addPswSubtitle')}</Text>
      </View>

      {/* 清空单个：被清空密码信息卡（对齐 RN clearPswWarp） */}
      {isClearOne && (
        <View className={styles.chooseWrap}>
          <View className={styles.chooseCard}>
            <Text className={styles.chooseName}>{chosenName}</Text>
            <Text className={styles.chooseTime}>{chosenTime}</Text>
          </View>
        </View>
      )}

      <View className={styles.pswWrap}>
        <View className={styles.pwdBg}>
          <Image className={styles.pwdBgImg} src={cdn('pwdBg.png')} />
          <Text
            className={`${styles.pwdText} ${hasGetPwd ? styles.pwdTextActive : ''}`}
            style={hasGetPwd ? { color: themeColor } : undefined}
          >
            {psw}
          </Text>
        </View>
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
      </View>

      <View className={styles.bottomWrap}>
        <Text className={`${styles.bottomTip} ${!canGet ? styles.bottomTipWarn : ''}`}>
          {bottomTip}
        </Text>
        <View
          className={styles.btn}
          style={{ backgroundColor: themeColor, opacity: !canGet || loading ? 0.2 : 1 }}
          onClick={() => canGet && onBottomPress()}
        >
          <Text className={styles.btnText}>{bottomText}</Text>
        </View>
      </View>
    </View>
  );
}

export default AddOfflinePsw;
