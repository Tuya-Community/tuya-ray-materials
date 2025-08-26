import React from 'react';

/*
 * @Author: mjh
 * @Date: 2025-02-13 16:19:39
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-09 18:03:12
 * @Description:
 */
export type ColorModeType = 'white' | 'colour';
export interface ColourCustom {
  /** 彩光 色值 0-360 */
  hue: number;
  /** 彩光 饱和度 0-1000 */
  saturation: number;
  /** 彩光 亮度 0-1000 */
  value: number;
}
export interface WhiteCustom {
  /** 白光 亮度 1-1000 */
  brightness: number;
  /** 白光 色温 0-1000 */
  temperature: number;
}
export interface CustomColor extends WhiteCustom, ColourCustom {
  /** 模式 白光或者彩光 */
  colorMode: ColorModeType;
}

export interface PowerMemoryFunctionalData {
  /** 自定义模式时 灯的状态 */
  customColor?: Partial<CustomColor>;
  /** 自定义模式时 收藏的彩光颜色列表 */
  collectColors?: ColourCustom[];
  /** 自定义模式时 收藏的白光颜色列表 */
  collectWhites?: WhiteCustom[];
  /** 背景样式 */
  bgStyle?: React.CSSProperties;
  /** smart ui 组件样式 */
  smartUIThemeVars?: Record<string, string>;
  cardStyle?: React.CSSProperties;
  /** 主题色 */
  themeColor?: string;
  tabLineStyle?: React.CSSProperties;
  tabLineActiveStyle?: React.CSSProperties;
  background?: string;
  collectBorderColor?: string;
  fontColor?: string;
  /** 动态下发数据 */
  dynamicDistribute?: boolean;
}
