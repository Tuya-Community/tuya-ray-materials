import React from 'react';
import { View } from '@ray-js/ray';
import { Switch } from '@ray-js/smart-ui';
import styles from './index.module.less';

export interface SwitchOption {
  key: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

interface SwitchOptionGroupProps {
  options: SwitchOption[];
}

/**
 * 可复用的开关选项组组件
 */
const SwitchOptionGroup: React.FC<SwitchOptionGroupProps> = ({ options }) => {
  return (
    <View className={styles.switchGroup}>
      {options.map(option => (
        <View key={option.key} className={styles.switchItem}>
          <View className={styles.switchLabel}>{option.label}</View>
          <Switch
            checked={option.checked}
            disabled={option.disabled ?? false}
            onChange={e => option.onChange(e.detail)}
          />
        </View>
      ))}
    </View>
  );
};

export default SwitchOptionGroup;
