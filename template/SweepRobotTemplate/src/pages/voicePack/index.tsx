import React, { FC, useEffect, useState } from 'react';
import { View, getDevInfo, getVoiceList } from '@ray-js/ray';
import { useProps } from '@ray-js/panel-sdk';
import { decodeVoice0x35 } from '@ray-js/robot-protocol';
import { Toast } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import { voiceDataCode } from '@/constant/dpCodes';

import styles from './index.module.less';
import Item from './Item';
import Header from './Header';

const VoicePack: FC = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const dpVoiceData = useProps(props => props[voiceDataCode]);

  const deviceVoice = dpVoiceData ? decodeVoice0x35({ command: dpVoiceData }) : {};

  useEffect(() => {
    const fetchVoices = async () => {
      const res = await getVoiceList({
        devId: getDevInfo().devId,
        offset: 0,
        limit: 100,
      });

      setVoices(res.datas);
    };

    fetchVoices();

    ty.setNavigationBarTitle({
      title: Strings.getLang('dsc_voice_pack'),
    });
  }, []);

  return (
    <View className={styles.container}>
      <Header />

      {voices.map(voice => (
        <Item key={voice.id} data={voice} deviceVoice={deviceVoice} />
      ))}
      <Toast id="smart-toast" />
    </View>
  );
};

export default VoicePack;
