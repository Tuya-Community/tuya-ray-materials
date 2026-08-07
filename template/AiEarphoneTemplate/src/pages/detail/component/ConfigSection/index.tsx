import React from 'react';
import { View } from '@ray-js/ray';
import styles from './index.module.less';

interface ConfigSectionProps {
  title: string;
  children: React.ReactNode;
  customClass?: string;
}

/**
 * 可复用的配置区块组件
 */
const ConfigSection: React.FC<ConfigSectionProps> = ({ title, customClass, children }) => {
  return (
    <View className={`${styles.configSection} ${customClass}`}>
      <View className={styles.sectionTitle}>{title}</View>
      {children}
    </View>
  );
};

export default ConfigSection;
