import { useMemo } from 'react';
import { getSystemCacheInfo } from './utils';
/**
 * @description 将标准像素转换为适配后的像素
 * @param stdPx 标准像素
 * @param toFixed 保留小数点后几位
 * @returns 适配后的像素
 */
export const useStdPx2Adapt = (stdPx: number, toFixed = 2): number => {
  const { screenWidth } = useMemo(() => getSystemCacheInfo(), [stdPx]);
  return +(stdPx * (screenWidth / 375)).toFixed(toFixed) || stdPx;
};
