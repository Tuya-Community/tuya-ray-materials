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

export const responseUpdateDp = responseUpdateDpCreator();
/**
 * 请全程使用该方法进行下发!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  dispatch(updateDp({ switch: true }, options))
 */
export const updateDp = updateDpCreator<UpdateDpStatePayload>();

/**
 * Slice
 */
const dpStateSlice = createSlice({
  name: 'dpState',
  initialState: {} as DpState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(devInfoChange, (state, action) => {
      const { state: devState } = action.payload;
      return { ...state, ...(devState as DpState) };
    });
    builder.addCase(responseUpdateDp, (state, action: PayloadAction<UpdateDpStatePayload>) => ({
      ...state,
      ...action.payload,
    }));
  },
});

export default dpStateSlice.reducer;

/**
 * Selectors
 */
export const selectDpState = (state: ReduxState) => state.dpState;

type SelectDpState = <T extends DpStateKey>(dpCode: T) => (state: ReduxState) => DpState[T];
/* 选择一个dp值 */
export const selectDpStateByCode: SelectDpState = dpCode => state => state.dpState[dpCode];

/* 选择多个dp值的集合 */
export const selectDpStateMultiple =
  <T extends DpStateKey>(keys: T[]) =>
  (state: ReduxState) =>
    keys.map(key => state.dpState[key]);
