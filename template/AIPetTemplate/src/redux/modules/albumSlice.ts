import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { photosStorage } from '@/devices';
import { getBoundingClientRect, getElementById } from '@ray-js/ray';

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

type Photo = {
  height: number;
  thumbTempFilePath: string;
  width: number;
  size: number;
  duration: number;
  tempFilePath: string;
  originalVideoPath?: string;
  originUrl?: string; // 原始路径
  fileType: 'image' | 'video';
};

type Album = {
  /**
   * 必要的数据是否已初始化完毕
   */
  isInitialized: boolean;
  /**
   * tabBar 的位置信息
   */
  tabBarRect?: Rect;
  /**
   * 当前设备 ID 维度已添加过的相册列表
   */
  photos: Photo[];

  /**
   * 当前正在预览或编辑中的视频地址
   */
  currentVideo: string;
};

/**
 * Slice
 */
const albumSlice = createSlice({
  name: 'album',
  initialState: {
    isInitialized: true,
    tabBarRect: {},
    photos: [],
  } as Album,
  reducers: {
    setIsInitialized(state) {
      state.isInitialized = true;
    },

    setTabBarRect(state, action: PayloadAction<Rect>) {
      state.tabBarRect = action.payload;
    },

    setPhotos(state, action: PayloadAction<Photo[]>) {
      state.photos = action.payload;
    },

    setCurrentVideo(state, action: PayloadAction<string>) {
      state.currentVideo = action.payload;
    },
  },
});

/**
 * Actions
 */

export const { setIsInitialized, setPhotos, setCurrentVideo } = albumSlice.actions;

/**
 * Effects
 */

/**
 * 初始化用户已选择的照片列表
 */
export const initPhotosAsync = createAsyncThunk('album/initPhotosAsync', async (_, thunkApi) => {
  try {
    const data = await photosStorage.get();
    console.log('=== initPhotosAsync res', data);
    thunkApi.dispatch(albumSlice.actions.setIsInitialized());
    thunkApi.dispatch(albumSlice.actions.setPhotos(data));
    return data;
  } catch (error) {
    console.log('=== initPhotosAsync error', error);
    thunkApi.dispatch(albumSlice.actions.setPhotos([]));
    return [];
  }
});

/**
 * 往缓存里新增选择的照片
 */
export const addPhotosAsync = createAsyncThunk<boolean, Photo[]>(
  'album/addPhotosAsync',
  async (photos, thunkApi) => {
    try {
      const globalState = thunkApi.getState() as ReduxState;
      const curPhotos = globalState.album.photos;
      const newPhotos = [...photos, ...curPhotos];
      await photosStorage.save(newPhotos);
      thunkApi.dispatch(albumSlice.actions.setPhotos(newPhotos));
      return true;
    } catch (error) {
      console.log('=== addPhotosAsync error', error);
      return false;
    }
  }
);

/**
 * Selectors
 */
export const selectIsInitialized = (state: ReduxState) => state.album.isInitialized;
export const selectPhotos = (state: ReduxState) => state.album.photos;
export const selectCurrentVideo = (state: ReduxState, idx: number) => state.album.photos[idx];

export default albumSlice.reducer;
