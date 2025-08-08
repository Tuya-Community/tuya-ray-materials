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
   * @description.en hidden
   * @description.zh 是否隐藏
   * @default false
   */
  hidden?: boolean;
  /**
   * @description.en reverse
   * @description.zh reverse
   * @default false
   */
  reverse?: boolean;
}

export const defaultProps: IProps = {
  value: 1,
  trackStyle: {},
  onTouchStart: () => null,
  onTouchMove: () => null,
  onTouchEnd: () => null,
};
