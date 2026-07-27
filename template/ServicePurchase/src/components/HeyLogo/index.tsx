import React from "react";
import cls from "classnames";
import { View } from "@ray-js/ray";
import styles from "./index.module.less";

interface Props {
  sizeRpx?: number;
  className?: string;
  style?: React.CSSProperties;
}

const HeyLogo: React.FC<Props> = (props) => {
  const { sizeRpx = 128, className, style } = props;

  return (
    <View
      className={cls(styles.logo, className)}
      style={{ width: `${sizeRpx}rpx`, height: `${sizeRpx}rpx`, ...style }}
    />
  );
};

export default HeyLogo;
