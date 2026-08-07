/**
 * SttContent 组件的工具函数
 */

import { TranscriptSegment } from '@/types/file';
import { SEGMENT_NUM } from './constants';

/**
 * 根据播放时间查找对应的列表项索引
 * @param transferList 转写列表
 * @param second 播放时间（秒）
 * @returns 列表项索引，未找到返回 -1
 */
export const findItemIndexByTime = (transferList: TranscriptSegment[], second: number): number => {
  if (!transferList.length) {
    return -1;
  }

  // 首先查找精确匹配的项
  for (let i = 0; i < transferList.length; i++) {
    const item = transferList[i];
    if (second >= item.startSecond && second < item.endSecond) {
      return i;
    }
  }

  // 如果没找到，返回最接近的项
  for (let i = 0; i < transferList.length; i++) {
    if (transferList[i].startSecond > second) {
      return Math.max(0, i - 1);
    }
  }

  return transferList.length - 1;
};

/**
 * 根据列表项索引计算对应的 chunk 索引
 * @param itemIndex 列表项索引
 * @param segmentNum 每个 chunk 的项数量，默认使用 SEGMENT_NUM
 * @returns chunk 索引
 */
export const getChunkIndexByItemIndex = (
  itemIndex: number,
  segmentNum: number = SEGMENT_NUM
): number => {
  return Math.floor(itemIndex / segmentNum);
};

/**
 * 检测节点是否已渲染
 * @param nodeId 节点 ID
 * @param page 页面实例
 * @returns Promise<boolean> 节点是否已渲染
 */
export const checkNodeRendered = (nodeId: string, page: any): Promise<boolean> => {
  return new Promise(resolve => {
    if (!page) {
      resolve(false);
      return;
    }

    try {
      const query = page.createSelectorQuery();
      query
        .select(`#${nodeId}`)
        .boundingClientRect()
        .exec(res => {
          resolve(res?.[0] != null);
        });
    } catch (error) {
      console.error('===checkNodeRendered error===', error);
      resolve(false);
    }
  });
};

/**
 * 生成列表项的唯一 ID
 * @param chunkIndex chunk 索引
 * @param indexInChunk chunk 内的索引
 * @returns 唯一 ID
 */
export const generateItemId = (chunkIndex: number, indexInChunk: number): string => {
  return `item_${chunkIndex}_${indexInChunk}`;
};

/**
 * 生成 chunk 的唯一 ID
 * @param wrapperId 容器 ID
 * @param chunkIndex chunk 索引
 * @returns 唯一 ID
 */
export const generateChunkId = (wrapperId: string, chunkIndex: number): string => {
  return `${wrapperId}_chunk_${chunkIndex}`;
};
