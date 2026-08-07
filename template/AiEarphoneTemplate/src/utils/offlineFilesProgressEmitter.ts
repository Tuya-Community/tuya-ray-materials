import EventEmitter from './emitter';

/**
 * 离线文件传输进度事件名。
 * 由 App 级别的 useOfflineFilesProgress 在收到 ty.wear.onOfflineFilesProgressEvent 后，
 * 通过 offlineFilesProgressEmitter.emit 转发给首页 / 传输页等订阅方。
 */
export const OFFLINE_FILES_PROGRESS_EVENT = 'offlineFilesProgress';

export type OfflineFilesProgressEventName = typeof OFFLINE_FILES_PROGRESS_EVENT;

/**
 * App 级别的离线文件传输进度事件总线。
 * - ty.wear.onOfflineFilesProgressEvent 仅在 DelayedHooksContainer 中注册一次；
 * - 首页 / 传输页通过订阅本 emitter 接收进度，避免页面切换时 on/off 互相覆盖或丢事件。
 */
export const offlineFilesProgressEmitter = new EventEmitter<OfflineFilesProgressEventName>();
