import { AIPicHD } from '@/typings';
import { arrayBufferToOctetStream, hexStringToNumber } from '@/utils';
import { lz4Uncompress } from '@/utils/lz4';

/**
 * 解码AI高清图片数据
 * 该函数接受一个十六进制字符串作为输入，将其解码为原始的图片数据，并以Base64格式返回
 * 主要用于处理通过特定加密或压缩方式处理过的图片数据，以便在应用中正确显示图片
 *
 * @param str 十六进制编码的字符串，代表加密或压缩过的图片数据
 * @returns 返回一个包含解码后Base64格式图片数据的对象
 */
export const decodeAiPicHDData = (str: string): AIPicHD => {
  // 当输入字符串为空时，直接返回一个包含空源的图片数据对象
  if (str === '') {
    return { source: '' };
  }

  // 将十六进制字符串转换为数字数组，便于进一步处理
  const encodeDataArray = hexStringToNumber(str);
  // 使用LZ4算法对编码后的数据数组进行解压缩，恢复原始数据
  const decodeDataArray = lz4Uncompress(encodeDataArray);
  // 将解压缩后的数据数组转换为字节流，并以Base64格式表示，以便在Web环境中使用
  const base64data = arrayBufferToOctetStream(decodeDataArray);

  // 返回包含解码后Base64格式图片数据的对象
  return { source: base64data };
};
