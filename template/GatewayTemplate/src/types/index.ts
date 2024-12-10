import { useRequest } from 'ahooks';
import { getGatewayAbility } from '@/api';

export type DevInfo = ty.device.DeviceInfo;

export type GetUseRequestOptions<TData, TParams extends any[]> = Parameters<
  typeof useRequest<TData, TParams>
>[1];

export type GetUseRequestResult<TData, TParams extends any[]> = ReturnType<
  typeof useRequest<TData, TParams>
>;

export type UnPromisify<T> = T extends Promise<infer R> ? R : never;

export type GetGatewayAbilityResponse = UnPromisify<ReturnType<typeof getGatewayAbility>>;

// eslint-disable-next-line no-shadow
export enum DeviceManageOptions {
  /** 搜索添加 */
  addNewDevice = 0,
  /** 关联子设备 */
  associateDevice = 1,
  /** 取消关联子设备 */
  disassociateDevice = 2,
  /** 迁移到其他网关 */
  migrateToOtherGateways = 3,
  /** matter的扫码添加设备 */
  matterScanAdd = 4,
}

export interface ExtraInfo {
  /** 底部按钮点击后出现的菜单 */
  manageMenuList?: number[];
  /** 子设备列表显示指定能力的设备 */
  deviceCapabilities?: DeviceCapability[];
  /** 是否显示快捷开关 */
  showQuickSwitch?: boolean;
}

export interface MenuItem {
  label?: string;
  value: DeviceManageOptions;
}

export interface DisplayedDevItem extends DevInfo {
  hasBle: boolean;
  hasZigbee: boolean;
  hasThread: boolean;
  isShowMore: boolean;
  quickSwitchImage?: string;
  roomName?: string;
  switchDpsStatus?: boolean;
  typeIcon?: string;
  isWriteOnly?: boolean;
  iconUrl: string;
}

export interface Option {
  label: string;
  value: string | number;
}

/** 拖拽页面的操作类型 */
export enum OperationType {
  /** 绑定 */
  associate = 1,
  /** 解绑 */
  disassociate = 2,
  /** 迁移 */
  migrate = 3,
}

/** 拖拽页面各操作类型配置 */
export interface IOperationConfig {
  title: string;
  buttonText: string;
  progressTitle: string;
  progressPrompt: string;
  getProgressResultTitle: (v: string) => string;
  getProgressResultPrompt: (v: string) => string;
  onButtonClick: () => void;
}

/**
 * @description.zh 设备能力值标位
 * @description.en Enumeration of device capability bits
 */
export enum DeviceCapability {
  /** Wi-Fi */
  WIFI = 0,
  /** cable（以太网） */
  CABLE = 1,
  /** gprs（2/3/4G） */
  GPRS = 2,
  /** NB-IOT */
  NBIOT = 3,
  /** 蓝牙BLE */
  BLUETOOTH = 10,
  /** 涂鸦mesh */
  BLEMESH = 11,
  /** zigbee */
  ZIGBEE = 12,
  /** infrared（红外） */
  INFRARED = 13,
  /** subpieces（315，433等） */
  SUBPIECES = 14,
  /** Sigmesh */
  SIGMESH = 15,
  /** MCU */
  MCU = 16,
  /** 涂鸦Sub-G Mesh */
  TYMESH = 17,
  /** Zwave */
  ZWAVE = 18,
  /** 蓝牙mesh */
  PLMESH = 19,
  /** LTE Cat1 */
  CAT1 = 20,
  /** 蓝牙beacon */
  BEACON = 21,
  /** CAT4 */
  CAT4 = 22,
  /** CAT10 */
  CAT10 = 23,
  /** LTE CATM */
  CATM = 24,
  /** tread */
  THREAD = 25,
}

/** 网关管理子设备的能力值标位 */
export enum ProtocolAttribute {
  /** sigmesh */
  SIGMESH = 0,
  /** zigbee */
  ZIGBEE = 1,
  /** subpieces */
  SUBPIECES = 2,
  /** beacon */
  BEACON = 3,
  /** tread */
  THREAD = 4,
  /** ty mesh */
  TYMESH = 5,
  /** 蓝牙 */
  BLUETOOTH = 6,
  /** beacon 2.0 */
  BEACON2 = 7,
  /** 漫游设备 */
  ROAMING = 8,
  /** Matter over WiFi设备接入 */
  MatterOverWiFi = 9,
}

/** 房间信息 */
export type RoomItem = {
  /** 房间id */
  roomId: number;
  /** 房间名称 */
  name: string;
  /** 该房间下的设备id列表 */
  deviceIds: string[];
};

export interface GetGatewayAbilityResponseItem {
  /** 设备id */
  devId: string;
  /** 接入子设备最大数量 */
  subMaximum: MaximumConfig;
  /** 网关性能指标 */
  performance: number;
  /** 网关能力 */
  capability: number;
  /** 设备信号检测能力的标位 */
  lqi: number;
}

interface MaximumConfig {
  data: {
    /** 蓝牙类子设备接入数量 */
    blu: number;
    /** Zigbee子设备接入数量 */
    zig: number;
  };
  /** 接入子设备最大数量数据版本 */
  version: number;
}

/** 连接状态 */
export enum ConnectType {
  /** 有线 */
  wired = 0,
  /** wifi */
  wifi = 1,
  /** 4G */
  lte = 2,
}

/** 网关能力枚举 */
export enum GatewayCapability {
  /** 网关仅支持配一个中继 5 */
  onlyOneRelay = 5, // 关联列表最多能选1个中继，取消关联不支持中继，迁移列表过滤掉中继
  /** 网关支持dp和群组的同步能力 4 */
  /** 是否支持控制其他网关下的设备 3 */
  /** 网关网络状态获取能力 */
  networkStatus = 2,
  /** 网关指示灯开关能力 */
  indicator = 1,
  /** 是否支持迁移优化 */
  migrate = 0,
}

/** 设备信号检测功能的标位 */
export enum DetectionType {
  /** 蓝牙设备 */
  BLE = 3,
  /** Tread设备 */
  TREAD = 2,
  /** Zigbee设备 */
  ZIGBEE = 1,
}

export type BleNodeInfo = {
  /* BLE 设备的 uuid */
  uuid: string;
  /* BLE 设备的设备 ID */
  devId: string;
};

export type BeaconNodeInfo = {
  /* Beacon 设备的 MAC地址，全部小写并且无冒号分隔 。例如：“0800200a8c6d” */
  mac: string;
  /* Beacon 设备的设备 ID */
  devId: string;
};

export enum SubDeviceType {
  ble = 'ble',
  zigbee = 'zigbee',
}

export interface IHomeInfo {
  homeName?: string;
  homeId?: string;
  admin?: boolean;
  address?: string;
  longitude?: string;
  latitude?: string;
}
