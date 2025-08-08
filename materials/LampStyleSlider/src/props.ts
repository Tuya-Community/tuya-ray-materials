/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
export interface IProps {
  /**
   * @description.en instanceId
   * @description.zh 实例id
   */
  instanceId?: string;
  /**
   * @description.zh value文字样式
   * @description.en Value style
   * @default {}
   */
  valueStyle?: React.CSSProperties;
  /**
   * @description.zh slider的背景颜色
   * @description.en Slider track background color
   * @default '''
   */
  trackBackgroundColor?: string;
  /**
   * @description.zh 整体外层样式
   * @description.en Style
   * @default {}
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 禁止滑动
   * @description.en Ban sliding
   * @default false
   */
  disable?: boolean;
  /**
   * @description.zh 值的标签，不传不显示标签和值
   * @description.en label
   * @default ''
   */
  label?: string;
  /**
   * @description.zh 自定义值显示，不传默认按百分比显示
   * @description.en custom textValue
   * @default '''
   */
  textValue?: string;
  /**
   * @description.zh 滑动条Track样式
   * @description.en Sliding track style
   * @default {}
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.en Fingers sliding block style
   * @description.zh 手指滑块样式
   */
  thumbStyle?: React.CSSProperties;
  /**
   * @description.zh slider值 对应hsv的saturation 范围 1 - 1000
   * @description.en slider value
   * @default 0
   */
  value: number;
  /**
   * @description.zh slider最小值
   * @description.en slider min value
   * @default 0
   */
  min?: number;
  /**
   * @description.zh slider值 最大值
   * @description.en slider max value
   * @default 1000
   */
  max?: number;
  /**
   * @description.zh 是否支持点击
   * @description.en enable touch
   * @default true
   */
  enableTouch?: boolean;
  /**
   * @description.zh slider 手指点击时触发
   * @description.en slider Value changes
   * @default () => {}
   */
  onTouchStart?: (value: number) => void;
  /**
   * @description.zh slider 手指拖动时触发
   * @description.en slider Value changes
   * @default () => {}
   */
  onTouchMove: (value: number) => void;
  /**
   * @description.zh slider 手指离开时触发
   * @description.en Values change after the trigger
   * @default () => {}
   */
  onTouchEnd?: (value: number) => void;
  /**
   * @description.en style
   * @description.zh 按钮hsv背景渲染,例如 "hsl(valuedeg 100% 50%)"
   * @default null
   */
  thumbColorFormatterConfig?: {
    formatter: string;
    scale?: number;
  };
}

export const defaultProps: IProps = {
  value: 1,
  trackStyle: {},
  enableTouch: true,
  trackBackgroundColor: 'transparent',
  style: {},
  min: 0,
  max: 1000,
  onTouchStart: () => null,
  onTouchMove: () => null,
  onTouchEnd: () => null,
};
