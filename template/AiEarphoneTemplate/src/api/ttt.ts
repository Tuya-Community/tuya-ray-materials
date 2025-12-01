import Strings from '@/i18n';
import { JsonUtil } from '@/utils';
import throttle from 'lodash-es/throttle';
import { wear } from '@ray-js/ray';

import type { RemoveFilesParams, ChangeRecodeChannelRequest } from './interface';

const {
  startRecordTransfer,
  pauseRecordTransfer,
  resumeRecordTransfer,
  stopRecordTransfer,
  recordTransferTask,
  getRecordTransferRealTimeResult,
  getRecordTransferResultList,
  getRecordTransferResultDetail,
  updateRecordTransferResult,
  removeFileList,
  saveRecordTransferRecognizeResult,
  saveRecordTransferSummaryResult,
  saveRecordTransferRealTimeRecognizeResult,
  getRecordTransferProcessStatus,
  getRecordTransferRecognizeResult,
  processRecordTransferResult,
  getRecordTransferSummaryResult,
} = wear;
const apiStyle = 'background: #778899; color: #fff;';
const errStyle = 'background: red; color: #fff;';
const successStyle = 'background: green; color: #fff;';

const paramsLog = (name, data) => {
  console.log(`TTT params: %c${name}`, apiStyle, data);
};

const successLog = (name, data) => {
  console.log(`TTT Success: %c${name}`, successStyle, data);
};

const showErrorToast = throttle(
  errText => {
    ty.showToast({ title: errText, icon: 'error' });
  },
  1000,
  { leading: true, trailing: false }
); // 首次立即执行，后续在2秒内不重复提示

const failLog = (name, err) => {
  const e = typeof err === 'string' ? JsonUtil.parseJSON(err) : err;
  let errText = e.message || e.errorMsg || e;
  // 兼容安卓错误码
  if (e?.innerError?.errorMsg) {
    errText = e.innerError.errorMsg;
  }

  // 兼容错误码方式翻译
  if (e?.innerError?.errorCode && Strings[e?.innerError?.errorCode]) {
    errText = Strings.getLang(e?.innerError?.errorCode);
  }

  console.log(`TTT Failed: %c${name}`, errStyle, errText);

  // 使用 lodash 节流处理错误提示
  showErrorToast(errText);
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
  return new Promise((resolve, reject) => {
    paramsLog('recordTransferTask', deviceId);
    recordTransferTask({
      deviceId,
      success: data => {
        successLog('recordTransferTask', JSON.stringify(data));
        resolve(data);
      },
      fail: err => {
        failLog('recordTransferTask', err);
        reject();
      },
    });
  });
};

/**
 * 开始录音转写
 *
 * @param request 入参 StartRecordTransferParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttStartRecord = ({ deviceId, config }, hideDefaultErrLog = false) => {
  return new Promise((resolve, reject) => {
    paramsLog('startRecordTransfer', { deviceId, config });
    startRecordTransfer({
      deviceId,
      config,
      success: data => {
        successLog('startRecordTransfer', data);
        resolve(data);
      },
      fail: err => {
        if (!hideDefaultErrLog) {
          failLog('startRecordTransfer', err);
        }
        reject(err);
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('pauseRecordTransfer', deviceId);
    pauseRecordTransfer({
      deviceId,
      success: data => {
        successLog('pauseRecordTransfer', data);
        resolve(data);
      },
      fail: err => {
        failLog('pauseRecordTransfer', err);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('resumeRecordTransfer', deviceId);
    resumeRecordTransfer({
      deviceId,
      success: data => {
        successLog('resumeRecordTransfer', data);
        resolve(data);
      },
      fail: err => {
        failLog('resumeRecordTransfer', err);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('stopRecordTransfer', deviceId);
    stopRecordTransfer({
      deviceId,
      success: data => {
        successLog('stopRecordTransfer', data);
        resolve(data);
      },
      fail: err => {
        failLog('stopRecordTransfer', err);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    const p = { ...params, orderBy: 1 };
    paramsLog('getRecordTransferResultList', p);
    getRecordTransferResultList({
      ...p,
      orderBy: 1, // 1-按时间降序
      success: data => {
        successLog('getRecordTransferResultList', data);
        resolve(data);
      },
      fail: e => {
        failLog('getRecordTransferResultList', e);
        reject();
      },
    });
  });
};

/**
 * 获取录音转写详情
 *
 * @param request 入参 GetRecordTransferResultDetailParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttGetFilesDetail = (params: any) => {
  return new Promise((resolve, reject) => {
    paramsLog('getRecordTransferResultDetail', params);
    getRecordTransferResultDetail({
      ...params,
      success: data => {
        successLog('getRecordTransferResultDetail', data);
        resolve(data);
      },
      fail: e => {
        failLog('getRecordTransferResultDetail', e);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('processRecordTransferResult', params);
    processRecordTransferResult({
      ...params,
      success: data => {
        successLog('processRecordTransferResult', data);
        resolve(data);
      },
      fail: e => {
        failLog('processRecordTransferResult', e);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('updateRecordTransferResult', params);
    updateRecordTransferResult({
      ...params,
      success: data => {
        successLog('updateRecordTransferResult', data);
        resolve(data);
      },
      fail: e => {
        failLog('updateRecordTransferResult', e);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('getRecordTransferProcessStatus', params);
    getRecordTransferProcessStatus({
      ...params,
      success: data => {
        successLog('getRecordTransferProcessStatus', data);
        resolve(data);
      },
      fail: e => {
        failLog('getRecordTransferProcessStatus', e);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('getRecordTransferRecognizeResult', params);
    getRecordTransferRecognizeResult({
      ...params,
      success: data => {
        successLog('getRecordTransferRecognizeResult', data);
        resolve(data);
      },
      fail: e => {
        failLog('getRecordTransferRecognizeResult', e);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('getRecordTransferSummaryResult', params);
    getRecordTransferSummaryResult({
      ...params,
      success: data => {
        successLog('getRecordTransferSummaryResult', data);
        resolve(data);
      },
      fail: e => {
        if (e?.innerError?.errorMsg.includes('TRANSCRIBE_TASK_NOT_EXIST')) {
          // 转录无内容时暂不报错todo
        } else {
          failLog('getRecordTransferSummaryResult', e);
        }
        reject();
      },
    });
  });
};

/**
 * 文件多删
 *
 * @param request 入参 RemoveRecordTransferResultParams
 * @param success 成功回调
 * @param fail    失败回调
 */
export const tttRemoveFiles = (params: RemoveFilesParams) => {
  return new Promise((resolve, reject) => {
    paramsLog('removeFileList', params);
    removeFileList({
      ...params,
      success: data => {
        successLog('removeFileList', data);
        resolve(data);
      },
      fail: e => {
        failLog('removeFileList', e);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('getRecordTransferRealTimeResult', params);
    getRecordTransferRealTimeResult({
      ...params,
      success: data => {
        successLog('getRecordTransferRealTimeResult', data);
        resolve(data);
      },
      fail: e => {
        failLog('getRecordTransferRealTimeResult', e);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('saveRecordTransferRecognizeResult', params);
    saveRecordTransferRecognizeResult({
      ...params,
      success: data => {
        successLog('saveRecordTransferRecognizeResult', data);
        resolve(data);
      },
      fail: e => {
        failLog('saveRecordTransferRecognizeResult', e);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('saveRecordTransferSummaryResult', params);
    saveRecordTransferSummaryResult({
      ...params,
      success: data => {
        successLog('saveRecordTransferSummaryResult', data);
        resolve(data);
      },
      fail: e => {
        failLog('saveRecordTransferSummaryResult', e);
        reject();
      },
    });
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
  return new Promise((resolve, reject) => {
    paramsLog('saveRecordTransferRealTimeRecognizeResult', params);
    saveRecordTransferRealTimeRecognizeResult({
      ...params,
      success: data => {
        successLog('saveRecordTransferRealTimeRecognizeResult', data);
        resolve(data);
      },
      fail: e => {
        failLog('saveRecordTransferRealTimeRecognizeResult', e);
        reject();
      },
    });
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
        successLog('ty.setClipboardData', data);
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
        successLog('ty.setStorage', data);
        resolve(data);
      },
      fail: e => {
        // failLog('ty.setStorage', e);
        console.log('ty.setStorage', e);
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
        successLog('ty.getStorage', data);
        resolve(data);
      },
      fail: e => {
        // failLog('ty.getStorage', e);
        console.log('ty.getStorage', e);
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
        successLog('ty.share', data);
        resolve(data);
      },
      fail: e => {
        // failLog('ty.share', e);
        reject();
      },
    });
  });
};

export const tttDownloadFile = (url: string) => {
  return new Promise((resolve, reject) => {
    ty.downloadFile({
      url,
      success: data => {
        successLog('ty.downloadFile', data);
        resolve(data);
      },
      fail: e => {
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
        successLog('ty.share', data);
        resolve(data);
      },
      fail: e => {
        // failLog('ty.share', e);
        reject();
      },
    });
  });
};

export const tttShareText = (title: string, message: string) => {
  return new Promise((resolve, reject) => {
    ty.share({
      type: 'More',
      message,
      contentType: 'text',
      success: data => {
        successLog('ty.share', data);
        resolve(data);
      },
      fail: e => {
        // failLog('ty.share', e);
        reject();
      },
    });
  });
};

// /**
//  * 下载离线文件请求
//  */
// export const loadOfflineFile = (params: LoadFileRequest) => {
//   return new Promise((resolve, reject) => {
//     paramsLog('ty.wear.loadOfflineFile', params);
//     ty.wear.loadOfflineFile({
//       ...params,
//       success: data => {
//         successLog('ty.wear.loadOfflineFile', data);
//         resolve(data);
//       },
//       fail: e => {
//         failLog('ty.wear.loadOfflineFile', e);
//         reject();
//       },
//     });
//   });
// };

/**
 * 获取当前设备的离线文件列表
 */
export const getDeviceOfflineAudioStatus = deviceId => {
  return new Promise((resolve, reject) => {
    const param = {
      deviceId,
      success: data => {
        successLog('ty.wear.getDeviceOfflineFileStatus', data);
        resolve(data);
      },
      fail: e => {
        failLog('ty.wear.getDeviceOfflineFileStatus', e);
        reject();
      },
    };
    paramsLog('ty.wear.getDeviceOfflineFileStatus', param);
    ty.wear.getDeviceOfflineFileStatus(param);
  });
};

// /**
//  * 切换通道，耳机收音还是手机收音
//  */
// export const tttChangeRecordChannel = (params: ChangeRecodeChannelRequest) => {
//   return new Promise((resolve, reject) => {
//     paramsLog('ty.wear.switchRecordChannel', params);
//     ty.wear.switchRecordChannel({
//       ...params,
//       success: data => {
//         successLog('ty.wear.switchRecordChannel', data);
//         resolve(data);
//       },
//       fail: e => {
//         failLog('ty.wear.switchRecordChannel', e);
//         reject();
//       },
//     });
//   });
// };
