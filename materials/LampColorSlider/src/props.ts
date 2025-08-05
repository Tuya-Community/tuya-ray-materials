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
   * @description.zh 手指滑块样式
   * @description.en Fingers sliding block style
   * @default {}
   */
  thumbStyle?: React.CSSProperties;
  /**
   * @description.zh slider值
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
   * @description.en The event name when it starts to drag (eventChannel only)
   * @description.zh 开始拖动时的事件名 (eventChannel可用)
   * @default null
   */
  startEventName?: string;
  /**
   * @description.en Incident name when dragging (eventChannel only)
   * @description.zh 正在拖动时的事件名 (eventChannel可用)
   * @default null
   */
  moveEventName?: string;
  /**
   * @description.en The event name when the drag is ended (eventChannel only)
   * @description.zh 结束拖动时的事件名 (eventChannel可用)
   * @default null
   */
  endEventName?: string;
  /**
   * @description.en hidden
   * @description.zh 是否隐藏
   * @default false
   */
  hidden?: boolean;
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
}

export const defaultProps: IProps = {
  value: 1,
  trackStyle: {},
  onTouchStart: () => null,
  onTouchMove: () => null,
  onTouchEnd: () => null,
  useCustomThumbStyle: false,
  useCustomTrackStyle: false,
};
