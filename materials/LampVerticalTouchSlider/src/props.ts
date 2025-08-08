export interface IProps {
  /**
   * @description.zh 类名
   * @description.en class name
   */
  className?: string;
  /**
   * @description.zh 样式
   * @description.en Style
   */
  style?: React.CSSProperties;
  /**
   * @description.en thumbStyle
   * @description.zh 滑块样式
   * @default null
   */
  thumbStyle?: React.CSSProperties;
  /**
   * @description.en showThumb
   * @description.zh 展示滑块
   * @default false
   */
  showThumb?: boolean;
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
   * @description.en step
   * @description.zh 间隔
   * @default 1
   */
  step?: number;
  /**
   * @description.en text color
   * @description.zh 文字颜色
   * @default rgba(0, 0, 0, 0.9)
   */
  textColor?: string;
  /**
   * @description.en bar color
   * @description.zh 滚动条颜色
   * @default linear-gradient(270deg, #7f66ef -14.11%, #fff 100%)
   */
  barColor?: string;
  /**
   * @description.en track color
   * @description.zh 滑槽颜色
   * @default #e0e0e0
   */
  trackColor?: string;
  /**
   * @description.en border color
   * @description.zh 边框色
   * @default rgba(0, 0, 0, 0.1)
   */
  borderColor?: string;
  /**
   * @description.en 是否展示右侧数值
   * @description.zh 是否展示左侧 icon
   * @default true
   */
  showIcon?: boolean;
  /**
   * @description.en 是否展示右侧文本
   * @description.zh 是否展示右侧文本
   * @default true
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
   * @default '70px'
   */
  width?: string;
  /**
   * @description.en height
   * @description.zh 高度
   * @default '200px'
   */
  height?: string;
  /**
   * @description.en barStyle
   * @description.zh 滑条样式
   */
  barStyle?: React.CSSProperties;
  /**
   * @description.en trackStyle
   * @description.zh 轨道样式
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.en borderRadius
   * @description.zh 边框圆角
   * @default '16px'
   */
  borderRadius?: string;
  /**
   * @description.en Use a picture to render a indicator
   * @description.zh 使用图片渲染一个指示器
   * @default null
   */
  thumbImage?: string;
  /**
   * @description.en Indicator width
   * @description.zh 指示器宽度
   * @default 'auto'
   */
  thumbWidth?: string;
  /**
   * @description.en Indicator height
   * @description.zh 指示器高度
   * @default 'auto'
   */
  thumbHeight?: string;
  /**
   * @description.en Indicator borderRadius
   * @description.zh 指示器圆角
   * @default '0px'
   */
  thumbBorderRadius?: string;
}

export const defaultProps: IProps = {};
