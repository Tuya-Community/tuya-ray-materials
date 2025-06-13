import React, { useContext } from 'react';
import { View } from '@ray-js/ray';
import { PlayerIntegrationContext } from '@/context/playerIntegration';
import { Widgets } from '@ray-js/ipc-player-integration';

import Styles from './index.module.less';

type Props = {
  className?: string;
  mode?: string;
  iconClassName?: string;
  intercomClassName?: string;
  talkingColor?: string;
  widthScale?: number;
  heightScale?: number;
};

export function Intercom(props: Props) {
  const { playerIntegrationInstance } = useContext(PlayerIntegrationContext);
  const {
    className,
    iconClassName,
    intercomClassName,
    talkingColor,
    widthScale,
    heightScale,
  } = props;
  return (
    <View className={className}>
      {playerIntegrationInstance ? (
        <Widgets.VoiceIntercom
          className={Styles.voiceIntercomContainer}
          IPCPlayerContext={playerIntegrationInstance?.IPCPlayerInstance}
          {...(playerIntegrationInstance || {})}
          iconClassName={iconClassName || Styles.icon}
          intercomClassName={intercomClassName || Styles.intercomPlugin}
          mode="circle"
          talkingColor={talkingColor}
          widthScale={widthScale || 0.11}
          heightScale={heightScale || 0.12}
        />
      ) : null}
    </View>
  );
}
