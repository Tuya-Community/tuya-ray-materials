import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { getCleaningRecords, getDevInfo } from '@ray-js/ray';
import moment from 'moment';

const cleanRecordsAdapter = createEntityAdapter<CleanRecord>({
  sortComparer: (a, b) => b.time - a.time,
});

export const fetchCleanRecords = createAsyncThunk<CleanRecord[], void, { state: ReduxState }>(
  'cleanRecords/fetchCleanRecords',
  async () => {
    const { datas } = await getCleaningRecords({
      devId: getDevInfo().devId,
      startTime: '',
      endTime: moment().format('X'),
      limit: 100,
      offset: 0,
    });

    return datas;
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
