import React from 'react';
import { View, Text } from '@ray-js/ray';
import styles from './index.module.less';

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  // 执行utils
  const run = () => {
    console.log('点击执行');
  };

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <View onClick={run}>点击执行</View>
      </DemoBlock>
    </View>
  );
}
