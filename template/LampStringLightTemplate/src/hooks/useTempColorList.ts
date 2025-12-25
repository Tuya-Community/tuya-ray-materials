import { CLOUD_KEY_MYTEMPCOLORS } from '@/constant';
import { useCloudStorageList } from './useCloudStorageList';
import { useMemo } from 'react';
import { getArray, splitArray } from '@/utils/kit';

export type TempColorItem = {
  id: number;
  temp: number;
  name: string;
};

export const parseTempColorItem = (item: { id: number; val: string }): TempColorItem => {
  const [name, temp] = item.val.split('_');
  return {
    id: item.id,
    temp: +temp,
    name,
  } as TempColorItem;
};

export const useTempColorList = () => {
  // name_temp
  const storage = useCloudStorageList(CLOUD_KEY_MYTEMPCOLORS);

  const list = useMemo(() => {
    return getArray(storage?.list)
      .sort((a, b) => b.id - a.id)
      .map(parseTempColorItem);
  }, [storage.list]);

  const updateItem = (id: number, item: Omit<TempColorItem, 'id'>) => {
    return storage.updateItem(id, `${item.name}_${item.temp}`);
  };

  return {
    list,
    storage,
    updateItem,
  };
};
