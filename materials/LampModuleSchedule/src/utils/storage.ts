/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDevId } from './devId';

const getDevKey = async (name: string) => {
  const { devId } = getDevId();
  return `${devId}_${name}`;
};

const _storage = {
  async setItem(key: string, value: any) {
    const data = { value, type: typeof value };
    const jsonValue = data;
    return new Promise((resolve, reject) => {
      ty.setStorage({
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
    const key = await getDevKey(name);
    return _storage.setItem(key, value);
  },
  async getItem(key: string) {
    return new Promise((resolve, reject) => {
      ty.getStorage({
        key,
        success: ({ data }) => {
          if (data) {
            let res = data;
            if (typeof data === 'string') {
              try {
                res = JSON.parse(data);
              } catch (err) {
                res = data;
              }
            }
            resolve(res?.value);
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
    const key = await getDevKey(name);
    return _storage.getItem(key);
  },
  async removeItem(key: string) {
    return new Promise((resolve, reject) => {
      ty.removeStorage({
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
    const key = await getDevKey(name);
    return _storage.removeItem(key);
  },
};

export default _storage;
