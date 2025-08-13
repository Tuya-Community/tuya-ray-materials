// TODO

import { VIRTUAL_WALL_CMD_APP_V2, VIRTUAL_WALL_CMD_ROBOT_V2 } from '@/constant/cmd';
import { DataArray, Point, VirtualWall } from '@/typings';
import { getHexXYFromXY, transformXY } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *虚拟墙设置0x48/0x49
 *
 * 向设备请求虚拟墙数据(0x49) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestVirtualWall0x49 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(VIRTUAL_WALL_CMD_ROBOT_V2, '', version);
};

/**
 * *虚拟墙设置0x48/0x49
 *
 * 设置虚拟墙的指令(0x48) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeVirtualWall0x48 = (params: {
  protocolVersion?: number;
  walls: VirtualWall[];
  origin: Point;
  mapScale?: number;
  version?: '0' | '1';
}): string => {
  const { protocolVersion = 1, walls, origin, mapScale = 1, version = '1' } = params;

  const dataArray: DataArray = [];

  if (![1].includes(protocolVersion)) {
    console.error(
      `<ray-robot-protocol>: 虚拟墙设置0x48/0x49 Protocol version不支持${protocolVersion}`
    );
    return '';
  }

  dataArray.push(protocolVersion);

  // 虚拟墙个数
  dataArray.push(walls.length);

  // 虚拟墙端点坐标
  walls.forEach(({ mode, points }) => {
    dataArray.push(mode);

    points.forEach(point => {
      const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);
      dataArray.push(hexX, hexY);
    });
  });

  return encodeStandardFeatureCommand(
    VIRTUAL_WALL_CMD_APP_V2,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * *虚拟墙设置0x48/0x49
 *
 * 从指令中解析获取虚拟墙数据(0x49) | Robot ➜ App
 * @param params 参数
 * @returns 虚拟墙数据
 */
export const decodeVirtualWall0x49 = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): {
  protocolVersion: number;
  walls: VirtualWall[];
} | null => {
  const { command, mapScale = 1, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    VIRTUAL_WALL_CMD_ROBOT_V2,
    version
  );

  if (!valid) {
    return null;
  }

  const protocolVersion = parseInt(dataStr.slice(0, 2), 16) as 1 | 2;

  const wallsRaw = dataStr.slice(4).match(/.{18}/g);

  const walls =
    wallsRaw?.map(wallRaw => {
      const mode = parseInt(wallRaw.slice(0, 2), 16);
      const pointsRaw = wallRaw.slice(2).match(/.{8}/g);
      return {
        mode,
        points: pointsRaw.map(pointRaw => {
          const x = transformXY(mapScale, parseInt(pointRaw.slice(0, 4), 16));
          const y = -transformXY(mapScale, parseInt(pointRaw.slice(4), 16));
          return { x, y };
        }),
      };
    }) ?? [];

  return { protocolVersion, walls };
};
