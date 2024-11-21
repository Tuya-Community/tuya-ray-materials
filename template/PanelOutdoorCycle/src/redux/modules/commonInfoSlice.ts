import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Slice
 */
const commonInfoSlice = createSlice({
  name: 'commonInfo',
  initialState: {
    inService: true,
    commodityUrl: '',
    isPidHadVAS: false,
  },
  reducers: {
    updateCommonInfo(state: IAbility, action: PayloadAction<any>) {
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
