import { AiPicInfo } from '@/typings';
import { makeXYArray, subStrToInt } from '@/utils';

/**
 * 解码AI图片数据
 * 该函数用于解析给定字符串格式的AI图片信息，将其转换为结构化数据数组
 * @param params 包含待解析字符串和地图缩放比例的参数对象
 * @param params.str 待解析的字符串
 * @param params.mapScale 地图缩放比例，默认为1
 * @returns 返回一个结构化的AI图片信息数组
 */
export const decodeAiPicData = (params: { str: string; mapScale?: number }): AiPicInfo[] => {
  const { str, mapScale = 1 } = params;

  const dataList = [] as Array<AiPicInfo>;

  const mapId = subStrToInt(str, 2, 4);
  const number = subStrToInt(str, 6, 2);

  if (number === 0) {
    return dataList;
  }

  let pos = 8;

  for (let i = 0; i < number; i++) {
    // X|Y 坐标数据
    const xyPositionHex = str.slice(pos, pos + 16);
    const xyObj = makeXYArray(xyPositionHex, mapScale);
    pos += 16;

    const object = subStrToInt(str, pos);
    pos += 2;
    const accuracy = subStrToInt(str, pos);
    pos += 2;
    const reserved = subStrToInt(str, pos, 8);
    pos += 8;

    dataList.push({
      id: `pic_${i}`,
      mapId,
      position: {
        x: xyObj.x,
        y: xyObj.y,
      },
      object,
      accuracy,
      reserved,
      xHex: xyPositionHex.slice(0, 8),
      yHex: xyPositionHex.slice(8),
    });
  }

  return dataList;
};
