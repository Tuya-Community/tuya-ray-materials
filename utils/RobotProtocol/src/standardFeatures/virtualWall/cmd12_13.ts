import type { DataArray, Point } from '@/typings';
import { VIRTUAL_WALL_CMD_APP_V1, VIRTUAL_WALL_CMD_ROBOT_V1 } from '@/constant/cmd';
import { getHexXYFromXY, transformXY } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *虚拟墙设置0x12/0x13
 *
 * 向设备请求虚拟墙数据(0x13) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestVirtualWall0x13 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(VIRTUAL_WALL_CMD_ROBOT_V1, '', version);
};

/**
 * @deprecated 请使用 requestVirtualWall0x13
 */
export const requestVirtualWallV1 = requestVirtualWall0x13;

/**
 * *虚拟墙设置0x12/0x13
 *
 * 设置虚拟墙的指令(0x12) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeVirtualWall0x12 = (params: {
  walls: Point[][];
  origin: Point;
  mapScale?: number;
  version?: '0' | '1';
}): string => {
  const { walls, origin, mapScale = 1, version = '1' } = params;
  const dataArray: DataArray = [];

  // 虚拟墙个数
  dataArray.push(walls.length);

  // 虚拟墙端点坐标
  walls.forEach(points => {
    points.forEach(point => {
      const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);
      dataArray.push(hexX, hexY);
    });
  });

  return encodeStandardFeatureCommand(
    VIRTUAL_WALL_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeVirtualWall0x12
 */
export const encodeVirtualWallV1 = encodeVirtualWall0x12;
/**
 * *虚拟墙设置0x12/0x13
 *
 * 从指令中解析获取虚拟墙数据(0x13) | Robot ➜ App
 * @param params 参数
 * @returns 虚拟墙数据
 */
export const decodeVirtualWall0x13 = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): Point[][] | null => {
  const { command, mapScale = 1, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    VIRTUAL_WALL_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const wallsRaw = dataStr.slice(2).match(/.{16}/g);

  const walls =
    wallsRaw?.map(wallRaw => {
      const pointsRaw = wallRaw.match(/.{8}/g);
      return pointsRaw.map(pointRaw => {
        const x = transformXY(mapScale, parseInt(pointRaw.slice(0, 4), 16));
        const y = -transformXY(mapScale, parseInt(pointRaw.slice(4), 16));
        return { x, y };
      });
    }) ?? [];

  return walls;
};

/**
 * @deprecated 请使用 decodeVirtualWall0x13
 */
export const decodeVirtualWallV1 = decodeVirtualWall0x13;
