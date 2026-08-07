import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { devInfoChangeCreator } from '@ray-js/tuya-dp-kit';
import { ReduxState } from '..';
import { DpState, DpStateKey } from './dpStateSlice';
import { DevInfo } from '@ray-js/panel-sdk';
import { responseUpdateDevsDp, ResponseUpdateDevsDpPayload } from './devsDpStateSlice';
import { DEVTYPES } from '@/constant/enums';

export type DpValue = boolean | number | string;

type ReduxDevInfo = DevInfo & {
  schema: Record<DpStateKey, any>;
  state: DpState;
  dpIdCodeMap: Record<number, DpStateKey>;
  dpCodeIdMap: Record<DpStateKey, number>;
  homeId: string;
  customDevType?: DEVTYPES;
  iconName?: string;
  isDevOnline?: boolean;
};

/**
 * ExtraActions
 */
export const devInfoChange = devInfoChangeCreator<ReduxDevInfo>();

/**
 * Slice
 */
const devInfoSlice = createSlice({
  name: 'devInfo',
  initialState: {} as ReduxDevInfo,
  reducers: {
    updateDeviceOnline(state, action: PayloadAction<Partial<any>>) {
      if (state?.customDevType === DEVTYPES.phone) {
        return { ...state, isOnline: true }; // 手机设备始终认为是在线的
      }
      return { ...state, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder.addCase(devInfoChange, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    });
    builder.addCase(
      responseUpdateDevsDp,
      (state, action: PayloadAction<ResponseUpdateDevsDpPayload>) => {
        // 如果设备id相同，则更新dp状态
        const { deviceId: devId, dps } = action.payload;
        if (devId === state.devId) {
          const { schema } = state;
          const [key, value] = Object.entries(dps)[0] || [];
          if (!key) return state;

          const id = schema[key]?.id;
          return {
            ...state,
            dpCodes: {
              ...state.dpCodes,
              ...dps,
            },
            dps: {
              ...state.dps,
              [id]: value,
            },
          };
        }
      }
    );
  },
});

export const { updateDeviceOnline } = devInfoSlice.actions;

/**
 * Selectors
 */
export const selectDevInfo = (state: ReduxState) => state.devInfo;
/* 选择自定义dp key的集合 */
/* 记得用useSelectorMemoized */
export const selectCustomDpCodes = (state: ReduxState) =>
  Object.keys(state.devInfo.dpCodeIdMap).filter(dpCode => state.devInfo.dpCodeIdMap[dpCode] >= 100);
// 实际拿到的好像是devInfo.deviceOnline，这里可能要改
export const selectIsLocalOnline = (state: ReduxState) => state.devInfo.isLocalOnline;
export const selectIsOnline = (state: ReduxState) => state.devInfo.isOnline;

export default devInfoSlice.reducer;
