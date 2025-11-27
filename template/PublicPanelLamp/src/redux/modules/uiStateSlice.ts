/* eslint-disable no-param-reassign */
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type UiState = {
  /**
   * 收藏颜色中彩光当前选中的索引
   */
  colorIndex: number;
  /**
   * 收藏颜色中白光当前选中的索引
   */
  whiteIndex: number;
};

/**
 * Slice
 */
const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    colorIndex: -1,
    whiteIndex: -1,
  } as UiState,
  reducers: {
    updateColorIndex(state, action: PayloadAction<UiState['colorIndex']>) {
      state.colorIndex = action.payload;
    },
    updateWhiteIndex(state, action: PayloadAction<UiState['whiteIndex']>) {
      state.whiteIndex = action.payload;
    },
  },
});

/**
 * Actions
 */
export const { updateColorIndex, updateWhiteIndex } = uiStateSlice.actions;

/**
 * Selectors
 */
export const selectColorIndex = (state: ReduxState) => state.uiState.colorIndex;
export const selectWhiteIndex = (state: ReduxState) => state.uiState.whiteIndex;
export const selectActiveIndex = createSelector(
  [
    (state: ReduxState) => state.uiState.whiteIndex,
    (state: ReduxState) => state.uiState.colorIndex,
    (_, isColor: boolean) => isColor,
  ],
  (whiteIndex, colorIndex, isColor) => {
    return isColor ? colorIndex : whiteIndex;
  }
);
export default uiStateSlice.reducer;
