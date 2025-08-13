import type { AIObject } from '@/typings';
import { AI_OBJECT_CMD_ROBOT_V1 } from '@/constant/cmd';
import { transformXY } from '@/utils';
import { decodeStandardFeatureCommand, encodeStandardFeatureCommand } from '@/utils/command';

/**
 * *AI物体识别0x36/0x37
 *
 * 向设备请求AI物体识别数据(0x17) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestAIObject0x37 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(AI_OBJECT_CMD_ROBOT_V1, '', version);
};

/**
 * *AI物体识别0x36/0x37
 *
 * 从指令中解析获取AI物体识别数据(0x37) | Robot ➜ App
 * @param params 参数
 * @returns 定点清扫信息
 */
export const decodeAIObject0x37 = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): AIObject[] | null => {
  const { command, mapScale = 1, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(command, AI_OBJECT_CMD_ROBOT_V1, version);

  if (!valid) {
    return null;
  }

  const aiObjectsRaw = dataStr.slice(2).match(/.{10}/g);

  const aiObjects =
    aiObjectsRaw?.map(aiObjectRaw => {
      const x = transformXY(mapScale, parseInt(aiObjectRaw.slice(0, 4), 16));
      const y = -transformXY(mapScale, parseInt(aiObjectRaw.slice(4, 8), 16));
      return {
        point: { x, y },

        type: parseInt(aiObjectRaw.slice(8, 10), 16),
      };
    }) ?? [];

  return aiObjects;
};
