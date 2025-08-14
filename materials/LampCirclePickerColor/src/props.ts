export interface IProps {
  /**
   * @description.zh 色盘颜色值
   * @description.en Color wheel color values
   * @default '{h: 0, s: 1000}'
   */
  hs: HS;
  /**
   * @description.zh 拖动的色圈宽度
   * @description.en Drag the color ring width
   * @default 15
   */
  thumbRadius?: number;
  /**
   * @description.zh 中间白光占据的比例 （0.1 - 0.5）
   * @description.en The white light of the proportion in the middle（0.1 - 0.5）
   * @default 0.15
   */
  whiteRange?: number;
  /**
   * @description.zh 移动最小区间
   * @description.en Move the minimum interval
   * @default 0
   * @version 1.0.14
   */
  minRange?: number;
  /**
   * @description.zh 色盘宽度
   * @description.en Color plate width
   * @default 150
   */
  radius?: number;

  /**
   * @description.zh 注意⚠️：基础库版本大于2.18.0, 是否启用事件通道，当多个 rjs 组件同时使用时，用于优化 rjs 间数据传输时的性能问题
   * @description.en Note ⚠️ : The base library version is greater than 2.18.0， Whether to enable event channels to optimize the performance of data transfer between rjs when multiple rjs components are used simultaneously
   * @default false
   */
  useEventChannel?: boolean;

  /**
   * @description.zh 事件通道名称
   * @description.en Event channel name
   * @default 'lampCirclePickerColorEventChannel'
   */
  eventChannelName?: string;

  /**
   * @description.zh 手指按下时的回调函数
   * @description.en Finger press when the callback function
   * @default ''
   */
  onTouchStart?: (hs: HS) => void;
  /**
   * @description.zh 手指按下拖动时的回调函数
   * @description.en Finger to press the drag of the callback function
   * @default ''
   */
  onTouchMove?: (hs: HS) => void;
  /**
   * @description.zh 手指按下结束时的回调函数
   * @description.en Finger press at the end of the callback function
   * @default ''
   */
  onTouchEnd?: (hs: HS) => void;
  /**
   * @description.en thumbBorderWidth
   * @description.zh 按钮边框宽度
   * @default 2
   * @version 1.0.14
   */
  thumbBorderWidth?: number;

  /**
   * @description.en thumbShadowColor
   * @description.zh 按钮阴影颜色
   * @default rgba(0,0,0,.16)
   * @version 1.0.14
   */
  thumbShadowColor?: string;

  /**
   * @description.en thumbShadowBlur
   * @description.zh 按钮阴影模糊度
   * @default 6
   * @version 1.0.14
   */
  thumbShadowBlur?: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const nilFn = () => null;
export const defaultProps: IProps = {
  hs: {
    h: 0,
    s: 1000,
  },
  thumbRadius: 15,
  radius: 150,
  whiteRange: 0.15,
  onTouchStart: nilFn,
  onTouchMove: nilFn,
  onTouchEnd: nilFn,
  thumbBorderWidth: 2,
};
