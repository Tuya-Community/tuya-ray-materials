import { createSlice } from '@reduxjs/toolkit';

const devInfoSlice = createSlice({
  name: 'devInfo',
  initialState: {
    devId: '',
  } as DevInfo,
  reducers: {
    devInfoChange(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { actions } = devInfoSlice;
export const { devInfoChange } = devInfoSlice.actions;
export default devInfoSlice.reducer;
