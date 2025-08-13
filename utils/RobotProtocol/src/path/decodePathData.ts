import { PATH_HEADER_LENGTH, PATH_POINT_TYPE_MAP } from '@/constant/path';
import { PathHeader, PathPoint } from '@/typings';
import { hexStringToNumber, highLowToInt, transformXY } from '@/utils';
import { lz4Uncompress } from '@/utils/lz4';
import { chunk } from 'lodash-es';

/**
 * 解析路径点集
 * @param pathStr 原始路径字符串
 * @param pathHeader 路径Header数据
 * @returns 路径点集数据
 */
export const decodePathData = (pathStr: string, pathHeader: PathHeader): PathPoint[] => {
  const { dataLengthAfterCompress, count } = pathHeader;

  let dataArray = [];

  if (dataLengthAfterCompress > 0) {
    const maxBufferLength = count * 4;
    const dataArrayCompressed = hexStringToNumber(pathStr.slice(PATH_HEADER_LENGTH * 2));

    const uncompressed = lz4Uncompress(dataArrayCompressed, maxBufferLength);

    if (!uncompressed) {
      // TODO 解压缩失败回调
      return [];
    }

    const dataArrayUncompressed = Array.from(uncompressed);

    for (let i = 0; i < dataArrayUncompressed.length; i += 4) {
      const x = highLowToInt(dataArrayUncompressed[i], dataArrayUncompressed[i + 1]);
      const y = highLowToInt(dataArrayUncompressed[i + 2], dataArrayUncompressed[i + 3]);
      dataArray.push([x, y]);
    }
  } else {
    dataArray = chunk<number>(hexStringToNumber(pathStr.slice(PATH_HEADER_LENGTH * 2), 2), 2);
  }

  const pathPoints = [];

  for (let i = 0; i < dataArray.length; i++) {
    const [encodedX, encodedY] = dataArray[i];

    // 提取类型信息，最低位为点的类型
    const typeStr = `${encodedX & 0b1}${encodedY & 0b1}`;

    pathPoints.push({
      x: transformXY(1, encodedX & ~0b1),
      y: -transformXY(1, encodedY & ~0b1),
      type: PATH_POINT_TYPE_MAP[typeStr],
    });
  }

  return pathPoints;
};
