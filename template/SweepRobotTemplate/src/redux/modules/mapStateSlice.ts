// 是否第一次配网

import {
  DetectedObjectParam,
  Point,
  RoomProperty,
  SpotParam,
  VirtualWallParam,
  ZoneParam,
} from '@ray-js/robot-map';
import { ReduxState } from '..';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PanelMapState = {
  originMap: string;
  originPath: string;
  roomProperties: RoomProperty[];
  mapId: number | null;
  mapSize: { width: number; height: number };
  mapStable: boolean;
  origin: Point;
  charger: Point;
  version: 0 | 1 | 2;
  currentMode: Mode;
  detectedObjects: DetectedObjectParam[];
  selectRoomIds: number[];
  forbiddenSweepZones: ZoneParam[];
  forbiddenMopZones: ZoneParam[];
  cleanZones: ZoneParam[];
  virtualWalls: VirtualWallParam[];
  spots: SpotParam[];
  editingForbiddenSweepZoneIds: string[];
  editingForbiddenMopZoneIds: string[];
  editingCleanZoneIds: string[];
  editingVirtualWallIds: string[];
  editingSpotIds: string[];
};

const DEFAULT_MAP_STATE: PanelMapState = {
  originMap: '',
  originPath: '',
  roomProperties: [],
  mapId: null as null | number,
  mapSize: { width: 0, height: 0 },
  mapStable: false,
  origin: { x: 0, y: 0 },
  charger: { x: 0, y: 0 },
  version: 2 as 0 | 1 | 2,

  currentMode: 'smart',

  // 检测到的物体
  detectedObjects: [],
  // 选中的房间id
  selectRoomIds: [],
  // 禁扫区域
  forbiddenSweepZones: [],
  // 禁拖区域
  forbiddenMopZones: [],
  // 清扫区域
  cleanZones: [],
  // 虚拟墙
  virtualWalls: [],
  // 定点清扫
  spots: [],
  // 编辑禁扫区域id
  editingForbiddenSweepZoneIds: [],
  // 编辑禁拖区域id
  editingForbiddenMopZoneIds: [],
  // 编辑清扫区域id
  editingCleanZoneIds: [],
  // 编辑虚拟墙id
  editingVirtualWallIds: [],
  // 编辑定点清扫id
  editingSpotIds: [],
};

/**
 * Slice
 */
const mapStateSlice = createSlice({
  name: 'mapState',
  initialState: DEFAULT_MAP_STATE,
  reducers: {
    updateMapState(state, action: PayloadAction<AtLeastOne<typeof DEFAULT_MAP_STATE>>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */
export const { updateMapState } = mapStateSlice.actions;

/**
 * Selectors
 */
export const selectMapState = (state: ReduxState) => state.mapState;

type SelectMapStateByKey = <T extends keyof typeof DEFAULT_MAP_STATE>(
  key: T
) => (state: ReduxState) => typeof DEFAULT_MAP_STATE[T];
export const selectMapStateByKey: SelectMapStateByKey = key => state => state.mapState[key];

export default mapStateSlice.reducer;
