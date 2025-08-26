/*
 * @Author: mjh
 * @Date: 2025-02-13 15:00:47
 * @LastEditors: mjh
 * @LastEditTime: 2025-02-13 15:00:53
 * @Description: 
 */

import { usePageInstance } from "@ray-js/ray";

/**
 * @name: 获取功能页存储数据
 * @desc:
 * @return {*}
 */
export const useLampMutationPresetData = () => {
  const page = usePageInstance();
  const data: any = page.getPresetData() || {};
  return data;
};