import { devices } from '@/devices';
import { DiffAsyncValue, DiffValueOps } from '@/utils/DiffValue';
import { getIsOnNetWork } from '@/utils/getIsOnNetWifi';
import { getLocalStorage } from '@/utils/localstorage';

export const getDiffValueCache = (storeKey: string, defaultValue?: any) => {
  return DiffAsyncValue.getCache(storeKey, defaultValue, {
    async clear() {
      const LocalStorage = await getLocalStorage();
      await LocalStorage.delete(storeKey);
    },
    fetch: async () => {
      // 优先读本地
      const LocalStorage = await getLocalStorage();
      const hasKey = await LocalStorage.hasKey(storeKey);
      if (hasKey) {
        return LocalStorage.get(storeKey);
      }

      try {
        const isOnline = await getIsOnNetWork();
        console.log('isOnline', isOnline);

        if (isOnline) {
          const res = await devices.common.model.abilities.storage.get(storeKey);
          await LocalStorage.set(storeKey, res?.data?.value);
          return res?.data?.value;
        }
      } catch (error) {
        console.log(error);
      }
    },
    push: async val => {
      // 优先设置本地
      const LocalStorage = await getLocalStorage();
      await LocalStorage.set(storeKey, val);

      try {
        const isOnline = await getIsOnNetWork();
        if (isOnline) {
          await devices.common.model.abilities.storage.set(storeKey, val);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
};

export const getDiffValueCacheByOps = (
  storeKey: string,
  defaultValue: any,
  ops: DiffValueOps<any>
) => {
  return DiffAsyncValue.getCache(storeKey, defaultValue, ops);
};
