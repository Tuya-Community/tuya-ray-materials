import React, { useMemo } from 'react';
import { usePageEvent } from 'ray';
import { View } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';

import { usePanelStore, useConstructor } from '@/hooks';
import { getCameraAngleByCloud } from '@/utils';
import { globalConfig } from '@/config';
import Strings from '@/i18n';
import { getLatestLogAsync } from '@/redux/actions';
import { LatestLog } from '@/components';
import StatusBar from './component/statusBar';
import Header from './component/header';
import TabBar from './component/tabbar';

import styles from './index.module.less';

export const Home = () => {
  const { powerCode } = usePanelStore();

  const cameraRotate = useMemo(() => getCameraAngleByCloud(powerCode), [powerCode]);

  useConstructor(() => {
    globalConfig.setConfig('themeColor', '#5EAAFF');
  });

  usePageEvent('onShow', () => {
    console.log('-----------------------------onPageShow-----------------------------');
    setTimeout(() => {
      getLatestLogAsync();
    }, 3000);
  });

  /*
    Header 主要包含 safeTime、remoteOpenDoor 组件
    TabBar 是一个tab列表，可以往成员管理、场景、设置页、视频监控、临时密码等页面
  */

  return (
    <>
      <NavBar title={Strings.getLang('title_home')} fixed placeholder />
      <View className={styles.container}>
        <Header />
        <>
          <StatusBar />
          <LatestLog />
        </>
        <TabBar cameraRotate={cameraRotate} />
      </View>
    </>
  );
};

export default Home;
