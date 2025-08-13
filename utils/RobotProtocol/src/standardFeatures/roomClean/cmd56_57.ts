import type { Cistern, DataArray, Suction, yMop } from '@/typings';
import { ROOM_CLEAN_CMD_APP_V2, ROOM_CLEAN_CMD_ROBOT_V2 } from '@/constant/cmd';
import { parseRoomHexId, parseRoomId } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

type Room = {
  roomHexId?: string;
  roomId?: number;
  cleanTimes: number;
  yMop: yMop | 'ff';
  suction: Suction | 'ff';
  cistern: Cistern | 'ff';
};

/**
 * *选区清扫0x56/0x57
 *
 * 向设备请求选区清扫数据(0x57) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const requestRoomClean0x57 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(ROOM_CLEAN_CMD_ROBOT_V2, '', version);
};

/**
 * @deprecated 请使用 requestRoomClean0x57
 */
export const requestRoomCleanV2 = requestRoomClean0x57;

/**
 * *选区清扫0x56/0x57
 *
 * 设置选区清扫的指令(0x56) | App ➜ Robot
 * @param params 参数 - 支持传入roomHexIds或roomIds
 * @returns 指令
 */
export const encodeRoomClean0x56 = (params: {
  rooms: Room[];
  mapVersion?: 0 | 1 | 2;
  version?: '0' | '1';
}): string => {
  const { rooms, mapVersion = 2, version = '1' } = params;

  const dataArray: DataArray = [];

  dataArray.push(rooms.length);

  rooms.forEach(({ roomHexId, roomId, cleanTimes, yMop, suction, cistern }) => {
    if (roomId !== undefined) {
      dataArray.push(roomId);
    } else if (roomHexId) {
      dataArray.push(parseRoomId(roomHexId, mapVersion));
    }

    dataArray.push(suction, cistern, yMop, cleanTimes);
  });

  return encodeStandardFeatureCommand(
    ROOM_CLEAN_CMD_APP_V2,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeRoomClean0x56
 */
export const encodeRoomCleanV2 = encodeRoomClean0x56;

/**
 * *选区清扫0x56/0x57
 *
 * 从指令中解析获取选区清扫信息(0x57) | Robot ➜ App
 * @param params 参数
 * @returns 选区清扫信息
 */
export const decodeRoomClean0x57 = (params: {
  command: string;
  mapVersion?: 0 | 1 | 2;
  version?: '0' | '1';
}): Room[] | null => {
  const { command, mapVersion = 2, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    ROOM_CLEAN_CMD_ROBOT_V2,
    version
  );

  if (!valid) {
    return null;
  }

  const rooms: Room[] = [];

  const roomsRaw = dataStr.slice(2).match(/.{10}/g);

  roomsRaw.forEach(roomRaw => {
    const roomId = parseInt(roomRaw.slice(0, 2), 16);
    const roomHexId = parseRoomHexId(roomId, mapVersion);

    const suction = parseInt(roomRaw.slice(2, 4), 16);
    const cistern = parseInt(roomRaw.slice(4, 6), 16);
    const yMop = parseInt(roomRaw.slice(6, 8), 16);
    const cleanTimes = parseInt(roomRaw.slice(8, 10), 16);

    rooms.push({
      roomHexId,
      roomId,
      suction,
      cistern,
      yMop,
      cleanTimes,
    });
  });

  return rooms;
};

/**
 * @deprecated 请使用 decodeRoomClean0x57
 */
export const decodeRoomCleanV2 = decodeRoomClean0x57;
