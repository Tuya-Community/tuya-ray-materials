/**
 * RPX 单位转换工具
 * 复用原有 recycleview 的转换逻辑，适配 Ray 框架
 */
import store from '@/redux';
const BASE_DEVICE_WIDTH = 750;
const eps = 1e-4;
let deviceWidth;
let deviceDPR;
let isIPhone = false;
const checkDeviceWidth = () => {
  try {
    const info = store.getState().systemInfo;
    isIPhone = info.platform === 'ios';
    deviceWidth = info.screenWidth || 375;
    deviceDPR = info.pixelRatio || 2;
  } catch {
    deviceWidth = 375;
    deviceDPR = 2;
    isIPhone = false;
  }
};

// 初始化
checkDeviceWidth();

/**
 * 根据设备 DPR 转换数值
 */
const transformByDPR = number => {
  if (number === 0) return 0;
  number = (number / BASE_DEVICE_WIDTH) * deviceWidth;
  number = Math.floor(number + eps);
  if (number === 0) {
    if (deviceDPR === 1 || !isIPhone) {
      return 1;
    }
    return 0.5;
  }
  return number;
};
const rpxRE = /([+-]?\d+(?:\.\d+)?)rpx/gi;

/**
 * 将 rpx 单位转换为 px
 * @param value - 包含 rpx 的字符串或数字
 * @param addPxSuffix - 是否添加 px 后缀
 * @returns 转换后的值
 */
export function transformRpx(value, addPxSuffix = false) {
  if (typeof value === 'number') {
    const result = transformByDPR(value);
    return addPxSuffix ? `${result}px` : result;
  }
  if (typeof value !== 'string') {
    return value;
  }
  return value.replace(rpxRE, (match, num) => {
    return transformByDPR(Number(num)) + (addPxSuffix ? 'px' : '');
  });
}

export default transformRpx;
