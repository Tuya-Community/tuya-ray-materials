import { useEffect, useMemo } from 'react';

import { getDiffValueCache } from '@/devices/cache';
import { getArray } from '@/utils/kit';

import { useAsync } from './useAsync';
import { generateUUID } from '@/utils/utils';

type List = Array<{ id: number; val: string }>;

const parseD = (d: string): List => {
  if (/:/.test(d)) {
    return d.split(';').map(str => {
      const [id, val] = str.split(':');
      return {
        id: +id,
        val,
      };
    });
  }
  return [];
};

const formatD = (list: List) =>
  getArray(list)
    .map(item => `${item.id}:${item.val}`)
    .join(';');

export const useCloudStorageList = (storeKey: string) => {
  const valCached = useMemo(() => getDiffValueCache(storeKey), [storeKey]);

  const {
    data: list,
    run: refresh,
    loading,
  } = useAsync(async () => {
    const d = await valCached.get();
    console.log('[storage] list', storeKey, d);

    if (/:/.test(d)) {
      const ret = parseD(d);
      if (Array.from(new Set(ret.map(item => item.id))).length !== ret.length) {
        console.warn('error occurred');
      }
      return ret;
    }
    return [];
  }, [storeKey, valCached]);

  useEffect(() => valCached.subscribe(refresh), [storeKey, valCached]);

  const { run: addItem } = useAsync(
    async (...newItems: string[]) => {
      const list = await forceRefresh();
      let newList = getArray(list).sort((a, b) => a.id - b.id);
      for (const newItem of newItems) {
        const nextId = generateUUID(newList.map(item => item.id));
        newList = newList.concat({
          id: nextId,
          val: newItem,
        });
      }
      const result = await valCached.set(formatD(newList));
      console.log('[storage] addItem', storeKey, newList);
      return result;
    },
    [valCached.get(), storeKey, valCached],
    {
      manual: true,
    }
  );

  const { run: updateItem } = useAsync(
    async (id: number, newItem: string) => {
      const list = await forceRefresh();
      const current = getArray(list);
      const target = current.find(item => +item.id === +id);
      if (target) {
        target.val = newItem;
        const result = await valCached.set(formatD(list));
        console.log('[storage] addItem', storeKey, list);
        return result;
      }
    },
    [valCached.get(), storeKey, valCached],
    {
      manual: true,
    }
  );

  const { run: delItem } = useAsync(
    async (id: number) => {
      const list = await forceRefresh();
      const result = await valCached.set(formatD(getArray(list).filter(item => item.id !== id)));
      console.log('[storage] delItem', storeKey, id);
      return result;
    },
    [valCached.get(), storeKey, valCached, list],
    {
      manual: true,
    }
  );

  const forceRefresh = async () => {
    await valCached.clear();
    return refresh();
  };

  return {
    list,
    loading,
    refresh,
    forceRefresh,
    addItem,
    delItem,
    updateItem,
  };
};
