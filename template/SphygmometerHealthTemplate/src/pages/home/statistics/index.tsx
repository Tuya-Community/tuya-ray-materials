import { FC, useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from '@ray-js/ray';
import { Loading } from '@ray-js/smart-ui';

import { CarouselChart, DateSelector, NoData, PageWrapper, TrendLineChart } from '@/components';
import StatisticsTopBar from '@/components/TopBar/StatisticsTopBar';
import { useSelector } from '@/redux';
import { getMeasureLevelData, getTrendData } from '@/redux/action';
import styles from './index.module.less';

const Statistics: FC = () => {
  const [loading, setLoading] = useState(true);

  const type = useSelector(({ uiState }) => uiState.type);
  const userInfo = useSelector(({ uiState }) => uiState.userInfo);
  const trendData = useSelector(({ uiState }) => uiState.trendData);

  const { list, avgData } = trendData;

  useEffect(() => {
    if (userInfo) {
      getTrendLineData(type).then(() => {
        setLoading(false);
      });
      getChartData(type);
    }
  }, [userInfo, type]);

  const getTrendLineData = useCallback(async (dataType: DataType) => {
    await getTrendData(dataType);
  }, []);

  const getChartData = useCallback(async (typeStr: string) => {
    await getMeasureLevelData(typeStr);
  }, []);

  const renderLatestData = (
    <View>
      <View>
        <TrendLineChart avgData={avgData} height={410} isShowTody={false} list={list} />
      </View>
      <View style={{ marginBottom: '16rpx' }}>
        <CarouselChart />
      </View>
    </View>
  );

  return (
    <>
      <StatisticsTopBar />
      <PageWrapper hasTabBar>
        <DateSelector />
        <ScrollView scrollY className={styles.scroll}>
          {list.length !== 0 &&
            (loading ? <Loading style={{ marginLeft: '310rpx' }} /> : renderLatestData)}
          {list.length === 0 && <NoData />}
        </ScrollView>
      </PageWrapper>
    </>
  );
};

export default Statistics;
