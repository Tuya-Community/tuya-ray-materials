/*
 * @Author: hkc
 * @Date: 2025-07-11 14:30:13
 * @LastEditors: hkc
 * @LastEditTime: 2026-03-16 18:12:58
 * @Description: 家庭信息状态管理
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type HomeInfoState = {
  homeId: string;
  homeName: string;
};

/**
 * Slice
 */
const homeInfoSlice = createSlice({
  name: 'homeInfo',
  initialState: {
    homeId: null,
    homeName: '',
  } as HomeInfoState,
  reducers: {
    updateHomeInfo(state, action: PayloadAction<Partial<HomeInfoState>>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */

export const { updateHomeInfo } = homeInfoSlice.actions;

/**
 * Selectors
 */
export const selectHomeInfo = (state: ReduxState) => state.homeInfo;

export default homeInfoSlice.reducer;
