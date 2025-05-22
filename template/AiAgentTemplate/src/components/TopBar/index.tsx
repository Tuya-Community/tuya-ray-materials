import React, { ReactNode, FC } from 'react';
import { getDevInfo, View, navigateBack } from '@ray-js/ray';
import { Icon } from '@ray-js/svg';
import { useSelector } from 'react-redux';

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
  /**
   * 是否显示返回区域的箭头，也可以传入 ReactNode 进行自定义
   */
  backArrow?: ReactNode | boolean;
  /**
   * 左侧内容，渲染在返回区域的右侧
   */
  left?: ReactNode;
  /**
   * 右侧内容
   */
  right?: ReactNode;
  /**
   * 点击返回区域后的回调
   */
  onBack?: () => void;
}

function BackIcon() {
  const iconBack =
    'M770.673778 21.959111a56.888889 56.888889 0 0 1 0 80.440889l-402.204445 402.318222 402.204445 402.204445a56.888889 56.888889 0 0 1-80.440889 80.497777L247.751111 544.938667a56.888889 56.888889 0 0 1 0-80.497778L690.232889 21.959111a56.888889 56.888889 0 0 1 80.440889 0z';

  return (
    <Icon
      d={iconBack}
      size="17px"
      style={{
        opacity: '0.9',
      }}
    />
  );
}

export const TopBar: FC<TopBarProps> = ({
  title = getDevInfo().name,
  backArrow = true,
  left,
  right,
  onBack,
  textColor = '#000',
  backgroundColor = '#fff',
}) => {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigateBack({});
  };

  return (
    <View className={styles.topbarWrap} style={{ backgroundColor, color: textColor }}>
      <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View className={styles.topbar}>
        <View className={styles.left} onClick={handleBack}>
          <View className={styles.back}>{backArrow === true ? <BackIcon /> : backArrow}</View>

          {left}
        </View>
        <View className={styles.title}>{title}</View>
        <View className={styles.right}>{right}</View>
      </View>
    </View>
  );
};

export default TopBar;
