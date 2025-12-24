
// 日志类型定义
export type LogType = 'map' | 'path' | 'custom' | 'p2p';

// 日志数据结构
export interface LogData {
  type: LogType;
  devId: string;
  message: string;
  timestamp: number;
  localeTimeString: string;
}




export type LogFileInfo = {
  id: string;
  fileSize: number;
  lastModifiedTime: number;
  fileIndex: number;
}

export type LogFileItem = LogFileInfo & { filePath: string };
