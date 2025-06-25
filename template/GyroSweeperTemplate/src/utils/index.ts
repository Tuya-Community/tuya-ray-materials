import Strings from '@/i18n';

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
 * 按比例缩放数字
 */
export const scaleNumber = (scale: number, value: number): number => {
  if (scale <= 0) return value;
  return value / Math.pow(10, scale);
};

export const errorToast = err => {
  ty.showToast({
    title: err?.message ?? Strings.getLang('error'),
    icon: 'fail',
  });
};
