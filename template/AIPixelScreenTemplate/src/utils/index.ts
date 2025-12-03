import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';
import globalStorage from '@/redux/storage';

export const isInIDE = getCachedSystemInfo().brand === 'devtools';

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

export function throttle(func, wait) {
  let timeout = null;
  let previous = 0; // 上次执行时间

  return (...args) => {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args); // 立即执行
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args); // 延迟执行
      }, remaining);
    }
  };
}

// 分割字符串, 每8个字符分割一次
export const splitString = s => {
  const result = [];
  for (let i = 0; i < s.length; i += 8) {
    const substring = s.slice(i, i + 8);
    result.push(substring);
  }
  return result;
};

export const binaryToHex = binary => {
  let hex = '';
  for (let i = 0; i < binary.length; i += 4) {
    const group = binary.slice(i, i + 4).padEnd(4, '0');
    let decimal = 0;
    for (let j = 0; j < group.length; j++) {
      if (group[group.length - 1 - j] === '1') {
        decimal += Math.pow(2, j);
      }
    }
    if (decimal < 10) {
      hex += decimal;
    } else {
      hex += String.fromCharCode(decimal - 10 + 'A'.charCodeAt(0));
    }
  }
  return hex;
};

export const md5 = path => globalStorage.md5(path);

export const readFileBase64 = path => globalStorage.readFileBase64(path);

export const to16 = (value, length) => {
  let result = Number(value).toString(16);
  if (result.length < length) {
    result = result.padStart(length, '0');
  }
  return result;
};

export { getDevInfo, setDevInfo, clearDevInfo } from './devInfo';
export { globalLoading, globalToast } from './globalLoading';
export { getDeviceRealPx } from './systemInfo';
