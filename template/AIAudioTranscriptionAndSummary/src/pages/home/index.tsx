/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC, useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Button,
  Text,
  Image,
  onRecordingEvent,
  offRecordingEvent,
  uploadFile,
  showLoading,
  hideLoading,
  showToast,
  getAIAudioTranscriptionStorageConfig,
  startAIAudioTranscriptionTask,
  getAIAudioTranscriptionStatus,
  getAIAudioTranscriptionSttText,
  getAIAudioTranscriptionSummary,
  startAIAudioTranscriptionShare,
  getAIAudioTranscriptionShareLink,
  getRecorderManager,
  getAudioFileDuration,
  downloadFile,
  share,
} from '@ray-js/ray';
import Player from '@ray-js/inner-audio-player';
import Tabs from '@ray-js/components-ty-tabs';
import RayRecordingAmplitudeAnimation, {
  AnimateActionInstance,
} from '@ray-js/recording-amplitude-animation';
import Res from '@/res';
import { devices } from '@/devices';
import { calculateDecibels } from '@/utils';
import { isNumber } from 'lodash';
import { useSelector } from 'react-redux';
import Strings from '@/i18n';
import Markdown from '@ray-js/mini-app-mark-down';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import SttContent from './component/SttContent';
import ResultContainer from './component/ResultContainer';
// @ts-ignore
import styles from './index.module.less';

const AGENT_ID = ''; // 智能体ID 参考readme中教程部分获取
const AUDIO_FILE_SUFFIX = 'mp3'; // 音频文件格式 固定mp3

const Home: FC = () => {
  const system = useSelector(selectSystemInfoByKey('system'));
  const recorderManagerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0); // 录音时长 毫秒
  const [tempAudioFilePath, setTempAudioFilePath] = useState(''); // 临时文件路径
  const [currTab, setCurrTab] = useState<string>('stt');
  // 0-未开始 1-文件上传中 2-文件上传成功 3-转录中 4-转录完成
  const [transferStatus, setTransferStatus] = useState(0);
  // @ts-ignore
  const { devId } = devices.common.getDevInfo();

  useEffect(() => {
    recorderManagerRef.current = getRecorderManager();

    if (!AGENT_ID) {
      showToast({ title: Strings.getLang('agent_id_empty_tip'), icon: 'error' });
    }
  }, []);

  const objectKeyRef = useRef('');
  const tempPathRef = useRef(null);

  const handleStart = () => {
    recorderManagerRef.current.start({
      frameSize: undefined,
      sampleRate: 16000,
      numberOfChannels: 1,
      format: AUDIO_FILE_SUFFIX,
      success: d => {
        tempPathRef.current = d.tempFilePath;
        setIsRecording(true);
      },
      fail: err => {
        showToast({ title: Strings.getLang('start_recording_err_tip'), icon: 'error' });
        console.warn('start recording err', err);
      },
    });
    // 开启持续录音 用于实时获取音频流绘制音波图
    recorderManagerRef.current.startRecording({ period: 100 });
  };

  const handleStop = () => {
    recorderManagerRef.current.stop({
      success: d => {
        setTimeout(() => {
          if (tempPathRef.current) {
            setTempAudioFilePath(tempPathRef.current);
          }
          getAudioFileDuration({
            path: tempPathRef.current,
            success: res => {
              if (isNumber(res?.duration)) {
                setDuration(res.duration);
              }
            },
            fail: err => {
              console.warn('getAudioFileDuration err', err);
            },
          });
          setIsRecording(false);
        }, 1000);
      },
    });
    recorderManagerRef.current.stopRecording();
  };

  useEffect(() => {
    onRecordingEvent(handleRecordingEvent);
    return () => {
      offRecordingEvent(handleRecordingEvent);
      // 卸载时清除定时器
      intervalId.current && clearInterval(intervalId.current);
      shareLinkIntervalId.current && clearInterval(shareLinkIntervalId.current);
    };
  }, []);

  const handleRecordingEvent = d => {
    try {
      const db = calculateDecibels(d.buffer);
      const dbNum = isNumber(+db) ? +db : 0;
      AnimateActionInstance.update({ percent: +dbNum / 100, animateId: 'MY_ANIM_ID' });
    } catch (error) {
      console.warn(error);
    }
  };

  const storageKey = useRef('');
  const handleStartTransfer = async () => {
    if (!AGENT_ID) {
      console.warn('You need to configure an AGENT_ID!');
      return;
    }
    try {
      showLoading({ title: '' });
      setTransferStatus(1);
      // 请求云存储授权token
      const storageConfig = await getAIAudioTranscriptionStorageConfig({
        devId,
        name: `audio_${Math.round(Math.random() * 100)}_${new Date().getTime()}`,
        businessCode: AGENT_ID,
        suffix: AUDIO_FILE_SUFFIX,
      });
      const { headers, key, url } = storageConfig;
      storageKey.current = key;

      const uploadParams: UploadFileParams = {
        url,
        filePath: tempAudioFilePath,
        name: key,
        header: headers,
      };
      // 兼容ios端上传逻辑
      if (/ios/gi.test(system)) {
        uploadParams.formData = {};
      }
      // 上传文件
      uploadFile({
        ...uploadParams,
        success: d => {
          setTransferStatus(2);
          startAIAudioTranscriptionTask({
            devId,
            businessCode: AGENT_ID,
            key: storageKey.current,
            language: 'en', // 录音语言
            duration: Math.floor(duration / 1000),
            template: 'default',
          })
            .then(() => {
              setTransferStatus(3);
            })
            .catch(e => {
              console.warn('startAIAudioTranscriptionTask', e);
              showToast({ title: Strings.getLang('file_transcription_fail'), icon: 'error' });
            });
        },
        fail: err => {
          console.warn('uploadFile', err);
          showToast({ title: Strings.getLang('file_upload_fail'), icon: 'error' });
          setTransferStatus(0);
        },
      });
      hideLoading();
    } catch (error) {
      console.log(error);
      hideLoading();
    }
  };

  const intervalId = useRef(null);
  const getTransferProcessStatus = useCallback(async () => {
    try {
      // 对已上传且转录中的录音进行轮询
      const transferStatusList = await getAIAudioTranscriptionStatus({
        devId,
        keys: storageKey.current,
        businessCode: AGENT_ID,
      });
      if (!isNumber(transferStatusList?.[0]?.status)) return;
      // -已上传 2-转录中 9-已完成 100-错误
      switch (transferStatusList?.[0]?.status) {
        case 9:
          clearInterval(intervalId.current);
          intervalId.current = null;
          setTransferStatus(4);
          break;
        case 100:
          clearInterval(intervalId.current);
          intervalId.current = null;
          setTransferStatus(0);
          showToast({
            title: `${Strings.getLang('file_transcription_fail')}[error code:100]`,
            icon: 'error',
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.log('getAIAudioTranscriptionStatus', error);
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  const [shareLink, setShareLink] = useState('');
  const shareLinkIntervalId = useRef(null);
  const getShareLink = async () => {
    try {
      const res = await getAIAudioTranscriptionShareLink({
        devId,
        businessCode: AGENT_ID,
        objectKey: objectKeyRef.current,
      });
      if (res) {
        setShareLink(res);
        clearInterval(shareLinkIntervalId.current);
        shareLinkIntervalId.current = null;
      }
    } catch (error) {
      console.warn(error);
      clearInterval(shareLinkIntervalId.current);
      shareLinkIntervalId.current = null;
    }
  };
  const startShareTask = async (key: string) => {
    try {
      const objectKey = await startAIAudioTranscriptionShare({
        devId,
        businessCode: AGENT_ID,
        key,
      });
      objectKeyRef.current = objectKey;
      if (!shareLinkIntervalId.current) {
        // 每五秒轮询请求Markdown文件分享链
        shareLinkIntervalId.current = setInterval(getShareLink, 5000);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handleShare = useCallback(async () => {
    downloadFile({
      url: shareLink,
      success: data => {
        if (data?.tempFilePath) {
          share({
            type: 'More',
            title: '',
            message: '',
            contentType: 'file',
            filePath: data?.tempFilePath,
          });
        }
      },
    });
  }, [shareLink]);

  const [sttList, setSttList] = useState([]);
  const [summary, setSummary] = useState('');
  useEffect(() => {
    try {
      if (transferStatus === 3 && !intervalId.current) {
        // 文件转录中时  每十秒轮询查询转录状态
        intervalId.current = setInterval(getTransferProcessStatus, 10000);
      }
      // 文件转录完成，获取转写/总结内容
      if (transferStatus === 4) {
        startShareTask(storageKey.current);
        getAIAudioTranscriptionSttText({
          devId,
          key: storageKey.current,
          businessCode: AGENT_ID,
        }).then(d => {
          if (d?.length) {
            setSttList(d);
          }
        });
        getAIAudioTranscriptionSummary({
          devId,
          key: storageKey.current,
          businessCode: AGENT_ID,
        }).then(d => {
          if (d?.summary) {
            setSummary(d?.summary);
          }
        });
      }
    } catch (error) {
      console.warn(error);
    }
  }, [transferStatus]);

  const handleControlRecording = useCallback(() => {
    if (isRecording) {
      handleStop();
    } else {
      handleStart();
    }
  }, [isRecording]);

  const renderStatusText = useCallback(() => {
    let text = '';
    switch (transferStatus) {
      case 1:
        text = Strings.getLang('transfer_status_uploading');
        break;
      case 2:
        text = Strings.getLang('transfer_status_upload_done');
        break;
      case 3:
        text = Strings.getLang('transfer_status_transcribing');
        break;
      default:
        break;
    }
    return <Text className={styles.tipText}>{text}</Text>;
  }, [transferStatus]);

  return (
    <View className={styles.container}>
      <View className={styles.main}>
        <View className={styles.recordingActionBox}>
          {!tempAudioFilePath && (
            <>
              <RayRecordingAmplitudeAnimation
                width={80}
                height={30}
                animateId="MY_ANIM_ID"
                speed={0.5}
                barWidth={1}
                barColor="#f00"
                play
                className={styles.amplitudeAnimation}
                style={{
                  background: isRecording ? '#fff' : 'transparent',
                }}
              />
              <View
                className={styles.recordingBtn}
                onClick={handleControlRecording}
                style={{
                  backgroundColor: isRecording ? '#F04C4C' : '#1989fa',
                }}
              >
                <Image src={Res.imgRecordStart} className={styles.recordingIcon} />
              </View>
              <Text className={styles.recordingLabel}>
                {isRecording
                  ? Strings.getLang('stop_recording')
                  : Strings.getLang('start_recording')}
              </Text>
            </>
          )}
          {tempAudioFilePath && (
            <View style={{ width: '100%' }}>
              <Player filePath={tempAudioFilePath} style={{ width: '100%' }} />
              {transferStatus === 0 && (
                <Button onClick={handleStartTransfer} className={styles.startBtn}>
                  {Strings.getLang('start_transfer')}
                </Button>
              )}
            </View>
          )}
          {renderStatusText()}
        </View>
        <View className={styles.transferActionBox}>
          <View className={styles.tabContainer}>
            <Tabs.SegmentedPicker
              activeKey={currTab}
              tabActiveTextStyle={{
                color: 'rgba(54, 120, 227, 1)',
                fontWeight: '600',
              }}
              className={styles.tabSegmentedPicker}
              onChange={setCurrTab}
            >
              <Tabs.TabPanel tab={Strings.getLang('tab_transcription')} tabKey="stt" />
              <Tabs.TabPanel tab={Strings.getLang('tab_summary')} tabKey="summary" />
            </Tabs.SegmentedPicker>
          </View>
          {currTab === 'stt' && (
            <ResultContainer>
              <SttContent sttList={sttList} />
            </ResultContainer>
          )}
          {currTab === 'summary' && (
            <ResultContainer>
              <View>
                {shareLink && (
                  <Button onClick={handleShare}>{Strings.getLang('share_summary')}</Button>
                )}
                <Markdown
                  input={summary}
                  types={['custom-card']}
                  theme="light"
                  onUpdateBlocks={() => {}}
                />
              </View>
            </ResultContainer>
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(Home);
