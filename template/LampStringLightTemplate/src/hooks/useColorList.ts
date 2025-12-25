import { CLOUD_KEY_MYCOLORS, CLOUD_KEY_MYTEMPCOLORS } from '@/constant';
import { useCloudStorageList } from './useCloudStorageList';
import { useMemo } from 'react';
import { getArray, splitArray } from '@/utils/kit';

export type ColorItem = {
  id: number;
  h: number;
  s: number;
  v: number;
};

export const useColorList = () => {
  // h_s
  const storage = useCloudStorageList(CLOUD_KEY_MYCOLORS);

  const list = useMemo(() => {
    return getArray(storage?.list)
      .sort((a, b) => b.id - a.id)
      .map(item => {
        const [h, s, v] = item.val ? item.val.split('_') : [];
        return {
          id: item.id,
          h: +h,
          s: +s,
          v: +v,
        };
      });
  }, [storage.list]);

  const updateItem = (id: number, item: Omit<ColorItem, 'id'>) => {
    return storage.updateItem(id, `${item.h}_${item.s}_${item.v}`);
  };

  return {
    list,
    storage,
    updateItem,
  };
};
