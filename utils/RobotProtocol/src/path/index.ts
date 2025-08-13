import { PathData } from '@/typings';
import { decodePathHeader } from './decodePathHeader';
import { decodePathData } from './decodePathData';

/**
 * 解析路径数据
 * @param pathStr 原始路径字符串
 * @returns 路径数据
 */
export const decodePath = (pathStr: string): PathData => {
  const pathHeader = decodePathHeader(pathStr);
  const pathPoints = decodePathData(pathStr, pathHeader);

  return {
    pathHeader,
    pathPoints,
  };
};

export { decodePathHeader, decodePathData };
