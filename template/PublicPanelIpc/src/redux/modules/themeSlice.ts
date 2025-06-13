import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type ThemeType = 'light' | 'dark';

type Theme = {
  type: ThemeType;
};

const initialState: Theme = {
  type: 'light', // 默认主题
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateThemeType(state, action: PayloadAction<ThemeType>) {
      state.type = action.payload;
    },
  },
});

export const { updateThemeType } = themeSlice.actions;

export const selectThemeType = (state: ReduxState) => state.theme.type;

export default themeSlice.reducer;
