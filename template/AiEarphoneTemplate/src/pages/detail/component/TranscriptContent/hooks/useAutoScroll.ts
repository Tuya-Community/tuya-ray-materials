/**
 * 自动滚动控制的自定义 Hook
 * 负责管理自动滚动的启用/禁用状态
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { PlayStatus } from '../../../enum';
import { fileEmitter } from '../../../index';
import { TranscriptSegment } from '@/types/file';
import { findItemIndexByTime } from '../utils';
interface UseAutoScrollParams {
  playStatus: PlayStatus;
  showOutlinePopup: boolean;
  currentPlaySecond: number;
  transferList: TranscriptSegment[];
  onCollapseOutlinePopup: () => void;
  onSuppressNextAutoScroll?: () => void;
  scrollToItem: (itemIndex: number, isSliderJump?: boolean) => void;
}

interface UseAutoScrollReturn {
  autoScrollEnabled: boolean;
  handleScroll: (event: any, isUserTriggered?: boolean) => void;
  handleEnableAutoScroll: () => void;
  handleBackToPlayPosition: () => void;
}

/**
 * 使用自动滚动控制
 * @param params 参数对象
 * @returns 自动滚动相关的状态和方法
 */
export const useAutoScroll = (params: UseAutoScrollParams): UseAutoScrollReturn => {
  const {
    playStatus,
    showOutlinePopup,
    currentPlaySecond,
    transferList,
    onCollapseOutlinePopup,
    onSuppressNextAutoScroll,
    scrollToItem,
  } = params;

  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  // 用 ref 保存高频变化的值，避免 effect 因这些值变化反复解绑/重绑 fileEmitter 导致闭包泄漏
  const currentPlaySecondRef = useRef(currentPlaySecond);
  const transferListRef = useRef(transferList);
  const scrollToItemRef = useRef(scrollToItem);
  const autoScrollEnabledRef = useRef(autoScrollEnabled);
  currentPlaySecondRef.current = currentPlaySecond;
  transferListRef.current = transferList;
  scrollToItemRef.current = scrollToItem;
  autoScrollEnabledRef.current = autoScrollEnabled;

  // 处理用户手动滚动
  const handleScroll = useCallback(
    (event: any, isUserTriggered = false) => {
      if (!event) return;
      if (!isUserTriggered) {
        return;
      }

      // 只有在播放或暂停状态下，用户手动滚动才禁用自动滚动
      if (
        playStatus === PlayStatus.Play ||
        playStatus === PlayStatus.Pause ||
        playStatus === PlayStatus.Resume
      ) {
        if (autoScrollEnabled) {
          setAutoScrollEnabled(false);
        }
      }

      // 用户手动滚动时收起 OutlinePopup
      if (showOutlinePopup) {
        onCollapseOutlinePopup();
      }
    },
    [autoScrollEnabled, playStatus, showOutlinePopup, onCollapseOutlinePopup]
  );

  // 恢复自动滚动
  const handleEnableAutoScroll = useCallback(() => {
    if (!autoScrollEnabled) {
      setAutoScrollEnabled(true);
    }
  }, [autoScrollEnabled]);

  // 回到播放位置
  const handleBackToPlayPosition = useCallback(() => {
    // 启用自动滚动
    handleEnableAutoScroll();

    // 立即滚动到当前播放位置
    const itemIndex = findItemIndexByTime(
      transferListRef.current,
      currentPlaySecondRef.current || 0
    );
    if (itemIndex >= 0) {
      scrollToItemRef.current(itemIndex, true);
    }
  }, [handleEnableAutoScroll]);

  // 监听外部触发的恢复自动滚动事件（大纲点击、slider滑动等）
  // 通过 ref 读取最新值，effect 仅在挂载时绑定一次，避免高频 deps 导致反复解绑/重绑泄漏闭包
  useEffect(() => {
    const handleRestoreAutoScroll = (targetTime?: number) => {
      onSuppressNextAutoScroll?.();
      if (!autoScrollEnabledRef.current) {
        setAutoScrollEnabled(true);
      }

      const timeToScroll =
        targetTime !== undefined ? targetTime : currentPlaySecondRef.current || 0;
      const itemIndex = findItemIndexByTime(transferListRef.current, timeToScroll);
      if (itemIndex >= 0) {
        scrollToItemRef.current(itemIndex, true);
      }
    };

    fileEmitter.on('onRestoreAutoScroll', handleRestoreAutoScroll);

    return () => {
      fileEmitter.off('onRestoreAutoScroll', handleRestoreAutoScroll);
    };
  }, []);

  return {
    autoScrollEnabled,
    handleScroll,
    handleEnableAutoScroll,
    handleBackToPlayPosition,
  };
};
