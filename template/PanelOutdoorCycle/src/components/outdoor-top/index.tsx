import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View, Image } from '@ray-js/ray';
import { useDevInfo } from '@ray-js/panel-sdk';
import { selectThemeType } from '@/redux/modules/themeSlice';
import _ from 'lodash';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { change, changeLight, set, setLight } from '@/res';
import styles from './index.module.less';

export const OutdoorTop = () => {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const devInfo = useDevInfo() || { devId: '', name: '' };
  const theme = useSelector(selectThemeType);

  const goToDeviceDetailPage = _.debounce(() => {
    ty.navigateTo({
      url: `functional://settings/detail?deviceId=${devInfo.devId}`,
    });
  }, 500);

  return (
    <View className={styles.topBarWrap}>
      <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View className={styles.topBar}>
        <Text className={styles.topBarText}>{devInfo.name}</Text>
        <View style={{ flex: 1 }} />
        {/* <Image
          src={theme === 'dark' ? set : setLight}
          className={styles.icon}
          onClick={goToDeviceDetailPage}
        /> */}
      </View>
    </View>
  );
};
