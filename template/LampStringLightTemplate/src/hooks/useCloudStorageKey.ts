import { useEffect, useMemo, useState } from 'react';

import { getDiffValueCache } from '@/devices/cache';

import { useAsync } from './useAsync';
import { isNotNullOrUndefined } from '@/utils/kit';

export interface Options<T> {
  defaultValue?: string;
  map?: (val: string) => T;
  onGet?(val: any): any;
}

export const useCloudStorageKey = <T = string>(
  storeKey: string,
  options: Options<T> = {} as any
) => {
  const map = options?.map;

  const valCached = useMemo(
    () => getDiffValueCache(storeKey, options.defaultValue),
    [storeKey, options?.defaultValue]
  );

  let inited = false;

  const {
    data,
    run: refresh,
    loading,
  } = useAsync(async () => {
    const res = await valCached.get();
    if (options?.onGet) {
      options.onGet(res);
    }
    return { res, inited: true };
  }, [storeKey, valCached]);
  const value = data?.res;
  if (data?.inited) {
    inited = true;
  }

  useEffect(() => valCached.subscribe(refresh), [storeKey, valCached]);

  const { run: setValue, data: newVal } = useAsync(
    async (value: string, dispatch = true) => {
      await valCached.set(value, dispatch);
      return value;
    },
    [valCached.get(), storeKey, valCached],
    {
      manual: true,
    }
  );

  return {
    inited,
    value: map
      ? map(newVal || value || options?.defaultValue)
      : newVal || value || options?.defaultValue,
    loading,
    setValue,
  };
};
