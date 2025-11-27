// 基础工具类

/**
 * @example
 * calcPosition(50, 0, 100, -100, 0)
 * // -50
 * @example
 * calcPosition(255, 0, 255, 0, 100)
 * // 100
 * @example
 * calcPosition(-255, 0, 255, 0, 100)
 * // -100
 * @param {Number} value - 原先值
 * @param {Number} min - 原先最小范围
 * @param {Number} max - 原先最大范围
 * @param {Number} newMin - 新最小范围
 * @param {Number} newMax - 新最大范围
 *
 * @return {Number} newValue - 新范围内对应的值
 */
const calcPosition = (value, min, max, newMin, newMax) => {
  const oldRange = max - min;
  const newRange = newMax - newMin;
  const newValue = ((value - min) * newRange) / oldRange + newMin;
  return newValue;
};

/**
 * 等同于原来的 inMaxMin
 * @example
 * inMaxMin(2838, 1, 233)
 * // 233
 * @example
 * inMaxMin(1, 2, 0)
 * // 1
 * @param {Number} min, a number is the minimum
 * @param {Number} max, a number is the maximum
 * @param {Number} value, a number
 * @returns {Number} a number which less than the maximum and great than the minimum
 */
const inMaxMin = (min, max, value) => Math.max(Math.min(max, value), min);

/**
 * @example
 * toFixed('111', 5)
 * // '00111'
 * toFixed('3456111', 5)
 * // '56111'
 * @param {String/Number} str is a string
 * @param {Number} count is number, the length of the return string
 * @returns {String}
 */
const toFixed = (str, count) => {
  return `${'0'.repeat(count)}${str}`.slice(-1 * count);
};

/**
 * 等同于原来的 parseSec
 * @example
 * parseSecond(111)
 * // ['00', '01', '51']
 * @example
 * parseSecond(3333333)
 * // ['25', '55', '33']
 * @param {Number} t, is a number stands second
 * @param {Number} n, is a number stands the string length to fixed, default value is 2
 * @returns {Array} a Array of String which each item is a string which length is `n`
 */
const parseSecond = t => {
  const h = Math.floor(t / 3600);
  const m = Math.floor(t / 60 - h * 60);
  const s = Math.floor(t - h * 3600 - m * 60);
  return [toFixed(h, 2), toFixed(m, 2), toFixed(s, 2)];
};

module.exports = {
  calcPosition,
  inMaxMin,
  toFixed,
  parseSecond,
};
