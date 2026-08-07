import { JsonUtil } from '@/utils';
import { wear } from '@ray-js/ray';

import type {
  MergeRecordListParams,
  FileMergeStatusEvent,
  QuickEntryInfo,
  SetQuickEntryEnabledParams,
  SearchRecordTransferResultParams,
  SearchRecordTransferResult,
} from './ttt.interface';
import type {
  RemoveFilesParams,
  ChangeRecodeChannelRequest,
  LoadFileRequest,
  OperateRecordingFloatParams,
} from './interface';
import {
  CloudSyncSwitchStatusResult,
  DeviceOfflineFileResult,
  FileImportStatusResult,
  OperateAudioFileSafePathParams,
  OperateAudioFileSafePathResult,
  SyncDownloadNoteAudioParams,
  TransferProcessStatusResult,
  OperateRecordShareLinkParams,
  AddDIYHomeCardParams,
  UpdateRecordTagResultParams,
} from './ttt.interface';
import { handleTttError } from '@/utils/code';

const {
  recordTransferTask,
  pauseRecordTransfer,
  resumeRecordTransfer,
  stopRecordTransfer,
  getRecordTransferResultList,
  searchRecordTransferResult,
  getRecordTransferResultDetail,
  processRecordTransferResult,
  updateRecordTransferResult,
  getRecordTransferProcessStatus,
  getRecordTransferRecognizeResult,
  getRecordTransferSummaryResult,
  removeFileList,
  getAudioFilesSize,
  getRecordTransferRealTimeResult,
  saveRecordTransferRecognizeResult,
  saveRecordTransferSummaryResult,
  saveRecordTransferRealTimeRecognizeResult,
  loadOfflineFile,
  getDeviceOfflineFileStatus: getDeviceOfflineFileStatusApi,
  switchRecordChannel,
  startAudioRecording,
  updateParams,
  getCloudSyncSwitchStatus,
  syncNoteRecord,
  syncDownloadNoteAudio,
  startImport,
  retryImport,
  cancelImport,
  cancelRetry,
  getAudioImportStatus,
  operateAudioFileSafePath,
  operateEventLimit,
  getEarPhoneBTConntectedStatus,
  operateRecordShareLink,
  switchModeLoadOfflineFile,
  mergeRecordList,
  cancelMergeRecordList,
  getFileMergeStatus,
  readyToSetupNativeChannel,
  operateRecordingFloat,
  getQuickEntryList,
  setQuickEntryEnabled,
  updateRecordTagResult,
} = wear;

const failLog = (_name, err, hideToast = false) => {
  // 使用 lodash 节流处理错误提示
  !hideToast && handleTttError(err);
};

type TttRequestOptions = {
  api: (args: Record<string, any>) => void; // 直接传入可调用的 WearKit / ty API 方法引用
  params?: Record<string, any>;
  hideErrorToast?: boolean; // 是否显示错误toast
};

/**
 * 通用 ttt 请求封装
 */
export const tttRequest = <T = any>(options: TttRequestOptions): Promise<T> => {
  const { api, params = {}, hideErrorToast = false } = options;
  return new Promise<T>((resolve, reject) => {
    const startTime = Date.now();
    const fn = api as any;
    const label = fn || 'ttt.request';

    if (typeof fn !== 'function') {
      // 对外 WearKit 可能不存在商业版私有桥，软跳过避免 Uncaught (in promise) 白屏
      resolve(undefined as T);
      return;
    }

    const endWithSuccess = (result: T) => {
      const formatResult = typeof result === 'string' ? JsonUtil.parseJSON(result as any) : result;
      resolve(formatResult);
    };

    const endWithError = (error: any) => {
      const duration = Date.now() - startTime;
      console.error(`【TTT Error 耗时: ${duration}ms】 ${label}`, params, error);
      !hideErrorToast && handleTttError(error);
      reject(error);
    };

    try {
      fn({
        ...params,
        success: endWithSuccess,
        fail: endWithError,
        // 兼容个别 API 使用 failure 作为失败回调
        failure: endWithError,
      });
    } catch (err) {
      endWithError(err);
    }
  });
};

// wiki
// 1808375406798045227

/**
 * 获取录音转写任务
 *
 * @param request 入参 RecordTransferTaskParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttRecordTask = deviceId => {
  if (!deviceId) {
    return null;
  }
  return tttRequest({
    api: recordTransferTask,
    params: { deviceId },
  });
};

/**
 * 暂停录音转写
 *
 * @param request 入参 PauseRecordTransferParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttPauseRecord = deviceId => {
  return tttRequest({
    api: pauseRecordTransfer,
    params: { deviceId },
  });
};

/**
 * 恢复录音转写
 *
 * @param request 入参 ResumeRecordTransferParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttResumeRecord = deviceId => {
  return tttRequest({
    api: resumeRecordTransfer,
    params: { deviceId },
  });
};

/**
 * 停止录音转写
 *
 * @param request 入参 StopRecordTransferParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttStopRecord = deviceId => {
  return tttRequest({
    api: stopRecordTransfer,
    params: { deviceId },
  });
};

/**
 * 获取录音转写列表
 *
 * @param request 入参 GetRecordTransferResultListParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttGetFilesList = (params: any) => {
  return tttRequest({
    api: getRecordTransferResultList,
    params: { ...params, orderBy: 1 },
  });
};

/**
 * 搜索录音转写
 *
 * @param params 入参 SearchRecordTransferResultParams
 */
export const tttSearchRecordTransferResult = (params: SearchRecordTransferResultParams) => {
  return tttRequest<SearchRecordTransferResult[]>({
    api: searchRecordTransferResult,
    params,
  });
};

/**
 * 获取录音转写详情
 *
 * @param request 入参 GetRecordTransferResultDetailParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttGetFilesDetail = (params: any, hideErrorToast = false) => {
  return tttRequest({
    api: getRecordTransferResultDetail,
    params: { ...params },
    hideErrorToast,
  });
};

/**
 * 对录音转写记录进行转写操作
 *
 * @param request 入参 ProcessRecordTransferResultParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttTransfer = (params: any) => {
  return tttRequest({
    api: processRecordTransferResult,
    params,
  });
};

/**
 * 更新录音转写
 *
 * @param request 入参 UpdateRecordTransferResultParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttUpdateFile = (params: any) => {
  return tttRequest({
    api: updateRecordTransferResult,
    params,
  });
};

/**
 * 转写状态查询
 *
 * @param request 入参 GetRecordTransferProcessStatusParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttGetRecordTransferProcessStatus = (params: any) => {
  return tttRequest<TransferProcessStatusResult>({
    api: getRecordTransferProcessStatus,
    params,
  });
};

/**
 * 转写结果查询
 *
 * @param request 入参 GetRecordTransferRecognizeResultParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttGetRecordTransferRecognizeResult = (params: any) => {
  return tttRequest({
    api: getRecordTransferRecognizeResult,
    params: { ...params },
  });
};

/**
 * 转写总结查询
 *
 * @param request 入参 GetRecordTransferSummaryResultParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttGetRecordTransferSummaryResult = (params: any) => {
  return tttRequest({
    api: getRecordTransferSummaryResult,
    params: { ...params },
  });
};

/**
 * 文件删除 / 移除本地音源 / 一键清空本地缓存
 *
 * isDeleteAll: true  → 彻底删除文件（本地+云端）
 * isDeleteAll: false → 仅移除本地音源（传 fileIds 移除指定文件，传空数组清空所有本地缓存）
 */
export const tttRemoveFiles = (params: RemoveFilesParams) => {
  return tttRequest({
    api: removeFileList,
    params: {
      ...params,
    },
  });
};

/**
 * 获取音频文件总占用空间（单位字节）
 */
export const tttGetAudioFilesSize = () => {
  return tttRequest<number>({
    api: getAudioFilesSize,
    params: {},
  });
};

/**
 * 获取实时转写数据
 *
 * @param request 入参 GetRecordTransferRealTimeResultParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttGetRecordTransferRealTimeResult = (params: any) => {
  return tttRequest({
    api: getRecordTransferRealTimeResult,
    params: { ...params },
  });
};

/**
 * 保存转写结果
 *
 * @param request 入参 SaveRecordTransferRecognizeResultParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttSaveRecordTransferRecognizeResult = (params: any) => {
  return tttRequest({
    api: saveRecordTransferRecognizeResult,
    params,
  });
};

/**
 * 保存总结结果
 *
 * @param request 入参 SaveRecordTransferSummaryResultParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttSaveRecordTransferSummaryResult = (params: any) => {
  return tttRequest({
    api: saveRecordTransferSummaryResult,
    params,
  });
};

/**
 * 更新实时转写结果
 *
 * @param request 入参 SaveRecordTransferRealTimeRecognizeResult
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttSaveRecordTransferRealTimeRecognizeResult = (params: any) => {
  return tttRequest({
    api: saveRecordTransferRealTimeRecognizeResult,
    params,
  });
};

/**
 * 复制到剪贴板
 */
export const tttSetClipboardData = (data: string) => {
  return new Promise((resolve, reject) => {
    ty.setClipboardData({
      data,
      success: data => {
        resolve(data);
      },
      fail: e => {
        failLog('ty.setClipboardData', e);
        reject();
      },
    });
  });
};

export const tttSetStorage = (key: string, data: string) => {
  return new Promise((resolve, reject) => {
    ty.setStorage({
      key,
      data,
      success: data => {
        resolve(data);
      },
      fail: e => {
        reject();
      },
    });
  });
};

export const tttGetStorage = (key: string) => {
  return new Promise((resolve, reject) => {
    ty.getStorage({
      key,
      success: data => {
        resolve(data);
      },
      fail: e => {
        reject();
      },
    });
  });
};

export const tttRemoveStorage = (key: string) => {
  return new Promise((resolve, reject) => {
    ty.removeStorage({
      key,
      success: data => {
        resolve(data);
      },
      fail: e => {
        reject();
      },
    });
  });
};

export const tttClearStorage = () => {
  return new Promise((resolve, reject) => {
    ty.clearStorage({
      success: data => {
        resolve(data);
      },
      fail: e => {
        reject();
      },
    });
  });
};

/**
 * 文件分享
 */
export const tttShareWebFile = (url: string) => {
  return new Promise((resolve, reject) => {
    ty.share({
      type: 'More',
      title: '',
      message: '',
      contentType: 'web',
      webPageUrl: url,
      success: data => {
        resolve(data);
      },
      fail: () => {
        reject();
      },
    });
  });
};

export const tttDownloadFile = ({ url, filePath }) => {
  return new Promise((resolve, reject) => {
    ty.downloadFile({
      url,
      filePath,
      success: data => {
        resolve(data);
      },
      failure: e => {
        failLog('ty.downloadFile', e);
        reject();
      },
    });
  });
};

export const tttShareLocalFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    ty.share({
      type: 'More',
      title: '',
      message: '',
      contentType: 'file',
      filePath,
      success: data => {
        resolve(data);
      },
      fail: e => {
        failLog('ty.share', e, true);
        reject();
      },
    });
  });
};

export const tttShareText = (title: string, message: string) => {
  return new Promise((resolve, reject) => {
    ty.share({
      title,
      type: 'More',
      message,
      contentType: 'text',
      success: data => {
        resolve(data);
      },
      fail: () => {
        reject();
      },
    });
  });
};

/**
 * 下载离线文件请求
 */
export const tttLoadOfflineFile = (params: LoadFileRequest) => {
  return tttRequest({
    api: loadOfflineFile,
    params,
  });
};

/**
 * 获取当前设备的离线文件列表
 */
export const getDeviceOfflineFileStatus = (deviceId: string, hideErrorToast: boolean) => {
  return tttRequest<DeviceOfflineFileResult>({
    api: getDeviceOfflineFileStatusApi,
    params: { deviceId },
    hideErrorToast,
  });
};

/**
 * 切换通道，耳机收音还是手机收音
 */
export const tttChangeRecordChannel = (params: ChangeRecodeChannelRequest) => {
  return tttRequest({
    api: switchRecordChannel,
    params,
  });
};

/**
 * 开始录音转写,新版
 *
 * @param request 入参 tttStartAudioRecording
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttStartAudioRecording = ({ deviceId, config }, hideErrorToast = false) => {
  return tttRequest({
    api: startAudioRecording,
    params: { deviceId, config },
    hideErrorToast,
  });
};

/**
 * 更新录音信息,新版
 *
 * @param request 入参 tttStartAudioRecording
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttUpdateParams = ({ deviceId, config }, hideErrorToast = false) => {
  return tttRequest({
    api: updateParams,
    params: { deviceId, config },
    hideErrorToast,
  });
};

/**
 * 获取云同步状态
 */
export const tttGetCloudSyncStatus = () => {
  return tttRequest<CloudSyncSwitchStatusResult>({
    api: getCloudSyncSwitchStatus,
  });
};

/**
 * 同步上传 Note 记录（文件+音频），下载 Note 文件
 */
export const tttSyncNoteRecord = (hideErrorToast = true) => {
  return tttRequest({
    api: syncNoteRecord,
    hideErrorToast,
  });
};

/**
 * 下载音频文件
 */
export const tttDownloadNoteAudio = (params: SyncDownloadNoteAudioParams) => {
  return tttRequest({
    api: syncDownloadNoteAudio,
    params,
  });
};

/**
 * 导入音频
 */
export const tttImportAudio = () => {
  return tttRequest({
    api: startImport,
    params: {},
  });
};

/**
 * 重试导入
 */
export const tttRetryImport = () => {
  return tttRequest({
    api: retryImport,
  });
};

/**
 * 取消导入
 */
export const tttCancelImport = () => {
  return tttRequest({
    api: cancelImport,
  });
};

/**
 * 取消重试
 */
export const tttCancelRetry = () => {
  return tttRequest({
    api: cancelRetry,
  });
};

/**
 * 获取音频导入状态
 */
export const tttGetAudioImportStatus = () => {
  return tttRequest<FileImportStatusResult>({
    api: getAudioImportStatus,
  });
};

/**
 * 获取音频分享小程序合规路径
 */
export const tttOperateAudioFileSafePath = (params: OperateAudioFileSafePathParams) => {
  return tttRequest<OperateAudioFileSafePathResult>({
    api: operateAudioFileSafePath,
    params,
  });
};

// 控制流限制事件
export const tttOperateEventLimit = params => {
  return tttRequest({
    api: operateEventLimit,
    params,
  });
};

// 获取耳机设备的蓝牙连接状态
export const tttGetEarPhoneBTConnectedStatus = (devId: string) => {
  return tttRequest({
    api: getEarPhoneBTConntectedStatus,
    params: { devId },
  });
};

// 获取首页是否添加了卡片
export const tttGetDidDisplayDIYHomeCard = params => {
  return tttRequest({
    // @ts-ignore
    api: ty.home?.didDisplayDIYHomeCard,
    params,
  });
};

// 添加卡片到首页
export const tttAddDIYHomeCard = (params: AddDIYHomeCardParams) => {
  return tttRequest({
    // @ts-ignore
    api: ty.home?.addDIYHomeCard,
    params,
  });
};

// 保存/关闭分享链接
export const tttOperateRecordShareLink = (params: OperateRecordShareLinkParams) => {
  return tttRequest({
    api: operateRecordShareLink,
    params,
  });
};

// 切换到AP/BLE模式传输
export const tttSwitchModeLoadOfflineFile = params => {
  return tttRequest({
    api: switchModeLoadOfflineFile,
    params,
  });
};

// ============ 合并录音相关（新增） ============
/**
 * 批量合并录音
 *
 * @param request 批量合并录音参数
 */
export const tttMergeRecordList = (request: MergeRecordListParams) => {
  return tttRequest({
    api: mergeRecordList,
    params: request,
  });
};

/**
 * 取消合并录音
 */
export const tttCancelMergeRecordList = () => {
  return tttRequest({
    api: cancelMergeRecordList,
  });
};

/**
 * 查询录音的合并状态
 */
export const tttGetFileMergeStatus = () => {
  return tttRequest<FileMergeStatusEvent>({
    api: getFileMergeStatus,
  });
};

/**
 * 建立小程序和客户端通道(仅ios)
 */
export const tttReadyToSetupNativeChannel = () => {
  return tttRequest({
    api: readyToSetupNativeChannel,
  });
};

// 准备执行本地解码操作
export const tttOperateRecordingFloat = (params: OperateRecordingFloatParams) => {
  return tttRequest({
    api: operateRecordingFloat,
    params,
  });
};

/**
 * 获取快速启动入口列表
 * 返回各入口（组件/快捷图标/磁贴）的类型与添加状态，用于展示与查询。
 */
export const tttGetQuickEntryList = () => {
  return tttRequest<QuickEntryInfo[]>({
    api: getQuickEntryList,
  });
};

/**
 * 根据类型、组件 ID 开启或关闭快速启动入口组件
 *
 * @param request 入参：type 入口类型，componentId 组件 ID，enabled 开启/关闭状态（0=关闭，1=开启）
 */
export const tttSetQuickEntryEnabled = (
  request: SetQuickEntryEnabledParams,
  hideErrorToast = true
) => {
  return tttRequest({
    api: setQuickEntryEnabled,
    params: request,
    hideErrorToast,
  });
};
/**
 * 更新录音文件标签（新增 / 删除 / 排序）
 */
export const tttUpdateRecordTagResult = (params: UpdateRecordTagResultParams) => {
  return tttRequest({
    api: updateRecordTagResult,
    params,
  });
};
