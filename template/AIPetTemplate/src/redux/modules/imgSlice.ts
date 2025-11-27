import { createSlice } from '@reduxjs/toolkit';
import { ImgItem } from '@/types';
import { ReduxState } from '..';

type ImgConfigType = {
  sid: string;
  prefix: string; // 批次，避免文件相互覆盖,长度<=16
  meta: string; // 附加数据，用于后续逻辑
  credentials: {
    provider: string; // 对象存储类型：目前需要支持S3、OSS、COS、Blob、GBlob
    endpoint: string;
    bucket: string;
    path: string;
    ak: string; // 临时签名
    sk: string;
    token: string; // <= 4K
    expire: number; // 过期时间(ms)
  };
  skill: {
    'sdk-ver': string; // sdk版本
    resolution: string; // 分辨率 "1920x1080"
    'allow-formats': string[]; // ["png","jpg","mp4"], //支持格式
    'max-fc': number; // 可选，单次最大传输文件数量，默认10
    'max-fs': number; // 可选，最大单文件(包括分片)大小，默认10M
  };
};

/**
 * Slice
 */
const imgListSlice = createSlice({
  name: 'imgInfo',
  initialState: {
    videoCheckedList: [] as string[],
    imgCheckedList: [] as ImgItem[],
    imgConfigData: {} as ImgConfigType, // 图片配置信息
    imgAiFilterData: [] as { code: string; name: string; image: string; from: string }[], // AI 滤镜数据
    imgHoistKey: '',
    imgCheckedListMap: {} as { currentTab: string; currentImgId: number; isStatic: boolean }, // 缓存数据
  },
  reducers: {
    updateImgCheckedList(state, action) {
      state.imgCheckedList = action.payload;
    },
    updateImgCheckedListMap(state, action) {
      state.imgCheckedListMap = action.payload;
    },
    updateVideoCheckedList(state, action) {
      state.videoCheckedList = action.payload;
    },
    initAiFilterData(state, action) {
      state.imgAiFilterData = action.payload;
    },
  },
});

/**
 * Actions
 */
export const {
  updateImgCheckedList,
  updateImgCheckedListMap,
  updateVideoCheckedList,
  initAiFilterData,
} = imgListSlice.actions;

/**
 * Selectors
 */
export const selectImgCheckedList = (state: ReduxState) => state.imgInfo.imgCheckedList;
export const selectVideoCheckedList = (state: ReduxState) => state.imgInfo.videoCheckedList;
export const selectImgConfigData = (state: ReduxState) => state.imgInfo.imgConfigData;
export const selectImgAiFilterData = (state: ReduxState) => state.imgInfo.imgAiFilterData;
export const selectImgCheckedListMap = (state: ReduxState) => state.imgInfo.imgCheckedListMap;

export default imgListSlice.reducer;
