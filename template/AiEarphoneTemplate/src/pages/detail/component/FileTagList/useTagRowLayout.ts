import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePageInstance } from '@ray-js/ray';
import { useSelector } from '@/redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { transformRpx } from '@/utils/transformRpx';
import styles from './index.module.less';
import {
  computeFirstRowTagCount,
  pickMeasureRects,
  tagsIdentityKey,
  TAG_ROW_GAP_RPX,
  TAG_ROW_PADDING_HORIZONTAL_RPX,
} from './layoutMath';

const MAX_MEASURE_RETRY = 5;

/** 上次折叠布局快照：收起时复用，避免闪屏；tags 或屏宽变化则失效 */
type CollapsedLayoutCache = {
  firstRowTagCount: number;
  tagsKey: string;
  layoutWidth: number;
};

export function useTagRowLayout(tags: string[]) {
  const page = usePageInstance();
  const systemInfo = useSelector(selectSystemInfo) as {
    screenWidth?: number;
    windowWidth?: number;
  };
  const layoutWidth = systemInfo.screenWidth ?? systemInfo.windowWidth ?? 375;

  const uidRef = useRef(`ftl_${Math.random().toString(36).slice(2, 11)}`);
  const [expanded, setExpanded] = useState(false);
  const [firstRowTagCount, setFirstRowTagCount] = useState(0);
  const [collapsedReady, setCollapsedReady] = useState(() => tags.length === 0);

  const retryRef = useRef(0);
  const wasExpandedRef = useRef(false);
  const collapsedCacheRef = useRef<CollapsedLayoutCache | null>(null);
  /** 卸载后不再应用测量结果，避免对已卸载组件 setState */
  const mountedRef = useRef(true);
  const layoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tagsKey = useMemo(() => tagsIdentityKey(tags), [tags]);
  /** 与样式 gap 一致，随 layoutWidth 依赖重算以便屏宽变化后测量使用最新 px */
  const gapPx = useMemo(() => transformRpx(TAG_ROW_GAP_RPX) as number, [layoutWidth]);
  const horizontalPadPx = useMemo(
    () => transformRpx(TAG_ROW_PADDING_HORIZONTAL_RPX) as number,
    [layoutWidth]
  );

  const commitCollapsedLayout = useCallback((firstRow: number, key: string, width: number) => {
    if (!mountedRef.current) {
      return;
    }
    setFirstRowTagCount(firstRow);
    setCollapsedReady(true);
    collapsedCacheRef.current = {
      firstRowTagCount: firstRow,
      tagsKey: key,
      layoutWidth: width,
    };
  }, []);

  const clearLayoutTimer = useCallback(() => {
    if (layoutTimerRef.current != null) {
      clearTimeout(layoutTimerRef.current);
      layoutTimerRef.current = null;
    }
  }, []);

  const scheduleLayout = useCallback(
    (fn: () => void) => {
      clearLayoutTimer();
      layoutTimerRef.current = setTimeout(() => {
        layoutTimerRef.current = null;
        fn();
      }, 0);
    },
    [clearLayoutTimer]
  );

  const measureAndApply = useCallback(() => {
    if (!page || tags.length === 0 || expanded) {
      return;
    }
    const id = uidRef.current;
    const q = page.createSelectorQuery();
    q.select(`#${id}_c`).boundingClientRect();
    q.select(`#${id}_add`).boundingClientRect();
    tags.forEach((_, i) => {
      q.select(`#${id}_m_${i}`).boundingClientRect();
    });
    q.select(`#${id}_e`).boundingClientRect();

    q.exec((res: unknown[]) => {
      if (!mountedRef.current) {
        return;
      }
      const { container, add, tagRects, expandChip } = pickMeasureRects(res, tags.length);
      const wBorder = container?.width ?? 0;
      const wContainer = Math.max(0, wBorder - 2 * horizontalPadPx);
      const wAdd = add?.width ?? 0;

      if (!wBorder || !wAdd || wContainer <= 0) {
        if (retryRef.current < MAX_MEASURE_RETRY) {
          retryRef.current += 1;
          scheduleLayout(measureAndApply);
        } else {
          commitCollapsedLayout(tags.length, tagsKey, layoutWidth);
        }
        return;
      }
      retryRef.current = 0;

      const tagWidths = tagRects.map(r => r?.width ?? 0);
      const k = computeFirstRowTagCount({
        containerWidth: wContainer,
        addWidth: wAdd,
        tagWidths,
        expandWidth: expandChip?.width ?? 0,
        gapPx,
      });
      commitCollapsedLayout(k, tagsKey, layoutWidth);
    });
  }, [
    page,
    tags,
    expanded,
    gapPx,
    horizontalPadPx,
    tagsKey,
    layoutWidth,
    commitCollapsedLayout,
    scheduleLayout,
  ]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    retryRef.current = 0;

    if (expanded) {
      setFirstRowTagCount(tags.length);
      wasExpandedRef.current = true;
      return clearLayoutTimer;
    }

    if (tags.length === 0) {
      setFirstRowTagCount(0);
      setCollapsedReady(true);
      wasExpandedRef.current = false;
      collapsedCacheRef.current = null;
      return clearLayoutTimer;
    }

    if (wasExpandedRef.current) {
      wasExpandedRef.current = false;
      const cache = collapsedCacheRef.current;
      if (cache && cache.tagsKey === tagsKey && cache.layoutWidth === layoutWidth) {
        setFirstRowTagCount(cache.firstRowTagCount);
        setCollapsedReady(true);
        return clearLayoutTimer;
      }
    }

    setCollapsedReady(false);
    setFirstRowTagCount(0);
    scheduleLayout(measureAndApply);

    return clearLayoutTimer;
  }, [
    expanded,
    measureAndApply,
    layoutWidth,
    tagsKey,
    tags.length,
    scheduleLayout,
    clearLayoutTimer,
  ]);

  const handleCollapse = useCallback(() => {
    const cached = collapsedCacheRef.current?.firstRowTagCount ?? 0;
    setFirstRowTagCount(cached);
    setExpanded(false);
  }, []);

  const hiddenCount = expanded ? 0 : Math.max(0, tags.length - firstRowTagCount);
  const showExpand = !expanded && collapsedReady && hiddenCount > 0;
  const showCollapse = expanded && tags.length > 0;
  const visibleTags = expanded ? tags : collapsedReady ? tags.slice(0, firstRowTagCount) : [];
  const rowClassName = expanded ? styles.row : `${styles.row} ${styles.rowCollapsed}`;

  return {
    uid: uidRef.current,
    expanded,
    setExpanded,
    handleCollapse,
    visibleTags,
    hiddenCount,
    showExpand,
    showCollapse,
    rowClassName,
  };
}
