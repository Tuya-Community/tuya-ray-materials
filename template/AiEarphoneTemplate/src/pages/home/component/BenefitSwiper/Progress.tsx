/*
 * @Author: hkc
 * @Date: 2025-09-22 19:34:28
 * @LastEditors: hkc
 * @Description: 权益进度条 + 底部信息（剩余时长 / 过期时间）
 */
import React from 'react';
import { View } from '@ray-js/ray';
import clsx from 'clsx';

import Strings from '@/i18n';
import { BenefitVasType } from '@/constant/enums';

import styles from './index.module.less';

interface IProps {
  showProgress: boolean;
  totalMin: number;
  leftMin: number;
  vasType: string;
  dateLabel: string;
  effectiveEndDate: string;
  isExpired: boolean;
}

const Progress: React.FC<IProps> = ({
  showProgress,
  totalMin,
  leftMin,
  vasType,
  dateLabel,
  effectiveEndDate,
  isExpired,
}) => {
  const percent = totalMin > 0 ? Math.min((leftMin / totalMin) * 100, 100) : 0;

  return (
    <View className={clsx(styles.meter, { [styles.meterNoBar]: !showProgress })}>
      {/* 无进度条时不渲染进度条，高度自适应 */}
      {showProgress && (
        <View className={styles.bar}>
          <View className={styles.barActive} style={{ width: `${percent}%` }} />
        </View>
      )}
      <View className={clsx(styles.meterBottom, { [styles.meterBottomNoBar]: !showProgress })}>
        {showProgress ? (
          <>
            {/* 有进度条：左下角剩余时长，右下角过期时间 */}
            <View className={styles.remain}>
              <View>
                {vasType === BenefitVasType.Cycle
                  ? Strings.getLang('benefit_remaining_month')
                  : Strings.getLang('benefit_remain')}
              </View>
              <View className={styles.colon}>:</View>
              <View>
                {leftMin}/{Strings.formatValue('total_min', totalMin)}
              </View>
            </View>
            <View className={styles.expire}>
              <View>{dateLabel}</View>
              <View className={styles.separator}>|</View>
              <View>{effectiveEndDate}</View>
              {isExpired && (
                <View className={styles.expired}>{Strings.getLang('benefit_expired')}</View>
              )}
            </View>
          </>
        ) : (
          /* 无进度条：过期时间放到左下角 */
          <View className={styles.expire}>
            <View>{dateLabel}</View>
            <View className={styles.separator}>|</View>
            <View>{effectiveEndDate}</View>
            {isExpired && (
              <View className={styles.expired}>{Strings.getLang('benefit_expired')}</View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Progress;
