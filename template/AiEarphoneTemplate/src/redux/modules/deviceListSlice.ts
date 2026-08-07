import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { DevInfo } from '@ray-js/panel-sdk';
import { responseUpdateDevsDp, ResponseUpdateDevsDpPayload } from './devsDpStateSlice'

type DeviceInfo = DevInfo & {
  iconName?: string;
  customDevType?: string;
  previewUrl?: string;
};

/**
 * Slice
 */
const deviceListSlice = createSlice({
  name: 'deviceList',
  initialState: [] as DeviceInfo[],
  reducers: {
    updateDevsSync(state, action: PayloadAction<any[]>) {
      return [...action.payload];
    },
  },
  extraReducers: builder => {
    builder.addCase(responseUpdateDevsDp, (state, action: PayloadAction<ResponseUpdateDevsDpPayload>) => {
      const { deviceId: devId, dps } = action.payload;
      const item = state.find(item => item.devId === devId);

      if (!item) return state;

      const [code, value] = Object.entries(dps)[0] || [];
      if (!code) return state;

      const schemaItem = item.schema.find(s => s.code === code);
      if (!schemaItem) return state;

      return state.map(item =>
        item.devId === devId
          ? { ...item, dps: { ...item.dps, [schemaItem.id]: value } }
          : item
      );
    })
  },

});

/**
 * Actions
 */

export const { updateDevsSync } = deviceListSlice.actions;

/**
 * Selectors
 */
export const getDeviceList = (state: ReduxState) => state.deviceList;

export default deviceListSlice.reducer;
