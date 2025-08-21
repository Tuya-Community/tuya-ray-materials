import { TimerData } from './types';

export type TTimer = {
  status: any;
  time: string;
  loops: string;
  dps: Record<string, any>;
  id?: string;
  timerId?: string;
};

export interface IProps {
  /**
   * @description.zh 组件样式
   * @description.en Component style
   * @default {}
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 设置主题样式
   * @description.en Set theme style
   * @default {}
   */
  themeConfig?: {
    // 整体背景色
    background?: string;
    // 主题
    theme?: 'light' | 'dark';
    // 品牌色
    brandColor?: string;
    // 字体颜色
    fontColor?: {
      titlePrimary?: string; // 主要标题文字颜色
      textPrimary?: string; // 主要文字颜色
      textRegular?: string; // 常规文字颜色
    };
    // 卡片样式
    card?: {
      background?: string;
      borderColor?: string;
      textPrimary?: string;
      textRegular?: string;
    };
    // 时间选择器样式
    timer?: {
      background?: string;
      timerPickerBorderColor?: string;
      customStyle?: {
        color?: string;
        borderColor?: string;
        boxShadowColor?: string;
        background?: string;
      };
    };
  };
  /**
   * @description.zh 是否展示顶部导航栏
   * @description.en Whether to display the top navigation bar
   * @default
   */
  showHeader?: boolean;
  /**
   * @description.zh 是否展示胶囊按钮
   * @description.en Whether to display the capsule button
   * @default true 默认展示
   */
  showMenuButton?: boolean;
  /**
   * @description.zh 自定义计划包裹层的样式
   * @description.en Customize the style of the planned wrap layer
   * @default {}
   */
  customItemContainerStyle?: React.CSSProperties;
  /**
   * @description.zh 设备id, 如果是单设备传入devId，如果群组传入groupId
   * @description.en Device id
   * @default
   */
  devId?: string;
  /**
   * @description.zh 群组设备id,如果是单设备传入devId，如果群组传入groupId
   * @description.en Group id
   * @default
   */
  groupId?: string;
  /**
   * @description.zh 是否支持倒计时
   * @description.en Whether to support the countdown
   * @default false
   */
  supportCountdown?: boolean;
  /**
   * @description.zh 是否支持本地定时
   * @description.en Whether to support the local time
   * @default false
   */
  supportRctTimer?: boolean; // 是否支持本地定时
  /**
   * @description.zh 是否支持云定时,如果云定时和本地定时都支持，本地定时优先级更高
   * @description.en Whether to support the cloud, if cloud timed and local support, local time higher priority
   * @default false
   */
  supportCloudTimer?: boolean;
  /**
   * @description.zh 渲染自定义计划的功能
   * @description.en The ability to render custom plans
   * @default {}
   */
  renderCustomItem?: () => React.ReactElement;
  /**
   * @description.zh 定时功能配置项
   * @description.en Timing function configuration items
   * @default {}
   */
  timingConfig?: {
    timerLimitNum?: number; // 默认本地定时10个，云端定时30个
    actionList?: {
      label: string; // 标题
      // 选中行为需要保存的dp列表
      dpList: {
        value: string | number | boolean; // dp值
        code: string; // dp code
        id: number; // dp id
      }[];
      type?: 'custom'; // 自定义复杂场景动作
      callback?: (res: TTimer) => void; // 自定义复杂场景动作的回调函数
      renderCustomActionText?: () => string; // 自定义渲染复杂场景动作的文本
    }[];
  };
  /**
   * @description.zh 倒计时功能配置项
   * @description.en The countdown function configuration items
   * @default {}
   */
  countdownConfig?: {
    countdown: number; // 倒数计剩余秒数
  };
  /**
   * @description.zh 倒计时切换时的回调函数
   * @description.en The countdown when switching the callback function
   * @param countdown: 倒数计数值 单位以s计数 / Countdown numerical unit s count
   * @default
   */
  onCountdownToggle?: (countdown: number) => void;
  /**
   * @description.zh 定时数据被修改之前触发，如果返回false，将不会触发后续逻辑，一般用于定时数据的校验
   * @description.en Timing trigger before data is modified, if return false， it will do not trigger after logic, commonly used in data check regularly
   * @default
   */
  onBeforeTimerChange?: (
    timerData: TimerData | TimerData[],
    type: 'add' | 'remove' | 'update' | 'init',
    timerList: TimerData[] // 总定时任务列表
  ) => boolean | Promise<boolean>;
  /**
   * @description.zh 添加本地定时的回调
   * @description.en Add local regular callback
   * @default
   */
  onRtcTimeAdd?: (timerData: TimerData) => void;
  /**
   * @description.zh 删除本地定时的回调
   * @description.en Delete local regular callback
   * @default
   */
  onRtcTimeRemove?: (timerData: TimerData) => void;
  /**
   * @description.zh 更新本地定时的回调
   * @description.en Update the local regular callback
   * @default
   */
  onRtcTimeUpdate?: (timerData: TimerData) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const nilFn = () => null;
export const defaultProps: IProps = {
  devId: '',
  groupId: '',
  supportCountdown: false,
  supportRctTimer: false,
  supportCloudTimer: false,
  timingConfig: {},
  countdownConfig: {
    countdown: 0,
  },
  onCountdownToggle: nilFn,
  onRtcTimeAdd: nilFn,
  onRtcTimeRemove: nilFn,
  onRtcTimeUpdate: nilFn,
};
