/*
 * @Author: mjh
 * @Date: 2024-12-25 16:40:51
 * @LastEditors: mjh
 * @LastEditTime: 2025-05-22 19:27:13
 * @Description:
 */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { PowerMemoryFunctionalData } from '@/types';

type UiState = {
  /**
   * 断电记忆中的自定义颜色
   */
  customColor: {
    /**
     * 颜色模式，白光或彩光
     */
    colorMode: 'white' | 'colour';
    /**
     * 彩光中色相
     */
    hue: number;
    /**
     * 彩光中的饱和度
     */
    saturation: number;
    /**
     * 彩光中的亮度
     */
    value: number;
    /**
     * 白光中的亮度
     */
    brightness: number;
    /**
     * 白光中的色温
     */
    temperature: number;
  };
  styleData: PowerMemoryFunctionalData;
};
export const CUSTOM_COLOR_STATIC = {
  colorMode: 'white',
  hue: 0,
  saturation: 1000,
  value: 1000,
  brightness: 1000,
  temperature: 1000,
};
/**
 * Slice
 */
const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    customColor: {
      ...CUSTOM_COLOR_STATIC,
    },
    styleData: {},
  } as UiState,
  reducers: {
    updateCustomColor(state, action: PayloadAction<Partial<UiState['customColor']>>) {
      const newCustomColor = { ...state.customColor, ...action.payload };
      const errorColorKey = Object.keys(newCustomColor).find(key => newCustomColor[key] < 0);
      if (errorColorKey) {
        console.error(`❌错误的参数：${errorColorKey} = ${newCustomColor[errorColorKey]}`);
      }
      let { colorMode } = action.payload;
      if (!colorMode) {
        const { brightness, temperature } = newCustomColor;
        colorMode = brightness === 0 && temperature === 0 ? 'colour' : 'white';
      }
      state.customColor = { ...newCustomColor, colorMode };
    },
    upDateStyleData(state, action: PayloadAction<Partial<UiState['styleData']>>) {
      state.styleData = action.payload;
    },
  },
});

/**
 * Actions
 */
export const { updateCustomColor, upDateStyleData } = uiStateSlice.actions;

export const selectCustomColor = (state: ReduxState) => state.uiState.customColor;
export const selectStyleData = (state: ReduxState) => state.uiState.styleData;

export default uiStateSlice.reducer;
