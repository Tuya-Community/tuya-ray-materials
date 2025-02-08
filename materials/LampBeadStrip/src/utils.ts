/*
 * @Author: mjh
 * @Date: 2024-09-02 15:08:35
 * @LastEditors: mjh
 * @LastEditTime: 2024-09-02 15:08:46
 * @Description:
 */
import { getSystemInfoSync } from '@ray-js/ray';
let _systemInfo = null;
export const getSystemInfoRes = () => {
  if (_systemInfo) {
    return _systemInfo;
  }
  try {
    _systemInfo = getSystemInfoSync();
  } catch (error) {
    console.error(error);
    return {};
  }
  return _systemInfo;
};
