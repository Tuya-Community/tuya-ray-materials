import { getAccountInfoSync } from '@ray-js/ray';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReduxState } from '..';

export const fetchAccountInfo = createAsyncThunk<ty.MiniProgramAccountInfo, void>(
  'accountInfo/fetchAccountInfo',
  async () => {
    const res = await getAccountInfoSync();
    return res.miniProgram;
  }
);

/**
 * Slice
 */
const accountInfoSlice = createSlice({
  name: 'accountInfo',
  initialState: {} as ty.MiniProgramAccountInfo,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchAccountInfo.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

/**
 * Selectors
 */
export const selectMiniAppId = () => (state: ReduxState) => state.accountInfo.appId;

/**
 * Actions
 */

export default accountInfoSlice.reducer;
