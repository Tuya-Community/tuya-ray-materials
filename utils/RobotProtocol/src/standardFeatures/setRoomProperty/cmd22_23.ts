import type { DataArray, RoomProperty } from '@/typings';
import { SET_ROOM_PROPERTY_CMD_APP_V1, SET_ROOM_PROPERTY_CMD_ROBOT_V1 } from '@/constant/cmd';
import { parseRoomHexId, parseRoomId } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *设置房间属性0x22/0x23
 *
 * 向设备下发的设置房间属性指令(0x22) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeSetRoomProperty0x22 = (params: {
  rooms: RoomProperty[];
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
    SET_ROOM_PROPERTY_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeSetRoomProperty0x22
 */
export const encodeSetRoomPropertyV1 = encodeSetRoomProperty0x22;

/**
 * *设置房间属性0x22/0x23
 *
 * 解析设备响应的设置房间属性结果(0x23) | Robot ➜ App
 * @param params 参数
 * @returns 设置房间属性结果
 */
export const decodeSetRoomProperty0x23 = (params: {
  command: string;
  mapVersion?: 0 | 1 | 2;
  version?: '0' | '1';
}): RoomProperty[] | null => {
  const { command, mapVersion = 2, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    SET_ROOM_PROPERTY_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const rooms: RoomProperty[] = [];

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
 * @deprecated 请使用 decodeSetRoomProperty0x23
 */
export const decodeSetRoomPropertyV1 = decodeSetRoomProperty0x23;
