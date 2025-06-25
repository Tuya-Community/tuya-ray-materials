import React, { FC } from 'react';
import { Text, View } from 'ray';
import Strings from '@/i18n';

import styles from './index.module.less';

type Props = {
  area: number;
  time: number;
};

const Header: FC<Props> = ({ area, time }) => {
  return (
    <View className={styles.header}>
      <View className={styles.item}>
        <View className={styles.valueWrapper}>
          <Text className={styles.value}>{area}</Text>
          <Text className={styles.unit}>{Strings.getDpLang('clean_area', 'unit')}</Text>
        </View>
        <View className={styles.label}>{Strings.getDpLang('clean_area')}</View>
      </View>
      <View className={styles.divider} />
      <View className={styles.item}>
        <View className={styles.valueWrapper}>
          <Text className={styles.value}>{time}</Text>
          <Text className={styles.unit}>{Strings.getDpLang('clean_time', 'unit')}</Text>
        </View>
        <View className={styles.label}>{Strings.getDpLang('clean_time')}</View>
      </View>
    </View>
  );
};

export default Header;
