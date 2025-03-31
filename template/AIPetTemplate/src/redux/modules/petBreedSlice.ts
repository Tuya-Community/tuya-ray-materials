import { getPetBreedList } from '@ray-js/ray';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { groupBy } from 'lodash-es';

export const fetchPetBreedList = createAsyncThunk<{ code: PetType; res: any }, PetType>(
  'petBreed/fetchPetBreed',
  async code => {
    const res = await getPetBreedList({ petType: code });
    return { code, res };
  }
);

/**
 * 宠物品种
 */
const petBreedSlice = createSlice({
  name: 'petBreed',
  initialState: {
    cat: {} as Record<string, PetBreed[]>,
    dog: {} as Record<string, PetBreed[]>,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchPetBreedList.fulfilled, (state, action) => {
      const { code, res } = action.payload;
      state[code] = groupBy(res, 'headerChar');
    });
  },
});

/**
 * Selectors
 */
export const selectPetBreed = (key: PetType) => (state: ReduxState) => state.petBreed[key];

/**
 * Actions
 */

export default petBreedSlice.reducer;
