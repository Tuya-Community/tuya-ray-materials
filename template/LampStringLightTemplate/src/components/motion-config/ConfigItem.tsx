import { Text, View } from '@ray-js/ray';
import React from 'react';
import { ControlTabs, ControlTabsProps } from '../control-tabs';
import styles from './index.module.less';

export const ConfigItem: React.FC<{
  value: any;
  onChange(value: any): void;
  tabs: ControlTabsProps['tabs'];
  title: string;
}> = ({ value, onChange, tabs, title }) => {
  return (
    <View>
      <View>
        <Text className={styles.cardSubTitle}>{title}</Text>
      </View>
      <View style={{ marginTop: '32rpx' }}>
        <ControlTabs activeKey={value} onChange={onChange} tabs={tabs} />
      </View>
    </View>
  );
};
