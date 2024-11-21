import React, { FC, useEffect, useState } from 'react';
import { Text, View, getDevInfo } from '@ray-js/ray';
import { useProps } from '@ray-js/panel-sdk';
import { decodeVoice0x35 } from '@ray-js/robot-protocol';
import { Toast } from '@ray-js/smart-ui';
import Strings from '@/i18n';

import styles from './index.module.less';
import Item from './Item';
import Header from './Header';

const VoicePack: FC = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const dpVoiceData = useProps(props => props.voice_data);

  const deviceVoice = decodeVoice0x35({ command: dpVoiceData });

  useEffect(() => {
    const fetchVoices = async () => {
      const res = await ty.getVoiceList({
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
