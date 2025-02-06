import React, { useState } from 'react';
import { View } from '@ray-js/ray';
import { usePageEvent } from 'ray';
import { Card } from '@/components/card';
import Strings from '@/i18n';
import Layout from '@/components/layout';
import clsx from 'clsx';
import moment from 'moment';
import { getEnergyDeviceAlarmDetailApi } from '../../../api/alarm';
import Styles from './index.module.less';

type TData = Partial<{
  alarmTitle: string;
  alarmTime: string;
  alarmSolution: string;
}>;

export default function AlarmDetail() {
  const [data, setData] = useState<TData>({});
  const {
    query: { deviceId },
  } = ty.getLaunchOptionsSync();

  // onLoad 生命周期
  usePageEvent('onLoad', options => {
    init(options.eventId);
  });

  const init = eventId => {
    const param = {
      devId: deviceId,
      eventId,
      weight: 6,
    };
    getEnergyDeviceAlarmDetailApi(param).then(result => {
      const { name = '', eventSolution = '', startTime = 0, endTime } = result;
      let time = moment(startTime).format('YYYY/MM/DD HH:mm');
      if (endTime) {
        time = `${time}-${moment(endTime).format('YYYY/MM/DD HH:mm')}`;
      }
      setData({
        alarmTitle: name,
        alarmTime: time,
        alarmSolution: eventSolution,
      });
    });
  };

  return (
    <Layout title={Strings.getLang('alarmDetail')} showBack>
      <View className={Styles.wrap}>
        <View className={Styles.cardWrap}>
          <Card className={Styles.card}>
            <View className={Styles.font1}>{Strings.getLang('alarmName')}</View>
            <View className={clsx(Styles.mt10, Styles.font2)}>{data.alarmTitle || '--'}</View>
          </Card>

          <Card className={Styles.card}>
            <View className={Styles.font1}>{Strings.getLang('alarmTime')}</View>
            <View className={clsx(Styles.mt10, Styles.font2)}>{data.alarmTime}</View>
          </Card>

          <Card className={Styles.card}>
            <View className={Styles.font1}>{Strings.getLang('alarmSolution')}</View>
            <View className={clsx(Styles.mt10, Styles.font2)}>{data.alarmSolution || '--'}</View>
          </Card>
        </View>
      </View>
    </Layout>
  );
}
