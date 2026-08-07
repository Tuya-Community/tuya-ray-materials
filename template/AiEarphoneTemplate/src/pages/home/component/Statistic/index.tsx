/*
 * @Author: hkc
 * @Date: 2025-09-22 20:06:54
 * @LastEditors: hkc
 * @LastEditTime: 2025-09-24 15:16:53
 * @Description:
 */
import React, { useMemo } from 'react';
import { View } from '@ray-js/ray';
import { useRequest } from 'ahooks';

import { getUserStatisticInfo } from '@/api/common';
import Strings from '@/i18n';
import { formatMinutes, formatWordCount } from '@/utils/time';
import { useSelector } from '@/redux';
import EllipsisText from '@/components/EllipsisText';

import styles from './index.module.less';

const Index = () => {
  const { data } = useRequest(getUserStatisticInfo);
  const { language } = useSelector(state => state.systemInfo);

  const statisticList = useMemo(() => {
    return [
      {
        title: Strings.getLang('statistic_time_saved'),
        value: formatMinutes(Math.floor(data?.totalTranscribeMinutes / 4) || 0, language),
      },
      {
        title: Strings.getLang('statistic_transcribe_words'),
        value: formatWordCount(data?.totalTranscribeWords || 0, language),
      },
      {
        title: Strings.getLang('statistic_summary_count'),
        value: data?.totalSummaryCount || 0,
      },
      {
        title: Strings.getLang('statistic_usage_days'),
        value: `${data?.totalUsageDays || 0} ${Strings.getLang('day')}`,
      },
    ];
  }, [data]);

  return (
    <View className={styles.container}>
      {statisticList.map(item => (
        <View key={item.title} className={styles.item}>
          <EllipsisText text={item.value} className={styles.value} numberOfLines={2} />
          <View className={styles.title}>{item.title}</View>
        </View>
      ))}
    </View>
  );
};

export default Index;
