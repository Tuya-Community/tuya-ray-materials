/*
 * @Author: mjh
 * @Date: 2025-06-06 15:52:32
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-26 10:39:37
 * @Description:
 */
/* eslint-disable @typescript-eslint/no-empty-function */
import { View, Text, Button } from '@ray-js/ray';
import React, { useEffect, useState } from 'react';
import RhythmsCircle from '../../../src/index';
import res from '../res';

import styles from './index.module.less';

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

const list = [
  {
    activeColor: '#CEECFE',
    time: 280,
    valid: true,
  },
  {
    activeColor: '#1E272C',
    time: 1260,
    valid: true,
  },
  {
    activeColor: '#CE8040',
    time: 390,
    valid: false,
  },
  {
    activeColor: '#B3ABA8',
    time: 1020,
    valid: true,
  },
]

export default function Home() {
  const [rhythmNode, setRhythmNode] = useState(list);
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const newList = list.map(item => ({ ...item }));
      newList[0].time = 700
      setRhythmNode(newList)
    }, 3000)
  }, [])
  
  const handleRelease = v => {
    const { value } = v;
    setRhythmNode([...value]);
  };

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <View style={{ marginBottom: 20}}>
          <Button size='mini' type='primary' onClick={() => setIsDark(!isDark)}>切换主题</Button>
        </View>
        <View className={styles.box}
          style={{
            background: isDark ? '#1a1a1a' : '#fff',
            border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(1, 1, 1, 0.1)'
        }}>
          <RhythmsCircle
            innerRadius={110}
            radius={150}
            isDarkTheme={isDark}
            timeOffset={30}
            data={rhythmNode}
            centerBackground="transparent"
            iconList={[res.icon1_colour, res.icon2_colour, res.icon3_colour, res.icon4_colour]}
            onRelease={handleRelease}
          />
        </View>
      </DemoBlock>
    </View>
  );
}
