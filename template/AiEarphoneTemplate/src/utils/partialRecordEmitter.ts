import EventEmitter from './emitter';

/**
 * 文件局部刷新事件名。
 * 由 App 级别的 usePartialRecordUpdate 在收到 ty.wear.onPartialRecordUpdate 后，
 * 通过 partialRecordEmitter.emit(PARTIAL_RECORD_UPDATE_EVENT, res) 转发给详情页等订阅方。
 */
export const PARTIAL_RECORD_UPDATE_EVENT = 'partialRecordUpdate';

export type PartialRecordUpdateEventName = typeof PARTIAL_RECORD_UPDATE_EVENT;

/**
 * App 级别的局部刷新事件总线。
 * - ty.wear.onPartialRecordUpdate 仅在 DelayedHooksContainer 中注册一次；
 * - 首页列表的更新逻辑放在该 hook 内部直接 dispatch 到 store；
 * - 详情页等需要响应该事件的页面，通过订阅本 emitter 来接收数据。
 *
 * 这样可以避免页面切换时出现 "ty.wear handler 注册时机错位 / 互相覆盖" 而丢失事件的问题。
 */
export const partialRecordEmitter = new EventEmitter<PartialRecordUpdateEventName>();
