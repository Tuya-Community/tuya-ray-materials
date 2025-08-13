/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Point } from '@/typings';
import { isNull, isUndefined, padStart } from 'lodash-es';
import tinycolor2 from 'tinycolor2';
import { BITMAP_TYPE_MAP, BITMAP_TYPE_MAP_V2 } from '..';

// -32768 ～ 32767
const max = 65535;
const min = 32767;

/**
 * 将房间id转换为hex id
 * @param id 房间id
 * @param type 房间类型
 * @returns
 */
const DECNumberToHex = (id: number, type: string) => {
  if (isUndefined(id) || isNull(id)) return '';
  const bit = Number(id).toString(2);
  const pad = bit + type;
  const dec = parseInt(pad, 2);
  return padStart(dec.toString(16), 2, '0');
};

/**
 * 转换roomHexId到roomId
 * 需要根据协议版本进行转换
 * @param pixel
 * @version 地图版本
 */
export const parseRoomId = (pixel: string, version: 0 | 1 | 2 | 3 = 1) => {
  let length = 6;
  switch (version) {
    case 1:
      length = 6;
      break;
    case 2:
      length = 5;
      break;
    case 3:
      length = 5;
      break;
    default:
      length = 6;
  }
  const pointHex = padStart(parseInt(pixel, 16).toString(2), 8, '0');
  const roomId = parseInt(pointHex.slice(0, length), 2);
  return roomId;
};
/**
 * 转换roomId到roomHexId
 * 需要根据协议版本进行转换
 * @param pixel
 * @version 地图版本
 */
export const parseRoomHexId = (roomId: number, version: 0 | 1 | 2 = 1) => {
  const padHex = version === 1 ? BITMAP_TYPE_MAP.sweep : BITMAP_TYPE_MAP_V2.sweep;

  return DECNumberToHex(roomId, padHex);
};
/**
 * 将十进制转为指定长度的十六进制字符串
 * @param num 十进制
 * @param padding 位数(默认为2)
 * @returns
 */
export const numToHexString = (num: number, padding = 2) => {
  const hex = Number(num).toString(16);
  return padStart(hex, padding, '0');
};

/**
 * 缩放相应的倍数
 * @param scale 倍数
 * @param value 被缩放的值
 * @returns
 */
export const scaleNumber = (scale: number, value: number) => {
  return Number((value / 10 ** scale).toFixed(scale));
};

/**
 * 兼容负数 byte 最大值平分给正负两端
 * @param point
 * @returns
 */
export const dealPL = (point: number) => {
  return point > min ? point - max : point;
};

/**
 * 高位加低位
 * @param high
 * @param low
 * @returns
 */
export const highLowToInt = (high, low) => {
  return low + (high << 8);
};

/**
 * 缩放x, y轴
 * @param mapScale 倍数
 * @param x
 * @param y
 * @returns
 */
export const transformXY = (mapScale: number, value: number) => {
  return scaleNumber(mapScale, dealPL(value));
};

/**
 * 放大倍数
 * @param data 被放大的值
 * @param scale 倍数
 * @returns
 */
export const dealScale = (data: number, scale: number) => {
  let floatData = data;
  if (typeof data === 'string') {
    floatData = parseFloat(data);
  }
  return Number(floatData.toFixed(scale)) * Math.pow(10, scale);
};

/**
 * 按照每个字节将16进制转换为10进制数字，并进行累加和操作
 * @param data 十六进制字符串
 * @returns
 */
export const addHex = (data: string) => {
  return data
    .match(/\w{2}/g)
    .map(v => parseInt(v, 16))
    .reduce((pre, cur) => pre + cur, 0);
};

/**
 * 字节转十六进制字符串
 * @param bytes
 * @returns
 */
export const bytesToHexString = (bytes: number[]) => {
  return bytes
    .map(x => {
      const high = (x >>> 4).toString(16);
      const low = (x & 0xf).toString(16);
      return `${high}${low}`;
    })
    .join('');
};

/**
 * 将十六进制字符串转换为正确无误的字符串，同时过滤掉控制字符。
 * @param hex 十六进制字符串
 * @returns 编码后的字符串
 */
export const hexToUTF8 = (hex: string) => {
  try {
    const arr = hex.match(/.{1,2}/g);
    if (!arr || arr.length === 0) return '';

    const bytes = new Uint8Array(arr.length);
    let j = 0;

    for (let i = 0; i < arr.length; i++) {
      const byte = parseInt(arr[i], 16);
      if (byte > 31 && byte !== 127) {
        bytes[j++] = byte;
      }
    }

    const validBytes = bytes.slice(0, j);

    // 使用 Array.from 将 Uint8Array 转为普通数组
    return Array.from(validBytes)
      .map(byte => String.fromCharCode(byte))
      .join('');
  } catch (err) {
    console.error(err);
    return '';
  }
};

/**
 * 将十六进制字符串转换为 UTF-8 字符串，过滤掉控制字符。
 * @param hex 十六进制字符串
 * @returns 解码后的字符串
 */
export const hexToUriDecodedString = (hex: string): string => {
  // if (!hex || hex.length % 2 !== 0 || !/^[\da-fA-F]+$/.test(hex)) return '';
  if (!hex) return '';
  try {
    const arr = hex.match(/.{1,2}/g);
    if (!arr) return '';

    const result = arr.filter(item => {
      const byteValue = parseInt(item, 16);
      return byteValue > 0x1f && byteValue !== 0x7f;
    });

    if (result.length === 0) return '';

    return decodeURIComponent('%' + result.join('%'));
  } catch (error) {
    console.error('传入的房间名称数据有误', hex);
    return '';
  }
};

/**
 * 字符串转字节码
 * @param str
 * @returns
 */
export const stringToByte = (str: string) => {
  const bytes = [];
  let c;
  const len = str.length;
  for (let i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
};

/**
 * 字节码转十六进制字符串
 * @param arr
 * @returns
 */
export const bytes2Str = (arr: Array<number | string>): string => {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    let tmp = arr[i].toString(16);
    if (tmp.length === 1) {
      tmp = `0${tmp}`;
    }
    str += tmp;
  }
  return str;
};

/**
 * 某些协议是一个定长字节的表示，当数据不足19字节的时候，需要进行的补0操作
 * @param str
 * @param len
 * @returns
 */
export const hexPlusLen = (str: string, len: number) => {
  const source = '0000000000000000000000000000000000000000';
  const strLen = str.length;
  const resLen = len * 2 - strLen;
  const res = str + source.slice(0, resLen);
  return res;
};

/**
 * 负数时区取反码
 * 返回十进制整数
 * @param num
 */
export const completionTimeZone = (num: number) => {
  const completion = '00000000';
  const binary = Number(num).toString(2);
  const binLen = binary.length;
  let original = '';
  if (binLen >= 8) {
    original = binary.slice(8);
  } else {
    original = completion.slice(0, 8 - binLen) + binary;
  }
  const comp = original
    .split('')
    .map(i => (i === '1' ? '0' : '1'))
    .join('');
  const int = parseInt(comp, 2) + 1;
  return int;
};

/**
 * 字符串转十六进制
 * @param str
 * @returns
 */
export const stringToAtHex = (str: string) => {
  let val = '';
  for (let i = 0; i < str.length; i++) {
    if (val === '') {
      val = str.charCodeAt(i).toString(16);
    } else {
      val += `${str.charCodeAt(i).toString(16)}`;
    }
  }
  return val;
};

/**
 * 截取最后几位数的字符
 * @param {} v
 * @param {*} length
 */
export const lastChar = (num: number, length = 2) => {
  let d = num.toString(16);
  if (d.length < length) {
    d = '0'.repeat(length - d.length) + d;
  } else {
    d = d.slice(d.length - length, d.length);
  }
  return d;
};

export const getHexXYFromXY = ({ x, y }: Point, origin: Point, mapScale = 1) => {
  const originScaled = {
    x: origin.x * Math.pow(10, mapScale),
    y: origin.y * Math.pow(10, mapScale),
  };

  const hexX = numToHexString((65535 + dealScale(x, mapScale) - originScaled.x) % 65535, 4);
  const hexY = numToHexString((65535 + originScaled.y - dealScale(y, mapScale)) % 65535, 4);

  return { hexX, hexY };
};

export const hexStringToNumber = (hexString: string, byte = 1) => {
  const numberArray = [];

  for (let i = 0; i < hexString.length; i += byte * 2) {
    // 截取每两个字符，转换为16进制，再转换为10进制数字
    const hexByte = hexString.slice(i, i + byte * 2);
    const decimal = parseInt(hexByte, 16);
    numberArray.push(decimal);
  }

  return numberArray;
};

// 充电桩小于0时视为无效充电桩
export const transformChargeXY = (
  {
    chargeX,
    chargeY,
  }: {
    chargeX: number;
    chargeY: number;
  },
  { originX, originY }: { originX: number; originY: number }
) => {
  if (chargeX <= 0 && chargeY <= 0) return null;
  const finalX = chargeX - originX;
  const finalY = chargeY - originY;

  return {
    x: finalX,
    y: finalY,
  };
};

/**
 * roomHex的组装
 */
export const combineTwoBinaryToHex = (binary1: string, binary2: string) => {
  const binary = binary1 + binary2;
  return parseInt(binary.slice(-8), 2).toString(16).padStart(2, '0');
};

export const convertColorToArgbHex = (color: string) => {
  const tc = tinycolor2(color);

  // 检查颜色是否有效
  if (!tc.isValid()) {
    throw new Error('Invalid color format');
  }

  // 获取 RGB 和 Alpha 值
  const rgb = tc.toRgb();
  const a = Math.round(tc.getAlpha() * 255); // Alpha 转换为 0-255

  // 组合 ARGB 并转换为十六进制字符串
  return (
    '#' +
    (
      a.toString(16).padStart(2, '0') +
      rgb.r.toString(16).padStart(2, '0') +
      rgb.g.toString(16).padStart(2, '0') +
      rgb.b.toString(16).padStart(2, '0')
    ).toUpperCase()
  );
};

export const subStrToInt = (value: string, start: number, length = 2) => {
  return parseInt(value.slice(start, start + length), 16) || 0;
};

export const from16To2 = (v: string, length = 7) => {
  return padStart(parseInt(v, 16).toString(2), length, '0');
};

export const processHex = (inputHex: string) => {
  // Step 1: Convert input to decimal
  const decimalValue = parseInt(inputHex, 16);

  // Step 2: Check if the decimal value is negative
  if (decimalValue < 0) {
    // Convert negative decimal value to 16-bit binary
    let binaryValue = Math.abs(decimalValue).toString(2);
    binaryValue = binaryValue.padStart(16, '0'); // Extend to 16 bits

    // Calculate one's complement (invert bits)
    const onesComplement = binaryValue
      .split('')
      .map(bit => (bit === '0' ? '1' : '0'))
      .join('');

    // Calculate two's complement (add 1 to one's complement)
    const twosComplement = (parseInt(onesComplement, 2) + 1).toString(2).padStart(16, '0');

    // Convert two's complement to hexadecimal
    const outputHex = parseInt(twosComplement, 2).toString(16).toUpperCase();

    return outputHex;
  }
  // If input is positive, return the input itself
  return inputHex.substring(4, 8);
};

export const makeXYArray = (hexStr = '', mapScale = 1) => {
  const commonArr = hexStr.match(/\w{8}/g) ?? [];
  // 由于设备端x\y传的是8位，面板为了能正常接入后续4位坐标的转换逻辑，所以对8位x\y进行了缩短成4位
  const commonArr2 =
    commonArr
      .map(item => processHex(item))
      .join('')
      .match(/\w{2}/g) ?? [];
  const dataSource = commonArr2.map(d => {
    const positionNumber = parseInt(d, 16);
    return positionNumber > min ? positionNumber - max : positionNumber;
  });
  // 这里开始就完成了8位转4位（4字节转2字节）的转换，开始标准的x\y处理流程
  const valueX = highLowToInt(dataSource[0], dataSource[1]);
  const valueY = highLowToInt(dataSource[2], dataSource[3]);

  const x = transformXY(mapScale, valueX);
  const y = -transformXY(mapScale, valueY);

  return {
    x,
    y,
  };
};

export const arrayBufferToOctetStream = (arrayBuffer: ArrayBuffer) => {
  // 将 ArrayBuffer 转换为 Uint8Array
  const uint8Array = new Uint8Array(arrayBuffer);

  // 创建空字符串
  let binaryString = '';

  // 逐个字节地迭代 Uint8Array，并将其转换为二进制字符串
  for (let i = 0; i < uint8Array.length; i++) {
    // binaryString += String.fromCharCode(uint8Array[i]);
    let hex = uint8Array[i].toString(16);
    hex = hex.length === 1 ? `0${hex}` : hex;
    binaryString += hex;
  }

  let str = '';
  for (let i = 0; i < binaryString.length; i += 2) {
    str += String.fromCharCode(parseInt(binaryString.substr(i, 2), 16));
  }
  // 返回 "data:application/octet-stream;base64" 格式的字符串
  return `data:image/png;base64,${str}`;
};
