import React from 'react';

import Strings from '@/i18n';
import { Switch, Text, View } from '@ray-js/ray';
import { splitArray } from '@/utils/kit';

import { RandomItem, defaultRandomColors } from './colors';
import styles from './index.module.less';
import { RandomColorItem } from './random-color-item';

export interface RandomColorsProps {
  enableRandom: boolean;
  onEnableRandomChange(val: boolean): void;
  current: RandomItem;
  setCurrent: (item: RandomItem) => void;
}

export const RandomColors: React.FC<RandomColorsProps> = ({
  enableRandom,
  onEnableRandomChange,
  current,
  setCurrent,
}) => {
  const list = splitArray(defaultRandomColors, 5);
  return (
    <View className={styles.contain}>
      <View className={styles.head}>
        <Text className={styles.title}>{Strings.getLang('randomColor')}</Text>
        <View className={styles.edit}>
          <Switch
            checked={enableRandom}
            onChange={e => {
              // @ts-ignore
              onEnableRandomChange(e.value);
            }}
          />
        </View>
      </View>
      {!enableRandom && (
        <View className={styles.list}>
          {list.map((colors, i) => (
            <View key={i} className={styles.row}>
              {colors.map((color, idx) => {
                const isActive = current?.id === color?.id;
                return (
                  <View
                    hoverClassName="button-hover"
                    onClick={() => {
                      setCurrent(color);
                    }}
                    key={color?.id}
                    className={styles.item}
                    style={{
                      marginLeft: idx === 0 ? 0 : '44rpx',
                      borderColor: isActive ? '#0D84FF' : 'transparent',
                    }}
                  >
                    <RandomColorItem
                      style={{
                        transform: isActive ? 'scale(0.8)' : 'scale(1)',
                        flexShrink: 0,
                      }}
                      item={color}
                    />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
