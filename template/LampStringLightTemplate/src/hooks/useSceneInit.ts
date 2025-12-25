import { useEffect, useRef } from 'react';

import { getScenes } from '@/components/scene/scenes';
import { CLOUD_KEY_SCENE_ID } from '@/constant';
import { getArray } from '@/utils/kit';
import { useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';

import { useCloudStorageKey } from './useCloudStorageKey';

export const useSceneInit = () => {
  const {
    value: current,
    setValue: onChange,
    inited: valueInited,
  } = useCloudStorageKey(CLOUD_KEY_SCENE_ID, {});
  const scene_data = useStructuredProps(props => props.rgbic_linerlight_scene);
  const structuredActions = useStructuredActions();

  const inited = useRef(false);
  useEffect(() => {
    return () => {
      console.log('scene unmount');
      inited.current = false;
    };
  }, []);

  const initScene = (force = false) => {
    console.log('scene before init', current, scene_data?.id);
    if (inited.current && !force) return;
    console.log('scene init', current);

    // 如果scene有值，而current没有，则等一下current获取
    if (scene_data?.id > 0 && !current) {
      return;
    }

    if (!valueInited) return;

    if (current) {
      const scenes = getScenes();
      const item = getArray(scenes).find(item => +item?.key === +current);
      if (item) {
        console.log('scene init id', item?.key);
        if (scene_data?.id !== item?.key) {
          structuredActions.rgbic_linerlight_scene.set(item);
          // actions.work_mode.set('scene');
        }
        onChange(String(item?.key));
        inited.current = true;
      }
    } else {
      // 设备有场景数据，不下发
      const scenes = getScenes();
      const item = getArray(scenes)[0];
      if (item) {
        console.log('scene init first item');
        if (scene_data?.id !== item?.key) {
          structuredActions.rgbic_linerlight_scene.set(item, {
            ignoreDpDataResponse: false,
          });
          // actions.work_mode.set('scene');
        }

        onChange(String(item?.key));
        inited.current = true;
      }
    }
  };

  return { initScene, onChangeSceneId: onChange };
};
