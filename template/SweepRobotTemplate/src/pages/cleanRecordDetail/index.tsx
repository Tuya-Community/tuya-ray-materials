import React, { FC, useMemo, useEffect, useState } from 'react';
import { CoverView, router, Text, View } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { selectCleanRecordById } from '@/redux/modules/cleanRecordsSlice';
import { ReduxState } from '@/redux';
import { Grid, GridItem, NavBar } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import { MODE_VALUE_MAP } from '@/constant';
import { ZoneParam, VirtualWallParam } from '@ray-js/robot-map';
import { getMapInfoFromCloudFile } from '@/redux/modules/multiMapsSlice';
import { nanoid } from '@reduxjs/toolkit';
import WebViewMap from '@/components/Map/WebViewMap';

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
  const { bucket, file, extendInfo } = useSelector((state: ReduxState) =>
    selectCleanRecordById(state, Number(id))
  );
  const { mapLength, pathLength, cleanMode, time, area } = extendInfo;
  const [map, setMap] = useState<any>(null);
  const [path, setPath] = useState<any>(null);
  const [forbiddenSweepZones, setForbiddenSweepZones] = useState<ZoneParam[]>([]);
  const [forbiddenMopZones, setForbiddenMopZones] = useState<ZoneParam[]>([]);
  const [virtualWalls, setVirtualWalls] = useState<VirtualWallParam[]>([]);

  const history = useMemo(() => {
    return {
      bucket,
      file,
      mapLen: mapLength,
      pathLen: pathLength,
    };
  }, [bucket, file, mapLength, pathLength]);

  useEffect(() => {
    const fetchHistoryMap = async () => {
      if (history) {
        const mapData = await getMapInfoFromCloudFile(history);

        if (mapData) {
          const { originMap, virtualState, originPath } = mapData as OSSMapData;

          setMap(originMap);
          originPath && setPath(originPath);

          const {
            virtualAreaData = [],
            virtualMopAreaData = [],
            virtualWallData = [],
          } = virtualState;

          setForbiddenMopZones(virtualMopAreaData.map(({ points }) => ({ points, id: nanoid() })));
          setForbiddenSweepZones(virtualAreaData.map(({ points }) => ({ points, id: nanoid() })));
          setVirtualWalls(virtualWallData.map(points => ({ points, id: nanoid() })));
        }
      }
    };

    fetchHistoryMap();
  }, [history]);

  return (
    <View className={styles.container}>
      <CoverView>
        <NavBar
          title={Strings.getLang('dsc_clean_records_detail')}
          leftArrow
          onClickLeft={router.back}
        />
      </CoverView>
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
        <WebViewMap
          map={map}
          path={path}
          virtualWalls={virtualWalls}
          forbiddenSweepZones={forbiddenSweepZones}
          forbiddenMopZones={forbiddenMopZones}
        />
      </View>
    </View>
  );
};

export default CleanRecordDetail;
