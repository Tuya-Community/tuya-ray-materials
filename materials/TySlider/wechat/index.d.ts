export interface SmartSliderProps {
  /**
   * 当前进度百分比，在双滑块模式下为数组格式
   *
   * @default 0
   */
  value?: number | number[];

  /**
   * 是否禁用滑块
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * 最大值
   *
   * @default 100
   */
  max?: number;

  /**
   * 最小值
   *
   * @default 0
   */
  min?: number;

  /**
   * 步长
   *
   * @default 1
   */
  step?: number;

  /**
   * 进度条高度，默认单位为 `px`
   *
   * @default '2px'
   */
  barHeight?: string | number;

  /**
   * 进度条激活态颜色
   *
   * @default '#1989fa'
   */
  activeColor?: string;

  /**
   * 进度条默认颜色
   *
   * @default '#e5e5e5'
   */
  inactiveColor?: string;

  /**
   * 是否使用按钮插槽
   *
   * @default false
   */
  useButtonSlot?: boolean;

  /**
   * 是否开启双滑块模式
   *
   * @default false
   */
  range?: boolean;

  /**
   * 是否垂直展示
   *
   * @default false
   */
  vertical?: boolean;

  style?: React.CSSProperties;
}

/**
 * @deprecated
 */
export interface SmartSliderChangeEvent {
  detail: number;
}

export interface SmartSliderDragEventDetail {
  value: number;
}

export interface SmartSliderEvents {
  /**
   * 拖动进度条时触发
   */
  'bind:drag'?: SmartEventHandler<SmartSliderDragEventDetail>;

  /**
   * 进度值改变后触发
   */
  'bind:change'?: SmartEventHandler<number>;

  /**
   * 开始拖动时触发
   */
  'bind:drag-start'?: SmartEventHandler;

  /**
   * 结束拖动时触发
   */
  'bind:drag-end'?: SmartEventHandler;
}

declare const Slider: React.FC<SmartSliderProps & SmartSliderEvents>;

export default Slider;
