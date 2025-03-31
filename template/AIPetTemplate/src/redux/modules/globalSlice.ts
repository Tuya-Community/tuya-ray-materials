import { createSlice } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type GlobalVar = {
  selectedPetId?: number;
  tick: number;
};

/**
 * Slice
 */
const globalSlice = createSlice({
  name: 'global',
  initialState: {
    selectedPetId: -1,
    tick: Date.now(),
  } as GlobalVar,
  reducers: {
    setSelectedPetId(state, action) {
      state.selectedPetId = action.payload;
    },
    updateTick(state) {
      state.tick = Date.now();
    },
  },
});

/**
 * Selectors
 */
export const selectSelectedPet = (state: ReduxState) =>
  state.pets.pets.entities[state.global.selectedPetId];
export const selectTick = (state: ReduxState) => state.global.tick;

/**
 * Actions
 */
export const { setSelectedPetId, updateTick } = globalSlice.actions;

export default globalSlice.reducer;
