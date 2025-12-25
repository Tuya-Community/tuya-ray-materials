import React, { useEffect, useState } from 'react';

import Strings from '@/i18n';
import Slider from '@ray-js/components-ty-slider';
import { Text, View } from '@ray-js/ray';

import { getArray } from '@/utils/kit';
import { useScrollControl } from '@/hooks/useScrollControl';
import styles from './index.module.less';
import { BaseSlider } from '../base-slider';

export interface ColorSliderProps {
  hs: number[];
  onHSChange(hs: number[]): void;
  onBeforeChange?(hs: number[]): void;
  onAfterChange?(hs: number[]): void;
}

export const ColorSlider: React.FC<ColorSliderProps> = ({
  hs,
  onHSChange,
  onBeforeChange,
  onAfterChange,
}) => {
  const [hue, setHue] = useState(getArray(hs)[0]);
  const [sVal, setSVal] = useState(getArray(hs)[1]);

  useEffect(() => {
    setHue(getArray(hs)[0]);
    setSVal(getArray(hs)[1]);
  }, [...getArray(hs)]);

  return (
    <View className={styles.contain}>
      <View className={styles.labelWrap}>
        <Text className={styles.label}>{Strings.getLang('colour')}</Text>
      </View>
      <View className={styles.sliderWrap}>
        <BaseSlider
          onBeforeChange={() => onBeforeChange && onBeforeChange([hue, sVal])}
          thumbStyle={{
            border: '4px solid #fff',
            backgroundColor: '#C2C2C2',
            width: '68rpx',
            height: '68rpx',
          }}
          value={hue}
          onAfterChange={hue => {
            // 注意这里顺序不能调整，onAfterChange 会触发 onHSChange
            setHue(hue);
            onAfterChange && onAfterChange([hue, sVal]);
            onHSChange([hue, sVal]);
          }}
          maxTrackColor="linear-gradient(to left, rgba(255, 255, 255, 1) 3%, rgba(255, 255, 255, 0) 100%)"
          minTrackColor="transparent"
          maxTrackHeight="32rpx"
          minTrackHeight="32rpx"
          maxTrackRadius="16rpx"
          minTrackRadius="16rpx"
          min={0}
          max={360}
          moveEventName="ColorSliderMove"
          trackStyle={{
            background:
              'linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), linear-gradient(90.01deg, rgb(255, 0, 0) 0.01%, rgb(248, 203, 14) 12.14%, rgb(128, 254, 6) 21.83%, rgb(8, 251, 43) 32.75%, rgb(4, 250, 252) 46.38%, rgb(2, 67, 252) 58.38%, rgb(135, 0, 249) 70.04%, rgb(252, 0, 239) 80.06%, rgb(240, 10, 91) 89.92%, rgb(255, 0, 0) 99.99%)',
          }}
          barStyle={{
            background: 'transparent',
          }}
          thumbStyleRenderFormatter={{
            background: `hsl(valuedeg 100% 50%)`,
          }}
        />
        <BaseSlider
          value={sVal}
          onBeforeChange={() => {
            onBeforeChange && onBeforeChange([hue, sVal]);
          }}
          onAfterChange={sVal => {
            // 注意这里顺序不能调整，onAfterChange 会触发 onHSChange
            setSVal(sVal);
            onAfterChange && onAfterChange([hue, sVal]);
            onHSChange([hue, sVal]);
          }}
          min={0}
          max={1000}
          thumbStyleRenderValueScale={0.05}
          thumbStyleRenderValueStart={50}
          maxTrackHeight="32rpx"
          minTrackHeight="32rpx"
          maxTrackRadius="16rpx"
          minTrackRadius="16rpx"
          thumbStyleRenderFormatter={{
            background: `hsl(${hue}deg 100% value%)`,
          }}
          thumbStyle={{
            border: '4px solid #fff',
            width: '68rpx',
            height: '68rpx',
          }}
          thumbStyleRenderValueReverse
          trackStyle={{
            background: `linear-gradient(to right, #ffffff 0%, hsl(${hue}deg 100% 50%) 100%)`,
          }}
          style={{ marginTop: 30 }}
          barStyle={{
            background: 'transparent',
          }}
        />
      </View>
    </View>
  );
};
