import { LogType, LogData } from './type';
import LogEncryptor from './streamAESEncryptor';

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要+1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 从文件路径中提取 fileIndex
 * 文件路径格式：.../customLog/${devId}_${fileIndex}_panel.log
 */
export function extractFileIndexFromPath(devId: string, filePath: string): number {
  try {
    // 使用正则表达式提取 fileIndex
    // 匹配格式：${devId}_数字_panel.log
    // 对 devId 进行正则表达式转义以防止注入攻击
    const escapedDevId = devId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = filePath.match(new RegExp(`${escapedDevId}_(\\d+)_panel\\.log$`));
    if (match && match[1]) {
      const index = parseInt(match[1], 10);
      if (!isNaN(index) && index >= 0) {
        return index;
      }
    }
    return 0;
  } catch (error) {
    console.error('[CUSTOM-LOG] Error extracting fileIndex:', error);
    return 0;
  }
}

  /**
   * 格式化日志数据
   * @returns 返回格式化的日志字符串和其长度（字节数）
   */
  export function formatLogData(devId: string, type: LogType, message: string ): string {
    try {
      // 输入验证
      if (!type || !['map', 'path', 'custom','p2p'].includes(type)) {
        console.warn('[CUSTOM-LOG] Invalid log type, using "custom" as default');
        type = 'custom';
      }

      // 确保 message 是字符串
      const safeMessage = message != null ? String(message) : '';

      const encryptedMessage = LogEncryptor.encryptLog(devId, safeMessage);
      const date = new Date();
      const logData: LogData = {
        type,
        devId,
        message: encryptedMessage,
        timestamp: date.getTime(),
        localeTimeString: formatDate(date),
      };
      const logString = JSON.stringify(logData) + '\n';
      return logString;
    } catch (error) {
      console.error('[CUSTOM-LOG] Failed to format log data:', error);
      // 返回一个安全的默认日志格式
      const fallbackDate = new Date();
      return JSON.stringify({
        type: 'custom',
        devId,
        message: `[ERROR] Failed to format log: ${error}`,
        timestamp: fallbackDate.getTime(),
        localeTimeString: formatDate(fallbackDate),
      }) + '\n';
    }
  }

  