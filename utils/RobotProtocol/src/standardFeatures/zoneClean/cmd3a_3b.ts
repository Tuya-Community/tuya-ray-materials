import type { Cistern, CleanMode, DataArray, Point, Suction, Zone } from '@/typings';
import { ZONE_CLEAN_CMD_APP_V2, ZONE_CLEAN_CMD_ROBOT_V2 } from '@/constant/cmd';
import {
  bytes2Str,
  bytesToHexString,
  getHexXYFromXY,
  hexPlusLen,
  hexToUTF8,
  stringToByte,
  transformXY,
} from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *划区清扫0x3a/0x3b
 *
 * 向设备请求划区清扫数据(0x3b) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestZoneClean0x3b = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(ZONE_CLEAN_CMD_ROBOT_V2, '', version);
};

/**
 * @deprecated 请使用 requestZoneClean0x3b
 */
export const requestZoneCleanV2 = requestZoneClean0x3b;

/**
 * *划区清扫0x3a/0x3b (注意根据Protocol version不同，协议内容有区别)
 *
 * 划区清扫的指令(0x3a) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeZoneClean0x3a = (params: {
  protocolVersion: 1 | 2 | 3;
  zones: Zone[];
  origin: Point;
  cleanMode?: CleanMode;
  suction?: Suction;
  cistern?: Cistern;
  cleanTimes?: number;
  mapScale?: number;
  version?: '0' | '1';
}): string => {
  const {
    protocolVersion,
    zones,
    origin,
    cleanMode = 0,
    suction = 0,
    cistern = 0,
    cleanTimes = 1,
    mapScale = 1,
    version = '1',
  } = params;

  if (![1, 2, 3].includes(protocolVersion)) {
    console.error(
      `<ray-robot-protocol>: 划区清扫0x3a/0x3b Protocol version不支持${protocolVersion}`
    );
    return '';
  }

  const dataArray: DataArray = [];

  // (V1.2.0) Protocol version | count | N | Polygon | x0 | y0 | x1 | y1 | name len | name | … |
  // (V1.2.1) Protocol version | mode | suction | cistern | count | N | Polygon | x0 | y0 | x1 | y1 | name len | name | … |
  // (V1.2.2) Protocol version | N | ID | Type | Polygon | X | Y | count | order | mode | suction | cistern | reserved | name len | name | ... |
  dataArray.push(protocolVersion);

  if (protocolVersion === 3) {
    dataArray.push(zones.length);

    zones.forEach(({ points, name = '', advanced }) => {
      const { id, localSave, order, cleanMode, cleanTimes, suction, cistern } = advanced ?? {};

      dataArray.push(id, localSave, points?.length === 4 ? 0 : 1, points.length);

      points.forEach(point => {
        const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);
        dataArray.push(hexX, hexY);
      });

      // 注意这里有预留5个字节reserved
      dataArray.push(
        cleanTimes,
        order,
        cleanMode,
        suction,
        cistern,
        {
          value: 0,
          byte: 5,
        },
        name.length,
        hexPlusLen(bytes2Str(stringToByte(name)), 19)
      );
    });
  } else {
    if (protocolVersion === 2) {
      dataArray.push(cleanMode, suction, cistern);
    }

    dataArray.push(cleanTimes, zones.length);

    zones.forEach(({ points, name = '' }) => {
      dataArray.push(points.length);

      points.forEach(point => {
        const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);
        dataArray.push(hexX, hexY);
      });

      dataArray.push(name.length, hexPlusLen(bytes2Str(stringToByte(name)), 19));
    });
  }

  return encodeStandardFeatureCommand(
    ZONE_CLEAN_CMD_APP_V2,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeZoneClean0x3a
 */
export const encodeZoneCleanV2 = encodeZoneClean0x3a;

/**
 * *划区清扫0x3a/0x3b (注意根据Protocol version不同，协议内容有区别)
 *
 * 从指令中解析获取划区清扫数据(0x3b) | Robot ➜ App
 * @param params 参数
 * @returns 划区清扫数据
 */
export const decodeZoneClean0x3b = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): {
  protocolVersion: 1 | 2 | 3;
  zones: Zone[];
  cleanMode?: CleanMode;
  suction?: Suction;
  cistern?: Cistern;
  cleanTimes?: number;
} | null => {
  const { command, mapScale = 1, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    ZONE_CLEAN_CMD_ROBOT_V2,
    version
  );

  if (!valid) {
    return null;
  }

  const result = {} as {
    protocolVersion: 1 | 2 | 3;
    zones: Zone[];
    cleanMode?: CleanMode;
    suction?: Suction;
    cistern?: Cistern;
    cleanTimes?: number;
  };

  const protocolVersion = parseInt(dataStr.slice(0, 2), 16) as 1 | 2 | 3;
  result.protocolVersion = protocolVersion;

  const zones: Zone[] = [];

  if (protocolVersion === 3) {
    // 跳过N

    const zonesRaw = dataStr.slice(4, -2);

    let i = 0;

    while (i < zonesRaw.length - 1) {
      const id = parseInt(zonesRaw.slice(i, i + 2), 16);
      i += 2;

      const localSave = parseInt(zonesRaw.slice(i, i + 2), 16);
      i += 2;

      // 跳过Type
      i += 2;

      const polygon = parseInt(zonesRaw.slice(i, i + 2), 16);
      i += 2;

      const pointsRaw = zonesRaw.slice(i, i + 8 * polygon).match(/.{8}/g);
      const points = [];
      pointsRaw.forEach(pointRaw => {
        const x = transformXY(mapScale, parseInt(pointRaw.slice(0, 4), 16));
        const y = -transformXY(mapScale, parseInt(pointRaw.slice(4), 16));

        points.push({ x, y });
      });
      i += 8 * polygon;

      const cleanTimes = parseInt(zonesRaw.slice(i, i + 2), 16);
      i += 2;

      const order = parseInt(zonesRaw.slice(i, i + 2), 16);
      i += 2;

      const cleanMode = parseInt(zonesRaw.slice(i, i + 2), 16);
      i += 2;

      const suction = parseInt(zonesRaw.slice(i, i + 2), 16);
      i += 2;

      const cistern = parseInt(zonesRaw.slice(i, i + 2), 16);
      i += 2;

      // 跳过reserved
      i += 10;

      // 跳过nameLength
      i += 2;

      const name =
        hexToUTF8(
          bytesToHexString(
            zonesRaw
              .slice(i, i + 38)
              .match(/.{2}/g)
              .map(item => parseInt(item, 16))
          )
        ) || '';
      i += 38;

      zones.push({
        points,
        name,
        advanced: {
          id,
          order,
          localSave,
          cleanMode,
          cleanTimes,
          cistern,
          suction,
        },
      });
    }
  } else {
    let i = 2;

    if (protocolVersion === 2) {
      result.cleanMode = parseInt(dataStr.slice(i, i + 2), 16);
      i += 2;

      result.suction = parseInt(dataStr.slice(i, i + 2), 16);
      i += 2;

      result.cistern = parseInt(dataStr.slice(i, i + 2), 16);
      i += 2;
    }

    result.cleanTimes = parseInt(dataStr.slice(i, i + 2), 16);
    i += 2;

    // 跳过N
    i += 2;

    const zonesRaw = dataStr.slice(i, -2);
    i = 0;

    while (i < zonesRaw.length - 1) {
      const polygon = parseInt(zonesRaw.slice(i, i + 2), 16);
      i += 2;

      const pointsRaw = zonesRaw.slice(i, i + 8 * polygon).match(/.{8}/g);
      const points = [];
      pointsRaw.forEach(pointRaw => {
        const x = transformXY(mapScale, parseInt(pointRaw.slice(0, 4), 16));
        const y = -transformXY(mapScale, parseInt(pointRaw.slice(4), 16));

        points.push({ x, y });
      });
      i += 8 * polygon;

      // 跳过nameLength
      i += 2;

      const name =
        hexToUTF8(
          bytesToHexString(
            zonesRaw
              .slice(i, i + 38)
              .match(/.{2}/g)
              .map(item => parseInt(item, 16))
          )
        ) || '';
      i += 38;

      zones.push({
        points,
        name,
      });
    }
  }

  result.zones = zones;

  return result;
};

/**
 * @deprecated 请使用 decodeZoneClean0x3b
 */
export const decodeZoneCleanV2 = decodeZoneClean0x3b;
