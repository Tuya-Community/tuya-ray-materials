import React, { FC, useMemo } from 'react';
import { Text, View, navigateBack } from '@ray-js/ray';
import clsx from 'clsx';
import { useDevice } from '@ray-js/panel-sdk';
import { Icon } from '@ray-js/smart-ui';
import { iconAngleLeft } from '@/res/iconsvg';
import { useSelector } from 'react-redux';
import { selectIpcCommonValue } from '@/redux/modules/ipcCommonSlice';

import styles from './index.module.less';

type PropsSub = {
  title: string;
  backgroundColor?: string;
};

const Sub: FC<PropsSub> = ({ title, backgroundColor }) => {
  const { safeArea } = useMemo(() => ty.getSystemInfoSync(), []);
  const isFull = useSelector(selectIpcCommonValue('isFull'));

  const handleBack = () => {
    navigateBack();
  };

  return (
    <View
      className={clsx(styles.topBar, styles.sub, isFull && 'hide')}
      style={{ paddingTop: `${safeArea?.top ?? 48}px`, backgroundColor }}
    >
      <Icon name={iconAngleLeft} size="64rpx" color="rgba(0, 0, 0, 0.7)" onClick={handleBack} />
      <Text className={styles.subTitle}>{title}</Text>
      <Icon name={iconAngleLeft} size="64rpx" customClass="hide" />
    </View>
  );
};

const TopBar: FC & { Sub: typeof Sub } = () => {
  const { safeArea } = useMemo(() => ty.getSystemInfoSync(), []);
  const devName = useDevice(device => device.devInfo.name);

  const isFull = useSelector(selectIpcCommonValue('isFull'));

  return (
    <View
      className={clsx(styles.topBar, isFull && 'hide')}
      style={{ marginTop: `${safeArea?.top ?? 48}px` }}
    >
      <Text className={styles.title}>{devName}</Text>
    </View>
  );
};

TopBar.Sub = Sub;

export default TopBar;
