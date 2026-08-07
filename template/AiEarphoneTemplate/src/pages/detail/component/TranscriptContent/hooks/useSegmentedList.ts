/**
 * 分段渲染列表的自定义 Hook
 * 负责将完整列表分段为多个 chunk，并管理已渲染的 chunk
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { TranscriptSegment } from '@/types/file';
import { SEGMENT_NUM } from '../constants';

interface UseSegmentedListReturn {
  segmentList: TranscriptSegment[][];
  renderList: TranscriptSegment[][];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loadChunks: (targetChunkIndex: number, isSliderJump?: boolean) => void;
  handleScrollToLower: () => void;
  handleScrollToUpper: () => void; // 新增：上拉加载
  renderListStartIndex: number; // 新增：当前renderList的起始索引
  topLoading: boolean; // 新增：上拉加载loading状态
}

/**
 * 使用分段渲染列表
 * @param transferList 完整的转写列表
 * @returns 分段相关的状态和方法
 */
export const useSegmentedList = (transferList: TranscriptSegment[]): UseSegmentedListReturn => {
  const [loading, setLoading] = useState(false);
  const [topLoading, setTopLoading] = useState(false);
  const [segmentList, setSegmentList] = useState<TranscriptSegment[][]>([]);
  const [renderList, setRenderList] = useState<TranscriptSegment[][]>([]);
  const [renderListStartIndex, setRenderListStartIndex] = useState(0);
  const prevListLengthRef = useRef<number>(0);
  const topLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 根据 transferList 构建 chunk 数组
  const buildChunks = useCallback((list: TranscriptSegment[]) => {
    const chunks: TranscriptSegment[][] = [];

    for (let i = 0; i < list.length; i += SEGMENT_NUM) {
      const arr = list.slice(i, i + SEGMENT_NUM);
      chunks.push(arr);
    }

    // 如果最后一个 chunk 长度小于 SEGMENT_NUM/2，则合并到前一个
    if (chunks.length > 1) {
      const last = chunks[chunks.length - 1];
      if (last.length > 0 && last.length < SEGMENT_NUM / 2) {
        chunks[chunks.length - 2] = chunks[chunks.length - 2].concat(last);
        chunks.pop();
      }
    }

    return chunks;
  }, []);

  // transferList 变化时：仅内容编辑（长度不变）时保留当前滚动位置，长度变化时重新初始化
  useEffect(() => {
    const chunks = buildChunks(transferList);
    const listLengthChanged = prevListLengthRef.current !== transferList.length;

    setSegmentList(chunks);

    if (listLengthChanged || prevListLengthRef.current === 0) {
      // 列表长度变化或首次加载：重置为只显示第一个 chunk
      const initChunks = chunks.slice(0, 1);
      setRenderList(initChunks);
      setRenderListStartIndex(0);
    } else {
      // 仅内容编辑（text/transText 等）：保留当前已加载的 chunk 范围，只更新数据
      setRenderList(prev => {
        const start = renderListStartIndex;
        const count = prev.length;
        return chunks.slice(start, start + count);
      });
    }

    prevListLengthRef.current = transferList.length;
  }, [transferList, buildChunks]);

  // 加载指定范围的 chunk
  const loadChunks = useCallback(
    (targetChunkIndex: number, isSliderJump = false) => {
      if (targetChunkIndex < 0 || targetChunkIndex >= segmentList.length) return;

      if (isSliderJump) {
        // Slider跳转：只加载目标chunk本身
        const chunksToLoad = [segmentList[targetChunkIndex]];

        setRenderList(chunksToLoad);
        setRenderListStartIndex(targetChunkIndex);
        setLoading(false);
      } else {
        // 正常下拉加载：在当前renderList基础上追加
        const currentEndIndex = renderListStartIndex + renderList.length - 1;
        if (targetChunkIndex <= currentEndIndex) return; // 已经加载

        const nextChunks = segmentList.slice(currentEndIndex + 1, targetChunkIndex + 1);
        if (nextChunks.length > 0) {
          setLoading(true);
          setRenderList(prev => [...prev, ...nextChunks]);
        }
      }
    },
    [segmentList, renderList, renderListStartIndex]
  );

  // 下拉加载
  const handleScrollToLower = useCallback(() => {
    const currentEndIndex = renderListStartIndex + renderList.length - 1;
    const hasMore = currentEndIndex < segmentList.length - 1;

    if (hasMore) {
      setLoading(true);
      const nextIndex = currentEndIndex + 1;
      const nextChunks = segmentList.slice(nextIndex, nextIndex + 1);

      setRenderList(prev => [...prev, ...nextChunks]);
      return;
    }
    setLoading(false);
  }, [segmentList, renderList, renderListStartIndex]);

  // 上拉加载
  const handleScrollToUpper = useCallback(() => {
    if (renderListStartIndex > 0 && !topLoading) {
      setTopLoading(true);
      const prevIndex = renderListStartIndex - 1;
      const chunkToAdd = segmentList[prevIndex];

      setRenderList(prev => [chunkToAdd, ...prev]);
      setRenderListStartIndex(prevIndex);

      if (topLoadingTimerRef.current) {
        clearTimeout(topLoadingTimerRef.current);
      }
      topLoadingTimerRef.current = setTimeout(() => {
        setTopLoading(false);
        topLoadingTimerRef.current = null;
      }, 300);
    }
  }, [renderListStartIndex, segmentList, topLoading]);

  // cleanup
  useEffect(() => {
    return () => {
      if (topLoadingTimerRef.current) {
        clearTimeout(topLoadingTimerRef.current);
        topLoadingTimerRef.current = null;
      }
    };
  }, []);

  return {
    segmentList,
    renderList,
    loading,
    setLoading,
    loadChunks,
    handleScrollToLower,
    handleScrollToUpper,
    renderListStartIndex,
    topLoading,
  };
};
