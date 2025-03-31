import React, { FC } from 'react';
import { Text, View } from '@ray-js/ray';
import { useProps } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import dpCodes from '@/config/dpCodes';
import Battery from '@/components/Battery';

import styles from './index.module.less';

const Status: FC = () => {
  const dpStatus = useProps(props => props[dpCodes.status]);

  return (
    <View className={styles['status-wrapper']}>
      <Text className={styles.title}>{Strings.getDpLang(dpCodes.status, dpStatus)}</Text>
      <View className={styles.divider} />
      <Battery customClassName={styles.battery} />
    </View>
  );
};

export default Status;
