/*
 * @Author: mjh
 * @Date: 2025-04-27 10:14:04
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-23 19:31:31
 * @Description:
 */
import React, { useMemo, useRef } from 'react';
import { getSystemInfoSync } from '@ray-js/ray';
import CircleWhiteColorPicker from './component';

import { IProps, defaultProps } from './props';

const system = getSystemInfoSync();
const { pixelRatio } = system;
const LampCirclePickerWhite = (props: IProps) => {
  const instanceId = useRef(
    `CirclePickerColor_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-2)}`
  );

  const colorPre = useRef(props.temperature);
  colorPre.current = props.temperature;

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
    const temp = e?.detail ?? 1000;
    if (temp === colorPre.current) {
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

  const textStyles = useMemo(() => {
    const style = props.textStyles || {};
    const staticStyle = {
      color: 'black',
      fontSize: '12px',
      fontWeight: 'normal',
    } as React.CSSProperties;
    return {
      ...staticStyle,
      ...style,
    };
  }, [props.textStyles]);

  const bubbleTextStyles = useMemo(() => {
    const style = props.bubbleTextStyles || {};
    const staticStyle = {
      color: 'black',
      fontSize: '14px',
      fontWeight: 'bold',
    } as React.CSSProperties;
    return {
      ...staticStyle,
      ...style,
    };
  }, [props.bubbleTextStyles]);

  return (
    <CircleWhiteColorPicker
      radius={props.radius}
      thumbRadius={props.thumbRadius}
      thumbBorderWidth={props.thumbBorderWidth}
      textStyles={textStyles}
      minRange={props.minRange || 0}
      pixelRatio={pixelRatio}
      bubbleTextStyles={bubbleTextStyles}
      percentValueMap={props.percentValueMap}
      showPercent={props.showPercent}
      useEventChannel={props.useEventChannel || false}
      eventChannelName={props.eventChannelName || 'lampCirclePickerWhiteEventChannel'}
      bindstart={onTouchStart}
      bindmove={onTouchMove}
      bindend={onTouchEnd}
      canvasId={instanceId.current}
      temperature={props.temperature}
    />
  );
};

LampCirclePickerWhite.defaultProps = defaultProps;

export default LampCirclePickerWhite;
