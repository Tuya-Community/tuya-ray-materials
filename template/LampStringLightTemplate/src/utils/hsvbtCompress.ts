// (类型定义保持不变)
interface ColorLight {
  i: number;
  isC: 1;
  h: number;
  s: number;
  v: number;
}

interface WhiteLight {
  i: number;
  isC: 0;
  b: number;
  t: number;
}

type LightData = ColorLight | WhiteLight;

/**
 * 压缩函数 (固定长度优化版)
 * @param data 原始数据数组
 * @returns 压缩后的字符串
 */
export function compressHsvbt(data: LightData[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  const parts = data.map(item => {
    // 辅助函数，将数字转为2位的36进制字符串，不足则补0
    const toPaddedBase36 = (num: number) => num.toString(36).padStart(2, '0');

    if (item.isC === 1) {
      // 格式: 1<h><<s><v> (1 + 2 + 2 + 2 = 7位)
      return '1' + toPaddedBase36(item.h) + toPaddedBase36(item.s) + toPaddedBase36(item.v);
    }
    // 格式: 0<b><t> (1 + 2 + 2 = 5位)
    return '0' + toPaddedBase36(item.b) + toPaddedBase36(item.t);
  });

  return parts.join(';');
}

/**
 * 解压缩函数 (固定长度优化版)
 * @param compressedString 压缩字符串
 * @returns 解压后的数据数组
 */
export function decompressHsvbt(compressedString: string): LightData[] {
  if (!compressedString) {
    return [];
  }

  const result: LightData[] = [];
  const parts = compressedString.split(';');

  parts.forEach((part, index) => {
    const isC = parseInt(part.substring(0, 1), 10);

    if (isC === 1) {
      const colorLight: ColorLight = {
        i: index,
        isC: 1,
        // 按固定长度截取子字符串进行解析
        h: parseInt(part.substring(1, 3), 36), // h: index 1, length 2
        s: parseInt(part.substring(3, 5), 36), // s: index 3, length 2
        v: parseInt(part.substring(5, 7), 36), // v: index 5, length 2
      };
      result.push(colorLight);
    } else if (isC === 0) {
      const whiteLight: WhiteLight = {
        i: index,
        isC: 0,
        b: parseInt(part.substring(1, 3), 36), // b: index 1, length 2
        t: parseInt(part.substring(3, 5), 36), // t: index 3, length 2
      };
      result.push(whiteLight);
    }
  });

  return result;
}
