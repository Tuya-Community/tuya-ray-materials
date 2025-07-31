import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ReduxState } from '..';

/**
 * Slice
 */
const commonInfoSlice = createSlice({
  name: 'commonInfo',
  initialState: {
    isBleXDevice: false,
    isActive: false,
    inService: true,
    commodityUrl: '',
    isPidHadVAS: false,
    activeType: '',
    interactionType: '',
    assocaitedDps: [],
  },
  reducers: {
    updateCommonInfo(state, action) {
      Object.assign(state, action.payload);
    },
  },
});

/**
 * Actions
 */

export const { updateCommonInfo } = commonInfoSlice.actions;

/**
 * Selectors
 */

export const commonCheckInfo = state => state.commonInfo;

export const selectCommonInfoByKey = key => state => state.commonInfo[key];

export default commonInfoSlice.reducer;
