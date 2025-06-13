export enum PlayState {
  PLAYING = 0, // 执行中
  FINISH = 1, // 已完成
  ERROR = 2, // 错误
}

export type PointData = {
  pathName: string;
  error?: number;
  pathId?: number;
  id?: number;
  state?: PlayState; // 路径节点执行状态
};

export const enum PointType {
  PLAY_POINT = 6,
  END_PLAY_POINT = 7,
  UPDATE_POINT_NAME = 8,
}

export interface PointOptions {
  type: PointType;
  data: PointData;
}

export type PathData = {
  pathName: string;
  error?: number;
  pathId?: number;
  id?: number;
  state?: PlayState; // 路径巡航执行状态
};

export const enum PathType {
  ADD_PATH = 1,
  DELETE_PATH = 2,
  PLAY_PATH = 3,
  END_PLAY_PATH = 4,
  ADD_POINT = 5,
  ADD_POINT_SUC = 7,
  ADD_POINT_PATH_SUC = 8,
  DELETE_POINT = 9,
  DELETE_POINT_SUC = 10,
  UPDATE_PATH_NAME = 11,
  SAVE_PATH = 12,
}

export interface PathOptions {
  type: PathType;
  data: PathData;
}
