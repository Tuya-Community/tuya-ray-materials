// import Strings from '@/i18n';

export const DEV_INFO_CHANGE = '_DEVINFOCHANGE_';
export const DEVICE_INFO_CHANGE = '_DEVICEINFOCHANGE_';
export const RESPONSE_UPDATE_DP = 'RESPONSE_UPDATE_DP';
export const CHANGE_DP = 'CHANGE_DP';

export const MODE_ICON_MAP = {
  nature: 'icon-panel-sun',
  sleep: 'icon-panel-moon',
  fresh: 'icon-panel-leaf',
  smart: 'icon-panel-auto',
  strong: 'icon-panel-fan',
};

export const FAN_DIRECTION_MAP = {
  forward: 'icon-panel-arrowRight',
  reverse: 'icon-panel-reverse',
};

export const COMPLEX_COLOR_MAP = [
  {
    name: 'hue',
    bytes: 2,
  },
  {
    name: 'saturation',
    bytes: 2,
  },
  {
    name: 'value',
    bytes: 2,
  },
  {
    name: 'brightness',
    bytes: 2,
  },
  {
    name: 'temperature',
    bytes: 2,
  },
];

export const CONTROL_MAP = [
  {
    name: 'mode',
    bytes: 0.5,
  },
  ...COMPLEX_COLOR_MAP,
];

export const DEFAULT_TIMING_CATEGORY = 'fs';

export const WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

// 离线文件传输通道
export const CHANNEL_TYPES = {
  wifi: 2, // 2 代表wifi通道快传
  bluetooth: 1, // 1 代表蓝牙通道
  none: 0, // 0 代表无通道,通常是结束下载时传入使用
};
// 离线文件传输状态
export const STATUS_TYPES = {
  beforeStart: 0, // 0 未开始
  start: 1, // 1 代表成功
  end: 2, // 2 代表失败
};
// agent相关维护，后面根据提供的sdk获取agentId
export const AGENTS = {
  AY: '',
  AZ: '',
};

// 币种
export const CURRENCY_MARK_MAP = {
  USD: '$',
  JPY: '¥',
  CNY: '¥',
  EUR: '€',
  GBP: '£',
};
