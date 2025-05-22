import React from 'react';
import { View, Text } from '@ray-js/ray';
import styles from './index.module.less'
export const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);