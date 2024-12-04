import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, exitMiniProgram, getCurrentPages, router } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { Icon } from '../icon';

import Styles from './index.module.less';

const back =
  'M11.5472 3.38631C11.1567 2.99578 10.5235 2.99578 10.133 3.38631L2.35481 11.1645C1.96428 11.555 1.96428 12.1882 2.35481 12.5787L10.133 20.3569C10.5235 20.7474 11.1567 20.7474 11.5472 20.3569C11.9377 19.9663 11.9377 19.3332 11.5472 18.9427L4.47613 11.8716L11.5472 4.80052C11.9377 4.41 11.9377 3.77683 11.5472 3.38631Z';

interface Props {
  title?: string;
  showBack?: boolean;
}

export const TopBar: FC<Props> = ({ title, showBack }) => {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const devInfo = useDevice(device => device.devInfo);

  const handleBack = useCallback(() => {
    const pages = getCurrentPages();
    // @ts-expect-error
    if (pages.length === 1) {
      exitMiniProgram();
    } else {
      router.back();
    }
  }, []);

  return (
    <View className={Styles.topBarWrap}>
      <View className={Styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View className={Styles.topBar}>
        {!!showBack && (
          <View onClick={handleBack} className={Styles.leftIcon}>
            <Icon viewBox="0 0 24 24" d={back} fill="#000" />
          </View>
        )}
        <Text>{title || devInfo.name}</Text>
      </View>
    </View>
  );
};
