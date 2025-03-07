import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { CloudVoiceItem } from '@/types';

type VoiceList = {
  list: Array<CloudVoiceItem>;
};

/**
 * Slice
 */
const voiceListSlice = createSlice({
  name: 'voiceList',
  initialState: { list: [] } as VoiceList,
  reducers: {
    initVoiceList(state, action: PayloadAction<Array<CloudVoiceItem>>) {
      state.list = [...action.payload];
    },
    updateVoiceList(state, action: PayloadAction<Array<CloudVoiceItem>>) {
      const tempList = [...state.list];
      state.list = [...tempList, ...action.payload];
    },
  },
});

/**
 * Actions
 */

export const { updateVoiceList, initVoiceList } = voiceListSlice.actions;

/**
 * Selectors
 */
export const selectVoiceList = (state: ReduxState) => state.voiceList;

export default voiceListSlice.reducer;
