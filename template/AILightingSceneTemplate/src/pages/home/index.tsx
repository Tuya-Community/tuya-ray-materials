import React from 'react';
import { View } from '@ray-js/ray';
import styles from './index.module.less';

export default function Home() {
  const height = `calc(100vh - 46px - var(--app-device-status-height, 20px) - env(safe-area-inset-bottom))`;

  return <View className={styles.pageWrapper}>home</View>;
}
