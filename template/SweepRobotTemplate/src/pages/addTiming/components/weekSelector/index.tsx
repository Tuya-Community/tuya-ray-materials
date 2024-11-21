import { View, Text } from '@ray-js/ray';
import React from 'react';
import styles from './index.module.less';
import { WeekSelectorProps } from './props';

export default function WeekSelector(props: WeekSelectorProps) {
  const { value, texts, onChange } = props;

  const handleSelect = index => {
    const newValue = [...value];
    newValue[index] = newValue[index] === 1 ? 0 : 1;
    onChange && onChange(newValue);
  };

  return (
    <View className={styles.week}>
      {value.map((item, index) => {
        const isActive = item === 1;
        return (
          <View
            key={index}
            className={isActive ? styles.activeWeekItem : styles.weekItem}
            onClick={() => handleSelect(index)}
          >
            <Text className={isActive ? styles.activeWeekItemText : styles.weekItemText}>
              {texts[index]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
