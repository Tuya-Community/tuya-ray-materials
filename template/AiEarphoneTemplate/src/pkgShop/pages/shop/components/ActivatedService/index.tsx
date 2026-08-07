/*
 * @Author: hkc
 * @Date: 2025-09-19 20:37:16
 * @LastEditors: hkc
 * @LastEditTime: 2026-06-07 20:56:32
 * @Description: 激活的权益
 */
import React, { useMemo } from 'react';
import { router, View } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';

import Strings from '@/i18n';
import rightIcon from '@tuya-miniapp/icons/dist/svg/Right';
import { getProcessedBenefitList } from '@/pages/home/util';
import { useSelector } from '@/redux';
import BenefitCard from '../BenefitCard';

import styles from './index.module.less';

const Index = () => {
  const { benefits } = useSelector(state => state.shopInfo);

  // 权益列表
  const benefitList = useMemo(() => {
    const list = getProcessedBenefitList(benefits);
    const filteredList = list.filter(item => item.isShow);
    return filteredList;
  }, [benefits]);

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.title}>{Strings.getLang('shop_service_activated')}</View>
        <View
          className={styles.all}
          onClick={() => {
            router.push('/activatedBenefit', { subpackage: 'pkgShop' });
          }}
        >
          <View>{Strings.getLang('all')}</View>
          <Icon name={rightIcon} size={14} color="var(--color-arrow)" />
        </View>
      </View>
      {benefitList.map((item, index) => (
        <BenefitCard key={index} {...item} />
      ))}
    </View>
  );
};

export default Index;
