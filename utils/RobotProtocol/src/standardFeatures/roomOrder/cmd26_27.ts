import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';
import { ROOM_ORDER_CMD_APP_V1, ROOM_ORDER_CMD_ROBOT_V1 } from '@/constant/cmd';
import _ from 'lodash-es';
import { parseRoomId } from '@/utils';
/**
 * 向设备请求房间清扫顺序数据(0x26)
 *
 * 该函数用于生成请求房间订单的标准命令字符串。
 * 它接受一个参数对象，其中可选地包含版本号，如果没有提供版本号，默认使用V1。
 *
 * @param {Object} params - 函数的参数对象。
 * @param {('0' | '1')} params.version - 请求的命令版本号，可选值为'0'或'1'，默认为'1'。
 * @returns {string} 返回编码后的标准命令字符串。
 */
export const requestRoomOrder0x26 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(ROOM_ORDER_CMD_APP_V1, '', version);
};

/**
 * @deprecated 请使用 requestRoomOrder0x26
 */
export const requestRoomOrderV1 = requestRoomOrder0x26;

/**
 * 编码房间顺序信息。(0x26 / 0x27)
 *
 * 此函数用于将房间ID的数组编码为一个字符串，以便于传输或存储。
 * 版本号用于区分不同的编码格式。
 *
 * @param {Object} params - 函数参数对象。
 * @param params.roomIds - 房间id的数组，number类型。和roomIdHexs二选一。
 * @param params.roomIdHexs - 房间hexId的数组，每个房间ID是一个字符串。 和roomIds二选一。需要和mapVersion一起传入。
 * @param params.version='1' - 编码版本号，决定如何把roomIdHex解析为roomId。
 * @returns {string} - 编码后的字符串。
 */
export const encodeRoomOrder0x26 = (params: {
  version?: '0' | '1';
  roomIdHexs?: string[];
  roomIds?: number[];
  mapVersion?: 0 | 1 | 2;
}): string => {
  // 解构参数，提取roomIdHexs和version
  const { roomIds, roomIdHexs, version, mapVersion } = params;

  const dataArray = [
    {
      value: roomIds?.length ?? roomIdHexs.length,
      byte: 1,
    },
  ];

  if (roomIds) {
    roomIds.forEach(roomId => {
      dataArray.push({
        value: roomId,
        byte: 1,
      });
    });
  } else if (roomIdHexs) {
    roomIdHexs.forEach(roomHexId => {
      dataArray.push({
        value: parseRoomId(roomHexId, mapVersion),
        byte: 1,
      });
    });
  }

  // 在数组前面添加房间ID数量的信息，用于解码时还原数组长度
  // 将数据数组转换为数据字符串
  const data = convertDataArrayToDataStr(dataArray);

  // 使用指定的命令代码和数据，以及版本号，编码标准特性命令
  return encodeStandardFeatureCommand(ROOM_ORDER_CMD_APP_V1, data, version);
};

/**
 * @deprecated 请使用 encodeRoomOrder0x26
 */
export const encodeRoomOrderV1 = encodeRoomOrder0x26;

/**
 * 解码房间清扫顺序信息。
 *
 * 该函数用于解析特定格式的命令字符串，从中提取房间订单相关信息。
 *
 * @param {Object} params - 解码参数对象。
 * @param {string} params.command - 待解码的命令字符串。
 * @param {'0' | '1'} [params.version='1'] - 命令字符串的版本信息，默认为'1'。
 * @returns {string[] | null} - 解码后的房间订单信息数组，如果解码失败则返回null。
 */
export const decodeRoomOrder0x27 = (params: {
  command: string;
  version?: '0' | '1';
}): number[] | null => {
  // 解构参数，同时设置默认版本为'1'
  const { command, version = '1' } = params;
  // 使用预定义的函数解码标准特性命令，并获取解码结果及有效性信息
  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    ROOM_ORDER_CMD_ROBOT_V1,
    version
  );
  // 如果解码结果无效，则返回null
  if (!valid) {
    return null;
  }
  // 使用正则表达式匹配命令字符串中的房间订单信息片段
  const commonArr = dataStr.match(/\w{2}/g).slice(1);

  // 返回除第一个片段外的所有房间订单信息片段
  return commonArr.map(i => parseInt(i, 16));
};

/**
 * @deprecated 请使用 decodeRoomOrder0x27
 */
export const decodeRoomOrderV1 = decodeRoomOrder0x27;
