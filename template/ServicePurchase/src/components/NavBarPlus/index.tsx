/**
 * @file NavBarPlus/index.tsx
 * @brief Custom navigation bar with back button, right-side action icons,
 *        and a scroll-aware title visibility hook.
 */

import React, { useCallback, useState } from "react";
import cls from "classnames";
import { View } from "@ray-js/ray";
import throttle from "lodash/throttle";
import Icon, { IconType } from "../Icon";
import { routerBackClose } from "@/utils/navigate";
import { useSystemContext } from "@/hooks";
import styles from "./index.module.less";

export const HEADER_HEIGHT = 44;

interface Props {
  className?: string;
  wrapperStyle?: React.CSSProperties;
  wrapperClassName?: string;
  onRightClick?: (key: string) => void;
  onBackClick?: () => void;
  rightIcons?: {
    key: string;
    icon: IconType;
  }[];
  navZIndex?: number;
}

const NavBarPlus: React.FC<Props> = (props) => {
  const {
    onBackClick,
    wrapperStyle,
    wrapperClassName,
    rightIcons,
    onRightClick,
    navZIndex = 98,
    className,
  } = props;
  const system = useSystemContext();

  return (
    <View
      className={cls(styles.navBar, className)}
      style={{
        "--status-bar-height": `${system.statusBarHeight}px`,
      }}
    >
      <View className={cls(styles.wrapper, wrapperClassName)} style={wrapperStyle} />

      {/* 返回按钮 */}
      <View
        className={cls(styles.navWarp, styles.backWarp)}
        onClick={() => {
          if (onBackClick) {
            onBackClick();
          } else {
            routerBackClose();
          }
        }}
        style={{ top: `${system.statusBarHeight}px`, zIndex: navZIndex }}
      >
        <View className={cls(styles.navBtn, styles.backBtn)}>
          <Icon type="back" size={24} />
        </View>
      </View>

      {rightIcons?.map((item, index) => {
        return (
          <View
            key={item.key}
            className={cls(styles.navWarp, styles.rightWarp, styles[`rightBtnPosition_${index}`])}
            style={{ top: `${system.statusBarHeight}px`, zIndex: navZIndex }}
            onClick={() => onRightClick?.(item.key)}
          >
            <View className={cls(styles.navBtn, styles.rightBtn)}>
              <Icon type={item.icon} size={24} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export const useTitleScrollShow = (
  height: number,
): [boolean, (e: { detail: { scrollTop: number } }) => void] => {
  const [showTitle, setShowTitle] = useState(false);
  const throttledScrollCheck = useCallback(
    throttle((scrollTop: number) => {
      setShowTitle(scrollTop > height);
    }, 16),
    [],
  );

  const onScrollViewChange = useCallback(
    (e: { detail: { scrollTop: number } }) => {
      const { scrollTop } = e.detail;
      throttledScrollCheck(scrollTop);
    },
    [throttledScrollCheck],
  );
  return [showTitle, onScrollViewChange];
};

export default NavBarPlus;
