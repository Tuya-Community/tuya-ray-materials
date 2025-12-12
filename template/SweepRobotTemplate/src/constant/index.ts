import { DeepPartialAppConfig } from '@ray-js/robot-map';
import { getSystemInfoSync } from 'ray';

export const SYSTEM_INFO = 'SYSTEM_INFO';
export const THEME_COLOR = '#3a9';
/**
 * 小程序使用的App日志的tag，有需要可以自行更改，用于后期遇到线上问题，通过上传App日志检索该tag进行问题定位
 */
export const APP_LOG_TAG = 'ROBOT_PANEL';

export const APP_MULTIPLE_MAP_CACHE_DIR = (ty as any).env.USER_DATA_PATH + '/';

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

export const VIDEO_CLARIFY = { 2: 'normal', 4: 'hd' } as const;

export const MAP_CONFIG: DeepPartialAppConfig = {
  global: {
    containerHeight: '100%',
    containerWidth: '100%',
  },
  map: {
    autoPaddingHorizontalPercent: 0.02,
    autoPaddingVerticalPercent: 0.02,
    obstacleColor: '#b9c4d0',
  },
  snapshot: {
    resolution: getSystemInfoSync().pixelRatio || 2,
  },
  robot: {
    speed: 0,
  },
  controls: {
    cleanZone: {
      minSize: 0.5,
    },
    forbiddenSweepZone: {
      minSize: 0.5,
    },
    forbiddenMopZone: {
      minSize: 0.5,
    },
    virtualWall: {
      minWidth: 0.5,
    },
    spot: {
      size: 1.6,
    },
  },
};
