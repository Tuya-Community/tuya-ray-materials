import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, Image } from '@ray-js/components';
import { hideLoading, setKeepScreenOn, showLoading, usePageEvent } from '@ray-js/ray';
import Res from '@/res';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { useSelector } from 'react-redux';
import { useInterval } from 'ahooks';
import { TopBar } from '@/components';
import { tttStartRecord } from '@/api/ttt';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { RecordStatus, selectAudioFileByKey } from '@/redux/modules/audioFileSlice';
import TyNotification from '@ray-js/ty-notification';
import Strings from '@/i18n';
import { convertMillisecondsToTime, matchLanguageWithRegex } from '@/utils';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { AGENTS } from '@/constant';
import { selectUserInfo } from '@/redux/modules/userInfoSlice';
import LangSwitch from '@/components/LangSwitch';
import DoingContent from './component/DoingContent';
import ChooseLanguage from './component/ChooseLanguage';
// @ts-ignore
import styles from './index.module.less';

const SimultaneousRecording: FC<any> = () => {
  const { devId: deviceId, isOnline } = useSelector(selectDevInfo);
  const { topBarHeight, language } = useSelector(selectSystemInfo);
  const { regionCode } = useSelector(selectUserInfo);
  const [duration, setDuration] = useState(0); // 毫秒
  const task = useSelector(selectAudioFileByKey('task'));
  const supportLangList = useSelector(selectUiStateByKey('supportLangList'));
  const isOpusCelt = useSelector(selectUiStateByKey('isOpusCelt'));
  const [leftLanguage, setLeftLanguage] = useState(supportLangList?.[0]?.lang || ''); // 左耳语言
  const [rightLanguage, setRightLanguage] = useState(supportLangList?.[1]?.lang || ''); // 右耳语言
  const [showChooseLanguagePopup, setShowChooseLanguagePopup] = useState(false);

  const [interval, setInterval] = useState<number | undefined>(undefined);
  const clear = useInterval(
    () => {
      setDuration(duration + 1000);
    },
    interval,
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
      if (!rightLanguage) {
        // 右耳为对方使用的语言
        let initRightLang = englishItem ? 'en' : supportLangList?.[1]?.lang;
        if (matchLang) {
          // 左右耳初始语言不同
          initRightLang = supportLangList.filter(({ lang }) => lang !== matchLang)[0].lang;
        }
        setRightLanguage(initRightLang);
      }
    }
  }, [supportLangList, leftLanguage, rightLanguage, language]);

  useEffect(() => {
    if (!task || task?.state === 0) return;
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
        break;
      default:
        break;
    }
    setIsDoing(true);
  }, [task]);

  const checkRecordTask = async () => {
    // 当前存在任务
    if (task) {
      const { userRecordDuration, originalLanguage, targetLanguage } = task;
      setDuration(userRecordDuration);
      setLeftLanguage(originalLanguage);
      setRightLanguage(targetLanguage);
      if (task.state === RecordStatus.RECORDING) {
        setInterval(1000);
      }
    } else {
      setDuration(0);
    }
  };

  usePageEvent('onUnload', () => {
    console.log('onUnload');
    clear();
    setKeepScreenOn({ keepScreenOn: false });
    ty.hideLoading();
  });

  useEffect(() => {
    ty.hideMenuButton();
    setKeepScreenOn({ keepScreenOn: true });
    checkRecordTask();
  }, []);

  const [showBluetoothError, setShowBluetoothError] = useState(false);
  useEffect(() => {
    setShowBluetoothError(!isOnline);
  }, [isOnline]);

  const renderTitle = () => {
    if (task && task.state !== 0) {
      return (
        <View className={styles.topBox}>
          <Text className={styles.topTime}>{convertMillisecondsToTime(duration)}</Text>
        </View>
      );
    }
    return <Text className={styles.title}>{Strings.getLang('title_simultaneous')}</Text>;
  };

  const [isDoing, setIsDoing] = useState(false);
  // 开始1v1录音
  const handleStartRecord = useCallback(async () => {
    if (!isOnline) return;
    try {
      showLoading({ title: Strings.getLang('startTo1v1') });
      const config: any = {
        // 出错时是否要保留音频文件
        saveDataWhenError: true,
        // 录音类型，0呼叫，1会议，2同声传译
        recordType: 2,
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
        originalLanguage: leftLanguage,
        /**
         * 目标语言
         * 会议或者电话模式，表示目标语言
         * 同声传译模式，表示右耳语言
         */
        targetLanguage: rightLanguage,
        // 智能体id 固定，后面具体根据提供的sdk获取agentId。
        agentId: '',
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
      hideLoading();
      setInterval(1000);
      setIsDoing(true);
    } catch (error) {
      ty.showToast({
        title: Strings.getLang('error_simultaneous_recording_start'),
        icon: 'error',
      });
      hideLoading();
    }
  }, [deviceId, isOnline, rightLanguage, leftLanguage]);

  return (
    <View className={styles.main}>
      {/* <Image
        src={task ? Res.imgSimultaneousDoingBg : Res.imgSimultaneousInitBg}
        className={styles.bg}
        mode="aspectFill"
      /> */}
      <TopBar renderTitle={renderTitle} />
      <TyNotification
        show={showBluetoothError}
        top={topBarHeight}
        onClosed={() => setShowBluetoothError(false)}
        text={Strings.getLang('device_offline')}
      />
      {isDoing && task ? (
        <DoingContent />
      ) : (
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
          <View className={styles.startBox}>
            <View className={styles.startBtn} onClick={handleStartRecord}>
              <Image src={Res.recordingActive} className={styles.startIcon} />
            </View>
            <View className={styles.startTip}>{Strings.getLang('simultaneous_click_start')}</View>
          </View>
        </View>
      )}
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
