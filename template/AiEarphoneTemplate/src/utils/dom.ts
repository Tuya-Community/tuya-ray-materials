/*
 * @Author: hkc
 * @Date: 2025-08-28 17:35:02
 * @LastEditors: hkc
 * @LastEditTime: 2025-09-23 15:00:06
 * @Description:
 */
import { getBoundingClientRect, getElementById } from '@ray-js/ray';

// 获取元素边界信息
export const getDomClientRect = async (id: string) => {
  try {
    const element = await getElementById(id);
    if (element) {
      const rect = await getBoundingClientRect(element);
      return rect;
    }
  } catch (error) {
    console.error('Error getting size:', error);
  }
  return { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
};

// 获取元素距离顶部距离
export const getDomRectTop = async (id: string) => {
  const rect = await getDomClientRect(id);

  return rect?.top ? rect.top : 0;
};
