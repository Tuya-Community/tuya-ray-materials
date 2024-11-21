import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { View, Text, Icon } from '@ray-js/ray';
import TyOutdoorUtils from '@ray-js/ty-outdoor-utils';
import Strings from '@/i18n';
import { getTrackSegmentList } from '@/api/request';
import { getCyclingTime, scaleMileageValue } from '@/utils';
import dpCodes from '@/constant/dpCodes';
import styles from './index.module.less';

const { mileageOnce } = dpCodes;
export const Record = ({ deviceId, mileageUnit, dpSchema, isKm = false }) => {
  const [data, setData] = useState<ITrackSegmentItem>();

  useEffect(() => {
    getTrackSegmentList(deviceId)
      .then(res => {
        console.log('getTrackSegmentList', res);
        res && res?.segmentList && res?.segmentList.length > 0 && setData(res.segmentList[0]);
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <View className={styles.record}>
      <View className={styles.title}>
        <Text>{Strings.getLang('records')}</Text>
        {data && (
          <View
            className={styles.moreText}
            onClick={() => TyOutdoorUtils.jumpSubPage.toCyclingRecord({ deviceId })} // 骑行记录
          >
            <Text>{Strings.getLang('moreText')}</Text>
            <Icon type="icon-right" color="var(--app-B1-N4)" size={18} />
          </View>
        )}
      </View>
      <View
        className={styles.recordItem}
        onClick={
          () =>
            data &&
            TyOutdoorUtils.jumpSubPage.toTrajectoryPlayback({
              ...data,
              deviceId,
              unitType: mileageUnit,
            }) // 轨迹回放
        }
      >
        {data ? (
          <>
            <View className={styles.recordItemTop}>
              <View className={styles.mileage}>
                {scaleMileageValue(mileageOnce, data?.mileage, dpSchema, isKm)}
                <Text>{mileageUnit}</Text>
              </View>
              <View className={styles.time}>
                {dayjs(data?.startTime).format('YYYY/MM/DD')}{' '}
                {dayjs(data?.startTime).format('HH:mm')}-{dayjs(data?.endTime).format('HH:mm')}
              </View>
            </View>
            <View className={styles.recordItemBottom}>
              <View className={styles.recordItemBottomLi}>
                <Text>{Strings.getLang('cyclingTime')}</Text>
                <View className={styles.num}>
                  {getCyclingTime((data?.endTime - data?.startTime) / 1000)}
                </View>
              </View>
              <View className={styles.recordItemBottomLi}>
                <Text>{Strings.getLang('averageSpeed')}</Text>
                <View className={styles.num}>
                  {scaleMileageValue(mileageOnce, data?.speed, dpSchema, isKm)}
                  <Text>{Strings.getLang(`speedUnit_${mileageUnit}`)}</Text>
                </View>
              </View>
              <View className={styles.recordItemBottomLi}>
                <Text>{Strings.getLang('powerConsumption')}</Text>
                <View className={styles.num}>
                  {data?.battery}
                  <Text>%</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View className={styles.noData}>
            <View>{Strings.getLang('noRecord')}</View>
            <View>{Strings.getLang('startRide')}</View>
          </View>
        )}
      </View>
    </View>
  );
};
