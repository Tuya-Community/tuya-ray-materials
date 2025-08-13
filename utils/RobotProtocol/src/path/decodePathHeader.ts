import { PATH_HEADER_LENGTH } from '@/constant/path';
import { PathHeader } from '@/typings';

/**
 * 解析路径Header
 * @param pathStr 原始路径字符串
 * @returns 路径Header数据
 */
export const decodePathHeader = (pathStr: string): PathHeader => {
  const pathHeaderStr = pathStr.slice(0, PATH_HEADER_LENGTH * 2);

  const version = parseInt(pathHeaderStr.slice(0, 2), 16);
  const pathId = parseInt(pathHeaderStr.slice(2, 6), 16);
  const initFlag = parseInt(pathHeaderStr.slice(6, 8), 16);
  const type = parseInt(pathHeaderStr.slice(8, 10), 16);
  const count = parseInt(pathHeaderStr.slice(10, 18), 16);
  const direction = parseInt(pathHeaderStr.slice(18, 22), 16);
  const dataLengthAfterCompress = parseInt(pathHeaderStr.slice(22, 26), 16);

  return {
    version,
    pathId,
    initFlag,
    type,
    count,
    direction,
    dataLengthAfterCompress,
  };
};
