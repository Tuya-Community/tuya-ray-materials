import { getStorage, removeStorage, setStorage } from '@ray-js/ray';

import { getDevId } from '..';

const devId = getDevId();

export default {
  async setItem(key: string, value: any) {
    const data = { value, type: typeof value };
    const jsonValue = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      setStorage({
        key,
        data: jsonValue,
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        },
      });
    });
  },
  async setDevItem(name: string, value: any) {
    return this.setItem(`${devId}${name}`, value);
  },
  async getItem(key: string) {
    return new Promise((resolve, reject) => {
      getStorage({
        key,
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
  },
  async getDevItem(name: string) {
    return this.getItem(`${devId}${name}`);
  },
  async removeItem(key: string) {
    return new Promise((resolve, reject) => {
      removeStorage({
        key,
        success: () => {
          resolve(null);
        },
        fail: err => {
          reject(err);
        },
      });
    });
  },

  async removeDevItem(name: string) {
    return this.removeItem(`${devId}${name}`);
  },
};
