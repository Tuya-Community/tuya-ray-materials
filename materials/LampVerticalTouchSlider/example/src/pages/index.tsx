import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/ray';
import LampTouchSlider from '@ray/lamp-vertical-touch-slider';
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
  const [value2, onChange2] = useState(80);

  useEffect(() => {
    // 模拟dp上报
    setTimeout(() => {
      onChange(72);
    }, 1000);
  }, []);

  return (
    <View>
      <View className={styles.view}>
        <DemoBlock title="基础用法">
          <LampTouchSlider value={value} onTouchEnd={onChange} />
        </DemoBlock>
        <DemoBlock title="隐藏Icon">
          <LampTouchSlider showIcon={false} />
        </DemoBlock>
      </View>
      <View className={styles.view}>
        <DemoBlock title="隐藏文字">
          <LampTouchSlider showText={false} />
        </DemoBlock>
        <DemoBlock title="最大最小值">
          <LampTouchSlider min={20} max={200} onChange={console.log} />
        </DemoBlock>
      </View>
      <View className={styles.view}>
        <DemoBlock title="阶段值">
          <LampTouchSlider
            min={20}
            max={200}
            step={20}
            onChange={console.log}
            value={value2}
            onTouchEnd={onChange2}
          />
        </DemoBlock>
        <DemoBlock title="自定义样式">
          <LampTouchSlider
            min={20}
            max={200}
            step={20}
            value={value2}
            onTouchEnd={onChange2}
            onChange={console.log}
            borderColor="transparent"
            trackColor="#461313"
            barColor="#F84803"
            textColor="#fff"
            borderRadius="8px"
            showIcon={false}
            showText={false}
            showThumb
            thumbStyle={{
              borderRadius: '10px',
              width: '60rpx',
              height: '10rpx',
              transform: 'translateY(200%)',
            }}
          />
        </DemoBlock>
      </View>
      <View className={styles.view}>
        <DemoBlock title="自定义样式">
          <LampTouchSlider
            min={20}
            max={200}
            step={20}
            value={value2}
            onTouchEnd={onChange2}
            onChange={console.log}
            borderColor="transparent"
            borderRadius="8px"
            thumbImage="https://images.tuyacn.com/rms-static/d7cecfc0-8535-11ee-8bb1-51351f353ef3-1700217679548.png?tyName=txp-slider-thumb1117.png"
            thumbWidth="44px"
            thumbHeight="6px"
          />
        </DemoBlock>
        <DemoBlock title="自定义宽高">
          <LampTouchSlider
            min={20}
            max={200}
            step={20}
            value={value2}
            onTouchEnd={onChange2}
            onChange={console.log}
            borderColor="transparent"
            borderRadius="8px"
            thumbImage="https://images.tuyacn.com/rms-static/d7cecfc0-8535-11ee-8bb1-51351f353ef3-1700217679548.png?tyName=txp-slider-thumb1117.png"
            thumbWidth="44px"
            thumbHeight="6px"
            width="100px"
            height="60px"
          />
        </DemoBlock>
      </View>
      <View className={styles.view}>
        <DemoBlock title="自定义样式">
          <LampTouchSlider
            min={20}
            max={200}
            step={20}
            value={value2}
            onTouchEnd={onChange2}
            onChange={console.log}
            borderColor="transparent"
            borderRadius="8px"
            thumbImage="https://images.tuyacn.com/rms-static/d7cecfc0-8535-11ee-8bb1-51351f353ef3-1700217679548.png?tyName=txp-slider-thumb1117.png"
            thumbWidth="44px"
            thumbHeight="6px"
            barStyle={{
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
            }}
            trackStyle={{
              overflow: 'hidden',
            }}
          />
        </DemoBlock>
      </View>
    </View>
  );
}
