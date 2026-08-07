import Strings from '@/i18n';

// 将毫秒转化为 h:m:s 格式
export function formatMilliseconds(ms: number) {
  if (ms <= 0) return '0s';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (remainingMinutes > 0) {
    parts.push(`${remainingMinutes}m`);
  }

  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}s`);
  }

  return parts.join(' ');
}

/**
 * 计算剩余天数
 * @param endTimestamp 结束时间戳（毫秒）
 * @returns 剩余天数，如果已过期返回0
 */
export function getRemainingDays(endTimestamp: number): number {
  const now = Date.now();
  const diffMs = endTimestamp - now;

  if (diffMs <= 0) {
    return 0; // 已过期
  }

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 根据语言环境格式化数字
 * @param {number|string} data - 要格式化的数据
 * @param {string} [language='en'] - 语言代码，默认为英文
 * @returns {string} 格式化后的字符串
 */
export function formatNumberByLanguage(data, language = 'en') {
  // 将数据转换为数字
  const num = typeof data === 'string' ? parseFloat(data) : data;

  // 检查是否为有效数字
  if (isNaN(num)) {
    return data.toString();
  }

  // 中文语言环境原样返回
  const isInteger = num % 1 === 0;
  if (language.startsWith('zh')) {
    return isInteger ? num.toFixed(0) : num.toFixed(1);
  }

  // 非中文语言环境添加千位分隔符
  return num.toLocaleString(language, { maximumFractionDigits: 1 });
}

/**
 * 格式化分钟数为友好的时间显示
 * @param {number} minutes - 要格式化的分钟数
 * @param {string} [language='zh'] - 本地化设置，默认为中文
 * @returns {string} 格式化后的时间字符串
 */
export function formatMinutes(minutes, language = 'zh') {
  const isChinese = language.startsWith('zh');
  if (minutes < 10000) {
    // 0-9999分钟直接显示分钟
    return `${formatNumberByLanguage(minutes, language)} ${Strings.getLang(
      isChinese ? 'minutes' : 'minute_abbr'
    )}`;
  }
  // 10000分钟及以上转换为小时
  const hours = minutes / 60;
  return `${formatNumberByLanguage(hours, language)} ${Strings.getLang(
    isChinese ? 'hours' : 'hour_abbr'
  )}`;
}

/**
 * 格式化字数为友好的显示格式
 * @param {number} count - 字数
 * @param {string} [language='zh'] - 本地化设置，默认为英文
 * @returns {string} 格式化后的字符串
 */
export function formatWordCount(count, language = 'zh') {
  const isChinese = language.startsWith('zh');

  if (isChinese) {
    // 中文格式：0-10000字显示N字，超过10000显示为1.2万
    if (count <= 10000) {
      return `${formatNumberByLanguage(count, language)} ${Strings.getLang('words')}`;
    }
    const wan = count / 10000;
    return `${formatNumberByLanguage(wan, language)} ${Strings.getLang('wan')}`;
  }
  // 非中文格式：0-1000显示N字，千以上用k，百万以上用m
  if (count < 1000) {
    return `${formatNumberByLanguage(count, language)} ${Strings.getLang('words')}`;
  }
  if (count < 1000000) {
    const k = count / 1000;
    return `${formatNumberByLanguage(k, language)} k`;
  }
  const m = count / 1000000;
  return `${formatNumberByLanguage(m, language)} m`;
}

/**
 * 将时长转化为时分秒格式 (H:MM:SS)
 * @param {number | string} time - 时间值，支持数字或数字字符串
 * @param {'seconds' | 'milliseconds'} [unit='seconds'] - 时间单位，'seconds' 或 'milliseconds'
 * @param {boolean} [hideHoursWhenZero=false] - 当小时为 0 时是否只显示分:秒（如 "03:44"），否则显示 "0:03:44"
 * @returns {string} 格式化后的时长字符串，例如 "0:00:23", "0:03:44", "1:15:00" 或 "03:44"（hideHoursWhenZero 且小时为 0 时）
 */
export function formatDurationToTime(
  time: number | string,
  unit: 'seconds' | 'milliseconds' = 'seconds',
  hideHoursWhenZero = false
): string {
  // 将字符串转换为数字
  const timeValue = typeof time === 'string' ? parseFloat(time) : time;

  // 检查是否为有效数字
  if (isNaN(timeValue)) {
    return hideHoursWhenZero ? '00:00' : '0:00:00';
  }

  // 如果是毫秒，先转换为秒
  const totalSeconds =
    unit === 'milliseconds' ? Math.floor(timeValue / 1000) : Math.floor(timeValue);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);

  // 分钟和秒数补零到两位
  const mm = minutes.toString().padStart(2, '0');
  const ss = remainingSeconds.toString().padStart(2, '0');

  if (hideHoursWhenZero && hours === 0) {
    return `${mm}:${ss}`;
  }
  return `${hours}:${mm}:${ss}`;
}

/**
 * 将秒或毫秒转化为带具体多语言单位的时分秒格式
 * @param {number | string} time - 时间值，支持数字或数字字符串
 * @param {'seconds' | 'milliseconds'} [unit='seconds'] - 时间单位，'seconds' 或 'milliseconds'
 * @returns {string} 格式化后的时长字符串，例如 "2分钟23秒", "1小时15分钟8秒", "23秒"
 */
export function formatDurationToLocalized(
  time: number | string,
  unit: 'seconds' | 'milliseconds' = 'seconds'
): string {
  // 将字符串转换为数字
  const timeValue = typeof time === 'string' ? parseFloat(time) : time;

  // 检查是否为有效数字
  if (isNaN(timeValue) || timeValue < 0) {
    return `0${Strings.getLang('seconds')}`;
  }

  // 如果是毫秒，先转换为秒
  const totalSeconds =
    unit === 'milliseconds' ? Math.floor(timeValue / 1000) : Math.floor(timeValue);

  if (totalSeconds === 0) {
    return `0${Strings.getLang('seconds')}`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}${Strings.getLang('hours')}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}${Strings.getLang('minutes')}`);
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}${Strings.getLang('seconds')}`);
  }

  return parts.join('');
}

/**
 * 将毫秒转化为"X小时Y分钟Z秒"格式
 * @param ms 毫秒数
 */
export function formatDurationHoursMinutes(ms: number): string {
  if (ms <= 0) return '';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}${Strings.getLang('hours')}`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}${Strings.getLang('minutes')}`);
  }
  if (seconds > 0 || (hours === 0 && minutes === 0)) {
    parts.push(`${seconds}${Strings.getLang('seconds')}`);
  }

  return parts.join('') ? parts.join('') : `0${Strings.getLang('seconds')}`;
}
