import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

interface UiState {
  loading: boolean;
  imageHost: string;
  initStreamSuccess: boolean;
  openStreamSuccess: boolean;
  aiModel: {
    init: boolean;
    progress: number;
  };
  aiReport: {
    nonOral: boolean; //	是否非口腔图片
    diseaseType: (
      | 'Calculus' // 结石
      | 'Caries' // 龋齿
      | 'Gingivitis' // 牙龈炎
      | 'Ulcers' // 溃疡
      | 'Discoloration' // 牙齿变色
      | 'Hypodontia'
    )[]; // 牙齿发育不全
    sunlightPath: string; // 日光模式滤镜
    chromaPath: string; // 牙周模式滤镜图
    grayscalePath: string; //	龋齿模式滤镜图
    heatMapPath: string; //	模型热力图
  };
}
/**
 * Slice
 */
const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    imageHost: '',
    loading: false,
    aiModel: {
      init: false,
      progress: 0,
    },
    aiReport: {},
  } as UiState,
  reducers: {
    updateUiState(state, action: PayloadAction<Partial<any>>) {
      return { ...state, ...action.payload };
    },
    updateAiModelProgress(state, action: PayloadAction<number>) {
      return { ...state, aiModel: { ...state.aiModel, progress: action.payload } };
    },
    updateAiReport(state, action: PayloadAction<Partial<UiState['aiReport']>>) {
      return { ...state, aiReport: { ...state.aiReport, ...action.payload } };
    },
  },
});

/**
 * Actions
 */
export const { updateUiState, updateAiModelProgress, updateAiReport } = uiStateSlice.actions;

/**
 * Selectors
 */

export const selectUiState = (state: ReduxState) => state.uiState;

export const selectUiStateByKey = key => state => state.uiState[key];

export default uiStateSlice.reducer;
