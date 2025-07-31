import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SmartDeviceAbility } from '@ray-js/panel-sdk';

import { ReduxState } from '..';

// type ThemeType = `${Themes}`;

// type Theme = {
//   type: ThemeType;
// };

/**
 * Slice
 */
const supportSlice = createSlice({
  name: 'support',
  initialState: {} as SmartDeviceAbility,
  reducers: {
    initSupportInfo(state, action: PayloadAction) {
      return action.payload;
    },
  },
});

/**
 * Actions
 */

export const { initSupportInfo } = supportSlice.actions;

/**
 * Selectors
 */

export const support = state => state.support;
// type SelectSystemInfoByKey = <T extends SystemInfoKey>(
//   dpCode: T
// ) => (state: ReduxState) => SystemInfo[T];
export const selectSystemInfoByKey = key => state => state.support[key];

export default supportSlice.reducer;
