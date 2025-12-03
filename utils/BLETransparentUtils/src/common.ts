import { IReportData, ICreatePacketsOptions } from './types';

/**
 * 将连续的十六进制字符串转为字节数组
 * @param hexString 十六进制字符串
 * @returns byteArray 字节数组
 */
export function hexStringToByteArray(hexString: string): number[] {
  const byteArray: number[] = [];
  for (let i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.substr(i, 2), 16)); // 每 2 个字符解析为 1 个字节
  }
  return byteArray;
}

/**
 * 解析设备回复数据中的包号
 * @param reportData 设备回复数据
 * @param start 包号的起始位置，默认为 12, 可选
 * @param end 包号的结束位置，默认为 16, 可选
 * @returns packetIndex 包号
 */

export const parseReportData = (reportData: IReportData, start = 12, end = 16): number => {
  const str = reportData.data;
  const packetIndex = parseInt(str.slice(start, end), 16);
  return packetIndex;
};

/**
 * 生成分包数据
 * @param hexStringData 十六进制字符串
 * @param packetByteSize 最大分包的字节大小，默认为 1006, 可选
 * @returns hexPackets 十六进制字符串格式的分包数据
 */
export function createPackets({
  hexStringData,
  packetByteSize = 1006,
}: ICreatePacketsOptions): string[] {
  const data = hexStringToByteArray(hexStringData); // 转换为字节数组
  const dataLength = data.length; // 总数据长度
  const totalPackets = Math.ceil(dataLength / packetByteSize); // 总包数
  const hexPackets: string[] = [];

  for (let i = 0; i < totalPackets; i++) {
    // 当前包的数据起始和结束位置
    const start = i * packetByteSize;
    const end = Math.min(start + packetByteSize, dataLength);

    // 当前分包的数据部分
    const payload = data.slice(start, end);
    const payloadLength = packetByteSize;

    // 包头
    const packetHeader = [
      0x00, // 包头标识
      0x01, // 节目数据标识
      (6 + payloadLength) >> 8, // 数据长度的高字节
      (6 + payloadLength) & 0xff, // 数据长度的低字节
      totalPackets >> 8, // 数据总包数的高字节
      totalPackets & 0xff, // 数据总包数的低字节
      i >> 8, // 当前包号的高字节
      i & 0xff, // 当前包号的低字节
      payloadLength >> 8, // 分包长度的高字节
      payloadLength & 0xff, // 分包长度的低字节
    ];

    // 合并包头和数据部分的字节数组
    const packet = [...packetHeader, ...payload];
    hexPackets.push(packet.map(byte => byte.toString(16).padStart(2, '0')).join(''));
  }

  return hexPackets;
}
