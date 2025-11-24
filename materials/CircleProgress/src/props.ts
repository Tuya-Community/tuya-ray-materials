import React from 'react';

export interface IProps {
  /**
   * @description.zh 数值 范围：0-100, 需要其他范围可以自行按比例转换下（后续迭代支持自定义数值范围）
   * @description.en value range: 0-100, If you need other ranges, you can convert them proportionally by yourself (subsequent iterations support custom value ranges)
   * @default
   */
  value: number;

  /**
   * @description.zh 类名
   * @description.en className
   * @default ''
   */
  className?: string;
  /**
   * @description.zh 色环半径
   * @description.en The width of color ring
   * @default 140
   */
  ringRadius?: number;
  /**
   * @description.zh 内部色环半径（差值即为其宽度）
   * @description.en Internal color circle radius (the difference is its width)
   * @default 80
   */
  innerRingRadius?: number;

  /**
   * @description.zh 色盘起始角度
   * @description.en color wheel start angle
   * @default 0
   */
  startDegree?: number;
  /**
   * @description.zh 偏移角度
   * @description.en offset degree
   * @default null
   */
  offsetDegree?: number;
  /**
   * @description.zh 色盘渐变颜色列表
   * @description.en colorList
   */
  colorList?: {
    // 渐变颜色偏移量 0 - 1
    offset: number;
    // 颜色值
    color: string;
  }[];

  /**
   * @description.zh thumb 滑过区域的背景颜色，V0.1.0 开始支持
   * @description.en The background color of the area where the thumb slides over,Support began in V0.1.0
   * @version 0.1.0
   * @default ''
   */
  trackColor?: string;
  /**
   * @description.zh thumb 背景色,V0.1.0 开始支持
   * @description.en thumb background,Support began in V0.1.0
   * @version 0.1.0
   * @default ''
   */
  thumbColor?: string;

  /**
   * @description.zh 是否 thumb 禁用滑动， V0.1.1 开始支持
   * @description.en Whether to disable thumb sliding, Support began in V0.1.1
   * @version 0.1.1
   * @default false
   */
  disable?: boolean;
  /**
   * @description.zh 兼容模式，某些机型渲染异常时使用， V0.1.2 开始支持
   * @description.en compatibility mode, when the rendering is abnormal on some models, Support began in V0.1.2
   * @version 0.1.2
   * @default false
   */
  compatibleMode?: boolean;
  /**
   * @description.zh 禁用时 thumb 背景色, 只支持 rgba 格式 和 hex 格式，不支持 red blue 这种文字颜色， V0.1.1 开始支持
   * @description.en thumb background color when disabled, only supports rgba format and hex format, not supports red blue text color, Support began in V0.1.1
   * @version 0.1.1
   * @default 'rgba(0, 0, 0, 0.5)'
   */
  disableThumbColor?: string;

  /**
   * @description.zh 样式
   * @description.en style
   * @default null
   */
  style?: React.CSSProperties;

  /**
   * @description.zh 色环边框颜色
   * @description.en ring border color
   * @default null
   */
  ringBorderColor?: string;
  /**
   * @description.zh 触摸圆环描边颜色与 ctx.shadowColor 值相同
   * @description.en touchCircleStrokeStyle
   * @default 'rgba(0, 0, 0, 0.2)'
   */
  touchCircleStrokeStyle?: string;

  /**
   * @description.en thumb border width
   * @description.zh thumb border 的宽度
   * @default 4 (px)
   */
  thumbBorderWidth?: number;
  /**
   * @description.en thumb border color
   * @description.zh thumb border 颜色
   * @default #fff
   */
  thumbBorderColor?: string;

  /**
   * @description.en thumb radius (V0.0.12 start support)
   * @description.zh thumb 半径 (V0.0.12 开始支持)
   * @version 0.0.12
   * @default ringRadius - innerRingRadius
   */
  thumbRadius?: number;
  /**
   * @description.en thumb offset(Set it when thumb is covered) (V0.0.12 start support)
   * @description.zh thumb 展示偏移量（当 thumb 被遮盖时进行设置） (V0.0.12 开始支持)
   * @version 0.0.12
   * @default 10
   */
  thumbOffset?: number;
  /**
   * @description.zh 自定义渲染圆环内部样式
   * @description.en Custom rendering ring internal style
   * @default null
   */
  renderInnerCircle?: null | (() => React.ReactNode);
  /**
   * @description.zh 手指按下时的回调函数
   * @description.en Finger press when the callback function
   * @default null
   */
  onTouchStart?: (value: number) => void;
  /**
   * @description.zh 手指按下拖动时的回调函数
   * @description.en Finger to press the drag of the callback function
   * @default null
   */
  onTouchMove?: (value: number) => void;
  /**
   * @description.zh 手指按下结束时的回调函数
   * @description.en Finger press at the end of the callback function
   * @default null
   */
  onTouchEnd?: (value: number) => void;
}
