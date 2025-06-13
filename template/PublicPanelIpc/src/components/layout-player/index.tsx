import React, { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View } from '@ray-js/ray';
import { useDevice, useProps } from '@ray-js/panel-sdk';
import { IPCPlayerIntegration, useStore, EventInstance } from '@ray-js/ipc-player-integration';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import clsx from 'clsx';
import { changePanelInfoState, getDpCodeIsExist, getDevCategory } from '@/utils';
import { PlayerIntegrationContext } from '@/context/playerIntegration';

import Styles from './index.module.less';

export type PlayStatusData = {
  playState: 0 | 1 | 2;
  playCode: number;
};

interface Props {
  listenResolutionBtnClick?: () => void;
}

export const LayoutPlayer = (props: Props) => {
  const devInfo = useDevice(device => device.devInfo);
  const dpState = useProps(d => d);
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  const playerFit = useSelector(selectPanelInfoByKey('playerFit'));
  const { playerIntegrationInstance } = useContext(PlayerIntegrationContext);
  const { screenType } = useStore({ screenType: playerIntegrationInstance.screenType });
  const eventRef = useRef<EventInstance>();
  const { listenResolutionBtnClick } = props;
  /**
   * 监听播放器状态
   */
  const onPlayStatus = (value: PlayStatusData) => {
    changePanelInfoState('isPreviewOn', value.playState === 1);
  };

  useEffect(() => {
    eventRef.current.on('resolutionBtnControlClick', listenResolutionBtnClick);
    return () => {
      eventRef.current.off('resolutionBtnControlClick', listenResolutionBtnClick);
    };
  }, [listenResolutionBtnClick]);

  return (
    <View className={clsx(Styles.playerContainer)}>
      <IPCPlayerIntegration
        instance={playerIntegrationInstance}
        className={clsx(Styles.comContainer)}
        devId={devInfo.devId}
        eventRef={eventRef}
        onPlayStatus={onPlayStatus}
        privateState={dpState.basic_private || false}
        deviceOnline={devInfo.isOnline}
        style={{
          height:
            screenType === 'vertical'
              ? playerFit === 'contain'
                ? `calc(100vw * 0.56)`
                : '400px'
              : '100vh',
        }}
        brandColor={brandColor}
        verticalMic={false}
        playerFit={playerFit}
        landscapeMode="standard"
        extend={{
          ptzControllable: getDpCodeIsExist('ptz_control'),
        }}
      />
    </View>
  );
};
