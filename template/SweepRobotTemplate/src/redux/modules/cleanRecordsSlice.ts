import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { getCleaningRecords } from '@ray-js/ray';
import dayjs from 'dayjs';

import { parseDataFromString } from '@/utils';
import { devices } from '@/devices';

const cleanRecordsAdapter = createEntityAdapter<CleanRecord>({
  sortComparer: (a, b) => b.time - a.time,
});

export const fetchCleanRecords = createAsyncThunk<CleanRecord[], void, { state: ReduxState }>(
  'cleanRecords/fetchCleanRecords',
  async () => {
    const { datas } = await getCleaningRecords({
      devId: devices.common.getDevInfo().devId,
      startTime: '',
      endTime: Math.floor(dayjs().valueOf() / 1000).toString(),
      limit: 100,
      offset: 0,
    });

    if (datas) {
      const result = datas
        .map(item => {
          return {
            ...item,
            extendInfo: parseDataFromString(item.extend),
          };
        })
        .filter(item => item.extendInfo);

      return result;
    }

    return [];
  }
);

/**
 * Slice
 */
const cleanRecordsSlice = createSlice({
  name: 'cleanRecords',
  initialState: cleanRecordsAdapter.getInitialState(),
  reducers: {
    deleteCleanRecord(state, action: PayloadAction<number>) {
      cleanRecordsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCleanRecords.fulfilled, (state, action) => {
      cleanRecordsAdapter.upsertMany(state, action.payload);
    });
  },
});

export const { deleteCleanRecord } = cleanRecordsSlice.actions;

export const {
  selectIds: selectCleanRecordsIds,
  selectById: selectCleanRecordById,
  selectAll: selectCleanRecords,
  selectEntities: selectCleanEntities,
  selectTotal: selectCleanRecordsTotal,
} = cleanRecordsAdapter.getSelectors((state: ReduxState) => state.cleanRecords);

/**
 * Actions
 */

export default cleanRecordsSlice.reducer;
