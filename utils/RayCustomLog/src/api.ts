import { LoggerSingleton } from './singleton';
import { CustomLogger } from './logger';
import { LogFileInfo } from './type';

/**
 * 记录地图相关数据日志
 * @param devId 设备ID
 * @param message 日志消息
 */
export const logMapData = async (
  devId: string,
  message: string,
): Promise<void> => {
  const logger = await LoggerSingleton.getInstance(devId);
  await logger.writeLog('map', message);
};


/**
 * 记录P2P相关数据日志
 * @param devId 设备ID
 * @param message 日志消息
 */
export const logP2PData = async (
  devId: string,
  message: string,
): Promise<void> => {
  const logger = await LoggerSingleton.getInstance(devId);
  await logger.writeLog('p2p', message);
};

/**
 * 记录路径相关数据日志
 * @param devId 设备ID
 * @param message 日志消息
 */
export const logPathData = async (
  devId: string,
  message: string,
): Promise<void> => {
  const logger = await LoggerSingleton.getInstance(devId);
  await logger.writeLog('path', message);
};

/**
 * 记录自定义数据日志
 * @param devId 设备ID
 * @param message 日志消息
 */
export const logCustomData = async (
  devId: string,
  message: string,
): Promise<void> => {
  const logger = await LoggerSingleton.getInstance(devId);
  await logger.writeLog('custom', message);
};

/**
 * 分享指定索引的日志文件
 * @param devId 设备ID
 * @param logId 日志文件ID
 */
export const shareLogFile = async (
  devId: string,
  logId: string,
): Promise<void> => {
  const logger = await LoggerSingleton.getInstance(devId);
  await logger.shareLogFile(logId);
};

/**
 * 分享最新的日志文件
 * @param devId 设备ID
 */
export const shareLatestLogFile = async (devId: string): Promise<void> => {
  const logger = await LoggerSingleton.getInstance(devId);
  await logger.shareLatestLogFile();
};


/**
 * 授权文件写入权限
 * @param devId 设备ID
 * @returns 是否授权成功
 */
export const authorizeFileWrite = async (devId: string): Promise<boolean> => {
  const logger = await LoggerSingleton.getInstance(devId);
  return await logger.authorizeFileWrite();
};

/**
 * 清空所有日志文件
 * @param devId 设备ID
 */
export const cleanAllLogFiles = async (devId: string): Promise<void> => {
  const logger = await LoggerSingleton.getInstance(devId);
  await logger.cleanAllLogFiles();
};

/**
 * 注册日志文件变化回调
 * @param devId 设备ID
 * @param callback 回调函数
 * @returns 返回取消注册的函数
 */
export const registerLogFileChangeCallBack = async (
  devId: string,
  callback: (params: LogFileInfo[]) => void
): Promise<() => void> => {
  const logger = await LoggerSingleton.getInstance(devId);
  return logger.registerLogFileChangeCallBack(callback);
};

/**
 * 获取指定 devId 的日志器实例（单例）
 * @param devId 设备ID    
 * @returns CustomLogger 实例
 */
export const getLogger = async (devId: string): Promise<CustomLogger> => {
  return await LoggerSingleton.getInstance(devId);
};

/**
 * 移除指定 devId 的日志器实例
 * @param devId 设备ID
 */
export const removeLogger = async (devId: string): Promise<void> => {
  const logger = await LoggerSingleton.getInstance(devId);
  logger.destroy();
  LoggerSingleton.removeInstance(devId);
};

/**
 * 清除所有日志器实例
 */
export const clearAllLoggers = (): void => {
  // 先销毁所有实例，然后清除
  const instances = LoggerSingleton.getAllInstances();
  instances.forEach((logger: CustomLogger) => {
    try {
      logger.destroy();
    } catch (error) {
      console.error('[CUSTOM-LOG] Error destroying logger:', error);
    }
  });
  LoggerSingleton.clearAll();
};