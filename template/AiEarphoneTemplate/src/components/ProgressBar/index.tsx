/*
 * @Author: hkc
 * @Date: 2025-11-25 14:19:15
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-05 11:55:16
 * @Description: 进度条组件
 */
import React from 'react';
import { View } from '@ray-js/ray';
import ProgressBar from '@ray-js/components-ty-progress-bar';
import clsx from 'clsx';

import styles from './index.module.less';

interface IProps {
  style?: React.CSSProperties;
  percent?: number;
  width?: string;
  height?: string;
  trackColor?: string;
  fillColor?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

const Index: React.FC<IProps> = props => {
  const {
    style,
    percent,
    width,
    height = '24px',
    left,
    right,
    trackColor = '#F0F0F0',
    fillColor = '#3678E3',
    className,
  } = props;
  return (
    <View className={clsx(styles.container, className)} style={{ width, height, ...style }}>
      <ProgressBar
        percent={percent}
        width={width}
        height={height}
        trackColor={trackColor}
        fillColor={fillColor}
        style={{
          borderRadius: '16px',
        }}
      />
      <View className={styles.inner}>
        <View className={styles.left}>{left}</View>
        <View className={styles.right}>{right}</View>
      </View>
    </View>
  );
};

export default Index;
