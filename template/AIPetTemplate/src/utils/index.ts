import { authorize, showToast, router } from '@ray-js/ray';
import mitt from 'mitt';
import { throttle } from 'lodash-es';
import dayjs from 'dayjs';
import Strings from '@/i18n';
import { imgCat, imgDog } from '@/res';

export const emitter = mitt();

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

export const toHexByte = (number: number, bytes = 1) => {
  // Convert the number to a hexadecimal string and pad it with zeros
  return number.toString(16).padStart(bytes * 2, '0');
};

export const authorizeCamera = () => {
  return new Promise((resolve, reject) => {
    authorize({
      scope: 'scope.camera',
      success: () => {
        resolve(true);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

export const authorizeAlbum = () => {
  return new Promise((resolve, reject) => {
    authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => {
        resolve(true);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

export const errorToast = err => {
  // 部分云端错误信息可供展示
  showToast({
    title: err?.message ?? Strings.getLang('error'),
    icon: 'fail',
  });
};

const throttledRouterPush = throttle(
  (url: string) => {
    router.push(url);
  },
  1000,
  { trailing: false }
);

export const routerPush = (url: string) => {
  throttledRouterPush(url);
};

export const getAvatarByPetType = (type: string) => {
  return {
    cat: imgCat,
    dog: imgDog,
  }[type];
};

export const formatTimeDifference = (timestamp: number) => {
  const now = dayjs().endOf('day');
  const then = dayjs(timestamp).endOf('day');

  const diffInYears = now.diff(then, 'years');
  then.add(diffInYears, 'years');

  const diffInMonths = now.diff(then, 'months');
  then.add(diffInMonths, 'months');

  const diffInDays = now.diff(then, 'days');

  if (diffInYears >= 1) {
    return diffInMonths === 0
      ? Strings.formatValue('age_format_years', String(diffInYears))
      : Strings.formatValue('age_format_years_months', String(diffInYears), String(diffInMonths));
  }
  if (diffInMonths >= 1) {
    return diffInDays === 0
      ? Strings.formatValue('age_format_months', String(diffInMonths))
      : Strings.formatValue('age_format_months_days', String(diffInMonths), String(diffInDays));
  }
  return Strings.formatValue('age_format_days', String(diffInDays));
};
