import { SET_ROOM_PROPERTY_CMD_APP_V2, SET_ROOM_PROPERTY_CMD_ROBOT_V2 } from '@/constant/cmd';
import type { DataArray, RoomProperty } from '@/typings';
import { parseRoomHexId, parseRoomId } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *设置房间属性0x58/0x59
 *
 * 向设备下发的设置房间属性指令(0x58) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeSetRoomProperty0x58 = (params: {
  rooms: RoomProperty[];
  mapVersion?: 0 | 1 | 2;
  version?: '0' | '1';
}): string => {
  const { rooms, mapVersion = 2, version = '1' } = params;

  const dataArray: DataArray = [];

  dataArray.push(rooms.length);

  rooms.forEach(({ cleanMode, roomHexId, roomId, cleanTimes, yMop, suction, cistern }) => {
    if (roomId !== undefined) {
      dataArray.push(roomId);
    } else if (roomHexId) {
      dataArray.push(parseRoomId(roomHexId, mapVersion));
    }

    dataArray.push(cleanMode, suction, cistern, yMop, cleanTimes);
  });

  return encodeStandardFeatureCommand(
    SET_ROOM_PROPERTY_CMD_APP_V2,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * *设置房间属性0x59/0x59
 *
 * 解析设备响应的设置房间属性结果(0x59) | Robot ➜ App
 * @param params 参数
 * @returns 设置房间属性结果
 */
export const decodeSetRoomProperty0x59 = (params: {
  command: string;
  mapVersion?: 0 | 1 | 2;
  version?: '0' | '1';
}): RoomProperty[] | null => {
  const { command, mapVersion = 2, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    SET_ROOM_PROPERTY_CMD_ROBOT_V2,
    version
  );

  if (!valid) {
    return null;
  }

  const rooms: RoomProperty[] = [];

  const roomsRaw = dataStr.slice(2).match(/.{12}/g);

  roomsRaw.forEach(roomRaw => {
    const roomId = parseInt(roomRaw.slice(0, 2), 16);
    const roomHexId = parseRoomHexId(roomId, mapVersion);

    const cleanMode = parseInt(roomRaw.slice(2, 4), 16);
    const suction = parseInt(roomRaw.slice(4, 6), 16);
    const cistern = parseInt(roomRaw.slice(6, 8), 16);
    const yMop = parseInt(roomRaw.slice(8, 10), 16);
    const cleanTimes = parseInt(roomRaw.slice(10, 12), 16);

    rooms.push({
      roomHexId,
      roomId,
      cleanMode,
      suction,
      cistern,
      yMop,
      cleanTimes,
    });
  });

  return rooms;
};
