/* eslint-disable lines-between-class-members */
import { devices } from '@/devices';
import { getStorage, setStorage } from '@ray-js/ray';

const cacheMap = new Map();

export class LocalStorageCtor {
  private KEY: string;
  private cachedData = null;

  constructor(key: string) {
    this.KEY = key;
    this.cachedData = cacheMap.get(key);
  }

  // 缓存获取数据
  private async getData() {
    if (this.cachedData === null) {
      const data = await this.get();
      this.cachedData = data || {};
    }
    return this.cachedData || {};
  }

  // 更新缓存数据
  private updateCache(newData: any) {
    this.cachedData = { ...(this.cachedData || {}), ...newData };
    cacheMap.set(this.KEY, this.cachedData);
  }

  // 合并存储对象
  async setObj(value: any) {
    const allVal = await this.getData(); // 获取缓存数据
    this.updateCache(value); // 更新缓存
    return new Promise((resolve, reject) => {
      setStorage({
        key: this.KEY,
        data: JSON.stringify({ ...allVal, ...value }),
        success: resolve,
        fail: reject,
      });
    });
  }

  // 设置单个键值对
  async set(key: string, value: any) {
    const allVal = await this.getData(); // 获取缓存数据
    allVal[key] = value; // 更新缓存数据
    this.updateCache(allVal); // 更新缓存

    return new Promise((resolve, reject) => {
      setStorage({
        key: this.KEY,
        data: JSON.stringify(allVal),
        success: resolve,
        fail: reject,
      });
    });
  }

  // 获取存储数据
  get(key?: string) {
    return new Promise<any>((resolve, reject) => {
      getStorage({
        key: this.KEY,
        success: res => {
          try {
            const allData = JSON.parse(res.data);
            resolve(key ? allData[key] : allData);
          } catch (error) {
            resolve(null);
          }
        },
        fail: () => {
          resolve(null);
        },
      });
    });
  }

  // 判断是否有某个键
  async hasKey(key: string) {
    const allData = await this.getData(); // 获取缓存数据

    if (allData) {
      return key in allData;
    }
    return false;
  }

  // 删除存储数据
  async delete(key: string) {
    const allVal = await this.getData(); // 获取缓存数据
    delete allVal[key]; // 删除缓存中的键
    this.updateCache(allVal); // 更新缓存
    return new Promise((resolve, reject) => {
      setStorage({
        key: this.KEY,
        data: JSON.stringify(allVal),
        success: resolve,
        fail: reject,
      });
    });
  }
}

export const getLocalStorage = async () => {
  const devInfo = devices.common.getDevInfo();
  // @ts-ignore
  const devId = devInfo?.devId;
  // @ts-ignore
  const groupId = devInfo?.groupId;

  // 这里的key用来隔离storage，具体的storeKey在key里
  return new LocalStorageCtor(`${groupId || devId}-storage`);
};
