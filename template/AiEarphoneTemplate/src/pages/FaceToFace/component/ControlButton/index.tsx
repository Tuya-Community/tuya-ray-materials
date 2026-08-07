import React, { useEffect, useMemo } from 'react';
import { View } from '@ray-js/components';
import { Button, Icon } from '@ray-js/smart-ui';
import clsx from 'clsx';

import LottieRender from '@/components/LottieRender';
import EllipsisText from '@/components/EllipsisText';
import ThemedImage from '@/components/ThemedImage';
import ThemedIcon from '@/components/ThemedIcon';

import Res from '@/res';
import { RecordStatus, selectAudioFileByKey } from '@/redux/modules/audioFileSlice';
import { ACTIVE_RECORDING_COLORS } from '@/constant';
import { useSelector } from '@/redux';
import Strings from '@/i18n';
import pauseIcon from '@tuya-miniapp/icons/dist/svg/Pause';
import recordingLottie from '@/res/lottie/recording.json';
import { modifyLottieColor } from '@/utils/lottie';
import { getSupportLangText } from '@/utils/lang';
import { FTFTabType } from '../..';

import styles from './index.module.less';

interface IProps {
  mode: FTFTabType;
  leftLanguage: string;
  rightLanguage: string;
  isPro: boolean;
  autoSpeek: boolean;
  handleOptionClick: (type: 'left' | 'right') => void;
  handleSwapLang: () => void;
  handleChangeAutoSpeek: () => void;
  handleAutoStart: () => void;
  handlePauseRecord: () => void;
  handleStopRecord: () => void;
  handleProStartRecord: () => void;
  handleLeftStart: () => void;
  handleRightStart: () => void;
  activeType: string;
}
const ControlButton: React.FC<IProps> = ({
  mode,
  leftLanguage,
  rightLanguage,
  isPro,
  autoSpeek,
  handleOptionClick,
  handleSwapLang,
  handleChangeAutoSpeek,
  handleAutoStart,
  handlePauseRecord,
  handleLeftStart,
  handleRightStart,
  handleProStartRecord,
  handleStopRecord,
  activeType,
}) => {
  const { regionCode } = useSelector(state => state.userInfo);
  const task = useSelector(selectAudioFileByKey('task'));
  // 与实时转写一致：进行中优先 taskState；否则用 task.state（面对面若曾被标成外部分，真实态在 sourceTaskState）
  const taskState = useSelector(selectAudioFileByKey('taskState'));
  const recordState =
    taskState === RecordStatus.RECORDING || taskState === RecordStatus.PAUSE
      ? taskState
      : task?.sourceTaskState ?? task?.state;

  useEffect(() => {
    console.warn('[FTF-RecordDebug][ControlButton UI]', {
      recordState,
      taskState,
      activeType,
      isPro,
      task: task
        ? {
            state: task.state,
            sourceTaskState: task.sourceTaskState,
            businessType: task.businessType,
            recordType: task.recordType,
          }
        : null,
    });
  }, [recordState, taskState, activeType, isPro, task]);

  // 根据 activeType 动态修改 Lottie 动画颜色
  const recordingLottieData = useMemo(() => {
    if (!activeType) return undefined;
    // 获取目标颜色
    const targetColor = ACTIVE_RECORDING_COLORS[activeType as keyof typeof ACTIVE_RECORDING_COLORS];

    // 使用工具函数修改 Lottie 颜色（自动识别颜色格式）
    return modifyLottieColor(recordingLottie, targetColor);
  }, [activeType]);

  return (
    <View className={styles.buttonWrapper} id="record-btn-wrapper">
      <View className={styles.langBox}>
        <Button customClass={styles.langBtn} onClick={() => handleOptionClick('left')}>
          {mode === FTFTabType.PhoneEar && (
            <ThemedImage
              imageName="phoneGreenPng"
              src={Res.phoneGreenPng}
              className={styles.deviceIcon}
            />
          )}
          <EllipsisText
            className={styles.langText}
            text={getSupportLangText(leftLanguage)}
            numberOfLines={1}
          />
        </Button>

        {regionCode !== 'AY' && !isPro && mode !== FTFTabType.PhoneEar ? (
          <View onClick={handleChangeAutoSpeek}>
            <ThemedImage
              className={styles.transIcon}
              imageName={autoSpeek ? 'onAutoSpeekIcon' : 'offAutoSpeekIcon'}
              src={Res[autoSpeek ? 'onAutoSpeekIcon' : 'offAutoSpeekIcon']}
            />
          </View>
        ) : (
          <View onClick={handleSwapLang}>
            <ThemedImage
              imageName="imgTransIcon"
              className={styles.transIcon}
              src={Res.imgTransIcon}
            />
          </View>
        )}

        <Button customClass={styles.langBtn} onClick={() => handleOptionClick('right')}>
          {mode === FTFTabType.PhoneEar && (
            <ThemedImage
              imageName="basicActiveIcon"
              src={Res.basicActiveIcon}
              className={styles.deviceIcon}
            />
          )}
          <EllipsisText
            className={styles.langText}
            text={getSupportLangText(rightLanguage)}
            numberOfLines={1}
          />
        </Button>
      </View>

      {isPro ? (
        <View className={styles.proButton}>
          <View className={styles.mode} />
          <Button
            onClick={handleProStartRecord}
            customClass={clsx(styles.common, {
              [styles.start]:
                recordState === RecordStatus.UNKNOWN ||
                recordState == null ||
                recordState === RecordStatus.FINISH,
              [styles.stop]: recordState === RecordStatus.RECORDING,
              [styles.resume]: recordState === RecordStatus.PAUSE,
            })}
          >
            <View className={styles.inner}>
              {(recordState === RecordStatus.UNKNOWN ||
                recordState == null ||
                recordState === RecordStatus.FINISH) && <View className={styles.icon} />}
              {recordState === RecordStatus.RECORDING && (
                <Icon name={pauseIcon} className={styles.icon} />
              )}
              {recordState === RecordStatus.PAUSE && Strings.getLang('ftf_resume')}
            </View>
          </Button>
          <View className={styles.save} onClick={handleStopRecord}>
            <ThemedIcon iconName="saveSvg" name={Res.saveSvg} className={styles.icon} />
            {Strings.getLang('save')}
          </View>
        </View>
      ) : (
        <View className={styles.basicButton}>
          {recordState === RecordStatus.RECORDING && recordingLottieData ? (
            <View
              id="faceToFace-pause"
              className={styles.recordingAnimBox}
              onClick={handlePauseRecord}
            >
              <LottieRender
                canvasId="recording-canvas"
                lottieData={recordingLottieData}
                style={{ transform: 'scale(0.4)' }}
                status="play"
              />
            </View>
          ) : autoSpeek ? (
            <View className={styles.autoBox}>
              <Button customClass={styles.button} onClick={handleAutoStart}>
                <ThemedImage
                  imageName="autoSpeekIcon"
                  src={Res.autoSpeekIcon}
                  className={styles.icon}
                />
              </Button>
            </View>
          ) : (
            <View className={styles.default}>
              <Button
                id="faceToface-left-start"
                customClass={styles.button}
                onClick={handleLeftStart}
              >
                <ThemedImage
                  imageName="speakerGreenPng"
                  src={Res.speakerGreenPng}
                  className={styles.icon}
                />
              </Button>

              <Button
                id="faceToface-right-start"
                customClass={styles.button}
                onClick={handleRightStart}
              >
                <ThemedImage
                  imageName="speakerBluePng"
                  src={Res.speakerBluePng}
                  className={styles.icon}
                />
              </Button>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ControlButton;
