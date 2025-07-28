import React from 'react';

export interface IProps {
  /**
   * @description.en colorList
   * @description.zh 色盘渐变颜色列表
   */
  colorList?: {
    // 渐变颜色偏移量 0 - 1
    offset: number;
    // 颜色值
    color: string;
  }[];

  /**
   * @description.zh 默认数值
   * @description.en default value
   * @default
   */
  value: number;
  /**
   * @description.zh 是否隐藏拖拽圆环
   * @description.en Whether to hide the drag ring
   * @default false
   */
  hideThumb?: boolean;
  /**
   * @description.en temperature
   * @description.zh 色温
   * @default null
   */
  temperature?: number;
  /**
   * @description.zh 内部色环宽度
   * @description.en The width of inner color ring
   * @default 80
   */
  innerRingRadius?: number;
  /**
   * @description.zh 色盘宽度
   * @description.en The width of color ring
   * @default 140
   */
  radius?: number;
  /**
   * @description.zh 手指按下时的回调函数
   * @description.en Finger press when the callback function
   * @default ''
   */
  onTouchStart?: (value: number) => void;
  /**
   * @description.zh 手指按下拖动时的回调函数
   * @description.en Finger to press the drag of the callback function
   * @default ''
   */
  onTouchMove?: (value: number) => void;
  /**
   * @description.zh 手指按下结束时的回调函数
   * @description.en Finger press at the end of the callback function
   * @default ''
   */
  onTouchEnd?: (value: number) => void;
  /**
   * @description.en showInnerCircle
   * @description.zh 展示数值圆环
   * @default true
   */
  showInnerCircle?: boolean;
  /**
   * @description.en useEventChannel
   * @description.zh 使用事件
   * @default false
   */
  useEventChannel?: boolean;
  /**
   * @description.en eventChannelName
   * @description.zh 事件名
   * @default null
   */
  eventChannelName?: string;

  /**
   * @description.zh 绘制的圆环末端样式
   * @description.en Drawn ring end style
   * @default round
   */
  lineCap?: 'butt' | 'round';
  /**
   * @description.en titleStyle
   * @description.zh 标题样式
   * @default null
   */
  titleStyle?: React.CSSProperties;
  descText?: string;
  /**
   * @description.en descStyle
   * @description.zh 描述样式
   * @default null
   */
  descStyle?: React.CSSProperties;
  /**
   * @description.en style
   * @description.zh 样式
   * @default null
   */
  style?: React.CSSProperties;

  /**
   * @description.en innerBorderStyle
   * @description.zh 内部圆环描边
   * @default null
   */
  innerBorderStyle?: {
    color: string;
    width: number;
  };

  /**
   * @description.en touchCircleStrokeStyle
   * @description.zh 触摸圆环描边颜色与 ctx.shadowColor 值相同
   * @default '
   */
  touchCircleStrokeStyle?: string;
  /**
   * @description.en touchCircleLineWidth
   * @description.zh 触摸圆环描边宽度与 ctx.shadowBlur 值相同
   * @default 0
   */
  touchCircleLineWidth?: number;
}
