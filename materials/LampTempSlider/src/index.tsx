/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { View } from '@ray-js/components';

import Slider from '@ray-js/components-ty-slider/lib/SjsSlider';
import { toStyle } from '@ray-js/components-ty-slider';
import { defaultProps, IProps } from './props';

function LampTempSlider(props: IProps) {
  const preSaturation = useRef(-1);
  const lastSaturation = useRef(null);
  const timer = useRef(null);
  const timer1 = useRef(null);
  const {
    value: temp,
    trackStyle = {},
    thumbStyle = {},
    disable,
    onTouchStart,
    onTouchMove,
    enableTouch = true,
    onTouchEnd,
    reverse,
  } = props;

  const startRefVal = useRef(-1);
  const handleTouchStart = ({ detail }) => {
    if (!onTouchStart || disable) {
      return;
    }
    if (detail.end === startRefVal.current) {
      return;
    }
    onTouchStart && onTouchStart(detail.end);
    startRefVal.current = detail.end;
  };
  const isMoving = useRef(false);
  const handTouchMove = ({ detail }) => {
    if (!onTouchMove || disable) {
      return;
    }
    lastSaturation.current = detail.end;
    if (detail.end === preSaturation.current) {
      return;
    }
    if (timer.current) {
      return;
    }

    const touchMoveDelay = 50; // 移动更新的频率
    const touchMoveEndDelay = 200; // 移动结束后多久进行更新

    timer.current = setTimeout(() => {
      onTouchMove && onTouchMove(detail.end);
      preSaturation.current = detail.end;
      clearTimeout(timer.current);
      timer.current = null;

      clearTimeout(timer1.current);
      timer1.current = null;
      timer1.current = setTimeout(() => {
        if (lastSaturation.current !== preSaturation.current) {
          onTouchMove && onTouchMove(lastSaturation.current);
        }
      }, touchMoveEndDelay);
    }, touchMoveDelay);
  };
  const endRefVal = useRef(-1);
  const handTouchEnd = ({ detail }) => {
    isMoving.current = false;
    if (!onTouchEnd || disable) {
      return;
    }
    if (detail.end === endRefVal.current) {
      return;
    }
    onTouchEnd && onTouchEnd(detail.end);
    endRefVal.current = detail.end;
  };
  const min = 0;
  const max = 1000;
  const instanceId = useRef(
    `Color_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-10)}`
  );
  const [controllerSaturation, setControllerSaturation] = useState(-1);

  useEffect(() => {
    if (preSaturation.current !== temp) {
      setControllerSaturation(temp);
    }
  }, [temp]);

  let bg = `linear-gradient(to left, #FBCA5C 0%, #FFFFFF 50%, #CEECFE 100%)`;
  if (reverse) {
    bg = `linear-gradient(to left, #CEECFE 0%, #FFFFFF 50%, #FBCA5C 100%)`;
  }
  const isInvalid =
    controllerSaturation === -1 ||
    controllerSaturation === null ||
    controllerSaturation === undefined;
  return (
    <View style={{ position: 'relative' }}>
      <Slider
        instanceId={props.instanceId || instanceId.current}
        min={min}
        max={max}
        // hideThumb={isInvalid}
        disable={disable}
        end={reverse ? max + min - controllerSaturation : controllerSaturation}
        step={1}
        hidden={props.hidden}
        bindstart={event => {
          if (reverse) {
            const reversedValue = max + min - event.detail.value;
            event.detail.value = reversedValue;
            event.detail.end = reversedValue;
          }
          handleTouchStart(event);
        }}
        bindmove={event => {
          if (reverse) {
            const reversedValue = max + min - event.detail.value;
            event.detail.value = reversedValue;
            event.detail.end = reversedValue;
          }
          handTouchMove(event);
        }}
        bindend={event => {
          if (reverse) {
            const reversedValue = max + min - event.detail.value;
            event.detail.value = reversedValue;
            event.detail.end = reversedValue;
          }
          handTouchEnd(event);
        }}
        inferThumbBgColorFromTrackBgColor
        enableTouch={enableTouch}
        trackStyle={toStyle({
          width: `${646}rpx`,
          height: `${88}rpx`,
          borderRadius: `${28}rpx`,
          boxShadow: `-1px -1px 1px rgba(0, 0, 0, 0.1), 1px 1px 1px rgba(0, 0, 0, 0.1)`,
          background: bg,
          ...trackStyle,
        })}
        // @ts-ignore
        trackBgColor={bg}
        barStyle={toStyle({
          background: 'transparent',
        })}
        thumbStyle={toStyle({
          width: '32rpx',
          height: '104rpx',
          border: `9rpx solid #fff`,
          borderRadius: '28rpx',
          backgroundColor: '#C2C2C2',
          ...thumbStyle,
        })}
      />
    </View>
  );
}

LampTempSlider.defaultProps = defaultProps;

export default LampTempSlider;
