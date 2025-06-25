import React, { FC } from 'react';
import { View } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { useProps, useDevice } from '@ray-js/panel-sdk';

import Header from './Header';
import styles from './index.module.less';
import Panel from './Panel';

const Bg: FC = () => {
  const dpStatus = useProps(props => props.status);

  const showBg = dpStatus !== 'sleep' && dpStatus !== 'standby';

  return (
    <View
      className={styles.bg}
      style={{
        opacity: showBg ? 1 : 0,
      }}
    />
  );
};

export function Home() {
  const deviceName = useDevice(device => device.devInfo.name);

  return (
    <View className={styles.container}>
      <Bg />
      <NavBar fixed customClass={styles.navbar} leftText={deviceName} placeholder />
      <Header />
      <Panel />
    </View>
  );
}
export default Home;
