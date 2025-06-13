import React from 'react';
import { View } from '@ray-js/ray';
import { isIphoneX } from '@/utils';
import clsx from 'clsx';
import { FeatureTabBar } from '../feature-tab-bar';

import Styles from './index.module.less';

export const LayoutFooter = () => {
  return (
    <View className={clsx(Styles.comContainer, isIphoneX && Styles.iphoneXHeight)}>
      <FeatureTabBar />
    </View>
  );
};
