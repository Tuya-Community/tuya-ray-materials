/* eslint-disable no-restricted-syntax */
import clsx from 'clsx';
import React, { useRef } from 'react';

import { View } from '@ray-js/ray';
import { string } from 'to-style';

import { defaultProps, IProps } from './props';
import Slider from './slider';

export const toStyle = obj => {
  if (typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      if (obj[key]) {
        result[key] = obj[key];
      }
    }
    return string(result);
  }
  return obj;
};

const classPrefix = 'rayui-touch-slider';

const TouchSlider: React.FC<IProps> = props => {
  const {
    className,
    style,
    barStyle,
    trackStyle,
    hotAreaStyle,
    value,
    onChange,
    onTouchEnd,
    showButtons = false,
    step = 1,
    max = 100,
    min = 0,
    showIcon = true,
    showText = true,
    instanceId: _instanceId,
    bgTextStyle,
    textWrapStyle,
    ...otherProps
  } = props;
  const instanceId = useRef(
    _instanceId ||
      `PercentSlider_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-2)}`
  );
  return (
    <View className={clsx(classPrefix, className)} style={style}>
      <Slider
        hideThumbButton
        instanceId={instanceId.current}
        showText={showText}
        bind:onChange={event => onChange && onChange(event?.detail?.end)}
        bind:onEnd={event => onTouchEnd && onTouchEnd(event?.detail?.end)}
        end={value}
        thumbStyle="width:0.01px"
        showButtons={showButtons}
        step={step}
        max={max}
        valueMin={min}
        showIcon={showIcon}
        trackStyle={toStyle(trackStyle)}
        barStyle={toStyle(barStyle)}
        hotAreaStyle={toStyle(hotAreaStyle)}
        startEventName={props.startEventName}
        moveEventName={props.moveEventName}
        endEventName={props.endEventName}
        bgTextColor={props.bgTextColor || props.textColor}
        bgTextStyle={toStyle(bgTextStyle)}
        textWrapStyle={toStyle(textWrapStyle)}
        {...otherProps}
      />
    </View>
  );
};

TouchSlider.defaultProps = defaultProps;

export default TouchSlider;
