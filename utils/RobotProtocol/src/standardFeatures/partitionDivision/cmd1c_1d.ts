import type { DataArray, Point } from '@/typings';
import { PARTITION_DIVISION_CMD_APP_V1, PARTITION_DIVISION_CMD_ROBOT_V1 } from '@/constant/cmd';
import { getHexXYFromXY } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *分区分割0x1c/0x1d
 *
 * 向设备下发的分区分割指令(0x1c) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodePartitionDivision0x1c = (params: {
  roomId: number;
  points: Point[];
  origin: Point;
  mapScale?: number;
  version?: '0' | '1';
}): string => {
  const { roomId, points, origin, mapScale = 1, version = '1' } = params;

  const dataArray: DataArray = [];

  dataArray.push(roomId);

  points.forEach(point => {
    const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);

    dataArray.push(hexX, hexY);
  });

  return encodeStandardFeatureCommand(
    PARTITION_DIVISION_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodePartitionDivision0x1c
 */
export const encodePartitionDivisionV1 = encodePartitionDivision0x1c;

/**
 * *分区分割0x1c/0x1d
 *
 * 解析设备响应的分区分割结果(0x1d) | Robot ➜ App
 * @param params 参数
 * @returns 分区分割结果
 */
export const decodePartitionDivision0x1d = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): {
  ret: number;
  success: boolean;
} | null => {
  const { command, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    PARTITION_DIVISION_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  // 协议看起来有 实际设备没有报roomId和坐标的
  // const roomId = parseInt(dataStr.slice(0, 2), 16);

  // const points = [];
  // const pointsRaw = dataStr.slice(2).match(/.{8}/g);

  // pointsRaw.forEach(pointRaw => {
  //   const x = transformXY(mapScale, parseInt(pointRaw.slice(0, 4), 16));
  //   const y = -transformXY(mapScale, parseInt(pointRaw.slice(4), 16));

  //   points.push({ x, y });
  // });

  const ret = parseInt(dataStr.slice(0, 2), 16);

  return { ret, success: ret === 1 };
};

/**
 * @deprecated 请使用 decodePartitionDivision0x1d
 */
export const decodePartitionDivisionV1 = decodePartitionDivision0x1d;
