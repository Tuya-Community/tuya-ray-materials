import { useEffect, useMemo } from 'react';
import { useScreenAlwaysOn } from '@ray-js/panel-sdk';
import { router, View } from '@ray-js/ray';

import { TabBar } from '@/components';
import { TabType } from '@/constant';
import { useThemeColor } from '@/hooks';
import { useSelector } from '@/redux';
import MainView from './main-view';
import MyAccount from './my-account';
import Statistics from './statistics';

export function Home() {
  const tab = useSelector(({ uiState }) => uiState.tab);
  const isNeedToComplete = useSelector(({ uiState }) => uiState.isNeedToComplete);

  useThemeColor();

  useScreenAlwaysOn();

  useEffect(() => {
    if (isNeedToComplete) {
      router.push('/registerName');
    }
  }, [isNeedToComplete]);

  return (
    <>
      <View>{!isNeedToComplete && tab === TabType.Measure && <MainView />}</View>
      <View>{!isNeedToComplete && tab === TabType.Statistics && <Statistics />}</View>
      <View>{!isNeedToComplete && tab === TabType.Me && <MyAccount />}</View>
      <TabBar />
    </>
  );
}

export default Home;
