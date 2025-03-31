import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type UploadFile = {
  componentId: any;
  instanceType: string;
  invoke: any;
  createUploadState: any;
};

/**
 * Slice
 */
const uploadFileSlice = createSlice({
  name: 'uploadFile',
  initialState: {} as { [key: string]: UploadFile },
  reducers: {
    initData(state: any, action: PayloadAction<UploadFile>) {
      const { componentId } = action.payload;
      return {
        ...state,
        [componentId]: action.payload,
      };
    },
    unmountData(state: any, action: PayloadAction<{ componentId: string }>) {
      const { componentId } = action.payload;
      // eslint-disable-next-line no-param-reassign
      // delete state[componentId];

      const { [componentId]: target, ...newState } = state;
      return newState;
    },
  },
});

/**
 * Actions
 */

export const { initData, unmountData } = uploadFileSlice.actions;

/**
 * Selectors
 */
export const selectUploadFile = (state: ReduxState) => state.theme.type;

export default uploadFileSlice.reducer;
