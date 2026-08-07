/*
 * @Author: hkc
 * @Date: 2025-09-22 16:48:45
 * @LastEditors: hkc
 * @LastEditTime: 2026-06-07 20:55:05
 * @Description: 全部权益
 */
import React, { useMemo } from 'react';
import { ScrollView, View } from '@ray-js/ray';
import { useSelector } from '@/redux';

import { TopBar } from '@/components';
import Strings from '@/i18n';
import { getProcessedBenefitList } from '@/pages/home/util';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';
import BenefitCard from '../shop/components/BenefitCard';

import styles from './index.module.less';

const Index = () => {
  useAppFloatCtrl(true);
  const {
    safeArea: { bottom },
    topBarHeight,
  } = useSelector(state => state.systemInfo);
  const { benefits } = useSelector(state => state.shopInfo);

  // 有效期内的权益
  const validBenefits = useMemo(() => {
    const list = getProcessedBenefitList(benefits);
    return list.filter(item => !item.isExpired);
  }, [benefits]);

  // 已过期的权益
  const expiredBenefits = useMemo(() => {
    const list = getProcessedBenefitList(benefits);
    return list.filter(item => item.isExpired);
  }, [benefits]);

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('shop_service_activated')} isDark />
      <ScrollView
        className={styles.scrollView}
        scrollY
        style={{ height: `${bottom - topBarHeight}px` }}
      >
        {validBenefits.map((item, index) => (
          <BenefitCard {...item} key={index} />
        ))}
        {/* 已过期的权益 */}
        {expiredBenefits.length > 0 && (
          <View className={styles.expired}>
            <View className={styles.expiredTitle}>{Strings.getLang('benefit_expired')}</View>
            {expiredBenefits.map((item, index) => (
              <BenefitCard {...item} key={index} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
