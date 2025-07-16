import React, { useMemo } from 'react';
import { View } from '@ray-js/components';
import useRate from './utils/useRate';

import RayCircleProgressRjs from './component';
import { IProps } from './props';
import './index.less';

const prefixCls = 'ray-circle-progress';

const RayCircleProgress = (props: IProps) => {
  const {
    className = '',
    startDegree,
    offsetDegree,
    value,
    disable = false,
    compatibleMode,
    disableThumbColor,
    ringRadius: _ringRadius,
    ringBorderColor = 'rgba(0, 0, 0, 0)',
    thumbColor,
    innerRingRadius: _innerRingRadius,
    thumbBorderColor = '#fff',
    thumbBorderWidth: _thumbBorderWidth = 4,
    thumbRadius,
    colorList,
    touchCircleStrokeStyle = 'rgba(0, 0, 0, 0.2)',
    style = {},
    renderInnerCircle = null,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = props;

  const rate = useRate();

  const ringRadius = +(_ringRadius * rate).toFixed(3);
  const innerRingRadius = +(_innerRingRadius * rate).toFixed(3);
  const thumbBorderWidth = +(_thumbBorderWidth * rate).toFixed(3);

  const canvasId = useMemo(() => {
    return `canvasId_${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`;
  }, []);

  const endDegree = startDegree + offsetDegree;

  if (Array.isArray(colorList) && colorList.length <= 1) {
    throw new Error(
      'colorList must have at least two colors, if you have only one color, please fix this color to two same color'
    );
  }
  // ringBorderColor 只支持 rgba 格式的颜色 rgba(1, 2, 3, 0.3)
  if (
    ringBorderColor &&
    !/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(
      ringBorderColor
    )
  ) {
    throw new Error(`ringBorderColor must be rgba format, but got【${ringBorderColor}】`);
  }
  return (
    <View className={`${prefixCls} ${className}`} style={style}>
      <RayCircleProgressRjs
        canvasId={canvasId}
        value={value}
        ringRadius={ringRadius}
        startDegree={startDegree}
        endDegree={endDegree}
        disable={disable}
        compatibleMode={compatibleMode}
        disableThumbColor={disableThumbColor}
        ringBorderColor={ringBorderColor}
        thumbColor={thumbColor}
        offsetDegree={offsetDegree}
        thumbBorderColor={thumbBorderColor}
        thumbBorderWidth={thumbBorderWidth}
        touchCircleStrokeStyle={touchCircleStrokeStyle}
        innerRingRadius={innerRingRadius}
        thumbRadius={thumbRadius}
        thumbOffset={props.thumbOffset}
        colorList={colorList}
        trackColor={props.trackColor}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
      {!!renderInnerCircle && (
        <View className={`${prefixCls}__inner`}>{renderInnerCircle && renderInnerCircle()}</View>
      )}
    </View>
  );
};

const nilFn = () => null;
RayCircleProgress.defaultProps = {
  ringRadius: 100,
  innerRingRadius: 76,
  colorList: [
    {
      offset: 0,
      color: '#dcdde1',
    },
    {
      offset: 1,
      color: '#dcdde1',
    },
  ],
  style: {},
  onTouchStart: nilFn,
  onTouchMove: nilFn,
  onTouchEnd: nilFn,
  renderInnerCircle: null,
};

export default RayCircleProgress;
