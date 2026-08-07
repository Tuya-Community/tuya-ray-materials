/**
 * 大纲可见性监听的自定义 Hook
 * 负责监听大纲组件是否在可视区域，以及更新可视区域中间位置的章节时间
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useDebounceFn } from 'ahooks';
import { TranscriptSegment, OutlineItem } from '@/types/file';
import {
  VISIBLE_CHAPTER_UPDATE_WAIT,
  VISIBLE_CHAPTER_UPDATE_DELAY,
  OUTLINE_COMPONENT_ID,
  SEGMENT_NUM,
} from '../constants';

interface UseOutlineVisibilityParams {
  page: any;
  wrapperId: string;
  transferList: TranscriptSegment[];
  outlineList: OutlineItem[];
  setScrollVisibleChapterTime?: (time: number) => void;
  isPageActiveRef: React.MutableRefObject<boolean>;
  outlineVisible: boolean;
}

interface UseOutlineVisibilityReturn {
  showOutlinePopup: boolean;
  updateVisibleChapterTime: () => void;
}

/**
 * 使用大纲可见性监听
 * @param params 参数对象
 * @returns 大纲可见性相关的状态和方法
 */
export const useOutlineVisibility = (
  params: UseOutlineVisibilityParams
): UseOutlineVisibilityReturn => {
  const {
    page,
    wrapperId,
    transferList,
    outlineList,
    setScrollVisibleChapterTime,
    isPageActiveRef,
    outlineVisible,
  } = params;

  const [showOutlinePopup, setShowOutlinePopup] = useState(false);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibilityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryRunningRef = useRef(false);
  const lastVisibleIndexRef = useRef<number | null>(null);
  const lastVisibleTimeRef = useRef<number | null>(null);

  const checkOutlineVisibility = useCallback(() => {
    if (!page) return;
    try {
      page
        .createSelectorQuery()
        .select(`#${wrapperId}`)
        .boundingClientRect()
        .select(`#${OUTLINE_COMPONENT_ID}`)
        .boundingClientRect()
        .exec((res: any) => {
          const wrapperRect = res?.[0];
          const outlineRect = res?.[1];
          if (!wrapperRect || !outlineRect) {
            setShowOutlinePopup(true);
            return;
          }
          const isVisible =
            outlineRect.bottom > wrapperRect.top && outlineRect.top < wrapperRect.bottom;
          setShowOutlinePopup(!isVisible);
        });
    } catch (error) {
      console.error('===check outline visibility failed===', error);
    }
  }, [page, wrapperId]);

  // 检测可视区域中间位置的列表项并更新章节时间（节流版本）
  const { run: updateVisibleChapterTime } = useDebounceFn(
    () => {
      if (!page || !showOutlinePopup || transferList.length === 0 || !isPageActiveRef.current) {
        return;
      }

      try {
        if (queryRunningRef.current) return;
        queryRunningRef.current = true;

        page
          .createSelectorQuery()
          .select(`#${wrapperId}`)
          .boundingClientRect()
          .selectAll('.stt-list-item')
          .boundingClientRect()
          .exec(res => {
            queryRunningRef.current = false;
            if (!res || !res[0] || !res[1] || res[1].length === 0) return;

            const scrollViewRect = res[0];
            const items = res[1];
            const middleY = scrollViewRect.top + scrollViewRect.height / 2;

            // 二分查找：定位中间位置附近的列表项，避免全量遍历
            let low = 0;
            let high = items.length - 1;
            let targetIndex = -1;

            while (low <= high) {
              const mid = Math.floor((low + high) / 2);
              const item = items[mid];
              if (middleY < item.top) {
                high = mid - 1;
              } else if (middleY > item.bottom) {
                low = mid + 1;
              } else {
                targetIndex = mid;
                break;
              }
            }

            if (targetIndex === -1) {
              const candidates = [high, low].filter(
                idx => idx >= 0 && idx < items.length
              ) as number[];
              if (candidates.length === 0) return;
              let minDistance = Infinity;
              candidates.forEach(idx => {
                const item = items[idx];
                const itemMiddleY = item.top + item.height / 2;
                const distance = Math.abs(itemMiddleY - middleY);
                if (distance < minDistance) {
                  minDistance = distance;
                  targetIndex = idx;
                }
              });
            }

            if (targetIndex < 0) return;
            const targetItem = items[targetIndex];

            // 从 id 中解析出真实的索引: item_{chunkIndex}_{index}
            const idMatch = targetItem.id?.match(/item_(\d+)_(\d+)/);
            if (!idMatch) return;

            const chunkIndex = parseInt(idMatch[1], 10);
            const itemIndex = parseInt(idMatch[2], 10);
            const realIndex = chunkIndex * SEGMENT_NUM + itemIndex;

            if (!transferList[realIndex]) return;
            if (lastVisibleIndexRef.current === realIndex) return;

            const { startSecond } = transferList[realIndex];
            if (lastVisibleTimeRef.current === startSecond) return;

            lastVisibleIndexRef.current = realIndex;
            lastVisibleTimeRef.current = startSecond;
            setScrollVisibleChapterTime?.(startSecond);
          });
      } catch (error) {
        queryRunningRef.current = false;
        console.error('===update visible chapter time failed===', error);
      }
    },
    { wait: VISIBLE_CHAPTER_UPDATE_WAIT }
  );

  // 监听 Outline 组件的可见性
  useEffect(() => {
    if (!page || !outlineList?.length) {
      return () => {};
    }

    if (!outlineVisible) {
      setShowOutlinePopup(true);
      return () => {};
    }

    let outlineObserver = null;
    let unmounted = false;

    try {
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
      visibilityTimeoutRef.current = setTimeout(() => {
        if (unmounted) return;

        checkOutlineVisibility();

        outlineObserver = page.createIntersectionObserver();
        outlineObserver
          .relativeTo(`#${wrapperId}`, { top: 0, bottom: 0 })
          .observe(`#${OUTLINE_COMPONENT_ID}`, res => {
            if (unmounted) return;
            const isVisible = res.intersectionRatio > 0;
            setShowOutlinePopup(!isVisible);
          });
      }, 50);
    } catch (error) {
      console.error('===create outline observer failed===', error);
    }

    return () => {
      unmounted = true;
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
        visibilityTimeoutRef.current = null;
      }
      if (outlineObserver) {
        try {
          outlineObserver.disconnect();
        } catch (error) {
          console.error('===disconnect outline observer failed===', error);
        }
      }
    };
  }, [page, outlineList, wrapperId, outlineVisible, checkOutlineVisibility]);

  // 当 OutlinePopup 显示时，立即更新一次可视区域的章节时间
  useEffect(() => {
    if (showOutlinePopup && isPageActiveRef.current) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = setTimeout(() => {
        updateVisibleChapterTime();
      }, VISIBLE_CHAPTER_UPDATE_DELAY);
    }
  }, [showOutlinePopup, updateVisibleChapterTime]);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
        visibilityTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    showOutlinePopup,
    updateVisibleChapterTime,
  };
};
