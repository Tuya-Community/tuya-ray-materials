import type { DataArray } from '@/typings';
import { SAVE_MAP_CMD_APP_V1, SAVE_MAP_CMD_ROBOT_V1 } from '@/constant/cmd';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeExtendFeatureCommand,
} from '@/utils/command';

/**
 * *保存地图0x2a/0x2b
 *
 * 保存地图指令(0x2a) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeSaveMap0x2a = (saveSpace = 1): string => {
  const dataArray: DataArray = [];

  dataArray.push(saveSpace);

  return encodeExtendFeatureCommand(SAVE_MAP_CMD_APP_V1, convertDataArrayToDataStr(dataArray));
};

/**
 * @deprecated 请使用 encodeSaveMap0x2a
 */
export const encodeSaveMapV1 = encodeSaveMap0x2a;

/**
 * *保存地图0x2a/0x2b
 *
 * 保存地图结果(0x2b) | Robot ➜ App
 * @param params 参数
 * @returns 保存地图结果
 */
export const decodeSaveMap0x2b = (params: {
  command: string;
}): {
  ret: number;
  success: boolean;
} | null => {
  const { command } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(command, SAVE_MAP_CMD_ROBOT_V1);

  if (!valid) {
    return null;
  }

  const ret = parseInt(dataStr.slice(0, 2), 16);

  return {
    ret,
    success: ret === 1,
  };
};

/**
 * @deprecated 请使用 decodeSaveMap0x2b
 */
export const decodeSaveMapV1 = decodeSaveMap0x2b;
