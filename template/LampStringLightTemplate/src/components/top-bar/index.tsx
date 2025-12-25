import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavBar } from '@ray-js/smart-ui';
import {
  Text,
  View,
  getCurrentPages,
  Image,
  exitMiniProgram,
  navigateBack,
  hideMenuButton,
  showMenuButton,
} from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import classnames from 'classnames';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { useIsInIDE } from '@/hooks/useIsInIDE';

import Styles from './index.module.less';

type TProps = {
  title?: string;
  titleClassName?: string;
  cancelClassName?: string;
  rightClassName?: string;
  isShowMenu?: boolean;
  isShowLeft?: boolean;
  isShowRight?: boolean;
  rightTitle?: string;
  onRightClick?: () => void;
  onLeftClick?: () => void;
  leftText?: string;
  disableLeftBack?: boolean;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
};

export const TopBar = (props: TProps) => {
  const {
    title,
    isShowMenu = true,
    isShowLeft = true,
    isShowRight = true,
    rightTitle,
    leftText,
    titleClassName,
    rightClassName,
    onRightClick,
    disableLeftBack = false,
  } = props;
  const [isHome, setIsHome] = useState(true);

  useEffect(() => {
    const pages = getCurrentPages();
    // @ts-ignore
    if (pages?.length > 1) {
      setIsHome(false);
      return;
    }
    setIsHome(true);
  }, []);

  useEffect(() => {
    if (!isShowMenu) {
      hideMenuButton();
    }
    return () => {
      if (isShowMenu) {
        showMenuButton();
      }
    };
  }, [isShowMenu]);

  const handleLeftClick = () => {
    props.onLeftClick && props.onLeftClick();
    if (disableLeftBack) {
      return;
    }
    if (isHome) {
      exitMiniProgram();
      return;
    }
    navigateBack();
  };

  const handleRightClick = () => {
    onRightClick && onRightClick();
  };

  return (
    <View className={Styles.topBarWrap}>
      <NavBar
        title={title}
        titleClass={titleClassName}
        leftText={isShowLeft ? leftText || '' : ''}
        leftArrow={isShowLeft && !leftText}
        rightText={isShowRight ? rightTitle || '' : ''}
        rightTextClass={isShowRight ? rightClassName : ''}
        onClickLeftText={handleLeftClick}
        onClickLeftIcon={handleLeftClick}
        onClickRightText={handleRightClick}
      />
    </View>
  );
};

export default TopBar;
