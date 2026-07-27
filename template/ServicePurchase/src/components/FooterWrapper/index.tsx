import React from "react";
import { View } from "@ray-js/ray";
import styles from "./index.module.less";

const FooterWrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return <View className={styles.footer}>{children}</View>;
};

export default FooterWrapper;
