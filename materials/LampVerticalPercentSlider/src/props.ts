export interface IProps {
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
   * @description.en callback when start
   * @description.zh 开始时回调
   * @default null
   */
  onTouchStart?(value: number): void;
  /**
   * @description.en icon color
   * @description.zh 图标颜色
   * @default rgba(0,0,0,0.9)
   */
  iconColor?: string;
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
   * @description.en trackColor
   * @description.zh 滑槽颜色
   * @default rgba(0, 0, 0, 0.1)
   */
  trackColor?: string;
  /**
   * @description.en barColor
   * @description.zh 滑条颜色
   * @default #fff
   */
  barColor?: string;
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
   * @description.en width
   * @description.zh 宽度
   * @default '8px'
   */
  width?: string;
  /**
   * @description.en width
   * @description.zh 宽度
   * @default width
   */
  barWidth?: string;
  /**
   * @description.en height
   * @description.zh 高度
   * @default '200px'
   */
  height?: string;
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
   * @description.en disabled
   * @description.zh disabled
   * @default false
   */
  disabled?: boolean;
}
