import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { debounce } from 'lodash';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { toSvgCssBackground } from '@/utils';
import { selectCar } from '@/constant/svgConfig';
import styles from './index.module.less';

export const TopBar = () => {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const devInfo = useDevice(device => device.devInfo);
  const ThemeInfo = ty.getThemeInfo();

  const changeDevice = debounce(() => {
    ty.outdoor.switchDevice({
      success: () => {
        console.log('切换设备成功');
      },
      fail: () => {
        console.log('切换设备失败');
      },
    });
  }, 500);

  return (
    <View className={styles.topBarWrap}>
      <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View className={styles.topBar} onClick={changeDevice}>
        <Text>{devInfo.name || ''}</Text>
        <View
          style={{
            ...toSvgCssBackground(selectCar({ color: ThemeInfo['--app-B1-N3'] })),
            width: '24px',
            height: '24px',
          }}
        />
      </View>
    </View>
  );
};
