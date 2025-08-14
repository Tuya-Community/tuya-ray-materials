export interface IProps {
  /**
   * @description.zh 设备开关状态
   * @description.en Device switch status
   * @default true
   */
  power: boolean;
  /**
   * @description.zh 是否是暗黑模式
   * @description.en Whether it is a dark mode
   * @default true
   */
  isDarkTheme?: boolean;
  /**
   * @description.zh 自定义 CSS 类名
   * @description.en Custom CSS class name
   * @default ''
   */
  className?: string;
  /**
   * @description.zh 自定义内联样式
   * @description.en Custom inline styles
   * @default {}
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 倒计时 dp 值
   * @description.en countdown dp value
   * @default ''
   */
  countdownDp: number; // Note: 'Dp' meaning might need clarification based on usage.
  /**
   * @description.zh 剩余倒计时时间 单位：s
   * @description.en Remaining countdown time，unit: s
   * @default ''
   */
  restCountdown: number; // Note: This prop's purpose might need clarification.
  /**
   * @description.zh 背景图片 URL
   * @description.en Background image URL
   * @default ''
   */
  bgImg?: string;
  /**
   * @description.zh 背景颜色
   * @description.en Background color
   * @default ''
   */
  bgColor?: string;
  /**
   * @description.zh 主题色
   * @description.en Theme color
   * @default '#3b82f7'
   */
  themeColor?: string;
  /**
   * @description.zh 字体颜色
   * @description.en Font color
   * @default '#fff'
   */
  fontColor?: string;
  /**
   * @description.zh 倒计时显示类型：'hourMinute'（最大单位为小时）或 'minuteSecond'（最大单位为分钟）
   * @description.en Countdown display type: 'hourMinute' (max unit: hours) or 'minuteSecond' (max unit: minutes)
   * @default 'hourMinute'
   */
  type?: 'hourMinute' | 'minuteSecond';
  /**
   * @description.zh 倒计时圆环背景色
   * @description.en Countdown ring background color
   * @default rgba(255, 255, 255, 0.1)
   */
  circleBgColor?: string;
  /**
   * @description.zh 确认按钮点击回调函数
   * @description.en Callback function triggered on confirm button click, receives remaining seconds as argument
   * @default ''
   */
  onConfirm: (seconds: number) => void;
  /**
   * @description.zh 取消按钮点击的回调函数
   * @description.en Callback function triggered on cancel button click
   * @default ''
   */
  onCancel: () => void;
  /**
   * @description.zh 倒计时关闭回调函数
   * @description.en The countdown closes the callback function
   * @default ''
   */
  onClose: () => void;
}
