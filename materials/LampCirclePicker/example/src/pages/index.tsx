import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/components';
import LampCirclePicker from '../../../src/index';
import DemoRjs from '../../../src/demoRjs';

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
  const [temperature, setTemperature] = useState(20);

  const handleMove = (v: number) => {
    setTemperature(v);
  };

  const handleEnd = (v: number) => {
    setTemperature(v);
  };
  useEffect(() => {
    setTimeout(() => {
      setTemperature(500);
    }, 3000);
  }, []);

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <LampCirclePicker
          value={temperature}
          useEventChannel
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </DemoBlock>

      <DemoBlock title="HideThumb">
        <LampCirclePicker
          value={temperature}
          useEventChannel
          hideThumb
          lineCap="butt"
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </DemoBlock>
      <DemoBlock title="自定义色盘颜色">
        <LampCirclePicker
          value={temperature}
          innerRingRadius={80}
          showInnerCircle
          colorList={[
            { offset: 0, color: '#ff0000' },
            { offset: 0.5, color: '#00ff00' },
            { offset: 1, color: '#0000ff' },
          ]}
          style={{
            background: '#ddd',
          }}
          innerBorderStyle={{
            width: 2,
            color: 'pink',
          }}
          descText="temp"
          descStyle={{
            color: 'red',
          }}
          titleStyle={{
            color: 'blue',
          }}
          useEventChannel
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </DemoBlock>

      <DemoRjs />
    </View>
  );
}
