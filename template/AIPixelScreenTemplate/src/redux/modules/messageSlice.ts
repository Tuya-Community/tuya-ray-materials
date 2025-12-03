import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import globalStorage from '@/redux/storage';
import { Message, LabelData } from '@/types';

type TMessageProps = {
  /**
   * 必要的数据是否已初始化完毕
   */
  isInitialized: boolean;
  /**
   * 当前设备 ID 维度 消息列表
   */
  messageList: Message[];
  labelData: LabelData;
  hasModelInit: boolean;
};

/**
 * Slice
 */
const messageSlice = createSlice({
  name: 'message',
  initialState: {
    isInitialized: false,
    messageList: [],
    labelData: { imageCategory: [] },
    hasModelInit: false,
  } as TMessageProps,
  reducers: {
    setIsInitialized(state) {
      state.isInitialized = true;
    },
    setMessageList(state, action: PayloadAction<Message[]>) {
      state.messageList = action.payload;
    },
    setLabelData(state, action: PayloadAction<LabelData>) {
      state.labelData = action.payload;
    },
    setHasModelInit(state, action: PayloadAction<boolean>) {
      state.hasModelInit = action.payload;
    },
  },
});

/**
 * Actions
 */

export const { setIsInitialized, setMessageList, setLabelData, setHasModelInit } =
  messageSlice.actions;

/**
 * Effects
 */

const storageKey = 'message';

/**
 * 初始化用户已选择的照片列表
 */
export const initMessageAsync = createAsyncThunk(
  'message/initMessageAsync',
  async (_, thunkApi) => {
    try {
      let data = await globalStorage.get(storageKey);
      data = data || [];
      console.log('=== initMessageAsync res', data);
      thunkApi.dispatch(messageSlice.actions.setIsInitialized());
      // @ts-ignore
      thunkApi.dispatch(messageSlice.actions.setMessageList(data));
      return data;
    } catch (error) {
      thunkApi.dispatch(messageSlice.actions.setMessageList([]));
      console.error('=== initMessageAsync error', error);
      return [];
    }
  }
);

/**
 * 更新缓存里的消息
 */
export const updateMessagesAsync = createAsyncThunk<boolean, Message[]>(
  'message/updateMessagesAsync',
  async (list, thunkApi) => {
    try {
      const newList = [...list];
      await globalStorage.set({ key: storageKey, data: newList });
      console.log('=== updateMessagesAsync newList', newList);
      thunkApi.dispatch(messageSlice.actions.setMessageList(newList));
      return true;
    } catch (error) {
      console.error('=== addMessageAsync error', error);
      return false;
    }
  }
);

const labelStorageKey = 'message_label';

/**
 * 初始化标签列表
 */
export const initLabelAsync = createAsyncThunk('message/initLabelAsync', async (_, thunkApi) => {
  try {
    let data = await globalStorage.get(labelStorageKey);
    data = data || { imageCategory: [] };
    console.log('=== initLabelAsync res', data);
    thunkApi.dispatch(messageSlice.actions.setLabelData(data));
    return data;
  } catch (error) {
    thunkApi.dispatch(messageSlice.actions.setLabelData({ imageCategory: [] }));
    console.error('=== initMessageAsync error', error);
    return [];
  }
});

/**
 * 更新缓存里的标签
 */
export const updateLabelAsync = createAsyncThunk<boolean, LabelData>(
  'message/updateLabelAsync',
  async (labelData, thunkApi) => {
    try {
      await globalStorage.set({ key: labelStorageKey, data: labelData });
      console.log('=== updateLabelAsync newList', labelData);
      thunkApi.dispatch(messageSlice.actions.setLabelData(labelData));
      return true;
    } catch (error) {
      console.error('=== updateLabelAsync error', error);
      return false;
    }
  }
);

/**
 * Selectors
 */
export const selectIsInitialized = (state: ReduxState) => state.message.isInitialized;
export const selectMessageList = (state: ReduxState) => state.message.messageList;
export const selectLabelData = (state: ReduxState) => state.message.labelData;
export const selectHasModelInit = (state: ReduxState) => state.message.hasModelInit;

export default messageSlice.reducer;
