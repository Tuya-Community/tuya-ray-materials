import { authorize, share, writeLogFile } from '@ray-js/ray';

/**
 * @fileoverview TTT (Tuya Tiny Tool) 文件操作工具集
 * 提供文件分享、文件状态查询、权限授权、目录操作等功能
 */

// ==================== 类型定义 ====================

/**
 * 文件状态信息接口
 */
interface FileStatResult {
  /** 文件大小（字节） */
  fileSize: number;
  /** 最后修改时间戳（秒） */
  lastModifiedTime: number;
}

/**
 * 写入日志文件参数接口
 */
interface WriteLogFileParams {
  /** 资源ID */
  resId: string;
  /** 要写入的数据 */
  data: string;
  /** 是否追加模式 */
  append: boolean;
  /** 日志目录路径 */
  logDir: string;
}

/**
 * 写入日志文件成功结果接口
 */
interface WriteLogFileSuccessResult {
  /** 生成的文件路径 */
  filePath: string;
}

// ==================== 工具函数 ====================

/**
 * 创建标准的错误对象
 * @param message 错误消息前缀
 * @param originalError 原始错误对象
 * @returns 格式化的错误对象
 */
const createError = (message: string, originalError?: any): Error => {
  const errorMsg = originalError?.errorMsg || originalError?.message || 'Unknown error';
  return new Error(`${message}: ${errorMsg}`);
};

/**
 * 验证文件系统管理器是否可用
 * @param fileSystemManager 文件系统管理器实例
 * @throws 当文件系统管理器不可用时抛出错误
 */
const validateFileSystemManager = (fileSystemManager: any): void => {
  if (!fileSystemManager) {
    throw new Error('[FILE-UTILS] File system manager not available');
  }
};

/**
 * 验证文件路径是否有效
 * @param filePath 文件路径
 * @throws 当文件路径无效时抛出错误
 */
const validateFilePath = (filePath: string): void => {
  if (!filePath || typeof filePath !== 'string' || filePath.trim() === '') {
    throw new Error('[FILE-UTILS] File path is invalid');
  }
};

// ==================== 导出函数 ====================

/**
 * 分享文件
 * @param filePath 要分享的文件路径
 * @returns Promise<void> 分享成功时resolve，失败时reject
 * @throws 当filePath无效时抛出错误
 */
export const shareFile = (filePath: string): Promise<null> => {
  validateFilePath(filePath);

  return new Promise((resolve, reject) => {
    share({
      type: 'file',
      title: '日志文件',
      message: '',
      contentType: 'file',
      filePath,
      success: resolve,
      fail: (err: any) => {
        reject(createError('Failed to share file', err));
      },
    });
  });
};

/**
 * 获取文件状态信息
 * @param fileSystemManager 文件系统管理器实例
 * @param filePath 文件路径
 * @returns Promise<FileStatResult | null> 返回文件状态信息，文件不存在时返回null
 * @throws 当fileSystemManager或filePath无效时抛出错误
 */
export const getFileStat = (
  fileSystemManager: any,
  filePath: string
): Promise<FileStatResult | null> => {
  validateFileSystemManager(fileSystemManager);
  validateFilePath(filePath);

  return new Promise((resolve, reject) => {
    fileSystemManager.stat({
      path: filePath,
      recursive: true,
      success: (res: any) => {
        try {
          const { fileStatsList } = res || {};
          const logFileStat = Array.isArray(fileStatsList) ? fileStatsList[0] : null;

          if (logFileStat && typeof logFileStat === 'object') {
            const fileSize = typeof logFileStat.size === 'number' ? logFileStat.size : 0;
            const lastModifiedTime = typeof logFileStat.lastModifiedTime === 'number'
              ? logFileStat.lastModifiedTime
              : Math.floor(Date.now() / 1000);

            resolve({ fileSize, lastModifiedTime });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(createError('Failed to process file stats', error));
        }
      },
      fail: (err: any) => {
        // 文件不存在是正常情况，返回 null 而不是 reject
        if (err?.errCode === 10022) { // 文件不存在错误码
          resolve(null);
        } else {
          reject(createError('Failed to get file stats', err));
        }
      },
    });
  });
};

/**
 * 获取文件写入权限
 * @returns Promise<boolean> 授权成功时resolve(true)，失败时reject
 */
export const authorizeFileWrite = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    authorize({
      scope: (ty as any).ScopeBean.WRITEPHOTOSALBUM,
      success: () => resolve(true),
      fail: (err: any) => {
        reject(createError('Failed to authorize file write', err));
      },
    });
  });
};

/**
 * 删除目录
 * @param fileSystemManager 文件系统管理器实例
 * @param dirPath 要删除的目录路径
 * @returns Promise<boolean> 删除成功时resolve(true)，失败时reject
 * @throws 当fileSystemManager或dirPath无效时抛出错误
 */
export const removeDir = (
  fileSystemManager: any,
  dirPath: string
): Promise<boolean> => {
  validateFileSystemManager(fileSystemManager);
  validateFilePath(dirPath);

  return new Promise((resolve, reject) => {
    fileSystemManager.rmdir({
      dirPath,
      recursive: true,
      success: () => resolve(true),
      fail: (err: any) => {
        reject(createError('Failed to remove directory', err));
      },
    });
  });
};

/**
 * 写入日志到文件
 * @param resId 资源ID，用于标识日志文件
 * @param data 要写入的日志数据
 * @param logDir 日志目录路径
 * @returns Promise<string> 写入成功时resolve文件路径，失败时reject
 * @throws 当resId、data或logDir无效时抛出错误
 */
export const writeLogToFile = (
  resId: string,
  data: string,
  logDir: string
): Promise<string> => {
  validateFilePath(logDir);

  if (!resId || typeof resId !== 'string' || resId.trim() === '') {
    throw new Error('[FILE-UTILS] Resource ID is invalid');
  }

  if (data == null) {
    throw new Error('[FILE-UTILS] Data is null or undefined');
  }

  return new Promise((resolve, reject) => {
    const params: WriteLogFileParams = {
      resId,
      data: String(data),
      append: true,
      logDir,
    };

    (writeLogFile as any)({
      ...params,
      success: (result: WriteLogFileSuccessResult) => {
        if (result?.filePath) {
          resolve(result.filePath);
        } else {
          reject(new Error('No file path returned from writeLogFile'));
        }
      },
      fail: (err: any) => {
        reject(err);
      },
    });
  });
};

/**
 * 检查文件是否存在
 * @param fileSystemManager 文件系统管理器实例
 * @param filePath 要检查的文件路径
 * @returns Promise<boolean> 文件存在时resolve(true)，不存在时resolve(false)
 * @throws 当fileSystemManager或filePath无效时抛出错误
 */
export const checkFileExists = (
  fileSystemManager: any,
  filePath: string
): Promise<boolean> => {
  validateFileSystemManager(fileSystemManager);
  validateFilePath(filePath);

  return new Promise((resolve) => {
    fileSystemManager.access({
      path: filePath,
      success: () => resolve(true),
      fail: () => resolve(false),
    });
  });
};

/**
 * 创建目录（如果不存在）
 * @param fileSystemManager 文件系统管理器实例
 * @param dirPath 要创建的目录路径
 * @returns Promise<boolean> 创建成功时resolve(true)，失败时reject
 * @throws 当fileSystemManager或dirPath无效时抛出错误
 */
export const ensureDirectoryExists = (
  fileSystemManager: any,
  dirPath: string
): Promise<boolean> => {
  validateFileSystemManager(fileSystemManager);
  validateFilePath(dirPath);

  return new Promise((resolve, reject) => {
    fileSystemManager.mkdir({
      dirPath,
      recursive: true,
      success: () => resolve(true),
      fail: (err: any) => {
        // 目录已存在是正常情况
        if (err?.errCode === 10021) {
          resolve(true);
        } else {
          reject(createError('Failed to create directory', err));
        }
      },
    });
  });
};

/**
 * 写入数据到文件（覆盖模式）
 * @param fileSystemManager 文件系统管理器实例
 * @param data 要写入的数据
 * @param filePath 文件路径
 * @returns Promise<boolean> 写入成功时resolve(true)，失败时reject
 * @throws 当fileSystemManager或filePath无效时抛出错误
 */
export const writeFile = (fileSystemManager: any, data: string, filePath: string): Promise<boolean> => {
  validateFileSystemManager(fileSystemManager);
  validateFilePath(filePath);
  return new Promise((resolve, reject) => {
    fileSystemManager.writeFile({
      filePath,
      data,
      success: () => resolve(true),
      fail: (err: any) => {
        reject(createError('Failed to write file', err));
      },
    });
  });
};

export const clearFileContent = (fileSystemManager: any, filePath: string): Promise<boolean> => {
  validateFileSystemManager(fileSystemManager);
  validateFilePath(filePath);
  return new Promise((resolve, reject) => {
    fileSystemManager.writeFile({
      filePath,
      data: '',
      success: () => resolve(true),
      fail: (err: any) => {
        reject(err);
      },
    });
  });
};