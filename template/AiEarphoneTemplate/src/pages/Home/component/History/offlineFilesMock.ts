export interface DeviceOfflineAudioStatus {
  /**
   * 当前下载状态
   * 0:未开始  1:下载中  2:已结束
   */
  status: number;
  /**
   * 当前任务Id，用于标识单次任务的唯一身份
   * 0 标识任务未开始
   */
  sessionId: number;
  /**
   * 当前资源的下载状态
   */
  response: OfflineFilesResponse;
}

export interface OfflineFilesResponse {
  /**
   * 下载资源的通道
   * 0:未指定  1:ble  2:ap
   */
  channel: number;
  /**
   * 下载速度 单位KB/s
   */
  speed: number;
  /**
   * 可下载文件总数
   */
  total: number;
  /**
   * 已下载文件总数
   */
  size: number;
  /**
   * 当前正在下载的文件
   *
   */
  curFile: FileDigest;
  /**
   * 待下载的文件摘要信息
   */
  files_waiting: Array<FileDigest>;
  /**
   * 下载失败的文件摘要信息
   */
  files_failed: Array<FileDigest>;
  /**
   * 下载成功文件摘要信息,代表硬盘已经删除的
   */
  files_successed: Array<FileDigest>;
}

export interface FileDigest {
  /**
   * 文件唯一标识Id
   */
  fileId: number;
  /**
   * 文件类型
   * 0：会议录音  1：通话
   */
  fileType: number;
  /**
   * 文件进度 99.99%
   */
  progress: number;
  /**
   * 文件时间戳 s
   */
  timeStamp: number;
  /**
   * 文件名称
   * 0：会议录音  1：xxxx
   */
  fileName: string;
  /**
   * 文件内容时长
   */
  fileDuring: number;
}

export const offlineDatas: DeviceOfflineAudioStatus = {
  status: 1,
  sessionId: 0,
  response: {
    channel: 1,
    speed: 12,
    total: 3,
    size: 1,
    curFile: null,
    files_waiting: [
      {
        fileId: 1,
        fileType: 0,
        progress: 0,
        timeStamp: 1740465825,
        fileName: '文件名称1',
        fileDuring: 3600,
      },
      {
        fileId: 2,
        fileType: 0,
        progress: 0,
        timeStamp: 1640465825,
        fileName: '文件名称2',
        fileDuring: 3600,
      },
      {
        fileId: 3,
        fileType: 0,
        progress: 70,
        timeStamp: 1640465826,
        fileName: '文件名称3',
        fileDuring: 3600,
      },
    ],
    files_failed: [],
    files_successed: [],
  },
};

export const tttGetDeviceOfflineAudioStatus = params => {
  return params.success(offlineDatas);
};
export const getDeviceOfflineAudioStatus = async (devId, successCallBack) => {
  console.log('devId:=====>', devId);
  await tttGetDeviceOfflineAudioStatus({
    devId,
    success: successCallBack,
    fail: error => {
      console.log('error:=====>', error);
    },
  });
};
