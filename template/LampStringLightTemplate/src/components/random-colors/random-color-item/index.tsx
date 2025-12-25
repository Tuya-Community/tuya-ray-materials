import React from 'react';
import { View } from '@ray-js/ray';
import { getArray } from '@/utils/kit';
import { RandomItem } from '../colors';
import styles from './index.module.less';

export interface RandomColorItemProps {
  item: RandomItem;
  style?: React.CSSProperties;
}

export const RandomColorItem: React.FC<RandomColorItemProps> = ({ item, style }) => {
  return (
    <View className={styles.contain} style={style}>
      {getArray(item?.colors).map((item, i) => (
        <View
          className={styles.item}
          key={i}
          style={{
            background: `${item.hex}`,
          }}
        />
      ))}
    </View>
  );
};
