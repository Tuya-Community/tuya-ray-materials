import Strings from '../i18n';

export const RTC_TIMER_LIST = 'RTC_TIMER_LIST_KEYS';

// 仅一次
export const onlyOneLoop = '0000000';
// 每天
export const everydayLoop = '1111111';

export const actionSheetConfig = {
  backgroundColor: '#262626', // 组件背景色
  textColor: '#fff', // 文字颜色
  splitColor: 'rgba(255, 255, 255, 0.1)', // 边框、分割线颜色
  headerColor: 'rgba(255, 255, 255, 0.5)', // 标题文字颜色
};
export const cellConfig = {
  backgroundColor: '#262626', // 组件背景色
  textColor: '#fff', // 文字颜色
  splitColor: 'rgba(255, 255, 255, 0.1)', // 边框、分割线颜色
};

export const weekList: { label: string; value: number }[] = [
  {
    label: Strings.getLang('sun'),
    value: 7,
  },
  {
    label: Strings.getLang('mon'),
    value: 1,
  },
  {
    label: Strings.getLang('tue'),
    value: 2,
  },
  {
    label: Strings.getLang('wed'),
    value: 3,
  },
  {
    label: Strings.getLang('thu'),
    value: 4,
  },
  {
    label: Strings.getLang('fri'),
    value: 5,
  },
  {
    label: Strings.getLang('sat'),
    value: 6,
  },
];

const switchCode = 'switch_led';
type TAction = {
  label: string;
  value: any;
  dpList: {
    value: any;
    code: string;
  }[];
  renderCustomActionText?: () => React.ReactElement;
};
export const defaultActionList: TAction[] = [
  {
    label: Strings.getLang('turnOn'), // 开启设备
    value: 1,
    dpList: [
      {
        value: true,
        code: switchCode,
      },
    ],
  },
  {
    label: Strings.getLang('turnOff'), // 关闭
    value: 0,
    dpList: [
      {
        value: false,
        code: switchCode,
      },
    ],
  },
];

export const defaultCycleList = [
  {
    label: Strings.getLang('everyday'),
    value: 0,
  },
  {
    label: Strings.getLang('once'),
    value: 1,
  },
  {
    label: Strings.getLang('customTitle'),
    value: 2,
  },
];
