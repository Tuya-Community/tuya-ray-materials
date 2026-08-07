import React, { useEffect, useState, useRef, useMemo, useLayoutEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@ray-js/components';
import { throttle } from 'lodash-es';
import { setStorageSync, getStorageSync, usePageEvent } from '@ray-js/ray';
import { useUpdateEffect, useDebounceFn } from 'ahooks';
import { useDispatch } from 'react-redux';

import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import {
  tttGetRecordTransferRealTimeResult,
  tttUpdateParams,
  tttOperateEventLimit,
} from '@/api/ttt';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import {
  RecordStatus,
  isForeignAppRecordingTask,
  selectAudioFileByKey,
  updateRecordTask,
} from '@/redux/modules/audioFileSlice';
import Strings from '@/i18n';
import { convertMillisecondsToTime, getAudioSource, getTtsOutput, getDefaultLangs } from '@/utils';
import { parseRealTimerResult } from '@/utils/recording';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { SYSTEM_LANGS } from '@/constant';
import Layout from '@/components/RecordLayout';
import LanguageSelectPopup from '@/components/LanguageSelectPopup';
import RecordingAnimal from '@/components/RecordingAnimal/indexGif';
import RecordCtr from '@/components/Recordctrl';
import { updateMode } from '@/redux/modules/recordConfigSlice';
import DotsLoading from '@/components/DotsLoading';
import { getAgentId } from '@/redux/modules/agentSlice';
import { DEVTYPES, RecordMode, BusinessType } from '@/constant/enums';
import { handleTttError } from '@/utils/code';
import { useSelector } from '@/redux';
import { getDomClientRect, getDomRectTop } from '@/utils/dom';
import TextItem from './TextItem';
import { useRealTimeTextQueue } from './useRealTimeTextQueue';
// @ts-ignore
import styles from './index.module.less';

// const delayTime = 300; // 延时300秒，避免界面闪烁
const RealTimeRecording = ({
  need,
  handleStartRecord,
  handlePauseRecord,
  handleResumeRecord,
  duration,
  controlBtnLoading,
  handleStopRecord,
  setDuration,
  lastTimeRef,
  setInterval,
  currRecordType,
  handleUpdateRecord,
  catchRecordingConfig,
  isCardCalling,
  isPauseSelf,
  setIsPauseSelf,
  handleBack,
}) => {
  // 不带文件路径：按需放入组件内部
  const lastScrollTopRef = useRef(99999);
  const [isOnHide, setIsOnHide] = useState(false);
  const agentId = useSelector(getAgentId);
  const { mode, isCall } = useSelector(state => {
    return state?.recordConfig;
  });
  // 语言选择弹窗类型：'' 关闭，'input' 输入语言（必选），'translate' 翻译语言（非必选）
  const [langPopType, setLangPopType] = useState<'' | 'input' | 'translate'>('');
  const isOpusCelt = useSelector(selectUiStateByKey('isOpusCelt'));
  const dispatch = useDispatch();
  const devInfo = useSelector(selectDevInfo);
  const { devId: deviceId = '', isOnline, customDevType } = devInfo || {};
  const systemInfo = useSelector(selectSystemInfo);
  const { useWindowHeight, topBarHeight } = useSelector(state => state.systemInfo);
  const { language } = systemInfo;
  const safeBottomHeight = systemInfo?.safeBottomHeight || 24; // 底部安全距离
  const [scrollViewHeight, setScrollViewHeight] = useState(
    useWindowHeight - topBarHeight - safeBottomHeight - 155 - 45 // 45 指的是底部语言栏的高度
  );
  const supportLangList = useSelector(selectUiStateByKey('supportLangList'));
  const offlineUsage = useSelector(selectUiStateByKey('offlineUsage')); // 离线可用
  const task = useSelector(selectAudioFileByKey('task'));
  const taskRef = useRef(task);
  const [scrollTop, setScrollTop] = useState(0);
  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null); // 新增：高亮定时器
  const {
    textList,
    pushEvent,
    resetTextList,
    clear,
    loadMorePrev,
    loadMoreNext,
    hasMore,
    setLockScroll,
    jumpToBottom,
  } = useRealTimeTextQueue(isOnHide);
  const [needTranslate, setNeedTranslate] = useState(!!Number(need)); // 默认打开翻译
  // 输入语言
  const [originLanguage, setOriginLanguage] = useState('');
  // 输出语言
  const [translationLanguage, setTranslationLanguage] = useState('');

  const [needTts, setNeedTts] = useState(false);
  const [stopScroll, setStopScroll] = useState(false);
  // 先排除卡片

  // 同步 stopScroll 状态给 useRealTimeTextQueue，用于控制是否自动跟随最新消息
  useEffect(() => {
    setLockScroll(stopScroll);
  }, [stopScroll, setLockScroll]);

  useEffect(() => {
    if (catchRecordingConfig) {
      setNeedTts(!!catchRecordingConfig.config.needTts);
    }
  }, [catchRecordingConfig?.config?.needTts]);

  useEffect(() => {
    if (supportLangList?.length > 1) {
      const storageOriginLang = getStorageSync({ key: 'storageOriginLang' }) || '';
      const storageTranslationLang = getStorageSync({ key: 'storageTranslationLang' }) || '';
      if (storageOriginLang && storageTranslationLang) {
        setOriginLanguage(storageOriginLang);
        setTranslationLanguage(storageTranslationLang);
        mode && originLanguage && tttUpdateParams(recordingConfig);
        return;
      }
      if (storageOriginLang) {
        const transLang = getDefaultLangs(supportLangList, storageOriginLang);
        setOriginLanguage(storageOriginLang);
        setTranslationLanguage(transLang);
        return;
      }
      const systemLang = SYSTEM_LANGS?.[language]; // SYSTEM_LANGS已经跟supportLangList映射
      // const langItem = supportLangList.find(({ lang }) => lang === systemLang);
      const initOriginLang = systemLang || 'en';
      const transLang = getDefaultLangs(supportLangList, initOriginLang);
      setOriginLanguage(initOriginLang);
      setTranslationLanguage(transLang);
    }
  }, [supportLangList, mode]);

  // 记录加载前的高度
  const prevContentHeightRef = useRef(0);
  // 标记是否是向前加载
  const isPreLoadingRef = useRef(false);

  const handleLoadMorePrev = useCallback(async () => {
    if (isPreLoadingRef.current) return;
    if (!hasMore.prev) return;

    isPreLoadingRef.current = true;

    // 获取当前内容列表高度
    try {
      const rect = await getDomClientRect('asr_content_list');
      if (rect) {
        prevContentHeightRef.current = rect.height;
      }
    } catch {}

    loadMorePrev();
  }, [loadMorePrev, hasMore.prev]);

  // 监听 textList 变化，处理高度保持
  useEffect(() => {
    if (isPreLoadingRef.current) {
      // 稍微延时等待渲染
      const timer = setTimeout(async () => {
        try {
          const rect = await getDomClientRect('asr_content_list');
          if (rect) {
            const newHeight = rect.height;
            const diff = newHeight - prevContentHeightRef.current;
            if (diff > 0) {
              // 滚动到偏移位置，保持视觉位置不变
              // 加个随机小数，确保每次都能触发 state 更新
              setScrollTop(diff + Math.random() * 0.01);
            }
          }
        } catch {}
        isPreLoadingRef.current = false;
      }, 100);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [textList]);

  // 设置scrollTop, 滚动到最底部
  const handleScrollToBottom = useCallback(() => {
    // 使用递增的方式，确保每次都能触发滚动到底部
    // ScrollView 会自动处理超出实际高度的情况
    lastScrollTopRef.current += 1;
    setScrollTop(lastScrollTopRef.current);
  }, []);

  // 优化：只在 textList 真正变化且未停止滚动时才滚动
  // const prevTextListLengthRef = useRef(0);
  useEffect(() => {
    if (stopScroll || !textList?.length) return;

    // 如果还有下一页（处于历史记录中），不自动滚动到底部
    if (hasMore.next) return;

    handleScrollToBottom();
  }, [textList, stopScroll, handleScrollToBottom, hasMore.next]);

  const handleRecordFinishEvent = d => {
    if (d.deviceId !== deviceId) return;
    const { code } = d;
    if (code === 0) return; // 0为正常结束
    if (code !== 10061 || !isCall) {
      handleTttError(d, true);
    }

    setInterval(undefined);
    dispatch(updateRecordTask());
  };

  const handleRecordTransferRealTimeRecognizeStatusUpdateEvent = d => {
    try {
      if (d?.errorCode === 10002 || d?.errorCode === '10002') {
        ty.showToast({
          title: Strings.getLang('error_device_not_support'),
          icon: 'error',
        });
        // 设备不支持时，提示后返回首页
        setTimeout(() => {
          handleBack?.();
        }, 0);
        return;
      }
      if (isForeignAppRecordingTask(taskRef.current)) {
        return;
      }
      if (!handleTttError(d, true)) {
        return;
      }
      const {
        // 阶段  0.任务 4.asr 5.text 6.skill 7.tts
        phase,
        // 阶段状态 0. 未开启 1.进行中 2.结束 3.取消
        status,
        requestId,
        text,
        translateText,
      } = d;

      // 只入队，具体处理交由 useRealTimeTextQueue
      pushEvent(d);
    } catch {
    }
  };

  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  const checkRecordTask = async () => {
    const task = taskRef.current; // 在闭包中，显隐时执行有问题，所以用ref取最新值
    // 当前存在任务
    if (task && task.state !== RecordStatus.UNKNOWN && task.state !== RecordStatus.FINISH) {
      const { userRecordDuration, originalLanguage, targetLanguage, needTts } = task;
      setDuration(duration > userRecordDuration ? duration : userRecordDuration);
      setNeedTts(needTts);
      // 有可能是先进入的同声传译页面，然后在录音卡上开启录音，此时要走一次update，值的需要设置为同声传译模式

      setNeedTranslate(mode === RecordMode.simultaneousInterpretation);
      originalLanguage && setOriginLanguage(originalLanguage);
      targetLanguage && setTranslationLanguage(targetLanguage);
      if (task.state === RecordStatus.RECORDING) {
        setInterval(1000);
        lastTimeRef.current = Date.now();
      }
      try {
        const realTimeResult: any = await tttGetRecordTransferRealTimeResult({
          recordId: task.recordId,
        });
        const resList = parseRealTimerResult(realTimeResult);
        if (resList.length) {
          resetTextList(resList);
        }
      } catch {}
    } else {
      setDuration(0);
      clear();
    }
  };

  useEffect(() => {
    if (task?.state === RecordStatus.RECORDING || task?.state === RecordStatus.PAUSE) {
      // 外面快捷方式进入的场景，如果在录音中，但textList没有值，则查询一次
      checkRecordTask();
    }
  }, [task]);

  const destroyEvent = () => {
    clear();
    ty.wear.offRecordTransferFinishEvent(handleRecordFinishEvent);

    ty.wear.offRecordTransferRealTimeRecognizeStatusUpdateEvent(
      handleRecordTransferRealTimeRecognizeStatusUpdateEvent
    );
    ty.hideLoading();
  };

  useEffect(() => {
    checkRecordTask();
    ty.wear.onRecordTransferFinishEvent(handleRecordFinishEvent);
    ty.wear.onRecordTransferRealTimeRecognizeStatusUpdateEvent(
      handleRecordTransferRealTimeRecognizeStatusUpdateEvent
    );
    return () => {
      destroyEvent();
    };
  }, []);

  useEffect(() => {
    if (!isOnline && !offlineUsage && duration) {
      // 断开连接时，停止录音
      handlePauseRecord();
    }
  }, [isOnline]);

  usePageEvent('onHide', () => {
    setIsOnHide(true);
    tttOperateEventLimit({
      eventName: 'onRecordTransferRealTimeRecognizeStatusUpdateEvent',
      operate: true,
    });
  });

  usePageEvent('onShow', () => {
    tttOperateEventLimit({
      eventName: 'onRecordTransferRealTimeRecognizeStatusUpdateEvent',
      operate: false,
    });
    setIsOnHide(false);
    checkRecordTask();
  });

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  // 打开输入语言（源语言）选择弹窗
  const showInputLangPop = () => {
    setLangPopType('input');
  };

  // 打开翻译语言（目标语言）选择弹窗
  const showTranslateLangPop = () => {
    setLangPopType('translate');
  };

  // 保存输入语言（源语言）
  const handleSaveInputLang = (lang: string) => {
    setOriginLanguage(lang);
    setStorageSync({ key: 'storageOriginLang', data: lang });
  };

  // 保存翻译语言（目标语言）：为空则切换到实时转写（不翻译），否则切换到同声传译
  const handleSaveTranslateLang = (lang: string) => {
    if (!lang) {
      setNeedTranslate(false);
      setTranslationLanguage('');
      setStorageSync({ key: 'storageTranslationLang', data: '' });
      dispatch(updateMode(RecordMode.realTimeRecording));
    } else {
      setNeedTranslate(true);
      setTranslationLanguage(lang);
      setStorageSync({ key: 'storageTranslationLang', data: lang });
      setStorageSync({ key: 'storageOriginLang', data: originLanguage });
      dispatch(updateMode(RecordMode.simultaneousInterpretation));
    }
  };

  const recordingConfig = useMemo(() => {
    const audioSource = getAudioSource(customDevType, currRecordType, isCall);
    const config = {
      deviceId,
      config: {
        // 发起源 0:AI Note  1：AI Translate
        businessType: BusinessType.Note,
        // 音频输入源
        audioSource,
        // 录音类型，0呼叫，1会议
        recordType: isCall ? 0 : 1,
        // 是否需要ASR
        needAsr: true,
        // 是否需要翻译
        needTranslate,
        // 是否需要TTS
        needTts,
        needAmplitude: false, // 是否需要振幅
        originalLanguage: originLanguage,
        agentId,
        ttsEncode: isOpusCelt ? 1 : 0, // TTS流编码方式，通过编码后将流写入到耳机设备0：opus_silk  1:opus_celt
      },
    };
    if (needTts) {
      config.config.ttsConfig = {
        // 设备ID 如输出源为设备时，需下发设备ID；BT和MIC通道传空
        devId:
          customDevType === DEVTYPES.entry ||
          customDevType === DEVTYPES.phone ||
          customDevType === DEVTYPES.card
            ? ''
            : deviceId,
        ttsOutput: getTtsOutput(audioSource as number),
        ttsEncode: isOpusCelt ? 2 : customDevType === DEVTYPES.pro ? 1 : 0,
        ttsOutputChannel: 0,
      };
    }
    if (needTranslate) {
      config.config.targetLanguage = translationLanguage;
    }
    return config;
  }, [
    deviceId,
    customDevType,
    currRecordType,
    needTranslate,
    isOpusCelt,
    originLanguage,
    translationLanguage,
    isCall,
    agentId,
    needTts,
  ]);

  const isShowNeedTtsSwitch = useMemo(() => {
    // 仅同声传译且翻译语言不为空时，展示tts开关。非pro
    if (
      needTranslate &&
      translationLanguage &&
      // customDevType !== DEVTYPES.card &&
      customDevType !== DEVTYPES.pro
    ) {
      return true;
    }
    return false;
  }, [needTranslate, translationLanguage, customDevType]);

  useUpdateEffect(() => {
    if (recordingConfig.config.originalLanguage) {
      handleUpdateRecord(recordingConfig);
    }
  }, [recordingConfig, handleUpdateRecord]);

  // 交换输入语言和翻译语言（仅同声传译模式下有效）
  const handleSwapLanguages = () => {
    if (!originLanguage || !translationLanguage) return;
    const newOrigin = translationLanguage;
    const newTranslation = originLanguage;
    setOriginLanguage(newOrigin);
    setTranslationLanguage(newTranslation);
    setStorageSync({ key: 'storageOriginLang', data: newOrigin });
    setStorageSync({ key: 'storageTranslationLang', data: newTranslation });
    tttUpdateParams({
      deviceId,
      config: {
        ...recordingConfig.config,
        originalLanguage: newOrigin,
        targetLanguage: newTranslation,
      },
    });
  };

  // 获取内容区域的高度
  const getScrollContentHeight = async () => {
    // 计算scrollView高度
    const asrScrollViewReactTop = await getDomRectTop('asr_scroll_view');
    const recordCtrlRect = await getDomClientRect('recordCtrl');
    const contentBtmRect = await getDomClientRect('contentBtm');
    setScrollViewHeight(
      useWindowHeight - asrScrollViewReactTop - recordCtrlRect.height - contentBtmRect.height
    );
  };

  useLayoutEffect(() => {
    getScrollContentHeight();
  }, []);

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

  // 停止实时转写，回到录音
  const handleStopReal = () => {
    dispatch(updateMode(isCall ? RecordMode.phoneRecording : RecordMode.liveRecording));
  };

  // 滚动到最低部时触发
  const handleOnScrollToLower = () => {
    setStopScroll(false);
    if (hasMore.next) {
      loadMoreNext();
    }
  };

  // 滚动到底部
  const handleToEnd = () => {
    setStopScroll(false);
    jumpToBottom();
    handleScrollToBottom();
  };

  const handleOnScroll = useMemo(
    () =>
      throttle(e => {
        const clientHeight = scrollViewHeight - 50; // 50为各种padding
        const { scrollTop, scrollHeight } = e.detail;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 55;
        if (isAtBottom) {
          setStopScroll(false);
        } else if (scrollTop < scrollHeight) {
          setStopScroll(true);
        }
      }, 100), // 150ms 节流
    [scrollViewHeight]
  );

  // 🎯 优化渲染：简化逻辑，利用 React.memo 和 key 优化
  // 由于已限制最多 200 条，不再需要复杂的稳定区缓存
  // TextItem 使用 React.memo 和自定义比较函数，未变化的项不会重新渲染
  const renderRealTimeText = useMemo(() => {
    return textList.map((item, index) => (
      <TextItem
        key={item.id}
        item={item}
        isFirst={index === 0}
        isLast={index === textList.length - 1}
        needTranslate={needTranslate}
      />
    ));
  }, [textList, needTranslate]);

  // 点击朗读开关
  const onNeedTtsChange = () => {
    if (!needTts) {
      // 开启朗读
      let msg = '';
      switch (customDevType) {
        case DEVTYPES.entry:
        case DEVTYPES.pro:
        case DEVTYPES.os:
          msg = Strings.getLang('need_tts_earPhone_toast');
          break;
        case DEVTYPES.phone:
          msg = Strings.getLang('need_tts_phone_toast');
          break;
        case DEVTYPES.card:
          msg = Strings.getLang('need_tts_card_toast');
          break;
        default:
          msg = '';
          break;
      }
      msg && ty.showToast({ title: msg, icon: 'none' });
    }
    setNeedTts(!needTts);
  };

  const { run: runOnNeedTtsChange } = useDebounceFn(onNeedTtsChange, {
    wait: 300,
    leading: false,
    trailing: true,
  });

  return (
    <Layout
      title={
        needTranslate
          ? Strings.getLang('mode_title_realtime_recording')
          : Strings.getLang('mode_title_live_trans')
      }
      handleBack={handleBack}
      slot={
        isShowNeedTtsSwitch
          ? {
              right: (
                <View onClick={runOnNeedTtsChange} className={styles.ttsIconBox}>
                  <ThemedImage
                    imageName={needTts ? 'needTtsIcon' : 'noTtsIcon'}
                    className={styles.ttsIcon}
                    src={needTts ? Res.needTtsIcon : Res.noTtsIcon}
                  />
                </View>
              ),
            }
          : undefined
      }
    >
      <View className={styles.main}>
        {/* 选择语言，配合界面自动化测试勿移位 */}
        {langPopType === 'input' && (
          <LanguageSelectPopup
            show
            title={Strings.getLang('langSelect_input_lang')}
            selectedLang={originLanguage}
            disabledLang={needTranslate && translationLanguage ? translationLanguage : ''}
            onClose={() => setLangPopType('')}
            onSave={handleSaveInputLang}
          />
        )}
        {langPopType === 'translate' && (
          <LanguageSelectPopup
            show
            title={Strings.getLang('langSelect_translate_lang')}
            selectedLang={needTranslate ? translationLanguage : ''}
            emptyOptionText={Strings.getLang('langSelect_no_translate')}
            disabledLang={originLanguage}
            onClose={() => setLangPopType('')}
            onSave={handleSaveTranslateLang}
          />
        )}
        {/* <RecordTop fromType={fromType} /> */}
        <View className={styles.container}>
          <View className={styles.header}>
            <View className={styles.timeBox}>
              <RecordingAnimal
                isRecording={task?.state === RecordStatus.RECORDING}
                isCall={isCall}
                isCardCalling={isCardCalling}
              />
              <Text className={styles.time}>{convertMillisecondsToTime(duration)}</Text>
            </View>
            <View className={styles.close} onClick={handleStopReal}>
              <ThemedImage imageName="closeImg" className={styles.closeIcon} src={Res.closeImg} />
            </View>
          </View>
          <ScrollView
            id="asr_scroll_view"
            className={styles.scroll}
            style={{
              height: `${scrollViewHeight}px`,
            }}
            refresherTriggered={false}
            scrollY
            scrollTop={scrollTop}
            onScrollToUpper={handleLoadMorePrev}
            upperThreshold={100}
            onScrollToLower={handleOnScrollToLower}
            onScroll={handleOnScroll}
            // @ts-ignore
            hideScrollbar
          >
            <View className={styles.scrollContent}>
              {textList?.length === 0 && task?.state === RecordStatus.RECORDING && <DotsLoading />}
              {textList?.length > 0 || task?.state === RecordStatus.RECORDING ? (
                <View key="realTime_recording_asr_content_list" id="asr_content_list">
                  {renderRealTimeText}
                </View>
              ) : (
                <View key="realTime_recording_empty_box" className={styles.emptyBox}>
                  <Text className={styles.emptyText}>
                    {Strings.getLang(
                      needTranslate ? 'sim_recording_empty_tip' : 'realtime_recording_empty_tip'
                    )}
                  </Text>
                </View>
              )}
            </View>

            {stopScroll && (
              <View className={styles.toEndBox} onClick={handleToEnd}>
                <ThemedImage
                  imageName="toEndIcon"
                  className={styles.toEndIcon}
                  src={Res.toEndIcon}
                />
              </View>
            )}
          </ScrollView>
          <View id="contentBtm" className={styles.btmContainer}>
            <View id="sim-show-popLang" className={styles.langBox}>
              <View
                className={`${styles.langSide} ${styles.langSideLeft}`}
                onClick={showInputLangPop}
              >
                <Text className={styles.langText}>
                  {supportLangList?.find(i => i.lang === originLanguage)?.display || ''}
                </Text>
                <ThemedImage
                  imageName="langArrowBottom"
                  className={styles.langArrowBottomIcon}
                  src={Res.langArrowBottom}
                />
              </View>
              {needTranslate && translationLanguage ? (
                <ThemedImage
                  imageName="switchLangIcon"
                  className={styles.switchLangIcon}
                  src={Res.switchLangIcon}
                  onClick={handleSwapLanguages}
                />
              ) : (
                <ThemedImage
                  imageName="langArrow"
                  className={styles.langArrowIcon}
                  src={Res.langArrow}
                />
              )}
              <View
                className={`${styles.langSide} ${styles.langSideRight}`}
                onClick={showTranslateLangPop}
              >
                <Text
                  className={`${styles.langText} ${
                    needTranslate && translationLanguage ? '' : styles.langTextDisabled
                  }`}
                >
                  {needTranslate && translationLanguage
                    ? supportLangList?.find(i => i.lang === translationLanguage)?.display || ''
                    : Strings.getLang('langSelect_no_translate')}
                </Text>
                <ThemedImage
                  imageName="langArrowBottom"
                  className={styles.langArrowBottomIcon}
                  src={Res.langArrowBottom}
                />
              </View>
            </View>
          </View>
        </View>
        <RecordCtr
          // controlBtnLoading={controlBtnLoading}
          handleControl={handleControl}
          handleStopRecord={handleStopRecord}
          recordType={isCall ? 0 : 1}
          isPauseSelf={isPauseSelf}
          setIsPauseSelf={setIsPauseSelf}
          showAiDisclaimer
          // currentDev={currentDev}
          // setCurrentDev={setCurrentDev}
        />
      </View>
    </Layout>
  );
};

export default React.memo(RealTimeRecording);
