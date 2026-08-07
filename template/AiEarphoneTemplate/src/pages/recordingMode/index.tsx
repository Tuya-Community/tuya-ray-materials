// 音频容器，用于统一处理录音、实时转写、电话录音、同声传译

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  RecordType,
  updateRecordTask,
  RecordStatus,
  selectAudioFileByKey,
  isForeignAppRecordingTask,
} from '@/redux/modules/audioFileSlice';
import { router, usePageEvent, location } from '@ray-js/ray';
import RecordingModes from '@/components/RecordingModes';
import RealTimeRecording from '@/components/RealTimeRecording';
import PhoneStatusTip from '@/components/PhoneStatusTip';

import { RecordMode, AudioSource, DEVTYPES } from '@/constant/enums';
import { useDispatch } from 'react-redux';
import { getSupportLangList, updateUiState } from '@/redux/modules/uiStateSlice';
import { selectDevInfo, devInfoChange } from '@/redux/modules/devInfoSlice';
import { getDeviceList } from '@/redux/modules/deviceListSlice';
import { useInterval, useRequest, useSetState } from 'ahooks';
import { isEqual } from 'lodash-es';
import Strings from '@/i18n';
import { selectDpStateByDev } from '@/redux/modules/devsDpStateSlice';
import { updateMode, updateIsCall } from '@/redux/modules/recordConfigSlice';
import {
  formatDevSchema,
  backToHome,
  setStorageDevInfo,
  setStorageLastModePath,
  getStorageLastModePath,
  checkBalance,
  checkDpExist,
  checkIsCall,
  getAudioSource,
} from '@/utils';
import { setStorageRecordingDeviceId, clearStorageRecordingDeviceId } from '@/utils/recording';
import {
  tttStartAudioRecording,
  tttPauseRecord,
  tttResumeRecord,
  tttStopRecord,
  tttUpdateParams,
  tttGetEarPhoneBTConnectedStatus,
} from '@/api/ttt';
import store, { useSelector } from '@/redux';
import { aiModeCode, offlineRecordCode } from '@/config/dpCodes';
import { handleTttError } from '@/utils/code';
import CustomDialogModal from '@/components/customDialogModal';
import BenefitRestrictedDialog from '@/components/BenefitRestrictedDialog';
import { useEnsurePageReady } from '@/utils/pageReadyBus';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';
import { SwitchAudioSource } from './interface';

const delayTime = 300; // 延时300毫秒，避免界面闪烁

const RecordingModePage = () => {
  const { query }: any = location;
  const queryModeKey = query?.modeKey?.split('?')?.[0];
  const fromType = query?.fromType || '';
  const fromDeviceId = query.deviceId || '';
  useAppFloatCtrl(false);
  const dispatch = useDispatch();
  const { mode, isCall } = useSelector(state => {
    return state?.recordConfig;
  });
  const storageModeKey = getStorageLastModePath();
  const currentMode = mode || queryModeKey || storageModeKey || RecordMode.liveRecording;
  const isPhoneRecordingMode = currentMode === RecordMode.phoneRecording;
  const task = useSelector(selectAudioFileByKey('task'));
  const { taskState } = useSelector(state => state.audioFile);
  const devInfo = useSelector(selectDevInfo);
  const deviceList = useSelector(getDeviceList);
  const aiModeDp = useSelector(selectDpStateByDev(devInfo.devId, aiModeCode as never));
  const offlineRecordState = useSelector(
    selectDpStateByDev(devInfo.devId, offlineRecordCode as never)
  );
  const lastTimeRef = useRef(0);
  const [duration, setDuration] = useState(0); // 毫秒
  const [interval, setInterval] = useState<number | undefined>(undefined);
  const [syncWaveDuration, setSyncWaveDuration] = useState(0); // WaveAnim 对齐目标时长
  const [syncWaveTrigger, setSyncWaveTrigger] = useState(0); // 强制触发 WaveAnim 对齐
  const [controlBtnLoading, setControlBtnLoading] = useState(false);
  const [currRecordType, setCurrRecordType] = useState<RecordType>(RecordType.Live);
  const [catchConfig, setCatchConfig] = useState(null);
  const taskSyncedRef = useRef(false);
  const switchConfig = useSelector(state => state.uiState.switchConfig);
  const [isPauseSelf, setIsPauseSelf] = useState(false);
  const { homeId } = useSelector(state => state.homeInfo);

  const { devId: deviceId = '', isOnline, customDevType } = devInfo || {};

  const selectedDevIdRef = useRef('');

  const [btConnectedStatus, setBTConnectedStatus] = useState(null); // 耳机bt连接状态
  const [offlineDialogState, setOfflineDialogState] = useSetState({
    show: false,
    type: 'proOffline',
  });
  // 获取耳机蓝牙连接状态
  const { run: getBTConnectedStatus, loading: btQueryLoading } = useRequest(
    tttGetEarPhoneBTConnectedStatus,
    {
      manual: true,
      onSuccess: (res: number) => {
        setBTConnectedStatus(res);
        checkAndShowOfflineDialog(res);
      },
      onError: (error: any) => {
        // BT 状态查询失败：关闭 loading 并提示用户
        ty.hideLoading();
        if (isPhoneRecordingMode) {
          handleTttError(error);
        }
      },
    }
  );

  // 电话录音模式下 BT 状态查询期间显示全屏 loading，录音启动成功后由 startRecordingProcess 负责隐藏
  // 已有进行中的录音任务时（如再次进入录音页）无需展示 loading：
  useEffect(() => {
    const isRecording = taskState === RecordStatus.RECORDING || taskState === RecordStatus.PAUSE;
    if (isPhoneRecordingMode && btQueryLoading && !isRecording) {
      ty.showLoading({ title: '' });
    }
  }, [isPhoneRecordingMode, btQueryLoading, taskState]);

  useEffect(() => {
    dispatch(updateUiState({ hasVisitHomeOrRecordingPage: true }));
  }, [dispatch]);

  useEffect(() => {
    if (taskState === RecordStatus.FINISH) {
      clearStorageRecordingDeviceId();
      backToHome(fromType);
    }
  }, [taskState, fromType]);

  const modeInitializedRef = useRef(false);

  useEffect(() => {
    if (modeInitializedRef.current) return;
    const initMode = mode || queryModeKey || storageModeKey;
    if (initMode) {
      modeInitializedRef.current = true;
      if (initMode !== mode) {
        dispatch(updateMode(initMode));
      }
    }
  }, [queryModeKey, mode, storageModeKey]);

  // 暂停
  const handlePauseRecord = async () => {
    try {
      setControlBtnLoading(true);
      await tttPauseRecord(deviceId);
      setInterval(undefined);
      setTimeout(() => {
        setControlBtnLoading(false);
      }, delayTime); // 延时1秒，避免界面闪烁
    } catch (error) {
      setControlBtnLoading(false);
    }
  };

  // 恢复
  const handleResumeRecord = async () => {
    try {
      setControlBtnLoading(true);
      await tttResumeRecord(deviceId);
      setInterval(1000);
      lastTimeRef.current = Date.now();
      setTimeout(() => {
        setControlBtnLoading(false);
      }, delayTime); // 延时1秒，避免界面闪烁
    } catch (error) {
      setControlBtnLoading(false);
    }
  };

  // 停止
  const handleStopRecord = async () => {
    if (task?.state !== RecordStatus.PAUSE && task?.state !== RecordStatus.RECORDING) return;
    try {
      ty.showLoading({ title: '' });
      await tttStopRecord(deviceId);
      setDuration(0);
      setInterval(undefined);
      clearStorageRecordingDeviceId();
      ty.hideLoading();
    } catch (error) {
      ty.hideLoading();
    }
  };

  const getCurrRecordType = () => {
    switch (currentMode) {
      case RecordMode.liveRecording:
        return RecordType.Live;
      case RecordMode.phoneRecording:
        return RecordType.Call;
      case RecordMode.realTimeRecording:
        return RecordType.Live;
      case RecordMode.simultaneousInterpretation:
        return RecordType.Live;
      default:
        return RecordType.Live;
    }
  };

  const handleSwitchAudioSource = (e: SwitchAudioSource) => {
    const devList = store.getState()?.deviceList || [];
    if (e.audioSource === AudioSource.phone) {
      ty.showToast({ title: Strings.getLang('ear_offline_warn') });
      const changedDev = devList?.find(item => item.customDevType === DEVTYPES.phone);
      dispatch(devInfoChange(formatDevSchema(changedDev)));
      return;
    }
    ty.showToast({ title: Strings.getLang('ear_online_warn') });
    if (devList?.length > 2) {
      return;
    }

    const changedDev = devList?.find(item => item.customDevType !== DEVTYPES.phone);
    changedDev && dispatch(devInfoChange(formatDevSchema(changedDev)));
  };

  // 卡片的dp点，是会议模式还是电话模式
  const isCardCalling = useMemo(() => {
    if (checkDpExist(aiModeCode) && customDevType === DEVTYPES.card) {
      switch (aiModeDp) {
        case 'meeting':
          return false;
        case 'phone':
          return true;
        default:
          break;
      }
    }
    return false;
  }, [aiModeDp, customDevType]);

  useEffect(() => {
    const cType = getCurrRecordType();
    const isRecording =
      task?.state === RecordStatus.RECORDING || task?.state === RecordStatus.PAUSE;

    // 录音进行中时不从 mode 覆盖 isCall/currRecordType，
    // 由 [task, devInfo] effect 从服务端 task 数据统一同步，避免两个 effect 竞争导致振荡
    if (!isRecording) {
      if (currentMode === RecordMode.phoneRecording) {
        dispatch(updateIsCall(true));
      } else {
        dispatch(updateIsCall(false));
      }
      setCurrRecordType(cType);
    }

    setIsPauseSelf(false);

    // @ts-ignore
    getSupportLangList(currentMode);
    if (currentMode) {
      dispatch(updateRecordTask());
    }
  }, [currentMode, dispatch]);

  useEffect(() => {
    if (!devInfo?.devId) return;
    selectedDevIdRef.current = devInfo.devId;
    getBTConnectedStatus(devInfo.devId);
  }, [devInfo?.devId]);

  // 耳机蓝牙连接状态变化
  const handleEarPhoneBTConnectedStatusChange = (res: any) => {
    if (res?.devId !== selectedDevIdRef.current) return;
    setBTConnectedStatus(res?.connectedStatus);
  };

  useEffect(() => {
    ty.wear.onRecordSwitchAudioSourceEvent(handleSwitchAudioSource);
    // @ts-ignore
    ty.wear?.onEarPhoneBTConnectedStatusChangeEvent?.(handleEarPhoneBTConnectedStatusChange);
    return () => {
      ty.wear.offRecordSwitchAudioSourceEvent(handleSwitchAudioSource);
      // @ts-ignore
      ty.wear?.offEarPhoneBTConnectedStatusChangeEvent?.(handleEarPhoneBTConnectedStatusChange);
      ty.hideLoading();
    };
  }, []);

  /**
   * 验证录音前置条件
   * @returns 返回验证失败的原因，如果通过则返回 null
   */
  const validateRecordingConditions = useCallback(
    (override?: { isOnline?: boolean; customDevType?: string }) => {
      const currentIsOnline = override?.isOnline ?? isOnline;
      const currentCustomDevType = override?.customDevType ?? customDevType;
      // 离线录音中
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!offlineRecordState) {
        return { message: Strings.getLang('offline_recording_mode_content'), icon: 'none' };
      }

      // 按钮加载中
      if (controlBtnLoading) {
        return null; // 静默返回，不提示
      }

      // // 同步中
      // if (isSyncing) {
      //   return { message: Strings.getLang('hint_content'), icon: 'none' };
      // }

      // 设备离线
      if (!currentIsOnline) {
        return { message: Strings.getLang('device_offline'), icon: 'none' };
      }

      // OS设备蓝牙未连接, app 底层处理，小程序不做处理
      // if (currentCustomDevType === DEVTYPES.os && btConnectedStatus === 0) {
      //   return { message: Strings.getLang('bluetooth_disconnect'), icon: 'none' };
      // }

      return null;
    },
    [offlineRecordState, controlBtnLoading, isOnline, customDevType, btConnectedStatus]
  );

  /**
   * 处理录音启动错误
   */
  const handleRecordingError = useCallback(
    (error: any) => {
      setInterval(undefined);
      setControlBtnLoading(false);

      // 电话模式特殊错误处理
      if (isCall && error?.innerError?.errorCode === '10061') {
        ty.showToast({
          title: Strings.getLang('error_start_record_need_phone_call'),
          icon: 'error',
        });
        return;
      }
      handleTttError(error);
    },
    [isCall]
  );

  /**
   * 执行录音启动
   */
  const startRecordingProcess = useCallback(
    async (recordingConfig: any, targetDevInfo: any = devInfo) => {
      try {
        setControlBtnLoading(true);
        setIsPauseSelf(true);
        await tttStartAudioRecording(recordingConfig, isPhoneRecordingMode);

        // 录音成功后隐藏 loading
        ty.hideLoading();

        // 录音成功后的状态更新
        setCatchConfig(recordingConfig);
        setStorageDevInfo(targetDevInfo);
        setStorageLastModePath(currentMode);
        setStorageRecordingDeviceId(recordingConfig?.deviceId);
        setInterval(1000);
        lastTimeRef.current = Date.now();
        setControlBtnLoading(false);
      } catch (error) {
        ty.hideLoading();
        setIsPauseSelf(false);
        handleRecordingError(error);
      }
    },
    [isPhoneRecordingMode, devInfo, currentMode, handleRecordingError]
  );

  /**
   * 检查电话模式下的离线状态并显示对话框
   * @returns 如果需要显示对话框返回 true，否则返回 false
   */
  const checkAndShowOfflineDialog = useCallback(
    (btStatus?: number) => {
      const btFinalStatus = btStatus || btConnectedStatus;
      if (!isPhoneRecordingMode) {
        return false;
      }

      // 设备离线
      if (!isOnline) {
        setOfflineDialogState({
          show: true,
          type: 'proOffline',
        });
        return true;
      }

      // 蓝牙未连接
      if (btFinalStatus === 0) {
        setOfflineDialogState({
          show: true,
          type: 'btOffline',
        });
        return true;
      }

      return false;
    },
    [isPhoneRecordingMode, isOnline, btConnectedStatus]
  );

  /**
   * 请求录音权限（手机和入口级设备）
   */
  const requestRecordPermission = useCallback((callback: () => void) => {
    ty.authorize({
      scope: 'scope.record',
      success: callback,
      fail: error => {
        ty.showToast({
          title: Strings.getLang('no_record_permisson'),
          icon: 'error',
        });
      },
    });
  }, []);

  const handleStartRecord = useCallback(
    async (recordingConfig: any) => {
      if (isForeignAppRecordingTask(task)) {
        ty.showToast({
          title: Strings.getLang('aiTrans_recording'),
          icon: 'none',
        });
        if (isPhoneRecordingMode) {
          ty.hideLoading();
        }
        return;
      }

      // 1. 电话模式下，检查设备离线或蓝牙未连接状态
      if (checkAndShowOfflineDialog()) {
        return;
      }

      let startConfig = recordingConfig;
      let startDevice = devInfo;

      // 非电话模式：当前设备离线时自动切到手机再开始录音（路由指定的设备不降级）
      const isFromRouteDevice = fromDeviceId;
      if (!isPhoneRecordingMode && !isOnline && !isFromRouteDevice) {
        const phoneDev = deviceList?.find(
          item => item?.customDevType === DEVTYPES.phone && item?.isOnline
        );
        if (phoneDev) {
          startDevice = formatDevSchema(phoneDev);
          // 当前选中设备切换到手机
          dispatch(devInfoChange(startDevice));
          startConfig = {
            ...recordingConfig,
            deviceId: startDevice.devId,
            config: {
              ...recordingConfig.config,
              audioSource: getAudioSource(DEVTYPES.phone, currRecordType, false),
            },
          };
          if (startConfig?.config?.ttsConfig) {
            startConfig.config.ttsConfig = {
              ...startConfig.config.ttsConfig,
              devId: '',
            };
          }
        }
      }

      // 2. 验证前置条件
      const validationError = validateRecordingConditions({
        isOnline: startDevice?.isOnline,
        customDevType: startDevice?.customDevType,
      });
      if (validationError) {
        if (validationError.message) {
          ty.showToast({
            title: validationError.message,
            icon: validationError.icon as any,
          });
        }
        if (isPhoneRecordingMode) {
          ty.hideLoading();
        }
        return;
      }

      // 3. 检查账户余额(实时转写、同声传译)
      const needCheckBalance =
        currentMode === RecordMode.realTimeRecording ||
        currentMode === RecordMode.simultaneousInterpretation;
      if (needCheckBalance) {
        const balance = ((await checkBalance(homeId, startConfig?.deviceId)) as number) || 0;
        if (balance !== 1) return;
      }

      // 4. 根据设备类型请求权限或直接开始录音
      const needPermission =
        startDevice?.customDevType === DEVTYPES.phone ||
        startDevice?.customDevType === DEVTYPES.os ||
        startDevice?.customDevType === DEVTYPES.entry;

      if (needPermission) {
        requestRecordPermission(() => startRecordingProcess(startConfig, startDevice));
      } else {
        await startRecordingProcess(startConfig, startDevice);
      }
    },
    [
      checkAndShowOfflineDialog,
      validateRecordingConditions,
      homeId,
      deviceId,
      isOnline,
      devInfo,
      deviceList,
      customDevType,
      currRecordType,
      dispatch,
      requestRecordPermission,
      startRecordingProcess,
      isPhoneRecordingMode,
      currentMode,
      task,
    ]
  );

  const handleUpdateRecord = useCallback(
    async recordingConfig => {
      // 非笔记小程序触发的录音，不做处理
      // if (task?.businessType !== BusinessType.Note) {
      //   return
      // }
      if (!homeId || !recordingConfig?.deviceId) return;
      const isRecording =
        task?.state === RecordStatus.RECORDING || task?.state === RecordStatus.PAUSE;
      // 外部进入时 catchConfig 为 null，需等 task effect 同步完 isCall/currRecordType 后再允许更新，
      // 否则会用不稳定的 recordingConfig 触发 tttUpdateParams 导致 audioSource 振荡
      const needUpdate = isRecording && !catchConfig && taskSyncedRef.current;
      if ((isRecording && !!catchConfig && !isEqual(recordingConfig, catchConfig)) || needUpdate) {
        setCatchConfig(recordingConfig);
        setStorageDevInfo(devInfo);

        await tttUpdateParams(recordingConfig);
        dispatch(updateRecordTask()); // 更新任务数据，防止丢失
      }
    },
    [task?.state, catchConfig, devInfo, homeId]
  );

  // 切回录音页时拉取最新任务并同步计时与时间轴（刻度线仍向左滚动，仅对齐中心线时间与计时器）
  usePageEvent('onShow', () => {
    if (task?.state === RecordStatus.RECORDING || task?.state === RecordStatus.PAUSE) {
      dispatch(updateRecordTask());
      if (task?.userRecordDuration != null) {
        setDuration(prev => {
          const nextDuration = Math.max(prev, task.userRecordDuration);
          setSyncWaveDuration(nextDuration);
          setSyncWaveTrigger(trigger => trigger + 1);
          return nextDuration;
        });
        lastTimeRef.current = Date.now();
      }
    }
  });

  useEffect(() => {
    // isNoteRecordingRef.current = task && task?.businessType !== BusinessType.Note ? task?.businessType : BusinessType.Note
    // businessType 为0 才是笔记小程序发起的录音
    if (!task || !task?.state) {
      setDuration(0);
      setInterval(undefined);
      return;
    }
    const syncTaskDuration = () => {
      if (task.userRecordDuration == null) {
        return;
      }
      setDuration(prevDuration => {
        const nextDuration = Math.max(prevDuration, task.userRecordDuration);
        setSyncWaveDuration(nextDuration);
        setSyncWaveTrigger(trigger => trigger + 1);
        return nextDuration;
      });
    };
    switch (task.state) {
      case RecordStatus.PAUSE:
        setInterval(undefined);
        syncTaskDuration();
        if (
          (devInfo.customDevType === DEVTYPES.pro || devInfo.customDevType === DEVTYPES.card) &&
          !devInfo.isOnline
        ) {
          // 停止录音
          handleStopRecord();
        }
        break;
      case RecordStatus.RECORDING:
        setInterval(1000);
        lastTimeRef.current = Date.now();
        syncTaskDuration();
        break;
      default:
        break;
    }
    dispatch(updateIsCall(checkIsCall(task)));
    setCurrRecordType(task.recordType);
    // 标记 task 已同步，允许 handleUpdateRecord 的 needUpdate 逻辑执行
    taskSyncedRef.current = true;
  }, [task, devInfo]);

  useEnsurePageReady('/recordingMode');

  const translateOption = useMemo(() => {
    if (currentMode === RecordMode.realTimeRecording) {
      return 'output';
    }
    return 'input';
  }, [currentMode]);

  // 自动关闭对话框：当设备恢复在线且蓝牙连接时
  useEffect(() => {
    if (isOnline && btConnectedStatus === 1 && offlineDialogState.show) {
      setOfflineDialogState({
        show: false,
      });
    }
  }, [btConnectedStatus, offlineDialogState.show, isOnline, customDevType]);

  useInterval(
    () => {
      const now = Date.now();
      const elapsed = now - lastTimeRef.current; // 计算实际经过的时间
      lastTimeRef.current = now;
      setDuration(prevDuration => prevDuration + elapsed); // 累加实际经过的时间
    },
    interval,
    {
      immediate: false,
    }
  );

  return (
    <>
      {currentMode === RecordMode.liveRecording || currentMode === RecordMode.phoneRecording ? (
        <RecordingModes
          key={currentMode}
          currentMode={currentMode}
          isCardCalling={isCardCalling}
          currRecordType={currRecordType}
          handleStartRecord={handleStartRecord}
          duration={duration}
          isPauseSelf={isPauseSelf}
          setIsPauseSelf={setIsPauseSelf}
          setDuration={setDuration}
          handleResumeRecord={handleResumeRecord}
          handlePauseRecord={handlePauseRecord}
          handleStopRecord={handleStopRecord}
          lastTimeRef={lastTimeRef}
          setInterval={setInterval}
          handleUpdateRecord={handleUpdateRecord}
          controlBtnLoading={controlBtnLoading}
          syncWaveDuration={syncWaveDuration}
          syncWaveTrigger={syncWaveTrigger}
          handleBack={() => backToHome(fromType)}
        />
      ) : null}

      {(currentMode === RecordMode.realTimeRecording ||
        currentMode === RecordMode.simultaneousInterpretation) && (
        <RealTimeRecording
          key={currentMode}
          isCardCalling={isCardCalling}
          need={currentMode === RecordMode.simultaneousInterpretation}
          handleStartRecord={handleStartRecord}
          isPauseSelf={isPauseSelf}
          setIsPauseSelf={setIsPauseSelf}
          duration={duration}
          setDuration={setDuration}
          handleResumeRecord={handleResumeRecord}
          handlePauseRecord={handlePauseRecord}
          handleStopRecord={handleStopRecord}
          lastTimeRef={lastTimeRef}
          setInterval={setInterval}
          controlBtnLoading={controlBtnLoading}
          currRecordType={currRecordType}
          handleUpdateRecord={handleUpdateRecord}
          catchRecordingConfig={catchConfig}
          translateOption={translateOption}
          handleBack={() => backToHome(fromType)}
        />
      )}

      {switchConfig?.deviceGuide && <PhoneStatusTip />}
      <BenefitRestrictedDialog />
      {isCall && (
        <CustomDialogModal
          visible={offlineDialogState.show}
          type={offlineDialogState.type as any}
          onClose={() => setOfflineDialogState({ show: false })}
          onHelp={() => {
            /* 跳转帮助 */
            router.push(`/btOffline`);
          }}
        />
      )}
    </>
  );
};

export default RecordingModePage;
