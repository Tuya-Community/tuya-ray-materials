import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type Other = {
  myActiveTab: string;
  activeTab: string;
  cropedFile: string;
};

/**
 * Slice
 */
const otherSlice = createSlice({
  name: 'other',
  initialState: {
    myActiveTab: 'diy',
    activeTab: 'functional',
    cropedFile: '',
  } as Other,
  reducers: {
    updateMyActiveTab(state, action: PayloadAction<string>) {
      state.myActiveTab = action.payload;
      state.activeTab = 'gallery';
    },
    updateActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    updateCropedFile(state, action: PayloadAction<string>) {
      state.cropedFile = action.payload;
    },
  },
});

/**
 * Actions
 */

export const { updateMyActiveTab, updateActiveTab, updateCropedFile } = otherSlice.actions;

/**
 * Selectors
 */
export const selectMyActiveTab = (state: ReduxState) => state.other.myActiveTab;

export const selectActiveTab = (state: ReduxState) => state.other.activeTab;

export const selectCropedFile = (state: ReduxState) => state.other.cropedFile;

export default otherSlice.reducer;
