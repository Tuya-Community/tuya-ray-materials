export interface RemoveFilesParams {
  fileIds: number[];
}

export interface LoadFileRequest {
  deviceId: string;
  /**
   *t.Integer; 选择通道 0:未指定  1:ble  2:ap
   */
  channel: number;
  /**
   * 0代表开启新任务，任务Id
   */
  sessionId: number;
}

export interface ChangeRecodeChannelRequest {
  deviceId: string;
  /**
   *t.Integer; 选择通道 0:未指定  1 Bt 2 micro
   */
  recordChannel: number;
}
