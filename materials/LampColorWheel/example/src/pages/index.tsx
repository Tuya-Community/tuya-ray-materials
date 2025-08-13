import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/ray';

import ColorWheel from '@ray-js/lamp-color-wheel';

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
  const [color, setColor] = useState({ h: 0, s: 800 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setColor({ h: 240, s: 800 });
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <ColorWheel
          hsColor={color}
          hollowRadius={21}
          centerRingRadius={17}
          ringRadius={160}
          paddingWidth={20}
          onTouchEnd={(e: { h: number; s: number }) => {
            setColor(e);
          }}
          thumbBorderWidth={5}
          thumbBorderColor="#fff"
        />
      </DemoBlock>
    </View>
  );
}
