import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { atopGetImageHost } from '@/api/common';
import Strings from '@/i18n';

type TabKey = 'home' | 'history' | 'seeting';
type ProductStyle = 'buds' | 'card';

interface UiState {
  currTab: TabKey;
  imageHost: string;
  isEditMode: boolean;
  productStyle: ProductStyle;
  tempMarkdownText: string;
  modeConfigList: string[];
  isBtEntryVersion: boolean; // 是否是入门版耳机
}

// const getImageBasePath = () => {
//   return new Promise(resolve => {
//     resolve('');
//   });
// };

export const getImageHost = createAsyncThunk('uiState/getImageHost', async () => {
  const imageHost = (await atopGetImageHost()) as string;
  // return imageHost;
  return '';
});

export const getSupportLangList = createAsyncThunk('uiState/getSupportLangList', async () => {
  const supportLangList = [
    'en',
    'zh',
    'fr',
    'de',
    'ru',
    'ar',
    'it',
    'ja',
    'ko',
    'es',
    'pt',
    'es_419',
    'zh_tw',
    'en_GB',
    'en_US',
    'pt_BR',
    'en_AU',
    'en_NZ',
    'sq',
    'hy',
    'az',
    'bn',
    'bs',
    'bg',
    'my',
    'hr',
    'cs',
    'da',
    'nl',
    'et',
    'fil',
    'fi',
    'el',
    'gu',
    'he',
    'hi',
    'hu',
    'id',
    'jv',
    'kk',
    'lo',
    'lv',
    'lt',
    'mk',
    'ms',
    'mr',
    'mn',
    'ne',
    'no',
    'fa',
    'pl',
    'ro',
    'sr',
    'sk',
    'sl',
    'sw',
    'sv',
    'ta',
    'te',
    'th',
    'tr',
    'uk',
    'ur',
    'uz',
    'vi',
  ].map(code => ({
    // @ts-ignore
    display: Strings.getLang(`lang_${code}`),
    lang: code,
    localKey: code,
  }));

  return supportLangList;
});

/**
 * Slice
 */
const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    currTab: 'history', // 首页tab栏状态
    imageHost: '',
    isEditMode: false, // 首页编辑状态
    productStyle: 'buds', // 设备类型 buds/card 耳机/卡片 默认耳机
    tempMarkdownText: '',
    supportLangList: [],
    modeConfigList: ['meeting', 'call', 'realtime', 'simultaneous'], // 模式配置列表
    isBtEntryVersion: false, // 是否是入门版耳机
  } as UiState,
  reducers: {
    updateUiState(state, action: PayloadAction<Partial<any>>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder.addCase(getSupportLangList.fulfilled, (state, action) => ({
      ...state,
      supportLangList: action.payload,
    }));
  },
});

/**
 * Actions
 */
export const { updateUiState } = uiStateSlice.actions;

/**
 * Selectors
 */

export const selectUiState = (state: ReduxState) => state.uiState;

export const selectUiStateByKey = key => state => state.uiState[key];

export default uiStateSlice.reducer;
