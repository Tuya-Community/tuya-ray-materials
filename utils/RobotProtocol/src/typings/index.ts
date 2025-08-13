/**
 * 地图Header
 */
export type MapHeader = {
  /**
   * 原始地图字符串
   */
  mapHeaderStr: string;
  /**
   * 地图协议版本
   */
  version: number;
  /**
   * 地图id
   */
  id: number;
  /**
   * 地图稳定状态（建图分区完成）
   */
  mapStable: boolean;
  /**
   * 地图宽度
   */
  mapWidth: number;
  /**
   * 地图高度
   */
  mapHeight: number;
  /**
   * 地图原点x坐标
   */
  originX: number;
  /**
   * 地图原点y坐标
   */
  originY: number;
  /**
   * 地图分辨率
   */
  mapResolution: number;
  /**
   * 充电桩x坐标
   */
  chargeX: number;
  /**
   * 充电桩y坐标
   */
  chargeY: number;
  /**
   * 充电桩方向 (0x03版本支持)
   */
  chargeDirection?: number;
  /**
   * 相对充电桩坐标（根据原点偏移）
   */
  chargePositionTransformed: { x: number; y: number } | null;
  /**
   * 地图数据长度（lz4压缩前）
   */
  dataLengthBeforeCompress: number;
  /**
   * 地图数据长度（lz4压缩后）
   */
  dataLengthAfterCompress: number;
};

/**
 * 房间信息
 */
export type RoomDecoded = {
  /**
   * 房间id
   */
  roomId: number;
  /**
   * 房间id+点类型组合的hex (00-ff)
   */
  pointHex: string;
  /**
   * 房间名称
   */
  name: string;
  /**
   * 清扫顺序
   */
  order: number;
  /**
   * 吸力
   */
  suction: number;
  /**
   * 水量
   */
  cistern: number;
  /**
   * 颜色顺序
   */
  colorOrder: number;
  /**
   * 清扫次数
   */
  sweepTimes: number;
  /**
   * 拖地次数
   */
  mopTimes: number;
  /**
   * 是否禁止清扫
   */
  sweepForbidden: boolean;
  /**
   * 是否禁止拖地
   */
  mopForbidden: boolean;
  /**
   * 是否开启y字拖
   */
  yMop: boolean;
  /**
   * 房间地板材质
   */
  floorMaterial: number;
  /**
   * 房间原始字符串
   */
  originStr: string;
  /**
   * 房间预留字段
   */
  reservedStr: string;
};
/**
 * 地图数据
 */
export type MapData = {
  /**
   * 房间信息集合
   */
  mapRooms: RoomDecoded[];
  /**
   * 地图点集字符串
   */
  mapPointsStr: string;
};

/**
 * 路径Header
 */
export type PathHeader = {
  /**
   * 路径版本
   */
  version: number;
  /**
   * 一次完整清扫的路径图标识
   */
  pathId: number;
  /**
   * 0x00 正常路径数据上报标志位
   * 0x01 初始化路径ID从00开始标志位（路径ID从00开始的前5个包需使用高标志位上报）
   */
  initFlag: number;
  /**
   * 路径类型
   */
  type: number;
  /**
   * 路径点数量
   */
  count: number;
  /**
   * 机器人朝向
   */
  direction: number;
  /**
   * 路径数据长度（lz4压缩后）
   */
  dataLengthAfterCompress: number;
};
/**
 * 路径点类型
 */
export type PathPointType = 'common' | 'charge' | 'transitions' | 'mop';

/**
 * 路径点
 */
export type PathPoint = {
  /**
   * x坐标
   */
  x: number;
  /**
   * y坐标
   */
  y: number;
  /**
   * 路径点类型
   */
  type: PathPointType;
};
/**
 * 路径数据
 */
export type PathData = {
  /**
   * 路径Header
   */
  pathHeader: PathHeader;
  /**
   * 路径点集
   */
  pathPoints: PathPoint[];
};
/**
 * 标准功能数据数组(byte默认为1)
 */
export type DataArray = (
  | {
      value: number;
      byte?: number;
    }
  | number
  | string
)[];

/**
 * 坐标点
 */
export type Point = {
  x: number;
  y: number;
};
/**
 * 0x00-both_work
 *
 * 0x01-only_sweep
 *
 * 0x02-only_mop
 *
 * 0x03-mop_after_sweep
 */
export type CleanMode = number;
/**
 * 0x00-closed
 * 0x01-gentle
 * 0x02-normal
 * 0x03-strong
 * 0x04-max
 */
export type Suction = number;

/**
 * 0x00-closed
 * 0x01-low
 * 0x02-middle
 * 0x03-high
 */
export type Cistern = number;

/**
 * 0x00-off
 * 0x01-open
 * 0x03-high
 */
export type yMop = number;

/**
 * 0x00 - 矩形
 *
 * 0x01 - 多边形
 */
export type ShapeType = number;

/**
 * 0x00 - 全禁
 *
 * 0x01 - 禁扫
 *
 * 0x02 - 禁拖
 */
export type ForbiddenType = number;

/**
 * 虚拟墙
 */
export type VirtualWall = {
  /**
   * 虚拟墙点集
   */
  points: Point[];
  /**
   * 虚拟墙类型
   */
  mode: ForbiddenType;
};

/**
 * 禁区
 */
export type VirtualArea = {
  /**
   * 禁区点集
   */
  points: Point[];
  /**
   * 禁区类型
   */
  mode: ForbiddenType;
  /**
   * 禁区名称
   */
  name?: string;
};
/**
 * 定点清扫区域
 */
export type Zone = {
  /**
   * 清扫区域点集
   */
  points: Point[];
  /**
   * 清扫区域名称
   */
  name?: string;
  advanced?: {
    id: number;
    localSave: number;
    cleanMode: CleanMode;
    order: number;
    cleanTimes: number;
    suction: Suction;
    cistern: Cistern;
  };
};

export type TimerData = {
  effectiveness: number;
  week: number[];
  time: { hour: number; minute: number };
  roomIds: number[];
  cleanMode;
  fanLevel: number;
  waterLevel: number;
  sweepCount: number;
  roomNum: number;
  mapId?: number;
  zoneIds?: number[];
};

export type AiPicInfo = {
  id: string;
  mapId: number;
  position: { x: number; y: number };
  object: number;
  accuracy: number;
  reserved: number;
  xHex: string;
  yHex: string;
};

export type AIPicHD = {
  source: string;
};

/**
 * 房间属性 0x22/23 & 0x58/59
 */
export type RoomProperty = {
  roomHexId?: string;
  roomId?: number;
  cleanTimes: number;
  yMop: yMop | 'ff';
  suction: Suction | 'ff';
  cistern: Cistern | 'ff';
  cleanMode?: CleanMode;
};

export type AIObject = {
  point: Point;
  type: number;
};
