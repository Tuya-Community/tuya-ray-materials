import type { DataArray, Point } from '@/typings';
import { SPOT_CLEAN_CMD_APP_V1, SPOT_CLEAN_CMD_ROBOT_V1 } from '@/constant/cmd';
import { getHexXYFromXY, transformXY } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *定点清扫0x16/0x17
 *
 * 向设备请求定点清扫数据(0x17) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestSpotClean0x17 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(SPOT_CLEAN_CMD_ROBOT_V1, '', version);
};

/**
 * @deprecated 请使用 requestSpotClean0x17
 */
export const requestSpotCleanV1 = requestSpotClean0x17;

/**
 * * *定点清扫0x16/0x17
 *
 * 设置定点清扫的指令(0x16) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeSpotClean0x16 = (params: {
  point: Point;
  origin: Point;
  mapScale?: number;
  version?: '0' | '1';
}): string => {
  const { point, origin, mapScale = 1, version = '1' } = params;

  const dataArray: DataArray = [];

  const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);
  dataArray.push(hexX, hexY);

  return encodeStandardFeatureCommand(
    SPOT_CLEAN_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeSpotClean0x16
 */
export const encodeSpotCleanV1 = encodeSpotClean0x16;

/**
 * *定点清扫0x16/0x17
 *
 * 从指令中解析获取定点清扫数据(0x17) | Robot ➜ App
 * @param params 参数
 * @returns 定点清扫信息
 */
export const decodeSpotClean0x17 = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): {
  point: Point;
} | null => {
  const { command, mapScale = 1, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    SPOT_CLEAN_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const x = transformXY(mapScale, parseInt(dataStr.slice(0, 4), 16));
  const y = -transformXY(mapScale, parseInt(dataStr.slice(4, 8), 16));

  return {
    point: { x, y },
  };
};

/**
 * @deprecated 请使用 decodeSpotClean0x17
 */
export const decodeSpotCleanV1 = decodeSpotClean0x17;
