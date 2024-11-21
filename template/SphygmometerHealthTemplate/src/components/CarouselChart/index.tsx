import { FC, useState } from 'react';
import { hex2rgbString } from '@ray-js/panel-sdk/lib/utils';
import { Swiper, View } from '@ray-js/ray';

import { useSelector } from '@/redux';
import Histogram from '../Histogram';
import PieChart from '../PieChart';
import styles from './index.module.less';

const CarouselChart: FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);

  const chartList = ['pieChart', 'histogram'];
  const themeColorSource1 = hex2rgbString(themeColor, 0.8).replace(/\s*/g, '');
  const themeColorSource2 = hex2rgbString(themeColor, 0.4).replace(/\s*/g, '');

  const renderItem = (item, index) => {
    return index === 0 ? <Histogram /> : <PieChart />;
  };

  return (
    <View className={styles.banner}>
      <Swiper
        dots
        className={styles.swiper}
        current={current}
        dataSource={chartList}
        dotActiveColor={themeColorSource1}
        dotColor={themeColorSource2}
        renderItem={renderItem}
        onChange={event => {
          const { current } = event;
          setCurrent(current);
        }}
      />
    </View>
  );
};

export default CarouselChart;
