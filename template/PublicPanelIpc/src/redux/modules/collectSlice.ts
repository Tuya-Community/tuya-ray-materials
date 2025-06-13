import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type TCollect = {
  isUpdate: boolean;
};
export type TCollectKey = keyof TCollect;

const collectSlice = createSlice({
  name: 'collect',
  initialState: {
    isUpdate: false,
  } as TCollect,
  reducers: {
    updateCollect(state, action: PayloadAction<TCollect>) {
      Object.assign(state, action.payload);
    },
  },
});
export const { updateCollect } = collectSlice.actions;
/**
 * Selectors
 */
export const selectPanelInfo = (state: ReduxState) => state.collect;

type TSelectCollectKey = <T extends TCollectKey>(dpCode: T) => (state: ReduxState) => TCollect[T];

export const selectCollectKey: TSelectCollectKey = key => state => state.collect[key];

export default collectSlice.reducer;
