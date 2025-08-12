import React from 'react';
import { View, Text, Image } from '@ray-js/ray';
import styles from './index.module.less';
import res from '../../res';

export const DemoEmpty = ({ tips }) => {
  return (
    <View className={styles.demoEmpty}>
      <Image className={styles.demoEmptyImg} src={res.imgEmpty} />
      <View className={styles.demoEmptyTitle}>
        <View className={styles.demoEmptyTitleText}>{tips}</View>
      </View>
    </View>
  );
};
