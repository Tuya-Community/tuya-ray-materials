import { useEffect, useCallback, useRef } from 'react';
import type { FileMergeStatusEvent } from '@/api/ttt.interface';

/**
 * 全局 handler 引用，供 MergeRecordModal 精确 off/on，避免重复监听。
 */
const globalHandlerRef: { current: ((event: FileMergeStatusEvent) => void) | null } = {
  current: null,
};

/**
 * 获取当前全局 handler，供 MergeRecordModal 使用：
 *   - 弹窗打开时：off 全局 handler，注册弹窗自己的 handler
 *   - 弹窗关闭时：off 弹窗 handler，on 全局 handler
 */
export const getGlobalMergeStatusHandler = () => globalHandlerRef.current;

/**
 * 全局文件合并状态监听 hook，模式同 useRecordStatus。
 * 在 DelayedHooksContainer 中调用，传入回调处理合并完成/失败的全局逻辑。
 *
 * @param onMergeStatus 合并状态变更回调
 */
export const useFileMergeStatus = (
  onMergeStatus: (event: FileMergeStatusEvent) => void
) => {
  const onMergeStatusRef = useRef(onMergeStatus);
  onMergeStatusRef.current = onMergeStatus;

  const handleFileMergeStatus = useCallback((event: FileMergeStatusEvent) => {
    onMergeStatusRef.current(event);
  }, []);

  // 保存引用，供外部精确 off/on
  useEffect(() => {
    globalHandlerRef.current = handleFileMergeStatus;
    return () => {
      globalHandlerRef.current = null;
    };
  }, [handleFileMergeStatus]);

  useEffect(() => {
    // @ts-ignore
    ty.wear?.onFileMergeStatusEvent?.(handleFileMergeStatus);

    return () => {
      // @ts-ignore
      ty.wear?.offFileMergeStatusEvent?.(handleFileMergeStatus);
    };
  }, [handleFileMergeStatus]);

};
