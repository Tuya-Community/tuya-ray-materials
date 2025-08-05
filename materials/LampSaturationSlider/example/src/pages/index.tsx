import { View, Text, Button } from '@ray-js/components';
import React, { useState, useEffect } from 'react';
import LampSaturationSlider from '@ray-js/lamp-color-slider';

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
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(200);

  useEffect(() => {
    // 模拟dp上报
    setTimeout(() => {
      setSaturation(1000);
    }, 1000);
  }, []);

  const handleRandomHue = React.useCallback(() => {
    setHue(Math.round(Math.random() * 360));
  }, []);

  const trackStyle = {
    width: 328,
    height: 28,
  };

  const thumbStyle = {
    width: 34,
    height: 34,
    borderRadius: '100%',
  };

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <Text className={styles.demoBlockTitleText}>saturation:{saturation}</Text>
        <LampSaturationSlider
          hue={20}
          // closed
          value={saturation}
          onTouchEnd={val => {
            setSaturation(val);
          }}
        />
      </DemoBlock>

      <DemoBlock title="随机色相">
        <Text className={styles.demoBlockTitleText}>hue:{hue}</Text>
        <Text className={styles.demoBlockTitleText}>saturation:{saturation}</Text>
        <LampSaturationSlider
          hue={hue}
          value={saturation}
          onTouchEnd={val => {
            setSaturation(val);
          }}
        />
        <Button style={{ margin: 20 }} size="mini" onClick={handleRandomHue}>
          点我随机生成色相
        </Button>
      </DemoBlock>

      <DemoBlock title="自定义样式">
        <Text className={styles.demoBlockTitleText}>saturation:{saturation}</Text>
        <LampSaturationSlider
          hue={20}
          max={100}
          trackStyle={trackStyle}
          thumbStyle={thumbStyle}
          value={saturation}
          onTouchEnd={val => {
            setSaturation(val);
          }}
        />
      </DemoBlock>
    </View>
  );
}
