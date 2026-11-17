import { getCdnUrl } from '@ray-js/ray';
import cdnImage from 'cdn/cdnImage.json';

/**
 * 电量图标映射（枚举状态）。
 */
const eleStateMap: Record<string, string> = {
  low: getCdnUrl('ele_02_1.png', cdnImage),
  poweroff: getCdnUrl('ele_01_1.png', cdnImage),
  medium: getCdnUrl('ele_05_1.png', cdnImage),
  high: getCdnUrl('ele_08_1.png', cdnImage),
};

/**
 * 电量数值 → 图标映射（按十位分段）。
 */
const eleMap: Record<number, string> = {
  0: getCdnUrl('ele_01.png', cdnImage),
  1: getCdnUrl('ele_02.png', cdnImage),
  2: getCdnUrl('ele_03.png', cdnImage),
  3: getCdnUrl('ele_04.png', cdnImage),
  4: getCdnUrl('ele_05.png', cdnImage),
  5: getCdnUrl('ele_06.png', cdnImage),
  6: getCdnUrl('ele_07.png', cdnImage),
  7: getCdnUrl('ele_08.png', cdnImage),
  8: getCdnUrl('ele_08.png', cdnImage),
  9: getCdnUrl('ele_08.png', cdnImage),
  10: getCdnUrl('ele_08.png', cdnImage),
};

/**
 * 数值电量按十分位归段选图标，默认 ele_05。
 */
const eleFormat = (ele: number) => {
  const index = Math.floor(ele / 10);
  return eleMap[index] || getCdnUrl('ele_05.png', cdnImage);
};

/**
 * 根据电量值/枚举状态返回对应图标资源。
 * - 数值（0-100）：按十位分段选 ele_01 ~ ele_08
 * - 枚举（low/medium/high/poweroff）：选 ele_xx_1
 */
export const getEleIcon = (ele: number | string): string => {
  if (typeof ele === 'number') {
    return eleFormat(ele);
  }
  return eleStateMap[ele];
};
