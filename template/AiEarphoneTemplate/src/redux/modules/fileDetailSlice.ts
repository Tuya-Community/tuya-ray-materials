/*
 * @Author: hkc
 * @Date: 2025-07-11 14:30:13
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-05 18:19:01
 * @Description: 文件详情状态管理
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { SummaryTemplateInfo } from '@/api/interface';
import { deleteCustomTemplate } from './customTemplateSlice';

export enum GenerateType {
  Transcribe,
  Summarize,
  Translate,
}

type FileDetailState = {
  selectTemplateShow: boolean; // 选择模板弹窗
  generateType: GenerateType | null; // 生成类型
  selectedTemplate: string | null; // 选择的模板
  selectedTemplateInfo: SummaryTemplateInfo | null; // 选择的模板信息
};

/**
 * Slice
 */
const fileDetailSlice = createSlice({
  name: 'fileDetail',
  initialState: {
    selectTemplateShow: false,
    generateType: null,
    selectedTemplate: null,
    selectedTemplateInfo: null,
  } as FileDetailState,
  reducers: {
    updateFileDetail(state, action: PayloadAction<Partial<FileDetailState>>) {
      return { ...state, ...action.payload };
    },
    resetFileDetail(state) {
      return {
        selectTemplateShow: false,
        generateType: null,
        selectedTemplate: null,
        selectedTemplateInfo: null,
      };
    },
  },
  extraReducers: builder => {
    // 删除自定义模板后，重置选中的模板
    builder.addCase(deleteCustomTemplate.fulfilled, (state, action) => {
      if (
        state.selectedTemplate === action.payload ||
        state.selectedTemplateInfo?.id === action.payload
      ) {
        state.selectedTemplate = null;
        state.selectedTemplateInfo = null;
      }
    });
  },
});

/**
 * Actions
 */

export const { updateFileDetail, resetFileDetail } = fileDetailSlice.actions;

/**
 * Selectors
 */
export const selectFileDetail = (state: ReduxState) => state.fileDetail;

export default fileDetailSlice.reducer;
