import Strings from '@/i18n';
import store from '@/redux';
import { updateIpcCommon } from '@/redux/modules/ipcCommonSlice';
import {
  showToast as rayShowToast,
  getDevInfo,
  authorizeStatus,
  authorize,
  setPageOrientation,
  navigateToMiniProgram,
  exitMiniProgram,
  setNavigationBarBack,
  hideStatusBar,
  showStatusBar,
  canIUseRouter,
} from '@ray-js/ray';

/**
 * toast提示
 * @param title 提示内容多语言词条 默认：operatorFailed（操作失败）
 * @param icon 显示icon 可选值：success / error / loading / 'none' 默认值：error
 * @param duration 显示时长 默认值：3000ms
 */
export const showToast = (title: any = 'operatorFailed', icon = 'error', duration = 3000) => {
  rayShowToast({ title: Strings.getLang(title), duration, icon });
};

/**
 * 录制中，先关掉录制再进行下一步操作
 * @param show 是否显示录制提示
 */
export const isRecordingFun = (show = true) => {
  const { isRecording } = store.getState().ipcCommon;

  if (isRecording && show) showToast('live_page_is_recording_tip', 'none');

  return isRecording;
};

/**
 * 对讲中，先关掉对讲再进行下一步操作
 * @param show 是否显示对讲提示
 */
export const isTwoTalkFun = (show = true) => {
  const { isTwoTalking } = store.getState().ipcCommon;

  if (isTwoTalking && show) showToast('live_page_is_talking_tip', 'none');

  return isTwoTalking;
};

/**
 * 拦截操作
 */
export const holdUp = () => {
  if (isRecordingFun()) return true;
  if (isTwoTalkFun()) return true;

  return false;
};

// 进入相册
export const goToAlbum = () => {
  if (holdUp()) {
    return null;
  }
  store.dispatch(updateIpcCommon({ recordSuccess: false }));
  goAppPage('ipc_album_panel');
};

// 进入回放
export const goToPlayback = () => {
  if (holdUp()) {
    return null;
  }
  // 先断流
  stopPreview()
    .then(() => {
      goAppPage('camera_playback_panel');
    })
    .catch(() => {
      showToast();
    });
};

/**
 * 进入原生页面
 * @param pageId 页面id
 */
export const goAppPage = (pageId: string) => {
  canIUseRouter({
    url: pageId,
    success: res => {
      if (res?.result) {
        const { devId } = getDevInfo();

        const url = `thingSmart://${pageId}?extra_camera_uuid=${devId}&theme=2`;

        ty.router({
          url,
          success: d => {
            console.log(d);
          },
          fail: e => {
            showToast();
            console.log(e);
          },
        });
      }
    },
    fail: err => {
      console.log(err);
      showToast();
    },
  });
};

/**
 * 单个设备断流
 */
export const stopPreview = () => {
  return new Promise((resolve, reject) => {
    if (getDevInfo().devId.startsWith('vdevo')) {
      resolve(true);
    }
    const { streamStatus, playerCtx } = store.getState().ipcCommon;
    if (streamStatus === 1) {
      console.log('stopPreview');
      playerCtx.stopPreview({
        success: () => {
          resolve(true);
        },
        fail: () => {
          reject();
        },
      });
    } else {
      resolve(true);
    }
  });
};

// 单个设备开始录屏
const singleStartRecord = () => {
  return new Promise(resolve => {
    const { devStreamStatus, playerCtx } = store.getState().ipcCommon;
    if (devStreamStatus === 1002) {
      playerCtx.ctx.startRecord({
        saveToAlbum: true,
        success: () => {
          resolve(true);
        },
        fail: () => {
          resolve(false);
        },
      });
    } else {
      resolve(false);
    }
  });
};

// 单个设备停止录屏
const singleStopRecord = () => {
  return new Promise(resolve => {
    const { devStreamStatus, playerCtx } = store.getState().ipcCommon;
    if (devStreamStatus === 1002) {
      playerCtx.ctx.stopRecord({
        success: res => {
          resolve(res);
        },
        fail: () => {
          resolve(false);
        },
      });
    } else {
      resolve(false);
    }
  });
};

/**
 * 麦克风权限
 */
export const setRecordAuthorize = async () => {
  const type = 'scope.record';
  return setAuthorize(type);
};

/**
 * 开始录制
 */
export const startRecord = async () => {
  showToast('ipc_record_start', 'none');
  await setAlbumAuthorize();
  await setRecordAuthorize();

  return new Promise((resolve, reject) => {
    const { dispatch } = store;

    singleStartRecord()
      .then(res => {
        if (res) {
          showToast('ipc_3s_can_not_donging', 'none');
          dispatch(updateIpcCommon({ isRecording: true }));

          resolve(true);
        } else {
          showToast();
          reject();
        }
      })
      .catch(err => {
        showToast();
        reject(err);
      });
  });
};

/**
 * 操作录制
 * @param record 是否录制 true：停止录制 false：开始录制
 * @param show 是否判断在双向对讲
 * @returns
 */
export const setRecord = (record: boolean, show = true) => {
  if (show) {
    if (isTwoTalkFun()) return Promise.reject();
  }

  if (record) {
    return stopRecord();
  }
  return startRecord();
};

/**
 * 停止录制
 * 对两个设备操作，均需判断设备状态
 * @param showErrorToast 是否展示错误提示
 */
export const stopRecord = async (showErrorToast = true) => {
  return new Promise((resolve, reject) => {
    const { dispatch } = store;

    singleStopRecord()
      .then((res: any) => {
        if (res) {
          if (res.thumbPath) {
            dispatch(updateIpcCommon({ recordPic: [res.thumbPath] }));
          }
          dispatch(updateIpcCommon({ isRecording: false }));
          dispatch(updateIpcCommon({ recordType: 2 }));
          dispatch(updateIpcCommon({ recordSuccess: true }));

          setTimeout(() => {
            dispatch(updateIpcCommon({ recordSuccess: false }));
          }, 5000);

          resolve(true);
        } else {
          showErrorToast && showToast();
          reject();
        }
      })
      .catch(err => {
        showToast();
        reject(err);
      });
  });
};

// 自动断开录屏，若失败不提示
export const autoStopRecord = () => {
  const { isRecording } = store.getState().ipcCommon;

  if (isRecording) {
    showToast('ipc_disconnect_auto_stop_record', 'none');
    stopRecord(false);
  }
};

// 自动断开双向对讲，若失败不提示
export const autoStopTwoTalk = () => {
  const { isTwoTalking } = store.getState().ipcCommon;

  if (isTwoTalking) {
    showToast('ipc_disconnect_auto_stop_two_talk', 'none');
    stopTalk(false);
  }
};

/**
 * 流状态同步到
 * connect成功：1001  connect失败：-1001
 * 预览成功：1002     预览失败：-1002
 * 其他异常：-1000
 * 暂停预览：4
 * disconnect成功：1009  disconnect失败：-1009
 */
export const subStatusToMain = (data: number) => {
  const { dispatch } = store;

  console.log('stream', data);

  if (data === 1002) {
    dispatch(updateIpcCommon({ isPreview: true }));
    dispatch(updateIpcCommon({ streamStatus: 1 }));
    // closeShowFullButtonAfter5s();
  } else if (data < 0) {
    dispatch(updateIpcCommon({ isPreview: false }));
    dispatch(updateIpcCommon({ streamStatus: 2 }));
  }

  // 非预览时，全屏下头部组件显示
  if (data !== 1002) {
    // openShowFullButton();
  }

  // 若在双向对讲、录制过程中，流报错断开双向对讲与录屏
  if (data < 0) {
    autoStopRecord();
    autoStopTwoTalk();
  }

  dispatch(updateIpcCommon({ devStreamStatus: data }));
};

/**
 * 查询授权状态
 * @param scope 权限类型 可选值：参考官方文档
 */
export const getAuthorizeStatus = (scope: string) => {
  return new Promise(resolve => {
    authorizeStatus({
      scope,
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      },
    });
  });
};

/**
 * 设置权限
 * @param scope 权限类型 可选值：参考官方文档
 */
const setAuthorize = async (scope: string) => {
  const status = await getAuthorizeStatus(scope);

  if (status) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    authorize({
      scope,
      success: () => {
        resolve(status);
      },
      fail: err => {
        console.log('设置权限失败', err);
        showToast('ipc_permission_fail', 'none');
        reject();
      },
    });
  });
};

/**
 * 相册权限
 */
export const setAlbumAuthorize = () => {
  return setAuthorize('scope.writePhotosAlbum');
};

// 单个设备截图
const singleSnapshot = () => {
  return new Promise(resolve => {
    const { devStreamStatus, playerCtx } = store.getState().ipcCommon;
    if (devStreamStatus === 1002) {
      playerCtx.ctx.snapshot({
        saveToAlbum: true,
        success: res => {
          resolve(res);
        },
        fail: () => {
          resolve(false);
        },
      });
    } else {
      resolve(false);
    }
  });
};

/**
 * 截图
 * 对两个设备操作，均需判断设备状态
 */
export const snapshot = async () => {
  if (holdUp()) return null;
  await setAlbumAuthorize();

  return new Promise((resolve, reject) => {
    const { dispatch } = store;

    singleSnapshot()
      .then((res: any) => {
        if (res) {
          if (res.thumbPath) {
            dispatch(updateIpcCommon({ recordPic: [res.thumbPath] }));
          }

          dispatch(updateIpcCommon({ recordType: 1 }));
          dispatch(updateIpcCommon({ recordSuccess: true }));

          setTimeout(() => {
            dispatch(updateIpcCommon({ recordSuccess: false }));
          }, 5000);

          resolve(true);
        } else {
          showToast();
          reject();
        }
      })
      .catch(err => {
        showToast();
        reject(err);
      });
  });
};

/**
 * 扬声器
 * @param isMute 静音状态
 */
export const setMute = (isMute: boolean) => {
  if (isRecordingFun()) {
    // 录制中不可操作
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    const { playerCtx } = store.getState().ipcCommon;
    const { dispatch } = store;
    playerCtx.ctx.setMuted({
      mute: isMute,
      success: () => {
        console.log('设置声音');
        dispatch(updateIpcCommon({ isMute }));
        resolve(true);
      },
      fail: () => {
        showToast();
        reject();
      },
    });
  });
};

/**
 * 横竖屏幕切换
 * @param dir 2: 全屏 1：竖屏
 */
export const setOrientation = (dir = 2) => {
  let pageOrientation = 'landscape';
  const { dispatch } = store;

  if (dir === 1) {
    pageOrientation = 'portrait';
  }
  // 提前变更状态，让横屏下需隐藏的组件隐藏
  dispatch(updateIpcCommon({ isFull: dir === 2 }));

  setPageOrientation({
    pageOrientation,
    success: () => {
      if (dir === 2) {
        hideStatusBar();

        setNavigationBarBack({
          type: 'custom',
        });

        dispatch(updateIpcCommon({ showFullButton: true }));
      } else {
        setNavigationBarBack({
          type: 'system',
        });
        showStatusBar();
      }
    },
  });
};

/**
 * 打开设置页
 * @param deviceId 设备id
 * @param extraData 携带传入的额外参数
 * @param fn 设置页传递消息监听事件
 * @returns
 */
export const openPanel = (deviceId: string, extraData?: Record<string, any>, fn?: any) => {
  return new Promise((resolve, reject) => {
    navigateToMiniProgram({
      appId: 'tycc0pbqpupbc2zkgz',
      path: `/pages/setting/index?deviceId=${deviceId}`,
      extraData: extraData || {},
      position: 'right',
      events: {
        acceptDataByChild: data => {
          if (fn) {
            fn(data);
          }
        },
      },
      success: () => {
        resolve(true);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

// 打开面板小程序
export const openPanelApp = () => {
  const { mainDeviceCameraConfig } = store.getState().ipcCommon;

  openPanel(getDevInfo().devId, { mainDeviceCameraConfig }, data => {
    const { type } = data;
    // const supportedAudioMode = data?.mainDeviceCameraConfig?.supportedAudioMode;
    switch (type) {
      // case 'changeTalkType':
      //   Storage.setDevItem('talkType', supportedAudioMode).then(() => {
      //     store.dispatch(
      //       actions.common.mainDeviceCameraConfig({
      //         supportedAudioMode,
      //       })
      //     );
      //   });
      //   break;
      case 'exitMiniProgram':
        setTimeout(() => {
          exitMiniProgram();
        }, 50);
        break;
      default:
    }
  });
};

/**
 * 是否静音
 */
export const isMuting = () => {
  return new Promise((resolve, reject) => {
    const { playerCtx } = store.getState().ipcCommon;
    playerCtx.ctx.isMuted({
      success: val => {
        resolve(val);
      },
      fail: () => {
        reject();
      },
    });
  });
};

/**
 * 开启对讲
 */
export const startTalk = async () => {
  const { isTwoTalking } = store.getState().ipcCommon;
  // 开启对讲
  return new Promise((resolve, reject) => {
    const { playerCtx } = store.getState().ipcCommon;

    playerCtx.ctx.startTalk({
      success: () => {
        if (isTwoTalking) showToast('ipc_3s_can_not_donging', 'none');
        resolve(true);
      },
      fail: () => {
        showToast();
        reject();
      },
    });
  });
};

/**
 * 关闭对讲
 * @param showErrorToast 是否显示错误提示
 */
export const stopTalk = (showErrorToast = true) => {
  return new Promise((resolve, reject) => {
    const { playerCtx } = store.getState().ipcCommon;

    playerCtx.ctx.stopTalk({
      success: () => {
        resolve(false);
      },
      fail: () => {
        showErrorToast && showToast();
        reject();
      },
    });
  });
};

/**
 * 双向对讲操作
 * @param enable 开启对讲：true 关闭对讲：false
 * @param show 是否需判断在录制中
 */
export const setTalk = async (enable: boolean, show = true) => {
  if (show) {
    // 判断是否在录制中
    if (isRecordingFun()) return Promise.reject();
  }

  const { devStreamStatus } = store.getState().ipcCommon;

  if (devStreamStatus === 1002) {
    if (enable) {
      // 双向对讲在获取到权限后可自动进行后续操作
      await setRecordAuthorize();

      showToast('ipc_click_to_call', 'none');
      const isMute = await isMuting();

      // 静音先打开扬声器
      if (isMute) {
        await setMute(false);
      }

      return startTalk();
    }
    return stopTalk();
  }

  return Promise.reject();
};
