import { SmartDeviceSchema } from '@/devices';
import { GetSmartDeviceModelDpSchema } from '@ray-js/panel-sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CommonState = {
  config: {
    dpSchema: GetSmartDeviceModelDpSchema<SmartDeviceSchema>;
  };
};

/**
 * Slice
 */
const commonSlice = createSlice({
  name: 'common',
  initialState: {
    config: {},
  } as CommonState,
  reducers: {
    updateConfig(state, action: PayloadAction<CommonState['config']>) {
      state.config = {
        ...(state?.config || ({} as any)),
        ...(action?.payload || ({} as any)),
      };
    },
  },
});

export { commonSlice };

export default commonSlice.reducer;
