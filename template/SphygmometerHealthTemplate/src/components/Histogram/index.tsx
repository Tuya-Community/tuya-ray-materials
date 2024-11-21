import Chart from '@ray-js/common-charts';
import { View } from '@ray-js/ray';
import { EChartsOption } from 'echarts';

import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { Text } from '../common';
import styles from './index.module.less';

const Histogram = () => {
  const data = useSelector(({ uiState }) => uiState.bpNumberList);
  const totalNum = useSelector(({ uiState }) => uiState.totalNum);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);

  const xData = data.map(item => item.name);
  const seriesData = data.map(item => ({ value: item.value, itemStyle: { color: item.color } }));

  const option: EChartsOption = {
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      show: true,
      position: 'right',
      axisLabel: {
        show: true,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}',
      backgroundColor: themeColor,
      textStyle: {
        color: '#fff',
        fontWeight: 'bold',
      },
    },
    series: [
      {
        data: seriesData,
        type: 'bar',
      },
    ],
  };

  return (
    <View className={styles.container}>
      <View className={styles.textBox}>
        <Text className={styles.titleText}>{Strings.getLang('dsc_total')}</Text>
        <Text className={styles.numberText}>{totalNum}</Text>
      </View>
      <View className={styles.chartBox}>
        <Chart customStyle={{ height: '408rpx' }} option={option} theme="light" />
      </View>
    </View>
  );
};

export default Histogram;
