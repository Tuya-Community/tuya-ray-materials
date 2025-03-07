import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View } from '@ray-js/ray';
import { TopBarProps } from '@/components/TopBar';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import AIDialogue from '../AIDialogue';
import HomeTopBar from './HomeTopBar';
import styles from './index.module.less';

export function Home() {
  const { screenHeight } = useSelector(selectSystemInfo);
  const [topBarProps, setTopBarProps] = useState<TopBarProps>({});

  return (
    <View className={styles.view} style={{ height: `${screenHeight}px` }}>
      <HomeTopBar {...topBarProps} />
      <AIDialogue setTopBarProps={setTopBarProps} />
    </View>
  );
}

export default Home;
