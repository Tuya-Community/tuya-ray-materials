export const SYSTEM_INFO = 'SYSTEM_INFO';
export const THEME_COLOR = '#3a9';
/**
 * 小程序使用的App日志的tag，有需要可以自行更改，用于后期遇到线上问题，通过上传App日志检索该tag进行问题定位
 */
export const APP_LOG_TAG = 'ROBOT_PANEL';

/**
 * 指令协议版本 0 | 1
 */
export const PROTOCOL_VERSION = '1';

export const MODE_VALUE_MAP = {
  0: 'smart',
  1: 'selectRoom',
  2: 'pose',
  3: 'zone',
} as const;

// 虚拟区域支持添加的最大数量
export const ALL_ZONE_MUN_MAX = 100;
export const SUCTION_MAP: Record<Suction, { code: Suction; value: number }> = {
  closed: {
    value: 0,
    code: 'closed',
  },
  gentle: {
    value: 1,
    code: 'gentle',
  },
  normal: {
    value: 2,
    code: 'normal',
  },
  strong: {
    value: 3,
    code: 'strong',
  },
  max: {
    value: 4,
    code: 'max',
  },
} as const;

export const CISTERN_MAP: Record<Cistern, { code: Cistern; value: number }> = {
  closed: {
    value: 0,
    code: 'closed',
  },
  low: {
    value: 1,
    code: 'low',
  },
  middle: {
    value: 2,
    code: 'middle',
  },
  high: {
    value: 3,
    code: 'high',
  },
} as const;
