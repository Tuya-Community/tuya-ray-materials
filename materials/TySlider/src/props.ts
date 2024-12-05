import { Property } from 'csstype';

export interface IProps {
  instanceId?: string;
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
   * @description.zh 是否垂直展示，垂直展示时，需要设置滑槽宽高
   * @description.en Whether to display vertically, when vertical display is set, the slider needs to set the width and height of the track
   * @default false
   */
  isVertical?: boolean;
  /**
   * @description.zh 样式
   * @description.en style
   */
  value?: number;
  /**
   * @description.zh 默认值
   * @description.en Default value
   * @default 0
   * @deprecated use value
   */
  defaultValue?: number;
  /**
   * @description.zh 最小值
   * @description.en Minimum value
   * @default 0
   */
  min?: number;
  /**
   * @description.zh 最大值
   * @description.en Maximum value
   * @default 100
   */
  max?: number;
  /**
   * @description.zh 步距，取值必须大于 `0`，并且可被 `(max - min)` 整除。
   * @description.en Step, the value must be greater than `0` and can be divided by `(max - min)`.
   * @default 1
   */
  step?: number;
  /**
   * @description.zh 和 step 一致，用于滑块不跟随刻度时设置
   * @description.en same as step, set when the thumb does not follow the step
   * @default 1
   * @deprecated
   */
  forceStep?: number;
  /**
   * @description.zh 是否禁用
   * @description.en Whether it is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * @description.zh 拖拽滑块时触发，并把当前拖拽的值作为参数传入
   * @description.en When the slider is dragged, and the current drag value is passed as an argument
   */
  onChange?: (value: number) => void;
  /**
   * @description.zh 滑块拖拽开始时触发，并把当前拖拽的值作为参数传入
   * @description.en When the slider is dragged, and the current drag value is passed as an argument
   */
  onBeforeChange?: (value: number) => void;
  /**
   * @description.zh 与 `touchend` 触发时机一致，把当前值作为参数传入
   * @description.en The same time as `touchend` triggers, and the current value is passed as an argument
   */
  onAfterChange?: (value: number) => void;
  /**
   * @description.zh 滑槽宽度
   * @description.en Track width
   * @default '100%'
   */
  maxTrackWidth?: Property.Width<string | number>;
  /**
   * @description.zh 滑槽高度
   * @description.en Track height
   * @default '4px'
   */
  maxTrackHeight?: Property.Width<string | number>;
  /**
   * @description.zh 滑槽圆角
   * @description.en Track border radius
   * @default '4px'
   */
  maxTrackRadius?: Property.BorderRadius<string | number>;
  /**
   * @description.zh 滑槽颜色
   * @description.en Track color
   * @default '#d8d8d8'
   */
  maxTrackColor?: Property.Background;
  /**
   * @description.zh 滑条最小宽度
   * @description.en Bar min width
   * @default '28px'
   */
  minTrackWidth?: Property.Width<string | number>;
  /**
   * @description.zh 滑条高度
   * @description.en Bar height
   * @default '4px'
   */
  minTrackHeight?: Property.Width<string | number>;
  /**
   * @description.zh 滑条圆角
   * @description.en Bar border radius
   * @default 'inherit'
   */
  minTrackRadius?: Property.BorderRadius<string | number>;
  /**
   * @description.zh 滑条颜色
   * @description.en Track color
   * @default '#158CFB'
   */
  minTrackColor?: Property.Background;
  /**
   * @description.zh 滑块宽度
   * @description.en Slider width
   * @default '28px'
   */
  thumbWidth?: Property.Width<string | number>;
  /**
   * @description.zh 滑块样式
   * @description.en Slider style
   * @default null
   */
  thumbStyle?: React.CSSProperties;
  /**
   * @description.zh 滑块wrap样式
   * @description.en Slider wrap style
   * @default null
   */
  thumbWrapStyle?: React.CSSProperties;
  /**
   * @description.zh 滑块高度
   * @description.en Slider height
   * @default '28px'
   */
  thumbHeight?: string | number;
  /**
   * @description.zh 滑块圆角
   * @description.en Slider radius
   * @default '28px'
   */
  thumbRadius?: string | number;
  /**
   * @description.zh 滑块颜色
   * @description.en Slider color
   * @default '#ffffff'
   */
  thumbColor?: Property.Background;
  /**
   * @description.zh 滑块边框样式
   * @description.en Slider border style
   * @default '0px solid #ffffff'
   */
  thumbBorderStyle?: Property.BorderStyle;
  /**
   * @description.zh 滑块阴影
   * @description.en Slider shadow
   * @default '0px 0.5px 4px rgba(0, 0, 0, 0.12), 0px 6px 13px rgba(0, 0, 0, 0.12)'
   */
  thumbBoxShadowStyle?: Property.BoxShadow;
  /**
   * @description.zh 是否显示刻度
   * @description.en Whether to display the scale
   * @default false
   */
  isShowTicks?: boolean;
  /**
   * @description.zh 刻度宽度
   * @description.en Tick width of the slider
   * @default '4px'
   */
  tickWidth?: string;
  /**
   * @description.zh 刻度高度
   * @description.en Tick height of the slider
   * @default '12px'
   */
  tickHeight?: string;
  /**
   * @description.zh 刻度圆角
   * @description.en Tick radius of the slider
   * @default '4px'
   */
  tickRadius?: string;
  /**
   * @description.zh 滑槽刻度颜色
   * @description.en Scale color of the slider
   * @default '#158CFB'
   */
  maxTrackTickColor?: string;
  /**
   * @description.zh 滑条刻度颜色
   * @description.en Scale color of the slider
   * @default '#ffffff'
   */
  minTrackTickColor?: string;
  /**
   * @description.en track style
   * @description.zh 轨道样式
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.en bar style
   * @description.zh 滑条样式
   */
  barStyle?: React.CSSProperties;
  /**
   * @description.en renderType
   * @description.zh 渲染方式
   * @default 'sjs'
   */
  renderType?: 'ray' | 'sjs';
  /**
   * @description.en hideThumb
   * @description.zh 隐藏滑块
   * @default null
   */
  hideThumbButton?: boolean;
  /**
   * @description.en thumbStyleRenderFormatter(sjs only)
   * @description.zh 渲染按钮背景色，例如 "rgb(value,100,100)"，将value替换为滑动值(仅sjs支持)
   * @default null
   */
  thumbStyleRenderFormatter?: Partial<Record<keyof React.CSSProperties, string>>;
  /**
   * @description.en thumbStyleRenderValueScale(sjs only)
   * @description.zh 渲染value时的缩放倍数
   * @default 1
   */
  thumbStyleRenderValueScale?: number;
  /**
   * @description.en thumbStyleRenderValueStart(sjs only)
   * @description.zh 渲染value时的起始值
   * @default 0
   */
  thumbStyleRenderValueStart?: number;
  /**
   * @description.en thumbStyleRenderValueReverse(sjs only)
   * @description.zh 渲染value时反转值
   * @default false
   */
  thumbStyleRenderValueReverse?: boolean;
  /**
   * @description.en enableTouch
   * @description.zh 使用触摸跳跃
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
   * @description.en parcel
   * @description.zh 包裹滑动条
   * @default false
   */
  parcel?: boolean;
  /**
   * @description.en parcel
   * @description.zh 包裹滑动条间隔
   * @default 0
   */
  parcelMargin?: number;
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
   * @description.en Map the color from the slide rail
   * @description.zh 从滑轨映射取色, 仅支持6位hex颜色，例如 maxTrackColor 为 linear-gradient(to left, #CEECFE 0%, #FFFFFF 50%, #FBCA5C 100%)
   * @default false
   */
  inferThumbBgColorFromTrackBgColor?: boolean;
}

export const defaultProps: IProps = {
  disabled: false,
  hideThumbButton: false,
  className: '',
  style: null,
  isVertical: false,
  value: null,
  defaultValue: 0,
  min: 0,
  max: 100,
  step: 1,
  forceStep: 1,
  onChange: null,
  onBeforeChange: null,
  onAfterChange: null,
  maxTrackWidth: '100%',
  maxTrackHeight: '4px',
  maxTrackRadius: '4px',
  minTrackWidth: '28px',
  minTrackHeight: '4px',
  minTrackRadius: 'inherit',
  minTrackColor: '#158CFB',
  thumbWidth: '28px',
  thumbStyle: null,
  thumbWrapStyle: null,
  thumbHeight: '28px',
  thumbRadius: '28px',
  thumbColor: '#ffffff',
  thumbBorderStyle: '0px solid #ffffff',
  thumbBoxShadowStyle: '0px 0.5px 4px rgba(0, 0, 0, 0.12), 0px 6px 13px rgba(0, 0, 0, 0.12)',
  isShowTicks: false,
  tickWidth: '4px',
  tickHeight: '12px',
  tickRadius: '4px',
  maxTrackTickColor: '#158CFB',
  minTrackTickColor: '#ffffff',
  trackStyle: null,
  barStyle: null,
  renderType: 'sjs',
  thumbStyleRenderFormatter: null,
  thumbStyleRenderValueScale: 1,
  thumbStyleRenderValueStart: 0,
  thumbStyleRenderValueReverse: false,
  enableTouch: true,
  hidden: false,
  parcelMargin: 0,
  parcel: false,
  startEventName: null,
  moveEventName: null,
  endEventName: null,
  inferThumbBgColorFromTrackBgColor: false,
};
