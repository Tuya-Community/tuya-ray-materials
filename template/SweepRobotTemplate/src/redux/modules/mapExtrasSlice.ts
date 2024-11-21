import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { VirtualArea, Point, Zone } from '@ray-js/robot-protocol';

type MapExtras = {
  // 定点清扫
  appointData: Point[];
  // 禁扫拖区域
  virtualAreaData: VirtualArea[];
  // 禁拖区域
  virtualMopAreaData: VirtualArea[];
  // 选区清扫
  sweepRegionData: Zone[];
  // 虚拟墙
  virtualWallData: Point[][];
};

/**
 * Slice
 */
const mapExtrasSlice = createSlice({
  name: 'mapExtras',
  initialState: {
    appointData: [],
    virtualAreaData: [],
    virtualMopAreaData: [],
    sweepRegionData: [],
    virtualWallData: [],
  } as MapExtras,
  reducers: {
    mapExtrasUpdated(state, action: PayloadAction<Partial<MapExtras>>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Selectors
 */
export const selectMapExtraByKey = (key: keyof MapExtras) => (state: ReduxState) =>
  state.mapExtras[key];
export const selectMapExtras = (state: ReduxState) => state.mapExtras;

/**
 * Actions
 */
export const { mapExtrasUpdated } = mapExtrasSlice.actions;

export default mapExtrasSlice.reducer;
