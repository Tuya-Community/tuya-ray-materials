import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import globalStorage from '@/redux/storage';
import { Photo } from '@/types';

type Diy = {
  /**
   * 必要的数据是否已初始化完毕
   */
  isInitialized: boolean;
  /**
   * 当前设备 ID 维度 diy列表
   */
  diyList: Photo[];
};

/**
 * Slice
 */
const diySlice = createSlice({
  name: 'diy',
  initialState: {
    isInitialized: false,
    diyList: [],
  } as Diy,
  reducers: {
    setIsInitialized(state) {
      state.isInitialized = true;
    },
    setDiyList(state, action: PayloadAction<Photo[]>) {
      state.diyList = action.payload;
    },
  },
});

/**
 * Actions
 */

export const { setIsInitialized, setDiyList } = diySlice.actions;

/**
 * Effects
 */

const storageKey = 'diy';

/**
 * 初始化用户已选择的照片列表
 */
export const initDiyAsync = createAsyncThunk('diy/initDiyAsync', async (_, thunkApi) => {
  try {
    let data = await globalStorage.get(storageKey);
    data = data || [];
    console.log('=== initDiyAsync res', data);
    thunkApi.dispatch(diySlice.actions.setIsInitialized());
    // @ts-ignore
    thunkApi.dispatch(diySlice.actions.setDiyList(data));
    return data;
  } catch (error) {
    thunkApi.dispatch(diySlice.actions.setDiyList([]));
    console.error('=== initDiyAsync error', error);
    return [];
  }
});

/**
 * 往缓存里新增选择的照片
 */
export const addDiysAsync = createAsyncThunk<boolean, Photo[]>(
  'diy/addDiyAsync',
  async (list, thunkApi) => {
    try {
      const globalState = thunkApi.getState() as ReduxState;
      const curList = globalState.diy.diyList;
      const newList = [...list, ...curList];
      await globalStorage.set({ key: storageKey, data: newList });
      thunkApi.dispatch(diySlice.actions.setDiyList(newList));
      return true;
    } catch (error) {
      console.error('=== addDiyAsync error', error);
      return false;
    }
  }
);

/**
 * 删除缓存的照片
 */
export const deleteDiyAsync = createAsyncThunk<boolean, Photo>(
  'diy/deleteDiyAsync',
  async (photo, thunkApi) => {
    try {
      const globalState = thunkApi.getState() as ReduxState;
      const curList = globalState.diy.diyList;
      const newList = curList.filter(item => item.md5 !== photo.md5);
      await globalStorage.set({ key: storageKey, data: newList });
      thunkApi.dispatch(diySlice.actions.setDiyList(newList));
      return true;
    } catch (error) {
      console.error('=== deleteDiyAsync error', error);
      return false;
    }
  }
);

/**
 * Selectors
 */
export const selectIsInitialized = (state: ReduxState) => state.diy.isInitialized;
export const selectDiyList = (state: ReduxState) => state.diy.diyList;

export default diySlice.reducer;
