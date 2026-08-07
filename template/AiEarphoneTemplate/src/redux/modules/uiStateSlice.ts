import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { atopGetImageHost, atopGetTranslateLangListWithCache } from '@/api/common';
import Strings from '@/i18n';
import { PING_YING_MAP } from '@/constant';
import { CloudSyncStatus, LangSource, RecordMode } from '@/constant/enums';
import { CloudSyncSwitchStatusResult } from '@/api/ttt.interface';
import { SwitchConfigResult, TranslateLangListItem } from '@/api/interface';

type TabKey = 'home' | 'history' | 'seeting';
type ProductStyle = 'buds' | 'card';

interface UiState {
  currTab: TabKey;
  imageHost: string;
  productStyle: ProductStyle;
  tempMarkdownText: string;
  modeConfigList: string[];
  isBtEntryVersion: boolean; // 是否是入门版耳机
  hasNewUserGuide: boolean; // 是否显示过新用户引导
  hasVisitHomeOrRecordingPage: boolean; // 是否访问过首页或者录音页（用于控制 modeKey 跳转）
  benefitRestrictedShow: boolean;
  cloudSyncSwitchStatus: CloudSyncSwitchStatusResult; // 云同步开关状态
  cloudSyncStatus: {
    status: CloudSyncStatus;
    errorCode: number;
  }; // 云同步状态
  switchConfig: SwitchConfigResult; // 开关配置
}

export const getImageHost = createAsyncThunk('uiState/getImageHost', async () => {
  const imageHost = (await atopGetImageHost()) as string;
  return imageHost;
});

const getLangType = (mode: RecordMode | null | undefined) => {
  if (mode === RecordMode.simultaneousInterpretation) {
    return LangSource.Simultaneous;
  }
  if (mode === RecordMode.realTimeRecording) {
    return LangSource.transcription;
  }
  return LangSource.Simultaneous;
};

const processLangList = (langList: TranslateLangListItem[] | null) => {
  if (!langList || langList.length === 0) return [];

  const supportLangList = langList.map(item => ({
    // @ts-ignore
    display: Strings.getLang(`lang_${item.code}`),
    sourceName: item.selfDescribing,
    lang: item.code,
    localKey: item.code,
  }));

  // 获取首字母（中文转拼音首字母，英文直接取首字母）
  const getFirstLetter = str => {
    const firstChar = str[0];
    // 判断是否为中文
    if (/[\u4e00-\u9fa5]/.test(firstChar)) {
      return PING_YING_MAP[firstChar] || 'Z';
    }
    // 非中文，直接返回首字母大写
    return firstChar?.toUpperCase() || '';
  };

  const sortedLangs = supportLangList.sort((a, b) => {
    const aLetter = getFirstLetter(a.display);
    const bLetter = getFirstLetter(b.display);
    return aLetter.localeCompare(bLetter, 'en-US');
  });

  return sortedLangs;
};

export const getSupportLangList = createAsyncThunk<
  ReturnType<typeof processLangList>,
  RecordMode | null | undefined
>('uiState/getSupportLangList', async (mode, { dispatch }) => {
  const source = getLangType(mode);
  let langList = null;
  if (source) {
    const onUpdate = (data: TranslateLangListItem[]) => {
      const processedList = processLangList(data);
      dispatch(getSupportLangList.fulfilled(processedList, mode, undefined));
    };

    const data = await atopGetTranslateLangListWithCache(source, { onUpdate });
    langList = data?.length > 0 ? data : langList;
  }

  return processLangList(langList);
});

/**
 * Slice
 */
const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    currTab: 'history', // 首页tab栏状态
    imageHost: '',
    productStyle: 'buds', // 设备类型 buds/card 耳机/卡片 默认耳机
    tempMarkdownText: '',
    supportLangList: [],
    modeConfigList: ['meeting', 'call', 'realtime', 'simultaneous'], // 模式配置列表
    isBtEntryVersion: false, // 是否是入门版耳机
    hideSetting: false, // 是否隐藏设置
    hasNewUserGuide: false,
    hasVisitHomeOrRecordingPage: false,
    benefitRestrictedShow: false,
    cloudSyncSwitchStatus: {
      enabled: false,
      syncType: 1,
      modifyTime: 0,
    },
    cloudSyncStatus: {
      status: CloudSyncStatus.Disabled,
      errorCode: 0,
    },
    switchConfig: {
      newGift: false,
      subGuide: false,
      homeGift: false,
      quotaGuide: false,
      benefitCard: false,
      vasList: false,
      deviceGuide: false,
      transcribeOptimizeEnabled: false,
      webEntry: true,
      myDevice: true,
    },
  } as UiState,
  reducers: {
    updateUiState(state, action: PayloadAction<Partial<any>>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder.addCase(getImageHost.fulfilled, (state, action) => ({
      ...state,
      imageHost: action.payload,
    }));
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
