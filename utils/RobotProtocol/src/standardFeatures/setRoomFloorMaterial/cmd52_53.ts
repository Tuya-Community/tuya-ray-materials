import { SET_FLOOR_MATERIAL_CMD_APP_V1, SET_FLOOR_MATERIAL_CMD_ROBOT_V1 } from '@/constant/cmd';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

type SetRoomFloorMaterial = {
  roomId: number;
  material: number;
};

/**
 * 向设备下发设置房间分区地板材质的数据(0x52) | App ➜ Robot
 * @param params
 * @returns
 */
export const encodeSetRoomFloorMaterial0x52 = (params: {
  rooms: SetRoomFloorMaterial[];
  version?: '0' | '1';
}) => {
  const { rooms, version = '1' } = params;

  const dataArray = [1, rooms.length];

  rooms.forEach((room: SetRoomFloorMaterial) => {
    dataArray.push(room.roomId, room.material);
  });

  return encodeStandardFeatureCommand(
    SET_FLOOR_MATERIAL_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * 解析设备响应的设置房间分区地板材质的结果(0x53) | Robot ➜ App
 * @param params
 * @returns
 */
export const decodeSetRoomFloorMaterial0x53 = (params: {
  command: string;
  version?: '0' | '1';
}): SetRoomFloorMaterial[] => {
  const { command, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    SET_FLOOR_MATERIAL_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const dataList = [];

  // 数据长度
  const number = parseInt(dataStr.slice(2, 4), 16);

  for (let i = 0; i < number; i++) {
    const sRoom = dataStr.slice(4 + i * 4, 8 + i * 4);
    const roomId = parseInt(sRoom.slice(0, 2), 16);
    const material = parseInt(sRoom.slice(2, 4), 16);

    dataList.push({
      roomId,
      material,
    });
  }

  return dataList;
};
