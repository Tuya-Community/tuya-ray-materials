import { hexToUTF8 } from '@/utils';

/**
 * 解析结构化地图数据
 * @param mapStr 原始地图字符串
 * @returns 地图json数据
 */
export const decodeMapStructured = (mapStr: string) => {
  try {
    return JSON.parse(hexToUTF8(mapStr));
  } catch (err) {
    //
    console.error(err);
    return {};
  }
};
