import { View } from '@ray-js/ray';
import React, { FC } from 'react';
import TopBar from '@/components/TopBar';
import Strings from '@/i18n';

import styles from './index.module.less';
import Player from './Player';
import Tools from './Tools';

const Ipc: FC = () => {
  return (
    <View className={styles.container}>
      <TopBar.Sub title={Strings.getLang('dsc_ipc')} />
      <Player />
      <Tools />
    </View>
  );
};

export default Ipc;
