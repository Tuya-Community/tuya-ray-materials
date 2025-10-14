import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import _ from 'lodash';
import defaultUiConfig from '@/default.ui.config';

type ThemeType = 'light' | 'dark';

export type ThemeConfigItem = {
  // 自定义字段
  isDefaultTheme: boolean;
  themeColor: string;
  fontColor: string;
  themeImage: string;

  // 通用字段
  type?: string;
  theme?: string;
  global?: {
    fontColor?: string;
    themeColor?: string;
    background?: string;
    isDefaultTheme?: boolean;
  };
  background?: {
    type?: 'color';
    value?: string;
  };
};

export type Theme = {
  type: ThemeType;
  config: {
    default?: ThemeConfigItem;
    light?: ThemeConfigItem;
  };
};

/**
 * Slice
 */
const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    config: defaultUiConfig,
    type: 'dark',
  } as Theme,
  reducers: {
    updateThemeType(state, action: PayloadAction<ThemeType>) {
      state.type = action.payload;
    },
    updateThemeConfig(state, action: PayloadAction<ThemeConfigItem>) {
      const themeType = action?.payload?.type;
      state.config = _.merge(state.config, {
        [themeType]: action?.payload,
      });
      state.type = themeType as any;
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

export default themeSlice.reducer;

export { themeSlice };
