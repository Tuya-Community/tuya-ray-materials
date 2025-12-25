import { decode } from 'base64-browser';

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

const isShowLog = process.env.NODE_ENV === 'development';
export const log = (...arg) => {
  // eslint-disable-next-line no-console
  isShowLog && console.log(...arg);
};

// 混淆字符串（匿名化）tuya
export const getAnonymityNameStr = () => {
  return decode('dHV5YQ==');
};
