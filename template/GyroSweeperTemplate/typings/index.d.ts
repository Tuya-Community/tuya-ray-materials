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

type CleanRecordResponse = {
  dpId: number;
  gid: number;
  gmtCreate: number;
  recordId: string;
  uuid: string;
  value: string;
  versionV3?: boolean;
};

type ParsedCleanRecordData = {
  date: string; // 格式化日期，如 "5-28 17:00"
  dayDate: string; // 日期部分，如 "2023-05-28"
  timeDate: string; // 时间部分，如 "17:00"
  time: number; // 清扫时长（已按比例缩放）
  area: number; // 清扫面积（已按比例缩放）
  subRecordId: string; // 子记录ID
  timestamp: number; // 原始时间戳
};
type CleanRecord = CleanRecordResponse & {
  parsedData: ParsedCleanRecordData;
};

type IAndSingleTime = {
  dps: string;
  bizId: string;
  bizType: string;
  actions: any;
  loops?: string;
  category?: string;
  status?: number;
  isAppPush?: boolean;
  aliasName?: string;
};

type IModifySingleTimer = {
  dps: string;
  bizId: string;
  bizType: string;
  id: string | number;
  actions: any;
  loops?: string;
  status?: number;
  isAppPush?: boolean;
  aliasName?: string;
};

type Timers = Array<{
  status: number;
  loops: string;
  time: string;
  id: number;
  isAppPush: boolean;
  dps: string;
  groupOrder: number;
  groupId: string;
  aliasName: string;
}>;

type IQueryTimerTasksResponse = {
  categoryStatus: number;
  id: string;
  category: string;
  timers: Timers[];
};
