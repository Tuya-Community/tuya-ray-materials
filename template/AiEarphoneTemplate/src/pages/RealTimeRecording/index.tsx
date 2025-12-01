import React, { FC, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, Image, ScrollView, PageContainer, Button, Switch } from '@ray-js/components';
import { setKeepScreenOn, showToast, getLaunchOptionsSync } from '@ray-js/ray';
import Res from '@/res';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useInterval } from 'ahooks';
import { TopBar } from '@/components';
import {
  tttGetRecordTransferRealTimeResult,
  tttPauseRecord,
  tttResumeRecord,
  tttStartRecord,
  tttStopRecord,
} from '@/api/ttt';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import {
  RecordStatus,
  selectAudioFileByKey,
  updateRecordTask,
  RecordType,
} from '@/redux/modules/audioFileSlice';
import TyNotification from '@ray-js/ty-notification';
import Strings from '@/i18n';
import { convertMillisecondsToTime, isJsonString, backToHome } from '@/utils';
import WaveAnimMini from '@/components/WaveAnimMini';
import { parseRealTimerResult } from '@/utils/recording';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { AGENTS } from '@/constant';
import { selectUserInfo } from '@/redux/modules/userInfoSlice';
import _ from 'lodash-es';
import Radio from '@/components/Radio';
// @ts-ignore
import styles from './index.module.less';

const RealTimeRecording: FC<any> = props => {
  const querys = getLaunchOptionsSync()?.query || {};
  const fromType = querys.fromType || ''; // app端进入
  const isOpusCelt = useSelector(selectUiStateByKey('isOpusCelt'));
  const lastTimeRef = useRef(0);
  const dispatch = useDispatch();
  const { devId: deviceId, isOnline, isDevOnline } = useSelector(selectDevInfo);
  const { screenHeight, safeBottomHeight, topBarHeight, language } = useSelector(selectSystemInfo);
  const { regionCode } = useSelector(selectUserInfo);
  const supportLangList = useSelector(selectUiStateByKey('supportLangList'));
  const isBtEntryVersion = useSelector(selectUiStateByKey('isBtEntryVersion')); // 是否是入门版耳机
  const offlineUsage = useSelector(selectUiStateByKey('offlineUsage')); // 离线可用
  const supportRecordChannelChange = useSelector(selectUiStateByKey('supportRecordChannelChange')); // 离线可用
  const [duration, setDuration] = useState(0); // 毫秒
  const task = useSelector(selectAudioFileByKey('task'));
  const [scrollTop, setScrollTop] = useState(0);

  const [currRecordType, setCurrRecordType] = useState(() => {
    const initType = props.location.query.recordType === '0' ? RecordType.CALL : RecordType.MEETING;
    return initType;
  });
  const [needTranslate, setNeedTranslate] = useState(false);
  const [originLanguage, setOriginLanguage] = useState('');
  const [translationLanguage, setTranslationLanguage] = useState('');

  const [textList, setTextList] = useState([]);
  const productStyle = useSelector(selectUiStateByKey('productStyle'));

  const isCardStyle = productStyle === 'card';
  // 先排除卡片
  const [recordChannel, setRecordChannel] = useState(1); // 0:ble 1:bt 2:mic
  const [showPageContainer, setShowPageContainer] = useState(false); // 是否显示输入类型选择
  const [interval, setInterval] = useState<number | undefined>(undefined);
  const [pageContainerType, setPageContainerType] = useState(''); // 弹窗类型
  const [showOriginalScroll, setShowOriginalScroll] = useState(false); // 是否显示原语言滚动选择
  const [showTransScroll, setShowTransScroll] = useState(false); // 是否显示目标语言滚动选择
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

  useEffect(() => {
    if (supportLangList?.length > 1) {
      const systemLang = ['zh_Hans_CN', 'zh-Hans']?.includes(language) ? 'zh' : 'en';
      const englishItem = supportLangList.find(({ lang }) => lang === systemLang);
      const initOriginLang = englishItem?.lang || supportLangList?.[1]?.lang;
      setOriginLanguage(initOriginLang);
    }
  }, [supportLangList]);

  const handleSelectOriginLang = (lang: string) => {
    setOriginLanguage(lang);
  };

  const handleSelectTargetLang = (lang: string) => {
    setTranslationLanguage(lang);
  };

  useEffect(() => {
    if (!task) return;
    switch (task.state) {
      case RecordStatus.FINISH: {
        setInterval(undefined);
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
    // 当前存在任务
    if (task) {
      const { userRecordDuration, needTranslate, originalLanguage, targetLanguage } = task;
      setDuration(userRecordDuration);
      setNeedTranslate(needTranslate);
      setOriginLanguage(originalLanguage);
      setTranslationLanguage(targetLanguage);
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
          currTextListRef.current = resList;
          setTextList(resList);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setDuration(0);
    }
  };

  const handleRecordFinishEvent = d => {
    if (d.deviceId !== deviceId) return;
    const { code, message } = d;
    if (code === 0) return; // 0为正常结束
    ty.showToast({ title: message, icon: 'error' });
    setInterval(undefined);
    dispatch(updateRecordTask());
  };

  const currTextListRef = useRef([]);

  const handleRecordTransferRealTimeRecognizeStatusUpdateEvent = d => {
    try {
      const {
        // 阶段  0.任务 4.asr 5.text 6.skill 7.tts
        phase,
        // 阶段状态 0. 未开启 1.进行中 2.结束 3.取消
        status,
        requestId,
        text,
        errorCode,
      } = d;

      if (errorCode === 10081) {
        // 欠费
        ty.showToast({ title: Strings.getLang('error_10081'), icon: 'error' });
        return;
      }

      // asr阶段 接收并实时更新对应requestId文本
      if (phase === 4) {
        const currTextItemIdx = currTextListRef.current.findIndex(item => item.id === requestId);
        if (currTextItemIdx > -1) {
          const newList = currTextListRef.current.map(item =>
            item.id === requestId ? { ...item, text } : item
          );
          currTextListRef.current = newList;
          setTextList(newList);
        } else {
          if (!text) return;
          const newList = [
            ...currTextListRef.current,
            {
              id: requestId,
              text,
            },
          ];
          currTextListRef.current = newList;
          setTextList(newList);
        }
        // text阶段 接收并展示status=2即已结束的requestId文本内容
      } else if (phase === 5 && status === 2) {
        let resText = '';
        if (text && text !== 'null') {
          if (isJsonString(text)) {
            const textArr = JSON.parse(text);
            const isArr = Array.isArray(textArr);
            // 数字的string类型如111， isJsonString判断为json字符串，会导致.join失败
            resText = isArr ? textArr?.join('\n') : textArr;
          } else {
            resText = text;
          }
        }

        if (!resText) {
          return;
        }

        const newList = currTextListRef.current.map(item => {
          return item.id === requestId ? { ...item, text: `${item.text}\n${resText}` } : item;
        });
        currTextListRef.current = newList;
        setTextList(newList);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    // 粗略计算内容高度去滚动scrollView
    let height = 0;
    textList?.forEach(item => {
      height += (item?.text?.length / 50) * 20 + 20 * 2 * 2;
    });
    setScrollTop(height);
  }, [textList]);

  const destroyEvent = () => {
    clear();
    setKeepScreenOn({ keepScreenOn: false });
    ty.wear.offRecordTransferFinishEvent(handleRecordFinishEvent);
    ty.wear.offRecordTransferRealTimeRecognizeStatusUpdateEvent(
      handleRecordTransferRealTimeRecognizeStatusUpdateEvent
    );
    ty.hideLoading();
  };

  useEffect(() => {
    ty.hideMenuButton();
    setKeepScreenOn({ keepScreenOn: true });
    checkRecordTask();
    ty.wear.onRecordTransferFinishEvent(handleRecordFinishEvent);
    ty.wear.onRecordTransferRealTimeRecognizeStatusUpdateEvent(
      handleRecordTransferRealTimeRecognizeStatusUpdateEvent
    );
    return () => {
      destroyEvent();
    };
  }, []);

  const [controlBtnLoading, setControlBtnLoading] = useState(false);

  // 开始录音
  const handleStartRecord = useCallback(async () => {
    const fn = async () => {
      if ((!isOnline && !offlineUsage) || controlBtnLoading) return;
      if (needTranslate && !translationLanguage) {
        showToast({
          icon: 'none',
          title: Strings.getLang('realtime_recording_translation_no_select_tip'),
        });
        return;
      }
      try {
        setControlBtnLoading(true);
        const config: any = {
          // 出错时是否要保留音频文件
          saveDataWhenError: true,
          // 录音类型，0呼叫，1会议
          recordType: currRecordType,
          // dp控制超时时间 单位秒
          controlTimeout: 5,
          // 灌流超时时间 单位秒
          dataTimeout: 10,
          // 0文件转写，1实时转写
          transferType: 1,
          // 是否需要翻译
          needTranslate,
          // 输入语言
          originalLanguage: originLanguage,
          // 智能体id 固定，后面具体根据提供的sdk获取agentId。
          agentId: '',
          /**
           * 录音通道 0 ble 1 Bt 2 micro
           * 默认是0 为了适配原有逻辑
           */
          recordChannel,
          // TTS流编码方式，通过编码后将流写入到耳机设备0：opus_silk  1:opus_celt
          ttsEncode: isOpusCelt ? 1 : 0,
        };
        if (needTranslate) {
          // 目标语言
          config.targetLanguage = translationLanguage;
        }
        await tttStartRecord({
          deviceId,
          config,
        });

        // ty.wear.getRecordTransferRealTimeResult(item =>)
        // setRecordState(1);
        setInterval(1000);
        lastTimeRef.current = Date.now();
        setControlBtnLoading(false);
      } catch (error) {
        setControlBtnLoading(false);
      }
    };
    if (isBtEntryVersion) {
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
  }, [
    deviceId,
    isOnline,
    controlBtnLoading,
    currRecordType,
    needTranslate,
    originLanguage,
    translationLanguage,
    recordChannel,
    isBtEntryVersion,
    offlineUsage,
  ]);

  // 暂停
  const handlePauseRecord = async () => {
    if (controlBtnLoading) return;
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
    if ((!isOnline && !offlineUsage) || controlBtnLoading) return;
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
    if (controlBtnLoading) return;
    try {
      ty.showLoading({ title: '' });
      await tttStopRecord(deviceId);
      setDuration(0);
      setInterval(undefined);
      ty.hideLoading({
        complete: () => {
          backToHome(fromType);
        },
      }); // 结束loading后返回
    } catch (error) {
      ty.hideLoading();
    }
  };

  const [showBluetoothError, setShowBluetoothError] = useState(false);
  useEffect(() => {
    setShowBluetoothError(!isOnline);
    if (!isOnline && !offlineUsage && duration) {
      // 断开连接时，停止录音
      handlePauseRecord();
    }
  }, [isOnline]);

  const renderRealTimeText = () => {
    return textList.map(item => (
      <Text key={item.id} className={styles.realTimeText}>
        {item.text}
      </Text>
    ));
  };

  const renderTitle = () => {
    if (task) {
      return (
        <View className={styles.waveBox}>
          <WaveAnimMini width={128} recordState={task.state} devId={deviceId} />
        </View>
      );
    }
    return <Text className={styles.title}>{Strings.getLang('title_realtime_recording')}</Text>;
  };

  useEffect(() => {
    // 是入门版，非卡片，且设备实际在线，则默认通道为1
    if ((isBtEntryVersion || supportRecordChannelChange) && !isCardStyle && isDevOnline) {
      setRecordChannel(1);
    } else if (isDevOnline === false && isOnline) {
      // 真实设备离线，但是状态是在线，说明离线可用开启
      // 说明离线可用
      setRecordChannel(2);
    } else {
      setRecordChannel(0);
    }
  }, [isBtEntryVersion, isCardStyle, supportRecordChannelChange]);

  // 切换输入类型
  const toggleShowPageContainer = () => {
    if (pageContainerType === 'langSwitch') {
      closeLangSwitchHandle();
      return;
    }
    setShowPageContainer(!showPageContainer);
  };

  const showPageContainerHandle = type => {
    if ((isDevOnline === false && type === 'inputType') || task?.state === RecordStatus.RECORDING) {
      // 设备离线或录音中状态不可操作
      // 耳机离线，不用选择通道，使用手机通道
      return;
    }
    setPageContainerType(type);
    setShowPageContainer(!showPageContainer);
  };

  const closeLangSwitchHandle = () => {
    if (needTranslate && !translationLanguage) {
      showToast({
        icon: 'none',
        title: Strings.getLang('realtime_recording_translation_no_select_tip'),
      });
      return;
    }
    setShowPageContainer(false);
  };

  return (
    <View className={styles.main}>
      <TopBar renderTitle={renderTitle} onBack={() => backToHome(fromType, false)} />
      <TyNotification
        show={showBluetoothError}
        top={topBarHeight}
        onClosed={() => setShowBluetoothError(false)}
        text={Strings.getLang('device_offline')}
      />
      <View className={styles.container}>
        <View className={styles.content}>
          {textList.length ? (
            <ScrollView
              className={styles.scroll}
              style={{
                height: `${screenHeight - topBarHeight - safeBottomHeight - 210}px`,
              }}
              refresherTriggered={false}
              scrollY
              scrollTop={scrollTop}
            >
              {renderRealTimeText()}
            </ScrollView>
          ) : (
            <View className={styles.emptyBox}>
              <Image className={styles.emptyImg} src={Res.imgMicColor} />
              <Text className={styles.emptyText}>
                {Strings.getLang('realtime_recording_empty_tip')}
              </Text>
            </View>
          )}
        </View>
        <View className={styles.configBox}>
          {(isBtEntryVersion || supportRecordChannelChange) && (
            <View
              className={`${task?.state === RecordStatus.RECORDING || isDevOnline === false ? styles.gray : null
                } ${styles.inputType}`}
              onClick={() => showPageContainerHandle('inputType')}
            >
              <View className={styles.configTitle}>{Strings.getLang('input_type')}</View>
              <View className={styles.configContent}>
                {recordChannel === 1
                  ? Strings.getLang('ear_recording')
                  : Strings.getLang('phone_recording')}
              </View>
            </View>
          )}

          <View
            className={`${task?.state === RecordStatus.RECORDING ? styles.gray : null} ${styles.langSwitch
              }`}
            style={{ width: isBtEntryVersion || supportRecordChannelChange ? '420rpx' : '100%' }}
            onClick={() => {
              if (task) return; // 任务开始后不可操作
              showPageContainerHandle('langSwitch');
            }}
          >
            <View className={styles.configTitle}>{Strings.getLang('mode_lang')}</View>
            <View className={styles.configContent}>
              {needTranslate ? (
                <View>
                  <Text className={styles.langText}>
                    {supportLangList?.find(i => i.lang === originLanguage)?.display || ''}
                  </Text>
                  <Image className={styles.transIcon} src={Res.imgTransIcon} />
                  <Text className={styles.langText}>
                    {supportLangList?.find(i => i.lang === translationLanguage)?.display || ''}
                  </Text>
                </View>
              ) : (
                <>
                  <Text>{Strings.getLang('input')}</Text>
                  <Text>
                    {supportLangList?.find(i => i.lang === originLanguage)?.display || ''}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View className={styles.controlArea}>
          {!task || task?.state === RecordStatus.FINISH || task?.state === RecordStatus.UNKNOWN ? (
            <View className={styles.startBtn} onClick={handleStartRecord}>
              <Image className={styles.icon} src={Res.imgStartWhite} />
            </View>
          ) : (
            <>
              <View className={styles.stopBtn} onClick={handleStopRecord}>
                <Image className={styles.icon} src={Res.imgOverWhite} />
                <Text className={styles.time}>{Strings.getLang('control_stop')}</Text>
              </View>
              {task?.state === RecordStatus.RECORDING && (
                <View className={styles.pauseBtn} onClick={handlePauseRecord}>
                  <Image className={styles.icon} src={Res.imgStopWhite} />
                  <Text className={styles.time}>{convertMillisecondsToTime(duration)}</Text>
                </View>
              )}
              {task?.state === RecordStatus.PAUSE && (
                <View
                  className={styles.pauseBtn}
                  style={{
                    backgroundColor: '#3678e3',
                  }}
                  onClick={handleResumeRecord}
                >
                  <Image className={styles.icon} src={Res.imgStartWhite} />
                  <Text className={styles.time}>{convertMillisecondsToTime(duration)}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
      <PageContainer
        customStyle={{
          height: pageContainerType === 'langSwitch' ? '90%' : '600rpx',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0px -3px 15px 0px rgba(0, 0, 0, 0.05)',
        }}
        position="bottom"
        show={showPageContainer}
        onClickOverlay={toggleShowPageContainer}
      >
        {pageContainerType === 'langSwitch' ? (
          <View className={styles.inputContentBox}>
            <View className={styles.transContentTitle}>
              {Strings.getLang('choose_translation')}
            </View>
            <Image src={Res.translationIcon} className={styles.bigTransIcon} />
            <View className={styles.transResult}>
              {needTranslate && translationLanguage ? (
                <View>
                  <Text
                    className={styles.blueText}
                    onClick={() => {
                      setShowOriginalScroll(true);
                      setShowTransScroll(false);
                    }}
                  >
                    {Strings.getLang('input_without_colon')}
                  </Text>
                  <Text className={styles.line} />
                  <Text>
                    {supportLangList?.find(i => i.lang === originLanguage)?.display || ''}
                  </Text>
                  <Image className={styles.rightArrow} src={Res.rightArrowIcon} />
                  <Text
                    className={styles.blueText}
                    onClick={() => {
                      setShowOriginalScroll(false);
                      setShowTransScroll(true);
                    }}
                  >
                    {Strings.getLang('outInput_without_colon')}
                  </Text>
                  <Text className={styles.line} />
                  <Text>
                    {supportLangList?.find(i => i.lang === translationLanguage)?.display || ''}
                  </Text>
                </View>
              ) : (
                <>
                  <Text className={styles.blueText}>{Strings.getLang('input_without_colon')}</Text>
                  <Text className={styles.line} />
                  <Text>
                    {supportLangList?.find(i => i.lang === originLanguage)?.display || ''}
                  </Text>
                </>
              )}
            </View>
            <View className={styles.langInputBox}>
              <View className={styles.langTop}>
                <Text className={styles.langInputTitle}>{Strings.getLang('input_lang')}</Text>
                <Text
                  className={styles.langTag}
                  onClick={() => {
                    setShowOriginalScroll(!showOriginalScroll);
                    setShowTransScroll(showOriginalScroll);
                  }}
                >
                  {supportLangList?.find(i => i.lang === originLanguage)?.display || ''}
                </Text>
              </View>
              {showOriginalScroll && (
                <ScrollView className={styles.langScroll} scrollY refresherTriggered={false}>
                  {supportLangList.map(({ lang, display }) => (
                    <View
                      key={lang}
                      className={styles.item}
                      onClick={() => handleSelectOriginLang(lang)}
                    >
                      <Text
                        className={styles.text}
                        style={{
                          color: originLanguage === lang ? '#000' : '#aaa',
                        }}
                      >
                        {display}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
            <View className={styles.langInputBox}>
              <View className={styles.langTop}>
                <Text className={styles.langInputTitle}>{Strings.getLang('out_input_lang')}</Text>
                <Switch
                  onClick={e => {
                    e.origin.defaultPrevented = true; // 阻止默认事件
                    e.origin.stopPropagation();
                  }}
                  checked={needTranslate}
                  onChange={() => {
                    if (needTranslate) {
                      setShowTransScroll(false);
                    } else if (!needTranslate) {
                      setShowTransScroll(true);
                      setShowOriginalScroll(false);
                    }

                    setNeedTranslate(!needTranslate);
                  }}
                />
              </View>
              {showTransScroll && (
                <ScrollView className={styles.langScroll} scrollY refresherTriggered={false}>
                  {supportLangList.map(({ lang, display }) => (
                    <View
                      key={lang}
                      className={styles.item}
                      onClick={() => handleSelectTargetLang(lang)}
                    >
                      <Text
                        className={styles.text}
                        style={{
                          color: translationLanguage === lang ? '#000' : '#aaa',
                        }}
                      >
                        {display}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
            <Button className={styles.btnConfirm} type="primary" onClick={closeLangSwitchHandle}>
              {Strings.getLang('confirm')}
            </Button>
          </View>
        ) : (
          <View className={styles.inputContentBox}>
            <View className={styles.inputContentTitle}>{Strings.getLang('input_type')}</View>
            <Button
              className={styles.btnConfirm}
              type="primary"
              onClick={() => setShowPageContainer(false)}
            >
              {Strings.getLang('confirm')}
            </Button>
          </View>
        )}
      </PageContainer>
    </View>
  );
};

export default React.memo(RealTimeRecording);
