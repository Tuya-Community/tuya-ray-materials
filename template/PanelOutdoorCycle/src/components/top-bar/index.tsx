import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View, Image, navigateBack } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { selectThemeType } from '@/redux/modules/themeSlice';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { leftIcon, leftIconLight } from '@/res';
import styles from './index.module.less';

export const TopBar = props => {
  const { title, isHome } = props;
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const theme = useSelector(selectThemeType);

  const devInfo = useDevice(device => device.devInfo);
  const text = isHome ? devInfo.name : title || '';
  return (
    <View className={styles.topBarWrap}>
      <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View className={styles.topBar} onClick={() => navigateBack()}>
        <Image src={theme === 'dark' ? leftIcon : leftIconLight} className={styles.leftIcon} />
        <Text>{text}</Text>
      </View>
    </View>
  );
};
