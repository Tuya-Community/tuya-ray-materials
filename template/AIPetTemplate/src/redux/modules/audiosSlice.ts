import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { deleteDeviceFile, fetchDeviceFileDetail, fetchPetAudios, getDevInfo } from '@ray-js/ray';

const audiosAdapter = createEntityAdapter<Audio>({
  selectId: audio => audio.fileNo,
});

export const fetchAudios = createAsyncThunk<Audio[], void, { state: ReduxState }>(
  'audios/fetchAudios',
  async () => {
    const { devId } = getDevInfo();
    const res = await fetchPetAudios(devId);

    return res.data;
  }
);

export const fetchAudioDetail = createAsyncThunk<Audio, string, { state: ReduxState }>(
  'audios/fetchAudioDetail',
  async (fileNo, { getState }) => {
    const { devId } = getDevInfo();
    const exist = getState().audios.entities[fileNo];
    const res = await fetchDeviceFileDetail(fileNo, devId);

    return { ...exist, ...res };
  }
);

export const deleteAudios = createAsyncThunk<string[], string[], { state: ReduxState }>(
  'audios/deleteAudios',
  async fileNos => {
    const { devId } = getDevInfo();
    await deleteDeviceFile(fileNos, devId);

    return fileNos;
  }
);

/**
 * Slice
 */
const audiosSlice = createSlice({
  name: 'audios',
  initialState: audiosAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchAudios.fulfilled, (state, action) => {
      audiosAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchAudioDetail.fulfilled, (state, action) => {
      audiosAdapter.upsertOne(state, action.payload);
    });
    builder.addCase(deleteAudios.fulfilled, (state, action) => {
      audiosAdapter.removeMany(state, action.payload);
    });
  },
});

export const {
  selectIds: selectAudioIds,
  selectById: selectAudioById,
  selectAll: selectAudios,
  selectEntities: selectAudioEntities,
  selectTotal: selectAudiosTotal,
} = audiosAdapter.getSelectors((state: ReduxState) => state.audios);

/**
 * Actions
 */

export default audiosSlice.reducer;
