import store from '@/redux';
import { getDevInfo, setDeviceProperty } from '@ray-js/ray';
import mitt from 'mitt';

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

/**
 * 获取页面可用高度，单位 px
 */
export const getWrapperHeight = (topBarHeight = 44) => {
  const {
    statusBarHeight,
    screenHeight,
    useableWindowHeight = screenHeight,
  } = store.getState().systemInfo;

  return useableWindowHeight - statusBarHeight - topBarHeight;
};

/**
 * 获取 devId
 */
export const getDevId = () => getDevInfo().devId;

// 通过设备信息通用接口储存用户信息，清楚设备后数据自动清零
export const setDevProperty = (code: string, value: any) => {
  const devId = getDevId();

  const jsonString = typeof value === 'object' ? JSON.stringify(value) : value;
  return new Promise((resolve, reject) => {
    try {
      setDeviceProperty({
        deviceId: devId,
        code,
        value: jsonString,
        success: res => {
          resolve(res);
          console.log('setDevProperty---success', res, jsonString);
        },
        fail: e => {
          reject(e);
          console.log('setDevProperty---fail', e);
        },
      });
    } catch (e) {
      console.log('setDevProperty---catch', e);

      reject(e);
    }
  });
};
