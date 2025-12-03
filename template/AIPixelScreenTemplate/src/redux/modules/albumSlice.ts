import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import globalStorage from '@/redux/storage';
import { Photo } from '@/types';

type Album = {
  /**
   * 必要的数据是否已初始化完毕
   */
  isInitialized: boolean;
  /**
   * 当前设备 ID 维度已添加过的相册列表
   */
  photos: Photo[];
};

/**
 * Slice
 */
const albumSlice = createSlice({
  name: 'album',
  initialState: {
    isInitialized: false,
    tabBarRect: {},
    photos: [],
  } as Album,
  reducers: {
    setIsInitialized(state) {
      state.isInitialized = true;
    },
    setPhotos(state, action: PayloadAction<Photo[]>) {
      state.photos = action.payload;
    },
  },
});

/**
 * Actions
 */

export const { setIsInitialized, setPhotos } = albumSlice.actions;

/**
 * Effects
 */

const storageKey = 'pohtos';

/**
 * 初始化用户已选择的照片列表
 */
export const initPhotosAsync = createAsyncThunk('album/initPhotosAsync', async (_, thunkApi) => {
  try {
    let data = await globalStorage.get(storageKey);
    data = data || [];
    // data = [
    //   { path: '/images/testMin.png', id: 0, md5: 'qew1' },
    //   { path: '/images/testMin.png', id: 1, md5: 'qew2' },
    //   { path: '/images/testMin.png', id: 2, md5: 'qew3' },
    //   { path: '/images/testMin.png', id: 3, md5: 'qew4' },
    //   { path: '/images/testMin.png', id: 4, md5: 'qew5' },
    // ];
    console.log('=== initPhotosAsync res', data);
    thunkApi.dispatch(albumSlice.actions.setIsInitialized());
    // @ts-ignore
    thunkApi.dispatch(albumSlice.actions.setPhotos(data));
    return data;
  } catch (error) {
    thunkApi.dispatch(albumSlice.actions.setPhotos([]));
    console.error('=== initPhotosAsync error', error);
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
      await globalStorage.set({ key: storageKey, data: newPhotos });
      thunkApi.dispatch(albumSlice.actions.setPhotos(newPhotos));
      return true;
    } catch (error) {
      console.error('=== addPhotosAsync error', error);
      return false;
    }
  }
);

/**
 * 删除缓存的照片
 */
export const deletePhotosAsync = createAsyncThunk<boolean, Photo>(
  'album/deletePhotosAsync',
  async (photo, thunkApi) => {
    try {
      const globalState = thunkApi.getState() as ReduxState;
      const curPhotos = globalState.album.photos;
      const newPhotos = curPhotos.filter(item => item.md5 !== photo.md5);
      await globalStorage.set({ key: storageKey, data: newPhotos });
      thunkApi.dispatch(albumSlice.actions.setPhotos(newPhotos));
      return true;
    } catch (error) {
      console.error('=== deletePhotosAsync error', error);
      return false;
    }
  }
);

/**
 * Selectors
 */
export const selectIsInitialized = (state: ReduxState) => state.album.isInitialized;
export const selectPhotos = (state: ReduxState) => state.album.photos;

export default albumSlice.reducer;
