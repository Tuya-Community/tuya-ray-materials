import type { DataArray, Point, Zone } from '@/typings';
import { ZONE_CLEAN_CMD_APP_V1, ZONE_CLEAN_CMD_ROBOT_V1 } from '@/constant/cmd';
import { getHexXYFromXY, transformXY } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *划区清扫0x28/0x29
 *
 * 向设备请求划区清扫数据(0x29) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestZoneClean0x29 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(ZONE_CLEAN_CMD_ROBOT_V1, '', version);
};

/**
 * *划区清扫0x28/0x29
 *
 * 划区清扫的指令(0x28) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeZoneClean0x28 = (params: {
  zones: Zone[];
  origin: Point;
  cleanTimes?: number;
  mapScale?: number;
  version?: '0' | '1';
}): string => {
  const { zones, origin, cleanTimes = 1, mapScale = 1, version = '1' } = params;

  const dataArray: DataArray = [];

  dataArray.push(cleanTimes, zones.length);

  zones.forEach(({ points }) => {
    dataArray.push(points.length);

    points.forEach(point => {
      const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);
      dataArray.push(hexX, hexY);
    });
  });

  return encodeStandardFeatureCommand(
    ZONE_CLEAN_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * *划区清扫0x28/0x29
 *
 * 从指令中解析获取划区清扫数据(0x29) | Robot ➜ App
 * @param params 参数
 * @returns 划区清扫数据
 */
export const decodeZoneClean0x29 = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): {
  zones: Zone[];
  cleanTimes?: number;
} | null => {
  const { command, mapScale = 1, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    ZONE_CLEAN_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const cleanTimes = parseInt(dataStr.slice(0, 2), 16);

  const zonesRaw = dataStr.slice(4).match(/.{34}/g);

  const zones =
    zonesRaw?.map(zoneRaw => {
      const pointsRaw = zoneRaw.slice(2).match(/.{8}/g);
      return {
        points: pointsRaw.map(pointRaw => {
          const x = transformXY(mapScale, parseInt(pointRaw.slice(0, 4), 16));
          const y = -transformXY(mapScale, parseInt(pointRaw.slice(4), 16));

          return { x, y };
        }),
      };
    }) ?? [];

  return {
    zones,
    cleanTimes,
  };
};
