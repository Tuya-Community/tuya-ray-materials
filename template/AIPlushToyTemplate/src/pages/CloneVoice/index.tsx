import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRecorderManager,
  hideLoading,
  Image,
  location,
  navigateBack,
  router,
  showLoading,
  showToast,
  Text,
  uploadImage,
  View,
} from '@ray-js/ray';
import { TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import { imgErrorIcon, imgVoiceLineIcon } from '@/res';
import { CLONE_ICON_MAP } from '@/constant';
import clsx from 'clsx';
import {
  checkCloneStatus,
  createCloneVoice,
  editAgentInfo,
  getAgentInfo,
  getCloneVoiceList,
  resetCloneVoice,
} from '@/api';
import { useRequest } from 'ahooks';
import { selectCloneInfo } from '@/redux/modules/cloneInfoSlice';
import { AgentInfo } from '@/types';
import { updateUiState } from '@/redux/modules/uiStateSlice';
import { selectAgentInfo, updateAgentInfo } from '@/redux/modules/agentInfoSlice';
import styles from './index.module.less';

interface RouterSource {
  cloneWay: string;
  remainTimes: string;
  lang: string;
  voiceId: string; // 0 创建新克隆、1 重置克隆
}

const CloneVoice: FC = () => {
  const dispatch = useDispatch();
  const routerSource = location.query as RouterSource;
  const { cloneWay = 'reciting', remainTimes = '10' } = routerSource;
  const { voiceId, lang } = useSelector(selectCloneInfo);
  const agentInfo = useSelector(selectAgentInfo);
  const { endpointAgentId } = agentInfo;
  const [cloneState, setCloneState] = useState('start');
  const [cloneResText, setCloneResText] = useState('');
  const [countdownValue, setCountdownValue] = useState(10);
  const [currentVoiceId, setCurrentVoiceId] = useState(voiceId);
  const [remainTimesValue, setRemainTimesValue] = useState(
    remainTimes === '' ? 10 : Number(remainTimes)
  );
  const [routerList, setRouterList] = useState([]);
  const timer = useRef(null);
  const getCurrentPagesFunc = async () => {
    const agesRes = getCurrentPages() || [];
    const resList = agesRes.map(f => f.route);
    setRouterList(resList);
  };

  useEffect(() => {
    getCurrentPagesFunc();
  }, []);

  const handleBackVoiceSquare = () => {
    const backIndex = routerList.findIndex(item => item === 'pages/VoiceSquare/index');
    const backNumber = routerList?.length - 1 - (backIndex > -1 ? backIndex : 0);
    navigateBack({ delta: backNumber });
  };

  const checkCloneRes = (): Promise<any> => {
    return new Promise(resolve => {
      getCloneVoiceList()
        .then(res => {
          resolve({
            total: res?.length,
            list: res,
          });
        })
        .catch(() => {
          resolve({
            total: 0,
            list: [],
          });
        });
    });
  };

  const {
    data,
    run: checkCloneState,
    cancel,
  } = useRequest(() => checkCloneRes(), {
    pollingInterval: 3000,
    manual: true,
  });

  const { data: cloneCloudState, cancel: cancelPolling } = useRequest(
    voiceId => checkCloneStatus(voiceId),
    {
      pollingInterval: 3000,
      manual: true,
    }
  );

  useEffect(() => {
    if (data?.list?.length <= 0) return;

    if (data && data.list && data.list?.length > 0 && data.list[0].state === 1) {
      if (data.list[0].remainTimes < Number(remainTimes) || data.list[0].remainTimes === 0) {
        setCloneState('done');
        setCloneResText('');
        clearTimeout(timer.current);
        setCurrentVoiceId(data.list[0].voiceId);

        showToast({
          title: Strings.getLang('dsc_clone_success'),
          icon: 'success',
        });
        setRemainTimesValue(value => value - 1);
      } else {
        setCloneState('start');
        setCloneResText('dsc_clone_fail');
        clearTimeout(timer.current);
        showToast({
          title: Strings.getLang('dsc_clone_fail'),
          icon: 'error',
        });
        cloneWay === 'record' && setCountdownValue(10);
      }

      cancel();
    } else if (
      data &&
      data.list &&
      data.list?.length > 0 &&
      (data.list[0].state === 4 || data.list[0].state === 0)
    ) {
      setCloneState('start');
      cloneWay === 'record' && setCountdownValue(10);
      setCloneResText('dsc_clone_fail');
      clearTimeout(timer.current);
      showToast({
        title: Strings.getLang('dsc_clone_fail'),
        icon: 'error',
      });
      cancel();
    }
  }, [data]);

  useEffect(() => {
    if (cloneCloudState && cloneCloudState === 3) {
      setCloneResText('');
      setCloneState('done');
      clearTimeout(timer.current);
      showToast({
        title: Strings.getLang('dsc_clone_success'),
        icon: 'success',
      });
      cancelPolling();
      setRemainTimesValue(value => value - 1);
    } else if (cloneCloudState && cloneCloudState === 4) {
      setCloneState('start');
      setCloneResText('dsc_clone_fail');
      clearTimeout(timer.current);
      showToast({
        title: Strings.getLang('dsc_clone_fail'),
        icon: 'error',
      });
      cancelPolling();
    }
  }, [cloneCloudState]);

  useEffect(() => {
    let timer = null;
    if (cloneWay === 'record') {
      if (cloneState === 'recording' && countdownValue > 0) {
        timer = setInterval(() => {
          setCountdownValue(prevSeconds => prevSeconds - 1);
        }, 1000);
      } else if (cloneState === 'recording' && countdownValue === 0) {
        stopRecording();
        clearInterval(timer);
      } else if (cloneState !== 'recording' && countdownValue !== 0) {
        clearInterval(timer);
      }
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [cloneState, countdownValue]);

  const RecorderManager = getRecorderManager({
    complete: () => {
      console.log('==complete');
    },
    success: (params: null) => {
      console.log('===success==getRecorderManager', params);
    },
  });

  const timeoutFunc = () => {
    timer.current = setTimeout(() => {
      setCloneState('start');
      showToast({
        title: Strings.getLang('dsc_clone_timeout'),
        icon: 'none',
      });
      cancel();
    }, 9000);
  };

  const stopRecording = () => {
    RecorderManager.stop({
      complete: () => {
        console.log('===stopRecording==complete');
      },
      success: params => {
        uploadImage({
          filePath: params?.tempFilePath,
          bizType: 'voice_clone',
          contentType: 'audio/mpeg',
          success: params => {
            const { publicUrl } = JSON.parse(params?.result);
            console.log('===uploadImage==success', params, publicUrl);
            setCloneState('update');
            showToast({
              title: Strings.getLang('dsc_cloning_tips'),
              icon: 'none',
              duration: 2000,
            });
            if (voiceId) {
              resetCloneVoice(
                voiceId,
                lang,
                publicUrl,
                cloneWay === 'reciting' ? Strings.getLang('dsc_recording_text_content') : ''
              )
                .then(() => {
                  checkCloneState();
                  timeoutFunc();
                })
                .catch(error => {
                  console.log(error);
                  checkCloneState();
                  timeoutFunc();
                });
            } else {
              createCloneVoice(
                lang,
                publicUrl,
                cloneWay === 'reciting' ? Strings.getLang('dsc_recording_text_content') : ''
              )
                .then(() => {
                  checkCloneState();
                  timeoutFunc();
                })
                .catch(() => {
                  checkCloneState();
                  timeoutFunc();
                });
            }
          },
          fail: params => {
            console.log('===uploadImage==fail', params);
          },
        });
        setCloneState('update');
        console.log('===stopRecording==success', params);
      },
    });
  };

  const startRecording = () => {
    setCountdownValue(10);
    RecorderManager.start({
      sampleRate: 32000,
      complete: () => {
        console.log('===startRecording==complete');
      },
      success: params => {
        setCloneState('recording');
        console.log('===startRecording==success', params);
      },
      // @ts-ignore
      fail: params => {
        console.log('===startRecording==fail', params);
        const { errorMsg } = params;
        showToast({
          title: errorMsg,
          icon: 'error',
        });
      },
    });
  };

  const bindVoice = () => {
    showLoading({
      title: '',
    });
    const editObj = {
      speed: agentInfo?.speed,
      tone: agentInfo?.tone,
      keepChat: agentInfo?.keepChat,
      isMain: agentInfo?.isMain ? 1 : 0,
    };
    editAgentInfo({ ...editObj, endpointAgentId, voiceId: currentVoiceId })
      .then(async res => {
        if (res) {
          setTimeout(async () => {
            const agentCloudInfo = (await getAgentInfo(Number(endpointAgentId))) as AgentInfo;
            dispatch(
              updateAgentInfo({ ...agentCloudInfo, endpointAgentId: Number(endpointAgentId) })
            );
            hideLoading();
            showToast({
              title: Strings.getLang('dsc_choose_success'),
              icon: 'success',
            });
          }, 500);
        }
        setTimeout(() => {
          hideLoading();
        }, 3000);
      })
      .catch(() => {
        setTimeout(() => {
          hideLoading();
          showToast({
            title: Strings.getLang('dsc_choose_fail'),
            icon: 'error',
          });
        }, 1000);
      });
    dispatch(updateUiState({ cloneDone: true }));
  };

  const completeRecording = () => {
    bindVoice();

    handleBackVoiceSquare();
  };

  const onClickBtn = (state: string) => {
    switch (state) {
      case 'start':
        startRecording();
        break;
      case 'recording':
        stopRecording();
        break;
      case 'done':
        completeRecording();
        break;
      default:
        break;
    }
  };

  const handleDoneBack = () => {
    if (cloneState !== 'done') {
      navigateBack({});
    } else {
      bindVoice();

      handleBackVoiceSquare();
    }
  };

  return (
    <View className={styles.view}>
      <TopBar
        title={Strings.getLang('dsc_clone_voice_top_title')}
        backgroundColor="#daecf6"
        onBack={handleDoneBack}
      />

      {cloneWay === 'reciting' ? (
        <View className={styles.recordingTextBox}>
          <Text className={styles.recordingTips}>{Strings.getLang('dsc_recording_tips')}</Text>
          <Text className={styles.recordingText}>
            {Strings.getLang('dsc_recording_text_content')}
          </Text>
        </View>
      ) : (
        <View className={styles.singleWay}>
          <Text className={styles.singleText}>{Strings.getLang('dsc_record_audio')}</Text>
          <Image src={imgVoiceLineIcon} className={styles.singleImage} />
        </View>
      )}

      {cloneResText !== '' ? (
        <View className={styles.resTextBox}>
          <Image src={imgErrorIcon} className={styles.iconImage} />
          <Text className={styles.resText}>{Strings.getLang('dsc_clone_res')}</Text>
        </View>
      ) : (
        <View style={{ height: '80rpx' }} />
      )}
      <View className={styles.footer}>
        <View className={styles.btnBox} style={{ width: '160rpx' }}>
          <TouchableOpacity
            className={clsx(styles.btn)}
            onClick={() => {
              onClickBtn(cloneState);
            }}
          >
            <Image
              src={CLONE_ICON_MAP[cloneState]}
              className={clsx(styles.btnImage, cloneState === 'update' ? styles.active : '')}
            />
          </TouchableOpacity>
        </View>
        {cloneWay === 'record' && (
          <View className={styles.cloneBox}>
            <Text className={styles.cloneTips}>
              {Strings.getLang(
                cloneWay === 'record' ? 'dsc_remaining_recording_time' : 'dsc_clone_times'
              )}
            </Text>
            <Text
              className={clsx(styles.cloneNumber, styles.cloneTips)}
              style={{ marginLeft: '6rpx' }}
            >
              {cloneWay === 'record' ? countdownValue : remainTimesValue}
            </Text>
            {cloneWay === 'record' && (
              <Text
                className={clsx(styles.cloneNumber, styles.cloneTips)}
                style={{ marginLeft: '6rpx' }}
              >
                S
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default CloneVoice;
