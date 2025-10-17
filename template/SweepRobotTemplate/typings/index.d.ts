declare module '*.png';

declare module '*.module.less' {
  const classes: {
    readonly [key: string]: string;
  };
  export default classes;
  declare module '*.less';
}

declare global {
  interface Window {
    devToolsExtension?: () => any;
    __DEV__: boolean;
  }
}

type AtLeastOne<T extends Record<string, any>> = keyof T extends infer K
  ? K extends string
    ? Pick<T, K & keyof T> & Partial<T>
    : never
  : never;

type DpValue = boolean | number | string;
interface DpState {
  switch?: boolean;
  [dpCode: string]: DpValue;
}

/// 一些 TTT 通用工具泛型 ///
type GetTTTAllParams<Fn> = Parameters<Fn>['0'];
type GetTTTParams<Fn> = Omit<GetTTTAllParams<Fn>, 'complete' | 'success' | 'fail'>;
type GetTTTCompleteData<Fn> = Parameters<GetTTTAllParams<Fn>['complete']>['0'];
type GetTTTSuccessData<Fn> = Parameters<GetTTTAllParams<Fn>['success']>['0'];
type GetTTTFailData<Fn> = Parameters<GetTTTAllParams<Fn>['fail']>['0'];
///                   ///

/**
 * TTT 方法统一错误码
 */
type TTTCommonErrorCode = GetTTTFailData<typeof ty.device.getDeviceInfo>;

/**
 * 设备信息
 */
type DevInfo = ty.device.DeviceInfo & { state: DpState };

/**
 * 设备物模型信息
 */
type ThingModelInfo = GetTTTSuccessData<typeof ty.device.getDeviceThingModelInfo>;

type AtLeastOne<T extends Record<string, any>> = keyof T extends infer K
  ? K extends string
    ? Pick<T, K & keyof T> & Partial<T>
    : never
  : never;

type CleanRecord = {
  bucket: string;
  extend: string; // 清扫信息
  devId: string;
  file: string;
  time: number;
  id: number; // 清扫记录的唯一ID
  fileType: string;
  extendInfo: {
    recordId: number;
    timeStamp: number;
    time: number;
    area: number;
    cleanMode?: number; // 可选属性
    workMode: string;
    cleaningResult: string;
    startMethod: string;
    mapLength: number;
    pathLength: number;
    virtualLength: number;
  };
};

type Voice = {
  auditionUrl: string;
  desc?: string;
  extendData: {
    extendId: number;
    version: string;
  };
  id: number;
  imgUrl: string;
  name: string;
  officialUrl: string;
  productId: string;
  region: string[];
};

type MultiMap = {
  id: number;
  mapId: number;
  file: string;
  filePathKey: string;
  robotUseFile: string;
  bucket: string;
  title: string;
  time: string;
  snapshotImage?: { image: string; width: number; height: number };
};

type IDEP2pData = {
  map?: string;
  path?: string;
};

type Mode = 'smart' | 'zone' | 'pose' | 'select_room' | 'manual';

type Status =
  | 'standby'
  | 'smart'
  | 'zone_clean'
  | 'part_clean'
  | 'cleaning'
  | 'paused'
  | 'goto_pos'
  | 'pos_arrived'
  | 'pos_unarrive'
  | 'goto_charge'
  | 'charging'
  | 'charge_done'
  | 'sleep'
  | 'select_room'
  | 'seek_dust_bucket'
  | 'collecting_dust'
  | 'relocation'
  | 'mapping'
  | 'mapping_done'
  | 'manual'
  | 'breakpoint_charging';

type WorkMode = 'both_work' | 'only_sweep' | 'only_mop';

type Suction = 'closed' | 'gentle' | 'normal' | 'strong' | 'max';

type Cistern = 'closed' | 'low' | 'middle' | 'high';

type MopState = 'none' | 'installed';

type CarpetCleanPrefer = 'evade' | 'ignore';

type DirectionControl = 'forward' | 'backward' | 'turn_left' | 'turn_right' | 'stop' | 'exit';

type UnitSet = 'square_meter' | 'square_foot';

type WorkstationType = 'charging_stand' | 'dust_bucket' | 'base_station' | 'almighty_base';

type IMaterialMaterialMaps = {
  uri: string;
  width: number;
  height: number;
  isScale: number;
  scale: number;
};

type IMaterialMaterials = Array<{
  id: any;
  type: string;
  x: number;
  y: number;
  extends: { x: number; y: number; type: number } | string;
}>;

type OSSMapData = {
  originMap: string;
  originPath?: string;
  virtualState: {
    virtualWallData?: Point[][];
    virtualAreaData?: any[];
    virtualMopAreaData?: any[];
  };
};

type SnapshotImage = {
  image: string;
  width: number;
  height: number;
};
