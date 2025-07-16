import { getSystemInfoSync } from '@ray-js/ray';

let __getSystemInfoSync = null;
export const getCachedSystemInfo = () => {
  if (__getSystemInfoSync) {
    return __getSystemInfoSync;
  }
  try {
    const systemInfo = getSystemInfoSync();
    __getSystemInfoSync = systemInfo;
  } catch (e) {
    __getSystemInfoSync = null;
  }
  return __getSystemInfoSync;
};

export default {
  getCachedSystemInfo,
};
