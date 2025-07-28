export interface IProps {
  /**
   * @description.zh canvasId
   * @description.en canvasId
   * @default
   */
  canvasId: string;
  /**
   * @description.zh 默认数值
   * @description.en default value
   * @default
   */
  value: number;
  /**
   * @description.zh 是否隐藏拖拽圆环
   * @description.en Whether to hide the drag ring
   * @default false
   */
  hideThumb: boolean;
  /**
   * @description.zh 内部色环宽度
   * @description.en Drag the color ring width
   * @default 80
   */
  innerRingRadius?: number;
  /**
   * @description.zh 色盘宽度
   * @description.en Color plate width
   * @default 140
   */
  radius?: number;

  /**
   * @description.zh 注意⚠️：基础库版本大于2.18.0, 是否启用事件通道，当多个 rjs 组件同时使用时，用于优化 rjs 间数据传输时的性能问题
   * @description.en Note ⚠️ : The base library version is greater than 2.18.0， Whether to enable event channels to optimize the performance of data transfer between rjs when multiple rjs components are used simultaneously
   * @default false
   */
  useEventChannel?: boolean;

  /**
   * @description.zh 绘制的圆环末端样式
   * @description.en Drawn ring end style
   * @default round
   */
  lineCap?: 'butt' | 'round';

  /**
   * @description.zh 色盘渐变颜色列表
   * @description.en Color plate gradient color list
   */
  colorList?: {
    offset: number;
    color: string;
  }[];

  /**
   * @description.zh 事件通道名称
   * @description.en Event channel name
   * @default 'lampCirclePickerEventChannel'
   */
  eventChannelName?: string;

  /**
   * @description.zh 手指按下时的回调函数
   * @description.en Finger press when the callback function
   * @default ''
   */
  onTouchStart?: (value: number) => void;
  /**
   * @description.zh 手指按下拖动时的回调函数
   * @description.en Finger to press the drag of the callback function
   * @default ''
   */
  onTouchMove?: (value: number) => void;
  /**
   * @description.zh 手指按下结束时的回调函数
   * @description.en Finger press at the end of the callback function
   * @default ''
   */
  onTouchEnd?: (value: number) => void;
  /**
   * @description.en touchCircleStrokeStyle
   * @description.zh 触摸圆环描边颜色
   * @default ''
   */
  touchCircleStrokeStyle?: string;
  /**
   * @description.en touchCircleLineWidth
   * @description.zh 触摸圆环描边宽度
   * @default 0
   */
  touchCircleLineWidth?: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const nilFn = () => null;
export const defaultProps: IProps = {
  value: 0,
  innerRingRadius: 80,
  radius: 140,
  colorList: [
    {
      offset: 0,
      color: '#FFCD65',
    },
    {
      offset: 0.7,
      color: '#FEECAB',
    },
    {
      offset: 1,
      color: '#CEEDFF',
    },
  ],
  useEventChannel: false,
  eventChannelName: 'lampCirclePickerEventChannel',
  onTouchStart: nilFn,
  onTouchMove: nilFn,
  onTouchEnd: nilFn,
  touchCircleStrokeStyle: null,
  touchCircleLineWidth: null,
};
