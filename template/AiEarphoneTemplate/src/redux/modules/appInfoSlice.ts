/*
 * @Author: hkc
 * @Date: 2025-07-11 14:30:13
 * @LastEditors: hkc
 * @LastEditTime: 2025-08-05 20:01:59
 * @Description: app信息
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PUBLIC_APPS } from '@/constant';
import { ReduxState } from '..';

type AppInfoState = {
  serverTimestamp: number;
  appVersion: string;
  language: string;
  countryCode: string;
  regionCode: string;
  appName: string;
  appIcon: string;
  appBundleId: string;
  appScheme: string;
  appId: string;
  appEnv?: number;
  isPublicApp: boolean;
};

/**
 * Slice
 */
const AppInfoSlice = createSlice({
  name: 'appInfo',
  initialState: {
    appVersion: '',
    appId: '',
    isPublicApp: false,
  } as AppInfoState,
  reducers: {
    updateAppInfo(state, action: PayloadAction<Partial<AppInfoState>>) {
      const next = { ...state, ...action.payload };
      next.isPublicApp = PUBLIC_APPS.includes(next.appId);
      return next;
    },
  },
});

/**
 * Actions
 */

export const { updateAppInfo } = AppInfoSlice.actions;

/**
 * Selectors
 */
export const selectAppInfo = (state: ReduxState) => state.appInfo;

export default AppInfoSlice.reducer;
