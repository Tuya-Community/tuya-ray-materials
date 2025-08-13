import type { DataArray } from '@/typings';
import { USE_MAP_CMD_APP_V1, USE_MAP_CMD_ROBOT_V1 } from '@/constant/cmd';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeExtendFeatureCommand,
} from '@/utils/command';
import { stringToByte } from '@/utils';

/**
 * *使用地图0x2e/0x2f
 *
 * 使用地图指令(0x2e) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeUseMap0x2e = (params: { mapId: number; url: string }): string => {
  const { mapId, url } = params;

  const dataArray: DataArray = [];

  const urlByteArr = stringToByte(url);
  const urlByteLength = urlByteArr.length;

  dataArray.push(
    {
      value: mapId,
      byte: 4,
    },
    {
      value: urlByteLength,
      byte: 4,
    },
    ...urlByteArr
  );

  return encodeExtendFeatureCommand(USE_MAP_CMD_APP_V1, convertDataArrayToDataStr(dataArray));
};

/**
 * @deprecated 请使用 encodeUseMap0x2e
 */
export const encodeUseMapV1 = encodeUseMap0x2e;

/**
 * *使用地图0x2e/0x2f
 *
 * 使用地图结果(0x2f) | Robot ➜ App
 * @param params 参数
 * @returns 使用地图结果
 */
export const decodeUseMap0x2f = (params: {
  command: string;
}): {
  ret: number;
  success: boolean;
} | null => {
  const { command } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(command, USE_MAP_CMD_ROBOT_V1);

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
 * @deprecated 请使用 decodeUseMap0x2f
 */
export const decodeUseMapV1 = decodeUseMap0x2f;
