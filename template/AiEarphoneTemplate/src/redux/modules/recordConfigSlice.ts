import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setStorageLastModePath } from '@/utils';
/**
 * Slice
 */
const recordConfigSlice = createSlice({
  name: 'recordConfig',
  initialState: { mode: null, isCall: false, config: {} } as any,
  reducers: {
    updateRecordConfigSync(state, action: PayloadAction<any>) {
      return { ...state, config: { ...action.payload } };
    },
    updateMode(state, action: PayloadAction<string>) {
      action.payload && setStorageLastModePath(action.payload); // 保存当前模式路径
      return { ...state, mode: action.payload };
    },
    updateIsCall(state, action: PayloadAction<boolean>) {
      return { ...state, isCall: action.payload };
    },
    updateRecordConfigAll(state, action: PayloadAction<any>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */

export const { updateRecordConfigSync, updateMode, updateIsCall, updateRecordConfigAll } =
  recordConfigSlice.actions;

export default recordConfigSlice.reducer;
