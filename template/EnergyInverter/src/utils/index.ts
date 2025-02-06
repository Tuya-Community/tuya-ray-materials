export * from './chart';
import moment from 'moment';
import { DateAction, DateTag } from '../constants';
import { getSystemInfoSync, platform } from '@ray-js/ray';

const systemInfo = getSystemInfoSync();

export const getStatusBarHeight = () => {
  return systemInfo.statusBarHeight;
};

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

// 获取给定时间和类型：week、month, year的开始和结束日期
export function getTimeDuring(time, type, format = 'YYYYMMDD') {
  const date = moment(time);
  if (type === DateTag.WEEK) {
    const weekday = date.isoWeekday() - 1; // 当前是这周第几天
    return `${date.subtract(weekday, 'days').format(format)}-${date.add(6, 'day').format(format)}`;
  }
  if (type === DateTag.YEAR) {
    const monthDay = date.date() - 12;
    return `${date.subtract(monthDay, 'days').format(format)}-${date
      .add(12, 'months')
      .subtract(1, 'days')
      .format(format)}`;
  }
  const monthDay = date.date() - 1;
  return `${date.subtract(monthDay, 'days').format(format)}-${date
    .add(1, 'months')
    .subtract(1, 'days')
    .format(format)}`;
}

export const rpx2pxNum = maybeRpx => {
  if (typeof maybeRpx === 'string') {
    if (maybeRpx.endsWith('rpx')) {
      const value = Number(maybeRpx.replace(/rpx/g, ''));
      if (platform.isMiniProgram) {
        return (value / 750) * systemInfo.windowWidth;
      }
      if (platform.isWeb) {
        return value / 2;
      }
    } else if (maybeRpx.endsWith('px')) {
      const value = Number(maybeRpx.replace(/px/g, ''));
      return Number(value);
    }
  } else {
    if (platform.isMiniProgram) {
      return (maybeRpx / 750) * systemInfo.windowWidth;
    }
    if (platform.isWeb) {
      return maybeRpx / 2;
    }
  }
  return Number(maybeRpx);
};

export const promisify = func => {
  return function (...args) {
    return new Promise((resolve, reject) => {
      func(Object.assign({}, ...args, { success: resolve, fail: reject }));
    });
  };
};

export const sleep = time => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
};

/**
 * 是否能next日期
 * @param {*} time int 时间戳
 * @param {*} timeType week,month,year
 * @returns
 */
export function timeIsNext(time, timeType) {
  const now = moment();
  if (timeType === DateTag.YEAR) {
    return time.format('YYYY') !== now.format('YYYY');
  }
  if (timeType === DateTag.MONTH) {
    return time.format('YYYYMM') !== now.format('YYYYMM');
  }
  if (timeType === DateTag.WEEK) {
    return time.format('YYYY') !== now.format('YYYY') || time.week() !== now.week();
  }
  // 默认天
  return time.format('YYYYMMDD') !== now.format('YYYYMMDD');
}

/**
 * 切换时间
 * @param {*} time "20211129-20211205" / '12'
 * @param {*} timeType day,week,month
 * @param {*} changeType add/subtract
 * @returns
 */
export function tabsTimeChange(beginTime, endTime, timeType, changeType) {
  const result = {
    beginMomentTime: beginTime,
    endMomentTime: endTime,
    beginDate: '',
    endDate: '',
  };
  // 判断加/减
  let BeginMomentTime = moment(beginTime);
  let EndMomentTime = moment(endTime);
  let date = '';
  if (changeType === DateAction.ADD) {
    // 判断周/月类型
    if (timeType === DateTag.WEEK) {
      // 下一周
      BeginMomentTime = BeginMomentTime.add(7, 'days');
      EndMomentTime = EndMomentTime.add(7, 'days');
      date = getTimeDuring(BeginMomentTime, timeType);
      result.beginDate = date.split('-')[0];
      result.endDate = date.split('-')[1];
    } else if (timeType === DateTag.MONTH) {
      // 下一月
      BeginMomentTime = BeginMomentTime.add(1, 'months');
      EndMomentTime = EndMomentTime.add(1, 'months');
      date = getTimeDuring(BeginMomentTime, timeType);
      result.beginDate = date.split('-')[0];
      result.endDate = date.split('-')[1];
    } else if (timeType === DateTag.YEAR) {
      // 下一年
      BeginMomentTime = BeginMomentTime.add(12, 'months');
      EndMomentTime = EndMomentTime.add(12, 'months');
      date = getTimeDuring(BeginMomentTime, timeType);
      result.beginDate = date.split('-')[0];
      result.endDate = date.split('-')[1];
    } else {
      // 下一天
      BeginMomentTime = BeginMomentTime.add(1, 'days');
      EndMomentTime = EndMomentTime.add(1, 'days');
      result.beginDate = BeginMomentTime.format('YYYYMMDD') + '00';
      result.endDate = BeginMomentTime.format('YYYYMMDD') + '23';
    }
  } else if (changeType === DateAction.SUBTRACT) {
    // 判断周/月类型
    if (timeType === DateTag.WEEK) {
      // 上一周
      BeginMomentTime = BeginMomentTime.subtract(7, 'days');
      EndMomentTime = EndMomentTime.subtract(7, 'days');
      date = getTimeDuring(BeginMomentTime, timeType);
      result.beginDate = date.split('-')[0];
      result.endDate = date.split('-')[1];
    } else if (timeType === DateTag.MONTH) {
      // 上一月
      BeginMomentTime = BeginMomentTime.subtract(1, 'months');
      EndMomentTime = EndMomentTime.subtract(1, 'months');
      date = getTimeDuring(BeginMomentTime, timeType);
      result.beginDate = date.split('-')[0];
      result.endDate = date.split('-')[1];
    } else if (timeType === DateTag.YEAR) {
      // 上一年
      BeginMomentTime = BeginMomentTime.subtract(12, 'months');
      EndMomentTime = EndMomentTime.subtract(12, 'months');
      date = getTimeDuring(BeginMomentTime, timeType);
      result.beginDate = date.split('-')[0];
      result.endDate = date.split('-')[1];
    } else {
      // 上一天
      BeginMomentTime = BeginMomentTime.subtract(1, 'days');
      EndMomentTime = EndMomentTime.subtract(1, 'days');
      result.beginDate = BeginMomentTime.format('YYYYMMDD') + '00';
      result.endDate = BeginMomentTime.format('YYYYMMDD') + '23';
    }
  }
  result.beginMomentTime = BeginMomentTime;
  result.endMomentTime = EndMomentTime;
  return result;
}

// 保留小数位
export const keepDecimals = (num, len = 1) => {
  if (num === 0 || num === '0') return num;
  return parseFloat(num.toFixed(len));
};
