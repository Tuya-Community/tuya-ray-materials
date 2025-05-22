import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { cloneDeep, differenceWith, isEqual } from 'lodash-es';
import { RoleListItem } from '@/types';

type Role = {
  list?: Array<RoleListItem>;
  newNumber?: number;
  tagState?: string;
};

/**
 * Slice
 */
const roleListSlice = createSlice({
  name: 'roleList',
  initialState: {
    list: [],
  } as Role,
  reducers: {
    initRoleList(state, action: PayloadAction<Array<RoleListItem>>) {
      state.list = [...action.payload];
    },
    updateRoleList(state, action: PayloadAction<Array<RoleListItem>>) {
      state.list = [...action.payload];
    },
  },
});

/**
 * Actions
 */
export const { initRoleList, updateRoleList } = roleListSlice.actions;

/**
 * Selectors
 */
export const selectRoleList = (state: ReduxState) => state.roleList;

export default roleListSlice.reducer;
