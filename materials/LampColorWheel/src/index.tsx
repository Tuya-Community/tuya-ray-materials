import React from 'react';
import { defaultProps, IProps } from './props';
import ColorWheel from './components';

function LampColorWheel(props: IProps) {
  const onTouchEnd = e => {
    const { detail } = e;
    props.onTouchEnd && props.onTouchEnd(detail);
  };
  return (
    <ColorWheel
      hsColor={props.hsColor || defaultProps.hsColor}
      hollowRadius={props.hollowRadius || defaultProps.hollowRadius}
      centerRingRadius={props.centerRingRadius ?? defaultProps.centerRingRadius}
      ringRadius={props.ringRadius || defaultProps.hollowRadius}
      bindonTouchEnd={onTouchEnd || defaultProps.onTouchEnd}
      paddingWidth={props.paddingWidth ?? defaultProps.paddingWidth}
      thumbBorderWidth={props.thumbBorderWidth || defaultProps.thumbBorderWidth}
      thumbBorderColor={props.thumbBorderColor || defaultProps.thumbBorderColor}
    />
  );
}

LampColorWheel.defaultProps = defaultProps;

export default LampColorWheel;
