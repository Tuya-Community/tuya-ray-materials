/*
 * @Author: hkc
 * @Date: 2025-11-25 19:49:41
 * @LastEditors: hkc
 * @LastEditTime: 2025-11-25 20:28:39
 * @Description: 悬浮按钮
 */
import { View } from '@ray-js/ray';
import React from 'react';
import clsx from 'clsx';
import ThemedImage from '@/components/ThemedImage';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  icon: string;
  onClick: () => void;
  className?: string;
  iconName?: string;
}

const Index: React.FC<IProps> = ({ icon, onClick, className, show, iconName }) => {
  return (
    <View className={clsx(styles.container, className, { [styles.show]: show })} onClick={onClick}>
      <ThemedImage src={icon} className={styles.icon} imageName={iconName || ''} />
    </View>
  );
};

export default Index;
