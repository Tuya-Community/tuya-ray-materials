import HomeTopBar from '@/components/HomeTopBar';
import { View } from '@ray-js/ray';
import React, { FC } from 'react';

import ControllerBar from './ControllerBar';
import styles from './index.module.less';
import Map from './Map';

const Home: FC = () => {
  return (
    <View className={styles.container}>
      {/* Topbar */}
      <HomeTopBar />
      {/* 操作栏 */}
      <ControllerBar />
      {/* 实时地图 */}
      <Map />
    </View>
  );
};

export default Home;
