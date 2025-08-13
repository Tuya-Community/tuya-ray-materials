import { View, Text } from '@ray-js/components';
import React, { useState, useEffect } from 'react';

import LampBrightSlider from '@ray-js/lamp-bright-slider';
import PerfText from '@ray-js/components-ty-perf-text';

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
  const [bright, setBright] = useState(1000);

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <PerfText eventName="change" defaultValue={bright} />
        <Text className={styles.demoBlockTitleText}>bright:{bright}</Text>
        <LampBrightSlider
          value={bright}
          min={10}
          max={1000}
          moveEventName="change"
          onTouchEnd={val => {
            setBright(val);
          }}
        />
      </DemoBlock>
    </View>
  );
}
