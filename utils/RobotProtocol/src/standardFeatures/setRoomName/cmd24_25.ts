import type { DataArray } from '@/typings';
import { SET_ROOM_NAME_CMD_APP_V1, SET_ROOM_NAME_CMD_ROBOT_V1 } from '@/constant/cmd';
import {
  bytes2Str,
  bytesToHexString,
  hexPlusLen,
  hexToUriDecodedString,
  parseRoomHexId,
  parseRoomId,
  stringToByte,
} from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

type Room = {
  name: string;
  roomHexId?: string;
  roomId?: number;
};

/**
 * *设置房间名称0x24/0x25
 *
 * 向设备下发的设置房间名称指令(0x24) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeSetRoomName0x24 = (params: {
  rooms: Room[];
  mapVersion?: 0 | 1 | 2;
  version?: '0' | '1';
}): string => {
  const { rooms, mapVersion = 2, version = '1' } = params;

  const dataArray: DataArray = [];

  dataArray.push(rooms.length);

  rooms.forEach(({ roomHexId, roomId, name = '' }) => {
    if (roomId) {
      dataArray.push(roomId);
    } else if (roomHexId) {
      dataArray.push(parseRoomId(roomHexId, mapVersion));
    }

    const nameBytes = stringToByte(name);

    dataArray.push(nameBytes.length, hexPlusLen(bytes2Str(nameBytes), 19));
  });

  return encodeStandardFeatureCommand(
    SET_ROOM_NAME_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeSetRoomName0x24
 */
export const encodeSetRoomNameV1 = encodeSetRoomName0x24;
/**
 * *设置房间名称0x24/0x25
 *
 * 解析设备响应的设置房间名称结果(0x25) | Robot ➜ App
 * @param params 参数
 * @returns 设置房间名称结果
 */
export const decodeSetRoomName0x25 = (params: {
  command: string;
  mapVersion?: 0 | 1 | 2;
  version?: '0' | '1';
}): Room[] | null => {
  const { command, mapVersion = 2, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    SET_ROOM_NAME_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const rooms: Room[] = [];

  const roomsRaw = dataStr.slice(2).match(/.{42}/g);

  roomsRaw.forEach(roomRaw => {
    const roomId = parseInt(roomRaw.slice(0, 2), 16);
    const roomHexId = parseRoomHexId(roomId, mapVersion);

    const name =
      hexToUriDecodedString(
        bytesToHexString(
          roomRaw
            .slice(4)
            .match(/.{2}/g)
            .map(item => parseInt(item, 16))
        )
      ) || '';

    rooms.push({
      roomHexId,
      roomId,
      name,
    });
  });

  return rooms;
};

/**
 * @deprecated 请使用 decodeSetRoomName0x25
 */
export const decodeSetRoomNameV1 = decodeSetRoomName0x25;
