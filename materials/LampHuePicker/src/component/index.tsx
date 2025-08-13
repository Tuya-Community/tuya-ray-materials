import React from 'react';

import AnnulusPicker from './rjs';

interface IProps {
  /**
   * @description.zh 默认数值
   * @description.en default value
   * @default
   */
  value: number;
  /**
   * @description.zh 色环内部半径
   * @description.en The width of inner color ring
   * @default 80
   */
  innerRingRadius?: number;
  /**
   * @description.zh 色盘半径
   * @description.en The width of color ring
   * @default 140
   */
  radius?: number;
  /**
   * @description.zh 注意⚠️：基础库版本大于2.18.0, 是否启用事件通道，当多个 rjs 组件同时使用时，用于优化 rjs 间数据传输时的性能问题
   * @description.en Note ⚠️ : The base library version is greater than 2.18.0， Whether to enable event channels to optimize the performance of data transfer between rjs when multiple rjs components are used simultaneously
   * @default false
   */
  useEventChannel?: boolean;
  /**
   * @description.zh 事件通道名称
   * @description.en Event channel name
   * @default 'lampHuePickerEventChannel'
   */
  eventChannelName?: string;
  /**
   * @description.zh 手指按下时的回调函数
   * @description.en Finger press when the callback function
   * @default
   */
  onTouchStart?: (hue: number) => void;
  /**
   * @description.zh 手指按下拖动时的回调函数
   * @description.en Finger to press the drag of the callback function
   * @default
   */
  onTouchMove?: (hue: number) => void;
  /**
   * @description.zh 手指按下结束时的回调函数
   * @description.en Finger press at the end of the callback function
   * @default
   */
  onTouchEnd?: (hue: number) => void;
}

function AnnulusPickerColor(props: IProps) {
  const onTouchStart = e => {
    const { detail } = e;
    const hue = Math.floor(detail);
    props.onTouchStart && props.onTouchStart(hue);
  };
  const onTouchMove = e => {
    const { detail } = e;
    const hue = Math.floor(detail);
    props.onTouchMove && props.onTouchMove(hue);
  };
  const onTouchEnd = e => {
    const { detail } = e;
    const hue = Math.floor(detail);
    props.onTouchEnd && props.onTouchEnd(hue);
  };

  return (
    <AnnulusPicker
      radius={props.radius}
      innerRingRadius={props.innerRingRadius}
      value={props.value}
      useEventChannel={props.useEventChannel}
      eventChannelName={props.eventChannelName}
      bindstart={onTouchStart}
      bindmove={onTouchMove}
      bindend={onTouchEnd}
    />
  );
}

const nilFn = () => null;
const defaultProps = {
  radius: 140,
  innerRingRadius: 80,
  useEventChannel: false,
  eventChannelName: 'lampHuePickerEventChannel',
  onTouchStart: nilFn,
  onTouchMove: nilFn,
  onTouchEnd: nilFn,
};

AnnulusPickerColor.defaultProps = defaultProps;

export default AnnulusPickerColor;
