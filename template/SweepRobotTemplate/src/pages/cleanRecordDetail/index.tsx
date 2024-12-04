import React, { FC, useMemo, useEffect } from 'react';
import { Text, View } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { selectCleanRecordById } from '@/redux/modules/cleanRecordsSlice';
import { ReduxState } from '@/redux';
import HistoryMapView from '@/components/HistoryMapView';
import { parseDataFromString } from '@/utils';
import { Grid, GridItem } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import { MODE_VALUE_MAP } from '@/constant';

import styles from './index.module.less';

type Props = {
  location: {
    query: {
      id: string;
    };
  };
};

const CleanRecordDetail: FC<Props> = ({ location }) => {
  const { id } = location.query ?? {};
  const { extend, bucket, file } = useSelector((state: ReduxState) =>
    selectCleanRecordById(state, Number(id))
  );
  const { mapLength, pathLength, cleanMode, time, area } = parseDataFromString(extend);

  const history = useMemo(() => {
    return {
      bucket,
      file,
      mapLen: mapLength,
      pathLen: pathLength,
    };
  }, [bucket, file, mapLength, pathLength]);

  useEffect(() => {
    ty.setNavigationBarTitle({
      title: Strings.getLang('dsc_clean_records_detail'),
    });
  }, []);

  return (
    <View className={styles.container}>
      <Grid columnNum={cleanMode !== undefined ? 3 : 2} border={false} customClass={styles.grid}>
        <GridItem useSlot>
          <Text
            style={{
              fontSize: '40rpx',
              lineHeight: '40rpx',
              fontWeight: '700',
              marginBottom: '16rpx',
              textAlign: 'center',
            }}
          >
            {time}
          </Text>
          <Text style={{ textAlign: 'center', fontSize: '24rpx', color: 'rgba(0, 0, 0, 0.5)' }}>
            {Strings.getDpLang('clean_time_total')}({Strings.getDpLang('clean_time_total', 'unit')})
          </Text>
        </GridItem>
        <GridItem useSlot>
          <Text
            style={{
              fontSize: '40rpx',
              lineHeight: '40rpx',
              fontWeight: '700',
              marginBottom: '16rpx',
              textAlign: 'center',
            }}
          >
            {area}
          </Text>
          <Text style={{ textAlign: 'center', fontSize: '24rpx', color: 'rgba(0, 0, 0, 0.5)' }}>
            {Strings.getDpLang('clean_area_total')}({Strings.getDpLang('clean_area_total', 'unit')})
          </Text>
        </GridItem>
        {cleanMode !== undefined && (
          <GridItem useSlot>
            <Text
              style={{
                fontSize: '36rpx',
                lineHeight: '40rpx',
                fontWeight: '700',
                marginBottom: '16rpx',
                textAlign: 'center',
              }}
            >
              {Strings.getDpLang('mode', MODE_VALUE_MAP[cleanMode])}
            </Text>
            <Text style={{ textAlign: 'center', fontSize: '24rpx', color: 'rgba(0, 0, 0, 0.5)' }}>
              {Strings.getDpLang('mode')}
            </Text>
          </GridItem>
        )}
      </Grid>

      <View className={styles.mapWrapper}>
        <HistoryMapView isFullScreen history={history} pathVisible />
      </View>
    </View>
  );
};

export default CleanRecordDetail;
