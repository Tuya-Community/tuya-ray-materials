import Strings from '@/i18n';
import { Input, Text, View } from '@ray-js/ray';
import React from 'react';
import styles from './index.module.less';

export interface InputNameCardProps {
  value: string;
  onChange: (val: string) => void;
  style?: React.CSSProperties;
}

export const InputNameCard: React.FC<InputNameCardProps> = ({ value, onChange, style }) => {
  return (
    <View className={styles.card} style={style}>
      <Text className={styles.cardTitle}>{Strings.getLang('name')}</Text>
      <View className={styles.inputWrap}>
        <Input value={value} className={styles.input} onInput={e => onChange(e.value)} />
      </View>
    </View>
  );
};
