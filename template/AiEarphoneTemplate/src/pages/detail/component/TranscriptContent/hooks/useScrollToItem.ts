/**
 * 滚动到指定列表项的自定义 Hook
 * 负责处理滚动到指定项的复杂逻辑，包括节点检测、重试机制等
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { TranscriptSegment } from '@/types/file';
import { checkNodeRendered, getChunkIndexByItemIndex, generateItemId } from '../utils';
import {
  SCROLL_DEBOUNCE_WAIT,
  SCROLL_RESET_DELAY,
  SCROLL_INTO_VIEW_FIRST_DELAY,
  SCROLL_FORCE_TRIGGER_DELAY,
  NODE_CHECK_RETRY_MAX,
  NODE_CHECK_RETRY_INTERVAL,
  SEGMENT_NUM,
} from '../constants';

interface UseScrollToItemParams {
  transferList: TranscriptSegment[];
  wrapperId: string;
  page: any;
  currentPlaySecond: number;
  segmentList: TranscriptSegment[][];
  renderList: TranscriptSegment[][];
  loadChunks: (targetChunkIndex: number, isSliderJump?: boolean) => void;
  setScrollVisibleChapterTime?: (time: number) => void;
  programmaticScrollRef: React.MutableRefObject<boolean>; // 标记是否为程序触发的滚动
  renderListStartIndex: number; // 当前renderList的起始索引
}

interface UseScrollToItemReturn {
  scrollIntoViewId: string;
  scrollToItem: (itemIndex: number, isSliderJump?: boolean) => Promise<void>;
  debouncedScrollToItem: (itemIndex: number, isSliderJump?: boolean) => void;
  lastScrollItemIndexRef: React.MutableRefObject<number>;
}

/**
 * 使用滚动到指定列表项
 * @param params 参数对象
 * @returns 滚动相关的状态和方法
 */
export const useScrollToItem = (params: UseScrollToItemParams): UseScrollToItemReturn => {
  const {
    transferList,
    page,
    currentPlaySecond,
    loadChunks,
    setScrollVisibleChapterTime,
    programmaticScrollRef,
  } = params;

  const [scrollIntoViewId, setScrollIntoViewId] = useState<string>('');
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<any>(null);
  const forceScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPlaySecondRef = useRef<number>(0);
  const lastScrollItemIndexRef = useRef<number>(-1);

  // 用 ref 保存高频变化的值，避免 scrollToItem 每秒因 deps 变化重建、连锁触发其他 hook 闭包泄漏
  const currentPlaySecondRef = useRef(currentPlaySecond);
  const transferListRef = useRef(transferList);
  const loadChunksRef = useRef(loadChunks);
  currentPlaySecondRef.current = currentPlaySecond;
  transferListRef.current = transferList;
  loadChunksRef.current = loadChunks;

  // 执行滚动到指定列表项
  const executeScrollToItem = useCallback(
    (itemIndex: number) => {
      if (itemIndex < 0 || itemIndex >= transferListRef.current.length) return;

      const chunkIndex = getChunkIndexByItemIndex(itemIndex);
      const indexInChunk = itemIndex % SEGMENT_NUM;

      // 使用全局chunk索引生成itemId，确保能找到正确的DOM元素
      const itemId = generateItemId(chunkIndex, indexInChunk);

      isScrollingRef.current = true;
      programmaticScrollRef.current = true;

      // 先清空 scrollIntoViewId，再设置新值，强制触发滚动
      setScrollIntoViewId('');
      if (forceScrollTimeoutRef.current) {
        clearTimeout(forceScrollTimeoutRef.current);
      }
      forceScrollTimeoutRef.current = setTimeout(() => {
        setScrollIntoViewId(itemId);
      }, SCROLL_FORCE_TRIGGER_DELAY);

      lastScrollItemIndexRef.current = itemIndex;

      // 重置滚动状态，并更新可视区域章节时间
      if (resetScrollTimeoutRef.current) {
        clearTimeout(resetScrollTimeoutRef.current);
      }
      resetScrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        programmaticScrollRef.current = false;

        // 程序触发的滚动完成后，更新 OutlinePopup 显示的章节
        if (transferListRef.current[itemIndex]) {
          const { startSecond } = transferListRef.current[itemIndex];
          setScrollVisibleChapterTime?.(startSecond);
        }
      }, SCROLL_RESET_DELAY);
    },
    [setScrollVisibleChapterTime]
  );

  // 延迟滚动到列表项，带节点检测和重试机制
  const delayedScrollToItem = useCallback(
    (itemIndex: number, itemId: string, retryCount = 0) => {
      // 首次调用时标记为正在滚动，防止并发滚动冲突
      if (retryCount === 0) {
        isScrollingRef.current = true;
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(
        async () => {
          // 检测节点是否已渲染
          const rendered = await checkNodeRendered(itemId, page);

          if (rendered) {
            executeScrollToItem(itemIndex);
          } else if (retryCount < NODE_CHECK_RETRY_MAX) {
            delayedScrollToItem(itemIndex, itemId, retryCount + 1);
          } else {
            executeScrollToItem(itemIndex);
          }
        },
        retryCount === 0 ? SCROLL_INTO_VIEW_FIRST_DELAY : NODE_CHECK_RETRY_INTERVAL
      );
    },
    [page, executeScrollToItem]
  );

  // 滚动到指定列表项（基于时间方向判断）
  // transferList / currentPlaySecond 通过 ref 读取，避免 useCallback 因这些高频变化值重建
  const scrollToItem = useCallback(
    async (itemIndex: number, isSliderJump = false) => {
      if (itemIndex < 0 || itemIndex >= transferListRef.current.length) return;
      if (isScrollingRef.current) return;

      const chunkIndex = getChunkIndexByItemIndex(itemIndex);
      const indexInChunk = itemIndex % SEGMENT_NUM;
      const itemId = generateItemId(chunkIndex, indexInChunk);

      // 对比新旧 currentPlaySecond，判断滚动方向
      const newPlaySecond = currentPlaySecondRef.current || 0;
      lastPlaySecondRef.current = newPlaySecond;

      // 检测目标节点是否已渲染
      const nodeRendered = await checkNodeRendered(itemId, page);

      if (nodeRendered) {
        executeScrollToItem(itemIndex);
      } else {
        loadChunksRef.current(chunkIndex, isSliderJump);

        // @ts-ignore
        ty?.nextTick(async () => {
          delayedScrollToItem(itemIndex, itemId);
        });
      }
    },
    [page, executeScrollToItem, delayedScrollToItem]
  );

  // 防抖滚动函数
  const { run: debouncedScrollToItem } = useDebounceFn(
    (itemIndex: number, isSliderJump = false) => {
      scrollToItem(itemIndex, isSliderJump);
    },
    { wait: SCROLL_DEBOUNCE_WAIT, leading: false, trailing: true }
  );

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (forceScrollTimeoutRef.current) {
        clearTimeout(forceScrollTimeoutRef.current);
        forceScrollTimeoutRef.current = null;
      }
      if (resetScrollTimeoutRef.current) {
        clearTimeout(resetScrollTimeoutRef.current);
        resetScrollTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    scrollIntoViewId,
    scrollToItem,
    debouncedScrollToItem,
    lastScrollItemIndexRef,
  };
};
