import type { Cistern, CleanMode, DataArray, Point, Suction } from '@/typings';
import { SPOT_CLEAN_CMD_APP_V2, SPOT_CLEAN_CMD_ROBOT_V2 } from '@/constant/cmd';
import { getHexXYFromXY, transformXY } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *定点清扫0x3e/0x3f
 *
 * 向设备请求定点清扫数据(0x3f) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestSpotClean0x3f = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(SPOT_CLEAN_CMD_ROBOT_V2, '', version);
};

/**
 * @deprecated 请使用 requestSpotClean0x3f
 */
export const requestSpotCleanV2 = requestSpotClean0x3f;
/**
 * * *定点清扫0x3e/0x3f (注意根据Protocol version不同，协议内容有区别)
 *
 * 设置定点清扫的指令(0x3e) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeSpotClean0x3e = (params: {
  protocolVersion: 1 | 2;
  points: Point[];
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
    points,
    origin,
    cleanMode,
    suction,
    cistern,
    cleanTimes,
    mapScale = 1,
    version = '1',
  } = params;

  if (![1, 2].includes(protocolVersion)) {
    console.error(
      `<ray-robot-protocol>: 定点清扫0x3e/0x3f Protocol version不支持${protocolVersion}`
    );
    return '';
  }

  if (points.length < 1) {
    console.error('<ray-robot-protocol>: 定点清扫0x3e/0x3f 传入的定点信息有误');
    return '';
  }

  const dataArray: DataArray = [];

  if (protocolVersion === 1) {
    // (V1.1.0-0x01) Protocol version | mode | suction | cistern | count | X | Y |
    dataArray.push(1, cleanMode, suction, cistern, cleanTimes);

    const point = points[0];
    const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);
    dataArray.push(hexX, hexY);
  }

  if (protocolVersion === 2) {
    // (V1.1.0-0x02) Protocol version | N | X | Y | ... |
    dataArray.push(2, points.length);

    points.forEach(point => {
      const { hexX, hexY } = getHexXYFromXY(point, origin, mapScale);
      dataArray.push(hexX, hexY);
    });
  }

  return encodeStandardFeatureCommand(
    SPOT_CLEAN_CMD_APP_V2,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeSpotClean0x3e
 */
export const encodeSpotCleanV2 = encodeSpotClean0x3e;
/**
 * *定点清扫0x3e/0x3f (注意根据Protocol version不同，协议内容有区别)
 *
 * 从指令中解析获取定点清扫数据(0x3f) | Robot ➜ App
 * @param params 参数
 * @returns 定点清扫信息
 */
export const decodeSpotClean0x3f = (params: {
  command: string;
  mapScale?: number;
  version?: '0' | '1';
}): {
  protocolVersion: 1 | 2;
  points: Point[];
  cleanMode?: CleanMode;
  suction?: Suction;
  cistern?: Cistern;
  cleanTimes?: number;
} | null => {
  const { command, mapScale = 1, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    SPOT_CLEAN_CMD_ROBOT_V2,
    version
  );

  const protocolVersion = parseInt(dataStr.slice(0, 2), 16) as 1 | 2;

  if (!valid) {
    return null;
  }

  if (protocolVersion === 1) {
    // (V1.1.0-0x01) Protocol version | mode | suction | cistern | count | X | Y |

    const cleanMode = parseInt(dataStr.slice(2, 4), 16) as CleanMode;
    const suction = parseInt(dataStr.slice(4, 6), 16) as Suction;
    const cistern = parseInt(dataStr.slice(6, 8), 16) as Cistern;
    const cleanTimes = parseInt(dataStr.slice(8, 10), 16);

    const x = transformXY(mapScale, parseInt(dataStr.slice(10, 14), 16));
    const y = -transformXY(mapScale, parseInt(dataStr.slice(14, 18), 16));

    const points = [{ x, y }];

    return { protocolVersion, points, cleanMode, suction, cistern, cleanTimes };
  }

  if (protocolVersion === 2) {
    // (V1.1.0-0x02) Protocol version | N | X | Y | ... |

    const points = [];
    const pointsRaw = dataStr.slice(4).match(/.{8}/g);

    pointsRaw.forEach(pointRaw => {
      const x = transformXY(mapScale, parseInt(pointRaw.slice(0, 4), 16));
      const y = -transformXY(mapScale, parseInt(pointRaw.slice(4), 16));

      points.push({ x, y });
    });

    return { protocolVersion, points };
  }

  return null;
};

/**
 * @deprecated 请使用 decodeSpotClean0x3f
 */
export const decodeSpotCleanV2 = decodeSpotClean0x3f;
