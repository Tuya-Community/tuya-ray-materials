import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/components';
import LampHuePicker from '@ray-js/lamp-hue-picker';
import DemoRjs from '../../../src/exampleComponent/demoRjs';

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
  const [hue, setHue] = useState(100);

  const handleEnd = (v: number) => {
    console.log('end', v);
    setHue(v);
  };
  const handleMove = (v: number) => {
    console.log('move', v);
    // 注意性能问题，可能需要加截流
    setHue(v);
  };
  useEffect(() => {
    // 模拟dp上报
    setTimeout(() => {
      setHue(300);
    }, 3000);
  }, []);

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <LampHuePicker
          value={hue}
          // isShowColorTip={false}
          // isShowAngleTip={false}
          // colorTipText='red'
          // angleTipText='180'
          // useEventChannel
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </DemoBlock>
      <DemoRjs />
    </View>
  );
}
