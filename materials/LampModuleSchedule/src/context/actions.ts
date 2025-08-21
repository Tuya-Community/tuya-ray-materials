import { ETimer } from './constant';

interface IReturn {
  type: ETimer;
  payload: any;
}

const log = (...arg) => {
  console.log('=====', ...arg);
};

export const addRtcTimer = (data: Record<string, any>): IReturn => {
  log('ADD_RTC_TIMER', data);
  return { type: ETimer.ADD_RTC_TIMER, payload: data };
};

export const removeRtcTimer = (data: Record<string, any>): IReturn => {
  log('REMOVE_RTC_TIMER', data);
  return { type: ETimer.REMOVE_RTC_TIMER, payload: data };
};
export const updateRtcTimer = (data: Record<string, any>): IReturn => {
  log('UPDATE_RTC_TIMER', data);
  return { type: ETimer.UPDATE_RTC_TIMER, payload: data };
};

// 关闭所有的本地定时
export const closeAllRtcTimer = (data: Record<string, any>): IReturn => {
  log('CLOSE_ALL_RTC_TIMER', data);
  return { type: ETimer.CLOSE_ALL_RTC_TIMER, payload: data };
};

export const initRtcTimerList = (data: Record<string, any>[]): IReturn => {
  log('INIT_RTC_TIMER_LIST', data);
  return { type: ETimer.INIT_RTC_TIMER_LIST, payload: data };
};

export default {
  addRtcTimer,
  removeRtcTimer,
  updateRtcTimer,
  closeAllRtcTimer,
  initRtcTimerList,
};
