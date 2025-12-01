import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { tttGetFilesList, tttRecordTask } from '@/api/ttt';

/** 状态，0未知，1录音中，2暂停，3结束 */
export enum RecordStatus {
  UNKNOWN,
  RECORDING,
  PAUSE,
  FINISH,
}

// 0-呼叫 1-会议 2-同声传译 3-实时转录
export enum RecordType {
  CALL,
  MEETING,
  SIMULTANEOUS,
  REAL,
}

// 0-文件转写 1-实时转写
export enum TransferType {
  FILE,
  REALTIME,
}

export type RecordTransferResult = {
  /**
   * 录音转写id
   */
  recordTransferId: number;
  /**
   * 目录id
   */
  directoryId: number;
  /**
   * 设备生成的录音文件唯一标识符
   */
  deviceUniqueId: string;
  /**
   * 文件名称
   */
  name: string;
  /**
   * 录音时间 时间戳 单位秒
   */
  recordTime: number;
  /**
   * 录音时长 单位毫秒
   */
  duration: number;
  /**
   * 音频类型
   */
  recordType: RecordType;
  /**
   * 音频格式
   */
  audioFormat: number;
  /**
   * 设备id
   */
  deviceId: string;
  /**
   * 录音文件路径
   */
  filePath?: string;
  /**
   * 录音wav文件路径
   */
  wavFilePath?: string;
  /**
   * 振幅字符串，以**,**格开
   */
  amplitudes?: string;
  /**
   * 文件同步状态，0未上传、1上传中、2已上传、3上传失败
   */
  status: number;
  /**
   * 是否已经点击过
   */
  visit: boolean;
  /**
   * 是否被移除，移到垃圾桶
   */
  remove: boolean;
  /**
   * 云端存储的key
   */
  storageKey?: string;
  /**
   * 转录状态，0未转录、1转录中、2已转录、3转录失败
   */
  transfer: number;
  /**
   * 音频文件来源，0表示app，1表示设备
   */
  source: number;
  /**
   * 转写模式 0文件转写，1实时转写
   */
  transferType: TransferType;
  /**
   * 是否需要翻译
   */
  needTranslate: boolean;
  /**
   * 起始语言
   */
  originalLanguage?: string;
  /**
   * 目标语言
   */
  targetLanguage?: string;
  /**
   * 实时转写记录id
   */
  recordId?: string;
  /**
   * 实时转写智能体id
   */
  agentId?: string;
};

export const updateRecordTransferResultList = createAsyncThunk(
  'audioFile/updateRecordTransferResultList',
  async (_, { getState }) => {
    try {
      // const {
      //   devInfo: { devId },
      // } = getState() as any;
      const fileList = (await tttGetFilesList({})) as RecordTransferResult[];
      return { fileList };
    } catch (error) {
      console.log(error);
      return {};
    }
  }
);

export const updateRecordTask = createAsyncThunk(
  'audioFile/updateRecordTask',
  async (_, { getState }) => {
    try {
      const {
        devInfo: { devId },
      } = getState() as any;
      const d: any = await tttRecordTask(devId);
      if (d?.task) {
        return {
          task: d?.task,
        };
      }
      return { task: null };
    } catch (error) {
      console.log(error);
      return {};
    }
  }
);

/**
 * Slice
 */
const audioFileSlice = createSlice({
  name: 'audioFile',
  initialState: {
    fileList: [],
    recordStatus: RecordStatus.UNKNOWN,
    recordType: RecordType.MEETING,
    task: null,
  } as {
    fileList: RecordTransferResult[];
    recordStatus: RecordStatus;
    recordType: RecordType;
    task: any;
  },
  reducers: {
    updateAudioFile(state, action: PayloadAction<Partial<any>>) {
      return { ...state, ...action.payload };
    },
    updateRecordStatus(state, action: PayloadAction<Partial<any>>) {
      return { ...state, ...action.payload };
    },
    updateRecordType(state, action: PayloadAction<Partial<any>>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder.addCase(updateRecordTransferResultList.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
    builder.addCase(updateRecordTask.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
  },
});

/**
 * Actions
 */
export const { updateAudioFile, updateRecordStatus, updateRecordType } = audioFileSlice.actions;

/**
 * Selectors
 */

export const selectAudioFile = (state: ReduxState) => state.audioFile;
export const selectAudioFileByKey = key => state => state.audioFile[key];

export default audioFileSlice.reducer;
