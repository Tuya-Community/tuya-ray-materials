import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CommonState = {
  aiPickerColors: Array<{ h: number; s: number; v?: number }>;
  diyEditColors: Array<{ h: number; s: number; v: number; id?: number }>;
  scrollable: boolean;
  isOnNet: boolean;
  scrollTop: number;
  inner_work_mode: string;
  stripCheckAll: boolean; // 灯珠是否全选中了
  checkedIdList: any[]; // 选中的灯珠id
};

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    aiPickerColors: [],
    scrollTop: 0,
    scrollable: true,
    isOnNet: true,
    inner_work_mode: null,
    stripCheckAll: false, // 灯珠是否全选中了
    checkedIdList: [], // 选中的灯珠id
  } as CommonState,
  reducers: {
    updateAiPickerColors(state, action: PayloadAction<CommonState['aiPickerColors']>) {
      state.aiPickerColors = action.payload;
    },
    updateDiyEditColors(state, action: PayloadAction<CommonState['diyEditColors']>) {
      state.diyEditColors = action.payload;
    },
    updateScroll(state, action: PayloadAction<CommonState['scrollable']>) {
      state.scrollable = action.payload;
    },
    updateScrollTop(state, action: PayloadAction<CommonState['scrollTop']>) {
      state.scrollTop = action.payload;
    },
    updateInnerWorkMode(state, action: PayloadAction<CommonState['inner_work_mode']>) {
      state.inner_work_mode = action.payload;
    },
    updateStripCheckAll(state, action: PayloadAction<CommonState['stripCheckAll']>) {
      state.stripCheckAll = action.payload;
    },
    updateCheckedIdList(state, action: PayloadAction<CommonState['checkedIdList']>) {
      state.checkedIdList = action.payload;
    },
  },
});

export const commonActions = commonSlice.actions;

export default commonSlice.reducer;
