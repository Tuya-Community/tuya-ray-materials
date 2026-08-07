/*
 * @Author: hkc
 * @Date: 2025-07-14 14:38:01
 * @LastEditors: hkc
 * @LastEditTime: 2026-04-08 14:21:25
 * @Description: 面对面翻译录音页面
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  hideLoading,
  router,
  setNavigationBarBack,
  showLoading,
  View,
  Text,
  setStorageSync,
  usePageEvent,
  reLaunch,
} from '@ray-js/ray';
import ThemedImage from '@/components/ThemedImage';
import { useInterval, useDebounceFn, useRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import { updateLangSelects } from '@/redux/modules/f2fLangSelectsSlice';

import { TopBar } from '@/components';
import BtOfflineDialog from '@/components/BtOfflineDialog';
import BenefitRestrictedDialog from '@/components/BenefitRestrictedDialog';
import DualChannelASRList from '@/components/DualChannelASRList';
import RecordingAnimalGif from '@/components/RecordingAnimal/indexGif';
import Strings from '@/i18n';
import { RecordStatus, RecordType, selectAudioFileByKey } from '@/redux/modules/audioFileSlice';
import { BusinessType, DEVTYPES } from '@/constant/enums';
import {
  setStorageDevInfo,
  setStorageLastModePath,
  checkBalance,
  onCustomBack,
  formatDevSchema,
  convertMillisecondsToTime,
} from '@/utils';
import { useSelector } from '@/redux';
import {
  tttPauseRecord,
  tttRecordTask,
  tttResumeRecord,
  tttStartAudioRecording,
  tttStopRecord,
  tttUpdateParams,
} from '@/api/ttt';
import { getAgentId } from '@/redux/modules/agentSlice';
import { devInfoChange, selectDevInfo } from '@/redux/modules/devInfoSlice';
import Res from '@/res';
import LanguageSelectPopup from '@/components/LanguageSelectPopup';
import { trackEvent } from '@/utils/track';
import { getAudioSourceList, getTtsConfigList } from '@/utils/recording';
import { usePageReShow } from '@/hooks/usePageReShow';
import useShowAddHomeCard from '@/hooks/useShowAddHomeCard';
import AddToHomePopup from '@/components/AddToHomePopup';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { getDeviceList } from '@/redux/modules/deviceListSlice';
import { FTFTabType } from '..';
import ControlButton from '../component/ControlButton';
import styles from './index.module.less';

const Recording = props => {
  const mode: FTFTabType = props?.location?.query?.mode || '';
  const dispatch = useDispatch();
  const query = props?.location?.query || {};
  const fromType = query?.fromType || '';
  const queryDeviceId = query?.deviceId || '';
  const [isSplitScreen, setIsSplitScreen] = useState(false); // 是否开启分屏
  const { useWindowHeight, topBarHeight } = useSelector(state => state.systemInfo);
  const { myLang: rightLanguage, friendLang: leftLanguage } = useSelector(
    state => state.f2fLangSelects
  );
  const task = useSelector(selectAudioFileByKey('task'));
  // 与实时转写一致：进行中优先 taskState；否则 task.state / sourceTaskState
  const taskState = useSelector(selectAudioFileByKey('taskState'));
  const recordState =
    taskState === RecordStatus.RECORDING || taskState === RecordStatus.PAUSE
      ? taskState
      : task?.sourceTaskState ?? task?.state;
  const [interval, setInterval] = useState<number | undefined>(undefined);
  const lastTimeRef = useRef(0);
  const [duration, setDuration] = useState(0); // 毫秒
  const [activeType, setActiveType] = useState(''); // 当前激活的录音类型
  const [changeLoading, setChangeLoading] = useState(false); // 切换暂停，继续录音loading
  const agentId = useSelector(getAgentId);
  const deviceInfo = useSelector(selectDevInfo);
  const deviceList = useSelector(getDeviceList);
  const { homeId: homeInfoId } = useSelector(state => state.homeInfo);
  const { devId: deviceId, customDevType, homeId: devHomeId } = deviceInfo;
  const homeId = homeInfoId || devHomeId;
  const isOpusCelt = useSelector(selectUiStateByKey('isOpusCelt'));
  const [show, setShow] = useState(false);
  const [activeLangOption, setActiveLangOption] = useState<'left' | 'right'>();
  const [recordingConfig, setRecordingConfig] = useState<any>({}); // 录音参数配置
  const [autoSpeek, setAutoSpeek] = useState(false); // 自动识别发言
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const isNavigatingFromOfflineRef = useRef(false);

  // 根据路由参数同步当前设备（含 PHONE）
  useEffect(() => {
    if (!queryDeviceId || !deviceList?.length) {
      return;
    }
    if (deviceInfo?.devId === queryDeviceId) {
      return;
    }
    const target = deviceList.find(item => item.devId === queryDeviceId);
    if (target) {
      dispatch(devInfoChange(formatDevSchema(target)));
    }
  }, [queryDeviceId, deviceList, deviceInfo?.devId, dispatch]);

  const handleStopRecord = (shouldNavigate = true) => {
    tttStopRecord(deviceId)
      .then(d => {
        console.log('stopRecord', d);
      })
      .catch(error => {
        console.log('stopRecord fail', error);
      });

    // 根据参数决定是否跳转
    if (shouldNavigate) {
      setNavigationBarBack({ type: 'system' });
      if (fromType === 'app') {
        reLaunch({ url: '/pages/home/index' });
      }
      // 直接回到首页
      ty.navigateBack({
        delta: 2,
      });
    }
  };

  const showAddHomeCard = useShowAddHomeCard(handleStopRecord, handleStopRecord);

  // 埋点-面对面翻译录音页面点击
  const trackClickEvent = (type: string) => {
    trackEvent('ty_nKGGxiatU81RvG3AyCj3jmp2jA3m9DcP', 'card_click', {
      position_info: {
        position_type: type,
      },
    });
  };

  // 是否是手机
  const isPhone = useMemo(() => deviceId === 'PHONE', [deviceId]);

  // 是否是pro耳机
  const isPro = useMemo(() => {
    return customDevType === DEVTYPES.pro;
  }, [customDevType]);

  // 计算滚动区域高度
  const scrollHeight = useMemo(() => {
    if (!useWindowHeight || !topBarHeight) return 0;
    const height = useWindowHeight - topBarHeight - 40 - (isPro ? 158 : 188);
    return height;
  }, [useWindowHeight, topBarHeight, isPro]);

  // 计算录音类型
  // 录音类型：0呼叫，1会议，2同声传译(Pro)，3面对面翻译，5手机耳返(普通)，6手机耳返(Pro)
  const recordType = useMemo(() => {
    if (mode === FTFTabType.PhoneEar) {
      return RecordType.PhoneEar;
    }
    return isPro ? RecordType.FaceToFacePro : RecordType.FaceToFace;
  }, [mode, isPro]);

  // 判断设备是否在线
  const isOnline = useMemo(() => {
    if (isPhone) return true;
    return deviceInfo?.isOnline;
  }, [deviceId, deviceInfo]);

  const clear = useInterval(
    () => {
      setDuration(prev => prev + 1000);
    },
    interval,
    {
      immediate: false,
    }
  );

  // 请求录音任务接口
  const { run: getRecordTask } = useRequest(tttRecordTask, {
    manual: true,
    onSuccess: res => {
      const { userRecordDuration } = res?.task || {};
      if (userRecordDuration) {
        setDuration(userRecordDuration);
      }
      setInterval(1000);
    },
  });

  const toggleBottomSheet = useCallback(() => setShow(!show), [show]);

  // 暂停（状态由全局 useRecordStatus 事件同步，与实时转写一致）
  const handlePauseRecord = useCallback(async () => {
    if (changeLoading) return;
    try {
      setChangeLoading(true);
      const d = await tttPauseRecord(deviceId);
      setActiveType('');
      console.log('pauseRecord', d);
      setInterval(undefined);
      setChangeLoading(false);
    } catch (error) {
      console.log('handlePauseRecord fail', error);
      setChangeLoading(false);
    }
  }, [isOnline, changeLoading, deviceId]);

  // 恢复（状态由全局 useRecordStatus 事件同步，与实时转写一致）
  const handleResumeRecord = useCallback(async () => {
    if (!isOnline || changeLoading) return;
    try {
      setChangeLoading(true);
      await tttResumeRecord(deviceId);
      setInterval(1000);
      lastTimeRef.current = Date.now();
      setChangeLoading(false);
    } catch (error) {
      console.log('handleResumeRecord fail', error);
      setChangeLoading(false);
    }
  }, [isOnline, changeLoading, deviceId]);

  // 开始录音接口请求
  const startAudioRecording = useCallback(
    async (type: 'left' | 'right' | 'auto') => {
      if (!isOnline) {
        ty.showToast({ title: Strings.getLang('device_offline'), icon: 'error' });
        return;
      }

      const isPhoneEar = recordType === RecordType.PhoneEar;
      const isPhoneSource = isPhoneEar && type === 'left';

      const audioSourceList = getAudioSourceList(
        isPhoneSource ? DEVTYPES.phone : customDevType,
        recordType
      );
      const config: any = {
        // 发起源 0:AI Note  1：AI Translate
        businessType: BusinessType.Note,
        // audioSource,
        audioSourceList,
        // 出错时是否要保留音频文件
        saveDataWhenError: true,
        // 录音类型，0呼叫，1会议，2同声传译，3面对面翻译
        recordType,
        // dp控制超时时间 单位秒
        controlTimeout: 5,
        // 灌流超时时间 单位秒
        dataTimeout: 10,
        // 0文件转写，1实时转写
        // 同声传译使用实时转写模式，设置为0并不起作用
        transferType: 1,
        // 是否需要翻译
        // 同声传译需要翻译，设置为false并不起作用
        needTranslate: true,
        /**
         * 起始语言
         * 会议或者电话模式，表示起始语言
         * 同声传译模式，表示左耳语言 （自己戴）
         */
        originalLanguage: isPro ? leftLanguage : type === 'left' ? leftLanguage : rightLanguage,
        /**
         * 目标语言
         * 会议或者电话模式，表示目标语言
         * 同声传译模式，表示右耳语言
         */
        targetLanguage: isPro ? rightLanguage : type === 'left' ? rightLanguage : leftLanguage,
        // 智能体id 固定
        agentId,
        // TTS流编码方式，通过编码后将流写入到耳机设备0：opus_silk  1:opus_celt
        ttsEncode: isOpusCelt ? 1 : 0,
        // 是否需要tts
        needTts: true,
        // 是否需要asr
        needAsr: true,
        needAutoRecognize: autoSpeek,
        ...(!isPro && {
          /**
           * 录音通道 0 ble 1 Bt 2 micro
           * 默认是0 为了适配原有逻辑
           */
          recordChannel: (isPhoneEar ? type === 'left' : isPhone) ? 2 : 1,
          // 0代表左耳 1代表右耳
          f2fChannel: type === 'left' ? 0 : 1,
        }),
        ttsConfigList: getTtsConfigList(audioSourceList, recordType),
      };
      const req = {
        deviceId,
        config,
      };
      console.info('params===========>', req);

      try {
        showLoading({ title: '' });
        await tttStartAudioRecording(req, true);
        setRecordingConfig(req);
        setStorageDevInfo(deviceInfo); // 存储当前设备信息
        setStorageLastModePath(router.href); // 存储上次的路径
        setActiveType(type);
        console.warn('[FTF-RecordDebug][startAudioRecording success]', {
          type,
          deviceId,
          businessType: config.businessType,
          recordType: config.recordType,
        });
        // 录音态由全局 useRecordStatus 事件写入 taskState / task，与实时转写一致，勿在此乐观拉取
        hideLoading();
        setInterval(1000);
        lastTimeRef.current = Date.now();
      } catch (error) {
        console.warn('[FTF-RecordDebug][startAudioRecording fail]', error);
        ty.showToast({
          title: Strings.getLang('error_simultaneous_recording_start'),
          icon: 'error',
        });
        hideLoading();
      }
    },
    [
      isOnline,
      deviceId,
      customDevType,
      recordType,
      rightLanguage,
      leftLanguage,
      agentId,
      isOpusCelt,
      autoSpeek,
      isPro,
      deviceInfo,
      isPhone,
    ]
  );

  // 开始1v1录音
  const handleStartRecord = useCallback(
    async (type?: 'left' | 'right' | 'auto') => {
      const balance = await checkBalance(homeId, deviceId);
      if (balance === 0 || balance === 2) return;
      ty.authorize({
        scope: 'scope.record',
        success: () => {
          startAudioRecording(type);
        },
        fail: e => {
          ty.showToast({ title: Strings.getLang('no_record_permisson'), icon: 'error' });
          console.log('cope.record: ', e);
        },
      });
    },
    [startAudioRecording, homeId, deviceId]
  );

  // 停止
  const handleStopRecordWithCheck = async () => {
    if (changeLoading) return;

    const needShow = await showAddHomeCard.checkAndShow();

    if (!needShow) {
      handleStopRecord();
    }
  };

  // 左边按钮点击
  const handleLeftStart = useCallback(() => {
    // 埋点-点击朋友的语言
    trackClickEvent('language_2');
    if (recordType === RecordType.PhoneEar) {
      if (recordState === RecordStatus.RECORDING) {
        handlePauseRecord();
      } else {
        handleStartRecord('left');
      }
      return;
    }
    handleStartRecord('left');
  }, [handleStartRecord, recordType, recordState, handlePauseRecord, isOnline]);

  // 右边按钮点击
  const handleRightStart = useCallback(() => {
    // 埋点-点击我的语言
    trackClickEvent('language_1');
    if (recordType === RecordType.PhoneEar) {
      if (recordState === RecordStatus.RECORDING) {
        handlePauseRecord();
      } else {
        handleStartRecord('right');
      }
      return;
    }
    handleStartRecord('right');
  }, [handleStartRecord, recordType, recordState, handlePauseRecord, isOnline]);

  // 防抖处理：左边按钮
  const { run: debouncedHandleLeftStart } = useDebounceFn(handleLeftStart, {
    wait: 500,
    leading: true,
    trailing: false,
  });

  // 防抖处理：右边按钮
  const { run: debouncedHandleRightStart } = useDebounceFn(handleRightStart, {
    wait: 500,
    leading: true,
    trailing: false,
  });

  // 自动识别语言模式下，开启录音
  const handleAutoStart = () => {
    // 埋点-点击自动识别语言录音按钮
    trackClickEvent('language_auto');

    if (activeType === 'auto') {
      handleResumeRecord();
      return;
    }
    handleStartRecord('auto');
  };

  // 蓝牙断开确认
  const handleBtOfflineConfirm = async () => {
    isNavigatingFromOfflineRef.current = true; // 标记为确认离开，避免 useEffect 再次触发 handleStopRecord
    setShowOfflineModal(false);
    // 结束录音并跳转页面
    handleStopRecord(true);
  };

  useEffect(() => {
    if (customDevType === DEVTYPES.phone || showOfflineModal) return;
    if (isNavigatingFromOfflineRef.current) return; // 用户已确认离线弹窗并即将离开，不再触发 stop 接口
    // pro耳机：ble离线或者蓝牙断开，显示离线弹窗
    // 入门版耳机：ble离线，显示离线弹窗
    const isShow = !isOnline;
    if (isShow) {
      setShowOfflineModal(true);
    }
  }, [isOnline, handleStopRecord, customDevType, showOfflineModal]);

  const onBack = () => {
    // @ts-ignore
    onCustomBack({ task, clear, handleStopRecord: handleStopRecordWithCheck, back: router.back });
  };

  useEffect(() => {
    if (!task) return;
    switch (task.state) {
      case RecordStatus.FINISH: {
        setInterval(undefined);
        // router.back();
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
    // setIsRecoding(true);
  }, [task]);

  // 更新录音参数
  const updateRecording = (leftLang, rightLang) => {
    const isLeft = activeType === 'left';
    const isPhoneEar = recordType === RecordType.PhoneEar;
    const updateReq = {
      ...recordingConfig,
      config: {
        ...(recordingConfig?.config || {}),
        originalLanguage: isPro
          ? isPhoneEar
            ? leftLang
            : rightLang
          : isLeft
          ? leftLang
          : rightLang,
        targetLanguage: isPro ? (isPhoneEar ? rightLang : leftLang) : isLeft ? rightLang : leftLang,
      },
    };
    tttUpdateParams(updateReq);
  };

  // pro版耳机录音
  const handleProStartRecord = useCallback(() => {
    const state = recordState;
    console.warn('task***********:', task);
    if (state === RecordStatus.UNKNOWN || state === RecordStatus.FINISH || !state) {
      handleStartRecord();
    } else if (state === RecordStatus.RECORDING) {
      handlePauseRecord();
    } else if (state === RecordStatus.PAUSE) {
      handleResumeRecord();
    }
  }, [task, recordState, duration, leftLanguage, rightLanguage, isOnline, recordType]);

  // 防抖处理：Pro 按钮（与左右按钮保持一致）
  const { run: debouncedHandleProStartRecord } = useDebounceFn(handleProStartRecord, {
    wait: 500,
    leading: true,
    trailing: false,
  });

  // useEffect(() => {
  //   tttUpdateParams(recordingConfig);
  // }, [recordingConfig])

  // 设置缓存语言
  const setStorageLang = (leftLang: string, rightLang: string) => {
    const isLeft = activeType === 'left';
    const isPhoneEar = recordType === RecordType.PhoneEar;
    // 如果是专业版耳机或者自动识别语言模式，右边的语言（我的语言）为源语言，左边的语言（朋友的语言）为目标语言
    // 如果是手机或者入门版耳机，则根据当前点击的按钮，确定源语言和目标语言
    setStorageSync({
      key: 'FTFOriginalLang',
      data: isPro ? (isPhoneEar ? leftLang : rightLang) : isLeft ? leftLang : rightLang,
    });
    setStorageSync({
      key: 'FTFTargetLang',
      data: isPro ? (isPhoneEar ? rightLang : leftLang) : isLeft ? rightLang : leftLang,
    });
  };

  // 保存
  const handleSave = (lang: string) => {
    const inputLang = activeLangOption === 'left' ? lang : leftLanguage;
    const outputLang = activeLangOption === 'right' ? lang : rightLanguage;
    dispatch(
      updateLangSelects({
        friendLang: inputLang,
        myLang: outputLang,
      })
    );

    if (duration) {
      updateRecording(inputLang, outputLang);
    }

    setStorageLang(inputLang, outputLang);
  };

  // card 点击
  const handleOptionClick = (option: 'left' | 'right') => {
    setActiveLangOption(option);
    toggleBottomSheet();
  };

  const handleSwapLang = () => {
    // 埋点-点击交换语言
    trackClickEvent('swap_language');

    dispatch(
      updateLangSelects({
        myLang: leftLanguage,
        friendLang: rightLanguage,
      })
    );
    setStorageLang(rightLanguage, leftLanguage);
    if (duration) {
      updateRecording(rightLanguage, leftLanguage);
    }
  };

  // 自动识别发言模式设置
  const handleChangeAutoSpeek = () => {
    // 埋点-点击自动识别发言
    trackClickEvent('auto_detect_language');

    if (activeType) {
      setActiveType('');
      handlePauseRecord();
    }
    setAutoSpeek(!autoSpeek);
  };

  usePageEvent('onShow', () => {
    // 埋点-面对面翻译录音页面
    trackEvent('ty_wCCI6mUwv1vWjNpSZTcJdmCsDef3av14', 'viewed_page');
  });

  // 页面隐藏暂停定时器
  usePageEvent('onHide', () => {
    setInterval(undefined);
  });

  // 页面重新显示, 请求录音任务接口，更新时间
  usePageReShow(() => {
    if (recordState === RecordStatus.RECORDING) {
      getRecordTask(deviceId);
    }
  });

  // 页面卸载清除定时器
  usePageEvent('onUnload', () => {
    clear();
  });

  return (
    <View className={styles.container}>
      <View>
        <TopBar
          id="faceToFace-on-back"
          title={Strings.getLang('ftf_title')}
          onBack={onBack}
          type="custom"
        />
        <View className={styles.time}>
          <View className={styles.timeAni}>
            <RecordingAnimalGif isRecording={recordState === RecordStatus.RECORDING} />
            <Text className={styles.mgl10}>{convertMillisecondsToTime(duration)}</Text>
          </View>
          <View
            className={styles.splitBtn}
            onClick={() => {
              // 埋点-面对面翻译录音页面点击分屏
              trackClickEvent('split_screen');

              setIsSplitScreen(!isSplitScreen);
            }}
          >
            <ThemedImage
              imageName={isSplitScreen ? 'splitActive' : 'splitNormal'}
              className={styles.splitIcon}
              src={isSplitScreen ? Res.splitActive : Res.splitNormal}
            />
          </View>
        </View>
        <DualChannelASRList
          deviceId={deviceId}
          activeType={!isPro ? activeType : undefined}
          isSplitScreen={isSplitScreen}
          scrollHeight={scrollHeight}
          recordType={recordType}
        />
      </View>
      <ControlButton
        leftLanguage={leftLanguage}
        rightLanguage={rightLanguage}
        isPro={isPro}
        mode={mode}
        autoSpeek={autoSpeek}
        handleOptionClick={handleOptionClick}
        handleSwapLang={handleSwapLang}
        handleChangeAutoSpeek={handleChangeAutoSpeek}
        handleAutoStart={handleAutoStart}
        handlePauseRecord={handlePauseRecord}
        handleLeftStart={debouncedHandleLeftStart}
        handleRightStart={debouncedHandleRightStart}
        handleProStartRecord={debouncedHandleProStartRecord}
        handleStopRecord={handleStopRecord}
        activeType={activeType}
      />
      <BtOfflineDialog show={showOfflineModal} onConfirm={handleBtOfflineConfirm} />
      {/* 选择语言 */}
      {show && (
        <LanguageSelectPopup
          show={show}
          onClose={toggleBottomSheet}
          title={
            activeLangOption === 'left' ? Strings.getLang('ftf_friend') : Strings.getLang('ftf_my')
          }
          selectedLang={activeLangOption === 'left' ? leftLanguage : rightLanguage}
          disabledLang={activeLangOption === 'left' ? rightLanguage : leftLanguage}
          onSave={handleSave}
        />
      )}
      <AddToHomePopup
        show={showAddHomeCard.show}
        onClose={showAddHomeCard.onClose}
        onAdd={showAddHomeCard.onAdd}
        onLater={showAddHomeCard.onLater}
      />
      <BenefitRestrictedDialog />
    </View>
  );
};

export default Recording;
