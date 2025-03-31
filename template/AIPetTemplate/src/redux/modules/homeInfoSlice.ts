import { fetchHomeInfoApi } from '@/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReduxState } from '..';

export const fetchHomeInfo = createAsyncThunk<HomeInfo, void>(
  'homeInfo/fetchHomeInfo',
  async () => {
    const res = await fetchHomeInfoApi();
    return res;
  }
);

/**
 * Slice
 */
const homeInfoSlice = createSlice({
  name: 'homeInfo',
  initialState: {} as HomeInfo,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchHomeInfo.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(fetchHomeInfo.rejected, state => {
      if (process.env.NODE_ENV === 'development') {
        state.homeId = '44467524';
      }
    });
  },
});

/**
 * Selectors
 */
export const selectHomeId = () => (state: ReduxState) => state.homeInfo.homeId;

/**
 * Actions
 */

export default homeInfoSlice.reducer;
