export interface IProps {
  /**
   * @description.zh 组件唯一标识 (默认 随机生成 )
   * @description.en Unique identification (Defaults to random generation)
   * @default random generated
   */
  canvasId?: string;
  /**
   * @description.zh 默认数值
   * @description.en default value
   * @default
   */
  value: number;
  /**
   * @description.zh 内圆环宽度
   * @description.en Inner ring width
   * @default 80
   */
  innerRingRadius?: number;
  /**
   * @description.zh 色环边框颜色
   * @description.en ring border color
   * @default null
   */
  ringBorderColor?: string;
  /**
   * @description.zh 外圆环半径
   * @description.en Outer ring radius
   * @default 140
   */
  ringRadius?: number;
  /**
   * @description.zh 起始角度
   * @description.en start angle
   * @default 0
   */
  startDegree?: number;
  /**
   * @description.zh 结束角度
   * @description.en end angle
   * @default 360
   */
  endDegree?: number;
  /**
   * @description.zh 偏移角度
   * @description.en offset angle
   * @default 360
   */
  offsetDegree?: number;
  /**
   * @description.zh 渐变颜色列表
   * @description.en Color plate gradient color list
   */
  colorList?: {
    offset: number;
    color: string;
  }[];
  /**
   * @description.zh thumb 滑过区域的背景颜色，V0.1.0 开始支持
   * @description.en The background color of the area where the thumb slides over,Support began in V0.1.0
   * @default ''
   */
  trackColor?: string;
  /**
   * @description.zh thumb 背景色,V0.1.0 开始支持
   * @description.en thumb background,Support began in V0.1.0
   * @default ''
   */
  thumbColor?: string;
  /**
   * @description.zh 兼容模式, 用于某些机型渲染异常
   * @description.en compatibility mode，Used to render exceptions on some models
   * @default false // Not enabled by default
   */
  compatibleMode?: boolean;
  /**
   * @description.zh 是否禁用滑动
   * @description.en Whether to disable sliding
   * @default false
   */
  disable?: boolean;
  /**
   * @description.zh 禁用时 thumb 背景色
   * @description.en thumb background color when disabled
   * @default 'rgba(0, 0, 0, 0.5)'
   */
  disableThumbColor?: string;
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
   * @description.en touchCircleStrokeStyle
   * @description.zh 触摸圆环描边颜色
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
   * @default ringRadius - innerRingRadius
   */
  thumbRadius?: number;
  /**
   * @description.en thumb offset(Set it when thumb is covered) (V0.0.12 start support)
   * @description.zh thumb 展示偏移量（当 thumb 被遮盖时进行设置） (V0.0.12 开始支持)
   * @default 10
   */
  thumbOffset?: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const nilFn = () => null;
export const defaultProps: IProps = {
  value: 0,
  onTouchStart: nilFn,
  onTouchMove: nilFn,
  onTouchEnd: nilFn,
  touchCircleStrokeStyle: 'rgba(0, 0, 0, 0.2)',
  thumbBorderWidth: 4,
  thumbBorderColor: '#fff',
};
