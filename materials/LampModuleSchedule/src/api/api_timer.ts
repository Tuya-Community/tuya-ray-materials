/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import { utils } from '@ray-js/panel-sdk';
import { requestCloud } from '@ray-js/ray';

import { getAnonymityNameStr, getDevId } from '../utils';

const sucStyle = 'background: green; color: #fff;';
const errStyle = 'background: red; color: #fff;';

export function api(url: string, postData: any, version = '1.0') {
  return new Promise((resolve, reject) => {
    requestCloud({
      api: url,
      data: postData,
      version,
      success(data) {
        try {
          const res = typeof data === 'string' ? JSON.parse(data) : data;
          console.log(
            `API 请求成功: %c${url}%o`,
            sucStyle,
            '请求参数：',
            postData,
            '接口结果：',
            res
          );
          resolve(res);
        } catch (e) {
          console.log(`success API 请求失败: %c${url}%o`, errStyle, data);
          resolve(data);
        }
      },
      fail({ errorMsg }) {
        try {
          const e = typeof errorMsg === 'string' ? JSON.parse(errorMsg) : errorMsg;
          console.log(`fail API 请求失败: 参数：`, postData);
          console.log(`fail API 请求失败: %c${url}%o`, errStyle, e);
          reject(e);
        } catch (err) {
          console.log(`fail API 请求失败: 参数：`, postData);
          console.log(`fail API 请求失败: %c${url}%o`, errStyle, errorMsg);
          reject(errorMsg);
        }
      },
    });
  });
}

const { timezone } = utils;
const anonymousName = getAnonymityNameStr();

const DEFAULT_CATEGORY = 'category_timer';

interface ITimerParams {
  category: string;
  loops: string;
  instruct: string;
  aliasName: string;
  bizId?: string;
  bizType?: 0 | 1; // 设备定时或设备组定时
  timeZone?: string;
  isAppPush?: boolean;
  actionType?: 'device' | 'device_group';
  options?: any;
}

/**
 * 添加定时
 * 支持群组定时
 */
export const addTimer = (loops: string, instruct: any, _params?: any) => {
  const params = {
    ...(_params || {}),
    loops: loops,
    instruct: instruct,
  };
  // eslint-disable-next-line no-param-reassign
  const { groupId: devGroupId, devId } = getDevId();
  const defaultParams: ITimerParams = {
    category: DEFAULT_CATEGORY,
    bizId: devGroupId || devId,
    bizType: devGroupId ? 1 : 0,
    timeZone: timezone(),
    isAppPush: false,
    actionType: devGroupId ? 'device_group' : 'device',
    options: {
      checkConflict: 1,
    },
    loops: '0000000',
    instruct: '',
    aliasName: '',
  };
  const postData = { ...defaultParams, ...params };
  // tuya.m.timer.group.add
  return api(anonymousName + '.m.timer.group.add', postData, '4.0');
};

interface IEditTimerParams extends ITimerParams {
  groupId: string;
}
/**
 * 更新定时
 * 支持群组定时
 */
export const updateTimer = (id: number, loops: string, instruct: any, _params?: any) => {
  // eslint-disable-next-line no-param-reassign
  const { groupId: devGroupId, devId } = getDevId();
  const params = {
    ...(_params || {}),
    loops: loops,
    instruct: instruct,
    groupId: id,
  };
  const defaultParams: IEditTimerParams = {
    bizId: devGroupId || devId,
    bizType: devGroupId ? 1 : 0,
    timeZone: timezone(),
    isAppPush: false,
    actionType: devGroupId ? 'device_group' : 'device',
    groupId: '',
    loops: '0000000',
    instruct: '',
    aliasName: '',
    options: {
      checkConflict: 1,
    },
    category: DEFAULT_CATEGORY,
  };
  const postData = { ...defaultParams, ...params };
  // tuya.m.timer.group.update
  return api(anonymousName + '.m.timer.group.update', postData, '4.0');
};

// 修改定时开启状态
export const changeTimerStatus = (id: string | number, status: 0 | 1) => {
  const { groupId: devGroupId, devId } = getDevId();
  const postData = {
    type: devGroupId ? 'device_group' : 'device',
    bizId: devGroupId || devId,
    category: DEFAULT_CATEGORY,
    groupId: id,
    status, // !power ? 1 : 0
  };
  // tuya.m.timer.group.status.update
  return api(anonymousName + '.m.timer.group.status.update', postData, '2.0');
};

/**
 * 删除单个云定时
 * @param id 定时id
 * @returns
 */
export const removeCloudTimer = (id: string): Promise<any> => {
  const { groupId: devGroupId, devId } = getDevId();
  const postData = {
    type: devGroupId ? 'device_group' : 'device',
    bizId: devGroupId || devId,
    groupId: id,
    category: DEFAULT_CATEGORY,
  };
  // tuya.m.timer.group.remove
  return api(anonymousName + '.m.timer.group.remove', postData, '2.0');
};

export const getTimerList = () => {
  const { groupId: devGroupId, devId } = getDevId();
  const postData = {
    type: devGroupId ? 'device_group' : 'device',
    bizId: devGroupId || devId,
    category: DEFAULT_CATEGORY,
  };
  return new Promise((resolve, reject) => {
    // tuya.m.timer.group.list
    api(anonymousName + '.m.timer.group.list', postData, '2.0')
      .then(res => {
        const { groups = [] } = res;
        const timerList = groups.map(i => {
          const { id, timers = [] } = i;
          return {
            ...timers[0],
            id,
          };
        });
        resolve(timerList);
      })
      .catch(() => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject([]);
      });
  });
};

export const TimerApi = {
  getTimerList,
  changeTimerStatus,
  updateTimer,
  addTimer,
  removeCloudTimer,
};
