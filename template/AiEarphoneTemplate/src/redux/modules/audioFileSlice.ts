import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { tttGetFilesList, tttRecordTask } from '@/api/ttt';
import { SingleCloudSyncStatus, BusinessType } from '@/constant/enums';

/** 状态，0未知，1录音中，2暂停，3结束 */
export enum RecordStatus {
  UNKNOWN,
  RECORDING,
  PAUSE,
  FINISH,
}

export enum RecordType {
  Call, // 电话录音
  Live, // 现场录音+实时转录+同声传译
  FaceToFacePro, // 面对面翻译(Pro版)
  FaceToFace, // 面对面翻译
  Text, // 文本翻译
  AudioImport, // 音频导入
  PhoneEar, // 手机耳机模式
  CallTranslation, // 电话翻译
}

// 0-文件转写 1-实时转写
export enum TransferType {
  FILE,
  REALTIME,
}

/**
 * note文件转化状态
 * 2： 转码失败
 * 1： 转码中
 * 0： 转码成功/无需转码
 */
export enum NoteFileConvertStateType {
  SUCCESS,
  ING,
  FAIL,
}

/**
 * Redux 中 fileList 存储的精简类型，只保留 UI 渲染所需字段。
 * 原始 API 响应中体积大但 UI 不需要的字段（amplitudes、filePath、wavFilePath 等）
 * 在写入 store 前由 toFileListItem() 裁剪掉，以减少内存占用。
 */
export type FileListItem = {
  /**
   * 录音转写id
   */
  recordTransferId: number;
  recordId?: string;
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
   * 是否已经点击过
   */
  visit: number;
  /**
   * 转录状态，0未转录、1转录中、2已转录、3转录失败
   */
  transfer: number;
  /**
   * 总结状态
   */
  summary?: 0 | 1 | 2 | 3 | 4;
  /**
   * 云同步状态
   */
  cloudSyncStatus?: SingleCloudSyncStatus;
  /**
   * 音频来源
   */
  source: number;
  /**
   * 文件转写状态
   */
  noteFileConvertState: NoteFileConvertStateType;
  /**
   * 是否来自云同步
   */
  isFromCloud?: boolean;
  /**
   * 文件id
   */
  fileId?: string;
  /**
   * 标签列表，用于列表项展示
   */
  tags?: string[];
  /**
   * RecycleView 虚拟化高度缓存，由列表组件写入
   */
  height?: number;
};

/**
 * 从 API 原始对象中只提取 FileListItem 所需字段，丢弃 amplitudes 等大字段。
 */
export const toFileListItem = (raw: Record<string, any>): FileListItem => ({
  recordTransferId: raw.recordTransferId,
  recordId: raw.recordId,
  name: raw.name,
  recordTime: raw.recordTime,
  duration: raw.duration,
  recordType: raw.recordType,
  visit: raw.visit,
  transfer: raw.transfer,
  summary: raw.summary,
  cloudSyncStatus: raw.cloudSyncStatus,
  source: raw.source,
  noteFileConvertState: raw.noteFileConvertState,
  isFromCloud: raw.isFromCloud,
  ...(raw.fileId !== undefined && { fileId: raw.fileId }),
  ...(Array.isArray(raw.tags) && { tags: raw.tags }),
  ...(raw.height !== undefined && { height: raw.height }),
});

/** @deprecated 请改用 FileListItem，此类型仅供外部兼容保留 */
export type RecordTransferResult = FileListItem;

const isRecordingState = (state?: RecordStatus) =>
  state === RecordStatus.RECORDING || state === RecordStatus.PAUSE;

/**
 * 面对面翻译已内置到本小程序；底层任务仍可能带 businessType=Trans（原翻译小程序协议），
 * 不能按「外部分业务」把 state 抹成 UNKNOWN，否则录音中 UI 会回弹。
 */
export const isBuiltInFaceToFaceTask = (task: any) => {
  const recordType = task?.recordType;
  return (
    recordType === RecordType.FaceToFace ||
    recordType === RecordType.FaceToFacePro ||
    recordType === RecordType.PhoneEar
  );
};

/**
 * 归一化任务数据：
 * - 笔记小程序任务保持原状态
 * - 内置面对面任务按 Note 任务保留真实录音态
 * - 其他业务任务（如翻译）在笔记小程序内不驱动录音中 UI
 */
export const normalizeNoteTask = (task: any) => {
  if (!task) {
    console.warn('[FTF-RecordDebug][normalizeNoteTask] rawTask=null');
    return null;
  }
  const rawBusinessType = task?.businessType;
  const businessType = isBuiltInFaceToFaceTask(task)
    ? BusinessType.Note
    : task?.businessType ?? BusinessType.Note;
  const normalizedTask = {
    ...task,
    businessType,
  };
  if (businessType !== BusinessType.Note) {
    const masked = {
      ...normalizedTask,
      sourceTaskState: task?.state ?? RecordStatus.UNKNOWN,
      state: RecordStatus.UNKNOWN,
    };
    console.warn('[FTF-RecordDebug][normalizeNoteTask] MASK to UNKNOWN', {
      rawBusinessType,
      recordType: task?.recordType,
      rawState: task?.state,
      outState: masked.state,
      sourceTaskState: masked.sourceTaskState,
    });
    return masked;
  }
  console.warn('[FTF-RecordDebug][normalizeNoteTask] keep', {
    rawBusinessType,
    businessType,
    recordType: task?.recordType,
    state: task?.state,
    isBuiltInFaceToFace: isBuiltInFaceToFaceTask(task),
  });
  return normalizedTask;
};

export const isForeignAppRecordingTask = (task: any) => {
  if (!task) {
    return false;
  }
  // 内置面对面任务不算外部分业务
  if (isBuiltInFaceToFaceTask(task)) {
    return false;
  }
  const businessType = task?.businessType ?? BusinessType.Note;
  if (businessType === BusinessType.Note) {
    return false;
  }
  return isRecordingState(task?.sourceTaskState ?? task?.state);
};

export const isAnyAppRecordingTask = (task: any) => {
  if (!task) {
    return false;
  }
  return isRecordingState(task?.state) || isForeignAppRecordingTask(task);
};

type FileListRefreshOptions = {
  source?: string;
};

export const updateRecordTransferResultList = createAsyncThunk(
  'audioFile/updateRecordTransferResultList',
  // options.source 仅用于调用点追踪 / DevTools，此处不消费
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (options: FileListRefreshOptions = {}, { getState }) => {
    try {
      const rawList = (await tttGetFilesList({})) as Record<string, any>[];
      const {
        audioFile: { task },
      } = getState() as any;
      // 过滤掉正在录音的文件，并裁剪为精简类型
      const fileList: FileListItem[] = rawList
        .filter(item => item.recordId !== task?.recordId)
        .map(toFileListItem);
      return fileList;
    } catch (error) {
      return [];
    }
  }
);

// export const updateRecordTask = createAsyncThunk(
//   'audioFile/updateRecordTask',
//   async (_, { getState }) => {
//     try {
//       const {
//         devInfo: { devId },
//       } = getState() as any;
//       const d: any = await tttRecordTask(devId);
//       if (d?.task) {
//         const task = d?.task
//         const state = task.businessType === undefined ? task?.state : task?.businessType !== BusinessType.Note ? RecordStatus.UNKNOWN : task?.state
//         const businessType = task?.businessType ?? BusinessType.Note
//         return {
//           task: { ...d?.task, state, businessType },
//         };
//       }
//       return null;
//     } catch (error) {
//       return {};
//     }
//   }
// );

export const updateRecordTask = createAsyncThunk(
  'audioFile/updateRecordTask',
  async (deviceId?: string, { getState }) => {
    const {
      devInfo: { devId: currentDevId },
      audioFile: { taskState: beforeTaskState },
    } = getState() as any;
    const devId = deviceId || currentDevId;
    console.warn('[FTF-RecordDebug][updateRecordTask] request', {
      deviceId,
      currentDevId,
      usedDevId: devId,
      beforeTaskState,
    });
    const d: any = await tttRecordTask(devId);
    console.warn('[FTF-RecordDebug][updateRecordTask] rawResponse', {
      usedDevId: devId,
      hasTask: !!d?.task,
      rawTask: d?.task
        ? {
            state: d.task.state,
            businessType: d.task.businessType,
            recordType: d.task.recordType,
            devId: d.task.devId,
          }
        : null,
    });
    return normalizeNoteTask(d?.task || null);
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
    recordType: RecordType.Live,
    task: null,
    taskState: null as RecordStatus | null,
  } as {
    fileList: FileListItem[];
    recordStatus: RecordStatus;
    recordType: RecordType;
    task: any;
    taskState: RecordStatus | null;
  },
  reducers: {
    updateAudioFile(state, action: PayloadAction<Partial<any>>) {
      return { ...state, ...action.payload };
    },
    updateTaskState(state, action: PayloadAction<RecordStatus>) {
      const businessType = isBuiltInFaceToFaceTask(state.task)
        ? BusinessType.Note
        : state.task?.businessType ?? BusinessType.Note;
      if (businessType !== BusinessType.Note) {
        console.warn('[FTF-RecordDebug][updateTaskState] MASK foreign', {
          payload: action.payload,
          businessType,
          recordType: state.task?.recordType,
          prevTaskState: state.taskState,
        });
        state.taskState = RecordStatus.UNKNOWN;
        if (state.task) {
          state.task.sourceTaskState = action.payload;
        }
        return;
      }
      console.warn('[FTF-RecordDebug][updateTaskState]', {
        from: state.taskState,
        to: action.payload,
        businessType,
        recordType: state.task?.recordType,
      });
      state.taskState = action.payload;
    },
    /**
     * 按主键局部更新 fileList 中某一项（详情页编辑后同步首页/搜索/合并列表常用入口）
     *
     * @param key   定位字段，默认 'recordId'，也可传 'recordTransferId'
     * @param value 主键值
     * @param patch 待覆盖的字段，仅写入 patch 中显式声明的字段
     *
     * 设计要点：
     * 1. 借助 immer 直接 mutate 命中项，fileList 数组引用会变（保证 useSelector 触发），
     *    其他项的引用不变，长列表里走 React.memo / 虚拟滚动的 ListItem 不会无谓重渲染
     * 2. 找不到对应项时静默忽略：列表通常已由 onShow 拉取兜底，不必在这里抛错
     * 3. patch 内的引用类型（数组/对象）由调用方负责构造好新引用，reducer 不做深拷贝
     */
    updateFileListItem(
      state,
      action: PayloadAction<{
        value: string | number;
        key?: 'recordId' | 'recordTransferId';
        patch: Partial<FileListItem>;
      }>
    ) {
      const { value, key = 'recordId', patch } = action.payload;
      if (value === undefined || value === null || !patch) {
        return;
      }
      const target = state.fileList.find(item => item[key] === value);
      if (!target) {
        return;
      }
      Object.assign(target, patch);
    },
    /**
     * 按主键从 fileList 中移除某一项（partial 推送 operateStatus=Delete 等场景使用）
     *
     * @param key   定位字段，默认 'recordId'，也可传 'recordTransferId'
     * @param value 主键值
     *
     * 设计要点：
     * 1. 借助 immer 在 draft 上 splice，fileList 数组引用会变（触发 useSelector），
     *    其他项的引用保持不变，长列表里走 React.memo / 虚拟滚动的 ListItem 不会无谓重渲染
     * 2. 找不到对应项时静默忽略：可能已被全量接口提前刷掉，不必抛错
     */
    removeFileListItem(
      state,
      action: PayloadAction<{
        value: string | number;
        key?: 'recordId' | 'recordTransferId';
      }>
    ) {
      const { value, key = 'recordId' } = action.payload;
      if (value === undefined || value === null) {
        return;
      }
      const idx = state.fileList.findIndex(item => item[key] === value);
      if (idx === -1) {
        return;
      }
      state.fileList.splice(idx, 1);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateRecordTask.fulfilled, (state, { payload, meta }) => {
        const requestedDevId = meta.arg;
        if (
          !payload &&
          state.task?.devId &&
          isRecordingState(state.task?.state) &&
          (!requestedDevId || requestedDevId !== state.task.devId)
        ) {
          console.warn('[FTF-RecordDebug][updateRecordTask.fulfilled] SKIP empty other-device', {
            requestedDevId,
            taskDevId: state.task?.devId,
            taskState: state.taskState,
          });
          // 其它设备的空任务响应不能覆盖当前正在录音的任务。
          return;
        }
        if (
          payload?.devId &&
          !requestedDevId &&
          state.task?.devId &&
          isRecordingState(state.task?.state) &&
          payload.devId !== state.task.devId
        ) {
          console.warn('[FTF-RecordDebug][updateRecordTask.fulfilled] SKIP cross-device', {
            payloadDevId: payload?.devId,
            taskDevId: state.task?.devId,
          });
          // 不带 deviceId 的兜底请求不能驱动录音设备切换，避免旧请求回包导致手机/卡片来回切。
          return;
        }
        // 开录后状态事件已写入 taskState，任务详情可能尚未就绪；空回包不能把 UI 打回 UNKNOWN
        if (!payload && isRecordingState(state.taskState)) {
          console.warn('[FTF-RecordDebug][updateRecordTask.fulfilled] SKIP empty while recording', {
            taskState: state.taskState,
            requestedDevId,
          });
          return;
        }
        console.warn('[FTF-RecordDebug][updateRecordTask.fulfilled] APPLY', {
          requestedDevId,
          prevTaskState: state.taskState,
          nextTaskState: payload?.state || RecordStatus.UNKNOWN,
          payload: payload
            ? {
                state: payload.state,
                sourceTaskState: payload.sourceTaskState,
                businessType: payload.businessType,
                recordType: payload.recordType,
                devId: payload.devId,
              }
            : null,
        });
        state.task = payload;
        state.taskState = payload?.state || RecordStatus.UNKNOWN;
      })
      .addCase(updateRecordTransferResultList.fulfilled, (state, { payload }) => {
        state.fileList = payload;
      });
  },
});

/**
 * Actions
 */
export const { updateAudioFile, updateTaskState, updateFileListItem, removeFileListItem } =
  audioFileSlice.actions;

/**
 * Selectors
 */

export const selectAudioFile = (state: ReduxState) => state.audioFile;
export const selectAudioFileByKey = key => state => state.audioFile[key];

export default audioFileSlice.reducer;
