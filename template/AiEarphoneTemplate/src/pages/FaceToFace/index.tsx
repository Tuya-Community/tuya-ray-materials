import React, { FC, useCallback, useEffect, useState, useRef } from 'react';
import { View, Text, Image } from '@ray-js/components';
import {
  setNavigationBarBack,
  hideLoading,
  setKeepScreenOn,
  showLoading,
  showModal,
  getLaunchOptionsSync,
} from '@ray-js/ray';
import Res from '@/res';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { useSelector } from 'react-redux';
import { useInterval } from 'ahooks';
import { TopBar } from '@/components';
import { tttStartRecord, tttPauseRecord, tttResumeRecord, tttStopRecord } from '@/api/ttt';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { RecordStatus, selectAudioFileByKey } from '@/redux/modules/audioFileSlice';
import TyNotification from '@ray-js/ty-notification';
import Strings from '@/i18n';
import { convertMillisecondsToTime, matchLanguageWithRegex, backToHome } from '@/utils';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { AGENTS } from '@/constant';
import { selectUserInfo } from '@/redux/modules/userInfoSlice';
import LangSwitch from '@/components/LangSwitch';
import DoingContent from './component/DoingContent';
import ChooseLanguage from './component/ChooseLanguage';
// @ts-ignore
import styles from './index.module.less';

let uniqueKeyCounter = 0; // 全局计数器
const SimultaneousRecording: FC<any> = () => {
  const querys = getLaunchOptionsSync()?.query || {};
  const fromType = querys.fromType || ''; // app端进入
  const lastTimeRef = useRef(0);
  const { devId: deviceId, isOnline, isDevOnline } = useSelector(selectDevInfo);
  const { topBarHeight, language } = useSelector(selectSystemInfo);
  const { regionCode } = useSelector(selectUserInfo);
  const [duration, setDuration] = useState(0); // 毫秒
  const task = useSelector(selectAudioFileByKey('task'));
  const [textList, setTextList] = useState([]);
  const supportLangList = useSelector(selectUiStateByKey('supportLangList'));
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  const isOpusCelt = useSelector(selectUiStateByKey('isOpusCelt'));
  const isCardStyle = productStyle === 'card';
  const [leftLanguage, setLeftLanguage] = useState(supportLangList?.[0]?.lang || ''); // 左耳语言
  const [rightLanguage, setRightLanguage] = useState(supportLangList?.[1]?.lang || ''); // 右耳语言
  const [activeType, setActiveType] = useState(''); // 当前激活的耳机
  const [showChooseLanguagePopup, setShowChooseLanguagePopup] = useState(false);
  const [lines, setLines] = useState([]);

  const [intervals, setIntervals] = useState<number | undefined>(undefined);
  const clear = useInterval(
    () => {
      const now = Date.now();
      const elapsed = now - lastTimeRef.current; // 计算实际经过的时间
      lastTimeRef.current = now;
      setDuration(prevDuration => prevDuration + elapsed); // 累加实际经过的时间
    },
    intervals,
    {
      immediate: false,
    }
  );

  useEffect(() => {
    if (supportLangList?.length > 1) {
      // 查询是否有和系统语言匹配上的lang
      const matchLang = matchLanguageWithRegex(
        language,
        supportLangList.map(({ lang }) => lang)
      );
      // 英语
      const englishItem = supportLangList.find(({ lang }) => lang === 'en');
      if (!leftLanguage) {
        // 左耳为自己使用的语言
        let initLeftLang = supportLangList?.[0]?.lang;
        if (matchLang) initLeftLang = matchLang;
        setLeftLanguage(initLeftLang);
      }
      if (!rightLanguage || rightLanguage === leftLanguage) {
        // 右耳为对方使用的语言
        let initRightLang =
          englishItem && leftLanguage !== 'en' ? 'en' : supportLangList?.[1]?.lang;
        if (matchLang) {
          // 左右耳初始语言不同
          initRightLang = supportLangList.filter(({ lang }) => lang !== matchLang)[0].lang;
        }
        setRightLanguage(initRightLang);
      }
    }
  }, [supportLangList, leftLanguage, rightLanguage, language]);

  useEffect(() => {
    if (!task) return;
    switch (task.state) {
      case RecordStatus.FINISH: {
        setIntervals(undefined);
        break;
      }
      case RecordStatus.PAUSE:
        setIntervals(undefined);
        break;
      case RecordStatus.RECORDING:
        setIntervals(1000);
        lastTimeRef.current = Date.now();
        break;
      default:
        break;
    }
  }, [task]);

  const checkRecordTask = async () => {
    // 当前存在任务
    if (task) {
      const { userRecordDuration, originalLanguage, targetLanguage } = task;
      setDuration(userRecordDuration);
      setLeftLanguage(originalLanguage);
      setRightLanguage(targetLanguage);
      if (task.state === RecordStatus.RECORDING) {
        setIntervals(1000);
        lastTimeRef.current = Date.now();
      }
    } else {
      setDuration(0);
    }
  };

  // 停止
  const handleStopRecord = async () => {
    try {
      showLoading({ title: '' });
      await tttStopRecord(deviceId);
      hideLoading();
      backToHome(fromType);
    } catch (error) {
      hideLoading();
    }
  };

  useEffect(() => {
    ty.hideMenuButton();
    setKeepScreenOn({ keepScreenOn: true });
    checkRecordTask();
  }, []);

  const [showBluetoothError, setShowBluetoothError] = useState(false);
  useEffect(() => {
    setShowBluetoothError(!isOnline);
    if (!isOnline && duration) {
      // 断开连接时，停止录音
      handlePauseRecord();
    }
  }, [isOnline]);

  const renderTitle = () => {
    if (task) {
      return (
        <View className={styles.topBox}>
          <Text className={styles.topTime}>{convertMillisecondsToTime(duration)}</Text>
        </View>
      );
    }
    return (
      <Text className={styles.title}>{Strings.getLang('mode_title_faceToFace_recording')}</Text>
    );
  };

  const getRandomLineHight = (h = 0) => {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      arr.push({ key: uniqueKeyCounter++, value: h || Math.floor(Math.random() * 16) + 1 });
    }

    return arr;
  };

  // 开始1v1录音
  const handleStartRecord = useCallback(
    (type: 'left' | 'right') => {
      const startRecordFn = async (type: 'left' | 'right') => {
        setLines(getRandomLineHight(1));
        setInterval(() => {
          setLines(getRandomLineHight());
        }, 1000);

        if (!isOnline) return;

        try {
          showLoading({ title: '' });
          const config: any = {
            // 出错时是否要保留音频文件
            saveDataWhenError: true,
            // 录音类型，0呼叫，1会议，2同声传译，3面对面翻译
            recordType: 3,
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
            originalLanguage: type === 'left' ? leftLanguage : rightLanguage,
            /**
             * 目标语言
             * 会议或者电话模式，表示目标语言
             * 同声传译模式，表示右耳语言
             */
            targetLanguage: type === 'left' ? rightLanguage : leftLanguage,
            // 智能体id 固定，后面具体根据提供的sdk获取agentId。
            agentId: '',
            /**
             * 录音通道 0 ble 1 Bt 2 micro
             * 默认是0 为了适配原有逻辑
             */
            recordChannel: isCardStyle || isDevOnline === false ? 2 : 1,
            // 0代表左耳 1代表右耳
            f2fChannel: type === 'left' ? 0 : 1,
            // TTS流编码方式，通过编码后将流写入到耳机设备0：opus_silk  1:opus_celt
            ttsEncode: isOpusCelt ? 1 : 0,
            // 是否需要tts
            needTts: true,
          };
          await tttStartRecord(
            {
              deviceId,
              config,
            },
            true
          );
          setActiveType(type);
          hideLoading();
          setIntervals(1000);
          lastTimeRef.current = Date.now();
        } catch (error) {
          ty.showToast({
            title: Strings.getLang('error_simultaneous_recording_start'),
            icon: 'error',
          });
          hideLoading();
        }
      };
      ty.authorize({
        scope: 'scope.record',
        success: () => {
          startRecordFn(type);
        },
        fail: e => {
          ty.showToast({ title: Strings.getLang('no_record_permisson'), icon: 'error' });
          console.log('cope.record: ', e);
        },
      });
    },
    [deviceId, isOnline, rightLanguage, leftLanguage]
  );

  // 暂停
  const handlePauseRecord = async () => {
    setActiveType(''); // 临时调试
    try {
      await tttPauseRecord(deviceId);
      setActiveType('');
      setIntervals(undefined);
    } catch (error) {
      console.log('handlePauseRecord fail', error);
    }
  };

  // 恢复
  const handleResumeRecord = async () => {
    if (!isOnline) return;
    try {
      await tttResumeRecord(deviceId);
      setIntervals(1000);
      lastTimeRef.current = Date.now();
    } catch (error) {
      console.log('handleResumeRecord fail', error);
    }
  };

  const onLeftStart = () => {
    if (activeType === 'left') {
      handleResumeRecord();
      return;
    }
    handleStartRecord('left');
  };

  const onRightStart = () => {
    if (activeType === 'right') {
      handleResumeRecord();
      return;
    }
    handleStartRecord('right');
  };

  const onBack = () => {
    clear();
    if (!textList?.length && !task) {
      setNavigationBarBack({ type: 'system' });
      backToHome(fromType, false);
      return;
    }

    // 小于90秒弹提示
    showModal({
      title: Strings.getLang('tip'),
      content: Strings.getLang('sure_to_stop_record'),
      showCancel: true,
      cancelText: Strings.getLang('cancel'),
      cancelColor: '#66666',
      confirmText: Strings.getLang('confirm'),
      confirmColor: '#3678E3',
      success: async ({ confirm }) => {
        try {
          if (confirm) {
            handleStopRecord();
            setNavigationBarBack({ type: 'system' });
            backToHome(fromType);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  return (
    <View className={styles.main}>
      <TopBar renderTitle={renderTitle} onBack={onBack} type="custom" />
      <TyNotification
        show={showBluetoothError}
        top={topBarHeight}
        onClosed={() => setShowBluetoothError(false)}
        text={Strings.getLang('device_offline')}
      />

      <View className={styles.container}>
        {/* 选择左右耳语言 */}
        <LangSwitch
          duration={duration}
          setShowChooseLanguagePopup={setShowChooseLanguagePopup}
          leftLanguage={leftLanguage}
          rightLanguage={rightLanguage}
          supportLangList={supportLangList}
          reverseLangHandle={() => {
            setLeftLanguage(rightLanguage);
            setRightLanguage(leftLanguage);
          }}
        />

        <DoingContent activeType={activeType} textList={textList} setTextList={setTextList} />
        <View className={styles.startBox}>
          {activeType ? (
            <View
              className={`${styles.startIng} ${styles[activeType]}`}
              onClick={handlePauseRecord}
            >
              <View>
                <View className={styles.top}>
                  <View className={styles.lineBox}>
                    {lines?.map(item => {
                      return (
                        <View
                          className={styles.line}
                          key={item.key}
                          style={{
                            height: item.value,
                          }}
                        />
                      );
                    })}
                  </View>
                </View>
                <View>
                  <Text className={styles.startIngText}>{Strings.getLang('again_click_stop')}</Text>
                </View>
              </View>
            </View>
          ) : (
            <>
              <View className={`${styles.leftStartIcon} ${styles.startBtn}`} onClick={onLeftStart}>
                <Image src={Res.leftSpeekIcon} className={styles.startIcon} />
                <Text className={styles.leftText}>
                  {supportLangList?.find(i => i.lang === leftLanguage)?.display || ''}
                </Text>
              </View>

              <View
                className={`${styles.rightStartIcon} ${styles.startBtn}`}
                onClick={onRightStart}
              >
                <Image src={Res.rightSpeekIcon} className={styles.startIcon} />
                <Text className={styles.rightText}>
                  {supportLangList?.find(i => i.lang === rightLanguage)?.display || ''}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
      {supportLangList?.length && (
        <ChooseLanguage
          leftLanguage={leftLanguage}
          rightLanguage={rightLanguage}
          show={showChooseLanguagePopup}
          onBottomBtnClick={(leftLang, rightLang) => {
            setLeftLanguage(leftLang);
            setRightLanguage(rightLang);
            setShowChooseLanguagePopup(false);
          }}
          onClickOverlay={() => {
            setShowChooseLanguagePopup(false);
          }}
        />
      )}
    </View>
  );
};

export default React.memo(SimultaneousRecording);
