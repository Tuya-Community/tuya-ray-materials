/* eslint-disable prettier/prettier */
import React from 'react';

import RectColorPicker from './rjs';
import { IProps } from './props';
import { useStdPx2Adapt } from '../hooks';

export default function RectColor(props: IProps) {
  const radius = useStdPx2Adapt(props.radius);
  const innerRingRadius = useStdPx2Adapt(props.innerRingRadius);
  const touchCircleLineWidth = useStdPx2Adapt(props.touchCircleLineWidth);

  const onTouchStart = e => {
    const { detail } = e;
    const temp = Math.floor(detail);
    props.onTouchStart && props.onTouchStart(temp);
  };
  const onTouchMove = e => {
    const { detail } = e;
    const temp = Math.floor(detail);
    props.onTouchMove && props.onTouchMove(temp);
  };
  const onTouchEnd = e => {
    const { detail } = e;
    const temp = Math.floor(detail);
    props.onTouchEnd && props.onTouchEnd(temp);
  };
  return (
    <RectColorPicker
      radius={radius}
      innerRingRadius={innerRingRadius}
      value={props.value}
      hideThumb={props.hideThumb ?? false}
      canvasId={props.canvasId}
      colorList={props.colorList ?? []}
      useEventChannel={props.useEventChannel}
      lineCap={props.lineCap || 'round'}
      eventChannelName={props.eventChannelName}
      touchCircleStrokeStyle={props.touchCircleStrokeStyle}
      touchCircleLineWidth={touchCircleLineWidth}
      bindstart={onTouchStart}
      bindmove={onTouchMove}
      bindend={onTouchEnd}
    />
  );
}
