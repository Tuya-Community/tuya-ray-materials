/**
 * 卡片设备相关类型定义
 */

/**
 * 离线文件传输状态
 * 0: 未开始
 * 1: 下载中
 * 2: 结束
 */
export enum CardTransferStatus {
  NotStarted = 0, // 未开始
  Downloading = 1, // 下载中
  Finished = 2, // 结束
}

/**
 * 离线文件传输通道
 * 1: 蓝牙ble
 * 2: 快传wifi
 */
export enum CardTransferChannel {
  Ble = 1, // 蓝牙ble
  Wifi = 2, // 快传ap
}

/**
 * 离线文件状态
 */
export enum CardTransferFileStatus {
  Waiting, // 等待中
  Downloading, // 下载中
  Transforming, // 转换中
  Success, // 成功
  Failed, // 失败
}

/**
 * 热点连接状态
 * 0: 初始化状态.热点未开启
 * 1: Note热点已开启
 * 2: Note热点已连接
 */
export enum ApConnectState {
  Pending = 0, // 初始化状态.热点未开启
  Opened = 1, // Note热点已开启
  Connected = 2, // Note热点已连接
}