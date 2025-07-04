/* eslint-disable react/require-default-props */
import React from 'react';

export interface EventType<T> {
  type: T;
  timeStamp: number;
  target: any;
  currentTarget: any;
  detail: SjsSliderEventData;
}

export interface SjsSliderEventData {
  value: number;
  end: number;
}

export interface SjsSliderProps {
  /**
   * @description.en instanceId
   * @description.zh 唯一ID
   */
  instanceId: string;
  /**
   * @description.en className
   * @description.zh 样式
   */
  className?: string;
  /**
   * @description.en disable
   * @description.zh disable
   * @default false
   */
  disable?: boolean;
  /**
   * @description.en Right slider initial value/one-way slider initial value
   * @description.zh 右滑块初始值/单向滑条初始值
   * @default 30
   */
  end?: number;
  /**
   * @description.en min
   * @description.zh 最小值, 建议用 endMin 代替
   * @default 0
   */
  min?: number;
  /**
   * @description.en max
   * @description.zh 最大值
   * @default 100
   */
  max?: number;
  /**
   * @description.en step
   * @description.zh 阶段值
   * @default 1
   */
  step?: number;
  /**
   * @description.en thumbStyle
   * @description.zh 滑块样式
   */
  thumbStyle?: React.CSSProperties;
  thumbWrapStyle?: React.CSSProperties;
  /**
   * @description.en enableTouch
   * @description.zh 使用触摸跳跃
   * @default true
   */
  enableTouch?: boolean;
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
   * @description.en stepStyle
   * @description.zh step样式
   */
  stepStyle?: React.CSSProperties;
  /**
   * @description.en bar stepStyle
   * @description.zh bar step样式
   */
  activeStepStyle?: React.CSSProperties;
  /**
   * @description.en showSteps
   * @description.zh 显示阶段提示
   * @default false
   */
  showSteps?: boolean;
  /**
   * @description.en direction
   * @description.zh 方向
   * @default horizontal
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * @description.en callback
   * @description.zh 回调
   */
  bindmove?: (event: EventType<'move'>) => void;
  /**
   * @description.en callback
   * @description.zh 回调
   */
  bindend?: (event: EventType<'end'>) => void;
  /**
   * @description.en callback
   * @description.zh 回调
   */
  bindstart?: (event: EventType<'start'>) => void;
  /**
   * @description.en reverse
   * @description.zh 是否反转
   * @default false
   */
  reverse?: boolean;
  /**
   * @description.en hotAreaStyle
   * @description.zh 点击热区样式
   */
  hotAreaStyle?: React.CSSProperties;
  /**
   * @description.en hideThumb
   * @description.zh 隐藏滑块
   * @default null
   */
  hideThumbButton?: boolean;
  /**
   * @description.en hsvRenderFormatter
   * @description.zh hsv渲染按钮背景色，例如 "value,100,100"，按钮背景色将按格式渲染
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
   * @description.en useParcelPadding
   * @description.zh 是否包裹滑动条内边距
   * @default null
   */
  useParcelPadding?: boolean;
  parcelThumbWidth?: number;
  parcelThumbHeight?: number;
  /**
   * @description.en The event name when it starts to drag (eventChannel only)
   * @description.zh 开始拖动时的事件名 (eventChannel可用)
   * @default null
   */
  startEventName?: string;
  trackBackgroundColorHueEventName?: string;
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
   * @description.zh 从滑轨映射取色
   * @default false
   */
  inferThumbBgColorFromTrackBgColor?: boolean;
  forceStep?: number;
  /**
   * @description.en Element of response color， thumb, track, bar
   * @description.zh 响应颜色的元素 thumb、track、bar 逗号连接
   * @default "thumb,track"
   */
  trackBackgroundColorHueEventNameEnableItems?: string;
  /**
   * @description.en template
   * @description.zh 颜色变化模版
   * @default linear-gradient(to right, #ffffff 0%, hsl($huedeg 100% 50%) 100%)
   */
  trackBackgroundColorHueEventNameTemplate?: string;
  /**
   * @description.en slot
   * @description.zh 插槽
   * @default null
   */
  slot?: {
    bar?: React.ReactNode;
    thumb?: React.ReactNode;
  };
  /**
   * @description.en trackBackgroundColorRenderMode
   * @description.zh 渲染背景色的区域
   * @default bar
   */
  trackBackgroundColorRenderMode?: 'track' | 'bar';
  deps?: (string | number | boolean)[];
}

const SjsSlider: React.FC<SjsSliderProps>;

export default SjsSlider;
