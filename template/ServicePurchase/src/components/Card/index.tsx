import React from "react";
import { View } from "@ray-js/ray";
import styles from "./index.module.less";

interface CardProps {
  children: React.ReactNode;
  padding?: "p-16-16" | "p-24-16" | "p-32-24" | "p-48-32";
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, padding = "p-16-16", style }) => {
  return (
    <View className={`${styles.card} ${styles[padding]}`} style={style}>
      {children}
    </View>
  );
};

export default Card;
