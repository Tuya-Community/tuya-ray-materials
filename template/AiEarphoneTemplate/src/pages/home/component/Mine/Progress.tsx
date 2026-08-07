/*
 * @Author: hkc
 * @Date: 2025-09-22 19:35:02
 * @LastEditors: hkc
 * @LastEditTime: 2025-09-23 11:26:22
 * @Description: 我的页面权益进度条
 */
import React from 'react';
import { View } from '@ray-js/ray';

import Strings from '@/i18n';
import { BenefitVasType } from '@/constant/enums';

import styles from './index.module.less';

interface IProps {
  totalMin: number;
  leftMin: number;
  vasType: string;
}

const Progress: React.FC<IProps> = ({ totalMin, leftMin, vasType }) => {
  return (
    <View className={styles.progress}>
      <View className={styles.top}>
        <View className={styles.left}>
          <View className={styles.title}>
            {vasType === BenefitVasType.Cycle
              ? Strings.getLang('benefit_remaining_month')
              : Strings.getLang('benefit_remain')}
          </View>
          <View className={styles.separator}>|</View>
          <View className={styles.min}>{Strings.formatValue('total_min', leftMin)}</View>
        </View>
        <View className={styles.min}>{Strings.formatValue('total_min', totalMin)}</View>
      </View>
      <View className={styles.bar}>
        <View className={styles.active} style={{ width: `${(leftMin / totalMin) * 100}%` }}>
          <View className={styles.value}>{leftMin}</View>
        </View>
      </View>
    </View>
  );
};

export default Progress;
