export interface IProps {
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
   * @description.en value
   * @description.zh 数值
   * @default 0
   */
  value?: number;
  /**
   * @description.en callback when value change
   * @description.zh 数值变化时回调
   * @default null
   */
  onChange?(value: number): void;
  /**
   * @description.en callback when touchend
   * @description.zh 松手时回调
   * @default null
   */
  onTouchEnd?(value: number): void;
  /**
   * @description.en showButtons
   * @description.zh 展示控件
   * @default false
   */
  showButtons?: boolean;
  /**
   * @description.en step
   * @description.zh 间隔
   * @default 1
   */
  step?: number;
  /**
   * @description.en text color
   * @description.zh 文字颜色
   * @default rgba(0, 0, 0, 0.9)
   */
  textColor?: string;
  /**
   * @description.en bg text color
   * @description.zh 背景层文字颜色
   * @default rgba(0, 0, 0, 0.9)
   */
  bgTextColor?: string;
  /**
   * @description.en bar color
   * @description.zh 滚动条颜色
   * @default linear-gradient(270deg, #7f66ef -14.11%, #fff 100%)
   */
  barColor?: string;
  /**
   * @description.en track color
   * @description.zh 滑槽颜色
   * @default #e0e0e0
   */
  trackColor?: string;
  /**
   * @description.en button background color
   * @description.zh 按钮背景色
   * @default #fff
   */
  buttonBackground?: string;
  /**
   * @description.en border color
   * @description.zh 边框色
   * @default rgba(0, 0, 0, 0.1)
   */
  borderColor?: string;
  /**
   * @description.en 是否展示右侧数值
   * @description.zh 是否展示左侧 icon
   * @default true
   */
  showIcon?: boolean;
  /**
   * @description.en 是否展示右侧文本
   * @description.zh 是否展示右侧文本
   * @default true
   */
  showText?: boolean;
  /**
   * @description.en max
   * @description.zh 最大值
   * @default 100
   */
  max?: number;
  /**
   * @description.en max
   * @description.zh 最大值
   * @default 0
   */
  min?: number;
  /**
   * @description.en id
   * @description.zh id
   */
  instanceId?: string;
  /**
   * @description.en debug
   * @description.zh debug
   * @default false
   */
  debug?: boolean;
  /**
   * @description.en hide
   * @description.zh hide
   * @default false
   */
  hidden?: boolean;
  /**
   * @description.en barStyle
   * @description.zh 滑条样式
   */
  barStyle?: React.CSSProperties;
  /**
   * @description.en trackStyle
   * @description.zh 轨道样式
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.en hotAreaStyle
   * @description.zh 点击热区样式
   */
  hotAreaStyle?: React.CSSProperties;
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
   * @description.en Scaling for displaying values
   * @description.zh 展示数值时的缩放
   * @default 1
   */
  textValueScale?: number;
  /**
   * @description.en Decimal retention method after valueScale processing
   * @description.zh valueScale处理后的小数保留方式
   * @default round
   */
  valueScaleMathType?: 'round' | 'ceil' | 'floor';
  /**
   * @description.en bgTextStyle
   * @description.zh 文字样式
   */
  bgTextStyle?: React.CSSProperties;
  /**
   * @description.en Percentage Container Style
   * @description.zh 百分比容器样式
   * @default null
   */
  textWrapStyle?: React.CSSProperties;
}

export const defaultProps: IProps = {
  startEventName: null,
  moveEventName: null,
  endEventName: null,
  bgTextColor: 'rgba(0, 0, 0, 0.9)',
  bgTextStyle: {},
  className: '',
  style: null,
  value: 0,
  onChange: null,
  onTouchEnd: null,
  showButtons: false,
  step: 1,
  textColor: 'rgba(0, 0, 0, 0.9)',
  barColor: 'linear-gradient(270deg, #7f66ef -14.11%, #fff 100%)',
  trackColor: '#e0e0e0',
  buttonBackground: '#fff',
  borderColor: 'rgba(0, 0, 0, 0.1)',
  showIcon: true,
  showText: true,
  max: 100,
  min: 0,
  instanceId: null,
  debug: false,
  hidden: false,
  barStyle: null,
  trackStyle: null,
  hotAreaStyle: null,
  textValueScale: 1,
  valueScaleMathType: 'round',
  textWrapStyle: null,
};
