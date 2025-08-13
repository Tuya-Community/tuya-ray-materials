import { setStorage, getStorage } from '@ray-js/ray';
import Strings from '../i18n';

export const setStorageItem = (storageKey: string, value: any) => {
  const data = { value, type: typeof value };
  const jsonValue = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    setStorage({
      key: storageKey,
      data: jsonValue,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

export const getStorageItem = (storageKey: string) => {
  return new Promise((resolve, reject) => {
    getStorage({
      key: storageKey,
      success: ({ data }) => {
        if (data) {
          resolve(JSON.parse(data)?.value);
        }
        resolve(null);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};
