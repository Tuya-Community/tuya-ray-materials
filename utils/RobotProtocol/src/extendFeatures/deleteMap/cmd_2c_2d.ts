import type { DataArray } from '@/typings';
import { DELETE_MAP_CMD_APP_V1, DELETE_MAP_CMD_ROBOT_V1 } from '@/constant/cmd';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeExtendFeatureCommand,
} from '@/utils/command';

/**
 * *删除地图0x2c/0x2d
 *
 * 删除地图指令(0x2c) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeDeleteMap0x2c = (params: { id: number }): string => {
  const { id } = params;

  const dataArray: DataArray = [];

  dataArray.push({
    value: id,
    byte: 4,
  });

  return encodeExtendFeatureCommand(DELETE_MAP_CMD_APP_V1, convertDataArrayToDataStr(dataArray));
};

/**
 * @deprecated 请使用 encodeDeleteMap0x2c
 */
export const encodeDeleteMapV1 = encodeDeleteMap0x2c;

/**
 * *删除地图0x2c/0x2d
 *
 * 删除地图结果(0x2d) | Robot ➜ App
 * @param params 参数
 * @returns 删除地图结果
 */
export const decodeDeleteMap0x2d = (params: {
  command: string;
}): {
  ret: number;
  success: boolean;
} | null => {
  const { command } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(command, DELETE_MAP_CMD_ROBOT_V1);

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
 * @deprecated 请使用 decodeDeleteMap0x2d
 */
export const decodeDeleteMapV1 = decodeDeleteMap0x2d;
