import React from 'react';

/*
 * @Author: mjh
 * @Date: 2025-04-27 10:14:04
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-24 11:33:38
 * @Description:
 */
export interface IProps {
  /**
   * @description.zh  色温 0-1000
   * @description.en Temperature 0-1000
   * @default 0
   */
  temperature?: number;
  /**
   * @description.zh 拖动的色圈宽度
   * @description.en Drag the color ring width
   * @default 15
   */
  thumbRadius?: number;
  /**
   * @description.zh 色盘宽度
   * @description.en Color plate width
   * @default 150
   */
  radius?: number;
  /**
   * @description.zh 移动最小区间
   * @description.en Move the minimum interval
   * @default 0
   * @version 0.0.4
   */
  minRange?: number;
  /**
   * @description.zh 注意⚠️：基础库版本大于2.18.0, 是否启用事件通道，当多个 rjs 组件同时使用时，用于优化 rjs 间数据传输时的性能问题
   * @description.en Note ⚠️ : The base library version is greater than 2.18.0， Whether to enable event channels to optimize the performance of data transfer between rjs when multiple rjs components are used simultaneously
   * @default false
   */
  useEventChannel?: boolean;
  /**
   * @description.zh 事件通道名称
   * @description.en Event channel name
   * @default 'lampCirclePickerWhiteEventChannel'
   */
  eventChannelName?: string;
  /**
   * @description.zh 手指按下时的回调函数
   * @description.en Finger press when the callback function
   * @default ''
   */

  onTouchStart?: (temperature: number) => void;
  /**
   * @description.zh 手指按下拖动时的回调函数
   * @description.en Finger to press the drag of the callback function
   * @default ''
   */
  onTouchMove?: (temperature: number) => void;
  /**
   * @description.zh 手指按下结束时的回调函数
   * @description.en Finger press at the end of the callback function
   * @default ''
   */
  onTouchEnd?: (temperature: number) => void;
  /**
   * @description.en Canvas ID
   * @description.zh 画布 ID
   * @default null
   */
  canvasId?: string;
  /**
   * @description.en Display percentage
   * @description.zh 展示百分比
   * @version 0.0.4
   */
  showPercent?: boolean;
  /**
   * @description.en font style
   * @description.zh 字体样式
   * @version 0.0.4
   */
  textStyles?: React.CSSProperties;
  /**
   * @description.en font style
   * @description.zh 气泡的字体样式
   * @version 0.0.4
   */
  bubbleTextStyles?: React.CSSProperties;
  /**
   * @description.en 显示值替换
   * @description.zh 字体样式
   * @version 0.0.4
   */
  percentValueMap?: Record<string, number>;
  /**
   * @description.en 显示值替换
   * @description.zh 字体样式
   * @version 0.0.4
   */
  thumbBorderWidth?: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const nilFn = () => null;
export const defaultProps: IProps = {
  percentValueMap: null,
  textStyles: {},
  showPercent: false,
  thumbRadius: 15,
  thumbBorderWidth: 2,
  radius: 150,
  onTouchStart: nilFn,
  onTouchMove: nilFn,
  onTouchEnd: nilFn,
};
