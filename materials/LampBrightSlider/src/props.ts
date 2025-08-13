/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
export interface IProps {
  /**
   * @description.en instanceId
   * @description.zh 实例id
   */
  instanceId?: string;
  /**
   * @description.zh 禁止滑动
   * @description.en Ban sliding
   * @default false
   */
  disable?: boolean;
  /**
   * @description.zh 滑动槽样式
   * @description.en Sliding groove style
   * @default {}
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.en Fingers sliding block style
   * @description.zh 手指滑块样式
   */
  thumbStyle?: React.CSSProperties;
  /**
   * @description.zh 亮度 slider 的最小值
   * @description.en Minimum value of brightness slider
   * @default 10
   */
  min: number;
  /**
   * @description.zh 亮度 slider 的最大值
   * @description.en Maximum value of brightness slider
   * @default 1000
   */
  max: number;
  /**
   * @description.zh slider值 对应hsv的saturation 范围 1 - 1000
   * @description.en slider value
   * @default 0
   */
  value: number;
  /**
   * @description.zh slider 手指点击时触发
   * @description.en slider Value changes
   * @default () => {}
   */
  onTouchStart: (value: number) => void;
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
   * @description.zh 是否支持点击
   * @description.en enable touch
   * @default true
   */
  enableTouch?: boolean;
  /**
   * @description.en useCustomThumbStyle
   * @description.zh 使用自定义按钮样式
   * @default null
   */
  useCustomThumbStyle?: boolean;
  /**
   * @description.en useCustomTrackStyle
   * @description.zh 使用自定义滑槽样式
   * @default null
   */
  useCustomTrackStyle?: boolean;
  moveEventName?: string;
  startEventName?: string;
  endEventName?: string;
}

export const defaultProps: IProps = {
  min: 10,
  max: 1000,
  value: 1,
  trackStyle: {},
  onTouchStart: () => null,
  onTouchMove: () => null,
  onTouchEnd: () => null,
  useCustomThumbStyle: false,
  useCustomTrackStyle: false,
  moveEventName: null,
  startEventName: null,
  endEventName: null,
};
