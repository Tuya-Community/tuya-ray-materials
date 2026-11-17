import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  router,
  navigateBack,
  showToast,
  setClipboardData,
  getCdnUrl,
} from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { getFitDynamicPassword } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/**
 * 动态密码获取页。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/password/dynamicPsw.js：
 * - 进入时展示占位星号，点「获取密码」调云端拿动态密码并自动复制到剪贴板；
 * - 获取后标题切换为「动态密码已获取」，隐藏返回箭头与底部提示，密码高亮展示并提供「复制」；
 * - 底部按钮切换为「完成」，点击回退 2 层（dynamicPsw → chooseOpenModeType → openMode，对齐 RN popN(2)）。
 *
 * 数据源：`@ray-js/lock-sdk` 的 `getFitDynamicPassword()`（云端 dynapwd.get + 门锁进制/隐零解析，
 * 等价 RN TYNative.getDynamic + getParseDigitalBase）。动态密码无需选择门锁，直接绑定当前配件。
 */

const PLACEHOLDER = ' * * * * * * * *';
/** 回退层数：dynamicPsw → chooseOpenModeType → openMode（对齐 RN popN(2)） */
const BACK_DELTA = 2;

const cdn = (name: string) => getCdnUrl(name, cdnImage);

export function DynamicPsw() {
  const { themeColor } = templateConfig;
  // 是否已拿到密码（对齐 RN hasGetPwd）
  const [hasGetPwd, setHasGetPwd] = useState(false);
  // 展示的密码文本（对齐 RN dynamicPsw）
  const [psw, setPsw] = useState(PLACEHOLDER);
  // 防重复点击
  const [loading, setLoading] = useState(false);

  const toast = (title: string) => showToast({ title, icon: 'none' });

  const copy = (value: string) => {
    setClipboardData({ data: value });
    toast(Strings.getLang('pswCopied'));
  };

  // 获取动态密码（对齐 RN getPsw）
  const getPsw = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { password } = await getFitDynamicPassword();
      setPsw(password);
      setHasGetPwd(true);
      copy(password);
    } catch (err: any) {
      const e = typeof err === 'string' ? JSON.parse(err) : err;
      toast(e?.errorMsg || e?.errorCode || e?.message || Strings.getLang('addError'));
    } finally {
      setLoading(false);
    }
  };

  // 底部按钮（对齐 RN bottomPress）：未获取→获取；已获取→回退 2 层
  const onBottomPress = () => {
    if (!hasGetPwd) {
      getPsw();
    } else {
      navigateBack({ delta: BACK_DELTA });
    }
  };

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
        <Text className={styles.topTitle}>
          {hasGetPwd ? Strings.getLang('dynamicPswHasGet') : Strings.getLang('getDynamicPsw')}
        </Text>
      </View>

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
          <Text className={styles.copyText} style={{ color: themeColor }} onClick={() => copy(psw)}>
            {Strings.getLang('copy')}
          </Text>
        )}
      </View>

      <View className={styles.bottomWrap}>
        {!hasGetPwd && <Text className={styles.bottomTip}>{Strings.getLang('dynamicTip')}</Text>}
        <View
          className={styles.btn}
          style={{ backgroundColor: themeColor, opacity: loading ? 0.2 : 1 }}
          onClick={onBottomPress}
        >
          <Text className={styles.btnText}>
            {hasGetPwd ? Strings.getLang('done') : Strings.getLang('getPsw')}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default DynamicPsw;
