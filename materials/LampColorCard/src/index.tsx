import React, { useMemo } from 'react';
import ColorCard from './components';
import { defaultProps, IProps } from './props';

function LampColorCard(props: IProps) {
  const onTouchEnd = e => {
    const { detail } = e;
    props.onTouchEnd && props.onTouchEnd(detail);
  };

  const rectStyleStr = useMemo(() => {
    if (typeof props.rectStyle === 'string') {
      return props.rectStyle;
    }
    // 需要转换为 css 字符串
    const styleStr = Object.keys(props.rectStyle || defaultProps.rectStyle)
      .map(key => `${key}:${props.rectStyle[key]}`)
      .join(';');
    return styleStr;
  }, [props.rectStyle]);

  return (
    <ColorCard
      hs={props.hs || defaultProps.hs}
      containerStyle={props.containerStyle || defaultProps.containerStyle}
      rectWidth={props.rectWidth || defaultProps.rectWidth}
      rectHeight={props.rectHeight || defaultProps.rectHeight}
      bindonTouchEnd={onTouchEnd || defaultProps.onTouchEnd}
      thumbBorderWidth={props.thumbBorderWidth || defaultProps.thumbBorderWidth}
      thumbBorderRadius={
        props.thumbBorderRadius !== undefined
          ? props.thumbBorderRadius
          : defaultProps.thumbBorderRadius
      }
      thumbBorderColor={props.thumbBorderColor || defaultProps.thumbBorderColor}
      rectStyle={rectStyleStr}
    />
  );
}

LampColorCard.defaultProps = defaultProps;

export default LampColorCard;
