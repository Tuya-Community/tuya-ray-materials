import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

interface CloneInfo {
  voiceId?: string;
  lang?: string;
}

/**
 * Slice
 */
const cloneInfoSlice = createSlice({
  name: 'cloneInfo',
  initialState: {
    lang: 'zh',
  } as CloneInfo,
  reducers: {
    updateCloneInfo(state, action: PayloadAction<CloneInfo>) {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

/**
 * Actions
 */

export const { updateCloneInfo } = cloneInfoSlice.actions;

/**
 * Selectors
 */
export const selectCloneInfo = (state: ReduxState) => state.cloneInfo;

export default cloneInfoSlice.reducer;
