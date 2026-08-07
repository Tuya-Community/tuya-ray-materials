import React, { useMemo, FC } from 'react';
import { View, Text } from '@ray-js/components';
import { router, showToast } from '@ray-js/ray';
import { useDebounceFn } from 'ahooks';
import clsx from 'clsx';

import Strings from '@/i18n';
import { selectAudioFileByKey, RecordStatus } from '@/redux/modules/audioFileSlice';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { RecordMode } from '@/constant/enums';
import { updateMode } from '@/redux/modules/recordConfigSlice';
import { useDispatch } from 'react-redux';
import { getDeviceList } from '@/redux/modules/deviceListSlice';
import { useSelector } from '@/redux';
import { tttImportAudio } from '@/api/ttt';

// @ts-ignore
import styles from './index.module.less';

interface IProps {
  className?: string;
  isImporting: boolean;
}

const Index: FC<IProps> = ({ className, isImporting }) => {
  const task = useSelector(selectAudioFileByKey('task'));
  const deviceList = useSelector(getDeviceList);
  const dispatch = useDispatch();

  const modes = useMemo(() => {
    const data = [
      {
        name: Strings.getLang('mode_title_meeting_recording'),
        key: RecordMode.liveRecording,
        icon: 'modeLiveRecordIcon',
        eventKey: 'record',
      },
      {
        name: Strings.getLang('mode_title_live_trans'),
        key: RecordMode.realTimeRecording,
        icon: 'modeTransIcon',
        eventKey: 'realtime',
      },
      {
        name: Strings.getLang('mode_title_realtime_recording'),
        key: RecordMode.simultaneousInterpretation,
        icon: 'modeSimIcon',
        eventKey: 'translate',
      },
      {
        name: Strings.getLang('mode_title_faceToFace_recording'),
        key: RecordMode.faceToFaceTranslation,
        icon: 'modeF2fIcon',
        eventKey: 'facetoface',
      },
      {
        name: Strings.getLang('mode_title_import_audio'),
        key: RecordMode.importAudio,
        icon: 'modeImportIcon',
        eventKey: 'import',
      },
      {
        name: Strings.getLang('mode_title_call_recording'),
        key: RecordMode.phoneRecording,
        icon: 'modeCallIcon',
        eventKey: 'devices',
      },
    ];
    // 单设备面板：仅当面板设备为专业版时展示通话录音
    if (deviceList.find(item => item.customDevType === 'pro_version')) {
      return data;
    }
    return data.filter(item => item.key !== RecordMode.phoneRecording);
  }, [deviceList]);

  const isRecording = useMemo(() => {
    return task
      ? task.state === RecordStatus.RECORDING || task.state === RecordStatus.PAUSE
      : false;
  }, [task]);

  // 模式点击
  const handleSetMode = async (mode: { key: RecordMode; eventKey?: string; isNew?: boolean }) => {
    if (isRecording) return;
    const { key: modeKey } = mode;

    switch (modeKey) {
      case RecordMode.faceToFaceTranslation: {
        router.push('/faceToFace?fromType=home');
        break;
      }
      case RecordMode.importAudio: {
        if (isImporting) {
          showToast({ title: Strings.getLang('audio_importing_warn'), icon: 'none' });
          break;
        }
        await tttImportAudio();
        break;
      }
      case RecordMode.liveRecording:
      case RecordMode.phoneRecording:
      case RecordMode.realTimeRecording:
      case RecordMode.simultaneousInterpretation: {
        dispatch(updateMode(modeKey));
        router.push('/recordingMode?fromType=mp_home_button');
        break;
      }
      default: {
        dispatch(updateMode(modeKey));
        break;
      }
    }
  };

  const { run: handleModeClick } = useDebounceFn(handleSetMode, {
    wait: 500,
    leading: true,
    trailing: false,
  });

  return (
    <View className={clsx(styles.container, className)}>
      {modes.map(mode => (
        <View
          key={mode.key}
          className={`${isRecording ? `${styles.modeItem} ${styles.disabled}` : styles.modeItem}`}
          onClick={() => handleModeClick(mode)}
        >
          <ThemedImage imageName={mode.icon} className={styles.icon} src={Res[mode.icon]} />
          <View className={styles.modeTextBox}>
            <Text className={styles.name}>{mode.name}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Index;
