/*
 * @Author: hkc
 * @Date: 2025-10-13 14:30:25
 * @LastEditors: hkc
 * @LastEditTime: 2026-02-11 16:13:24
 * @Description: 顶部导航栏
 */
import React, { FC } from 'react';
import { NavBar, SmartNavBar } from '@ray-js/smart-ui';
import { router } from '@ray-js/ray';
import clsx from 'clsx';

import leftArrowIcon from '@tuya-miniapp/icons/dist/svg/Left';
import downIcon from '@tuya-miniapp/icons/dist/svg/Down';

import styles from './index.module.less';

// 返回按钮内置图标预设：left 默认左箭头，down 向下箭头（录音页使用）
const LEFT_ICON_MAP = {
  left: leftArrowIcon,
  down: downIcon,
} as const;

type LeftIconType = keyof typeof LEFT_ICON_MAP;

interface IProps extends SmartNavBar {
  type?: 'custom' | 'system' | undefined; // 是否需要阻止回退，type为custom时，点击返回按钮不执行onBack回调
  onBack?: () => void;
  isDark?: boolean; // 是否一直是深色模式
  ignoreSyncing?: boolean; // 忽略同步状态
  leftIconType?: LeftIconType; // 返回按钮图标预设，默认 left；leftIcon 优先级更高
}

const TopBar: FC<IProps> = ({
  leftArrow = true,
  onBack,
  isDark,
  customClass,
  leftIcon,
  leftIconType = 'left',
  ...restProps
}) => {
  const onClickLeft = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <NavBar
      {...restProps}
      customClass={clsx(styles.navBar, customClass, {
        [styles.navBarDark]: isDark,
      })}
      leftIcon={leftArrow ? leftIcon ?? LEFT_ICON_MAP[leftIconType] : ''}
      onClickLeftIcon={onClickLeft}
    />
  );
};

export default React.memo(TopBar);
