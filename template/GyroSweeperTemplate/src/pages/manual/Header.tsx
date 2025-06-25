import React, { FC } from 'react';
import { Text, View } from 'ray';
import Strings from '@/i18n';
import { useProps } from '@ray-js/panel-sdk';

import styles from './index.module.less';

const Header: FC = () => {
  const dpCleanArea = useProps(props => props.clean_area);
  const dpCleanTime = useProps(props => props.clean_time);

  return (
    <View className={styles.header}>
      <View className={styles.item}>
        <View className={styles.valueWrapper}>
          <Text className={styles.value}>{dpCleanArea}</Text>
          <Text className={styles.unit}>{Strings.getDpLang('clean_area', 'unit')}</Text>
        </View>
        <View className={styles.label}>{Strings.getDpLang('clean_area')}</View>
      </View>
      <View className={styles.divider} />
      <View className={styles.item}>
        <View className={styles.valueWrapper}>
          <Text className={styles.value}>{dpCleanTime}</Text>
          <Text className={styles.unit}>{Strings.getDpLang('clean_time', 'unit')}</Text>
        </View>
        <View className={styles.label}>{Strings.getDpLang('clean_time')}</View>
      </View>
    </View>
  );
};

export default Header;
