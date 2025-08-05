/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View } from '@ray-js/components';
import Slider from '@ray-js/components-ty-slider/lib/SjsSlider';
import { toStyle } from '@ray-js/components-ty-slider';

import { hsvToRgb } from './utils';

import { defaultProps, IProps } from './props';

function LampSaturationSlider(props: IProps) {
  const {
    value: saturation,
    hue,
    trackStyle = {},
    thumbStyle = {},
    disable,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    enableTouch = true,
    max = 1000,
    useCustomThumbStyle,
    useCustomTrackStyle,
  } = props;

  const handleTouchStart = ({ detail }) => {
    if (!onTouchStart || disable) {
      return;
    }
    const value = Math.max(detail.end, 1);
    onTouchStart && onTouchStart(value);
  };
  const handTouchMove = ({ detail }) => {
    if (!onTouchMove || disable) {
      return;
    }
    onTouchMove && onTouchMove(detail.end);
  };
  const handTouchEnd = ({ detail }) => {
    if (!onTouchEnd || disable) {
      return;
    }
    onTouchEnd && onTouchEnd(detail.end);
  };

  const min = 0;
  const instanceId = useRef(
    `Color_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-10)}`
  );

  const { r, g, b } = useMemo(() => hsvToRgb(hue, 1000, 1000), [hue]);
  const bg = `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0.01) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)`;
  return (
    <View
      style={{
        position: 'relative',
        background: '#fff',
        width:
          typeof trackStyle?.width === 'number'
            ? trackStyle.width * 2
            : trackStyle.width ?? `${646}rpx`,
        height:
          typeof trackStyle?.height === 'number'
            ? trackStyle.height * 2
            : trackStyle.height ?? `${88}rpx`,
        borderRadius: `${28}rpx`,
      }}
    >
      <Slider
        instanceId={props.instanceId || instanceId.current}
        min={min}
        max={max}
        disable={disable}
        end={saturation}
        enableTouch={enableTouch}
        step={1}
        bindstart={handleTouchStart}
        bindmove={handTouchMove}
        bindend={handTouchEnd}
        trackStyle={toStyle({
          width: `${646}rpx`,
          height: `${88}rpx`,
          borderRadius: `${28}rpx`,
          ...trackStyle,
          background: useCustomTrackStyle ? trackStyle?.background : bg,
        })}
        barStyle={toStyle({
          background: 'transparent',
        })}
        thumbStyle={toStyle({
          width: '32rpx',
          height: '104rpx',
          border: `9rpx solid #fff`,
          borderRadius: '28rpx',
          background: `${disable ? '#000' : 'transparent'}`,
          ...thumbStyle,
        })}
        thumbStyleRenderFormatter={
          useCustomThumbStyle
            ? null
            : {
                background: `hsl(${props.hue}deg 100% value%)`,
              }
        }
        thumbStyleRenderValueScale={50 / max}
        thumbStyleRenderValueStart={50}
        thumbStyleRenderValueReverse
      />
    </View>
  );
}

LampSaturationSlider.defaultProps = defaultProps;

export default LampSaturationSlider;
