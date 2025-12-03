export type ISendPacketsOptions = {
  deviceId: string;
  packets: string[];
  dpValue?: any;
  dpId?: number;
  timeout?: number;
  maxRetries?: number;
  sendDp?: () => void;
  parseReportData?: (reportData: any) => number;
  onProgress?: (data: IProgress) => void;
};

export type IProgress = {
  index: number;
  total: number;
  type: 'normal' | 'retry';
};

export type IReportData = {
  data: string;
  deviceId: string;
};

export type ICreatePacketsOptions = {
  hexStringData: string;
  packetByteSize?: number;
};
