import { useMemo, useRef } from 'react';

import { SceneData } from '@/constant/type';
import { getArray, splitArray } from '@/utils/kit';
import { useActions, useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';
import { useCloudStorageKey } from './useCloudStorageKey';
import { CLOUD_KEY_DIY_SCENE, CLOUD_KEY_SCENE_DIY_ID } from '@/constant';
import { useCloudStorageCombinedList } from './useCloudStorageCombinedList';
import { decodeCloudSceneData } from './useCloudDrawToolList';
import { DiySceneData } from '@/devices/protocols/DiySceneFormatter';

export interface UseSceneSetOps {
  notSetSceneMode?: boolean;
}

export const useSceneSet = ({ notSetSceneMode }: UseSceneSetOps = {}) => {
  const structuredActions = useStructuredActions();
  const actions = useActions();

  const scene_data = useStructuredProps(props => props.rgbic_linerlight_scene);

  const set = (scene: SceneData) => {
    if (getArray(scene?.colors).length === 0) return;

    if (notSetSceneMode) {
      // noop
    } else {
      actions.work_mode.set('scene');
    }
    return structuredActions.rgbic_linerlight_scene.set(scene);
  };

  const preview = async (scene: SceneData) => {
    if (getArray(scene?.colors).length > 0) {
      await set(scene);
    }
  };

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

  const { value: currentDiySceneId } = useCloudStorageKey(CLOUD_KEY_SCENE_DIY_ID, {
    defaultValue: '-1',
  });

  const cancelPreview = async () => {
    const lastSendData = getArray(diySceneList)
      .flat()
      .find(item => +item.dataId === +currentDiySceneId);

    const lastScene = lastSendData?.data;
    const lastType = lastSendData?.cloudType;
    if (lastScene && lastType === 'scene') {
      await actions.work_mode.set('scene');
      await structuredActions.rgbic_linerlight_scene.set(lastScene as SceneData);
    }

    if (lastScene && lastType === 'draw') {
      await structuredActions.diy_scene.set(lastScene as DiySceneData);
    }
  };

  return {
    diySceneList,
    currentDiySceneId,
    scene_data,
    set,
    preview,
    cancelPreview,
  };
};

export type SceneSetApi = ReturnType<typeof useSceneSet>;
