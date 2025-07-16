import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@ray-js/components';
import DemoRjs from '../demoRjs';

import LampCirclePickerWhite from '../../../src/index';

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
  const [temp, setTemp] = useState(0);
  console.log('🚀 ~ file: index.tsx:19 ~ Home ~ temp:', temp);

  useEffect(() => {
    setTimeout(() => {
      setTemp(1000);
    }, 1000);
  }, []);
  const [isShow, setIsShow] = useState(false);

  return (
    <View className={styles.view}>
      <DemoBlock title="白光模式">
        <View
          style={{
            height: '330px',
            width: '100%',
            background: 'rgba(255, 255, 255,.2)',
          }}
        >
          {isShow && (
            <LampCirclePickerWhite
              thumbRadius={15}
              temperature={temp}
              radius={150}
              onTouchStart={setTemp}
              onTouchEnd={setTemp}
              onTouchMove={console.log}
              canvasId="white_picker_1"
            />
          )}
        </View>
        <Text
          style={{
            height: 40,
            width: '100%',
            background: 'rgba(255, 255, 255,.1)',
            marginBottom: 10,
            textAlign: 'center',
            lineHeight: '40px',
          }}
          onClick={() => {
            setIsShow(!isShow);
          }}
        >
          切换显示色盘
        </Text>
      </DemoBlock>

      <DemoBlock title="带 eventChannel 用法">
        <LampCirclePickerWhite
          thumbRadius={15}
          temperature={temp}
          radius={150}
          eventChannelName="lampCirclePickerWhiteEventChannel222"
          useEventChannel // eventChannel 一般情况用不到，只有当多个Rjs需要通信时才会用到
          onTouchStart={setTemp}
          onTouchEnd={setTemp}
          canvasId="white_picker_2"
        />
      </DemoBlock>
      <DemoRjs />

      <DemoBlock title="在 ScrollView 内展示">
        <ScrollView refresherTriggered scrollY style={{ width: '100%', height: '300px' }}>
          <LampCirclePickerWhite
            thumbRadius={15}
            temperature={temp}
            radius={150}
            eventChannelName="lampCirclePickerWhiteEventChannel222"
            useEventChannel // eventChannel 一般情况用不到，只有当多个Rjs需要通信时才会用到
            onTouchStart={setTemp}
            onTouchEnd={setTemp}
            canvasId="white_picker_3"
          />
          <View
            style={{ height: '1800px', width: '100%', background: 'rgba(255, 255, 255, .1)' }}
          />
        </ScrollView>
      </DemoBlock>
    </View>
  );
}
