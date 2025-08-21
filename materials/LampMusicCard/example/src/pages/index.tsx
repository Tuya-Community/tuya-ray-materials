/* eslint-disable no-console */
import React, { useState } from 'react';
import { View, Text } from '@ray-js/components';
import LampMusicCard, {
  musicColorArr1,
  LampMusicBar,
  musicColorArr2,
} from '@ray-js/lamp-music-card';
import styles from './index.module.less';
import JazzImage from '../res/jazz.png';

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const [active, setActive] = useState(false);
  const data = {
    title: '音乐卡片', // 卡片标题
    icon: JazzImage, // 展示的icon图
    colorArr: musicColorArr1, // 可选 自定义颜色动画数据 默认使用musicColorArr1的颜色值
  };
  const onPlay = (active: boolean) => {
    console.log('onPlay', active);
    setActive(active);
  };

  return (
    <View
      style={{
        background: '#eee',
      }}
    >
      <DemoBlock title="基础用法">
        <LampMusicCard
          theme="light"
          data={data}
          className="aaa"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          iconColor="#ffffff"
          active={active}
          onPlay={onPlay}
        />
      </DemoBlock>

      <DemoBlock title="进阶用法">
        <LampMusicCard
          data={data}
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          active={active}
          onPlay={onPlay}
          renderCustom={() => {
            return (
              <View
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '4px',
                  background: '#333',
                  display: 'flex',
                  paddingLeft: '20px',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff' }}>这里是自定义内容</Text>
              </View>
            );
          }}
        />
      </DemoBlock>

      <DemoBlock title="LampMusicBar 用法">
        <LampMusicBar colorList={musicColorArr2} bgColor="#eee" />
      </DemoBlock>
    </View>
  );
}
