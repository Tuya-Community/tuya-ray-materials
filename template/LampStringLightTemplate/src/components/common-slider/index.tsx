import classnames from 'classnames';
import React from 'react';

import PerfText from '@ray-js/components-ty-perf-text';
import { Text, View } from '@ray-js/ray';

import { BaseSlider } from '../base-slider';
import styles from './index.module.less';

export interface CommonSliderProps {
  eventName: string;
  title: string;
  titleClassName?: string;
  value?: number;
  onAfterChange?(value: number): void;
  onBeforeChange?(value: number): void;
  min?: number;
  max?: number;
  maxTrackColor?: string;
}

export const CommonSlider: React.FC<CommonSliderProps> = ({
  eventName = 'CommonSliderMove',
  title,
  titleClassName,
  min,
  max,
  onAfterChange,
  onBeforeChange,
  value,
  maxTrackColor = '#303030',
}) => {
  return (
    <View className={styles.contain}>
      <View className={styles.labelWrap}>
        <Text className={classnames(styles.label, titleClassName)}>{title}</Text>
        <Text className={styles.valueDot}>·</Text>
        <PerfText defaultValue={value} className={styles.value} eventName={eventName} />
        <Text className={styles.valueUnit}>%</Text>
      </View>
      <View className={styles.sliderWrap}>
        <BaseSlider
          min={min}
          max={max}
          value={value}
          onAfterChange={onAfterChange}
          onBeforeChange={onBeforeChange}
          moveEventName={eventName}
          thumbStyle={{
            width: '52rpx',
            height: '52rpx',
          }}
          maxTrackHeight="24rpx"
          minTrackHeight="24rpx"
          maxTrackColor={maxTrackColor}
          maxTrackRadius="32rpx"
          minTrackRadius="32rpx"
        />
      </View>
    </View>
  );
};
