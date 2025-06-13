import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Grid, GridItem } from '@ray-js/smart-ui';
import { View } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { useMount } from 'ahooks';
import clsx from 'clsx';
import { getDpCodeByDpId } from '@/utils';
import { devices } from '@/devices';
import { selectPanelInfoByKey, EventName } from '@/redux/modules/panelInfoSlice';
import Strings from '@/i18n';
import { IconFont } from '../icon-font';
import { SectionTitle } from '../section-title';
import Styles from './index.module.less';
import { initData, FeatureMenu, FeatureType } from './configData';

interface Props {
  vasLength: number;
}

export const LayoutFeature = (props: Props) => {
  const { vasLength } = props;
  const [featureData, setFeatureData] = useState<FeatureMenu[]>(initData);
  const devInfo = useDevice(device => device.devInfo);
  const featureDataRef = useRef(featureData);
  // 品牌色
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  // 是否为预览状态
  const isPreviewOn = useSelector(selectPanelInfoByKey('isPreviewOn'));
  const customEventDispatch = useSelector(selectPanelInfoByKey('customEventDispatch'));

  // 针对自主触发事件监听
  useEffect(() => {
    const { eventName, data: eventData } = customEventDispatch;
    console.log(EventName.EnumDpChange);
    if (eventName === EventName.EnumDpChange) {
      // 预留
      console.log(eventData, 'eventData');
    }
  }, [customEventDispatch]);

  // useEffect(() => {
  //   featureDataRef.current = featureData;
  // }, [featureData]);
  if (featureDataRef.current !== featureData) {
    featureDataRef.current = featureData;
  }

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

  return (
    <View className={clsx(Styles.comContainer, vasLength > 0 && Styles.comNoPaddingTop)}>
      <SectionTitle title={Strings.getLang('homeFeatureSectionTitle')} icon="gongnengshezhi" />
      <View className={clsx(Styles.contentContainer)}>
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
                        <View className={clsx(Styles.itemLabel)}>{item.title}</View>
                        <View className={clsx(Styles.itemTypeWrapper)}>
                          {item.type !== FeatureType.bool && (
                            <IconFont icon="right-arrow" otherClassName={clsx(Styles.itemIcon)} />
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
    </View>
  );
};
