import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TypeEnergyMode = Array<{ code?: string; title?: string }>;

/**
 * Slice
 */
const energyModeSlice = createSlice({
  name: 'energyMode',
  initialState: [] as TypeEnergyMode,
  reducers: {
    initializeEnergyMode(state, action: PayloadAction<TypeEnergyMode>) {
      return action.payload;
    },
    updateEnergyMode(state, action: PayloadAction<Partial<TypeEnergyMode>>) {
      Object.assign(state, action.payload);
    },
  },
});

/**
 * Actions
 */

export const { initializeEnergyMode, updateEnergyMode } = energyModeSlice.actions;

export default energyModeSlice.reducer;
