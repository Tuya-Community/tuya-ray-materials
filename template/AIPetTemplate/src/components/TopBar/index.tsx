import React, { CSSProperties, FC, useMemo } from 'react';
import { Text, View, navigateBack, getSystemInfoSync } from '@ray-js/ray';
import clsx from 'clsx';
import { useDevice } from '@ray-js/panel-sdk';
import { Icon } from '@ray-js/smart-ui';
import { iconAngleLeft } from '@/res/iconsvg';
import { useSelector } from 'react-redux';
import { selectIpcCommonValue } from '@/redux/modules/ipcCommonSlice';

import styles from './index.module.less';

type Props = {
  customStyle?: CSSProperties;
};

type PropsSub = {
  title: string;
  backgroundColor?: string;
};

const Sub: FC<PropsSub> = ({ title, backgroundColor }) => {
  const { safeArea } = useMemo(() => getSystemInfoSync(), []);

  const handleBack = () => {
    navigateBack();
  };

  return (
    <View
      className={clsx(styles['top-bar'], styles.sub)}
      style={{ paddingTop: `${safeArea?.top ?? 48}px`, backgroundColor }}
    >
      <Icon name={iconAngleLeft} size="64rpx" color="rgba(0, 0, 0, 0.7)" onClick={handleBack} />
      <Text className={styles['sub-title']}>{title}</Text>
      <Icon name={iconAngleLeft} size="64rpx" customStyle={{ opacity: 0 }} />
    </View>
  );
};

const TopBar: FC<Props> & { Sub: typeof Sub } = ({ customStyle }) => {
  const { safeArea } = useMemo(() => getSystemInfoSync(), []);
  const devName = useDevice(device => device.devInfo.name);

  const isFull = useSelector(selectIpcCommonValue('isFull'));

  return (
    <View
      className={clsx(styles['top-bar'], isFull && 'hide')}
      style={{ marginTop: `${safeArea?.top ?? 48}px`, ...customStyle }}
    >
      <Text className={styles.title}>{devName}</Text>
    </View>
  );
};

TopBar.Sub = Sub;

export default TopBar;
