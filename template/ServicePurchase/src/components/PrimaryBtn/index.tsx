import React from "react";
import { View } from "@ray-js/ray";
import cls from "classnames";
import { LoadingIcon } from "../Icon";
import styles from "./index.module.less";

interface Props {
  loading?: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  children: React.ReactNode;
}

const PrimaryBtn: React.FC<Props> = ({
  onClick,
  loading,
  children,
  className,
  style,
  disabled,
}) => {
  return (
    <View
      className={cls(
        `clickable-mini ${styles.footerBtn}`,
        { [styles.disabled]: disabled },
        className,
      )}
      style={style}
      onClick={() => {
        if (disabled) {
          return;
        }
        onClick();
      }}
    >
      {loading && <LoadingIcon size={20} color="#fff" style={{ marginRight: "4px" }} noInverse />}
      {!loading && children}
    </View>
  );
};

export default PrimaryBtn;
