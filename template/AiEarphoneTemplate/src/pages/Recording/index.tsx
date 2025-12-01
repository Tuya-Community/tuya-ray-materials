import React, { FC, useCallback, useEffect, useState, useRef } from 'react';
import { View, Text, Image, Button } from '@ray-js/components';
import { Icon } from '@ray-js/icons';
import { setKeepScreenOn } from '@ray-js/ray';
import Loading from '@ray-js/components-ty-loading';
import Res from '@/res';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { convertMillisecondsToTime, checkDpExist, backToHome } from '@/utils';
import { useInterval } from 'ahooks';
import { TopBar } from '@/components';
import {
  tttPauseRecord,
  tttResumeRecord,
  tttStartRecord,
  tttStopRecord,
  // tttChangeRecordChannel,
} from '@/api/ttt';
import WaveAnim from '@/components/WaveAnim';
import { selectDpStateByCode } from '@/redux/modules/dpStateSlice';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import {
  RecordStatus,
  RecordType,
  selectAudioFileByKey,
  updateRecordTask,
  updateRecordType,
} from '@/redux/modules/audioFileSlice';
import { leftearBatteryPercentageCode, aiModeCode } from '@/config/dpCodes';
import TyNotification from '@ray-js/ty-notification';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import Strings from '@/i18n';
import Power from '@/components/Power';
// @ts-ignore
import styles from './index.module.less';

const Recording: FC<any> = props => {
  const lastTimeRef = useRef(0);
  const dispatch = useDispatch();
  const { devId: deviceId, isOnline, isDevOnline } = useSelector(selectDevInfo);
  const { topBarHeight, windowWidth } = useSelector(selectSystemInfo);
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  const isBtEntryVersion = useSelector(selectUiStateByKey('isBtEntryVersion')); // 是否是入门版耳机
  const isOpusCelt = useSelector(selectUiStateByKey('isOpusCelt'));
  const supportRecordChannelChange = useSelector(selectUiStateByKey('supportRecordChannelChange')); // 离线可用
  const aiModeDp = useSelector(selectDpStateByCode(aiModeCode as never));
  const leftbatteryPercentage = useSelector(
    selectDpStateByCode(leftearBatteryPercentageCode as never)
  );
  const isCardStyle = productStyle === 'card';
  // 先排除卡片
  const [recordChannel, setRecordChannel] = useState(isBtEntryVersion && !isCardStyle ? 1 : 0); // 0:ble 1:bt 2:mic
  const [duration, setDuration] = useState(0); // 毫秒
  const task = useSelector(selectAudioFileByKey('task'));

  const [interval, setInterval] = useState<number | undefined>(undefined);
  const clear = useInterval(
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

  const [currRecordType, setCurrRecordType] = useState(() => {
    const initType = props.location.query.recordType === '0' ? RecordType.CALL : RecordType.MEETING;
    return initType;
  });

  useEffect(() => {
    if (checkDpExist(aiModeCode)) {
      switch (aiModeDp) {
        case 'meeting':
          setCurrRecordType(RecordType.MEETING);
          break;
        case 'phone':
          setCurrRecordType(RecordType.CALL);
          break;
        default:
          break;
      }
    }
  }, [aiModeDp]);

  useEffect(() => {
    if (!task) return;
    switch (task.state) {
      case RecordStatus.FINISH: {
        setInterval(undefined);
        backToHome();
        break;
      }
      case RecordStatus.PAUSE:
        setInterval(undefined);
        break;
      case RecordStatus.RECORDING:
        setInterval(1000);
        lastTimeRef.current = Date.now();
        break;
      default:
        break;
    }
    setCurrRecordType(task.recordType);
  }, [task]);

  const checkRecordTask = async () => {
    if (task) {
      const { userRecordDuration } = task;
      setDuration(userRecordDuration);
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
    const { code, message } = d;
    if (code === 0 && isCardStyle) {
      backToHome();
    }
    if (code === 0) return; // 0为正常结束
    ty.showToast({ title: message, icon: 'error' });
    setInterval(undefined);
    dispatch(updateRecordTask());
    backToHome();
  };

  const destroyEvent = () => {
    clear();
    setKeepScreenOn({ keepScreenOn: false });
    ty.wear.offRecordTransferFinishEvent(handleRecordFinishEvent);
    ty.hideLoading();
  };

  useEffect(() => {
    ty.hideMenuButton();
    setKeepScreenOn({ keepScreenOn: true });
    checkRecordTask();
    ty.wear.onRecordTransferFinishEvent(handleRecordFinishEvent);
    return () => {
      destroyEvent();
    };
  }, []);

  const handleRecordTypeChange = useCallback(() => {
    if (task?.state === 1 || task?.state === 2) return;
    dispatch(
      updateRecordType({
        recordType: currRecordType === RecordType.CALL ? RecordType.MEETING : RecordType.CALL,
      })
    );
  }, [currRecordType, task]);

  const [controlBtnLoading, setControlBtnLoading] = useState(false);

  const handleStartRecord = useCallback(async () => {
    const fn = async () => {
      try {
        setControlBtnLoading(true);
        await tttStartRecord(
          {
            deviceId,
            config: {
              // 出错时是否要保留音频文件
              saveDataWhenError: true,
              // 录音类型，0呼叫，1会议
              recordType: currRecordType,
              // dp控制超时时间 单位秒
              controlTimeout: 5,
              // 灌流超时时间 单位秒
              dataTimeout: 10,
              // 0文件转写，1实时转写
              transferType: 0,
              /**
               * 录音通道 0 ble 1 Bt 2 micro
               * 默认是0 为了适配原有逻辑
               */
              recordChannel,
              // TTS流编码方式，通过编码后将流写入到耳机设备0：opus_silk  1:opus_celt
              ttsEncode: isOpusCelt ? 1 : 0,
            },
          },
          // 产品需求 电话模式错误展示指定文案
          currRecordType === RecordType.CALL
        );
        // setRecordState(1);
        setInterval(1000);
        lastTimeRef.current = Date.now();
        setControlBtnLoading(false);
      } catch (error) {
        console.log('----error-----', error);
        if (currRecordType === RecordType.CALL && error?.innerError?.errorCode === '10061') {
          ty.showToast({
            title: Strings.getLang('error_start_record_need_phone_call'),
            icon: 'error',
          });
        }
        setControlBtnLoading(false);
      }
    };
    if (isBtEntryVersion || supportRecordChannelChange) {
      ty.authorize({
        scope: 'scope.record',
        success: () => {
          fn();
        },
        fail: e => {
          ty.showToast({ title: Strings.getLang('no_record_permisson'), icon: 'error' });
          console.log('cope.record: ', e);
        },
      });
      return;
    }
    fn();
  }, [currRecordType, recordChannel, isBtEntryVersion, supportRecordChannelChange]);

  // 暂停
  const handlePauseRecord = async () => {
    try {
      setControlBtnLoading(true);
      await tttPauseRecord(deviceId);
      setInterval(undefined);
      setControlBtnLoading(false);
    } catch (error) {
      console.log('fail', error);
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
      setControlBtnLoading(false);
    } catch (error) {
      setControlBtnLoading(false);
    }
  };

  // 停止
  const handleStopRecord = async () => {
    try {
      ty.showLoading({ title: '' });
      await tttStopRecord(deviceId);
      setDuration(0);
      setInterval(undefined);
      ty.hideLoading();
      backToHome();
    } catch (error) {
      ty.hideLoading();
    }
  };

  const handleControl = () => {
    // 断连或按钮加载状态时不可操作
    if (!isOnline || controlBtnLoading) return;
    if (!task || task?.state === RecordStatus.UNKNOWN || task?.state === RecordStatus.FINISH) {
      // 当前状态 无进行中的任务
      handleStartRecord();
    } else if (task?.state === RecordStatus.RECORDING) {
      // 当前状态 录音中
      handlePauseRecord();
    } else if (task?.state === RecordStatus.PAUSE) {
      // 当前状态 暂停中
      handleResumeRecord();
    }
  };

  const [showBluetoothError, setShowBluetoothError] = useState(false);
  useEffect(() => {
    setShowBluetoothError(!isOnline);
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

  const renderControlBtnContent = () => {
    if (controlBtnLoading) return <Loading />;
    if (task?.state === RecordStatus.RECORDING) {
      return <Image className={styles.icon} src={Res.imgStop} />;
    }
    return <Image className={styles.icon} src={Res.imgStart} />;
  };

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
    // await tttChangeRecordChannel({
    //   deviceId,
    //   recordChannel: newRecordChannel,
    // });
    setRecordChannel(newRecordChannel);
  };

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('title_recording')} onBack={() => backToHome('', false)} />
      <TyNotification
        show={showBluetoothError}
        top={topBarHeight}
        onClosed={() => setShowBluetoothError(false)}
        text={Strings.getLang('device_offline')}
      />
      <View className={styles.status}>
        <View className={styles.batteryBox}>
          {productStyle === 'card' ? (
            <Text className={styles.batteryText}>
              {Strings.getLang('battery_level_label')}
              {leftbatteryPercentage}%
            </Text>
          ) : (
            <Power />
          )}
        </View>
        <Button className={styles.typeBtn} onClick={handleRecordTypeChange}>
          <Text className={styles.typeText}>
            {currRecordType === 0
              ? Strings.getLang('record_type_0')
              : Strings.getLang('record_type_1')}
          </Text>
          <Icon type="icon-right" size={12} color="#000" />
        </Button>
      </View>
      <View className={styles.chartBox}>
        <View className={styles.chart}>
          <View className={styles.waveAnimBox} style={{ left: `calc(50vw - ${windowWidth}px)` }}>
            <WaveAnim width={windowWidth} recordState={task?.state || 0} devId={deviceId} />
          </View>
        </View>
        <View className={styles.centerMark}>
          <View className={styles.dot} />
          <View className={styles.centerLine} />
          <View className={styles.triangle} />
        </View>
      </View>
      {/* 入门版耳机 */}
      {(isBtEntryVersion || supportRecordChannelChange) && !isCardStyle && (
        <View
          className={`${task?.state === RecordStatus.RECORDING ? styles.gray : null} ${styles.changeRecordChannelBtn
            }`}
          onClick={handleRecordChannelChange}
        >
          {recordChannel === 1 ? (
            <Text>{Strings.getLang('ear_recording')}</Text>
          ) : (
            <Text>{Strings.getLang('phone_recording')}</Text>
          )}
          <Image className={styles.transIcon} src={Res.imgTransIcon} />
        </View>
      )}

      <View className={styles.controlArea}>
        <Text className={styles.time}>{convertMillisecondsToTime(duration)}</Text>
        <Button className={styles.controlBtn} onClick={handleControl}>
          {renderControlBtnContent()}
        </Button>
        {(task?.state === RecordStatus.RECORDING || task?.state === RecordStatus.PAUSE) && (
          <Text className={styles.save} onTouchEnd={handleStopRecord}>
            {Strings.getLang('save')}
          </Text>
        )}
      </View>
    </View>
  );
};

export default React.memo(Recording);
