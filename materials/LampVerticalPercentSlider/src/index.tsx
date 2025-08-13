import clsx from 'clsx';
import React, { useRef } from 'react';

import { View } from '@ray-js/ray';
import { string as toStyleString } from 'to-style';

import { IProps } from './props';
import Slider from './slider';

const classPrefix = 'rayui-verticalpercent-slider';

function VerticalPercentSlider(props: IProps) {
  const {
    className,
    value,
    onChange,
    style,
    onTouchEnd,
    onTouchStart,
    iconColor = 'rgba(0,0,0,0.9)',
    textColor = 'rgba(0,0,0,0.9)',
    thumbColor = '#fff',
    trackColor = 'rgba(0, 0, 0, 0.1)',
    thumbShadow = 'rgb(0 0 0 / 12%) 0px 0.5px 4px, rgb(0 0 0 / 12%) 0px 6px 13px',
    showIcon = true,
    showText = true,
    max = 100,
    min = 0,
    instanceId: _instanceId,
    width,
    height,
    barWidth = width,
    barColor = '#fff',
    trackStyle,
    barStyle,
    disabled,
  } = props;
  const instanceId = useRef(
    _instanceId ||
      `VerticalPercentSlider_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-2)}`
  );

  return (
    <View className={clsx(classPrefix, className)} style={style}>
      <Slider
        disable={disabled}
        instanceId={instanceId.current}
        bind:onChange={event => onChange && onChange(event?.detail?.end)}
        bind:onEnd={event => onTouchEnd && onTouchEnd(event?.detail?.end)}
        bind:onStart={event => onTouchStart && onTouchStart(event?.detail?.end)}
        end={value}
        max={max}
        iconColor={iconColor}
        textColor={textColor}
        trackStyle={toStyleString({
          width,
          height,
          background: trackColor,
          ...(trackStyle || {}),
        })}
        barStyle={toStyleString({
          width: barWidth,
          height,
          background: barColor,
          ...(barStyle || {}),
        })}
        thumbStyle={{
          backgroundColor: thumbColor,
          boxShadow: thumbShadow,
        }}
        reverse
        showIcon={showIcon}
        direction="vertical"
        showText={showText}
        min={min}
      />
    </View>
  );
}

export default VerticalPercentSlider;
