import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CoverView, Image, View, usePageEvent } from '@ray-js/ray';
import { useDispatch, useSelector } from 'react-redux';
import { selectIpcCommonValue, updateIpcCommon } from '@/redux/modules/ipcCommonSlice';
import { useDevice, useProps } from '@ray-js/panel-sdk';
import { IpcPlayer } from '@ray-js/components-ty-ipc';
import { videoClarityObj } from '@/config/home';
import {
  goToAlbum,
  setMute,
  setOrientation,
  setRecord,
  snapshot,
  subStatusToMain,
  setTalk,
  showToast,
} from '@/utils/ipc';
import clsx from 'clsx';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import RecordTip from '@/components/RecordTip';
import Timer from '@/components/Timer';
import { Icon } from '@ray-js/smart-ui';
import { iconAngleLeft, iconExitFullScreen } from '@/res/iconsvg';
import { getCdnPath } from '@/utils';
import styles from './index.module.less';
import Game from './Game';
import Status from './Status';

const Player: FC = () => {
  const dispatch = useDispatch();
  const { devId, isOnline } = useDevice(device => device.devInfo);
  const dpBasicPrivate = useProps(props => props.basic_private);
  const screenWidth = useSelector(selectSystemInfoByKey('screenWidth'));
  const isRecording = useSelector(selectIpcCommonValue('isRecording'));
  const recordSuccess = useSelector(selectIpcCommonValue('recordSuccess'));
  const isFull = useSelector(selectIpcCommonValue('isFull'));
  const fullPlayer = useSelector(selectIpcCommonValue('fullPlayer'));
  const isTwoTalking = useSelector(selectIpcCommonValue('isTwoTalking'));
  const isMute = useSelector(selectIpcCommonValue('isMute'));
  const isPreview = useSelector(selectIpcCommonValue('isPreview'));
  const mainDeviceCameraConfig = useSelector(selectIpcCommonValue('mainDeviceCameraConfig'));
  const showFullButton = useSelector(selectIpcCommonValue('showFullButton'));

  const [playerLayout, setPlayerLayout] = useState(0); // 播放器更新尺寸
  const [btnDisabled, setBtnDisabled] = useState(false); // 按钮是否可点击
  const [btnsVisible, setBtnsVisible] = useState(false); // 非全屏按钮组
  const btnsVisibleTimer = useRef<NodeJS.Timeout>(null);

  const showIpcBtnNotFull = btnsVisible && isPreview && !fullPlayer;
  const showIpcBtnFull = showFullButton && isPreview && fullPlayer;

  useLayoutEffect(() => {
    setTimeout(() => {
      setPlayerLayout(Date.now());
    }, 0);
  }, [fullPlayer]);

  useEffect(() => {
    if (btnsVisible) {
      btnsVisibleTimer.current && clearTimeout(btnsVisibleTimer.current);
      btnsVisibleTimer.current = setTimeout(() => {
        setBtnsVisible(false);
      }, 5000);
    }
  }, [btnsVisible]);

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
    if (!fullPlayer) {
      setBtnsVisible(!btnsVisible);
    } else {
      dispatch(updateIpcCommon({ showFullButton: !showFullButton }));
    }
  };

  const handleFullScreen = e => {
    e.origin.stopPropagation();
    setOrientation(2);
  };

  const handleExitFullScreen = e => {
    e?.origin?.stopPropagation();
    setOrientation(1);
  };

  const handleScreenshot = e => {
    e.origin.stopPropagation();
    snapshot();
  };

  const handleRecord = e => {
    e.origin.stopPropagation();
    if (btnDisabled) return;

    setRecord(isRecording).then(() => {
      if (!isRecording) {
        setBtnDisabled(true);

        setTimeout(() => {
          setBtnDisabled(false);
        }, 3000);
      }
    });
  };

  const handleTalk = e => {
    e.origin.stopPropagation();
    setTalk(!isTwoTalking).then(() => {
      if (!isTwoTalking) {
        setBtnDisabled(true);
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
      className={clsx(styles.container, fullPlayer && styles.full)}
      id="playWrap"
      style={{ height: fullPlayer ? `${screenWidth}px` : '' }}
    >
      <View className={styles['player-wrapper']}>
        <IpcPlayer
          objectFit="contain"
          defaultMute={isMute}
          devId={devId}
          onlineStatus={isOnline}
          updateLayout={`${playerLayout}`}
          scalable={false}
          onChangeStreamStatus={handleChangeStreamStatus}
          onCtx={handleCtx}
          onPlayerTap={handlePlayerClick}
          clarity={videoClarityObj[mainDeviceCameraConfig.videoClarity]}
          privateState={dpBasicPrivate ?? false}
          // playerStyle={{ borderRadius: 20 }}
        />
      </View>

      {/* 录制成功提示 */}
      <CoverView
        className={styles['record-tip-wrapper']}
        style={{ display: recordSuccess ? '' : 'none' }}
      >
        <RecordTip />
      </CoverView>

      {/* 录制计时组件 */}
      <View className={styles['timer-wrapper']} style={{ display: isRecording ? '' : 'none' }}>
        <Timer />
      </View>

      {/* 非全屏 - 右上角 */}
      {!fullPlayer && (
        <CoverView
          className={styles['top-right-cover']}
          style={{
            display: recordSuccess ? 'none' : 'flex',
          }}
        >
          <View className={clsx(styles['top-right'], showIpcBtnNotFull && styles.visible)}>
            <View
              className={styles['icon-item']}
              hoverClassName="touchable"
              onClick={handleFullScreen}
            >
              <Image src={getCdnPath('fullscreen.png')} className={styles.icon} />
            </View>
          </View>
        </CoverView>
      )}

      {/* 非全屏 - 底部按钮组 */}
      {!fullPlayer && (
        <CoverView className={styles['bottom-cover']}>
          <View className={clsx(styles.bottom, showIpcBtnNotFull && styles.visible)}>
            <View
              className={styles['icon-wrapper']}
              hoverClassName="touchable"
              onClick={handleScreenshot}
            >
              <Image src={getCdnPath('screenshot.png')} className={styles.icon} />
            </View>
            <View
              className={clsx(styles['icon-wrapper'], btnDisabled && styles.disabled)}
              hoverClassName="touchable"
              onClick={handleRecord}
            >
              {isRecording ? (
                <View className={styles.recording} />
              ) : (
                <Image src={getCdnPath('recordVideo.png')} className={styles.icon} />
              )}
            </View>
            <View
              className={styles['icon-wrapper']}
              hoverClassName="touchable"
              onClick={handleTalk}
            >
              <Image src={getCdnPath('mic.png')} className={styles.icon} />
            </View>
            <View
              className={styles['icon-wrapper']}
              hoverClassName="touchable"
              onClick={handleMute}
            >
              <Image
                src={isMute ? getCdnPath('speaker.png') : getCdnPath('speakerOn.png')}
                className={styles.icon}
              />
            </View>
            <View
              className={styles['icon-wrapper']}
              hoverClassName="touchable"
              onClick={handleAlbum}
            >
              <Image src={getCdnPath('album.png')} className={styles.icon} />
            </View>
          </View>
        </CoverView>
      )}

      {/* 全屏 - 左上角 */}
      {fullPlayer && (
        <CoverView className={styles['fullscreen-top-left-cover']}>
          <View
            className={clsx(
              styles['fullscreen-top-left-wrapper'],
              showIpcBtnFull && styles.visible
            )}
            onClick={handleExitFullScreen}
          >
            <Icon name={iconAngleLeft} color="#fff" size="0.64rem" />
            <Status />
          </View>
        </CoverView>
      )}

      {/* 全屏 - 左下角 */}
      {fullPlayer && (
        <CoverView className={styles['fullscreen-bottom-left-cover']}>
          <View
            className={clsx(
              styles['fullscreen-bottom-left-wrapper'],
              showIpcBtnFull && styles.visible
            )}
          >
            <Icon
              name={iconExitFullScreen}
              color="#fff"
              size="0.72rem"
              onClick={handleExitFullScreen}
              customStyle={{ marginRight: '0.56rem' }}
            />
          </View>
        </CoverView>
      )}

      {/* 全屏 - 右侧按钮组 */}
      {fullPlayer && (
        <CoverView className={styles['fullscreen-right-cover']}>
          <View
            className={clsx(styles['fullscreen-right-wrapper'], showIpcBtnFull && styles.visible)}
          >
            <View
              className={styles['icon-wrapper']}
              hoverClassName="touchable"
              onClick={handleScreenshot}
            >
              <Image src={getCdnPath('screenshot.png')} className={styles.icon} />
            </View>
            <View
              className={clsx(styles['icon-wrapper'], btnDisabled && styles.disabled)}
              hoverClassName="touchable"
              onClick={handleRecord}
            >
              {isRecording ? (
                <View className={styles.recording} />
              ) : (
                <Image src={getCdnPath('recordVideo.png')} className={styles.icon} />
              )}
            </View>
            <View
              className={styles['icon-wrapper']}
              hoverClassName="touchable"
              onClick={handleTalk}
            >
              <Image src={getCdnPath('mic.png')} className={styles.icon} />
            </View>
            <View
              className={styles['icon-wrapper']}
              hoverClassName="touchable"
              onClick={handleMute}
            >
              <Image
                src={isMute ? getCdnPath('speaker.png') : getCdnPath('speakerOn.png')}
                className={styles.icon}
              />
            </View>
            <View
              className={styles['icon-wrapper']}
              hoverClassName="touchable"
              onClick={handleAlbum}
            >
              <Image src={getCdnPath('album.png')} className={styles.icon} />
            </View>
          </View>
        </CoverView>
      )}

      {fullPlayer && <Game visible={showIpcBtnFull} />}
    </View>
  );
};

export default Player;
