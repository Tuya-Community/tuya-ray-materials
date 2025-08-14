import React from 'react';
import { View, Text } from '@ray-js/ray';
import LampColorCard from '@ray-js/lamp-color-card';
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
  const [hsColor, setHsColor] = React.useState<{ h: number; s: number }>({ h: 0, s: 1000 });
  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <LampColorCard
          hs={hsColor}
          onTouchEnd={(e: { h: number; s: number }) => {
            console.log(e);
            setHsColor(e);
          }}
          // thumbBorderWidth={2}
          // thumbBorderColor="#fff"
          thumbBorderRadius={4}
          rectStyle={{ borderRadius: '24rpx 24rpx 24rpx 24rpx', overflow: 'hidden' }}
        />
      </DemoBlock>
    </View>
  );
}
