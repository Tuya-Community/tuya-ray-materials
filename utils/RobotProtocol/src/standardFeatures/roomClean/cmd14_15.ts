import type { DataArray } from '@/typings';
import { ROOM_CLEAN_CMD_APP_V1, ROOM_CLEAN_CMD_ROBOT_V1 } from '@/constant/cmd';
import { parseRoomHexId, parseRoomId } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *选区清扫0x14/0x15
 *
 * 向设备请求选区清扫数据(0x15) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestRoomClean0x15 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(ROOM_CLEAN_CMD_ROBOT_V1, '', version);
};

/**
 * @deprecated 请使用 requestRoomClean0x15
 */
export const requestRoomCleanV1 = requestRoomClean0x15;

/**
 * *选区清扫0x14/0x15
 *
 * 设置选区清扫的指令(0x14) | App ➜ Robot
 * @param params 参数 - 支持传入roomHexIds或roomIds
 * @returns 指令
 */
export const encodeRoomClean0x14 = (params: {
  cleanTimes: number;
  roomHexIds?: string[];
  roomIds?: number[];
  mapVersion?: 0 | 1 | 2;
  version?: '0' | '1';
}): string => {
  const { roomHexIds, roomIds, cleanTimes, mapVersion = 2, version = '1' } = params;

  const dataArray: DataArray = [];

  dataArray.push(cleanTimes);

  if (roomHexIds?.length > 0) {
    const roomIds = roomHexIds.map(roomHexId => parseRoomId(roomHexId, mapVersion));
    // 房间个数
    dataArray.push(roomHexIds.length);

    // 房间信息
    roomIds.forEach(roomId => {
      dataArray.push(roomId);
    });
  } else if (roomIds?.length > 0) {
    // 房间个数
    dataArray.push(roomIds.length);

    // 房间信息
    roomIds.forEach(roomId => {
      dataArray.push(roomId);
    });
  }

  return encodeStandardFeatureCommand(
    ROOM_CLEAN_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeRoomClean0x14
 */
export const encodeRoomCleanV1 = encodeRoomClean0x14;

/**
 * *选区清扫0x14/0x15
 *
 * 从指令中解析获取选区清扫信息(0x15) | Robot ➜ App
 * @param params 参数
 * @returns 选区清扫信息
 */
export const decodeRoomClean0x15 = (params: {
  command: string;
  mapVersion?: 0 | 1 | 2;
  version?: '0' | '1';
}): {
  cleanTimes: number;
  roomIds: number[];
  roomHexIds: string[];
} | null => {
  const { command, mapVersion = 2, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    ROOM_CLEAN_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const cleanTimes = parseInt(dataStr.slice(0, 2), 16);

  const roomsRaw = dataStr.slice(4).match(/.{2}/g);

  const roomIds = [];
  const roomHexIds = [];

  roomsRaw?.forEach(roomRaw => {
    const roomId = parseInt(roomRaw, 16);
    roomIds.push(roomId);

    roomHexIds.push(parseRoomHexId(roomId, mapVersion));
  });

  return {
    roomIds,
    roomHexIds,
    cleanTimes,
  };
};

/**
 * @deprecated 请使用 decodeRoomClean0x15
 */
export const decodeRoomCleanV1 = decodeRoomClean0x15;
