/*
 * @Author: mjh
 * @Date: 2024-09-11 14:52:24
 * @LastEditors: mjh
 * @LastEditTime: 2025-01-20 10:32:10
 * @Description:
 */
import React, { useMemo } from 'react';
import { View, Text, getSystemInfoSync } from '@ray-js/ray';
import Template from '@ray-js/lamp-bead-strip';
import styles from './index.module.less';
import Strings from '../i18n';

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const { windowWidth = 375 } = getSystemInfoSync();
  const scale = (windowWidth / 375) * 1.1;
  const colors = ['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)'];
  const customAnimationList = useMemo(() => {
    return colors.map(item => new Array(20).fill(item));
  }, []);
  return (
    <View className={styles.view}>
      <DemoBlock title={Strings.getLang('basicUsage')}>
        <Template
          canvasId="template"
          speed={80}
          mode={10}
          colors={colors}
          contentValue={{ segmented: 1 }}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('pauses')}>
        <Template
          mode={2}
          canvasId="template1"
          ready={false}
          colors={colors}
          contentValue={{ segmented: 1, direction: 1 }}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('customizeScalingSize')}>
        <Template
          containerStyle={`height: ${48 * 1.1}rpx;width:${570 * 1.1}rpx;`}
          mode={16}
          canvasId="template2"
          scale={scale}
          colors={colors}
          contentValue={{ expand: 1 }}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('setCloseColor')}>
        <Template
          mode={16}
          closeColor="rgba(255,255,255,.6)"
          canvasId="template3"
          scale={scale}
          colors={colors}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('custom')}>
        <Template
          canvasId="template4"
          scale={scale}
          customAnimationList={customAnimationList}
          customAnimationChangeTime={500}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('allType')}>
        <Text className={styles.subTitle}>1:{Strings.getLang('gradient')}</Text>
        <Template
          mode={1}
          canvasId="templateMode1"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>2:{Strings.getLang('jump')}</Text>
        <Template
          mode={2}
          canvasId="templateMode2"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>3:{Strings.getLang('breath')}</Text>
        <Template
          mode={3}
          canvasId="templateMode3"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>4:{Strings.getLang('blink')}</Text>
        <Template
          mode={4}
          canvasId="templateMode4"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>5:{Strings.getLang('shootingStars')}</Text>
        <Template
          mode={5}
          canvasId="templateMode5"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>6:{Strings.getLang('accumulation')}</Text>
        <Template
          mode={6}
          canvasId="templateMode6"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>7:{Strings.getLang('falling')}</Text>
        <Template
          mode={7}
          canvasId="templateMode7"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>8:{Strings.getLang('chasingLight')}</Text>
        <Template
          mode={8}
          canvasId="templateMode8"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>9:{Strings.getLang('drifting')}</Text>
        <Template
          mode={9}
          canvasId="templateMode9"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>10:{Strings.getLang('flowingWater')}</Text>
        <Template
          mode={10}
          canvasId="templateMode10"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>11:{Strings.getLang('rainbow')}</Text>
        <Template
          mode={11}
          canvasId="templateMode11"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>12:{Strings.getLang('flashing')}</Text>
        <Template
          mode={12}
          canvasId="templateMode12"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>13:{Strings.getLang('rebounding')}</Text>
        <Template
          mode={13}
          canvasId="templateMode13"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>14:{Strings.getLang('shuttling')}</Text>
        <Template
          mode={14}
          canvasId="templateMode14"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>15:{Strings.getLang('chaoticFlashing')}</Text>
        <Template
          mode={15}
          canvasId="templateMode15"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
        <Text className={styles.subTitle}>16:{Strings.getLang('openingClosing')}</Text>
        <Template
          mode={16}
          canvasId="templateMode16"
          colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
        />
      </DemoBlock>
    </View>
  );
}
