import { router, View } from '@ray-js/ray';
import React, { FC } from 'react';
import { NavBar } from '@ray-js/smart-ui';
import Strings from '@/i18n';

import styles from './index.module.less';
import Player from './Player';
import Tools from './Tools';

const Ipc: FC = () => {
  return (
    <View className={styles.container}>
      <NavBar title={Strings.getLang('dsc_ipc')} leftArrow onClickLeft={router.back} />
      <Player />
      <Tools />
    </View>
  );
};

export default Ipc;
