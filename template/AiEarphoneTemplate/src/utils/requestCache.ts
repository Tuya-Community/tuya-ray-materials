import { tttSetStorage, tttGetStorage, tttRemoveStorage, tttClearStorage } from '@/api/ttt';
import { JsonUtil } from './index';

/**
 * 接口缓存管理类
 */
class RequestCache {
  // 缓存过期时间（默认1小时）
  private defaultExpire = 3600 * 1000;

  /**
   * 生成缓存Key（URL + 参数序列化，避免同接口不同参数缓存冲突）
   * @param url 接口地址
   * @param params 请求参数
   */
  generateKey(url: string, params: Record<string, any> = {}): string {
    const serializedParams = JSON.stringify(params);
    return `${url}_${serializedParams}`;
  }

  /**
   * 设置缓存
   * @param key 缓存Key
   * @param data 缓存数据
   * @param expire 过期时间（ms）
   */
  setCache(key: string, data: any, expire = this.defaultExpire): Promise<any> {
    return new Promise((resolve, reject) => {
      const cache = {
        data,
        timeStamp: Date.now(),
        expire,
      };
      tttSetStorage(key, JSON.stringify(cache))
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * 获取缓存
   * @param key 缓存Key
   */
  getCache(key: string): Promise<any> {
    return tttGetStorage(key);
  }

  /**
   * 检查缓存是否存在
   * @param key 缓存Key
   * @returns Promise<boolean> 是否存在缓存
   */
  hasCache(key: string): Promise<boolean> {
    return new Promise(resolve => {
      tttGetStorage(key)
        .then((res: any) => {
          // 如果成功获取到数据，检查数据是否有效
          if (res && res.data) {
            try {
              const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
              if (parsed && typeof parsed === 'object' && parsed.data !== undefined) {
                resolve(true);
                return;
              }
            } catch {
              // 解析失败，认为缓存无效
            }
          }
          resolve(false);
        })
        .catch((e) => {
          // 获取失败，认为不存在缓存
          console.error('RequestCache.hasCache get storage failed:', e);
          resolve(false);
        });
    });
  }

  /**
   * 移除指定缓存
   * @param key 缓存Key
   */
  removeCache(key: string): Promise<any> {
    return tttRemoveStorage(key);
  }

  /**
   * 清空所有缓存
   */
  clearAllCache(): Promise<any> {
    return tttClearStorage();
  }
}

// 单例导出，全局共用一份缓存
export const requestCache = new RequestCache();

/**
 * 解析缓存数据
 */
export const parseCacheData = (res): { data: any; timeStamp: number; expire: number } | null => {
  if (!res?.data) {
    return null;
  }

  let parsed;
  try {
    parsed = typeof res.data === 'string' ? JsonUtil.parseJSON(res.data) : res.data;
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const { data, timeStamp, expire } = parsed;
  if (data === undefined || typeof timeStamp !== 'number' || typeof expire !== 'number') {
    return null;
  }

  return { data, timeStamp, expire };
};

/**
 * 验证缓存是否有效
 */
export const isCacheValid = (timeStamp: number, expire: number): boolean => {
  return Date.now() - timeStamp < expire;
};
