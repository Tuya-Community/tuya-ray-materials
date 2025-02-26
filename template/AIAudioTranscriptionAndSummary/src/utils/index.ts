export const JsonUtil = {
  parseJSON(str) {
    let rst;
    if (str && {}.toString.call(str) === '[object String]') {
      try {
        rst = JSON.parse(str);
      } catch (e) {
        try {
          // eslint-disable-next-line
          rst = eval(`(${str})`);
        } catch (e2) {
          rst = str;
        }
      }
    } else {
      rst = typeof str === 'undefined' ? {} : str;
    }

    return rst;
  },
};

/**
 * 秒转换为时:分:秒
 */
export function convertSecondsToTime(seconds: number) {
  // 1分钟 = 60秒
  const minutes = Math.floor(seconds / 60);
  // 1小时 = 60分钟
  const hours = Math.floor(minutes / 60);

  // 计算剩余的秒和分钟
  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;

  // 将小时、分钟和秒数格式化为两位数
  const formattedHours = String(remainingHours).padStart(2, '0');
  const formattedMinutes = String(remainingMinutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// 计算 RMS 值
/**
 * 计算 16 位 PCM 数组的分贝值
 * @param {Int16Array} pcmData - 16 位 PCM 音频数据
 * @param {number} referenceLevel - 参考电平，默认 32768
 * @returns {number} 分贝值 (dB)
 */
export const calculateDecibels = (pcmData: number[], referenceLevel = 1) => {
  if (pcmData.length === 0) {
    throw new Error('PCM cannot be empty!');
  }
  // 计算 RMS
  let sum = 0;
  for (let i = 0; i < pcmData.length; i++) {
    sum += pcmData[i] ** 2; // 求平方和
  }
  const rms = Math.sqrt(sum / pcmData.length); // 均方根
  // 避免对零取对数
  if (rms === 0) {
    return -Infinity; // 静音情况下分贝值
  }
  // 计算分贝值
  const db = 20 * Math.log10(rms / referenceLevel);
  return db;
};
