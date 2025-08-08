/* eslint-disable no-restricted-syntax */
import clsx from 'clsx';
import React, { useRef } from 'react';

import { View } from '@ray-js/ray';
import { string as toStyleString } from 'to-style';

import { IProps } from './props';
import Slider from './slider';

/**
 * TODO: 发布前，请务必修改类名前缀和组件名
 */
const classPrefix = 'rayui-vertical-touch-slider';

export const toStyle = obj => {
  const result = {};
  for (const key in obj) {
    if (obj[key]) {
      result[key] = obj[key];
    }
  }
  return toStyleString(result);
};

const VerticalTouchSlider: React.FC<IProps> = props => {
  const {
    className,
    style,
    value,
    onChange,
    onTouchEnd,
    step = 1,
    max = 100,
    min = 0,
    showIcon = true,
    showText = true,
    instanceId: _instanceId,
    thumbImage,
    thumbBorderRadius = '0px',
    thumbHeight = 'auto',
    thumbWidth = 'auto',
    barStyle,
    trackStyle,
    thumbStyle,
    showThumb,
    ...otherProps
  } = props;
  const instanceId = useRef(
    _instanceId ||
      `PercentSlider_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-2)}`
  );
  return (
    <View className={clsx(classPrefix, className)} style={style}>
      <Slider
        instanceId={instanceId.current}
        enableTouchBar
        hideThumb
        showText={showText}
        bind:onChange={event => onChange && onChange(event?.detail?.end)}
        bind:onEnd={event => onTouchEnd && onTouchEnd(event?.detail?.end)}
        end={value}
        step={step}
        reverse
        direction="vertical"
        max={max}
        valueMin={min}
        showIcon={showIcon}
        thumbImage={thumbImage}
        thumbBorderRadius={thumbBorderRadius}
        thumbWidth={thumbWidth}
        thumbHeight={thumbHeight}
        barStyle={toStyleString(barStyle)}
        trackStyle={toStyleString(trackStyle)}
        thumbEndStyle={toStyle(thumbStyle)}
        showThumb={showThumb}
        {...otherProps}
      />
    </View>
  );
};

export default VerticalTouchSlider;
