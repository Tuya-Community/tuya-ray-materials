import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responseUpdateDpCreator, updateDpCreator } from '@ray-js/tuya-dp-kit';
import {
  broadcastModeCode,
  batteryPercentageCode,
  leftearBatteryPercentageCode,
  rightearBatteryPercentageCode,
  volumeSetCode,
  changeControlCode,
  playCode,
  noiseModeCode,
  noiseScenesCode,
  transparencyScenesCode,
  noiseSetCode,
  deviceFindCode,
  breakReminderCode,
  reconnectReminderCode,
  phoneDisconAlarmCode,
  phoneReconAlarmCode,
  eqModeCode,
  eqDataCode,
  leftButton1Code,
  rightButton1Code,
  buttonResetCode,
  bluetoothStateCode,
  resetCode,
  bluetoothNameCode,
  eqSwitchCode,
  trnSetCode,
  factoryResetCode,
  softVersionCode,
  recordInterruptCode,
  recordControlCode,
  aiModeCode,
} from '@/config/dpCodes';
import { devInfoChange } from './devInfoSlice';
import { ReduxState } from '..';

export type DpState = {
  /**
   * 在此自定义你的当前项目 dp type
   */
  [broadcastModeCode]: 'interrupt' | 'drop' | 'off';
  [batteryPercentageCode]: number;
  [leftearBatteryPercentageCode]: number;
  [rightearBatteryPercentageCode]: number;
  [volumeSetCode]: number;
  [changeControlCode]: 'last' | 'next';
  [playCode]: boolean;
  [noiseModeCode]: 'noise_cancellation' | 'off' | 'transparency';
  [noiseScenesCode]: 'commuting' | 'indoor' | 'outdoor' | 'noise_set';
  [transparencyScenesCode]: 'transparency' | 'vocal' | 'trn_set';
  [noiseSetCode]: number;
  [deviceFindCode]: boolean;
  [breakReminderCode]: boolean;
  [reconnectReminderCode]: boolean;
  [phoneDisconAlarmCode]: boolean;
  [phoneReconAlarmCode]: boolean;
  [eqModeCode]:
  | 'mode_1'
  | 'mode_2'
  | 'mode_3'
  | 'mode_4'
  | 'mode_5'
  | 'mode_6'
  | 'mode_7'
  | 'mode_8';
  [eqDataCode]: string;
  [leftButton1Code]:
  | 'down'
  | 'up'
  | 'next'
  | 'previous'
  | 'play'
  | 'ambient_sound'
  | 'voice_assistant';
  [rightButton1Code]:
  | 'down'
  | 'up'
  | 'next'
  | 'previous'
  | 'play'
  | 'ambient_sound'
  | 'voice_assistant';
  [buttonResetCode]: boolean;
  [bluetoothStateCode]: 'disconnect' | 'connecting' | 'connected';
  [resetCode]: boolean;
  [bluetoothNameCode]: string;
  [eqSwitchCode]: boolean;
  [trnSetCode]: number;
  [factoryResetCode]: boolean;
  [softVersionCode]: string;
  [recordInterruptCode]: 'start' | 'end';
  [recordControlCode]: string;
  [aiModeCode]: 'meeting' | 'phone';
};

export type DpStateKey = keyof DpState;

type UpdateDpStatePayload = Partial<DpState>;

export const responseUpdateDevsDp = responseUpdateDpCreator();
/**
 * 请全程使用该方法进行下发!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  dispatch(updateDp({ switch: true }, options))
 */
export const updateDp = updateDpCreator<UpdateDpStatePayload>();
type dpItem = {
  devId: string;
  dpCodes: DpState
}
export type ResponseUpdateDevsDpPayload = {
  deviceId: string;
  dps: Partial<DpState>;
};
/**
 * Slice
 */
const dpStateSlice = createSlice({
  name: 'devsDpState',
  initialState: [] as dpItem[],
  reducers: {},
  extraReducers: builder => {
    builder.addCase(devInfoChange, (state, action) => {
      const { devId, state: devState } = action.payload;
      // 查找是否已存在该设备
      const devIndex = state.findIndex(item => item.devId === devId);
      if (devIndex > -1) {
        // 设备已存在，更新 dp 状态
        state[devIndex] = {
          ...state[devIndex],
          dpCodes: {
            ...state[devIndex].dpCodes,
            ...devState,
          },
        };
      } else {
        // 设备不存在，添加新设备
        state.push({ devId, dpCodes: devState });
      }
    });
    builder.addCase(responseUpdateDevsDp, (state, action: PayloadAction<ResponseUpdateDevsDpPayload>) => {
      const { deviceId: devId, dps } = action.payload;
      const devIndex = state.findIndex(item => item.devId === devId);
      if (devIndex > -1) {
        state[devIndex] = {
          ...state[devIndex],
          dpCodes: {
            ...state[devIndex].dpCodes,
            ...dps,
          },
        };
      } else {
        state.push({ devId, dpCodes: { ...dps } as DpState });
      }
    });
  },
});

export default dpStateSlice.reducer;

/**
 * Selectors
 */
export const selectDpState = (state: ReduxState) => state.dpState;

type SelectDpState = <T extends DpStateKey>(devId, dpCode: T) => (state: ReduxState) => DpState[T];
/* 选择一个dp值 */
export const selectDpStateByDev: SelectDpState = (devId, dpCode) => state => {
  return state.devsDpState.find(item => item.devId === devId)?.dpCodes[dpCode]
};

/* 选择多个dp值的集合 */
export const selectDpStateMultiple =
  <T extends DpStateKey>(keys: T[]) =>
    (state: ReduxState) =>
      keys.map(key => state.dpState[key]);
