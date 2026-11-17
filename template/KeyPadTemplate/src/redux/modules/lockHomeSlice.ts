import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

interface LockHomeState {
  /** 最近一条告警记录 */
  recentAlarm: Record<string, any> | null;
  /** 告警未读数量 */
  alarmUnReadCount: number;
  /** 蓝牙是否在线 */
  bleOnline: boolean;
  /** 安防有效天数（设备激活以来） */
  saveTime: number;
  /**
   * 配件已绑定的门锁列表。
   * null 表示尚未拉取；数组（含空数组）表示已拉取完成，供未绑定引导气泡判断。
   */
  hasBindLockList: Record<string, any>[] | null;
  /**
   * 当前登录用户信息（含 userType，用于权限门控）。
   * null 表示尚未拉取。由 composeLayout 在 initFit 完成后拉取写入。
   */
  currentUser: Record<string, any> | null;
}

const initialState: LockHomeState = {
  recentAlarm: null,
  alarmUnReadCount: 0,
  bleOnline: false,
  saveTime: 0,
  hasBindLockList: null,
  currentUser: null,
};

const lockHomeSlice = createSlice({
  name: 'lockHome',
  initialState,
  reducers: {
    setRecentAlarm(state, action: PayloadAction<Record<string, any> | null>) {
      state.recentAlarm = action.payload;
    },
    setAlarmUnReadCount(state, action: PayloadAction<number>) {
      state.alarmUnReadCount = action.payload;
    },
    setBleOnline(state, action: PayloadAction<boolean>) {
      state.bleOnline = action.payload;
    },
    setSaveTime(state, action: PayloadAction<number>) {
      state.saveTime = action.payload;
    },
    setHasBindLockList(state, action: PayloadAction<Record<string, any>[] | null>) {
      state.hasBindLockList = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<Record<string, any> | null>) {
      state.currentUser = action.payload;
    },
  },
});

export const {
  setRecentAlarm,
  setAlarmUnReadCount,
  setBleOnline,
  setSaveTime,
  setHasBindLockList,
  setCurrentUser,
} = lockHomeSlice.actions;

export const selectLockHome = (state: ReduxState) => state.lockHome;
export const selectRecentAlarm = (state: ReduxState) => state.lockHome.recentAlarm;
export const selectAlarmUnReadCount = (state: ReduxState) => state.lockHome.alarmUnReadCount;
export const selectBleOnline = (state: ReduxState) => state.lockHome.bleOnline;
export const selectSaveTime = (state: ReduxState) => state.lockHome.saveTime;
export const selectHasBindLockList = (state: ReduxState) => state.lockHome.hasBindLockList;
export const selectCurrentUser = (state: ReduxState) => state.lockHome.currentUser;

export default lockHomeSlice.reducer;
