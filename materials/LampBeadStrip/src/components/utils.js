/* eslint-disable radix */

// 解析RGB颜色字符串为数组
function parseRGB(color) {
  const result = color.replace('rgba(', '').replace('rgb(', '').replace(')', '').split(',');
  return [Number(result[0]), Number(result[1]), Number(result[2])];
}

/**
 * 生成渐变颜色数组
 * @param {Array} colors - 长度为2-8的RGB颜色字符串数组，例如['rgb(255, 0, 0)', 'rgb(0, 255, 0)']
 * @param {number} steps - 希望生成的渐变颜色数量
 * @return {Array} 生成的渐变颜色数组
 */
export function generateGradientColors(colors = [], steps) {
  if (colors.length < 2 || colors.length > 8) {
    throw new Error('颜色数组长度必须为2至8之间');
  }
  if (steps <= 0) {
    throw new Error('步骤数必须大于0');
  }

  // 生成单个频道的渐变色
  function interpolate(start, end, factor) {
    return Math.round(start + (end - start) * factor);
  }

  // 生成两个颜色之间的渐变色
  function interpolateColors(color1, color2, factor) {
    const r = interpolate(color1[0], color2[0], factor);
    const g = interpolate(color1[1], color2[1], factor);
    const b = interpolate(color1[2], color2[2], factor);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const parsedColors = colors.map(parseRGB);
  const gradientColors = [];

  for (let i = 0; i < steps; i++) {
    const scaleIndex = (i * (parsedColors.length - 1)) / (steps - 1);
    const startColorIndex = Math.floor(scaleIndex);
    const endColorIndex = Math.ceil(scaleIndex);
    const factor = scaleIndex - startColorIndex;
    const color = interpolateColors(
      parsedColors[startColorIndex],
      parsedColors[endColorIndex],
      factor
    );
    gradientColors.push(color);
  }

  return gradientColors;
}

export const topList = [
  0, 2.81, 2.29, 1.76, 1.2, 0.63, 0.06, -0.52, -1.12, -1.72, -2.1, -2.04, -1.58, -0.96, -0.37, 0.2,
  0.78, 1.34, 1.9, 2.45,
];

export function getListByIndex(list, number) {
  const max = list.length - 1;
  // eslint-disable-next-line no-param-reassign
  if (number > max) number %= list.length;
  return list[number];
}

export function splitNumber(number, parts) {
  if (parts < 2 || parts > 8) {
    throw new Error('Parts must be between 2 and 8');
  }

  const base = Math.floor(number / parts); // 基本分割值
  const remainder = number % parts; // 余数，用于均匀分摊

  const result = Array(parts).fill(base); // 创建一个数组并初始化为基本分割值

  // 将余数均匀分配到前几个部分中
  for (let i = 0; i < remainder; i++) {
    result[i]++;
  }

  return result;
}

export function arrayFill(number, str) {
  if (number <= 0) return [];
  return new Array(number).fill(str);
}

export function splitLight(color) {
  const numberMap = {
    2: [10, 10], // 2
    3: [6, 7, 7], // 3
    4: [5, 5, 5, 5], // 4
    5: [5, 5, 5, 5], // 20
    6: [5, 5, 5, 5], // 12
    7: [5, 5, 5, 5], // 28
    8: [5, 5, 5, 5], // 8
  };
  const numberArr = numberMap[color.length];
  let colors = color;
  switch (color.length) {
    case 5:
      colors = arrayFill(4, colors).flat(1);
      break;
    case 6:
      colors = arrayFill(2, colors).flat(1);
      break;
    case 7:
      colors = arrayFill(4, colors).flat(1);
      break;
    default:
      break;
  }
  const colorsList = splitArray(colors, numberArr.length);
  return {
    arr: numberArr,
    color: colorsList,
  };
}

/**
 * 将数组等分割
 */
export const splitArray = (array, interval = 4) => {
  const result = [];
  let temp = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of array) {
    temp.push(item);
    if (temp.length === interval) {
      result.push(temp);
      temp = [];
    }
  }
  if (temp.length) {
    result.push(temp);
  }

  return result;
};
/**
 * @name: 获取数组内颜色叠加的颜色值
 * @desc:
 * @param {*} rgbArray
 * @return {*} String
 */
export function averageRGBColors(rgbArray) {
  const { length } = rgbArray;
  if (length === 0) {
    throw new Error('The input array is empty');
  }

  // 初始化总和数组
  let total = [0, 0, 0];

  // 解析并叠加每个颜色
  // eslint-disable-next-line no-restricted-syntax
  for (const rgbString of rgbArray) {
    const [r, g, b] = parseRGB(rgbString);
    total[0] += r;
    total[1] += g;
    total[2] += b;
  }

  // 计算平均值
  const average = total.map(sum => Math.round(sum / length));

  // 限制颜色分量在0到255之间
  const clamp = value => Math.max(0, Math.min(255, value));

  // 合成结果RGB字符串
  const resultRGB = `rgb(${clamp(average[0])}, ${clamp(average[1])}, ${clamp(average[2])})`;

  return resultRGB;
}

export function findOverlapIndices(range1, range2) {
  const [start1, end1] = range1;
  const [start2, end2] = range2;

  // 计算重叠起始和结束索引
  const overlapStart = Math.max(start1 < 0 ? 0 : start1, start2 < 0 ? 0 : start2);
  const overlapEnd = Math.min(end1 < 0 ? 0 : end1, end2 < 0 ? 0 : end2);

  // 检查是否存在交集
  if (overlapStart > overlapEnd) {
    return []; // 没有交集，返回空数组
  }

  // 生成重叠部分的索引数组
  const overlapIndices = [];
  for (let i = overlapStart; i <= overlapEnd; i++) {
    overlapIndices.push(i);
  }

  return overlapIndices;
}
