import React from 'react';
import { View } from '@ray-js/ray';
import MusicBar from '@ray-js/music-bar';
import styles from './index.module.less';
import { DemoBlock } from '../components';
import Strings from '../i18n';

export default function Home() {
  /** 物料平台 获取最新多语言 */
  return (
    <View className={styles.view}>
      <DemoBlock title={Strings.getLang('basicUsage')}>
        <MusicBar />
      </DemoBlock>
      {/* 当由于组件比较特殊，无法在物料平台内预览时，需要使用DemoEmpty组件书写用户提示 */}
      {/* <DemoEmpty tips={Strings.getLang('emptyTips')} /> */}
    </View>
  );
}
