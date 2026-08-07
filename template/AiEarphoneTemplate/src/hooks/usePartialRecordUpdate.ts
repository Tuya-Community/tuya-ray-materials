import { useCallback, useEffect } from 'react';
import store from '@/redux';
import {
  updateFileListItem,
  removeFileListItem,
  toFileListItem,
  FileListItem,
} from '@/redux/modules/audioFileSlice';
import { FileOperateStatus, FileVisitStatus, SummaryStatus } from '@/constant/enums';
import { PARTIAL_RECORD_UPDATE_EVENT, partialRecordEmitter } from '@/utils/partialRecordEmitter';

/**
 * 把 native 推送的单条 updateItem 转成 reducer 可接受的 patch。
 *
 * 设计要点（与原 mergeFileListWithUpdate 行为对齐）：
 *  1. transferStatus / summaryStatus 始终回写到 transfer / summary；
 *  2. summary 由非 Success 跃迁到 Success 时，把 visit 标记为 TransferUnread（小红点）；
 *  3. noteFileConvertState 仅在显式推送时回写，避免覆盖现有值；
 *  4. 其余字段沿用 toFileListItem 的字段白名单做裁剪：
 *     - translateStatus 等不在 FileListItem 中的字段被自然过滤掉
 *     - 主键 recordId / recordTransferId 不进 patch（不允许通过 patch 修改主键）
 *     - undefined 字段不写入，避免无意中清空已有字段
 */
const buildPatchFromUpdateItem = (
  updateItem: Record<string, any>,
  currentItem: FileListItem
): Partial<FileListItem> => {
  const { summaryStatus, transferStatus, noteFileConvertState, ...rest } = updateItem;

  const isSummarySuccess =
    currentItem.summary !== summaryStatus && summaryStatus === SummaryStatus.Success;
  const newVisit = isSummarySuccess ? FileVisitStatus.TransferUnread : currentItem.visit;

  const patch: Partial<FileListItem> = {
    transfer: transferStatus,
    summary: summaryStatus,
    visit: newVisit,
  };
  if (noteFileConvertState !== undefined) {
    patch.noteFileConvertState = noteFileConvertState;
  }

  // 走 toFileListItem 拿到字段白名单裁剪后的对象，再按"非 undefined 且非主键"挑入 patch
  const sanitized = toFileListItem(rest) as Record<string, any>;
  Object.keys(sanitized).forEach(key => {
    if (key === 'recordId' || key === 'recordTransferId') {
      return;
    }
    const value = sanitized[key];
    if (value !== undefined) {
      (patch as Record<string, any>)[key] = value;
    }
  });

  return patch;
};

/**
 * App 级别的"文件局部刷新"事件接入点。
 *
 * 设计动机：
 *   ty.wear.onPartialRecordUpdate 是一个全局回调，全应用只能存在一个 handler。
 *   过去首页 / 详情页分别 on/off，会因为页面切换时序错位互相覆盖，导致：
 *     1) 在详情页内完成转写/总结时，首页 fileList 没有任何 handler 在收事件；
 *     2) 页面切换的 cleanup 与 onShow 之间存在空窗，事件可能被完全丢失。
 *
 * 解决方案：
 *   - 仅在 DelayedHooksContainer 中调用本 hook，应用启动后注册一次；
 *   - 收到事件后：
 *       a) 通过 partialRecordEmitter 把原始事件转发给详情页等订阅方；
 *       b) 按 recordId 逐项 dispatch updateFileListItem / removeFileListItem
 *          直接 mutate store（不再走"读 fileList → 整体替换"，无需延时兜底）。
 *
 * 性能：
 *   - native bridge 注册/解绑只发生一次；
 *   - emitter 同步派发，订阅者一般 ≤ 2，开销可忽略；
 *   - 单次推送通常包含 1~3 个 updateItem，多次 dispatch 在 React-Redux v8+ 下自动 batch，
 *     渲染只触发一次，且未命中项的引用保持不变。
 *
 * @return none
 */
export const usePartialRecordUpdate = () => {
  const handlePartialRecordUpdate = useCallback((res: any) => {

    // 1) 转发给详情页等订阅方，确保详情页能即时响应
    partialRecordEmitter.emit(PARTIAL_RECORD_UPDATE_EVENT, res);

    // 2) 首页 fileList：按 recordId 逐项 mutate / remove
    const updateList = res?.updateList;
    if (!Array.isArray(updateList) || updateList.length === 0) {
      return;
    }

    const fileList = store.getState()?.audioFile?.fileList || [];
    if (!fileList.length) {
      return;
    }

    // 仅处理 store 中已存在的 recordId；新增条目仍由全量接口（onShow / onFileListUpdateStatusEvent）兜底
    const fileMap = new Map<string, FileListItem>(
      fileList.filter(it => !!it.recordId).map(it => [it.recordId as string, it])
    );

    updateList.forEach((updateItem: Record<string, any>) => {
      const recordId = updateItem?.recordId;
      if (!recordId) {
        return;
      }
      const currentItem = fileMap.get(recordId);
      if (!currentItem) {
        return;
      }

      if (updateItem.operateStatus === FileOperateStatus.Delete) {
        store.dispatch(removeFileListItem({ value: recordId }));
        return;
      }
      if (updateItem.operateStatus === FileOperateStatus.Update) {
        const patch = buildPatchFromUpdateItem(updateItem, currentItem);
        store.dispatch(updateFileListItem({ value: recordId, patch }));
      }
    });
  }, []);

  useEffect(() => {
    // @ts-ignore - ty.wear API
    ty.wear?.onPartialRecordUpdate?.(handlePartialRecordUpdate);

    return () => {
      // @ts-ignore - ty.wear API
      ty.wear?.offPartialRecordUpdate?.(handlePartialRecordUpdate);
    };
  }, [handlePartialRecordUpdate]);
};
