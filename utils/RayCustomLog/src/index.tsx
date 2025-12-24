/**
 * Ray Custom Logger - 自定义日志库主入口
 *
 * 功能特性：
 * - 支持地图、路径、自定义三种日志类型
 * - 单个日志文件最大5MB，自动分文件（最多5个文件）
 * - 文件超出限制时自动删除最旧文件
 * - 支持日志文件分享功能
 * - 异步初始化，确保文件系统就绪后才能写入
 * - 单例模式管理，避免重复初始化
 *
 * 使用方式：
 * ```typescript
 * // 函数式API（推荐，自动管理实例）
 * await logMapData('device123', '地图数据');
 * await shareLatestLogFile('device123');
 *
 * // 类式API（高级用户，需手动初始化）
 * const logger = new CustomLogger('device123');
 * await logger.initialize();
 * await logger.logMapData('地图数据');
 * ```
 */

// =============== 类式API ===============
/**
 * 自定义日志管理器类
 * 提供完整的日志管理功能，包括文件轮转、回调通知等
 */
export {
  CustomLogger,
} from './logger';

// =============== 函数式API ===============
/**
 * 日志写入API（使用单例模式，自动管理实例）
 * 每个devId对应一个独立的日志实例
 */
export {
  // ============ 核心日志功能 ============
  logMapData,      // 写入地图相关日志
  logPathData,     // 写入路径相关日志
  logCustomData,   // 写入自定义日志
  logP2PData,     // 写入P2P相关日志

  // ============ 日志分享功能 ============
  shareLogFile,    // 分享指定ID的日志文件
  shareLatestLogFile, // 分享最新的日志文件

  // ============ 日志管理功能 ============
  authorizeFileWrite,    // 获取文件写入权限
  cleanAllLogFiles,      // 清理所有日志文件
  registerLogFileChangeCallBack, // 注册文件变化回调

  // ============ 实例管理 ============
  getLogger,        // 获取日志实例
  removeLogger,     // 移除指定实例
  clearAllLoggers,  // 清空所有实例
} from './api';

// =============== 加密解密工具 ===============
/**
 * 日志加密解密工具
 */
export {
  default as LogEncryptor,  // 日志加密解密类
  decryptLog,              // 便捷解密函数
  encryptLog,              // 便捷加密函数
} from './streamAESEncryptor';

// =============== 类型定义 ===============
/**
 * TypeScript类型定义
 */
export type {
  LogType,    // 日志类型枚举
  LogData,    // 日志数据结构
  LogFileInfo,
  LogFileItem,
} from './type';
