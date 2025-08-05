import { View, Text, Button, Checkbox } from '@ray-js/components';
import React, { useState, useEffect } from 'react';

import ColorSlider from '@ray-js/lamp-color-slider';

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
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    // 模拟dp上报
    // setTimeout(() => {
    //   setHue(321);
    // }, 3000);
  }, []);

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <Checkbox checked={disable} onClick={() => setDisable(!disable)}>
          禁用
        </Checkbox>
        <Text className={styles.demoBlockTitleText}>hue:{hue}</Text>
        <ColorSlider
          value={hue}
          thumbStyle={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: disable ? 'gray' : null,
          }}
          useCustomThumbStyle={disable}
          onTouchEnd={val => {
            setHue(val);
            console.log(val, 'onTouchEnd valvalval');
          }}
        />
      </DemoBlock>
    </View>
  );
}
