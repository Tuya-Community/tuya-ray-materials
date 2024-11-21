export { default as storage } from './storage';
export { diff } from './diff';

interface Options {
  request: any;
  storage: {
    getItem: (key: string) => any;
    setItem: (key: string, value: any) => void;
    removeItem: (key: string) => void;
    clear: () => void;
  };
}

// 优先获取本地数据，云端数据请求
export class ApiCache {
  map: any;
  storage: {
    getItem: (key: string) => any;
    setItem: (key: string, value: any) => void;
    removeItem: (key: string) => void;
    clear: () => void;
  };

  request: any;
  _oldRequest: any;
  constructor(options: Options) {
    const { request, storage } = options;
    this.map = {};
    this.request = request;
    this.storage = storage;
  }

  storageGet = async key => {
    const res = await this.storage.getItem(key);
    return res;
  };

  storageSet = (key, val) => {
    this.storage.setItem(key, val);
  };

  init = (prefix: string) => {
    this._oldRequest = this.request;
    this.request = async (apiLink, apiData, apiVersion, cache = false) => {
      if (!cache) {
        return this._oldRequest(apiLink, apiData, apiVersion);
      }
      let data;
      const key = `${prefix || ''}${apiLink}_${apiVersion}`;
      try {
        data = await this.storageGet(key);
      } catch (e) {
        console.log(e, 'e ====');
      }
      return new Promise((resolve, reject) => {
        resolve({
          data,
          promiseFn: async () => {
            const res = await this._oldRequest(apiLink, apiData, apiVersion);
            this.storageSet(key, res);
            return res;
          },
        });
      });
    };
  };

  start = (prefix: string) => {
    this.init(prefix);
    return this.request;
  };
}

export default ApiCache;
