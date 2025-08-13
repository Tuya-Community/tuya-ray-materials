import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@ray-js/ray';
import PercentSlider from '@ray/lamp-vertical-percent-slider';
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
  const [value, onChange] = useState(30);

  useEffect(() => {
    // 模拟dp上报
    setTimeout(() => {
      onChange(72);
    }, 1000);
  }, []);

  const [scrollY, setScrollY] = useState(false);
  const onTouchStart = val => {
    console.log('🚀 ~ file: index.tsx:27 ~ onTouchStart ~ val:', val);
    setScrollY(false);
    onChange(val);
  };
  const onTouchEnd = val => {
    console.log('🚀 ~ file: index.tsx:32 ~ onTouchEnd ~ val:', val);
    setScrollY(true);
    onChange(val);
  };

  return (
    <ScrollView scrollY={scrollY} refresherTriggered>
      <View className={styles.view}>
        <DemoBlock title="基础用法">
          <PercentSlider
            onTouchStart={onTouchStart}
            value={value}
            onChange={console.log}
            onTouchEnd={onTouchEnd}
          />
        </DemoBlock>
        {/* <DemoBlock title="只显示数值">
          <PercentSlider
            showIcon={false}
            value={value}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        </DemoBlock> */}
      </View>
      {/* <View className={styles.view}>
        <DemoBlock title="只显示图标">
          <PercentSlider
            showText={false}
            value={value}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        </DemoBlock>
        <DemoBlock title="隐藏图标和数值">
          <PercentSlider
            showIcon={false}
            showText={false}
            value={value}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        </DemoBlock>
      </View>
      <View className={styles.view}>
        <DemoBlock title="自定义最大值">
          <PercentSlider max={1000} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />
        </DemoBlock>
        <DemoBlock title="自定义最小值">
          <PercentSlider
            instanceId="cusmin"
            min={20}
            max={100}
            value={value}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        </DemoBlock>
      </View>
      <View className={styles.view}>
        <DemoBlock title="自定义样式">
          <PercentSlider
            barColor="red"
            trackColor="blue"
            iconColor="yellow"
            textColor="green"
            thumbColor="pink"
            max={1000}
            width="10px"
            barWidth="8px"
            height="100px"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            trackStyle={{
              borderRadius: '4px',
            }}
            barStyle={{
              borderRadius: '4px',
            }}
          />
        </DemoBlock>
      </View> */}
    </ScrollView>
  );
}
