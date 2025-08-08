import { View, Text } from '@ray-js/components';
import React, { useState, useEffect } from 'react';

import LampTempSlider from '@ray-js/lamp-temp-slider';

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
  const [temp, setTemp] = useState(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    // 模拟dp上报
    setTimeout(() => {
      setTemp(890);
      setClosed(true);
      setTimeout(() => {
        setClosed(false);
      }, 1000);
    }, 50);
  }, []);

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <Text className={styles.demoBlockTitleText}>temp:{temp}</Text>
        <LampTempSlider
          value={temp}
          closed={closed}
          onTouchEnd={val => {
            setTemp(val);
          }}
        />
      </DemoBlock>
      <DemoBlock title="反转">
        <Text className={styles.demoBlockTitleText}>temp:{temp}</Text>
        <LampTempSlider
          value={temp}
          reverse
          closed={closed}
          onTouchEnd={val => {
            setTemp(val);
          }}
        />
      </DemoBlock>
    </View>
  );
}
