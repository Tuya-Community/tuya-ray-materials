/* eslint-disable import/no-cycle */
import React from 'react';
import clsx from 'clsx';
import { View } from '@ray-js/ray';
import { useTransparentTopbar } from '@/hooks/useTransparentTopbar';
import styles from './index.module.less';

interface Props {
  active?: number;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ active, children }) => {
  useTransparentTopbar();

  const hasTabbar = typeof active === 'number';

  return (
    <View className={styles.view}>
      <View className={clsx(styles.content, !hasTabbar && styles.content_full)}>{children}</View>
    </View>
  );
};
