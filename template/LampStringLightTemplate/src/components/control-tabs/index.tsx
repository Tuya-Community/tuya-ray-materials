import Tabs from '@ray-js/components-ty-tabs';
import React, { useEffect, useState } from 'react';

export interface ControlTabsProps {
  activeKey: string;
  onChange?: (key: string) => void;
  tabs: Array<{ tabKey: string; tab: string }>;
}

export const ControlTabs: React.FC<ControlTabsProps> = ({ activeKey, onChange, tabs }) => {
  return (
    <Tabs.SegmentedPicker
      key={tabs?.length}
      activeKey={activeKey}
      style={{
        background: '#303030',
        borderRadius: '12px',
      }}
      borderRadius="10px"
      padding={8}
      onChange={tab => {
        onChange(tab);
      }}
      tabBarUnderlineStyle={{
        backgroundColor: '#1082FE',
      }}
      height="40px"
      tabTextStyle={{
        fontWeight: '600',
        fontSize: '24rpx',
        opacity: 1,
        color: '#fff',
      }}
      tabActiveTextStyle={{
        fontWeight: '600',
        color: '#fff',
        fontSize: '24rpx',
      }}
    >
      {tabs.map(item => (
        <Tabs.TabPanel key={item.tabKey} tabKey={item.tabKey} tab={item.tab} />
      ))}
    </Tabs.SegmentedPicker>
  );
};
