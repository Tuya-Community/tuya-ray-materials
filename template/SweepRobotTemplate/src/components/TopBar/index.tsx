import { statusCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { useProps } from '@ray-js/panel-sdk';
import { Text, View } from '@ray-js/ray';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';

import styles from './index.module.less';

const TopBar = () => {
  const dpStatus = useProps(props => props[statusCode]) as Status;
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));

  return (
    <View>
      <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />

      <View className={styles.topbar}>
        <Text className={clsx(styles.topbarText)}>{Strings.getDpLang(statusCode, dpStatus)}</Text>
      </View>
    </View>
  );
};

export default TopBar;
