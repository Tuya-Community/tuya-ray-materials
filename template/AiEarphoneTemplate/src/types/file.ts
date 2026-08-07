// 大纲项
export type OutlineItem = {
  title: string;
  time: string;
};

// 转录片段（转写数据项）
export type TranscriptSegment = {
  startSecond: number; // 开始时间（秒）
  endSecond: number; // 结束时间（秒）
  text: string; // 原文
  transText?: string; // 翻译文本
  asrId?: number; // ASR ID
  channel?: number; // 声道（channel0表示左耳，channel1表示右耳）
  speaker?: string; // 说话人
};

// 离线文件上传状态
export enum OfflineFileUploadStatus {
  /** 等待上传 */
  Waiting = 0,
  /** 正在上传 */
  Uploading = 1,
  /** 上传完成 */
  Completed = 2,
  /** 上传失败 */
  Failed = 3,
  /** 取消 */
  Cancelled = 4,
}
