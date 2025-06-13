import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Grid, GridItem, Switch, Popup, ActionSheet } from '@ray-js/smart-ui';
import { Text, View, ScrollView, usePageEvent, router } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { useMount, useEventEmitter } from 'ahooks';
import clsx from 'clsx';
import {
  publishDpOutTime,
  getDpCodeByDpId,
  clearPublishDpOutTime,
  changePanelInfoState,
} from '@/utils';
import { devices } from '@/devices';
import { selectPanelInfoByKey, EventName } from '@/redux/modules/panelInfoSlice';
import { IconFont, LayoutHeader } from '@/components';
import { componentMap } from '@/config/componentMap';
import Strings from '@/i18n';
import Styles from './index.module.less';
import { initData, FeatureMenu, FeatureType } from './configData';

const Feature = () => {
  const [featureData, setFeatureData] = useState<FeatureMenu[]>(initData);
  const { status: showSmartPopup, popupData } = useSelector(selectPanelInfoByKey('showSmartPopup'));
  const devInfo = useDevice(device => device.devInfo);
  const isPreviewOn = useSelector(selectPanelInfoByKey('isPreviewOn'));
  const { status: showActionSheet, actionData } = useSelector(
    selectPanelInfoByKey('showSmartActionSheet')
  );
  // 嵌套涉及布局定位的组件时渲染异常, 进行标记
  const [isReady, setIsReady] = useState(false);
  const featureDataRef = useRef(featureData);
  // 品牌色
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  const customEventDispatch = useSelector(selectPanelInfoByKey('customEventDispatch'));

  usePageEvent('onLoad', () => {
    // 隐藏胶囊
    ty.hideMenuButton();
  });

  // 针对自主触发事件监听
  useEffect(() => {
    const { eventName, data: eventData } = customEventDispatch;
    console.log(eventName, 'eventName');
    console.log(EventName.EnumDpChange);
    if (eventName === EventName.EnumDpChange) {
      // 预留
      console.log(eventData, 'eventData');
    }
  }, [customEventDispatch]);

  useEffect(() => {
    featureDataRef.current = featureData;
  }, [featureData]);

  // 初始化featureData
  const initFeatureDataMethod = useCallback(async () => {
    const updatedFeatureData = await Promise.all(
      featureData.map(async item => {
        // 数据是否可见异步执行
        const isVisible = (await item.visibilityCondition?.()) || item.isVisible;
        // Icon可见异步执行
        const showIcon = (await item.iconVisibilityCondition?.()) || item.showIcon;
        // DpValue值变更异步执行
        const initValue = await item.initDpValue?.();
        const dpValue = typeof initValue !== 'undefined' ? initValue : item.dpValue;
        return { ...item, isVisible, showIcon, dpValue };
      })
    );
    setFeatureData(updatedFeatureData as FeatureMenu[]);
  }, [featureData]);

  const onDpDataChangeCallback = useCallback(
    data => {
      // 添加featureData的变更监听，确保拿到最新的值
      const { dps } = data;
      const dpsArray = Object.keys(dps);
      dpsArray.forEach(value => {
        const dpCode = getDpCodeByDpId(Number(value));
        const findFeature = featureData.find(item => item.dpCode === dpCode);
        // 如果dpCode存在，则更新dpValue
        if (findFeature) {
          // 更新当前的功能data对应值
          findFeature.listen &&
            findFeature.dpListenCallback &&
            findFeature.dpListenCallback(dps[value], findFeature);
          findFeature.dpValue = dps[value];
          // 监听到上报后，在dp监听之后还原其是否点击的标记状态
          findFeature.hasClick = false;
          const updateFeatureData = featureDataRef.current.map(item =>
            item.key === findFeature.key ? findFeature : item
          );
          setFeatureData(updateFeatureData);
        }
      });
    },
    [featureData]
  );

  useEffect(() => {
    const id = devices.common.onDpDataChange(onDpDataChangeCallback);
    return () => {
      devices.common.offDpDataChange(id);
    };
  }, [onDpDataChangeCallback]);

  useMount(() => {
    initFeatureDataMethod();
  });

  // const onChange = (value, targetData) => {
  //   const { dpCode } = targetData;
  //   sendDpCodeRef.current = dpCode;
  //   publishDpOutTime(dpCode, value);
  // };

  const onLeftClick = () => {
    router.back();
  };

  const onClose = () => {
    changePanelInfoState('showSmartPopup', { status: false, popupData: null });
  };
  const onCancelActionSheet = () => {
    changePanelInfoState('showSmartActionSheet', { status: false, actionData: null });
  };

  const onSelectActionSheet = event => {
    const { dpCode, id, type } = event.detail;
    type === 'dp' && publishDpOutTime(dpCode, id);
    const newActionData = actionData.map(item => ({
      ...item,
      checked: item.id === id,
    }));
    // 点击后直接选中某项数据，组件有问题，暂时不能选中

    changePanelInfoState('showSmartActionSheet', { status: true, actionData: newActionData });
    type === 'dp' &&
      changePanelInfoState('customEventDispatch', {
        eventName: 'enumDpChange',
        data: {
          dpCode,
          dpValue: id,
        },
      });
  };

  return (
    <View className={clsx(Styles.layoutContainer)}>
      <LayoutHeader
        title={Strings.getLang('homeFeatureMore')}
        onLeftClick={onLeftClick}
        style={{ backgroundColor: 'transparent' }}
      />
      <View className={clsx(Styles.layoutContent)}>
        <Grid
          columnNum={3}
          gutter="16rpx"
          border={false}
          clickable
          square
          center={false}
          customClass={clsx(Styles.gridContainer)}
        >
          {featureData
            .filter(item => item.isVisible)
            .map((item, index) => (
              <GridItem
                useSlot
                key={item.key}
                contentClass={clsx(Styles.gridItemContent)}
                style={{
                  opacity:
                    (!isPreviewOn && !item.notPreviewAvailable) ||
                    (!devInfo.isOnline && !item.offlineAvailable)
                      ? 0.5
                      : 1,
                }}
                onClick={() => {
                  if (
                    (!isPreviewOn && !item.notPreviewAvailable) ||
                    (!devInfo.isOnline && !item.offlineAvailable)
                  ) {
                    return false;
                  }
                  // 标记当前点击项
                  const featureItem = { ...item, hasClick: true };
                  const updateFeatureData = featureData.map(item =>
                    item.key === featureItem.key ? featureItem : item
                  );
                  setFeatureData(updateFeatureData);
                  item.onClick && item.onClick(featureItem);
                  return false;
                }}
              >
                <View className={clsx(Styles.itemContainer)}>
                  <View className={clsx(Styles.itemIconWrapper)}>
                    <IconFont icon={item.icon} otherClassName={clsx(Styles.itemIcon)} />
                  </View>
                  <View className={clsx(Styles.itemContentWrapper)}>
                    <View className={clsx(Styles.itemContent)}>
                      <View className={clsx(Styles.itemInfoWrapper)}>
                        <View className={clsx(Styles.itemLabel)}>
                          <Text>{item.title}</Text>
                        </View>
                        <View className={clsx(Styles.itemTypeWrapper)}>
                          {item.type !== FeatureType.bool && (
                            <IconFont
                              icon="right-arrow"
                              otherClassName={clsx(Styles.itemArrowIcon)}
                            />
                          )}
                          {item.type === FeatureType.bool && (
                            <View
                              className={clsx(Styles.switchContainer)}
                              style={{ ...(item.dpValue && { backgroundColor: brandColor }) }}
                            >
                              <IconFont
                                icon="switch"
                                otherClassName={clsx(Styles.switchIcon)}
                                style={{
                                  ...(item.dpValue && {
                                    color: '#ffffff',
                                  }),
                                }}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </GridItem>
            ))}
        </Grid>
      </View>
      <Popup
        show={showSmartPopup}
        // closeable
        // closeIconPosition="top-left"
        position="bottom"
        safeAreaInsetBottom={false}
        customStyle={{ minHeight: `${400}rpx` }}
        onClose={onClose}
        onAfterEnter={() => setIsReady(true)}
        onAfterLeave={() => setIsReady(false)}
      >
        <View>
          {popupData?.componentKey &&
            isReady &&
            React.createElement(componentMap[popupData.componentKey], { title: popupData.title })}
        </View>
      </Popup>
      <ActionSheet
        show={showActionSheet}
        actions={actionData}
        cancelText={Strings.getLang('actionSheetCancel')}
        onCancel={onCancelActionSheet}
        onSelect={onSelectActionSheet}
      />
    </View>
  );
};

export default Feature;
