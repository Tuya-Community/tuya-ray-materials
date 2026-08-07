import React, { useEffect, useState, useMemo, useRef } from 'react';
import { usePageEvent, getSystemInfoSync } from '@ray-js/ray';
import { View, Text, Button } from '@ray-js/components';
import { useDispatch } from 'react-redux';
import { useSelector } from '@/redux';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { checkBalance, getAudioSource } from '@/utils';
import { getStorageRecordingDeviceId } from '@/utils/recording';
import { RecordMode } from '@/constant/enums';
import { tttChangeRecordChannel, tttOperateEventLimit } from '@/api/ttt';
import WaveAnim from '@/components/WaveAnim';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import {
  RecordStatus,
  selectAudioFileByKey,
} from '@/redux/modules/audioFileSlice';
import Layout from '@/components/RecordLayout';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import Strings from '@/i18n';
import RecordCtr from '@/components/Recordctrl';
import TimeDisplay from '@/components/Duration';
import { updateMode } from '@/redux/modules/recordConfigSlice';
import { handleTttError } from '@/utils/code';
import styles from './index.module.less';

const Recording = ({
  currentMode,
  currRecordType,
  handleStartRecord,
  duration,
  setDuration,
  handlePauseRecord,
  handleResumeRecord,
  handleStopRecord,
  lastTimeRef,
  setInterval,
  controlBtnLoading,
  handleUpdateRecord,
  isCardCalling,
  syncWaveDuration = 0,
  syncWaveTrigger = 0,
  isPauseSelf,
  setIsPauseSelf,
  handleBack,
}) => {
  const dispatch = useDispatch();
  const devInfo = useSelector(selectDevInfo);
  const { devId: deviceId = '', isOnline, isDevOnline, customDevType, homeId } = devInfo || {};
  const { isCall } = useSelector(state => {
    return state?.recordConfig;
  });
  const { windowWidth } = useSelector(selectSystemInfo);
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  const isBtEntryVersion = useSelector(selectUiStateByKey('isBtEntryVersion')); // 是否是入门版耳机
  const supportRecordChannelChange = useSelector(selectUiStateByKey('supportRecordChannelChange')); // 离线可用
  const isCardStyle = productStyle === 'card';
  // 先排除卡片
  const [recordChannel, setRecordChannel] = useState(isBtEntryVersion && !isCardStyle ? 1 : 0); // 0:ble 1:bt 2:mic

  const task = useSelector(selectAudioFileByKey('task'));
  const {
    safeArea: { top: sysTopDistance },
  } = getSystemInfoSync();

  const recordingConfig = useMemo(() => {
    return {
      deviceId,
      config: {
        // 发起源 0:AI Note  1：AI Translate
        businessType: 0,
        // 音频输入源
        audioSource: getAudioSource(customDevType, currRecordType, isCall),
        // 录音类型，0呼叫，1会议
        recordType: currRecordType,
        // 是否需要ASR
        needAsr: false,
        // 是否需要翻译
        needTranslate: false,
        // 是否需要TTS
        needTts: false,
        needAmplitude: true, // 是否需要振幅
      },
    };
  }, [deviceId, customDevType, currRecordType, isCall]);

  const checkRecordTask = async () => {
    if (task) {
      const { userRecordDuration } = task;
      setDuration(duration > userRecordDuration ? duration : userRecordDuration);
      if (task.state === RecordStatus.RECORDING) {
        setInterval(1000);
        lastTimeRef.current = Date.now();
      }
    } else {
      setDuration(0);
    }
  };

  const handleRecordFinishEvent = d => {
    if (d.deviceId !== deviceId) return;
    setDuration(0);
    const { code } = d;
    if (code === 0) return; // 0为正常结束
    if (code !== 10061 || !isCall) {
      handleTttError(d, true);
    }

    setInterval(undefined);
  };

  // 电话挂断弹窗已显示标记，避免重复弹出
  const callEndTipShownRef = useRef(false);

  // 电话录音模式下，监听到挂断事件（errorCode=10022）后弹窗提示并结束录音
  const handleRealTimeRecognizeStatusUpdateEvent = (d: any) => {
    const { errorCode } = d || {};
    if (errorCode !== 10022) return;
    if (currentMode !== RecordMode.phoneRecording) return;
    if (callEndTipShownRef.current) return;
    callEndTipShownRef.current = true;
    // 收到挂断事件后即解绑，避免重复处理
    // @ts-ignore
    ty.wear?.offRecordTransferRealTimeRecognizeStatusUpdateEvent?.(
      handleRealTimeRecognizeStatusUpdateEvent
    );
    setInterval(undefined);
    ty.showModal({
      title: Strings.getLang('tip'),
      content: Strings.getLang('phone_call_end_tip'),
      showCancel: false,
      confirmText: Strings.getLang('confirm'),
      confirmColor: 'var(--color-primary)',
      success: ({ confirm }) => {
        if (!confirm) return;
        handleStopRecord();
      },
    });
  };

  const destroyEvent = () => {
    ty.wear.offRecordTransferFinishEvent(handleRecordFinishEvent);
    // @ts-ignore
    ty.wear?.offRecordTransferRealTimeRecognizeStatusUpdateEvent?.(
      handleRealTimeRecognizeStatusUpdateEvent
    );
    ty.hideLoading();
  };

  useEffect(() => {
    checkRecordTask();
  }, []);

  useEffect(() => {
    ty.wear.onRecordTransferFinishEvent(handleRecordFinishEvent);
    // 仅电话录音模式下监听挂断事件
    if (currentMode === RecordMode.phoneRecording) {
      callEndTipShownRef.current = false;
      // @ts-ignore
      ty.wear?.onRecordTransferRealTimeRecognizeStatusUpdateEvent?.(
        handleRealTimeRecognizeStatusUpdateEvent
      );
    }
    return () => {
      destroyEvent();
    };
  }, [isCall, currentMode, task?.state]);

  const handleControl = () => {
    // 断连或按钮加载状态时不可操作
    if (controlBtnLoading) return;
    if (!task || task?.state === RecordStatus.UNKNOWN || task?.state === RecordStatus.FINISH) {
      // 当前状态 无进行中的任务
      handleStartRecord(recordingConfig);
    } else if (task?.state === RecordStatus.RECORDING) {
      // 当前状态 录音中
      handlePauseRecord();
    } else if (task?.state === RecordStatus.PAUSE) {
      // 当前状态 暂停中
      handleResumeRecord();
    }
  };

  // Bluetooth connection lost
  useEffect(() => {
    if (!isOnline && duration) {
      // 断开连接时，停止录音
      handlePauseRecord();
    }
  }, [isOnline]);

  useEffect(() => {
    // 是入门版，非卡片，且设备实际在线，则默认通道为1
    if ((isBtEntryVersion || supportRecordChannelChange) && !isCardStyle && isDevOnline) {
      setRecordChannel(1);
    } else if (isDevOnline === false && isOnline && !isCardStyle) {
      // 真实设备离线，但是状态是在线，说明离线可用开启
      // 说明离线可用
      setRecordChannel(2);
    } else {
      setRecordChannel(0);
    }
  }, [isBtEntryVersion, isCardStyle, supportRecordChannelChange]);

  const handleRecordChannelChange = async () => {
    // 断连或录音中状态时不可操作
    if (!isOnline || task?.state === RecordStatus.RECORDING) {
      return;
    }
    if (recordChannel === 2 && isDevOnline === false) {
      // 离线可用时，且设备实际离线，不允许切换通道
      ty.showToast({ title: Strings.getLang('ear_offline'), icon: '' });
      return;
    }
    const newRecordChannel = recordChannel === 1 ? 2 : 1;
    await tttChangeRecordChannel({
      deviceId,
      recordChannel: newRecordChannel,
    });
    setRecordChannel(newRecordChannel);
  };

  const toAiTransc = async () => {
    const recordingDeviceId = getStorageRecordingDeviceId() || deviceId;
    const balance = ((await checkBalance(homeId, recordingDeviceId)) as number) || 0;
    if (balance !== 1) return;
    dispatch(updateMode(RecordMode.realTimeRecording));
  };

  useEffect(() => {
    if (recordingConfig) {
      handleUpdateRecord(recordingConfig);
    }
  }, [recordingConfig, handleUpdateRecord]);

  usePageEvent('onHide', () => {
    // 离开页面，停止振幅事件
    tttOperateEventLimit({
      eventName: 'onRecordTransferAmplitudeUpdateEvent',
      operate: true,
    });
  });

  usePageEvent('onShow', () => {
    // 返回页面，开启振幅事件
    tttOperateEventLimit({
      eventName: 'onRecordTransferAmplitudeUpdateEvent',
      operate: false,
    });
  });

  return (
    <Layout
      title={
        isCall ? Strings.getLang('mode_title_call_recording') : Strings.getLang('record_type_1')
      }
      handleBack={handleBack}
    >
      <View
        className={styles.container}
        style={{
          height: `calc(100vh - ${sysTopDistance}px - 44px)`,
        }}
      >
        <TimeDisplay
          customDevType={customDevType}
          duration={duration}
          currRecordType={currRecordType}
          isCardCalling={isCardCalling}
        />
        {/* 设备状态 */}
        <View className={styles.chartBox}>
          <WaveAnim
            width={windowWidth}
            recordState={task?.state || 0}
            devId={deviceId}
            duration={duration}
            syncDurationValue={syncWaveDuration}
            syncDurationTrigger={syncWaveTrigger}
          />
        </View>
        {/* 入门版耳机 */}
        {(isBtEntryVersion || supportRecordChannelChange) && !isCardStyle && (
          <View
            className={`${task?.state === RecordStatus.RECORDING ? styles.gray : null} ${
              styles.changeRecordChannelBtn
            }`}
            onClick={handleRecordChannelChange}
          >
            {recordChannel === 1 ? (
              <Text>{Strings.getLang('ear_recording')}</Text>
            ) : (
              <Text>{Strings.getLang('phone_recording')}</Text>
            )}
            <ThemedImage
              imageName="imgTransIcon"
              className={styles.transIcon}
              src={Res.imgTransIcon}
            />
          </View>
        )}
        <RecordCtr
          handleControl={handleControl}
          handleStopRecord={handleStopRecord}
          recordType={currRecordType}
          isPauseSelf={isPauseSelf}
          setIsPauseSelf={setIsPauseSelf}
        >
          <Button type="default" className={styles.aiTransBtn} onClick={toAiTransc}>
            <ThemedImage
              imageName="aiTransIcon"
              src={Res.aiTransIcon}
              className={styles.aiTransIcon}
            />
            <Text>{Strings.getLang('aiTrans')}</Text>
          </Button>
        </RecordCtr>
      </View>
    </Layout>
  );
};

export default React.memo(Recording);
