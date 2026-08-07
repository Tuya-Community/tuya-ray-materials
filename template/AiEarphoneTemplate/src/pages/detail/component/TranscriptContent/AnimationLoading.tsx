/*
 * @Author: hkc
 * @Date: 2025-09-15 09:58:25
 * @LastEditors: hkc
 * @LastEditTime: 2025-09-15 10:41:13
 * @Description: 动画loading
 */
import React from 'react';
import { View } from '@ray-js/ray';

import Strings from '@/i18n';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';

import styles from './index.module.less';

const AnimationLoading = () => {
  return (
    <View
      className={styles.animationLoading}
      onClick={e => {
        e.origin.stopPropagation();
      }}
    >
      <View className={styles.gradientBg} />
      <View className={styles.loading}>
        <ThemedImage imageName="loadingImg" src={Res.loadingImg} className={styles.img} />
        <View>{Strings.getLang('translating')}...</View>
      </View>
    </View>
  );
};

export default AnimationLoading;
