import React, { FC, useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  location,
  showToast,
  navigateBack,
  getRecorderManager,
  uploadImage,
  vibrateShort,
  showLoading,
  hideLoading,
  Button,
  usePageEvent,
} from '@ray-js/ray';
import { SubTopBar } from '@/components';
import Strings from '@/i18n';
import { imgCloneStartIcon, imgErrorIcon, voiceLineBgIcon, voicePlayingIcon } from '@/res';
import clsx from 'clsx';
import { Asr, AsrDetectResultState } from '@ray-js/t-agent-plugin-assistant';
import { Logger } from '@ray-js/t-agent';
import { createCloneVoice, resetCloneVoice, aSRCloneValidate } from '@/api/index_highway';
import { useSelector } from 'react-redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { Icon } from '@ray-js/icons';
import { iOSExtractErrorMessage } from '@/utils';
import styles from './index.module.less';
import { formatTime } from './utils';

interface RouterSource {
  remainTimes: string;
  lang: string;
  voiceId: string; // 0 创建新克隆、1 重置克隆
  cloneEntry: string; // 克隆声音的入口
}

const MAX_RECORD_TIME = 30;

interface CloneVoiceActionProps {
  cloneWay: string;
}

const CloneVoiceAction: FC<CloneVoiceActionProps> = ({ cloneWay = 'reciting' }) => {
  const routerSource = location.query as RouterSource;
  const { voiceId = '', cloneEntry = 'create' } = routerSource;
  const { screenHeight, platform } = useSelector(selectSystemInfo);

  const [cloneState, setCloneState] = useState<'start' | 'recording' | 'done'>('start');
  const [loading, setLoading] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<'onCancel' | 'onSubmit' | undefined>();
  // 当前按住释放状态（根据位置判定取消/提交）
  const currentRecordingStatus = useRef<string>('');
  // 文案和语音录入是否匹配
  const [cloneResTextValidate, setCloneResTextValidate] = useState('');
  const asrRef = useRef(null);
  const timer = useRef(null);
  const timerCount = useRef<number>(0);
  const timeoutRef = useRef(null);
  const currentRecognizedText = useRef<string>('');
  // 倒计时
  const [timerCountNumber, setTimerCountNumber] = useState<number>(0);
  // asr初始化状态
  const [asrInited, setAsrInited] = useState<boolean>(false);

  const CLONE_TIP_TEXT = Strings.getLang('dscRecordingTextContent');

  Logger.setLogLevel('debug');

  const limitMinCount = cloneWay === 'reciting' ? 5 : 10;

  useEffect(() => {
    clearTimeoutAndInterval();
    return () => {
      clearTimer();
      clearTimeoutAndInterval();
    };
  }, []);

  const RecorderManager = getRecorderManager({
    complete: () => {
      console.log('==complete');
    },
    success: (params: null) => {
      console.log('===success==getRecorderManager', params);
    },
    fail: (params: null) => {
      console.log('===fail==getRecorderManager', params);
    },
  });

  const RecorderManagerRef = useRef<boolean>(false);

  /**
   * @name submitVoice
   */
  const submitVoice = async voiceUrl => {
    if (voiceUrl) {
      const props: any = {
        voiceUrl,
        text: CLONE_TIP_TEXT,
      };
      let requestApi = null;
      // 根据来源判断
      // 1.若不足2个且cloneEntry为create则为新增；
      // 2.若是cloneEntry为reset且有voiceId才走重置
      if (cloneEntry?.includes('reset') && voiceId) {
        requestApi = resetCloneVoice;
        props.voiceId = voiceId;
      } else if (cloneEntry?.includes('create')) {
        requestApi = createCloneVoice;
      }
      if (requestApi) {
        requestApi(props)
          .then(res => {
            console.log('res:::::', res);
            showToast({
              title: Strings.getLang('dsc_clone_success'),
              icon: 'success',
              duration: 2000,
            });
            setCloneState('done');
            clearAsr();
            RecorderManagerRef.current = false;
            hideLoading();
            setLoading(false);
          })
          .catch(error => {
            hideLoading();
            clearAsr();
            setCloneState('start');
            setRecordingStatus('onCancel');
            clearTimer();
            timerCount.current = 0;
            RecorderManagerRef.current = false;
            setTimerCountNumber(0);
            setLoading(false);

            if (platform === 'android') {
              showToast({
                title: error?.innerError?.errorMsg,
                icon: 'error',
              });
            } else if (platform === 'ios') {
              showToast({
                title: iOSExtractErrorMessage(error?.innerError?.errorMsg),
                icon: 'error',
              });
            }
            // resetAll();
          })
          ?.finally(() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          });
      }
    }
  };

  /**
   * @name startRecording
   * @description 停止录音，保存录音文件
   */
  const stopRecording = async () => {
    RecorderManager?.stop?.({
      complete: () => {
        console.log('===stopRecording==complete');
        // setCloneState('start');
        RecorderManagerRef.current = false;
        clearAsr();
      },
      success: params => {
        console.log('params?.tempFilePath', params?.tempFilePath);
        try {
          uploadImage({
            filePath: params?.tempFilePath,
            bizType: 'voice_clone',
            contentType: 'audio/mpeg',
            success: params => {
              const { publicUrl } = JSON.parse(params?.result);
              console.log('publicUrl', publicUrl);
              submitVoice(publicUrl);
            },
            fail: params => {
              console.log('===uploadImage==fail', params);
              clearAsr();
              resetAll();
            },
          });
          console.log('uploadImage:::success:::params', params);
        } catch (err) {
          console.log('catch uploadImage err:', err);
        }
      },
      fail: params => {
        console.log('===stopRecording==fail', params);
        clearAsr();
        resetAll();
      },
    });
  };

  const stopAsr = async () => {
    try {
      await asrRef.current.stop();
      console.log('clearAsr::ASR stop');
    } catch (err) {
      // console.log('clearAsr:::', err);
    }
  };

  const clearAsr = async () => {
    try {
      if (asrRef.current) {
        await asrRef.current.stop();
        asrRef.current = null;
        console.log('clearAsr::ASR clean');
      }
    } catch (err) {
      // console.log('clearAsr:::', err);
    }
  };

  /**
   * @name 声明监听函数
   */
  const createAsrDetector = () => {
    let recognizedText = '';
    const promptText = CLONE_TIP_TEXT;
    return Asr.detect(async res => {
      console.log('res::::', res);
      currentRecognizedText.current = res.text;
      if (currentRecordingStatus.current === 'onCancel') {
        return;
      }
      // 监听到
      if (res.state === AsrDetectResultState.MID || res.state === AsrDetectResultState.END) {
        recognizedText = res.text;
        if (res.state === AsrDetectResultState.END) {
          currentRecordingStatus.current = undefined;
          if (!recognizedText) {
            resetAll();
            return;
          }
          if (cloneWay !== 'reciting') {
            stopRecording();
            return;
          }
          try {
            const res = await aSRCloneValidate({
              text: promptText,
              voiceText: recognizedText,
            }).catch(error => {
              if (error?.innerError?.errorCode === '13890201') {
                setCloneResTextValidate('dsc_clone_validate_error');
                resetAll();
              }
            });
            console.log('ASRCloneValidate similarity:::', res);
            if (res) {
              stopRecording();
            } else {
              setCloneResTextValidate('dsc_clone_validate_error');
              resetAll();
            }
          } catch (error) {
            console.error('Error checking text similarity:', error);
            resetAll();
          }
        }
      }

      if (res.state === AsrDetectResultState.ERROR) {
        console.error('ASR Error:', res.errorCode);
        resetAll();
      }
    });
  };

  /**
   * @name 开始录制
   */
  const startRecording = async () => {
    if (!RecorderManagerRef.current) {
      RecorderManager?.start?.({
        sampleRate: 16000,
        encodeBitRate: 96000,
        frameSize: 10,
        format: 'wav' as any,
        complete: () => {
          console.log('===startRecording==complete');
        },
        success: params => {
          console.log('===startRecording==success', params);
          RecorderManagerRef.current = true;
        },
        fail: params => {
          console.log('===startRecording==fail', params);
          resetAll();
        },
      });
    }
    try {
      ty.createAIAssistant({
        complete: () => {
          console.log('createAIAssistant==complete');
        },
        success: (params: null) => {
          console.log('createAIAssistant===success==getRecorderManager', params);
        },
        fail: (params: null) => {
          console.log('createAIAssistant===fail==getRecorderManager', params);
        },
      });
      const authorize = await Asr.authorize();
      if (!authorize) {
        resetAll();
        showToast({
          title: Strings.getLang('no_asr_permission'),
          icon: 'error',
        });
        return;
      }
      // if (!asrRef.current) {
      // Create ASR detector
      const asr = createAsrDetector();
      // Start ASR
      asrRef.current = asr;
      // }
      await asrRef.current?.start();
      // 初始化成功，可以开始录音
      changeAsrInted(true);
      timer.current = setInterval(() => {
        timerCheck();
      }, 1000);
    } catch (error) {
      console.error('Error starting ASR:', error);
      stopTouch();
      showToast({
        title: Strings.getLang('dsc_clone_fail'),
        icon: 'error',
      });
      clearAsr();
    }
  };

  const handleDoneBack = () => {
    if (cloneEntry === 'reset') {
      navigateBack({ delta: 2 });
    } else if (cloneState !== 'done') {
      navigateBack({});
    } else {
      navigateBack({ delta: 1 });
    }
  };

  // ASR重置
  useEffect(() => {
    clearAsr();
    return () => {
      clearAsr();
    };
  }, []);

  usePageEvent('onHide', async () => {
    hideLoading();
    currentRecordingStatus.current = 'onCancel';
    await clearAsr();
    resetAll();
    console.log('hide=====================');
  });

  /**
   * @name 修改asr初始化状态
   */
  const changeAsrInted = target => {
    setAsrInited(target);
  };

  /**
   * @Name clearTimer
   * @description 清除计时器
   */
  const clearTimer = () => {
    console.log('timer?.current', timer?.current);
    if (timer?.current) {
      clearInterval(timer?.current);
    }
  };

  /**
   * @Name timerCheck
   * @description 计时器
   */
  const timerCheck = () => {
    if (timerCount?.current < MAX_RECORD_TIME) {
      timerCount.current += 1;
      const newTimerCount = timerCount.current;
      setTimerCountNumber(newTimerCount);
    }
  };

  /**
   * @name handleTouchMove
   * @description 移动中
   */
  const handleTouchMove = e => {
    const pageY = e?.changedTouches?.[0]?.pageY || 0;
    let targetStatus: any = '';
    if (pageY < screenHeight - 150) {
      targetStatus = 'onCancel';
    } else {
      targetStatus = 'onSubmit';
    }
    if (targetStatus !== recordingStatus) {
      setRecordingStatus(targetStatus);
      vibrateShort({ type: 'light' });
    }
  };

  /**
   * @name handleStartTouch
   * @description 按住开始录音
   */
  const handleStartTouch = e => {
    if (loading) {
      return;
    }
    clearTimeoutAndInterval();
    changeAsrInted(false);
    vibrateShort({ type: 'light' });
    e.origin.stopPropagation();
    setCloneResTextValidate(undefined);
    setCloneState('recording');
    setRecordingStatus('onSubmit');
    startRecording();
  };

  console.log('recordingStatus', recordingStatus);
  /**
   * @name handleEndTouch
   * @description 松开结束录音
   */
  const handleEndTouch = e => {
    if (loading) {
      return;
    }
    if (!asrInited || !currentRecognizedText.current || timerCount.current < limitMinCount) {
      if (asrInited && recordingStatus === 'onSubmit') {
        if (!currentRecognizedText.current) {
          showToast({
            title: Strings.getLang('dsc_clone_no_text'),
            icon: 'error',
          });
        } else if (timerCount.current < limitMinCount) {
          showToast({
            title: Strings.getLang('dsc_clone_short'),
            icon: 'error',
          });
        }
      }
      hideLoading();
      currentRecordingStatus.current = 'onCancel';
      clearAsr();
      resetAll();
      return;
    }
    vibrateShort({ type: 'light' });
    e?.origin?.stopPropagation?.();
    if (recordingStatus === 'onSubmit') {
      currentRecordingStatus.current = 'onSubmit';
      showLoading({ title: Strings.getLang('dsc_cloning_tips') });
      setLoading(true);
      stopAsr();
      stopTouch();
      timeoutRef.current = setTimeout(() => {
        showToast({
          title: Strings.getLang('dsc_clone_timeout'),
          icon: 'error',
        });
        resetAll();
        clearAsr();
      }, 20000);
    } else {
      currentRecordingStatus.current = 'onCancel';
      clearAsr();
      resetAll();
    }
  };

  /**
   * @name clearTimeoutAndInterval
   */
  const clearTimeoutAndInterval = () => {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current);
    }
    if (timer?.current) {
      clearInterval(timer?.current);
    }
  };

  /**
   * @name resetAll
   * @description 重置所有
   */
  const resetAll = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
    hideLoading();
    stopTouch();
    RecorderManager?.stop?.({});
    currentRecognizedText.current = '';
  };

  const stopTouch = () => {
    setCloneState('start');
    setRecordingStatus('onCancel');
    clearTimer();
    timerCount.current = 0;
    RecorderManagerRef.current = false;
    setTimerCountNumber(0);
  };

  const tipWidth = useMemo(() => {
    if (!timerCountNumber) {
      return 300;
    }
    return Math.min(300 + timerCountNumber * 5, 400);
  }, [timerCountNumber]);

  return (
    <View className={styles.view}>
      <SubTopBar title={Strings.getLang('dsc_clone_voice_top_title')} onBack={handleDoneBack} />

      {cloneWay === 'reciting' ? (
        <View
          className={clsx(
            styles.recordingTextBox,
            cloneState === 'recording' ? styles.activeBox : ''
          )}
        >
          <Text className={styles.recordingTips}>{Strings.getLang('dsc_recording_tips')}</Text>
          <Text className={styles.recordingText}>{CLONE_TIP_TEXT}</Text>
        </View>
      ) : (
        <View
          className={clsx(styles.singleWay, cloneState === 'recording' ? styles.activeBox : '')}
        >
          <View className={styles.singleText}>{Strings.getLang('dsc_record_audio')}</View>
          <Image src={voiceLineBgIcon} className={styles.singleImage} />
        </View>
      )}

      {/* {cloneState === 'done' ? (
        <View className={styles.successTextBox}>
          <View className={styles.iconImage}>
            <Icon type="icon-checkmark" size={16} color="#fff" />
          </View>
          <Text className={styles.resText}>{Strings.getLang('dsc_clone_success_tip')}</Text>
        </View>
      ) :  */}
      {cloneResTextValidate ? (
        <View className={styles.resTextBox}>
          <Image src={imgErrorIcon} className={styles.iconImage} />
          <Text className={styles.resText}>{Strings.getLang('dsc_clone_validate_error')}</Text>
        </View>
      ) : null}

      {cloneState === 'done' ? (
        <View className={styles.resultBtnWrap}>
          <Button className={styles.resultBtn} type="primary" onClick={() => handleDoneBack()}>
            {Strings.getLang('confirm')}
          </Button>
        </View>
      ) : (
        <View
          className={clsx(styles.touchArea, cloneState === 'recording' ? styles.active : '')}
          onTouchStart={handleStartTouch}
          onTouchEnd={handleEndTouch}
          onTouchMove={handleTouchMove}
        >
          <View className={styles.btn}>
            <Image src={imgCloneStartIcon} className={styles.btnImage} />
            <Text className={styles.cloneTipText}>{Strings.getLang('cloneBtnTip')}</Text>
          </View>
          <View className={styles.activeWrapper}>
            <View
              className={clsx(
                styles.maskTip,
                recordingStatus === 'onCancel' ? styles.maskTipCancel : ''
              )}
              style={{
                width: `${tipWidth}rpx`,
              }}
            >
              <Text className={styles.voicePlayingText}>
                {recordingStatus === 'onCancel'
                  ? Strings.getLang('touchToCancel')
                  : !asrInited
                  ? Strings.getLang('asrInted')
                  : timerCountNumber < MAX_RECORD_TIME - 5
                  ? formatTime(timerCountNumber)
                  : Strings.getLang('remainingTime')?.replace(
                      '{{value}}',
                      MAX_RECORD_TIME - timerCountNumber
                    )}
              </Text>
              <Image src={voicePlayingIcon} className={styles.voicePlayingIcon} />
            </View>
            {recordingStatus === 'onSubmit' ? (
              <View className={styles.bottomTip}>{Strings.getLang('touchToSubmit')}</View>
            ) : null}
            <View
              className={clsx(
                styles.bottomBtn,
                recordingStatus === 'onCancel' ? styles.bottomBtnCancel : ''
              )}
            >
              <View className={styles.bottomBg} />
              <View className={styles.bottomIcon}>
                <Icon type="icon-a-speakerwave3fill" size={32} color="rgba(255,255,255,1)" />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CloneVoiceAction;
