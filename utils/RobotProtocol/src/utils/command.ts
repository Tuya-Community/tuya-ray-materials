import { EXTEND_FEATURE_HEADER, STANDARD_FEATURE_HEADER } from '@/constant/cmd';
import { numToHexString } from '.';
import { DataArray } from '@/typings';

/**
 * 构建扫地机标准功能指令 App ➜ Robot
 * @param version 协议版本
 * @param cmd 命令字
 * @param data 数据
 * @returns 指令
 */
export const encodeStandardFeatureCommand = (
  cmd: string,
  data: string,
  version: '0' | '1'
): string => {
  // 协议版本
  const ver = version === '1' ? '01' : '00';

  const cmdAndData = cmd + data;
  // 数据长度
  const length =
    version === '1'
      ? numToHexString(cmdAndData.length / 2, 8)
      : numToHexString(cmdAndData.length / 2, 2);

  const checkSum = getCheckSum(cmdAndData);

  return `${STANDARD_FEATURE_HEADER}${ver}${length}${cmd}${data}${checkSum}`;
};

/**
 * 构建扫地机拓展功能指令 App ➜ Robot
 * @param cmd 命令字
 * @param data 数据
 * @returns 指令
 */
export const encodeExtendFeatureCommand = (cmd: string, data: string): string => {
  const cmdAndData = cmd + data;
  // 数据长度
  const length = numToHexString(cmdAndData.length / 2, 8);

  const checkSum = getCheckSum(cmdAndData);

  return `${EXTEND_FEATURE_HEADER}00${length}${cmd}${data}${checkSum}`;
};

/**
 * 从指令中解析得到必要信息
 * @param command 指令
 * @param cmd 命令字
 * @param version 协议版本
 * @returns 解析数据
 */
export const decodeStandardFeatureCommand = (
  command: string,
  cmd: string,
  version: '0' | '1' = '1'
): {
  valid: boolean;
  dataLength?: number;
  cmdStr?: string;
  dataStr?: string;
} => {
  const cmdStr = getCmdStrFromStandardFeatureCommand(command, version);

  if (cmdStr !== cmd) {
    // 不是该指令的数据
    console.warn('<ray-robot-protocol>: 传入的数据与需要解析的指令不匹配');
    return { valid: false };
  }

  const dataLengthStr = version === '1' ? command.slice(4, 12) : command.slice(4, 6);
  // cmd + data 的长度
  const dataLength = parseInt(dataLengthStr, 16);

  const dataStr =
    version === '1'
      ? command.slice(14, 14 + (dataLength - 1) * 2)
      : command.slice(8, 8 + (dataLength - 1) * 2);

  if (dataStr.length !== (dataLength - 1) * 2) {
    // 校验一下长度
    console.warn('<ray-robot-protocol>: 数据长度字段与实际的数据长度不匹配');
    return { valid: false };
  }

  return {
    dataLength,
    cmdStr,
    dataStr,
    valid: true,
  };
};

/**
 * 从指令中解析指令协议版本
 * @param command 指令
 * @returns 协议版本
 */
export const getFeatureProtocolVersion = (command: string): '0' | '1' => {
  return command.slice(2, 4) === '01' ? '1' : '0';
};

/**
 * 从指令中获取命令字
 * @param command 指令
 * @param version 协议版本
 * @returns 命令字
 */
export const getCmdStrFromStandardFeatureCommand = (
  command: string,
  version: '0' | '1' = '1'
): string => {
  // ab帧头的指令固定是4字节协议
  return version === '1' || command.startsWith('ab') ? command.slice(12, 14) : command.slice(6, 8);
};

/**
 * 获取校验和
 * @param value
 * @returns
 */
const getCheckSum = (value: string) => {
  const arr = value.match(/.{2}/g);

  const sum = arr.reduce((a, b) => a + parseInt(b, 16), 0);

  return numToHexString(sum % 256, 2);
};

/**
 * 将数据数组转化为数据指令
 *
 * 数组项接受
 *
 * 1. 对象类型(可配置不同字节)
 *
 * 2. 数值类型(1个字节的数据可以这么使用)
 *
 * 3. 字符串类型(直接传入byte字符串)
 * @param dataArray 数据数组
 * @returns 数据指令
 */
export const convertDataArrayToDataStr = (dataArray: DataArray): string => {
  return dataArray.reduce<string>((str: string, item) => {
    if (typeof item === 'number') {
      return str + numToHexString(item);
    }

    if (typeof item === 'string') {
      return str + item;
    }

    if (typeof item === 'object') {
      const { value, byte = 1 } = item;
      return str + numToHexString(value, byte * 2);
    }

    return str;
  }, '');
};
