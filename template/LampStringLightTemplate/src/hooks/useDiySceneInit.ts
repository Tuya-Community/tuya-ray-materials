import { useCallback, useMemo } from 'react';

import { CLOUD_KEY_DIY_SCENE, CLOUD_KEY_SCENE_DIY_ID } from '@/constant';
import { getArray, splitArray } from '@/utils/kit';
import { useActions, useProps } from '@ray-js/panel-sdk';

import { decodeCloudSceneData } from './useCloudDrawToolList';
import { useCloudStorageCombinedList } from './useCloudStorageCombinedList';
import { useCloudStorageKey } from './useCloudStorageKey';
import { useCutDrawDiySceneSet } from './useCutDrawDiyScene';
import { useSceneSet } from './useSceneSet';

export const useDiySceneInit = () => {
  const {
    value: current,
    setValue: setCurrent,
    inited,
  } = useCloudStorageKey(CLOUD_KEY_SCENE_DIY_ID, {
    defaultValue: '-1',
  });
  const switch_led = useProps(props => props.switch_led);
  const storage = useCloudStorageCombinedList(CLOUD_KEY_DIY_SCENE);

  const diySceneList = useMemo(
    () =>
      splitArray(
        getArray(storage.list)
          .sort((a, b) => b.id - a.id)
          .map(item => {
            const props = decodeCloudSceneData(item.value);
            return {
              dataId: item.id,
              data: props?.ret || {},
              cloudType: props.type,
            };
          }),
        2
      ),
    [storage.list]
  );

  const isNil = diySceneList.length === 0;

  const actions = useActions();
  const cutDrawDiySceneSet = useCutDrawDiySceneSet();

  const sceneApi = useSceneSet({
    notSetSceneMode: true,
  });

  const initDiyScene = useCallback(() => {
    if (!inited) return;
    if (!switch_led) return;
    console.log('init diy', current);
    if (current) {
      if (+current !== -1) {
        const item = getArray(storage.list).find(item => +item.id === +current);
        if (item?.value) {
          const props = decodeCloudSceneData(item?.value);
          if (props.type === 'scene') {
            sceneApi.set(props.ret);
            actions.work_mode.set('scene');
            setCurrent(String(item?.id));
          }
          if (props.type === 'draw') {
            cutDrawDiySceneSet(props?.ret);
            setCurrent(String(item?.id));
          }
        }
      } else {
        const item = getArray(storage.list)[0];
        if (item?.value) {
          const props = decodeCloudSceneData(item?.value);
          if (props.type === 'scene') {
            sceneApi.set(props.ret);
            actions.work_mode.set('scene');
            setCurrent(String(item?.id));
          }
          if (props.type === 'draw') {
            cutDrawDiySceneSet(props?.ret);
            setCurrent(String(item?.id));
          }
        }
      }
    }
  }, [current, storage.list, switch_led, inited]);

  return {
    initDiyScene,
    isNil,
    diySceneList,
    current,
    setCurrent,
    storage,
    inited,
  };
};

export type UseDiySceneInitApi = ReturnType<typeof useDiySceneInit>;
