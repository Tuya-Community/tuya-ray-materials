import React, { useState } from 'react';
import { View } from '@ray-js/ray';
import clsx from 'clsx';
import { Button } from '@ray-js/smart-ui';
import Styles from './index.module.less';

interface ITabItem {
  key: string;
  show: boolean;
  title: string;
  component: React.FC;
}

interface IProps {
  activeKey: string;
  tabs: ITabItem[];
  changeActiveKey: (key: string) => void;
}

export const PublicTabs: React.FC<IProps> = (props: IProps) => {
  const { activeKey = 'ptz', tabs, changeActiveKey } = props;

  const showTabs = tabs.filter(item => item.show);

  return (
    <View className={clsx(Styles.tabsContainer)}>
      <View
        className={clsx(
          Styles.tabMenuContainer,
          showTabs.length === 1 && Styles.tabSingleMenuContainer
        )}
      >
        {showTabs.length === 1 && (
          <View className={clsx(Styles.singleTabItem)}>{showTabs[0].title}</View>
        )}

        {showTabs.length > 1 &&
          showTabs.map((item, index) => (
            <View
              key={item.key}
              onClick={() => changeActiveKey(item.key)}
              className={clsx(Styles.tabMenuItem, {
                [Styles.activeTabMenuItem]: activeKey === item.key,
              })}
            >
              {item.title}
            </View>
          ))}
      </View>
      {/* 内容区域 */}
      <View className={Styles.tabContentContainer}>
        {showTabs.length > 1
          ? showTabs.filter(item => item.key === activeKey)[0].component({})
          : showTabs[0].component({})}
      </View>
    </View>
  );
};
