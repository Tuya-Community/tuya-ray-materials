import { useCallback, useEffect, useState } from 'react';
import { devices } from '@/devices';
import { getLocalStorage } from '@/utils/localstorage';
import { getArray } from '@/utils/kit';

export const useGetStorageData = (key: string) => {
  const [storageData, setStorageData] = useState([]);
  useEffect(() => {
    const update = data => {
      setStorageData(data?.data?.value || null);
    };
    try {
      getLocalStorage().then(async local => {
        if (await local.hasKey(key)) {
          const ret = await local.get(key);
          console.log('[local] get', key, ret);
          update(ret);
          return;
        }

        await devices.common.model.abilities.storage
          .get(key)
          .then(res => {
            update(res);
            local.set(key, res);
          })
          .catch(err => {
            console.log(err);
          });
      });
    } catch (e) {
      console.warn('storage ability exception, please refer to the document configuration');
      throw new Error('getStorageData error', e);
    }
  }, [key]);
  return [storageData];
};

let cachedStorageData = [];

export const useSetStorageData = (key: string): [(data: any) => void, any] => {
  const [storageData, setStorageData] = useState(cachedStorageData);
  const update = useCallback(
    storageData => {
      try {
        getLocalStorage().then(async local => {
          console.log('[local] set', key, JSON.stringify(storageData).slice(0, 30));
          storageData?.length && setStorageData(storageData);
          storageData?.length && (cachedStorageData = storageData);
          await local.set(key, storageData);

          await devices.common.model.abilities.storage
            .set(key, storageData)
            .then(() => {
              storageData?.length && setStorageData(storageData);
              storageData?.length && (cachedStorageData = storageData);
            })
            .catch(err => {
              console.log(err);
            });
        });
      } catch (e) {
        console.warn('storage ability exception, please refer to the document configuration');
        throw new Error('setStorageData error', e);
      }
    },
    [key]
  );

  useEffect(() => {
    const update1 = data => {
      const nextData = Array.isArray(data) ? data : data?.data?.value || [];
      nextData?.length && setStorageData(nextData);
      nextData?.length && (cachedStorageData = nextData);
    };
    try {
      getLocalStorage().then(async local => {
        if (await local.hasKey(key)) {
          const res = await local.get(key);
          const nextData = Array.isArray(res) ? res : res?.data?.value || [];
          if (getArray(nextData).length > 0) {
            update1(nextData);
            return;
          }
        }
        devices.common.model.abilities.storage
          .get(key)
          .then(res => {
            res && update1(res);
            local.set(key, res);
          })
          .catch(err => {
            console.error(key, err);
          });
      });
    } catch (e) {
      console.warn('storage ability exception, please refer to the document configuration');
    }
  }, [key]);

  return [update, storageData];
};
