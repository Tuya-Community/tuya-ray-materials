/*
 * @Author: hkc
 * @Date: 2025-09-22 10:18:35
 * @LastEditors: hkc
 * @LastEditTime: 2025-09-22 16:55:45
 * @Description: 转写时间包
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
      AI_WEARABLE_BT?.spuList?.filter(item => item?.skuList?.[0]?.priceList[0]?.optionType === 0) ||
      []
    );
  }, [AI_WEARABLE_BT]);

  return (
    <View className={styles.container}>
      <View className={styles.title}>{Strings.getLang('shop_time_package')}</View>
      <View className={styles.list}>
        {packageList.map(item => (
          <PackageCard data={item} key={item.commodityCode} />
        ))}
      </View>
    </View>
  );
};

export default Index;
