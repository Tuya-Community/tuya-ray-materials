import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Text, View } from '@ray-js/ray';
import clsx from 'clsx';
import { useMount } from 'ahooks';
import { useSelector } from 'react-redux';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import { useDevice } from '@ray-js/panel-sdk';
import { IconFont } from '../icon-font';
import Styles from './index.module.less';
import { initData, TabBar } from './configData';
import { Intercom } from './components';

export const FeatureTabBar: React.FC = () => {
  // 定义tabData状态，初始值为initData
  const [tabData, setTabData] = useState<TabBar[]>(initData);
  // 定义tabDataRef引用，初始值为tabData
  const tabDataRef = useRef(tabData);
  // 获取设备信息
  const devInfo = useDevice(device => device.devInfo);
  // 获取品牌颜色
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  // 获取预览状态
  const isPreviewOn = useSelector(selectPanelInfoByKey('isPreviewOn'));

  // 当tabData变化时，更新tabDataRef的值
  useEffect(() => {
    tabDataRef.current = tabData;
  }, [tabData]);

  // // 更新tabData的方法
  // const updateTabData = data => {
  //   return data.map(item => {
  //     const isVisible = item.visibilityCondition();
  //     const showIcon = item.iconVisibilityCondition();
  //     console.log(isVisible.then(visible => visible));
  //     return {
  //       ...item,
  //       isVisible: isVisible.then(visible => visible),
  //       showIcon: showIcon.then(iconVisible => iconVisible),
  //     };
  //   });
  // };

  // // 使用useMemo缓存更新后的tabData
  // const updatedData = useMemo(() => updateTabData(tabData), [tabData]);

  // 初始化featureData的方法
  const initTabDataMethod = useCallback(async () => {
    const updatedTabData = await Promise.all(
      tabData.map(async item => {
        // 数据是否可见异步执行
        const isVisible = (await item.visibilityCondition?.()) || item.isVisible;
        return { ...item, isVisible };
      })
    );
    setTabData(updatedTabData as TabBar[]);
  }, [tabData]);

  // 在组件挂载时执行initTabDataMethod
  useMount(() => {
    initTabDataMethod();
  });

  // 当tabData没有变化时，visibleTabs 的值不会重新计算
  const visibleTabs = useMemo(() => {
    return tabData.filter(item => item.isVisible);
  }, [tabData]);

  // 点击tabItem的方法
  const handleClick = useCallback(
    item => {
      if (
        (!isPreviewOn && !item.notPreviewAvailable) ||
        (!devInfo.isOnline && !item.offlineAvailable)
      ) {
        return false;
      }
      item.onPress && item.onPress(item);
      return false;
    },
    [isPreviewOn, devInfo.isOnline]
  );

  // 可见tabItem的数量
  const visibleTabsLength = visibleTabs.length;
  // 是否有中间tabItem
  const hasCenter = visibleTabsLength >= 3 || visibleTabsLength === 1;

  return (
    <View className={clsx(Styles.comContainer)}>
      {visibleTabs.map((item, index) => {
        if (item.key === 'intercom' && hasCenter) {
          return (
            <View
              key={item.key}
              className={clsx(Styles.tabItemContent, Styles.tabItemCenterContent)}
              onClick={() => handleClick(item)}
            >
              <Intercom
                className={clsx(
                  Styles.tabCenterInterComWrap,
                  ((!isPreviewOn && !item.notPreviewAvailable) ||
                    (!devInfo.isOnline && !item.offlineAvailable)) &&
                    Styles.disableTabItem
                )}
                // disabled={
                //   (!isPreviewOn && !item.notPreviewAvailable) ||
                //   (!devInfo.isOnline && !item.offlineAvailable)
                // }
              />
            </View>
          );
        }

        return (
          <View
            key={item.key}
            onClick={() => handleClick(item)}
            className={clsx(
              Styles.tabItem,
              item.isCenter && hasCenter && Styles.centerTabItem,
              visibleTabs.length >= 3 && index === 0 && 'padding-right-29',
              visibleTabs.length >= 3 && index === 2 && 'padding-left-29'
            )}
          >
            <View
              className={clsx(
                Styles.tabItemContent,
                item.isCenter && hasCenter && Styles.tabItemCenterContent,
                ((!isPreviewOn && !item.notPreviewAvailable) ||
                  (!devInfo.isOnline && !item.offlineAvailable)) &&
                  !item.isCenter &&
                  Styles.disableTabItem
              )}
            >
              {item.key !== 'intercom' && (
                <View
                  className={clsx(
                    Styles.tabItemIconContainer,
                    item.isCenter && hasCenter && Styles.tabItemIconCenterContainer
                  )}
                  style={item.isCenter && hasCenter && { backgroundColor: brandColor }}
                >
                  {item.showIcon && (
                    <IconFont
                      icon={item.icon}
                      otherClassName={clsx(
                        Styles.tabIcon,
                        item.isCenter && hasCenter && Styles.tabCenterIcon
                      )}
                    />
                  )}
                </View>
              )}
              {item.key === 'intercom' && (
                <View
                  className={clsx(
                    Styles.tabItemIconContainer,
                    item.isCenter && hasCenter && Styles.tabItemIconCenterContainer
                  )}
                  style={item.isCenter && hasCenter && { backgroundColor: brandColor }}
                >
                  <Intercom
                    className={clsx(
                      ((!isPreviewOn && !item.notPreviewAvailable) ||
                        (!devInfo.isOnline && !item.offlineAvailable)) &&
                        Styles.disableTabItem
                    )}
                    iconClassName={clsx(Styles.intercomIcon)}
                    intercomClassName={clsx(Styles.intercomContainer)}
                    mode="other"
                    talkingColor={brandColor}
                    widthScale={0.11}
                    heightScale={0.12}
                  />
                </View>
              )}
              {(!item.isCenter || !hasCenter) && (
                <Text
                  className={clsx(
                    Styles.tabLabel,
                    ((!isPreviewOn && !item.notPreviewAvailable) ||
                      (!devInfo.isOnline && !item.offlineAvailable)) &&
                      Styles.disableTabItem
                  )}
                >
                  {item.label}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};
