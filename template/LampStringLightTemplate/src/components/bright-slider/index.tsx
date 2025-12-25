import React from 'react';
import PerfText from '@ray-js/components-ty-perf-text';
import { Text, View } from '@ray-js/ray';
import Strings from '@/i18n';
import styles from './index.module.less';
import { BaseSlider } from '../base-slider';

export interface BrightSliderProps {
  eventName: string;
  value: number;
  min?: number;
  max?: number;
  onAfterChange?(value: number): void;
  onBeforeChange?(value: number): void;
  valueScale?: number;
}

export const BrightSlider: React.FC<BrightSliderProps> = ({
  eventName = 'brightSliderMove',
  value,
  onAfterChange,
  onBeforeChange,
  min = 10,
  max = 1000,
  valueScale,
}) => {
  return (
    <View className={styles.contain}>
      <View className={styles.labelWrap}>
        <Text className={styles.label}>{Strings.getLang('birght')}</Text>
        <Text className={styles.valueDot}>·</Text>
        <PerfText
          defaultValue={value}
          valueScale={valueScale}
          className={styles.value}
          eventName={eventName}
        />
        <Text className={styles.valueUnit}>%</Text>
      </View>
      <View className={styles.sliderWrap}>
        <BaseSlider
          min={min}
          max={max}
          value={value}
          onBeforeChange={value => {
            onBeforeChange && onBeforeChange(value);
          }}
          onAfterChange={value => {
            onAfterChange && onAfterChange(value);
          }}
          moveEventName={eventName}
          thumbStyle={{
            border: '4px solid #fff',
            backgroundColor: '#C2C2C2',
            width: '68rpx',
            height: '68rpx',
          }}
          inferThumbBgColorFromTrackBgColor
          maxTrackColor="linear-gradient(to left, #ffffff 0%, #313131 100%)"
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
