import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TypeDevInfo = Partial<{
  // 第一部分
  inverterDailyCharge: string; // 当日充电量
  inverterDailyDischarge: string; // 当日放电量
  inverterEsTotalCharge: string; // 累计充电量
  inverterEsTotalDischarge: string; // 累计放电量
  inverterSoc: string; // 当天电量
  inverterSoh: string; // 电池健康度
  inverterStatus: string; // 逆变器状态
  inverterWorkMode: string; // 能源模式

  // 第二部分
  eleProduce: string; // 当天发电量
  inverterWorkModeSetting: string; // 能源模式
  netOutput: string; // 净输出
  score: string; // 得分

  inverterDcVoltage1: string; // 1号当前电压
  inverterDcCurrent1: string; // 1号当前电流
  inverterPv1InputPower: string; // 1号当前功率

  inverterDcVoltage2: string; // 2号当前电压
  inverterDcCurrent2: string; // 2号当前电流
  inverterPv2InputPower: string; // 2号当前功率

  inverterDcVoltage3: string; // 3号当前电压
  inverterDcCurrent3: string; // 3号当前电流
  inverterPv3InputPower: string; // 3号当前功率

  inverterDcVoltage4: string; // 4号当前电压
  inverterDcCurrent4: string; // 4号当前电流
  inverterPv4InputPower: string; // 4号当前功率

  // 第三部分
  loadPower: string; // 负载功率
  pvPower: string; // pv功率

  // 第四部分
  inverterModeApiData: Array<{ code: string; langValue: string; time: number; value: string }>;
  // [{
  //   code: 'inverter_work_mode_setting',
  //   langValue: '电池优先',
  //   time: 1733141891782,
  //   value: '电池优先',
  // }];

  // 第五部分 ttt设备信息
  isOnline: boolean;

  // 第六部分 收益相关
  fitVal: string;
  dayIncome: string;
  totalIncome: string;
  curUnit: string;
}>;

/**
 * Slice
 */
const devInfoSlice = createSlice({
  name: 'devInfo',
  initialState: {
    // 第一部分
    inverterDailyCharge: '',
    inverterDailyDischarge: '',
    inverterEsTotalCharge: '',
    inverterEsTotalDischarge: '',
    inverterSoc: '',
    inverterSoh: '',
    inverterStatus: '',
    inverterWorkMode: '',

    // 第二部分
    eleProduce: '',
    inverterWorkModeSetting: '',
    netOutput: '',
    score: '',

    inverterDcVoltage1: '0',
    inverterDcCurrent1: '0',
    inverterPv1InputPower: '0',

    inverterDcVoltage2: '0',
    inverterDcCurrent2: '0',
    inverterPv2InputPower: '0',

    inverterDcVoltage3: '0',
    inverterDcCurrent3: '0',
    inverterPv3InputPower: '0',

    inverterDcVoltage4: '0',
    inverterDcCurrent4: '0',
    inverterPv4InputPower: '0',

    // 第三部分
    loadPower: '',
    pvPower: '0',

    // 第四部分
    inverterModeApiData: [{ code: '', langValue: '-', time: 0, value: '-' }],

    // 第五部分 ttt 设备信息
    isOnline: false,

    // 第六部分 收益相关
    fitVal: '-',
    dayIncome: '-',
    totalIncome: '-',
    curUnit: '',
  } as TypeDevInfo,
  reducers: {
    initializeDevInfo(state, action: PayloadAction<TypeDevInfo>) {
      return action.payload;
    },
    updateDevInfo(state, action: PayloadAction<Partial<TypeDevInfo>>) {
      Object.assign(state, action.payload);
    },
  },
});

/**
 * Actions
 */

export const { initializeDevInfo, updateDevInfo } = devInfoSlice.actions;

export default devInfoSlice.reducer;
