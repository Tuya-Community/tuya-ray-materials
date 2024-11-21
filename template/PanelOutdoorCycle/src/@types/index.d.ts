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
  inService: boolean;
  isPidHadVAS: boolean;
  commodityUrl: string;
  hadPopup: boolean;
}
