import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Slice
 */
const carInfoSlice = createSlice({
  name: 'carInfo',
  initialState: {},
  reducers: {
    updateCarInfo(state, action: PayloadAction) {
      Object.assign(state, action.payload);
    },
  },
});

/**
 * Actions
 */

export const { updateCarInfo } = carInfoSlice.actions;

/**
 * Selectors
 */
export const selectCarInfo = state => state.carInfo;
export const selectCarInfoByKey = key => state => state.carInfo[key];

export default carInfoSlice.reducer;
