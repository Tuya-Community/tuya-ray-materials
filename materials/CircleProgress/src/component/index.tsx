/* eslint-disable prettier/prettier */
import React, { useCallback, useRef } from 'react';

import RectColorPicker from './rjs';
import { IProps } from './props';

export default function RectColor(props: IProps) {
  const preEndValue = useRef(-1);
  const onTouchStart = useCallback(e => {
    const { detail } = e;
    const temp = Math.floor(detail);
    preEndValue.current = -1;
    props.onTouchStart && props.onTouchStart(temp);
  }, []);

  const onTouchMove = useCallback(e => {
    const { detail } = e;
    const temp = Math.floor(detail);
    props.onTouchMove && props.onTouchMove(temp);
  }, []);

  const onTouchEnd = useCallback(e => {
    const { detail } = e;
    const temp = Math.floor(detail);
    if (temp === preEndValue.current) {
      return;
    }
    preEndValue.current = temp;
    props.onTouchEnd && props.onTouchEnd(temp);
  }, []);

  const defaultRadius = props.ringRadius - props.innerRingRadius; // 圆弧半径

  return (
    <RectColorPicker
      radius={props.ringRadius}
      innerRingRadius={props.innerRingRadius}
      value={props.value}
      compatibleMode={props.compatibleMode ?? false}
      startDegree={props.startDegree}
      endDegree={props.endDegree}
      offsetDegree={props.offsetDegree}
      canvasId={props.canvasId}
      disable={props.disable ?? false}
      disableThumbColor={props.disableThumbColor ?? 'rgba(0, 0, 0, 0.5)'}
      ringBorderColor={props.ringBorderColor}
      colorList={props.colorList}
      trackColor={props.trackColor || ''}
      thumbColor={props.thumbColor || ''}
      thumbRadius={props.thumbRadius ?? defaultRadius}
      touchCircleStrokeStyle={props.touchCircleStrokeStyle}
      thumbBorderWidth={props.thumbBorderWidth}
      thumbBorderColor={props.thumbBorderColor}
      thumbCanvasOffset={props.thumbOffset ?? 10}
      bindstart={onTouchStart}
      bindmove={onTouchMove}
      bindend={onTouchEnd}
    />
  );
}
