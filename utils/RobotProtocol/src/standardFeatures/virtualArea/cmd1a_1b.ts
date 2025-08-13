import type { DataArray, Point, VirtualArea } from '@/typings';
import { VIRTUAL_AREA_CMD_APP_V1, VIRTUAL_AREA_CMD_ROBOT_V1 } from '@/constant/cmd';
import { getHexXYFromXY, transformXY } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *禁区设置0x1a/0x1b
 *
 * 向设备请求禁区数据(0x1b) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestVirtualArea0x1b = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(VIRTUAL_AREA_CMD_ROBOT_V1, '', version);
};

/**
 * * *禁区设置0x1a/0x1b
 *
 * 设置禁区的指令(0x1a) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeVirtualArea0x1a = (params: {
  virtualAreas: VirtualArea[];
  origin: Point;
  mapScale?: number;
  version?: '0' | '1';
}): string => {
  const { virtualAreas, origin, mapScale = 1, version = '1' } = params;

  const dataArray: DataArray = [];

  dataArray.push(virtualAreas.length);

  virtualAreas.forEach(({ points, mode }) => {
    dataArray.push(mode);
    dataArray.push(points.length);

    points.forEach(point => {
      const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);

      dataArray.push(hexX, hexY);
    });
  });

  return encodeStandardFeatureCommand(
    VIRTUAL_AREA_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * *禁区设置0x1a/0x1b
 *
 * 从指令中解析获取禁区数据(0x1b) | Robot ➜ App
 * @param params 参数
 * @returns 禁区数据
 */
export const decodeVirtualArea0x1b = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): VirtualArea[] | null => {
  const { command, mapScale = 1, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    VIRTUAL_AREA_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const virtualAreas = [];

  const virtualAreasRaw = dataStr.slice(2);

  let i = 0;

  while (i < virtualAreasRaw.length - 1) {
    const mode = parseInt(virtualAreasRaw.slice(i, i + 2), 16);
    i += 2;

    const polygon = parseInt(virtualAreasRaw.slice(i, i + 2), 16);
    i += 2;

    const pointsRaw = virtualAreasRaw.slice(i, i + 8 * polygon).match(/.{8}/g);
    const points = [];
    pointsRaw.forEach(pointRaw => {
      const x = transformXY(mapScale, parseInt(pointRaw.slice(0, 4), 16));
      const y = -transformXY(mapScale, parseInt(pointRaw.slice(4), 16));

      points.push({ x, y });
    });
    i += 8 * polygon;

    virtualAreas.push({
      mode,
      points,
    });
  }

  return virtualAreas;
};
