import { getFileSystemManager } from '@ray-js/ray';
import { LogFileInfo, LogType } from '../type';
import { extractFileIndexFromPath, formatLogData } from '../utils';
import { LogFileManager } from './logFileManager';
import { authorizeFileWrite, clearFileContent, getFileStat, removeDir, shareFile, writeLogToFile } from './ttt';

const MAX_LOG_FILE_COUNT = 5;
const MAX_TEMP_LOG_LENGTH = 10;
const LOG_DIR = `${(ty as any).env?.USER_DATA_PATH || ''}/customLog`;

/**
 * 自定义日志管理器类
 * 提供结构化的日志记录功能，支持地图、路径和自定义数据日志，
 * 每个日志文件内容是5M，最多支持5个日志文件，超过5个日志文件，会自动覆盖到最早的日志文件
 */
export class CustomLogger {
  private readonly devId: string;
  private readonly logDir: string;
  private readonly logFileManager: LogFileManager;

  private fileSystemManager: any = null;
  private currentLogFilePath = '';
  private tempLogArr: string[] = [];

  private _isInitialized = false;
  private _initPromise: Promise<void> | null = null;

  constructor(devId: string) {
    this.validateDevId(devId);
    this.devId = devId.trim();
    this.logDir = LOG_DIR;
    this.logFileManager = new LogFileManager(this.devId);
  }

  // ==================== 公共方法 ====================

  /**
   * 获取文件写入权限
   */
  async authorizeFileWrite(): Promise<boolean> {
    return await authorizeFileWrite();
  }

  /**
   * 异步初始化日志器
   */
  async initialize(): Promise<void> {
    if (this._isInitialized) return;
    if (this._initPromise) return this._initPromise;

    this._initPromise = this._doInitialize();
    return this._initPromise;
  }

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * 写入日志
   */
  async writeLog(type: LogType, message: string): Promise<void> {
    await this.ensureInitialized();

    const logString = formatLogData(this.devId, type, this.normalizeMessage(message));
    this.tempLogArr.push(logString);
    if (this.tempLogArr.length >= MAX_TEMP_LOG_LENGTH) {
      await this.flushLogBuffer();
    }
  }

  /**
   * 强制刷新日志缓冲区
   */
  async flush(): Promise<void> {
    if (this.tempLogArr.length > 0) {
      await this.flushLogBuffer();
    }
  }

  /**
   * 清空所有日志文件
   */
  async cleanAllLogFiles(): Promise<void> {
    await this.ensureInitialized();

    const success = await removeDir(this.fileSystemManager, this.logDir);
    if (success) {
      this.currentLogFilePath = '';
      this.logFileManager.clearAllFiles();
      this.initCurrentLogFilePath();
    } else {
      throw new Error('[CUSTOM-LOG] Failed to clean log files');
    }
  }

  /**
   * 分享最新的日志文件
   */
  async shareLatestLogFile(): Promise<void> {
    await this.ensureInitialized();

    const latestLogFile = this.logFileManager.getLatest();
    if (!latestLogFile?.filePath) {
      throw new Error('[CUSTOM-LOG] Latest log file not found');
    }

    await this.shareLogFile(latestLogFile.id);
  }

  /**
   * 分享指定日志文件
   */
  async shareLogFile(logId: string): Promise<void> {
    await this.ensureInitialized();

    const logFile = this.logFileManager.findById(logId);
    if (!logFile?.filePath) {
      throw new Error('[CUSTOM-LOG] Log file not found');
    }

    return shareFile(logFile.filePath);
  }

  /**
   * 注册日志文件变化回调
   */
  registerLogFileChangeCallBack(
    callback: (params: LogFileInfo[]) => void
  ): () => void {
    return this.logFileManager.registerLogFileChangeCallback(callback);
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.logFileManager.clearAllCallbacks();
    this.tempLogArr = [];
    this.currentLogFilePath = '';
    this.logFileManager.clearAllFiles();
    this._isInitialized = false;
    this._initPromise = null;
  }

  // ==================== 私有方法 ====================

  /**
   * 验证设备ID
   */
  private validateDevId(devId: string): void {
    if (!devId || typeof devId !== 'string' || devId.trim() === '') {
      throw new Error('[CUSTOM-LOG] devId must be a non-empty string');
    }
  }

  /**
   * 确保已初始化
   */
  private async ensureInitialized(): Promise<void> {
    if (!this._isInitialized) {
      await this.initialize();
    }
  }

  /**
   * 执行初始化
   */
  private async _doInitialize(): Promise<void> {
    try {
      await this.initializeFileSystem();
      await this.initializeLogFileList();
      this._isInitialized = true;
    } catch (error) {
      throw error;
    } finally {
      this._initPromise = null;
    }
  }

  /**
   * 初始化文件系统
   */
  private async initializeFileSystem(): Promise<void> {
    this.fileSystemManager = await getFileSystemManager();
  }

  /**
   * 初始化日志文件列表
   */
  private async initializeLogFileList(): Promise<void> {
    const possiblePaths = this.generatePossibleFilePaths();
    for (const path of possiblePaths) {
      try {
        const fileInfo = await this.getFileInfo(path);
        if (fileInfo) {
          this.logFileManager.addOrUpdateFile(path, fileInfo.fileSize, fileInfo.lastModifiedTime);
        }
      } catch (error) {
        console.error('[CUSTOM-LOG] Failed to initialize log file list:', error);
      }

    }

    this.initCurrentLogFilePath();
  }

  /**
   * 生成所有可能的文件路径
   */
  private generatePossibleFilePaths(): string[] {
    const paths: string[] = [];
    for (let fileIndex = 0; fileIndex < MAX_LOG_FILE_COUNT; fileIndex++) {
      paths.push(`${this.logDir}/${this.devId}_${fileIndex}_panel.log`);
    }
    return paths;
  }

  /**
   * 获取文件信息
   */
  private async getFileInfo(filePath: string): Promise<{ fileSize: number; lastModifiedTime: number } | null> {
    try {
      return await getFileStat(this.fileSystemManager, filePath);
    } catch (error) {
      return null;
    }
  }

  /**
   * 初始化当前日志文件路径
   */
  private initCurrentLogFilePath(): void {
    const logFileList = this.logFileManager.getLogFileList();
    let fileIndex = 0;

    if (logFileList.length > 0) {
      if (logFileList.length < MAX_LOG_FILE_COUNT) {
        const latestFile = this.logFileManager.getLatest();
        fileIndex = extractFileIndexFromPath(this.devId, latestFile.filePath);
      } else {
        const oldestFile = this.logFileManager.getOldest();
        fileIndex = extractFileIndexFromPath(this.devId, oldestFile.filePath);
        console.log('[CUSTOM-LOG] initCurrentLogFilePath', oldestFile, fileIndex);
      }
    }

    this.currentLogFilePath = `${this.devId}_${fileIndex}`;
  }

  /**
   * 标准化日志消息
   */
  private normalizeMessage(message: string): string {
    return message == null ? '' : String(message);
  }

  /**
   * 刷新日志缓冲区
   */
  private async flushLogBuffer(): Promise<void> {
    const dataToWrite = this.tempLogArr.join('');
    this.tempLogArr = []; // 先清空缓冲区

    try {
      await this.writeToFile(dataToWrite);
    } catch (error) {
      console.error('[CUSTOM-LOG] Failed to flush log buffer:', error);
      // 可以考虑将失败的日志重新放回缓冲区
    }
  }

  /**
   * 写入文件
   */
  private async writeToFile(data: string): Promise<void> {
    try {
      const filePath = await writeLogToFile(this.currentLogFilePath, data, this.logDir);
      if (filePath) {
        await this.updateFileInfo(filePath);
      }
    } catch (error) {
      console.error('[CUSTOM-LOG] writeToFile error====>', error);
      if (error?.errorCode === 10019) {
        await this.handleFileSizeExceeded(data);
      } else {
        throw error;
      }
    }
  }

  /**
   * 更新文件信息
   */
  private async updateFileInfo(filePath: string): Promise<void> {
    try {
      const fileInfo = await this.getFileInfo(filePath);
      if (fileInfo) {
        this.logFileManager.addOrUpdateFile(filePath, fileInfo.fileSize, fileInfo.lastModifiedTime);
      }
    } catch (error) {
      console.error('[CUSTOM-LOG] Error updating file info:', error);
    }
  }

  /**
   * 处理文件大小超限
   */
  private async handleFileSizeExceeded(dataToWrite: string): Promise<void> {
    const newLogFilePath = await this.createNewLogFile();
    if (!newLogFilePath) {
      throw new Error('[CUSTOM-LOG] Failed to create new log file');
    }

    this.currentLogFilePath = newLogFilePath;
    await this.writeToFile(dataToWrite);
  }

  /**
   * 创建新的日志文件
   */
  private async createNewLogFile(): Promise<string> {
    if (this.logFileManager.getLogFileList().length >= MAX_LOG_FILE_COUNT) {

      return await this.replaceOldestFile();
    } else {
      return this.getNextAvailableFileIndex();
    }
  }

  /**
   * 替换最旧的文件
   */
  private async replaceOldestFile(): Promise<string> {
    const oldestFile = this.logFileManager.getOldest();
    const filePath = oldestFile.filePath;
    if (!oldestFile) {
      throw new Error('[CUSTOM-LOG] No oldest file found to delete');
    }


    const res = await clearFileContent(this.fileSystemManager, filePath);
    if (res) {
      const fileInfo = await this.getFileInfo(filePath);

      if (fileInfo) {
        this.logFileManager.addOrUpdateFile(filePath, fileInfo.fileSize, fileInfo.lastModifiedTime);
      }
      const fileIndex = extractFileIndexFromPath(this.devId, filePath);
      return `${this.devId}_${fileIndex}`;
    }


  }

  /**
   * 获取下一个可用的文件索引
   */
  private getNextAvailableFileIndex(): string {
    const usedIndexes = this.logFileManager.getLogFileList()
      .map(file => extractFileIndexFromPath(this.devId, file.filePath))
      .filter(index => index >= 0 && index < MAX_LOG_FILE_COUNT);

    for (let i = 0; i < MAX_LOG_FILE_COUNT; i++) {
      if (!usedIndexes.includes(i)) {
        return `${this.devId}_${i}`;
      }
    }

    // 理论上不会执行到这里，因为前面已经检查过文件数量
    return `${this.devId}_0`;
  }
}