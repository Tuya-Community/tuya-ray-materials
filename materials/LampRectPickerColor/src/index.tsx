/*
 * @Author: mjh
 * @Date: 2024-08-28 14:43:38
 * @LastEditors: mjh
 * @LastEditTime: 2024-09-12 15:40:33
 * @Description:
 */
import React, { useRef } from 'react';
import RectColorPicker from './component/index.js';

import { IProps } from './props';

const defaultProps = {
  rectWidth: 300,
  rectHeight: 200,
  thumbRadius: 12,
  borderRadius: 0,
  colorTipStyle: '',
  closeHiddenThumb: false,
  closed: false,
};

const getCanvasId = () =>
  `rect_${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`;

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

  const canvasId = useRef(getCanvasId());

  return (
    <RectColorPicker
      canvasId={canvasId.current}
      rectWidth={props.rectWidth}
      rectHeight={props.rectHeight}
      thumbRadius={props.thumbRadius}
      borderRadius={props.borderRadius}
      closeHiddenThumb={props.closeHiddenThumb}
      borderRadiusStyle={props.borderRadiusStyle}
      colorTipStyle={props.colorTipStyle || ''}
      closed={props.closed}
      hs={props.hs}
      useEventChannel={props?.useEventChannel || false}
      eventChannelName={props?.eventChannelName}
      isShowColorTip={props.isShowColorTip}
      bindstart={onTouchStart}
      bindmove={onTouchMove}
      bindend={onTouchEnd}
      brightValue={props.brightValue}
      borderStyleStr={props.borderStyleStr}
    />
  );
};

RectColor.defaultProps = defaultProps;

export default RectColor;
