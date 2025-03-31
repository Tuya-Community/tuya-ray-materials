import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type IpcCommon = {
  mainDeviceCameraConfig: {
    isSupportedTalk: boolean;
    isSupportedSound: boolean;
    supportedAudioMode: number;
    supportedTalkType: number[];
    videoClarityList: number[];
    videoClarity: number;
  };
  isRecording: boolean; // 是否录制中
  recordSuccess: boolean; // 录制、截图成功
  recordType: number; // 当前是截图还是录像 1：截图 2：录像
  isPreview: boolean; // 是否预览中
  isFull: boolean;
  fullPlayer: boolean;
  streamStatus: number; // 视频流状态 1：正常 2：失败
  loadText: string;
  devStreamStatus: number; // 设备流状态
  playerCtx: any;
  talkTime: number;
  isTwoTalking: boolean;
  recordTime: number;
  isMute: boolean;
  isOneTalking: boolean;
  clarity: string;
  recordPic: any[];
  showFullButton: boolean;
};

/**
 * Slice
 */
const ipcCommonSlice = createSlice({
  name: 'ipcCommon',
  initialState: {
    // 摄像头配置
    mainDeviceCameraConfig: {
      isSupportedTalk: true, // 支持对讲
      isSupportedSound: true, // 支持声音
      supportedAudioMode: 1, // 对讲方式 0 未知；1：单向对讲；2：双向对讲
      supportedTalkType: [1, 2],
      videoClarityList: [2, 4], // 清晰度列表
      videoClarity: 4, // 默认清晰度
    },
    isRecording: false, // 是否录制中
    recordSuccess: false, // 录制、截图成功
    recordType: 1, // 当前是截图还是录像 1：截图 2：录像
    isPreview: false, // 是否预览中
    isFull: false,
    fullPlayer: false,
    streamStatus: 1, // 视频流状态 1：正常 2：失败
    loadText: 'ipc_get_stream',
    devStreamStatus: 0, // 设备流状态
    playerCtx: {},
    talkTime: 0,
    isTwoTalking: false,
    recordTime: 0,
    isMute: true,
    isOneTalking: false,
    clarity: 'hd',
    recordPic: [],
    showFullButton: true,
  } as IpcCommon,
  reducers: {
    updateIpcCommon(state, action: PayloadAction<AtLeastOne<IpcCommon>>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */

export const { updateIpcCommon } = ipcCommonSlice.actions;

/**
 * Selectors
 */
type SelectIpcCommonValue = <T extends keyof IpcCommon>(
  key: T
) => (state: ReduxState) => IpcCommon[T];
export const selectIpcCommonValue: SelectIpcCommonValue = key => state => state.ipcCommon[key];

export default ipcCommonSlice.reducer;
