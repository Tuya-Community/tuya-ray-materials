import { useEffect } from 'react';

import { getArray, isNotNullOrUndefined } from '@/utils/kit';

import { useAsync } from './useAsync';
import { useProperty } from './useProperty';

const getId = (code: string) => (code ? code.split('_').pop() : 0);

// 分片存放
// storeKey: key1,key2
// storeKey_1: val
// storeKey_2: val
export const useCloudStorageCombinedList = (
  storeKey: string,
  options?: {
    idStart?: number;
  }
) => {
  const property = useProperty({ code: storeKey, getAll: true });

  const {
    data: list,
    run: refresh,
    loading,
  } = useAsync(async () => {
    const result = await property.cache.get();

    const list = getArray(result).filter(
      item => item.code !== storeKey && item.code.startsWith(storeKey)
    );
    console.log('[storage] list', storeKey, list);
    return list.map(item => {
      const id = +item.code.replace(`${storeKey}_`, '');
      return {
        id,
        value: item.value,
      };
    });
  }, [storeKey]);

  useEffect(() => property.cache.subscribe(refresh), [storeKey]);

  const getNextId = async (result?) => {
    if (!result) {
      await property.cache.clear();
      result = await property.cache.get();
    }
    const list = getArray(result).filter(
      item => item.code !== storeKey && item.code.startsWith(storeKey)
    );

    const newList = getArray(list).sort((a, b) => {
      const aId = +getId(a.code);
      const bId = +getId(b.code);
      return aId - bId;
    });

    let nextId = getArray(list).length;
    if (newList.length > 0) {
      const lastCode = newList[newList.length - 1].code;
      nextId = +getId(lastCode) + 1;
    }

    const idStart = options?.idStart || 0;
    if (nextId < idStart) {
      nextId = idStart;
    }

    return nextId;
  };

  const { run: addItem } = useAsync(
    async (newItem: string, ops?: { dedup?: (a: string, b: string) => boolean }) => {
      const dedup = ops?.dedup;

      await property.cache.clear();
      const result = await property.cache.get();
      const nextId = await getNextId(result);

      const key = `${storeKey}_${nextId}`;

      if (dedup) {
        const hasItem = !!getArray(result).find(item => dedup(item.value, newItem));
        if (hasItem) {
          return;
        }
      }

      await property.cache.set([
        ...getArray(result),
        {
          code: key,
          value: newItem,
        },
      ]);
      console.log('[storage] addItem success', key, newItem);

      return nextId;
    },
    [storeKey],
    {
      manual: true,
    }
  );

  const { run: updateItem } = useAsync(
    async (id: number, newItem: string) => {
      await property.cache.clear();
      const result = await property.cache.get();
      const key = `${storeKey}_${id}`;
      const target = getArray(result).find(item => item.code === key);
      if (target) {
        target.value = newItem;
      }
      await property.cache.set([...getArray(result)]);
      console.log('[storage] updateItem success', key, target);

      return result;
    },
    [storeKey],
    {
      manual: true,
    }
  );

  const { run: delItem } = useAsync(
    async (id: number) => {
      await property.cache.clear();
      const result = await property.cache.get();
      const key = isNotNullOrUndefined(id) ? `${storeKey}_${id}` : storeKey;

      await property.del(key);
      property.cache.setIsOld();
      property.cache.dispatch();

      console.log('[storage] delItem', key, id);
      return result;
    },
    [storeKey],
    {
      manual: true,
    }
  );

  return {
    list,
    loading,
    refresh,
    addItem,
    delItem,
    updateItem,
    getNextId,
  };
};
