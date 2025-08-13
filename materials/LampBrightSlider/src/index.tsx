/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { View } from '@ray-js/components';

import Slider from '@ray-js/components-ty-slider/lib/SjsSlider';
import { toStyle } from '@ray-js/components-ty-slider';
import { defaultProps, IProps } from './props';

function LampBrightSlider(props: IProps) {
  const {
    min = 10,
    max = 1000,
    value: bright,
    trackStyle = {},
    thumbStyle = {},
    disable,
    enableTouch = true,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    useCustomThumbStyle,
    useCustomTrackStyle,
    startEventName,
    moveEventName,
    endEventName,
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
  const instanceId = useRef(
    `Color_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-10)}`
  );

  const bg = `linear-gradient(to left,  rgba(255, 255, 255, 1) 3.7%, rgba(0, 0, 0, 1) 113%)`;
  return (
    <View style={{ position: 'relative' }}>
      <Slider
        instanceId={props.instanceId || instanceId.current}
        min={min}
        max={max}
        disable={disable}
        end={bright}
        enableTouch={enableTouch}
        step={1}
        bindstart={handleTouchStart}
        bindmove={handTouchMove}
        bindend={handTouchEnd}
        trackStyle={toStyle({
          width: `${646}rpx`,
          height: `${88}rpx`,
          borderRadius: `${28}rpx`,
          boxShadow: `-1px -1px 1px rgba(0, 0, 0, 0.1), 1px 1px 1px rgba(0, 0, 0, 0.1)`,
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
        thumbStyleRenderValueScale={0.1}
        thumbStyleRenderFormatter={
          useCustomThumbStyle
            ? null
            : {
                background: 'hsl(0deg 0% value%)',
              }
        }
        moveEventName={moveEventName}
        startEventName={startEventName}
        endEventName={endEventName}
      />
    </View>
  );
}

LampBrightSlider.defaultProps = defaultProps;

export default LampBrightSlider;
