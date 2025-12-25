import React, { useEffect, useMemo, useState } from 'react';

import Strings from '@/i18n';
import { useActions, useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';
import { View } from '@ray-js/ray';

import { ControlTabs } from '../control-tabs';
import { RowList } from '../rowlist';
import styles from './index.module.less';
import { DefaultSceneItem, findScene, getDefaultScenes, SceneCategory } from './scenes';

export interface SceneProps {
  onChangeSceneId(id: string): void;
}

export const Scene: React.FC<SceneProps> = ({ onChangeSceneId }) => {
  const [sceneMode, setSceneMode] = useState('scenery');
  const actions = useActions();
  const structuredActions = useStructuredActions();
  const rgbic_linerlight_scene = useStructuredProps(props => props.rgbic_linerlight_scene);

  const defaultScenes = useMemo(() => getDefaultScenes(), []);

  const dataSource = useMemo(() => {
    const scenes = defaultScenes;

    const ret = scenes[sceneMode];

    return ret as DefaultSceneItem[];
  }, [sceneMode, defaultScenes]);

  useEffect(() => {
    const item = findScene(defaultScenes, +rgbic_linerlight_scene?.key);
    if (item?.category) {
      setSceneMode(SceneCategory[item.category]);
    }
  }, [defaultScenes, rgbic_linerlight_scene?.key]);

  return (
    <View className={styles.contain}>
      <View className={styles.card}>
        <ControlTabs
          activeKey={sceneMode}
          onChange={setSceneMode}
          tabs={[
            {
              tab: Strings.getLang('scene_1'),
              tabKey: SceneCategory[0],
            },
            {
              tab: Strings.getLang('scene_2'),
              tabKey: SceneCategory[1],
            },
            {
              tab: Strings.getLang('scene_3'),
              tabKey: SceneCategory[2],
            },
            {
              tab: Strings.getLang('scene_4'),
              tabKey: SceneCategory[3],
            },
          ]}
        />
        <RowList
          key={sceneMode}
          current={rgbic_linerlight_scene?.key}
          onChange={(current, item) => {
            onChangeSceneId(`${current}`);
            structuredActions.rgbic_linerlight_scene.set(item);
            actions.work_mode.set('scene');
            // if (item?.value) {
            //   onChangeSceneId(`${current}`);
            //   structuredActions.dreamlight_scene_mode.set(item?.value);
            //   actions.work_mode.set('scene');
            // }
          }}
          dataSource={dataSource}
        />
      </View>
    </View>
  );
};
