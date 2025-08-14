import React, { useState, useEffect } from 'react';
import { utils } from '@ray-js/panel-sdk';
import { View, Text, ScrollView } from '@ray-js/components';

import LampCirclePickerColor from '../../../src/index';
import DemoRjs from '../Component/demoRjs';

import styles from './index.module.less';

const { hsv2rgbString } = utils;

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const [favoriteColorList, setFavoriteColorList] = useState([
    { h: 0, s: 1000, v: 1000 },
    { h: 120, s: 1000, v: 1000 },
    { h: 220, s: 1000, v: 1000 },
    { h: 320, s: 1000, v: 1000 },
  ]);
  const [hs, setHS] = useState({ h: 0, s: 1000 });
  const [hs2, setHS2] = useState({ h: 220, s: 1000 });

  useEffect(() => {
    // 模拟 dp 上报
    setTimeout(() => {
      setHS({
        h: 100,
        s: 1000,
      });
    }, 1000);
  }, []);

  const handleTouchStart = (hsRes: HS) => {
    console.log(hsRes, 'handleTouchStart');
    setHS(hsRes);
  };
  const handleTouchMove = (hsRes: HS) => {
    // console.log(hsRes, 'handleTouchMove');
    // setHS(hsRes);
  };
  const handleTouchEnd = (hsRes: HS) => {
    console.log(hsRes, 'handleTouchEnd');
    setHS(hsRes);
    setTimeout(() => {
      console.log(hsRes, 'handleTouchEnd1');
      setHS(hsRes);
    }, 400);
  };

  const handleTouchStart2 = (hsRes: HS) => {
    setHS2(hsRes);
  };
  const handleTouchMove2 = (hsRes: HS) => {
    console.log(hsRes, 'handleTouchMove');
    // setHS2(hsRes);
  };
  const handleTouchEnd2 = (hsRes: HS) => {
    // console.log(hsRes, 'handleTouchEnd');
    setHS2(hsRes);
  };

  const renderFavoriteColor = () => {
    return (
      <View style={{ display: 'flex' }}>
        {favoriteColorList.map((item, index) => {
          return (
            <View
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '15px',
                background: hsv2rgbString(item.h ?? 0, item.s ?? 1000, item.v ?? 1000),
              }}
              onClick={() => {
                const activeColor = favoriteColorList[index];
                setHS(activeColor); // 格式为{h:120,s:1000,v:1000}
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        {renderFavoriteColor()}
        <View />
        <LampCirclePickerColor
          hs={hs}
          thumbRadius={15}
          radius={100}
          whiteRange={0.15}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          thumbBorderWidth={6}
        />
      </DemoBlock>

      <DemoBlock title="带 eventChannel 用法">
        <LampCirclePickerColor
          hs={hs}
          thumbRadius={15}
          radius={100}
          whiteRange={0.15}
          useEventChannel // eventChannel 一般情况用不到，只有当多个Rjs需要通信时才会用到
          eventChannelName="lampCirclePickerColorEventChannel222"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        />
      </DemoBlock>

      <DemoBlock title="thumbShadow 用法">
        <LampCirclePickerColor
          hs={hs}
          thumbRadius={15}
          radius={100}
          whiteRange={0.15}
          thumbShadowBlur={10}
          thumbShadowColor="rgba(255, 0, 0, 0.5)"
          useEventChannel // eventChannel 一般情况用不到，只有当多个Rjs需要通信时才会用到
          eventChannelName="lampCirclePickerColorEventChannel222"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        />
      </DemoBlock>
      {/* eventChannel 能力示例 一般情况用不到，只有当多个Rjs需要通信时才会用到 */}
      <DemoRjs />
      <DemoBlock title="在 ScrollView 内示例">
        <ScrollView scrollY style={{ width: '100%', height: '300px' }}>
          <LampCirclePickerColor
            hs={hs2}
            thumbRadius={15}
            radius={100}
            whiteRange={0.2}
            onTouchStart={handleTouchStart2}
            onTouchEnd={handleTouchEnd2}
            onTouchMove={handleTouchMove2}
          />
          <View style={{ height: '1800px', width: '100%', background: '#666' }} />
        </ScrollView>
      </DemoBlock>
    </View>
  );
}
