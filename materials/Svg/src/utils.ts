import { getSystemInfoSync } from '@ray-js/ray';
import { isMiniProgram, isWeb } from '@ray-js/env';

/**
 * 单位转换
 * @link https://juejin.cn/post/6844903856409673736
 * @deprecated use useRpx2Px hooks instead of rpx2px
 */
export const rpx2px = (
  maybeRpx: string,
  sysInfo?: ReturnType<typeof getSystemInfoSync>
): string => {
  if (maybeRpx.endsWith('rpx')) {
    const value = Number(maybeRpx.replace(/rpx/g, ''));
    if (isMiniProgram) {
      const systemInfo = sysInfo || getSystemInfoSync();
      return `${(value / 750) * systemInfo.windowWidth}px`;
    }
    if (isWeb) {
      return value / 2 + 'px';
    }
  }
  return maybeRpx;
};
