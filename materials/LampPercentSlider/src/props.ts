export interface IProps {
  /**
   * @description.en hidden
   * @description.zh 隐藏
   * @default null
   */
  hidden?: boolean;
  /**
   * @description.en disabled
   * @description.zh disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * @description.zh 类名
   * @description.en class name
   * @default null
   */
  className?: string;
  /**
   * @description.en style
   * @description.zh 样式
   * @default null
   */
  style?: React.CSSProperties;
  /**
   * @description.en value
   * @description.zh 数值
   * @default 0
   */
  value?: number;
  /**
   * @description.en callback when value change
   * @description.zh 数值变化时回调
   * @default null
   */
  onChange?(value: number): void;
  /**
   * @description.en callback when touchend
   * @description.zh 松手时回调
   * @default null
   */
  onTouchEnd?(value: number): void;
  /**
   * @description.en text color
   * @description.zh 字体颜色
   * @default rgba(0, 0, 0, 0.9)
   */
  textColor?: string;
  /**
   * @description.en thumbColor
   * @description.zh 按钮颜色
   * @default null
   */
  thumbColor?: string;
  /**
   * @description.en thumbShadow
   * @description.zh 按钮阴影
   * @default null
   */
  thumbShadow?: string;
  /**
   * @description.en 是否展示右侧数值
   * @description.zh 是否展示左侧 icon
   * @default null
   */
  showIcon?: boolean;
  /**
   * @description.en 是否展示右侧文本
   * @description.zh 是否展示右侧文本
   * @default null
   */
  showText?: boolean;
  /**
   * @description.en max
   * @description.zh 最大值
   * @default 100
   */
  max?: number;
  /**
   * @description.en max
   * @description.zh 最大值
   * @default 0
   */
  min?: number;
  /**
   * @description.en id
   * @description.zh id
   */
  instanceId?: string;
  /**
   * @description.en Use a picture to render a indicator
   * @description.zh 使用图片渲染一个指示器
   * @default null
   */
  thumbImage?: string;
  /**
   * @description.en thumbStyle
   * @description.zh 按钮样式
   * @default null
   */
  thumbStyle?: React.CSSProperties & { width: number };
  /**
   * @description.en trackStyle
   * @description.zh 轨道样式
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.en barStyle
   * @description.zh 滑条样式
   */
  barStyle?: React.CSSProperties;
  /**
   * @description.en enableTouch
   * @description.zh 是否允许点击跳跃
   * @default true
   */
  enableTouch?: boolean;
}
