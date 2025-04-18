import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type ThemeType = `${Themes}`;

type Theme = {
  type: ThemeType;
};

/**
 * Slice
 */
const themeSlice = createSlice({
  name: 'theme',
  initialState: {} as Theme,
  reducers: {
    updateThemeType(state, action: PayloadAction<ThemeType>) {
      state.type = action.payload;
    },
  },
});

/**
 * Actions
 */

export const { updateThemeType } = themeSlice.actions;

/**
 * Selectors
 */
export const selectThemeType = (state: ReduxState) => state.theme.type;
type selectThemeByKey = (key: string) => (state: ReduxState) => any;
export const selectThemeByKey: selectThemeByKey = key => state => state.theme[key];

export default themeSlice.reducer;
