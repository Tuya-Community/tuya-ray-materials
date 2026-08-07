/** 设计稿：chip 之间 gap，与样式里 gap: 12rpx 一致 */
export const TAG_ROW_GAP_RPX = 12;

/** 与 .wrap 左右 padding 40rpx 一致（index.module.less） */
export const TAG_ROW_PADDING_HORIZONTAL_RPX = 40;

/** 用标签内容生成稳定 key，避免父组件每次 new [] 触发无效重测 */
export const tagsIdentityKey = (tags: string[]) => tags.join('\u0001');

type Rect = { width?: number };

/**
 * 根据各节点宽度，求折叠态首行最多能摆几个标签（不含「添加」与「+N」占位）
 * k 从全量试到 0，首个满足总宽 ≤ 容器宽的即为结果
 */
export function computeFirstRowTagCount(params: {
  /** 标签行可用宽度（已扣除容器左右 padding） */
  containerWidth: number;
  addWidth: number;
  tagWidths: number[];
  /**
   * 仅测一次「+标签总数」的宽度，作为任意「+hidden」的上界（略保守，少算半个字宽级误差可接受）
   */
  expandWidth: number;
  gapPx: number;
}): number {
  const { containerWidth, addWidth, tagWidths, expandWidth, gapPx } = params;
  const n = tagWidths.length;
  if (n === 0) {
    return 0;
  }

  const widthForExpand = (hidden: number) => (hidden > 0 ? expandWidth : 0);

  for (let k = n; k >= 0; k -= 1) {
    const hidden = n - k;
    const wExpand = widthForExpand(hidden);
    const sumTags = tagWidths.slice(0, k).reduce((s, w) => s + w, 0);
    const itemCount = 1 + k + (hidden > 0 ? 1 : 0);
    const gapCount = Math.max(0, itemCount - 1);
    const total = addWidth + sumTags + wExpand + gapCount * gapPx;
    if (total <= containerWidth) {
      return k;
    }
  }
  return 0;
}

/** 与 createSelectorQuery().select... 顺序一致地拆开结果数组 */
export function pickMeasureRects(raw: unknown[], tagCount: number) {
  const list = (raw || []) as Rect[];
  let i = 0;
  const container = list[i++];
  const add = list[i++];
  const tagRects: Rect[] = [];
  for (let t = 0; t < tagCount; t += 1) {
    tagRects.push(list[i++]);
  }
  const expandChip = list[i++];
  return { container, add, tagRects, expandChip };
}
