import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { roleInfo } from '@/types';

/**
 * Slice
 */
const roleInfoSlice = createSlice({
  name: 'roleInfo',
  initialState: {} as roleInfo,
  reducers: {
    updateRoleInfo(state, action: PayloadAction<roleInfo>) {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

/**
 * Actions
 */

export const { updateRoleInfo } = roleInfoSlice.actions;

/**
 * Selectors
 */
export const selectRoleInfo = (state: ReduxState) => state.roleInfo;

export default roleInfoSlice.reducer;
