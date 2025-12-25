import { View } from '@ray-js/ray';
import React from 'react';
import { getArray } from '@/utils/kit';
import { hsv2rgbString } from '@ray-js/panel-sdk/lib/utils';
import { brightKelvin2rgba } from '@/utils/tempcolor';
import styles from './index.module.less';

export interface ColorsProps {
  colors: {
    h: number;
    s: number;
    v: number;
    id?: number;
    hue?: number;
    saturation?: number;
    value?: number;
    brightness?: number;
    temperature?: number;
  }[];
  itemWidth: number;
  itemBorderWidth: number;
  itemStyle?: React.CSSProperties;
}

export const Colors: React.FC<ColorsProps> = ({
  colors,
  itemWidth,
  itemBorderWidth,
  itemStyle,
}) => {
  return (
    <View className={styles.contain}>
      {getArray(colors).map((color, i) => {
        let background: string;
        if (
          typeof color?.h !== 'undefined' &&
          typeof color?.s !== 'undefined' &&
          typeof color?.v !== 'undefined'
        ) {
          background = hsv2rgbString(color.h, color.s / 10, color.v / 10);
        } else if (
          typeof color?.hue !== 'undefined' &&
          typeof color?.saturation !== 'undefined' &&
          typeof color?.value !== 'undefined' &&
          typeof color?.brightness !== 'undefined' &&
          typeof color?.temperature !== 'undefined'
        ) {
          if (color?.brightness === 0) {
            background = hsv2rgbString(color.hue, color.saturation / 10, color.value / 10);
          } else {
            background = brightKelvin2rgba(color.brightness, color.temperature);
          }
        }

        return (
          <View
            className={styles.item}
            key={i}
            style={{
              width: `${itemWidth}rpx`,
              height: `${itemWidth}rpx`,
            }}
          >
            <View
              className={styles.itemColor}
              style={{
                background,
                width: `${itemWidth * 2}rpx`,
                height: `${itemWidth * 2}rpx`,
                borderWidth: `${itemBorderWidth}rpx`,
                ...(itemStyle || {}),
              }}
            />
          </View>
        );
      })}
    </View>
  );
};
