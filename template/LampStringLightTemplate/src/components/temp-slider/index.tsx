import React from 'react';
import { Text, View } from '@ray-js/ray';
import Strings from '@/i18n';
import styles from './index.module.less';
import { BaseSlider } from '../base-slider';

export interface TempSliderProps {
  eventName: string;
  value: number;
  min?: number;
  max?: number;
  onAfterChange?(value: number): void;
  onBeforeChange?(value: number): void;
}

export const TempSlider: React.FC<TempSliderProps> = ({
  eventName = 'TempSliderMove',
  value,
  onAfterChange,
  onBeforeChange,
  min = 1,
  max = 1000,
}) => {
  return (
    <View className={styles.contain}>
      <View className={styles.labelWrap}>
        <Text className={styles.label}>{Strings.getLang('temp')}</Text>
      </View>
      <View className={styles.sliderWrap}>
        <BaseSlider
          value={value}
          min={min}
          max={max}
          onBeforeChange={onBeforeChange}
          onAfterChange={onAfterChange}
          moveEventName={eventName}
          thumbStyle={{
            border: '4px solid #fff',
            backgroundColor: '#C2C2C2',
            width: '68rpx',
            height: '68rpx',
          }}
          thumbWrapStyle={{
            borderRadius: '50%',
          }}
          inferThumbBgColorFromTrackBgColor
          maxTrackColor="linear-gradient(to left, #CEECFE 0%, #FFFFFF 50%, #FBCA5C 100%)"
          minTrackColor="transparent"
          maxTrackHeight="32rpx"
          minTrackHeight="32rpx"
          maxTrackRadius="32rpx"
          minTrackRadius="32rpx"
        />
      </View>
    </View>
  );
};
