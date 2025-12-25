import { CLOUD_KEY_DIY_SCENE_P } from '@/constant';
import { useCloudStorageList } from './useCloudStorageList';
import { useMemo } from 'react';
import { getArray, isJSON } from '@/utils/kit';
import { protocols } from '@/devices/protocols';
import { DiySceneData } from '@/devices/protocols/DiySceneFormatter';
import { SceneData } from '@/constant/type';

export type DrawToolItem = {
  id: number;
  name: string;
  data: DiySceneData;
};

export const encodeCloudSceneData = (data: SceneData | DiySceneData) => {
  if ('colors' in data) {
    return JSON.stringify(data);
  }
  if ('segments' in data) {
    return `${data?.name}_${protocols.diy_scene.formatter(data)}`;
  }
  return '';
};

export const decodeCloudSceneData = (val: string) => {
  if (isJSON(val)) {
    const ret = JSON.parse(val) as SceneData;
    return {
      type: 'scene' as const,
      ret,
      raw: '',
    };
  }

  if (typeof val === 'string') {
    const [name, raw] = val ? val.split('_') : [];
    const ret = {
      name,
      ...(protocols.diy_scene.parser(raw) || {}),
    } as DiySceneData;
    return {
      type: 'draw' as const,
      ret,
      raw,
    };
  }
};

export const useCloudDrawToolList = () => {
  // raw
  const storage = useCloudStorageList(CLOUD_KEY_DIY_SCENE_P);

  const list = useMemo(() => {
    return getArray(storage?.list)
      .sort((a, b) => b.id - a.id)
      .map(item => {
        const [name, raw] = item.val ? item.val.split('_') : [];
        return {
          id: item.id,
          name,
          data: protocols.diy_scene.parser(raw),
        } as DrawToolItem;
      });
  }, [storage.list]);

  const updateItem = (id: number, item: Omit<DrawToolItem, 'id'>) => {
    const raw = protocols.diy_scene.formatter(item?.data);
    return storage.updateItem(id, `${item.name}_${raw}`);
  };

  const addItem = (item: Omit<DrawToolItem, 'id'>) => {
    const raw = protocols.diy_scene.formatter(item?.data);
    return storage.addItem(`${item.name}_${raw}`);
  };

  return {
    ...storage,
    list,
    updateItem,
    addItem,
  };
};
