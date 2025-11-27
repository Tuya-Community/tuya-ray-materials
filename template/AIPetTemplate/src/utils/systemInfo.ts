import { SystemInfo } from '@/redux/modules/systemInfoSlice';
import { getSystemInfoSync } from '@ray-js/ray';

let _systemInfoResult = null as SystemInfo;
export const getSystemInfoResult = () => {
  if (_systemInfoResult) {
    return _systemInfoResult;
  }
  try {
    const info = getSystemInfoSync() as SystemInfo;
    _systemInfoResult = info;
    return _systemInfoResult;
  } catch (err) {
    return {
      windowHeight: 667,
      windowWidth: 375,
      pixelRatio: 2,
    };
  }
};

// 获取真实的px
export const getDeviceRealPx = (px: number) => {
  const info = getSystemInfoResult();
  return Math.round(px * (info.windowWidth / 375));
};
