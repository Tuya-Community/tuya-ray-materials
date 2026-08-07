/*
 * @Author: hkc
 * @Date: 2025-09-19 20:38:11
 * @LastEditors: hkc
 * @LastEditTime: 2025-09-24 17:20:46
 * @Description: 权益卡片
 */
import React, { useMemo } from 'react';
import { View } from '@ray-js/ray';

import Strings from '@/i18n';
import EllipsisText from '@/components/EllipsisText';

import styles from './index.module.less';

interface IProps {
  title: string;
  dateLabel: string;
  effectiveEndDate: string;
  scope: string;
  leftMin: number;
  totalMin: number;
  showProgress: boolean;
}

const Index: React.FC<IProps> = props => {
  const { title, dateLabel, effectiveEndDate, scope, leftMin, totalMin, showProgress } = props;

  const progress = useMemo(() => Math.floor((leftMin / totalMin) * 100), [leftMin, totalMin]);

  return (
    <View className={styles.container}>
      <EllipsisText text={title} className={styles.title} numberOfLines={2} />
      {showProgress && (
        <View className={styles.progress}>
          <View className={styles.progressBar} style={{ width: `${progress}%` }} />
        </View>
      )}
      <View className={styles.time}>
        <View className={styles.label}>{dateLabel}</View>
        <View className={styles.separator}>|</View>
        <View>{effectiveEndDate}</View>
      </View>
      <View className={styles.scope}>
        <View className={styles.label}>{Strings.getLang('benefit_scope')}</View>
        <View className={styles.separator}>|</View>
        <View>{scope}</View>
      </View>
    </View>
  );
};

export default Index;
