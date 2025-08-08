import { THING, getStorageSync, getSystemInfoSync, requestCloud, setStorageSync } from '@ray-js/ray';
import i18n from './index';

const cacheKey = 'tuya_i18n_data';

export const syncI18n = async (pid: string) => {
  // 先从缓存中获取，如果有数据，则直接返回数据，如果没有，则等待从云端获取
  const cache = getStorageSync({ key: cacheKey }) as any;
  if (cache?.pid === pid) {
    // 使用缓存
    i18n.mergeLanguage(i18n.strings, cache.data);
    i18n.setLanguage(i18n.__language);
    // 依然去拉取最新的，确保多语言的更新
    requestCloud({
      api: `${THING}.m.i18n.get`,
      version: '1.0',
      data: { productId: pid, moduleName: 'h5', endId: 2, osId: 0 },
    }).then((data) => {
      setStorageSync({ key: cacheKey, data: { pid, data } });
    });
    return;
  }

  const data: any = await requestCloud({
    api: `${THING}.m.i18n.get`,
    version: '1.0',
    data: { productId: pid, moduleName: 'h5', endId: 2, osId: 0 },
  });
  setStorageSync({ key: cacheKey, data: { pid, data } });
  i18n.mergeLanguage(i18n.strings, data);
  i18n.setLanguage(i18n.__language);
};
