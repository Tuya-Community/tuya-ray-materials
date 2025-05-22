import React, { useState } from 'react';
import { Image, View } from '@ray-js/ray';
import { LampColorSlider } from '@ray-js/components-ty-lamp';
import LampSaturationSlider from '@ray-js/lamp-saturation-slider';
import { colors } from '../../utils';
import styles from './index.module.less';

const thumbStyle = {
  width: '68rpx',
  height: '68rpx',
  borderRadius: '100%',
};

type Color = {
  hue: number;
  saturation: number;
  value: number;
};

type TColorParams = {
  colour: Color;
  setColour: (color: Color) => void;
  // eslint-disable-next-line react/require-default-props
  trackWidth?: number;
};

const ColorSelect = (props: TColorParams) => {
  const { colour, setColour, trackWidth = 518 } = props;
  const [selectIndex, setSelectIndex] = useState(0);
  const [show, setShow] = useState(true);

  const trackStyle = {
    width: `${trackWidth}rpx`,
    height: '52rpx',
  };

  const handleTouchEnd = (type: 'hue' | 'saturation' | 'value') => {
    return (v: number) => {
      const newColorData = { ...colour, [type]: v };
      setColour(newColorData);
      setShow(false);
    };
  };

  const handleClickColor = (item, index) => {
    const newColorData = { ...colour, ...item.hsv };
    setColour(newColorData);
    setSelectIndex(index);
    setShow(true);
  };

  return (
    <View className={styles.colorSelect}>
      <View className={styles.colorList}>
        {colors.map((item, index) => (
          <View
            className={styles.colorBox}
            key={item.color}
            onClick={() => handleClickColor(item, index)}
          >
            <View className={styles.color} style={{ background: item.color }} />
            {show && selectIndex === index && (
              <Image className={styles.icon} src="/images/gou.png" mode="aspectFill" />
            )}
          </View>
        ))}
      </View>
      <View className={styles.hueSlider}>
        <LampColorSlider
          trackStyle={trackStyle}
          thumbStyle={thumbStyle}
          value={colour?.hue ?? 1}
          onTouchEnd={handleTouchEnd('hue')}
        />
      </View>
      <View className={styles.saturationSlider}>
        <LampSaturationSlider
          trackStyle={trackStyle}
          thumbStyle={thumbStyle}
          hue={colour?.hue ?? 1}
          value={colour?.saturation ?? 1}
          max={100}
          onTouchEnd={handleTouchEnd('saturation')}
        />
      </View>
    </View>
  );
};

export default ColorSelect;
