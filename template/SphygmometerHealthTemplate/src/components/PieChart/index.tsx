import Chart from '@ray-js/common-charts';
import { View } from '@ray-js/ray';
import { EChartsOption } from 'echarts';

import { useSelector } from '@/redux';
import { Text } from '../common';
import styles from './index.module.less';

const PieChart = () => {
  const data = useSelector(({ uiState }) => uiState.bpPercentList);

  const option: EChartsOption = {
    tooltip: {
      show: false,
    },
    legend: {
      show: false,
    },
    series: [
      {
        type: 'pie',
        color: ['#2DDBAE', '#75D788', '#9AD368', '#FCA849', '#F98460', '#FF4141'],
        radius: ['60%', '75%'],
        minAngle: 5,
        avoidLabelOverlap: true,
        data,
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          color: '#8c9aa8',
        },
        labelLine: {
          show: true,
          length: 4,
          length2: 60,
        },
      },
    ],
  };

  const bpColorList = useSelector(({ uiState }) => uiState.bpColorList);

  return (
    <View className={styles.container}>
      <Chart customStyle={{ height: '346rpx' }} option={option} theme="light" />
      <View className={styles.frequencyBoxWrap}>
        {bpColorList.map((item, index) => (
          <View className={styles.frequencyBox} key={item.type}>
            <View className={styles.typeBox}>
              <View className={styles.colorBox} style={{ backgroundColor: item.color }} />
              <Text className={styles.typeText} numberOfLines={1}>
                {item.type}
              </Text>
            </View>
            <Text className={styles.typeText} numberOfLines={1}>
              {item.frequency}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PieChart;
