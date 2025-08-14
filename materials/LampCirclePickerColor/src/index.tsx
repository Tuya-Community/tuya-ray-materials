/*
 * @Author: mjh
 * @Date: 2025-05-30 10:00:40
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-23 17:31:16
 * @Description:
 */
import React, { useRef } from 'react';
import CircleColorPicker from './component';

import { IProps, defaultProps } from './props';

const LampCirclePickerColor = (props: IProps) => {
  const instanceId = useRef(
    `CirclePickerColor_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-2)}`
  );
  const colorPre = useRef({
    h: 0,
    s: 1000,
  });
  const onTouchStart = e => {
    if (!props.onTouchStart) {
      return;
    }
    props.onTouchStart && props.onTouchStart(e?.detail);
    colorPre.current = e?.detail;
  };
  const onTouchMove = e => {
    if (!props.onTouchMove) {
      return;
    }
    const { h, s } = e?.detail || {
      h: 0,
      s: 1000,
    };
    const { h: preH, s: preS } = colorPre.current;
    if (preH === h && preS === s) {
      return;
    }
    props.onTouchMove && props.onTouchMove(e?.detail);
    colorPre.current = e?.detail;
  };
  const onTouchEnd = e => {
    if (!props.onTouchEnd) {
      return;
    }
    props.onTouchEnd && props.onTouchEnd(e?.detail);
    colorPre.current = e?.detail;
  };
  return (
    <CircleColorPicker
      instanceId={instanceId.current}
      radius={props.radius}
      thumbRadius={props.thumbRadius}
      hs={{
        h: props.hs.h,
        s: props.hs.s,
      }}
      minRange={props.minRange || 0}
      whiteRange={props.whiteRange}
      useEventChannel={props.useEventChannel || false}
      eventChannelName={props.eventChannelName || 'lampCirclePickerColorEventChannel'}
      bindstart={onTouchStart}
      bindmove={onTouchMove}
      bindend={onTouchEnd}
      thumbBorderWidth={props.thumbBorderWidth}
      thumbShadowBlur={props.thumbShadowBlur ?? 10}
      thumbShadowColor={props.thumbShadowColor ?? 'rgba(0, 0, 0, .16)'}
    />
  );
};

LampCirclePickerColor.defaultProps = defaultProps;

export default LampCirclePickerColor;
