import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

export enum EventName {
  'EnumDpChange' = 'enumDpChange',
  'ValueDpChange' = 'valueDpChange',
  'Default' = 'default',
}

type PopupData = {
  key: string;
  title?: string;
  componentKey: string;
  // 是否去掉点击左上角退出按钮时的默认行为，默认为 false，点击按钮会关闭弹窗
  // 如传入 true，则发布 onPopupClose 事件
  disabledDefaultClose?: boolean;
};

type PanelInfo = {
  // 品牌色
  brandColor: string;
  // 播放器填充模式
  playerFit: 'contain' | 'cover';
  // 是否为可预览播放状态
  isPreviewOn: boolean;
  showSmartPopup: { status: boolean; popupData: PopupData };
  showSmartActionSheet: { status: boolean; actionData: any; title: string };
  // 自定义事件分发监听
  customEventDispatch: { eventName: EventName; data: any };
  // 弹窗高度
  popupHeight: number;
  // 是否支持对讲
  isIntercomSupported: boolean;
};

export type PanelInfoKey = keyof PanelInfo;

/**
 * Slice
 */
const panelInfoSlice = createSlice({
  name: 'panelInfo',
  initialState: {
    brandColor: '#FF592A',
    playerFit: 'contain',
    isPreviewOn: false,
    showSmartPopup: { status: false, popupData: null },
    showSmartActionSheet: { status: false, actionData: null, title: null },
    customEventDispatch: { eventName: EventName.Default, data: null },
    popupHeight: 500,
    isIntercomSupported: false,
  } as PanelInfo,
  reducers: {
    initializePanelInfo(state, action: PayloadAction<PanelInfo>) {
      return action.payload;
    },
    updatePanelInfo(state, action: PayloadAction<Partial<PanelInfo>>) {
      Object.assign(state, action.payload);
    },
  },
});

/**
 * Actions
 */

export const { initializePanelInfo, updatePanelInfo } = panelInfoSlice.actions;

/**
 * Selectors
 */
export const selectPanelInfo = (state: ReduxState) => state.panelInfo;

type SelectPanelInfoByKey = <T extends PanelInfoKey>(
  dpCode: T
) => (state: ReduxState) => PanelInfo[T];

export const selectPanelInfoByKey: SelectPanelInfoByKey = key => state => state.panelInfo[key];

export default panelInfoSlice.reducer;
