import { router } from '@ray-js/ray';
import React, { useMemo } from 'react';
import { View } from '@ray-js/components';

import LottieRender from '@/components/LottieRender';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { useDispatch } from 'react-redux';
import { RecordMode } from '@/constant/enums';
import { updateUiState } from '@/redux/modules/uiStateSlice';
import { selectAudioFileByKey, RecordStatus } from '@/redux/modules/audioFileSlice';
import { updateMode } from '@/redux/modules/recordConfigSlice';
import { getStorageLastModePath } from '@/utils';
import { useSelector } from '@/redux';
import { recordingLottieData } from '@/constant/lottie';
// @ts-ignore
import styles from './index.module.less';

const ControlBar = () => {
  const modePath = getStorageLastModePath();
  const { isCall } = useSelector(state => state?.recordConfig);
  const task = useSelector(selectAudioFileByKey('task'));
  const dispatch = useDispatch();

  const isRecording = useMemo(() => {
    return task
      ? task.state === RecordStatus.RECORDING || task.state === RecordStatus.PAUSE
      : false;
  }, [task]);

  const handleToRecord = () => {
    let modeKey = RecordMode.liveRecording;
    if (isRecording) {
      // 代表不是路径
      if (!modePath?.startsWith('/')) {
        // 如果是电话模式，但是mode是现场录音代表是外部快捷方式进入，需要订正
        modeKey =
          isCall && modePath === RecordMode.liveRecording
            ? RecordMode.phoneRecording
            : (modePath as RecordMode);
      }
    }
    dispatch(updateUiState({ currTab: 'history' }));
    dispatch(updateMode(modeKey));
    router.push('/recordingMode?fromType=mp_home_button');
  };

  return (
    <>
      <View className={styles.container} id="home-control-bar">
        <View className={styles.fab} onClick={handleToRecord}>
          <View className={styles.fabContent}>
            <View
              className={styles.fabOverlay}
              style={{
                opacity: isRecording ? 1 : 0,
                pointerEvents: isRecording ? 'auto' : 'none',
              }}
            >
              <LottieRender
                canvasId="recording-canvas"
                lottieData={recordingLottieData}
                style={{ transform: 'scale(0.4)' }}
                status={task?.state !== RecordStatus.RECORDING ? 'stop' : 'play'}
              />
            </View>
            <View
              className={styles.fabOverlay}
              style={{
                opacity: isRecording ? 0 : 1,
                pointerEvents: isRecording ? 'none' : 'auto',
              }}
            >
              <ThemedImage
                imageName="voiceBtnIcon"
                className={styles.voiceBtn}
                src={Res.voiceBtnIcon}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default React.memo(ControlBar);
