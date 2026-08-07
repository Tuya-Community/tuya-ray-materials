/*
 * @Author: hkc
 * @Date: 2025-09-22 10:18:35
 * @LastEditors: hkc
 * @LastEditTime: 2025-09-22 16:56:07
 * @Description: 订阅包
 */
import { useSelector } from '@/redux';
import { View } from '@ray-js/ray';
import React, { useMemo } from 'react';

import PackageCard from '../PackageCard';
import Strings from '@/i18n';

import styles from './index.module.less';

const Index = () => {
  const { AI_WEARABLE_BT } = useSelector(state => state.shopInfo);

  // 离线转写订阅商品列表
  const packageList = useMemo(() => {
    return (
      AI_WEARABLE_BT?.spuList?.filter(item => item?.skuList?.[0]?.priceList[0]?.optionType === 2) ||
      []
    );
  }, [AI_WEARABLE_BT]);

  return (
    <View className={styles.container}>
      <View className={styles.title}>{Strings.getLang('shop_package')}</View>
      {packageList.map(item => (
        <PackageCard data={item} key={item.commodityCode} />
      ))}
    </View>
  );
};

export default Index;
