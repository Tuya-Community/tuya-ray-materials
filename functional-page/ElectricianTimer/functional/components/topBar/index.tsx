/* eslint-disable react/require-default-props */
import React, { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { View, Text, hideMenuButton, router, exitMiniProgram } from '@ray-js/ray';

import clsx from 'clsx';
import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';
import { Icon, NavBar } from '@ray-js/smart-ui';
import { Left } from '@tuya-miniapp/icons';
import { debounce } from '@/utils';
import styles from './index.module.less';

interface IPorps {
  onBack?: () => void;
  backText?: string;
  menuText?: ReactNode;
  menuClassName?: string;
  onMenuClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
  title: string;
}

const TopBar: FC<IPorps> = (props) => {
  const {
    style,
    titleStyle,
    title = '',
    titleClassName,
    className,
    menuText,
    backText,
    menuClassName,
    onBack,
    onMenuClick,
  } = props;
  const system = getCachedSystemInfo();

  const topbarStyle = useMemo(() => {
    return {
      ...style,
      paddingTop: `${system.statusBarHeight}px`,
    };
  }, [system.statusBarHeight, style]);

  const handleBack = useCallback(
    debounce(() => {
      if (onBack) {
        onBack();
      } else {
        const pages = getCurrentPages();
        if (pages.length === 1) {
          exitMiniProgram();
        } else {
          router.back();
        }
      }
    }),
    [onBack],
  );

  const handleMenu = useCallback(
    debounce(() => {
      if (onMenuClick) {
        onMenuClick();
      }
    }),
    [onMenuClick],
  );

  useEffect(() => {
    hideMenuButton();
  }, []);
  return (
    <View className={clsx(styles.topBar, className)} style={topbarStyle}>
      <View className={clsx(styles.btn, !!backText && styles.textBtn)} onClick={handleBack}>
        {backText ? <Text>{backText}</Text> : <Icon name={Left} size="56rpx" />}
      </View>
      <View className={clsx(styles.title, titleClassName)} style={titleStyle}>
        {title}
      </View>
      <View className={clsx(styles.btn, !!menuText && styles.textBtn, menuClassName)} onClick={handleMenu}>
        {menuText || null}
      </View>
    </View>
  );
};

export default TopBar;
