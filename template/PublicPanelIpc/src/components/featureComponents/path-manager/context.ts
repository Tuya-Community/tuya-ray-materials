import React from 'react';
import { Path } from '@/entities/path/interface';
import { EventInstance } from '@/features';

export const enum Scene {
  PATH_LIST = 'pathList', // 路径列表
  EDIT_PATH_POINT = 'editPathPoint', // 路径创建节点
  PATH_POINT_DETAILS = 'pathPointDetails',
}

type Options = {
  sceneTask: Scene[];
  pushSceneTask: (scene: Scene) => void;
  backPrevScene: () => void;
  currentScene: Scene; // 当前场景
  currentEditPathId?: number; // 当前正在编辑的 pathId
  currentEditPathInfo: Path;
  setCurrentEditPathId: (pathId: number) => void;
  setCurrentEditPathInfo: (pathInfo: Path) => void;
  eventManager: EventInstance;
};

export const PathManagerSceneContext = React.createContext<Options>({
  sceneTask: [],
  pushSceneTask: () => null,
  backPrevScene: () => null,
  currentScene: undefined,
  setCurrentEditPathId: () => null,
  currentEditPathInfo: null,
  setCurrentEditPathInfo: () => null,
  eventManager: null,
});
