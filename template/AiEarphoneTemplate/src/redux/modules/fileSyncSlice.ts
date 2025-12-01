import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type FileSync = {
  isSyncing: boolean;
};

/**
 * Slice
 */
const fileSyncSlice = createSlice({
  name: 'fileSync',
  initialState: {
    // 是否在同步中
    isSyncing: false,
  },
  reducers: {
    updateFileSync(state, action: PayloadAction<Partial<FileSync>>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */

export const { updateFileSync } = fileSyncSlice.actions;

/**
 * Selectors
 */
export const selectfileSync = (state: ReduxState) => state.fileSync.isSyncing;

export default fileSyncSlice.reducer;
