import base64Imgs from '@/res/base64Imgs';
import { convertColorToArgbHex } from '@ray-js/robot-protocol';
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';

export const SYSTEM_INFO = 'SYSTEM_INFO';
export const THEME_COLOR = '#3a9';
/**
 * 小程序使用的App日志的tag，有需要可以自行更改，用于后期遇到线上问题，通过上传App日志检索该tag进行问题定位
 */
export const APP_LOG_TAG = 'ROBOT_PANEL';

export const APP_MULTIPLE_MAP_CACHE_DIR = ty.env.USER_DATA_PATH + '/';

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

export const VIDEO_CLARIFY = { 2: 'normal', 4: 'hd' } as const;

export const DEFAULT_VIRTUAL_WALL_LINE_COLOR = '#FF4444';
export const DEFAULT_VIRTUAL_WALL_LINE_WIDTH = 2;
export const DEFAULT_VIRTUAL_WALL_CONFIG = {
  line: {
    bgColor: '#FF4444',
    lineWidth: 2,
  },
  vertex: {
    showVertexImage: false,
    vertexType: 'square',
    vertexColor: convertColorToArgbHex('#FF4444'),
    radius: 3,
    vertexExtendTimes: 3,
  },
  sideVertex: {
    showSideVertex: true,
    showSideVertexImage: true,
    sideVertexImage: base64Imgs.rDeleteBase64Img,
    sideVertexColor: '#ffffffff',
    radius: 4,
  },
  unit: {
    textColor: '#00ffffff',
  },
  viewType: '',
  type: ENativeMapStatusEnum.virtualWall,
  extend: JSON.stringify({
    forbidType: 'sweep',
    isWall: true,
  }),
};

export const DEFAULT_VIRTUAL_AREA_NO_GO_BG_COLOR = 'rgba(255, 68, 68, 0.05)';
export const DEFAULT_VIRTUAL_AREA_NO_GO_BORDER_COLOR = 'rgba(255, 68, 68, 1)';
export const DEFAULT_VIRTUAL_AREA_NO_GO_MIN_AREA_WIDTH = 10;
export const DEFAULT_VIRTUAL_AREA_NO_GO_CONFIG = {
  box: {
    bgColor: convertColorToArgbHex(DEFAULT_VIRTUAL_AREA_NO_GO_BG_COLOR),
    borderColor: convertColorToArgbHex(DEFAULT_VIRTUAL_AREA_NO_GO_BORDER_COLOR),
    isDash: false,
    minAreaWidth: DEFAULT_VIRTUAL_AREA_NO_GO_MIN_AREA_WIDTH,
  },
  content: {
    text: '',
    textColor: convertColorToArgbHex('#fff'),
    textSize: 10,
    renameEnable: false,
    rotateEnable: true,
  },
  vertex: {
    showVertexImages: true,
    vertexImages: [
      base64Imgs.rDeleteBase64Img,
      base64Imgs.rRotateBase64Img,
      base64Imgs.rResizeBase64Img,
    ],
  },
  unit: {
    // 如果不支持单位显示，就设置为透明色字号
    textColor: 'rgba(255, 68, 68, 1)',
  },
  type: ENativeMapStatusEnum.virtualArea,
  viewType: 'dashEdit',
  extend:
    JSON.stringify({
      forbidType: 'sweep',
    }) || '',
};

export const DEFAULT_VIRTUAL_AREA_NO_MOP_BG_COLOR = 'rgba(254, 138, 7, 0.2)';
export const DEFAULT_VIRTUAL_AREA_NO_MOP_BORDER_COLOR = 'rgba(254, 138, 7, 1)';
export const DEFAULT_VIRTUAL_AREA_NO_MOP_MIN_AREA_WIDTH = 10;
export const DEFAULT_VIRTUAL_AREA_NO_MOP_CONFIG = {
  box: {
    bgColor: convertColorToArgbHex(DEFAULT_VIRTUAL_AREA_NO_MOP_BG_COLOR),
    borderColor: convertColorToArgbHex(DEFAULT_VIRTUAL_AREA_NO_MOP_BORDER_COLOR),
    isDash: false,
    minAreaWidth: DEFAULT_VIRTUAL_AREA_NO_MOP_MIN_AREA_WIDTH,
  },
  content: {
    text: '',
    textColor: convertColorToArgbHex('#fff'),
    textSize: 10,
    renameEnable: false,
    rotateEnable: true,
  },
  vertex: {
    showVertexImages: true,
    vertexImages: [
      base64Imgs.oDeleteBase64Img,
      base64Imgs.oRotateBase64Img,
      base64Imgs.oResizeBase64Img,
    ],
  },
  unit: {
    // 如果不支持单位显示，就设置为透明色字号
    textColor: DEFAULT_VIRTUAL_AREA_NO_MOP_BORDER_COLOR,
  },
  type: ENativeMapStatusEnum.virtualArea,
  viewType: 'dashEdit',
  extend:
    JSON.stringify({
      forbidType: 'mop',
    }) || '',
};
