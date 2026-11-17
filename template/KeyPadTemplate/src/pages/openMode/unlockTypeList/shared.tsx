import React from 'react';
import { View, Text, Image, getCdnUrl, router, showToast } from '@ray-js/ray';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/**
 * unlockTypeList 共享层：各类开锁方式列表（蓝牙钥匙 / 指纹卡人脸掌静脉 / 密码）共用的
 * 展示组件与常量。对齐 RN(0000007ew6) openMode 各列表容器（key / others / password）的公共部分。
 */

export const cdn = (name: string) => getCdnUrl(name, cdnImage);

/** 短信通知 DP（对齐 RN Config.uiConfig.dpMessage，lock-sdk dpCodes.message） */
export const DP_MESSAGE = 'message';

/** tab -> opMode（对齐 RN goToFailureList：蓝牙钥匙 opMode='4'，密码 opMode='1'） */
export const FAILURE_OP_MODE: Record<string, string> = {
  bluetooth_unlock_kit: '4',
  unlock_password_kit: '1',
};

/** 副信息行：每行一个前置小图标 + 文字（用户名 / 门锁 / 时间） */
export type SubRow = { icon: string; text: string };

/**
 * 列表项：标题 + 副信息行。
 * 布局对齐 RN openMode/others/index.js & key/index.js 的 renderCustomItem：
 * 圆角白卡，左上主题色圆形 icon + 名称，下方每条副信息行（littleUser/littleLock/littleTime + 文字）
 * 均在同一张白卡内（RN 的 userName / devNameList / 生效时间行都是 listItem 的子节点）。
 */
export function MethodItem({
  icon,
  title,
  subRows,
}: {
  icon: string;
  title: string;
  subRows?: SubRow[];
}) {
  const { themeColor } = templateConfig;
  return (
    <View className={styles.item}>
      <View className={styles.itemTop}>
        <View className={styles.iconBg} style={{ backgroundColor: themeColor }}>
          <Image className={styles.icon} src={icon} />
        </View>
        <Text className={styles.title}>{title}</Text>
      </View>
      {(subRows || []).map((row, i) =>
        row.text ? (
          <View key={i} className={styles.itemSub}>
            <Image className={styles.subIcon} src={row.icon} />
            <Text className={styles.itemSubText}>{row.text}</Text>
          </View>
        ) : null
      )}
    </View>
  );
}

/** 空状态（对齐 RN noData_<dpId>） */
export function EmptyState({ tip }: { tip: string }) {
  return (
    <View className={styles.noneWrap}>
      <Image className={styles.noneIcon} src={cdn('noneIcon.png')} />
      <Text className={styles.tip}>{tip}</Text>
    </View>
  );
}

/**
 * 「查看无效开锁方式」入口（对齐 RN key/index.js & password/index.js renderFooter）。
 * 仅蓝牙钥匙、密码两类展示；其余列表 RN 已注释「不需要无效列表入口」。
 * 跳转 /failurePswList，带 title 与 opMode（对齐 RN Navigator.push({ id:'failurePsw', ... })）。
 */
export function FailureEntry({ text, tag }: { text: string; tag: string }) {
  const onPress = () => {
    const opMode = FAILURE_OP_MODE[tag];
    const title = Strings.getLang('failurePsw');
    router.push(`/failurePswList?title=${encodeURIComponent(title)}&opMode=${opMode}`);
  };
  return (
    <View className={styles.failureEntry} onClick={onPress}>
      <Text className={styles.failureText}>{`${text} ＞`}</Text>
    </View>
  );
}

/** 源工程尚未实现的操作提示 */
export const placeholder = (tag: string) => {
  console.log(`=== unlockTypeList placeholder: ${tag}`);
  showToast({ title: Strings.getLang('comingSoon'), icon: 'none' });
};
