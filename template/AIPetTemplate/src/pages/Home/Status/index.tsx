import React, { FC } from 'react';
import { Text, View } from '@ray-js/ray';
import { useProps } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import dpCodes from '@/config/dpCodes';
import { selectIpcCommonValue } from '@/redux/modules/ipcCommonSlice';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Battery from '@/components/Battery';
import Pets from '../Pets';

import styles from './index.module.less';

const Status: FC = () => {
  const dpStatus = useProps(props => props[dpCodes.status]);
  const isFull = useSelector(selectIpcCommonValue('isFull'));
  return (
    <View className={clsx(styles.container, isFull && 'hide')}>
      <Pets />
      <View className={styles['status-wrapper']}>
        <Text className={styles.title}>{Strings.getDpLang(dpCodes.status, dpStatus)}</Text>
        <View className={styles.divider} />
        <Battery />
      </View>
    </View>
  );
};

export default Status;
