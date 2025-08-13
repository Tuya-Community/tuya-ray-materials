import React, { useRef } from 'react';
import RectColorPicker from './component/index.js';

import { IProps } from './props';

const defaultProps = {
  rectWidth: 300,
  rectHeight: 200,
  thumbRadius: 12,
  borderRadius: 0,
  colorTipStyle: '',
  closed: false,
};

const RectColor = (props: IProps) => {
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
    const temp = e?.detail ?? 1000;
    const preH = colorPre.current;
    if (preH === temp) {
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
    <RectColorPicker
      canvasId={props.canvasId}
      rectWidth={props.rectWidth}
      rectHeight={props.rectHeight}
      thumbRadius={props.thumbRadius}
      borderRadius={props.borderRadius}
      borderRadiusStyle={props.borderRadiusStyle || ''}
      colorTipStyle={props.colorTipStyle || ''}
      closed={props.closed}
      temp={props.temp}
      useEventChannel={props.useEventChannel || false}
      eventChannelName={props.eventChannelName}
      isShowTip={props.isShowTip || false}
      bindstart={onTouchStart}
      bindmove={onTouchMove}
      bindend={onTouchEnd}
      brightValue={props.brightValue}
    />
  );
};

RectColor.defaultProps = defaultProps;

export default RectColor;
