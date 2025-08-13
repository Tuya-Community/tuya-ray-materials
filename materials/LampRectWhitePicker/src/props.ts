export interface IProps {
  /**
   * @description.zh 色盘的id，如果添加id可以记忆之前选中的位置，否则滑块会默认居中, 如果一个页面有多个色盘，canvasId 需要保证唯一
   * @description.en The id of the color disk, if you add the id to remember the previously selected position, otherwise the slider will default to center
   * @default ''
   */
  canvasId?: string;
  /**
   * @description.zh 色盘色温 范围：0 - 1000， 具体数据K值由嵌入式端实现
   * @description.en Color disk color temperature range: 0-1000, the specific data k value is realized by the embedded end
   * @default 1000
   */
  temp: number;
  /**
   * @description.zh 拖动的色圈宽度
   * @description.en Drag the color ring width
   * @default 12
   */
  thumbRadius?: number;
  /**
   * @description.zh 色盘宽度
   * @description.en Color plate width
   * @default 319
   */
  rectWidth?: number;
  /**
   * @description.zh 色盘高度
   * @description.en Color plate height
   * @default 142
   */
  rectHeight?: number;
  /**
   * @description.zh 圆角值
   * @description.en Fillet value
   * @default 20
   */
  borderRadius?: number;
  /**
   * @description.zh 圆角样式，优先级高于 borderRadius 属性
   * @description.en Fillet value
   * @default
   */
  borderRadiusStyle?: string;
  /**
   * @description.zh 提示语样式
   * @description.en prompt Style
   * @default ''
   */
  colorTipStyle?: string;
  /**
   * @description.zh 是否当前色值
   * @description.en Whether the current color text
   * @default true
   */
  isShowTip?: boolean;
  /**
   * @description.zh 展示关闭状态，仍可操作
   * @description.en Displays the closed status and can still be operated
   * @default false
   * @version 1.1.15
   */
  closed?: boolean;
  /**
   * @description.zh 注意⚠️：基础库版本大于2.18.0, 是否启用事件通道，当多个 rjs 组件同时使用时，用于优化 rjs 间数据传输时的性能问题
   * @description.en Note ⚠️ : The base library version is greater than 2.18.0， Whether to enable event channels to optimize the performance of data transfer between rjs when multiple rjs components are used simultaneously
   * @default false
   */
  useEventChannel?: boolean;

  /**
   * @description.zh 事件通道名称
   * @description.en Event channel name
   * @default 'lampRectPickerColorEventChannel'
   */
  eventChannelName?: string;

  /**
   * @description.zh 手指按下时的回调函数
   * @description.en Finger press when the callback function
   * @default ''
   */

  onTouchStart?: (temp: number) => void;
  /**
   * @description.zh 手指按下拖动时的回调函数
   * @description.en Finger to press the drag of the callback function
   * @default ''
   */
  onTouchMove?: (temp: number) => void;
  /**
   * @description.zh 手指按下结束时的回调函数
   * @description.en Finger press at the end of the callback function
   * @default ''
   */
  onTouchEnd?: (temp: number) => void;
  /**
   * @description.en brightValue for eventChannel
   * @description.zh 亮度值，用于eventChannel发送
   * @default null
   */
  brightValue?: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const nilFn = () => null;
export const defaultProps: IProps = {
  thumbRadius: 12,
  rectWidth: 319,
  rectHeight: 142,
  onTouchStart: nilFn,
  onTouchMove: nilFn,
  onTouchEnd: nilFn,
  temp: 1000,
};
