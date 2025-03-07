import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { getDevInfo, Text, View } from '@ray-js/ray';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import styles from './index.module.less';

export interface TopBarProps {
  /**
   * 标题
   */
  title?: string;
  /**
   * 字体颜色
   */
  textColor?: string;
  /**
   * 背景颜色
   */
  backgroundColor?: string;
}

const HomeTopBar: FC<TopBarProps> = ({
  title = getDevInfo().name,
  textColor = '#000',
  backgroundColor = '#fff',
}) => {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));

  return (
    <View className={styles.topbarWrap} style={{ backgroundColor, color: textColor }}>
      <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View className={styles.topbar}>
        <Text className={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default HomeTopBar;
