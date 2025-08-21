/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { showToast } from '@ray-js/ray';
import { decode } from 'base64-browser';

import Strings from '../i18n';
export { getDevId, setDevId } from './devId';
import { everydayLoop, onlyOneLoop } from '../timing/constant';

type scheduleItem = {
  id: string;
  time: number | string;
  weeks: number[];
  opened: boolean;
};

let scheduleList: scheduleItem[] = [];

const isShow = false;
const log = (...rest) => {
  if (!isShow) {
    return;
  }
  console.log(...rest);
};

export const schedule = {
  __getScheduleList: () => scheduleList,
  init(dateList: scheduleItem[]) {
    log('schedule init: ', dateList);
    scheduleList = dateList;
  },
  add(date: scheduleItem): boolean {
    if (schedule.conflictTip(date)) {
      return true;
    }
    log('schedule add: ', date);
    scheduleList.push(date);
    return false;
  },
  remove(date: scheduleItem) {
    const index = scheduleList.findIndex(i => date.id === i.id);
    scheduleList.splice(index, 1);
    log('schedule remove: ', index, date);
    return scheduleList;
  },
  update(date: scheduleItem, preDate: scheduleItem): boolean {
    // 最新设置的时间如果有冲突
    if (schedule.conflictTip(date)) {
      return true;
    }
    const index = scheduleList.findIndex(i => preDate.id === i.id);
    scheduleList.splice(index, 1, date);
    return false;
  },
  onceDataFormatterWeek(date) {
    const isOnce = date.weeks.join('') === onlyOneLoop;
    if (!isOnce) {
      return date.weeks;
    }
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const week = now.getDay();
    const nowDay = now.getDate();
    const [hour, minute] = date.time.toString().split(':');
    const setDate = new Date(`${nowYear}/${nowMonth + 1}/${nowDay} ${hour}:${minute}`);
    const _week = week + 1 === 7 ? 0 : week + 1;
    // eslint-disable-next-line no-param-reassign
    // 设置时间是否超过当前时间
    if (+setDate <= +now) {
      // 第二天执行
      // eslint-disable-next-line no-param-reassign
      date.weeks[_week] = 1;
    } else {
      // eslint-disable-next-line no-param-reassign
      date.weeks[week] = 1;
    }
    return date.weeks;
  },
  conflict(date: scheduleItem): boolean {
    // 关闭时不会有冲突
    if (!date.opened) {
      return false;
    }
    const _scheduleList = scheduleList.map(i => {
      const _week = schedule.onceDataFormatterWeek(i);
      return {
        ...i,
        weeks: _week,
      };
    });
    // 存在时间冲突的数据
    const timeConflictDate = _scheduleList.find(i => date.time === i.time && i.opened);
    if (!timeConflictDate) {
      // 没有时间维度的冲突直接返回
      return false;
    }
    // 如果是自身修改 不进行冲突校验
    if (timeConflictDate?.id === date?.id) {
      return false;
    }
    // 冲突的维度是每天的直接返回
    if (timeConflictDate?.weeks?.join('') === everydayLoop) {
      return true;
    }
    const isEveryDay = date?.weeks?.join('') === everydayLoop;
    // 如果是每天
    if (isEveryDay && timeConflictDate) {
      return true;
    }
    // 如果是一次
    // eslint-disable-next-line no-param-reassign
    date.weeks = schedule.onceDataFormatterWeek(date);

    const { weeks = [] } = timeConflictDate;
    const hasConflictWeek = date.weeks.find((w, idx) => {
      return weeks[idx] === w && w === 1 && date.opened;
    });
    return !!hasConflictWeek;
  },
  conflictTip(date: scheduleItem, tip?: string): boolean {
    const conflict = schedule.conflict(date);
    if (!conflict) {
      return false;
    }
    showToast({
      title: tip || Strings.getLang('timerConflict'),
      icon: 'error',
      mask: true,
    });
    return true;
  },
};

// 混淆字符串（匿名化）
export const getAnonymityNameStr = () => {
  return decode('dHV5YQ==');
};
