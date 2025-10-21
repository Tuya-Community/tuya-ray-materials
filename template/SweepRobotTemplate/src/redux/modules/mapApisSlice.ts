import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MapApi } from '@ray-js/robot-map';
import { ReduxState } from '..';

type MapApisState = {
  [key: string]: MapApi | undefined;
};

const DEFAULT_MAP_APIS_STATE: MapApisState = {};

/**
 * Slice
 */
const mapApisSlice = createSlice({
  name: 'mapApis',
  initialState: DEFAULT_MAP_APIS_STATE,
  reducers: {
    setMapApi(state, action: PayloadAction<{ key: string; mapApi: MapApi }>) {
      const { key, mapApi } = action.payload;
      state[key] = mapApi;
    },
    removeMapApi(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
    clearMapApis() {
      return DEFAULT_MAP_APIS_STATE;
    },
  },
});

/**
 * Actions
 */
export const { setMapApi, removeMapApi, clearMapApis } = mapApisSlice.actions;

/**
 * Selectors
 */
export const selectMapApis = (state: ReduxState) => state.mapApis;

export const selectMapApiByKey = (key: string) => (state: ReduxState) => state.mapApis[key];

export default mapApisSlice.reducer;
