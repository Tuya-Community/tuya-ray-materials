import { extractFileIndexFromPath } from '../utils';
import { LogFileInfo, LogFileItem } from '../type';


export class LogFileManager {
  private logFileList: Array<LogFileItem> = [];
  private logFileChangeCallbacks: Array<(params: LogFileInfo[]) => void> = [];
  private devId: string;

  constructor(devId: string) {
    this.logFileList = [];
    this.devId = devId.trim();
  }

  // ==================== 公共方法 ====================

  /**
   * 获取日志文件列表（返回副本避免外部修改）
   */
  getLogFileList(): Array<LogFileItem> {
    return [...this.logFileList];
  }

  /**
   * 根据文件ID查找文件信息
   */
  findById(id: string): LogFileItem | undefined {
    return this.logFileList.find(item => item.id === id);
  }

  /**
   * 根据文件路径查找文件信息
   */
  findByPath(filePath: string): LogFileItem | undefined {
    return this.logFileList.find(item => item.filePath === filePath);
  }

  /**
   * 获取最新的文件（修改时间最新的）
   */
  getLatest(): LogFileItem | null {
    return this.logFileList.length > 0 ? this.logFileList[0] : null;
  }

  /**
   * 获取最早的文件（修改时间最早的）
   */
  getOldest(): LogFileItem | null {
    return this.logFileList.length > 0 ? this.logFileList[this.logFileList.length - 1] : null;
  }

  /**
   * 添加或更新文件信息
   */
  addOrUpdateFile(filePath: string, fileSize?: number, lastModifiedTime?: number): void {
    this.validateFilePath(filePath);
    
    const existingIndex = this.logFileList.findIndex(item => item.filePath === filePath);
    const now = Math.floor(Date.now() / 1000);
    if (existingIndex >= 0) {
      this.updateExistingFile(existingIndex, fileSize, lastModifiedTime);
    } else {
      this.addNewFile(filePath, fileSize, lastModifiedTime, now);
    }

    this.sortAndNotify();
  }

  /**
   * 删除文件信息
   */
  removeFile(filePath: string): boolean {
    this.validateFilePath(filePath);
    
    const initialLength = this.logFileList.length;
    this.logFileList = this.logFileList.filter(item => item.filePath !== filePath);
    
    if (this.logFileList.length !== initialLength) {
      this.notifyLogFileChange();
      return true;
    }
    return false;
  }

  /**
   * 清空所有日志文件
   */
  clearAllFiles(): void {
    if (this.logFileList.length > 0) {
      this.logFileList = [];
      this.notifyLogFileChange();
    }
  }

  /**
   * 清空所有回调
   */
  clearAllCallbacks(): void {
    this.logFileChangeCallbacks = [];
  }

  /**
   * 注册日志文件变化回调
   */
  registerLogFileChangeCallback(callback: (params: LogFileInfo[]) => void): () => void {
    this.validateCallback(callback);

    this.logFileChangeCallbacks.push(callback);

    // 立即通知当前状态
    callback(this.getLogFileList());

    return this.createUnsubscribeFunction(callback);
  }

  /**
   * 获取文件数量
   */
  getFileCount(): number {
    return this.logFileList.length;
  }

  /**
   * 获取总文件大小
   */
  getTotalSize(): number {
    return this.logFileList.reduce((total, file) => total + file.fileSize, 0);
  }

  // ==================== 私有方法 ====================

  /**
   * 验证文件路径
   */
  private validateFilePath(filePath: string): void {
    if (!filePath || typeof filePath !== 'string' || filePath.trim() === '') {
      throw new Error('[LOG-FILE-MANAGER] File path must be a non-empty string');
    }
  }

  /**
   * 验证回调函数
   */
  private validateCallback(callback: any): void {
    if (typeof callback !== 'function') {
      throw new Error('[LOG-FILE-MANAGER] Callback must be a function');
    }
  }

  /**
   * 生成唯一的文件ID
   */
  private generateFileId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * 排序日志文件列表（按最后修改时间降序，最新的在前）
   */
  private sortLogFileList(list: Array<LogFileItem>): Array<LogFileItem> {
    return [...list].sort((a, b) => b.lastModifiedTime - a.lastModifiedTime);
  }

  /**
   * 更新现有文件信息
   */
  private updateExistingFile(index: number, fileSize?: number, lastModifiedTime?: number): void {
    
    if (fileSize !== undefined) {
      this.logFileList[index].fileSize = fileSize;
    }
    if (lastModifiedTime !== undefined) {
      this.logFileList[index].lastModifiedTime = lastModifiedTime;
    }
  }

  /**
   * 添加新文件信息
   */
  private addNewFile(filePath: string, fileSize?: number, lastModifiedTime?: number, currentTime?: number): void {
    const fileIndex = extractFileIndexFromPath(this.devId, filePath);
    this.logFileList.push({
      id: this.generateFileId(),
      filePath,
      fileSize: fileSize || 0,
      lastModifiedTime: lastModifiedTime || currentTime || Math.floor(Date.now() / 1000),
      fileIndex,
    });
  }

  /**
   * 排序并通知变化
   */
  private sortAndNotify(): void {
    this.logFileList = this.sortLogFileList(this.logFileList);
    this.notifyLogFileChange();
  }

  /**
   * 通知所有回调函数
   */
  private notifyLogFileChange(): void {
    const fileListSnapshot = this.getLogFileList();

    // 过滤掉 filePath，只保留 LogFileInfo 部分
    const data: LogFileInfo[] = fileListSnapshot.map(({ filePath, ...item }) => item);

    this.logFileChangeCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('[LOG-FILE-MANAGER] Error in change callback:', error);
      }
    });
  }

  /**
   * 创建取消订阅函数
   */
  private createUnsubscribeFunction(callback: (params: LogFileInfo[]) => void): () => void {
    return () => {
      const index = this.logFileChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.logFileChangeCallbacks.splice(index, 1);
      }
    };
  }
}