import {
  addPet as addPetApi,
  deletePet as deletePetApi,
  updatePet as updatePetApi,
  getPetDetail,
  getPetList,
} from '@ray-js/ray';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { setSelectedPetId } from './globalSlice';

const petsAdapter = createEntityAdapter<Pet>();

export const fetchPets = createAsyncThunk<any, void, { state: ReduxState }>(
  'pets/fetchPets',
  async (_, { getState, dispatch }) => {
    const pets = await getPetList({ ownerId: getState().homeInfo.homeId });
    if (pets?.[0]?.id) {
      dispatch(setSelectedPetId(pets[0].id));
    }

    return pets;
  }
);

export const fetchPetDetail = createAsyncThunk<
  any,
  { petId: number; forceUpdate?: boolean },
  { state: ReduxState }
>('pets/fetchPetDetail', async ({ petId, forceUpdate = false }, { getState }) => {
  if (
    (getState().pets.pets.entities[petId]?.bindFood &&
      !getState().pets.pets.entities[petId]?.relationFood) ||
    forceUpdate
  ) {
    const res = await getPetDetail({ id: petId, ownerId: getState().homeInfo.homeId });
    res.relationFood = res.relationFood ?? null;
    return res;
  }
  // 已经获取过详情的宠物 直接返回
  return getState().pets.pets.entities[petId];
});

export const addPet = createAsyncThunk<number, any, { state: ReduxState }>(
  'pets/addPet',
  async ({ ...params }, { getState, dispatch }) => {
    const petId = await addPetApi(params);
    return petId;
  }
);

export const updatePet = createAsyncThunk<void, any, { state: ReduxState }>(
  'pets/updatePet',
  async (params, { getState, dispatch }) => {
    await updatePetApi(params);
  }
);

export const deletePet = createAsyncThunk<number, number, { state: ReduxState }>(
  'pets/deletePet',
  async (petId, { getState, dispatch }) => {
    await deletePetApi({
      id: petId,
      ownerId: getState().homeInfo.homeId,
    });

    /**
     * 删除最后一只宠物时，重置选中宠物id
     */
    if (getState().pets.pets.ids.length === 1) {
      dispatch(setSelectedPetId(-1));
    }

    // 删除当前选中宠物，设置宠物id为列表中第一个
    if (getState().pets.pets.ids.length > 1 && getState().global.selectedPetId === petId) {
      dispatch(setSelectedPetId(getState().pets.pets.ids.find(item => item !== petId)));
    }

    return petId;
  }
);

/**
 * Slice
 */
const petsSlice = createSlice({
  name: 'pets',
  initialState: {
    loaded: false,
    pets: petsAdapter.getInitialState(),
  },
  reducers: {
    setPetsLoaded(state) {
      state.loaded = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPets.fulfilled, (state, action) => {
      petsAdapter.upsertMany(state.pets, action.payload);
      state.loaded = true;
    });
    builder.addCase(fetchPetDetail.fulfilled, (state, action) => {
      petsAdapter.upsertOne(state.pets, action.payload);
    });
    builder.addCase(deletePet.fulfilled, (state, action) => {
      petsAdapter.removeOne(state.pets, action.payload);
    });
  },
});

/**
 * Selectors
 */
const selectors = petsAdapter.getSelectors((state: ReduxState) => state.pets.pets);
export const {
  selectIds: selectAllPetIds,
  selectAll: selectAllPets,
  selectTotal: selectPetsTotal,
  selectById: selectPetById,
  selectEntities: selectPetEntities,
} = selectors;

export const selectOtherFeedingPets = createSelector(
  [selectAllPets, (state, petId: number) => petId],
  (pets, currentPetId) => {
    return pets.filter(item => item.dailyFeeding && item.id !== currentPetId);
  }
);

export const selectLoaded = (state: ReduxState) => state.pets.loaded;

export const { setPetsLoaded } = petsSlice.actions;
/**
 * Actions
 */

export default petsSlice.reducer;
