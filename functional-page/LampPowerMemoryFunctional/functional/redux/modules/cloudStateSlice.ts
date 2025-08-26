/*
 * @Author: mjh
 * @Date: 2024-12-25 17:14:11
 * @LastEditors: mjh
 * @LastEditTime: 2024-12-26 17:04:24
 * @Description:
 */
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultColors, defaultWhite, defaultWhiteC } from '../../config/default';
import { devices } from '../../devices/index';
import { ReduxState } from '..';

type CollectColors = Array<{
  hue?: number;
  saturation?: number;
  value?: number;
  temperature?: number;
  brightness?: number;
}>;

type CloudState = {
  /**
   * 收藏的彩光颜色列表
   */
  collectColors: Array<{ hue: number; saturation: number; value: number }>;
  /**
   * 收藏的白光颜色列表
   */
  collectWhites: Array<{ temperature: number; brightness: number }>;
};

/**
 * Slice
 */
const cloudStateSlice = createSlice({
  name: 'cloudState',
  initialState: {
    collectColors: defaultColors,
    collectWhites: defaultWhite,
  } as CloudState,
  reducers: {
    initCloud(_, action: PayloadAction<CloudState>) {
      return action.payload;
    },
    updateCollectColors(state, action: PayloadAction<CloudState['collectColors']>) {
      if (!action.payload) return;
      state.collectColors = action.payload;
    },
    updateCollectWhites(state, action: PayloadAction<CloudState['collectWhites']>) {
      if (!action.payload) return;
      state.collectWhites = action.payload;
    },
  },
});

/**
 * Actions
 */
export const { initCloud, updateCollectColors, updateCollectWhites } = cloudStateSlice.actions;

/**
 * Selectors
 */
export const selectCollectColours = (state: ReduxState) =>
  state.cloudState.collectColors || defaultColors;
export const selectCollectWhites = (state: ReduxState) =>
  state.cloudState.collectWhites || defaultWhite;
export const selectCollectColors = createSelector(
  [
    (state: ReduxState) => state.cloudState.collectWhites,
    (state: ReduxState) => state.cloudState.collectColors,
    (_, isColor: boolean) => isColor,
  ],
  (collectWhites, collectColors, isColor) => {
    const isSupportTemp = devices.lamp.model.abilities.support.isSupportTemp();
    if (isColor) return collectColors as CollectColors;
    if (isSupportTemp) return collectWhites as CollectColors;
    return defaultWhiteC as CollectColors;
  }
);

export default cloudStateSlice.reducer;
