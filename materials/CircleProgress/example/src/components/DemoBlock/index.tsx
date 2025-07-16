import React from 'react';
import { View, Text } from '@ray-js/ray';
import styles from './index.module.less';

const DemoBlock = ({ title, children, style }) => (
  <View className={styles.demoBlock} style={style}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
    <View
      style={{
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginTop: 22,
        marginBottom: 22,
      }}
    />
  </View>
);

export default DemoBlock;
