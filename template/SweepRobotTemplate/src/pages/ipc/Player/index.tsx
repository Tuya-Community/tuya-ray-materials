import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CoverView, Text, View, usePageEvent } from '@ray-js/ray';
import { useDispatch, useSelector } from 'react-redux';
import { useActions, useDevice, useProps } from '@ray-js/panel-sdk';
import { IpcPlayer } from '@ray-js/components-ty-ipc';
import { Icon } from '@ray-js/smart-ui';
import { selectIpcCommonValue, updateIpcCommon } from '@/redux/modules/ipcCommonSlice';
import {
  goToAlbum,
  setMute,
  setOrientation,
  setRecord,
  setTalk,
  showToast,
  snapshot,
  subStatusToMain,
} from '@/utils/ipc';
import clsx from 'clsx';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { VIDEO_CLARIFY } from '@/constant';
import IpcRecordTip from '@/components/IpcRecordTip';
import IpcRecordTimer from '@/components/IpcRecordTimer';
import {
  iconExitFullScreen,
  iconIpcAlbum,
  iconIpcMic,
  iconIpcRecord,
  iconIpcSnapshot,
  iconIpcSpeakerOff,
  iconIpcSpeakerOn,
} from '@/res/iconsvg';
import { BasicPrivateCode, directionControlCode } from '@/constant/dpCodes';
import Strings from '@/i18n';

import ManualPanel from '@/components/ManualPanel';
import styles from './index.module.less';

const Player: FC = () => {
  const actions = useActions();
  const dispatch = useDispatch();
  const { devId, isOnline } = useDevice(device => device.devInfo);
  const dpBasicPrivate = useProps(props => props[BasicPrivateCode]);
  const screenWidth = useSelector(selectSystemInfoByKey('screenWidth'));
  const isRecording = useSelector(selectIpcCommonValue('isRecording'));
  const recordSuccess = useSelector(selectIpcCommonValue('recordSuccess'));
  const isFull = useSelector(selectIpcCommonValue('isFull'));
  const isTwoTalking = useSelector(selectIpcCommonValue('isTwoTalking'));
  const isMute = useSelector(selectIpcCommonValue('isMute'));
  const isPreview = useSelector(selectIpcCommonValue('isPreview'));
  const mainDeviceCameraConfig = useSelector(selectIpcCommonValue('mainDeviceCameraConfig'));
  const showFullButton = useSelector(selectIpcCommonValue('showFullButton'));

  const [playerLayout, setPlayerLayout] = useState(0); // 播放器更新尺寸
  const [buttonDisabled, setButtonDisabled] = useState(false); // 按钮是否可点击
  const [btnsVisible, setBtnsVisible] = useState(false); // 非全屏按钮组
  const btnsVisibleTimer = useRef<NodeJS.Timeout>(null);

  const showIpcBtnFull = showFullButton && isPreview && isFull;

  useLayoutEffect(() => {
    setTimeout(() => {
      setPlayerLayout(Date.now());
    }, 0);
  }, [isFull]);

  useEffect(() => {
    if (btnsVisible) {
      btnsVisibleTimer.current && clearTimeout(btnsVisibleTimer.current);
      btnsVisibleTimer.current = setTimeout(() => {
        setBtnsVisible(false);
      }, 5000);
    }
  }, [btnsVisible]);

  useEffect(() => {
    if (buttonDisabled) {
      setTimeout(() => {
        setButtonDisabled(false);
      }, 3 * 1000);
    }
  }, [buttonDisabled]);

  usePageEvent('onHide', async () => {
    // 页面隐藏，更新对讲、录制UI

    dispatch(updateIpcCommon({ isOneTalking: false }));
    dispatch(updateIpcCommon({ isTwoTalking: false }));
    dispatch(updateIpcCommon({ isRecording: false }));
    dispatch(updateIpcCommon({ isPreview: false }));
  });

  const handleChangeStreamStatus = (data: number) => {
    subStatusToMain(data);
  };

  const handleCtx = ctx => {
    dispatch(updateIpcCommon({ playerCtx: ctx }));
  };

  const handlePlayerClick = () => {
    if (!isFull) {
      setBtnsVisible(!btnsVisible);
    } else {
      dispatch(updateIpcCommon({ showFullButton: !showFullButton }));
    }
  };

  const handleExitFullScreen = e => {
    e?.origin?.stopPropagation();
    actions[directionControlCode].set('exit');
    setOrientation(1);
  };

  const handleScreenshot = e => {
    e.origin.stopPropagation();
    snapshot();
  };

  const handleRecord = e => {
    e.origin.stopPropagation();
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

  const handleMute = e => {
    e.origin.stopPropagation();
    setMute(!isMute);
  };

  const handleAlbum = e => {
    e.origin.stopPropagation();
    goToAlbum();
  };

  return (
    <View
      className={clsx(styles.container, isFull && styles.full)}
      id="playWrap"
      style={{ height: isFull ? `${screenWidth}px` : '' }}
    >
      <View className={styles.playerWrapper}>
        {playerLayout ? (
          <IpcPlayer
            objectFit="contain"
            defaultMute={isMute}
            devId={devId}
            onlineStatus={isOnline}
            updateLayout={`${playerLayout}`}
            // scalable={false}
            onChangeStreamStatus={handleChangeStreamStatus}
            onCtx={handleCtx}
            onPlayerTap={handlePlayerClick}
            clarity={VIDEO_CLARIFY[mainDeviceCameraConfig.videoClarity]}
            privateState={dpBasicPrivate ?? false}
            // extend={{
            //   autoPauseIfNavigate: true,
            //   autoPauseIfOpenNative: true,
            // }}
          />
        ) : null}
      </View>

      {/* 录制成功提示 */}
      <CoverView
        className={styles.recordTipWrapper}
        style={{ display: recordSuccess ? '' : 'none' }}
      >
        <IpcRecordTip />
      </CoverView>

      {/* 录制计时组件 */}
      <View className={styles.timerWrapper} style={{ display: isRecording ? '' : 'none' }}>
        <IpcRecordTimer />
      </View>

      {/* 双向对讲提示组件 */}
      <View style={{ display: isTwoTalking ? '' : 'none' }} className={styles.twoTalking}>
        <Text>{Strings.getLang('ipc_bottom_two_talking')}</Text>
      </View>

      {/* 全屏 - 左下角 */}
      {isFull && (
        <CoverView className={styles.fullscreenBottomLeftCover}>
          <View
            className={clsx(styles.fullscreenBottomLeftWrapper, showIpcBtnFull && styles.visible)}
          >
            <ManualPanel panelSize="2.64rem" iconSize="0.4rem" gap="0.04rem" showCenter={false} />
          </View>
        </CoverView>
      )}

      {/* 全屏 - 右侧按钮组 */}
      {isFull && (
        <CoverView className={styles.fullscreenRightCover}>
          <View className={clsx(styles.fullscreenRightWrapper, showIpcBtnFull && styles.visible)}>
            <View
              className={styles.iconWrapper}
              hoverClassName="touchable"
              onClick={handleScreenshot}
            >
              <Icon name={iconIpcSnapshot} size="0.64rem" color="#fff" />
            </View>
            <View
              className={clsx(styles.iconWrapper, buttonDisabled && styles.disabled)}
              hoverClassName="touchable"
              onClick={handleRecord}
            >
              {isRecording ? (
                <View className={styles.recording} />
              ) : (
                <Icon name={iconIpcRecord} size="0.64rem" color="#fff" />
              )}
            </View>
            <View
              className={clsx(styles.iconWrapper, buttonDisabled && styles.disabled)}
              hoverClassName="touchable"
              onClick={handleTalk}
            >
              <Icon name={iconIpcMic} size="0.64rem" color={isTwoTalking ? '#ff4444' : '#fff'} />
            </View>
            <View className={styles.iconWrapper} hoverClassName="touchable" onClick={handleMute}>
              <Icon
                name={isMute ? iconIpcSpeakerOff : iconIpcSpeakerOn}
                size="0.64rem"
                color="#fff"
              />
            </View>
            <View className={styles.iconWrapper} hoverClassName="touchable" onClick={handleAlbum}>
              <Icon name={iconIpcAlbum} size="0.64rem" color="#fff" />
            </View>
            <View
              className={styles.iconWrapper}
              hoverClassName="touchable"
              onClick={handleExitFullScreen}
            >
              <Icon name={iconExitFullScreen} color="#fff" size="0.64rem" />
            </View>
          </View>
        </CoverView>
      )}
    </View>
  );
};

export default Player;
