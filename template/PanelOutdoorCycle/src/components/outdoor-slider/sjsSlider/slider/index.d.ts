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
   * @description.en current Dp Value
   * @description.zh 当前dp值
   * @default false
   */
  currentDpValue?: boolean;
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
   * @description.en 是否支持导航
   * @description.zh 是否支持导航
   * @default false
   */
  isSupportNavigation?: boolean;
}

const SjsSlider: React.FC<SjsSliderProps>;

export default SjsSlider;
