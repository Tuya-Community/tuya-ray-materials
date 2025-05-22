/* eslint-disable import/no-cycle */
import React, { FC, useState, useEffect } from 'react';
import { Text, View } from '@ray-js/ray';

import { useDispatch } from 'react-redux';
// import PercentSlider from '@ray-js/lamp-percent-slider';
import { Slider } from '@ray-js/smart-ui';
import { getTheme } from '@/utils';
import PerfText from '@ray-js/components-ty-perf-text';
import styles from './index.module.less';

type Props = {
  defaultValue: number;
  title?: string;
  onValueChange?: (value: number) => void;
  instanceId?: string;
};

const max = 100;
const min = 1;

const SliderValueItem: FC<Props> = ({
  defaultValue = 50,
  title = '',
  onValueChange,
  instanceId = '',
}) => {
  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(defaultValue);
  const [themeColor, setThemeColor] = useState(getTheme());

  useEffect(() => {
    setSliderValue(defaultValue);
  }, [defaultValue]);

  const onChange = (num: number) => {
    onValueChange && onValueChange(num);
    setSliderValue(num);
  };

  return (
    <View className={styles.container}>
      <View className={styles.textBox}>
        <Text className={styles.title}>{title}</Text>
        {/* <Text className={styles.value} style={{ color: themeColor }}>{` ${sliderValue}%`}</Text> */}
        <PerfText
          className={styles.value}
          eventName="sliderMove"
          style={{
            color: themeColor,
          }}
        />
        <Text
          className={styles.value}
          style={{
            color: themeColor,
          }}
        >
          %
        </Text>
      </View>
      <Slider
        style={{ width: '556rpx' }}
        maxTrackHeight="8px"
        minTrackHeight="8px"
        thumbHeight="28px"
        thumbWidth="28px"
        min={min}
        max={max}
        value={sliderValue}
        minTrackColor={themeColor}
        // onChange={debouncedSetVolume}
        onAfterChange={onChange}
        moveEventName="sliderMove"
      />
    </View>
  );
};

export default SliderValueItem;
