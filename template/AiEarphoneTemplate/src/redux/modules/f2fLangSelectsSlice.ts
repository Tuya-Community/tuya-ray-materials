import { createSlice, PayloadAction } from '@reduxjs/toolkit';
/**
 * Slice
 */
const f2fLangSelectsSlice = createSlice({
  name: 'f2fLangSelects',
  initialState: { myLang: '', friendLang: '' } as any,
  reducers: {
    updateLangSelects(state, action: PayloadAction<any>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */

export const { updateLangSelects } = f2fLangSelectsSlice.actions;

export default f2fLangSelectsSlice.reducer;
