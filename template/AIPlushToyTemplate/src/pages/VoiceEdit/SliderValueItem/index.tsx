/* eslint-disable import/no-cycle */
import React, { FC, useState } from 'react';
import PercentSlider from '@ray-js/lamp-percent-slider';
import { Text, View } from '@ray-js/ray';
import { themeColor } from '@/constant';
import styles from './index.module.less';

type Props = {
  defaultValue: number;
  title?: string;
  onValueChange?: (value: number) => void;
};

const max = 100;
const min = 1;

const SliderValueItem: FC<Props> = ({ defaultValue = 50, title = '', onValueChange }) => {
  const [sliderValue, setSliderValue] = useState(defaultValue);

  const onChange = (num: number) => {
    onValueChange && onValueChange(num);
    setSliderValue(num);
  };

  return (
    <View className={styles.container}>
      <View className={styles.textBox}>
        <Text className={styles.title}>{title}</Text>
        <Text className={styles.value}>{` ${sliderValue}%`}</Text>
      </View>
      <PercentSlider
        style={{ width: '556rpx' }}
        value={sliderValue}
        onTouchEnd={onChange}
        min={min}
        max={max}
        showIcon={false}
        showText={false}
        instanceId={title}
        trackStyle={{
          width: '556rpx',
          height: '16rpx',
          borderRadius: '8rpx',
          backgroundColor: 'rgba(43, 139, 247, 0.2)',
        }}
        barStyle={{
          width: '556rpx',
          height: '16rpx',
          borderRadius: '8rpx',
          backgroundColor: themeColor,
        }}
      />
    </View>
  );
};

export default SliderValueItem;
