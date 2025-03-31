import React, { FC } from 'react';
import { View } from '@ray-js/ray';
import BgBones from '@/components/BgBones';
import TopBar from '@/components/TopBar';
import Status from './Status';
import Player from './Player';
import PetAssistant from './PetAssistant';
import styles from './index.module.less';

const Home: FC = () => {
  return (
    <View className={styles.container}>
      <TopBar />
      <BgBones />
      <Status />
      <Player />
      <PetAssistant />
    </View>
  );
};

export default Home;
