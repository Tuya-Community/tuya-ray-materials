import { FC, useCallback } from 'react';
import Chart from '@ray-js/common-charts';
import { router, View } from '@ray-js/ray';
import { Divider } from '@ray-js/smart-ui';
import { keys } from 'lodash-es';
import moment from 'moment';

import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { getBpChartOption } from '@/utils';
import AddManually from '../AddManually';
import { Text, TouchableOpacity } from '../common';
import styles from './index.module.less';

type ITEM = 'avgTotalSys' | 'avgTotalDia' | 'avgTotalPulse';

const circleColor = {
  avgTotalSys: '#FF1860',
  avgTotalDia: '#0D6ACB',
  avgTotalPulse: '#FFD36F',
};

const avgTitle = {
  avgTotalSys: 'systolic_bp',
  avgTotalDia: 'diastolic_bp',
  avgTotalPulse: 'pulse',
};

interface Props {
  isShowTody: boolean;
  list: Array<LatestDataList>;
  avgData: {
    avgTotalSys: string;
    avgTotalDia: string;
    avgTotalPulse: string;
  };
  height?: number;
}

const TrendLineChart: FC<Props> = ({ isShowTody, list, avgData, height }) => {
  const type = useSelector(({ uiState }) => uiState.type);

  const avgDataKeys = keys(avgData);
  const option = getBpChartOption(list, isShowTody, type);

  const handleAddDataClick = useCallback(() => {
    router.push('/addData');
  }, []);

  return (
    <View className={styles.container}>
      <View className={styles.wordBox}>
        {isShowTody && (
          <Text className={styles.today}>{moment(list[0]?.time).format('YYYY.MM.DD')}</Text>
        )}
        <View>
          <Text className={styles.averageTitle}>{Strings.getLang('dsc_averageValue')}</Text>
          <View className={styles.avgBox}>
            {avgDataKeys.length !== 0 &&
              avgDataKeys.map((item: ITEM) => (
                <View className={styles.singleAvgBox} key={item}>
                  <Text className={styles.bpValue}>{avgData[item]}</Text>
                  <View className={styles.singleTypeBox}>
                    <View
                      className={styles.littleCircle}
                      style={{ backgroundColor: circleColor[item] }}
                    />
                    <Text className={styles.bpTitle} numberOfLines={1}>
                      {Strings.getDpLang(avgTitle[item])}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </View>
      <View className={styles.chartBox} style={{ height: `${height}rpx` || '486rpx' }}>
        <Chart customStyle={{ height: `${height}rpx` }} option={option} theme="light" />
      </View>
      {isShowTody && (
        <View>
          <Divider hairline customStyle={{ margin: 0 }} />
          <TouchableOpacity
            activeOpacity={0.6}
            className={styles.addBox}
            onClick={handleAddDataClick}
          >
            <AddManually />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TrendLineChart;
