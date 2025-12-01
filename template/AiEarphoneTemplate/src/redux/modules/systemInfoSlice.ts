import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSystemInfoSync } from '@ray-js/ray';
import { ReduxState } from '..';

type SystemInfo = ReturnType<typeof getSystemInfoSync>;
type SystemInfoKey = keyof SystemInfo;

/**
 * Slice
 */
const systemInfoSlice = createSlice({
  name: 'systemInfo',
  initialState: {} as SystemInfo & {
    safeBottomHeight: number;
    topBarHeight: number;
    staticPrefix: string;
    platform: string; // ios或者安卓等
  },
  reducers: {
    updateSystemInfo(state, action: PayloadAction<Partial<SystemInfo>>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */
export const { updateSystemInfo } = systemInfoSlice.actions;

/**
 * Selectors
 */
export const selectSafeArea = (state: ReduxState) => state.systemInfo.safeArea;

export const selectSystemInfo = (state: ReduxState) => state.systemInfo;

export const selectStaticPrefix = (state: ReduxState) => state.systemInfo.staticPrefix;

type SelectSystemInfoByKey = <T extends SystemInfoKey>(
  dpCode: T
) => (state: ReduxState) => SystemInfo[T];
export const selectSystemInfoByKey: SelectSystemInfoByKey = key => state => state.systemInfo[key];

export default systemInfoSlice.reducer;
