import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TabType } from '@/constant';
import { HeightUnit, WeightUnit } from '@/utils/unit';

export interface UIState {
  devOnlineTime: number;
  defaultUser: string;
  targetWeightUnit: WeightUnit;
  targetHeightUnit: HeightUnit;
  avatars: any;
  userList: UserInfo[];
  type: DataType;
  userInfo: UserInfo | null;
  bleState: boolean;
  isBleOnline: boolean; // 设备是否在线
  tab: TabType;
  bpNumberList: any;
  bpPercentList: any;
  bpColorList: any;
  totalNum: number;
  needCompleteInfo: boolean;
  filtedDataList: FiltedData;
  latestData: LatestData<LatestDataList>;
  trendData: LatestData<LatestDataList>;
  haveDataDateList: any;
  latestDetailedData: FiltedData;
  unallocatedData: UnallocatedData;
  allUnallocatedData: UnallocatedData;
  currentUserType: number;
  addSuccess: boolean;
  isFirstLoading: boolean;
  saveUserSuccess: boolean;
  deleteUserSuccess: boolean;
  filterBp: string;
  filterRemark: string;
  isShowSwitchUser: boolean;
  isNeedToComplete: boolean;
  themeColor: string;
}

const initialState: UIState = {
  devOnlineTime: 0,
  defaultUser: '',
  targetWeightUnit: WeightUnit.kg,
  targetHeightUnit: HeightUnit.cm,
  avatars: [],
  type: 'week',
  userList: [],
  userInfo: null,
  bleState: false,
  isBleOnline: false,
  tab: TabType.Measure,
  bpNumberList: [],
  bpPercentList: [],
  bpColorList: [],
  totalNum: 0,
  needCompleteInfo: false,
  filtedDataList: { datas: [], hasNext: false, totalCount: 0, pageNo: 0, pageSize: 0 },
  latestData: {
    list: [],
    avgData: {
      avgTotalSys: 0,
      avgTotalDia: 0,
      avgTotalPulse: 0,
    },
  },
  trendData: {
    list: [],
    avgData: {
      avgTotalSys: 0,
      avgTotalDia: 0,
      avgTotalPulse: 0,
    },
  },
  haveDataDateList: [],
  latestDetailedData: { datas: [], hasNext: false, totalCount: 0, pageNo: 0, pageSize: 0 },
  unallocatedData: { datas: [], hasNext: false, totalCount: 0 },
  allUnallocatedData: { datas: [], hasNext: false, totalCount: 0 },
  currentUserType: 0,
  addSuccess: false,
  isFirstLoading: false,
  saveUserSuccess: false,
  deleteUserSuccess: false,
  filterBp: '',
  filterRemark: '',
  isShowSwitchUser: false,
  isNeedToComplete: false,
  themeColor: '#0d6acb',
};

/**
 * Slice
 */
const uiSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateUI(state, action: PayloadAction<Partial<UIState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

/**
 * Actions
 */
export const { updateUI } = uiSlice.actions;

export default uiSlice.reducer;
