import React, { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useDevice } from '@ray-js/panel-sdk';
import { View } from '@ray-js/ray';
import { getEventInstance, EventInstance } from '@/features';
import { changePanelInfoState } from '@/utils';
import { PathList } from './components/path-list';
import { PathEditPoint } from './components/path-edit-point';
import { PathPointDetails } from './components/path-point-details';
import { PathManagerSceneContext, Scene } from './context';

import Styles from './index.module.less';

interface IProps {
  title: string;
}

export function PathManager() {
  const devInfo = useDevice(device => device.devInfo);
  const [sceneTask, setSceneTask] = useState([Scene.PATH_LIST]);
  const eventManagerRef = useRef<EventInstance>();
  if (!eventManagerRef.current) {
    eventManagerRef.current = getEventInstance();
  }
  // const [currentEditPathId, setCurrentEditPathId] = useState<number>();
  const [currentEditPathId, setCurrentEditPathId] = useState<number>();
  const [currentEditPathInfo, setCurrentEditPathInfo] = useState(null);

  const currentScene = useMemo<Scene>(() => {
    return sceneTask[sceneTask.length - 1];
  }, [sceneTask]);

  const pushSceneTask = (scene: Scene) => {
    const newData = [...sceneTask, scene];
    setSceneTask(newData);
  };

  const backPrevScene = () => {
    if (sceneTask.length === 1) {
      changePanelInfoState('showSmartPopup', { status: false, popupData: null, title: null });
      return;
    }
    const newData = [];
    const len = sceneTask.length - 1;
    let index = 0;
    while (index < len) {
      newData.push(sceneTask[index]);
      index++;
    }
    setSceneTask(newData);
  };

  return (
    <PathManagerSceneContext.Provider
      value={{
        currentScene,
        sceneTask,
        pushSceneTask,
        backPrevScene,
        currentEditPathId,
        setCurrentEditPathId,
        currentEditPathInfo,
        setCurrentEditPathInfo,
        eventManager: eventManagerRef.current,
      }}
    >
      <View className={clsx(Styles.comContainer)}>
        {currentScene === Scene.PATH_LIST && <PathList devId={devInfo.devId} />}
        {currentScene === Scene.EDIT_PATH_POINT && <PathEditPoint devId={devInfo.devId} />}
        {currentScene === Scene.PATH_POINT_DETAILS && <PathPointDetails devId={devInfo.devId} />}
      </View>
    </PathManagerSceneContext.Provider>
  );
}
