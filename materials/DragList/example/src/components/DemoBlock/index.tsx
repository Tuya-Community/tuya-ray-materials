import React from 'react';
import { View, Text } from '@ray-js/ray';
import styles from './index.module.less';

export const DemoBlock = ({ title, children, style = {} }) => (
  <View className={styles.demoBlock} style={style}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);
