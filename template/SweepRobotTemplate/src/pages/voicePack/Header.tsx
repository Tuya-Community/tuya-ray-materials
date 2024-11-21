import React, { FC, useMemo, useState } from 'react';
import { Text, View } from '@ray-js/ray';
import Strings from '@/i18n';
import { volumeSetCode } from '@/constant/dpCodes';
import { Slider } from '@ray-js/smart-ui';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { devices } from '@/devices';
import { useThrottleFn } from 'ahooks';

import { THEME_COLOR } from '@/constant';
import styles from './index.module.less';

const Header: FC = () => {
  const actions = useActions();
  const dpVolumnSet = useProps(props => props[volumeSetCode]);
  const [sliderValue, setSliderValue] = useState(dpVolumnSet);

  const {
    property: { min, max, step },
  } = useMemo(() => devices.common.getDpSchema()[volumeSetCode], []);

  const handleChange = useThrottleFn(
    (value: number) => {
      setSliderValue(value);
    },
    { wait: 100 }
  ).run;

  const handleAfterChange = () => {
    actions[volumeSetCode].set(sliderValue, { debounce: 400 });
  };

  return (
    <View className={styles.header}>
      <Text className={styles.title}>{Strings.getDpLang(volumeSetCode)}</Text>

      <Slider
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        minTrackRadius="16rpx"
        maxTrackHeight="16rpx"
        minTrackHeight="16rpx"
        minTrackColor={THEME_COLOR}
        onChange={handleChange}
        onAfterChange={handleAfterChange}
      />
    </View>
  );
};

export default Header;
