import { Text, View } from '@ray-js/ray';
import React, { FC, useEffect, useState } from 'react';
import { Icon } from '@ray-js/smart-ui';
import {
  iconIpcAlbum,
  iconIpcFullScreen,
  iconIpcMic,
  iconIpcMore,
  iconIpcPlayback,
  iconIpcRecord,
  iconIpcSnapshot,
  iconIpcSpeakerOff,
  iconIpcSpeakerOn,
} from '@/res/iconsvg';
import {
  goToAlbum,
  goToPlayback,
  holdUp,
  openPanelApp,
  setMute,
  setOrientation,
  setRecord,
  setTalk,
  showToast,
  snapshot,
} from '@/utils/ipc';
import { useDispatch, useSelector } from 'react-redux';
import { selectIpcCommonValue, updateIpcCommon } from '@/redux/modules/ipcCommonSlice';
import clsx from 'clsx';
import { useActions } from '@ray-js/panel-sdk';
import Strings from '@/i18n';

import { modeCode } from '@/constant/dpCodes';
import styles from './index.module.less';

const Tools: FC = () => {
  const dispatch = useDispatch();
  const actions = useActions();
  // 部分操作三秒之内不可进行操作
  const [buttonDisabled, setButtonDisabled] = useState(false); // 录制按钮是否可点击
  const isRecording = useSelector(selectIpcCommonValue('isRecording'));
  const isTwoTalking = useSelector(selectIpcCommonValue('isTwoTalking'));
  const isMute = useSelector(selectIpcCommonValue('isMute'));
  const isFull = useSelector(selectIpcCommonValue('isFull'));

  useEffect(() => {
    if (buttonDisabled) {
      setTimeout(() => {
        setButtonDisabled(false);
      }, 3 * 1000);
    }
  }, [buttonDisabled]);

  const handleRecord = () => {
    if (buttonDisabled) return;

    setRecord(isRecording).then(() => {
      if (!isRecording) {
        setButtonDisabled(true);
      }
    });
  };

  const handleTalk = () => {
    setTalk(!isTwoTalking).then(() => {
      if (!isTwoTalking) {
        setButtonDisabled(true);
      }

      dispatch(updateIpcCommon({ isTwoTalking: !isTwoTalking }));

      if (isTwoTalking) {
        showToast('ipc_inter_end_call', 'none');
      }
    });
  };

  const handleMute = () => {
    setMute(!isMute);
  };

  const handleIpcSetting = () => {
    if (!holdUp()) {
      openPanelApp();
    }
  };

  const handleFullScreen = () => {
    actions[modeCode].set('manual');

    setOrientation(2);
  };

  return (
    <View className={clsx(styles.tools, isFull && 'hide')}>
      <View className={styles.item} onClick={snapshot}>
        <Icon name={iconIpcSnapshot} size="64rpx" />
        <Text className={styles.text}>{Strings.getLang('ipc_feature_snapshot')}</Text>
      </View>
      <View className={clsx(styles.item, buttonDisabled && styles.disabled)} onClick={handleRecord}>
        {isRecording ? (
          <View className={styles.recordingWrapper}>
            <View className={styles.recording} />
          </View>
        ) : (
          <Icon name={iconIpcRecord} size="64rpx" />
        )}
        <Text className={styles.text}>{Strings.getLang('ipc_feature_record')}</Text>
      </View>
      <View className={styles.item} onClick={goToAlbum}>
        <Icon name={iconIpcAlbum} size="64rpx" />
        <Text className={styles.text}>{Strings.getLang('ipc_feature_album')}</Text>
      </View>
      <View className={styles.item} onClick={handleFullScreen}>
        <Icon name={iconIpcFullScreen} size="64rpx" />
        <Text className={styles.text}>{Strings.getLang('ipc_feature_fullscreen')}</Text>
      </View>
      <View className={styles.item} onClick={handleMute}>
        <Icon name={isMute ? iconIpcSpeakerOff : iconIpcSpeakerOn} size="64rpx" />
        <Text className={styles.text}>{Strings.getLang('ipc_feature_speaker')}</Text>
      </View>
      <View className={clsx(styles.item, buttonDisabled && styles.disabled)} onClick={handleTalk}>
        <Icon name={iconIpcMic} size="64rpx" color={isTwoTalking ? '#ff4444' : '#333'} />
        <Text className={styles.text}>{Strings.getLang('ipc_feature_talk')}</Text>
      </View>
      <View className={styles.item} onClick={goToPlayback}>
        <Icon name={iconIpcPlayback} size="64rpx" />
        <Text className={styles.text}>{Strings.getLang('ipc_feature_playback')}</Text>
      </View>
      <View className={styles.item} onClick={handleIpcSetting}>
        <Icon name={iconIpcMore} size="64rpx" />
        <Text className={styles.text}>{Strings.getLang('ipc_feature_more')}</Text>
      </View>
    </View>
  );
};

export default Tools;
