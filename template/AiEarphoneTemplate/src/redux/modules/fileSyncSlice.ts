import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { DeviceOfflineFileResult } from '@/api/ttt.interface';

export interface CurrentSyncCardDevInfo extends DeviceOfflineFileResult {
  deviceId: string;
  name: string;
}

type IState = {
  isCardSyncing: boolean;
  currentSyncCardDevInfo: CurrentSyncCardDevInfo;
};

/**
 * Slice
 */
const fileSyncSlice = createSlice({
  name: 'fileSync',
  initialState: {
    // 是否在同步中
    isCardSyncing: false,
    currentSyncCardDevInfo: {},
  } as IState,
  reducers: {
    updateFileSync(state, action: PayloadAction<Partial<IState>>) {
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
export const selectFileSync = (state: ReduxState) => state.fileSync;

export default fileSyncSlice.reducer;
