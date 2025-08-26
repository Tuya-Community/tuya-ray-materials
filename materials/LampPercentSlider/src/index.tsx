import clsx from 'clsx';
import React, { useRef } from 'react';

import { View } from '@ray-js/ray';
import { string as toStyleString } from 'to-style';

import { IProps } from './props';
import Slider from './slider';

const classPrefix = 'rayui-lamp-percent-slider';

const PercentSlider: React.FC<IProps> = props => {
  const {
    className,
    value,
    onChange,
    style,
    onTouchEnd,
    textColor = 'rgba(0,0,0,0.9)',
    showIcon = true,
    showText = true,
    max = 100,
    min = 0,
    barStyle,
    thumbStyle,
    instanceId: _instanceId,
    trackStyle,
    enableTouch = true,
  } = props;
  const instanceId = useRef(
    _instanceId ||
      `PercentSlider_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-2)}`
  );
  return (
    <View className={clsx(classPrefix, className)} style={style}>
      <Slider
        instanceId={instanceId.current}
        bind:onChange={event => onChange && onChange(event?.detail?.end)}
        bind:onEnd={event => onTouchEnd && onTouchEnd(event?.detail?.end)}
        end={value}
        disable={props.disabled}
        max={max}
        hidden={props.hidden}
        showText={showText}
        showIcon={showIcon}
        enableTouch={enableTouch}
        textColor={textColor}
        trackStyle={toStyleString(trackStyle)}
        barStyle={toStyleString(barStyle)}
        min={min}
        thumbStyle={toStyleString(thumbStyle)}
      />
    </View>
  );
};

export default PercentSlider;
