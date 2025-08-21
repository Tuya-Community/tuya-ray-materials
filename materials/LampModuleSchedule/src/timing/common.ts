/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getSupport } from '../utils/supportUtils';

import {
  getTimerList as getTimerListCloud,
  updateTimer as updateTimerCloud,
  removeTimer as removeTimerCloud,
  addTimer as addTimerCloud,
  changeTimerStatus as changeTimerStatusCloud,
} from './cloud';

import {
  getTimerList as getTimerListLocal,
  updateTimer as updateTimerLocal,
  removeTimer as removeTimerLocal,
  addTimer as addTimerLocal,
  changeTimerStatus as changeTimerStatusLocal,
} from './local';

export const addTimer = (loops: string, instruct: any, scheduleList: any[], _params?: any) => {
  const { isSupportCloudTimer, isSupportLocalTimer } = getSupport();
  if (isSupportLocalTimer) {
    return addTimerLocal(loops, instruct, scheduleList, _params);
  }
  if (isSupportCloudTimer) {
    return addTimerCloud(loops, instruct, _params);
  }
  return new Promise<void>(resolve => {
    resolve();
  });
};

export const removeTimer = (res, scheduleList?: any[]) => {
  const { isSupportCloudTimer, isSupportLocalTimer } = getSupport();
  if (isSupportLocalTimer) {
    return removeTimerLocal(res, scheduleList);
  }

  if (isSupportCloudTimer) {
    return removeTimerCloud(res);
  }
  return new Promise<void>(resolve => {
    resolve();
  });
};

export const updateTimer = (prams, timerDataList, _params) => {
  const { isSupportCloudTimer, isSupportLocalTimer } = getSupport();
  if (isSupportLocalTimer) {
    return updateTimerLocal(prams, timerDataList, _params);
  }
  if (isSupportCloudTimer) {
    return updateTimerCloud(prams, _params);
  }
  return new Promise<void>(resolve => {
    resolve();
  });
};

export const changeTimerStatus = (id: string, status: 0 | 1, timerDataList?: any[]) => {
  const { isSupportCloudTimer, isSupportLocalTimer } = getSupport();
  if (isSupportLocalTimer) {
    return changeTimerStatusLocal(id, status ? 1 : 0, timerDataList);
  }
  if (isSupportCloudTimer) {
    return changeTimerStatusCloud(id, status ? 1 : 0);
  }
  return new Promise(resolve => {
    resolve({
      scheduleList: [],
    });
  });
};

export const getTimerList = state => {
  const { isSupportCloudTimer, isSupportLocalTimer } = getSupport();
  if (isSupportLocalTimer) {
    return getTimerListLocal(state);
  }
  if (isSupportCloudTimer) {
    return getTimerListCloud();
  }
  return new Promise<void>(resolve => {
    resolve();
  });
};
