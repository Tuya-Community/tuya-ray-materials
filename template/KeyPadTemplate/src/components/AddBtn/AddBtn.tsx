import React from 'react';
import { View, Text } from '@ray-js/ray';
import { templateConfig } from '@/config';
import styles from './index.module.less';

export interface AddBtnProps {
  /** 按钮文案 */
  text: string;
  /** 点击回调 */
  onPress?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 底部吸底主操作按钮。
 *
 * 对齐 RN(0000007ew6) src/components/AddBtn：固定底部、主题色背景、白色加粗文案。
 * 小程序用 CSS 阴影替代 RN 的 btnShadow.png 阴影图。
 */
export function AddBtn({ text, onPress, disabled }: AddBtnProps) {
  const { themeColor } = templateConfig;
  return (
    <View className={styles.addBtnWrap}>
      <View
        className={`${styles.addBtn} ${disabled ? styles.addBtnDisabled : ''}`}
        style={!disabled ? { backgroundColor: themeColor } : undefined}
        onClick={() => {
          if (disabled) return;
          onPress?.();
        }}
      >
        <Text className={styles.addBtnText}>{text}</Text>
      </View>
    </View>
  );
}

export default AddBtn;
