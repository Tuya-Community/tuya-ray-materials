/* eslint-disable prefer-destructuring */
import { devices } from '@/devices';
import { saveDevProperty, getDeviceProperty, setDeviceProperty } from '@ray-js/ray';
import { useAsync } from './useAsync';
import { dedup, getArray } from '@/utils/kit';
import { useMemo } from 'react';
import { getDiffValueCacheByOps } from '@/devices/cache';
import { getIsOnNetWifi, getIsOnNetWork } from '@/utils/getIsOnNetWifi';
import { getLocalStorage } from '@/utils/localstorage';

export interface UsePropertyOps {
  code: string;
  getAll?: boolean;
}

export interface DeviceProperty {
  /**
   * 设备自定义属性 key，最长 30 字节（"device_favorite"为系统保留 code，请勿使用）
   */
  code: string;
  /**
   * 设备自定义属性内容,最长 1024 字节
   */
  value: string;
}

export interface GetDevPropertyOps {
  devId: string;
  bizType: number;
  code?: string;
}

const getDevProperty = (params: GetDevPropertyOps) =>
  new Promise<any>((resolve, reject) => {
    getDeviceProperty({
      deviceId: params.devId,
      success: resolve,
      fail: reject,
    });
  });

export interface RemoveDevPropertyOps {
  devId: string;
  code: string;
  bizType: number;
}

const DELETE_TAG = '__deleted__';

export const useProperty = ({ code, getAll = false }: UsePropertyOps) => {
  const devInfo = devices.common.getDevInfo();
  // @ts-ignore
  const devId = devInfo.devId;
  // @ts-ignore
  const groupId = devInfo.groupId;

  const { run: _get } = useAsync(
    async (key?: string, _getAll = getAll) => {
      const LocalStorage = await getLocalStorage();

      let localData = [];
      if (_getAll) {
        const res = await LocalStorage.get();
        localData = Object.keys(res || {})
          .map(key => ({ code: key, value: res[key] }))
          .filter(item => item.value !== DELETE_TAG);
      } else {
        const item = await LocalStorage.get(key);
        localData = [item];
      }

      let cloudData = [];

      const isOnline = await getIsOnNetWork();
      if (isOnline) {
        try {
          const res1 = await getDevProperty({
            devId: groupId || devId,
            bizType: groupId ? 1 : 0,
          });
          const res = res1.properties || {};
          if (_getAll) {
            cloudData = Object.keys(res || {})
              .map(key => ({ code: key, value: res[key] }))
              .filter(item => item.value !== DELETE_TAG);
          }
          if (getArray<any>(res as any).length > 0) {
            const items = getArray<DeviceProperty>(res as any);
            if (key) {
              const item = items.find(item => item.code === key);
              cloudData = [item];
            }
            cloudData = items;
          }
        } catch (error) {
          console.warn(error, 'errorerrorerror');
        }
      }

      return dedup(getArray(localData).concat(cloudData), (a, b) => a.code === b.code).filter(
        item => item.value !== DELETE_TAG
      );
    },
    [code, getAll],
    {
      manual: true,
    }
  );

  function get(): Promise<DeviceProperty[]>;
  function get(key?: string): Promise<DeviceProperty>;
  function get(key?: string, getAll?: boolean): Promise<DeviceProperty[]>;
  function get(key?: string, getAll?: boolean): Promise<DeviceProperty | DeviceProperty[]> {
    return _get(key, getAll);
  }

  const { run: set } = useAsync(
    async (list: DeviceProperty[]) => {
      const LocalStorage = await getLocalStorage();

      await LocalStorage.setObj(
        getArray(list).reduce((acc, cur) => ({
          ...acc,
          [cur.code]: cur.value,
        }))
      );

      const isOnline = await getIsOnNetWifi();
      if (isOnline) {
        await saveDevProperty({
          devId: groupId || devId,
          bizType: groupId ? 1 : 0,
          propertyList: JSON.stringify(list),
        });
      }
    },
    [code],
    {
      manual: true,
    }
  );

  const { run: del } = useAsync(
    async (code: string) => {
      const LocalStorage = await getLocalStorage();
      const hasKey = await LocalStorage.hasKey(code);

      if (hasKey) {
        await LocalStorage.delete(code);
      }

      const isOnline = await getIsOnNetWork();
      if (isOnline) {
        const list = await get(null, true);
        const newList = getArray(list).map(item => ({
          ...item,
          value: item.code === code ? DELETE_TAG : item.value,
        }));
        await set(newList);

        await setDeviceProperty({
          deviceId: groupId || devId,
          code,
          value: DELETE_TAG,
        });
      }
    },
    [code],
    {
      manual: true,
    }
  );

  const cache = useMemo(
    () =>
      getDiffValueCacheByOps(code, [] as DeviceProperty[], {
        fetch: get,
        push: set,
        async clear() {
          const LocalStorage = await getLocalStorage();
          await LocalStorage.delete(code);
        },
      }),
    [code]
  );

  return {
    get,
    set,
    del,
    cache,
  };
};
