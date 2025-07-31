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

  const changeDevice = _.debounce(() => {
    ty.outdoor.switchDevice({
      success: () => {
        console.log('切换设备成功');
      },
      fail: () => {
        console.log('切换设备失败');
      },
    });
  }, 500);

  const goToDeviceDetailPage = _.debounce(() => {
    ty.device.openDeviceDetailPage({ deviceId: devInfo.devId });
  }, 500);

  return (
    <View className={styles.topBarWrap}>
      <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View className={styles.topBar}>
        <Text className={styles.topBarText} onClick={changeDevice}>
          {devInfo.name}
        </Text>
        <Image
          src={theme === 'dark' ? change : changeLight}
          className={styles.icon}
          style={{ marginLeft: 6 }}
          onClick={changeDevice}
        />
        <View style={{ flex: 1 }} />
        <Image
          src={theme === 'dark' ? set : setLight}
          className={styles.icon}
          onClick={goToDeviceDetailPage}
        />
      </View>
    </View>
  );
};
