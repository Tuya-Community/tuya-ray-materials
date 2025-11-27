import React, { FC, useState } from 'react';
import { CoverView, router, Text, View } from '@ray-js/ray';
import Strings from '@/i18n';
import { NavBar } from '@ray-js/smart-ui';
import GridMap from '@/components/GridMap';
import CoverageMap from '@/components/CoverageMap';
import { useProps } from '@ray-js/panel-sdk';
import Loading from '@/components/Loading';
import dayjs from 'dayjs';

import styles from './index.module.less';
import Header from './Header';

type Props = {
  location: {
    query: {
      subRecordId: string;
      area: string;
      time: string;
      timestamp: string;
    };
  };
};

const Map: FC<Props> = ({ location }) => {
  const [loading, setLoading] = useState(true);

  const dpCleanArea = useProps(props => props.clean_area);
  const dpCleanTime = useProps(props => props.clean_time);
  const dpStatus = useProps(props => props.status);

  const { subRecordId, area, time, timestamp } = location.query;

  const isRecord = !!subRecordId;

  /**
   * 支持栅格型地图和涂抹型地图两种样式，默认为栅格型地图
   */
  const isGridMap = true;

  return (
    <View className={styles.container}>
      <CoverView>
        <NavBar
          leftArrow
          title={Strings.getLang(isRecord ? 'cleanDetail' : 'map')}
          onClickLeft={router.back}
        />
      </CoverView>

      <Text className={styles.subTitle}>
        {isRecord
          ? dayjs(Number(timestamp)).format('YYYY-MM-DD HH:mm')
          : Strings.getDpLang('status', dpStatus)}
      </Text>

      <Header area={area ? Number(area) : dpCleanArea} time={time ? Number(time) : dpCleanTime} />
      {isGridMap && (
        <GridMap
          subRecordId={subRecordId}
          onInitialized={() => {
            setLoading(false);
          }}
        />
      )}
      {!isGridMap && (
        <CoverageMap
          subRecordId={subRecordId}
          onInitialized={() => {
            setLoading(false);
          }}
        />
      )}

      <Loading
        isLoading={loading}
        style={{
          position: 'fixed',
        }}
      />
    </View>
  );
};

export default Map;
