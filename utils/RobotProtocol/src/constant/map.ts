// 所有可能的hex总数 (point占1字节)
export const POINT_HEX_TOTAL = 255;
// 房间属性占26字节
export const ROOM_PROPERTY_LENGTH = 26;
// 房间名占20字节
export const ROOM_NAME_LENGTH = 20;
// 房间顶点数占1字节
export const ROOM_VERTICES_NUM_LENGTH = 1;

/**
 * 默认标准高亮色
 */
export const DEFAULT_HIGHLIGHT_MAP_COLOR = [
  '#FDE4CF',
  '#8EECF5',
  '#CFBAF0',
  '#F1C0E8',
  '#A3C4F3',
  '#98F5E1',
  '#FFCFD2',
  '#90DBF4',
  '#E1C1EB',
  '#8ECCF5',
  '#EDDDDE',
  '#A3B8F3',
  '#EFCFE1',
  '#B2F2BE',
  '#AEE6F8',
  '#90C2F4',
];

/**
 * 默认标准灰色
 */
export const DEFAULT_NORMAL_MAP_COLOR = [
  '#EBEBEB',
  '#E4E4E4',
  '#DCDCDC',
  '#D5D5D5',
  '#CECECE',
  '#C6C6C6',
  '#C2C2C2',
  '#BABABA',
  '#E2E2E2',
  '#DBDBDB',
  '#D3D3D3',
  '#CCCCCC',
  '#C6C6C6',
  '#BEBEBE',
  '#BABABA',
  '#B3B3B3',
];

/**
 * 地图数据对应的类型点(十六进制)
 * 普通版本(version:00)
 */
export const BITMAP_TYPE_HEX_MAP = {
  '00': '00', // 可清扫区/无障碍区
  '01': 'f1', // 障碍物
  '10': 'f2', // 未使用
  '11': 'ff', // 未知区/背景
} as const;

/**
 * 地图数据对应的类型点
 * 普通版本/分区版本(version:00/01)
 */
export const BITMAP_TYPE_MAP = {
  sweep: '00', // 可清扫区/无障碍区
  barrier: '01', // 障碍物
  battery: '10', // 未使用
  unknown: '11', // 未知区/背景
} as const;

/**
 * 地图数据对应的类型点
 * 地毯版本(version:02&03)
 */
export const BITMAP_TYPE_MAP_V2 = {
  sweep: '111', // 可清扫区/无障碍区
  barrier: '001', // 障碍物
  carpet: '010', // 地毯
  unknown: '000', // 未知区/背景
} as const;

export const MAP_VERSION_MAP = {
  0: {
    typeMap: BITMAP_TYPE_MAP,
  },
  1: {
    typeMap: BITMAP_TYPE_MAP,
  },
  2: {
    typeMap: BITMAP_TYPE_MAP_V2,
  },
  3: {
    typeMap: BITMAP_TYPE_MAP_V2,
  },
} as const;

/**
 * 地图数据点对应的类型
 */
export const BITMAP_TYPE_MAP_REFLECTION = {
  '00': 'sweep', // 可清扫区/无障碍区(version:00/01)
  '01': 'barrier', // 障碍物(version:00/01)
  '10': 'battery', // 未使用(version:00/01)
  '11': 'unknown', // 未知区/背景(version:00/01)
  '111': 'sweep', // 可清扫区/无障碍区(version:02)
  '001': 'barrier', // 障碍物(version:02)
  '000': 'unknown', // 未知区/背景(version:02)
  '010': 'carpet', // 地毯(version:02)
} as const;

export const UNKNOWN_AREA_ID = [60, 61, 62, 63];
export const UNKNOWN_AREA_ID_V2 = [28, 29, 30, 31];
