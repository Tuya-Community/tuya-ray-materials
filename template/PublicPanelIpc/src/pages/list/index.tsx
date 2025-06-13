// 列表配置类界面
import React, { useEffect, useState, useCallback } from 'react';
import { View, usePageEvent, router } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { Popup, ActionSheet, Cell, CellGroup, Switch } from '@ray-js/smart-ui';
import { IconFont, LayoutHeader } from '@/components';
import { devices } from '@/devices';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import { changePanelInfoState, publishDpOutTime, getDpCodeByDpId } from '@/utils';
import Strings from '@/i18n';
import { useMount, useMemoizedFn } from 'ahooks';
import clsx from 'clsx';
import _groupBy from 'lodash/groupBy';
import _uniqBy from 'lodash/uniqBy';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import styles from './index.module.less';
import { listData, FeatureMenu, FeatureType } from './configData';

const List = props => {
  const { title, key = 'cruise' } = props?.location?.query;
  const [isReady, setIsReady] = useState(false);

  // 功能平铺数据
  const [featureData, setFeatureData] = useState<FeatureMenu[]>(listData[key]);
  // 品牌色
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  // 对原数据进行分类
  const combineFeatureData = data => {
    const groupByData = _groupBy(data, 'groupKey');
    const finalFeatureData = _map(groupByData, (value, key) => ({
      groupKey: key,
      data: _filter(value, item => item.isVisible),
    }));

    return finalFeatureData;
  };
  // 页面分类数据
  const [combineData, setCombineData] = useState(combineFeatureData(listData[key]));
  // 初始化featureData
  const initFeatureDataMethod = useMemoizedFn(async () => {
    const updatedFeatureData = await Promise.all(
      featureData.map(async item => {
        // 数据是否可见异步执行
        const isVisible = (await item.visibilityCondition?.()) || item.isVisible;
        const showCheckedIcon =
          (await item.checkedIconVisibilityCondition?.()) || item.showCheckedIcon;
        // DpValue值变更异步执行
        const initValue = await item.initDpValue?.();
        const dpValue = typeof initValue !== 'undefined' ? initValue : item.dpValue;
        console.log(dpValue, 'dpValue====');
        let value = '';
        if (item.type === FeatureType.enum) {
          value = dpValue !== '' && Strings.getLang(`dp_${item.dpCode}_${dpValue}`);
        }
        return { ...item, isVisible, dpValue, value, showCheckedIcon };
      })
    );
    setFeatureData(updatedFeatureData as FeatureMenu[]);
  });

  const { status: showSmartPopup, popupData } = useSelector(selectPanelInfoByKey('showSmartPopup'));
  const { status: showActionSheet, actionData } = useSelector(
    selectPanelInfoByKey('showSmartActionSheet')
  );
  // 页面加载出来异步获取
  useMount(() => {
    initFeatureDataMethod();
  });

  usePageEvent('onLoad', () => {
    // 隐藏胶囊
    ty.hideMenuButton();
  });

  // 嵌套涉及布局定位的组件时渲染异常, 进行标记
  const onDpDataChangeCallback = useCallback(
    async data => {
      // 添加featureData的变更监听，确保拿到最新的值
      const { dps } = data;
      const dpsArray = Object.keys(dps);

      // 创建一个异步操作数组
      const updateFeatureDataPromises = dpsArray.map(async dpId => {
        const dpCode = getDpCodeByDpId(Number(dpId));
        const findFeature = featureData.find(item => item.dpCode === dpCode);
        // 如果dpCode存在，则更新dpValue
        if (findFeature) {
          // 更新当前的功能data对应值
          if (findFeature.listen && findFeature.dpListenCallback) {
            findFeature.dpListenCallback(dps[dpId], findFeature);
          }
          findFeature.dpValue = dps[dpId];
          // 针对listChoice类型，如果存在checkedIconVisibilityCondition，则执行
          if (
            findFeature.type === FeatureType.listChoice &&
            findFeature.checkedIconVisibilityCondition
          ) {
            const showCheckedIcon = await findFeature.checkedIconVisibilityCondition?.();
            findFeature.showCheckedIcon = showCheckedIcon;
          }
          // 监听到上报后，在dp监听之后还原其是否点击的标记状态
          findFeature.hasClick = false;

          const updateFeatureData = featureData.map(item =>
            item.key === findFeature.key ? findFeature : item
          );

          // 如果有监听到巡航开关，更新其它功能的显示状态
          if (findFeature.key === 'cruiseSwitch') {
            const finallyFeatureData = await Promise.all(
              updateFeatureData.map(async item => {
                const isVisible = await item.visibilityCondition?.();
                // 如果当前功能是listChoice类型，并且有checkedIconVisibilityCondition，则判断是否显示选中图标
                if (item.type === FeatureType.listChoice && item.checkedIconVisibilityCondition) {
                  const showCheckedIcon = await item.checkedIconVisibilityCondition?.();
                  item.showCheckedIcon = showCheckedIcon;
                }
                item.isVisible = isVisible;
                return item;
              })
            );
            return finallyFeatureData; // 返回更新后的数据
          }
          return updateFeatureData; // 返回没有巡航开关的数据
        }
        return null;
      });

      console.log(updateFeatureDataPromises, 'updateFeatureDataPromises');

      // 等待所有异步操作完成后执行状态更新
      const updatedFeatureData = await Promise.all(updateFeatureDataPromises);

      const updatedFeatureDataFilterData = updatedFeatureData
        .filter(item => item !== null)
        .map(item => _uniqBy(item, 'key'));

      if (updatedFeatureDataFilterData.length === 0) {
        return false;
      }

      // 将更新后的数据合并
      const finalFeatureData = updatedFeatureDataFilterData.flat();

      // 更新 featureData 状态
      setFeatureData(finalFeatureData);

      return false;
    },
    [featureData]
  );

  useEffect(() => {
    // 监听featureData变化，更改combine数据
    setCombineData(combineFeatureData(featureData));
  }, [featureData]);

  // 监听 DpDataChanges 事件
  useEffect(() => {
    const id = devices.common.onDpDataChange(onDpDataChangeCallback);
    return () => {
      devices.common.offDpDataChange(id);
    };
  }, [onDpDataChangeCallback]);

  const onClose = () => {
    changePanelInfoState('showSmartPopup', { status: false, popupData: null });
  };
  const onCancelActionSheet = () => {
    changePanelInfoState('showSmartActionSheet', { status: false, actionData: null });
  };

  const onSelectActionSheet = event => {
    const { dpCode, id, type } = event.detail;
    type === 'dp' && publishDpOutTime(dpCode, id);
    console.log(actionData, 'actionData===');
    const newActionData = actionData.map(item => ({
      ...item,
      checked: item.id === id,
    }));
    console.log(newActionData, 'newActionData');
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

  const onLeftClick = () => {
    router.back();
  };

  // cell 单元格数据点击
  const onCellClick = cellItem => {
    const featureItem = { ...cellItem, hasClick: true };
    const updateFeatureData = featureData.map(item =>
      item.key === featureItem.key ? featureItem : item
    );
    setFeatureData(updateFeatureData);
    cellItem.onClick && cellItem.onClick(featureItem);
  };

  return (
    <View className={styles.layoutContainer}>
      <LayoutHeader title={title} onLeftClick={onLeftClick} />
      <View className={clsx(styles.layoutContent)}>
        {combineData.map((groupItem, index) => {
          if (groupItem.data.length === 0) return null;
          return (
            <CellGroup
              key={groupItem.groupKey}
              title={groupItem.data[0].groupTitle}
              customClass={clsx(
                styles.cellGroupContainer,
                index === 0 && styles.marginBottom0,
                groupItem.data[0].groupTitle && styles.marginTop0
              )}
            >
              {groupItem.data.map((cellItem, cellIndex) => {
                return (
                  <Cell
                    key={cellItem.cellKey}
                    {...cellItem}
                    customClass={styles.cellContainer}
                    titleClass={styles.cellTitle}
                    labelClass={styles.cellSubTitle}
                    onClick={() => onCellClick(cellItem)}
                    valueClass={clsx(styles.valueClass)}
                  >
                    {cellItem.type === FeatureType.bool && (
                      <Switch checked={cellItem.dpValue} activeColor={brandColor} size="48rpx" />
                    )}
                    {cellItem.type === FeatureType.listChoice && cellItem.showCheckedIcon && (
                      <IconFont
                        icon={cellItem.checkedIcon}
                        otherClassName={clsx(styles.checkedIcon)}
                        style={{ color: brandColor }}
                      />
                    )}
                  </Cell>
                );
              })}
            </CellGroup>
          );
        })}
      </View>

      <Popup
        show={showSmartPopup}
        closeable
        closeIconPosition="top-left"
        position="bottom"
        safeAreaInsetBottom={false}
        onClose={onClose}
        onAfterEnter={() => setIsReady(true)}
        onAfterLeave={() => setIsReady(false)}
      >
        <View>
          {popupData?.component &&
            isReady &&
            React.createElement(popupData.component, { title: popupData.title })}
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

export default List;
