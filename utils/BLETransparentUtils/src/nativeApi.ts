import { device } from '@ray-js/ray';

type AnyFn = (...args: any) => any;

const { publishBLETransparentData } = device;

const nativeFnWrap = <T extends AnyFn>(nativeApi: T) => {
  return args => {
    return new Promise((resolve, reject) => {
      if (typeof nativeApi !== 'function') {
        setTimeout(() => {
          reject();
        }, 100);
        return;
      }
      nativeApi({
        ...args,
        success: data => {
          resolve(data);
        },
        fail: err => {
          reject(err);
        },
      });
    });
  };
};

/**
 * BLE(thing)下发透传数据, 基于 publishBLETransparentData 封装的异步函数
 * @param deviceId 设备 ID
 * @param data 透传数据
 * @returns Promise
 */
export const publishBLETransparentDataAsync = nativeFnWrap(publishBLETransparentData);
