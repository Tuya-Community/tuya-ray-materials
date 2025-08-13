import type { DataArray, Point, VirtualArea } from '@/typings';
import { VIRTUAL_AREA_CMD_APP_V2, VIRTUAL_AREA_CMD_ROBOT_V2 } from '@/constant/cmd';
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
 * *禁区设置0x38/0x39
 *
 * 向设备请求禁区数据(0x39) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestVirtualArea0x39 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(VIRTUAL_AREA_CMD_ROBOT_V2, '', version);
};

/**
 * @deprecated 请使用 requestVirtualArea0x39
 */
export const requestVirtualAreaV2 = requestVirtualArea0x39;

/**
 * * *禁区设置0x38/0x39 (注意根据Protocol version不同，协议内容有区别)
 *
 * 设置禁区的指令(0x38) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeVirtualArea0x38 = (params: {
  protocolVersion: 1 | 2;
  virtualAreas: VirtualArea[];
  origin: Point;
  mapScale?: number;
  version?: '0' | '1';
}): string => {
  const { protocolVersion, virtualAreas, origin, mapScale = 1, version = '1' } = params;

  if (![1, 2].includes(protocolVersion)) {
    console.error(
      `<ray-robot-protocol>: 禁区设置0x38/0x39 Protocol version不支持${protocolVersion}`
    );
    return '';
  }

  const dataArray: DataArray = [];

  // (V1.2.0-0x01) Protocol version | N | mode | Polygon | x0 | y0 | x1 | y1 | name len | name | … |
  // (V1.2.0-0x02) Protocol version | N | mode | type | Polygon | x0 | y0 | x1 | y1 | name len | name | … |
  dataArray.push(protocolVersion, virtualAreas.length);

  virtualAreas.forEach(({ points, mode, name = '' }) => {
    dataArray.push(mode);

    if (protocolVersion === 2) {
      dataArray.push(points.length === 4 ? 0 : 1);
    }

    dataArray.push(points.length);

    points.forEach(point => {
      const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);

      dataArray.push(hexX, hexY);
    });

    dataArray.push(name.length, hexPlusLen(bytes2Str(stringToByte(name)), 19));
  });

  return encodeStandardFeatureCommand(
    VIRTUAL_AREA_CMD_APP_V2,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeVirtualArea0x38
 */
export const encodeVirtualAreaV2 = encodeVirtualArea0x38;

/**
 * *禁区设置0x38/0x39 (注意根据Protocol version不同，协议内容有区别)
 *
 * 从指令中解析获取禁区数据(0x39) | Robot ➜ App
 * @param params 参数
 * @returns 禁区数据
 */
export const decodeVirtualArea0x39 = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): {
  protocolVersion: 1 | 2;
  virtualAreas: VirtualArea[];
} | null => {
  const { command, mapScale = 1, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    VIRTUAL_AREA_CMD_ROBOT_V2,
    version
  );

  if (!valid) {
    return null;
  }

  const protocolVersion = parseInt(dataStr.slice(0, 2), 16) as 1 | 2;

  const virtualAreas = [];

  const virtualAreasRaw = dataStr.slice(4);

  let i = 0;

  while (i < virtualAreasRaw.length - 1) {
    const mode = parseInt(virtualAreasRaw.slice(i, i + 2), 16);
    i += 2;

    if (protocolVersion === 2) {
      // 跳过多边形类型
      i += 2;
    }

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

    // 跳过nameLength
    i += 2;

    const name =
      hexToUTF8(
        bytesToHexString(
          virtualAreasRaw
            .slice(i, i + 38)
            .match(/.{2}/g)
            .map(item => parseInt(item, 16))
        )
      ) || '';
    i += 38;

    virtualAreas.push({
      mode,
      points,
      name,
    });
  }

  return { protocolVersion, virtualAreas };
};

/**
 * @deprecated 请使用 decodeVirtualArea0x39
 */
export const decodeVirtualAreaV2 = decodeVirtualArea0x39;
