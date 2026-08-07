import { JsonUtil } from '@/utils/jsonUtil';
import { isCacheValid, parseCacheData, requestCache } from '@/utils/requestCache';
import { isEqual } from 'lodash-es';
import Strings from '@/i18n';

const normalizeError = (err: unknown) => {
  const e = typeof err === 'string' ? JsonUtil.parseJSON(err) : err;
  let errText = (e as any)?.message || (e as any)?.errorMsg || e;
  if ((e as any)?.errorCode && Strings[(e as any)?.errorCode]) {
    errText = Strings.getLang((e as any)?.errorCode);
  }
  return { e, errText };
};

/** 为 SDK Promise 补齐与原先 Highway 请求一致的错误 Toast */
export const withRequestErrorToast = async <T>(
  promise: Promise<T>,
  hideErrorToast = false
): Promise<T> => {
  try {
    return await promise;
  } catch (err) {
    const { e, errText } = normalizeError(err);
    if (errText !== 'request error' && !hideErrorToast) {
      ty.showToast({ title: String(errText), icon: 'error' });
    }
    throw e;
  }
};

/** SDK 请求 + 本地缓存（行为对齐原 universalRequestWithCache） */
export const requestPromiseWithCache = <T>(
  cacheSeed: string,
  data: Record<string, any> | undefined,
  request: () => Promise<T>,
  opts?: { onUpdate?: (data: T) => void }
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const cacheKey = requestCache.generateKey(cacheSeed, { data: data || {} });
    let initialCacheData: T | undefined;
    let isResolved = false;

    requestCache
      .getCache(cacheKey)
      .then(res => {
        const cacheInfo = parseCacheData(res);
        if (!cacheInfo) {
          return;
        }
        const { data: cached, timeStamp, expire } = cacheInfo;
        if (!isCacheValid(timeStamp, expire)) {
          return;
        }
        initialCacheData = cached as T;
        if (!isResolved) {
          isResolved = true;
          resolve(cached as T);
        }
      })
      .catch(() => {});

    withRequestErrorToast(request())
      .then(result => {
        const hasUpdate = initialCacheData !== undefined && !isEqual(result, initialCacheData);
        if (hasUpdate || initialCacheData === undefined) {
          requestCache.setCache(cacheKey, result).catch(() => {});
        }
        if (hasUpdate) {
          opts?.onUpdate?.(result);
        }
        if (!isResolved) {
          isResolved = true;
          resolve(result);
        }
      })
      .catch(err => {
        if (!isResolved) {
          isResolved = true;
          reject(err);
        }
      });
  });
};
