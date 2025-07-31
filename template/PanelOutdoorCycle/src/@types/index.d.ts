declare module '*.less';
declare global {
  interface Window {
    devToolsExtension?: () => any;
    ty: Ty;
  }
}

interface Ty {
  [key]: any;
}

declare const ty: Ty;
declare module '*.png' {
  const value: string;
  export default value;
}
interface ITrackSegmentItem {
  battery: number;
  bufferFlag: number;
  duration: number;
  endTime: number;
  mileage: number;
  realBattery: number;
  savingCarbonData: number;
  speed: number;
  startTime: number;
}

interface ITrackSegment {
  areLastPage: boolean;
  deviceId: string;
  lastId: number;
  lastIdStr: sting;
  segmentList: ITrackSegmentItem[];
}

interface ICheckPermissionParams {
  dpCode: string;
  dpSchema: Record<string, any>;
  inService: boolean;
  isPidHadVAS: boolean;
  isBleOnline: boolean;
  successCb: () => void;
  cancelCb?: () => void;
}

interface IKey {
  key: string;
  type?: string;
  onclick: () => void;
  isShow: boolean;
}

interface IAbility {
  inService?: boolean; // 是否在服务中
  isPidHadVAS?: boolean; // 是否有增值服务
  commodityUrl?: string; // 续费链接
  hadPopup?: boolean; // 是否已弹出过提示
  activeType?: string;
  interactionType?: string;
  assocaitedDps?: number[];
}
