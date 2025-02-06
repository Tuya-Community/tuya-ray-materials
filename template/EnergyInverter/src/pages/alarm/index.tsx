import React, { useState, useEffect } from 'react';
import { router, View, Image, Text } from '@ray-js/ray';
import { Card } from '@/components/card';
import Strings from '@/i18n';
import Layout from '@/components/layout';
import { useDevice } from '@ray-js/panel-sdk';
import moment from 'moment';
import clsx from 'clsx';
import { getEnergyDeviceAlarmListApi } from '../../api/alarm';
import { TIME_FORMAT_TEMPLATE_MAP, DateTag, AlarmIconPath, DateAction } from '../../constants';
import { timeIsNext, tabsTimeChange } from '../../utils';
import Styles from './index.module.less';

export default function Alarm() {
  const devName = useDevice(d => d.devInfo.name);
  const [beginTime, setBeginTime] = useState(moment().startOf('day'));
  const [endTime, setEndTime] = useState(moment().endOf('day'));
  const [dateType, setDateType] = useState(DateTag.DAY);
  const [eventStatus, setEventStatus] = useState(1); // 0 已解决  1 未解决
  const [canNext, setCanNext] = useState(false);
  const [timeString, setTimeString] = useState('');
  const [alarmList, setAlarmList] = useState([]);

  useEffect(() => {
    let _timeString = '';
    const timeFormatTemplate = TIME_FORMAT_TEMPLATE_MAP[dateType];
    if (dateType === DateTag.WEEK) {
      _timeString = `${beginTime.format(timeFormatTemplate)} ~ ${endTime.format(
        timeFormatTemplate
      )}`;
    } else {
      _timeString = beginTime.format(timeFormatTemplate);
    }

    setTimeString(_timeString);
    setCanNext(timeIsNext(beginTime, dateType));
  }, [dateType, beginTime, endTime]);

  useEffect(() => {
    getAlarmList();
  }, [dateType, beginTime, endTime, eventStatus]);

  const changeDateType = e => {
    const { type } = e.origin.currentTarget.dataset;
    if (type === dateType) return;
    setDateType(type);
    const curTime = moment();
    updateDateAction(curTime, type);
  };

  const getAlarmList = async () => {
    ty.showLoading({ title: '' });
    const {
      query: { deviceId },
    } = ty.getLaunchOptionsSync();
    const params = {};
    const args = {
      devId: deviceId,
      weight: 6,
      startTime: beginTime.valueOf(),
      endTime: endTime.valueOf(),
      eventType: 'fault',
      eventStatus,
      pageNum: 1,
      pageSize: 100,
      ...params,
    };

    const res = await getEnergyDeviceAlarmListApi(args);
    const _alarmList = [];
    res.data.map((ele, index) => {
      return _alarmList.push({
        code: `${ele.deviceId}-${index}`,
        icon: AlarmIconPath.faultIcon,
        startTimeFormat: moment(ele.startTime).format('YYYY/MM/DD HH:mm'),
        endTimeFormat: `${Strings.getLang('released')}: ${moment(ele.endTime).format(
          'YYYY/MM/DD HH:mm'
        )}`,
        title: ele.name || '',
        message: ele.desc || '',
        releIcon: AlarmIconPath.rightGreenIcon,
        ...ele,
      });
    });
    setAlarmList(_alarmList);
    ty.hideLoading();
  };

  const changeChecked = e => {
    const { status } = e.origin.currentTarget.dataset;
    setEventStatus(status);
  };

  const preClick = () => {
    const { beginMomentTime } = tabsTimeChange(
      moment(beginTime),
      moment(endTime),
      dateType,
      DateAction.SUBTRACT
    );
    updateDateAction(beginMomentTime, dateType);
  };

  const nextClick = () => {
    const { beginMomentTime } = tabsTimeChange(
      moment(beginTime),
      moment(endTime),
      dateType,
      DateAction.ADD
    );
    updateDateAction(beginMomentTime, dateType);
  };

  const updateDateAction = (curTime, type) => {
    if (type === DateTag.DAY) {
      setBeginTime(moment(curTime.startOf('day')));
      setEndTime(moment(curTime.endOf('day')));
    } else if (type === DateTag.WEEK) {
      setBeginTime(moment(curTime.startOf('day').subtract(curTime.isoWeekday() - 1, 'days')));
      setEndTime(moment(curTime.endOf('day').add(6, 'day')));
    } else if (type === DateTag.MONTH) {
      setBeginTime(moment(curTime.startOf('day').subtract(curTime.date() - 1, 'days')));
      setEndTime(moment(curTime.endOf('day').add(1, 'months').subtract(1, 'days')));
    } else {
      setBeginTime(moment(curTime.startOf('year')));
      setEndTime(moment(curTime.endOf('year')));
    }
  };

  return (
    <Layout title={devName}>
      <View className={Styles.wrap}>
        <View className={Styles.dateTimeWrap}>
          <View className={Styles.dateWrap}>
            <View
              className={clsx(Styles.unit, dateType === DateTag.DAY ? Styles.active : '')}
              data-type={DateTag.DAY}
              onClick={changeDateType}
            >
              {Strings.getLang('day')}
            </View>
            <View
              className={clsx(Styles.unit, dateType === DateTag.WEEK ? Styles.active : '')}
              data-type={DateTag.WEEK}
              onClick={changeDateType}
            >
              {Strings.getLang('week')}
            </View>
            <View
              className={clsx(Styles.unit, dateType === DateTag.MONTH ? Styles.active : '')}
              data-type={DateTag.MONTH}
              onClick={changeDateType}
            >
              {Strings.getLang('month')}
            </View>
            <View
              className={clsx(Styles.unit, dateType === DateTag.YEAR ? Styles.active : '')}
              data-type={DateTag.YEAR}
              onClick={changeDateType}
            >
              {Strings.getLang('year')}
            </View>
          </View>
          <View className={Styles.timeWrap}>
            <View onClick={preClick}>
              <Image src="/images/common/icon_left_arrow.png" className={Styles.iconLeftArrow} />
            </View>
            <View className={Styles.font4}>{timeString}</View>
            {canNext ? (
              <View onClick={nextClick}>
                <Image src="/images/common/icon_left_arrow.png" className={Styles.iconRightArrow} />
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>

        <View>
          <View
            className={clsx(Styles.checkbox, eventStatus === 1 ? Styles.checked : '')}
            data-status={1}
            onClick={changeChecked}
          />
          <Text className={Styles.font1}>{Strings.getLang('unresolved')}</Text>
          <View
            className={clsx(Styles.checkbox, Styles.ml22, eventStatus === 0 ? Styles.checked : '')}
            data-status={0}
            onClick={changeChecked}
          />
          <Text className={Styles.font1}>{Strings.getLang('released')}</Text>
        </View>

        <View className={Styles.cardWrap}>
          {alarmList.map((item, index) => (
            <Card
              key={index}
              className={Styles.card}
              hoverClassName={Styles.hover}
              onClick={() => router.push(`/alarmDetail?eventId=${item.eventId}`)}
            >
              <Image src="/images/alarm/icon_alarm.png" className={Styles.alarmIcon} />
              <Text className={clsx(Styles.ml12, Styles.font2)}>{item.startTimeFormat}</Text>
              <View className={clsx(Styles.font2, Styles.mt10)}>{item.title}</View>
              {item.eventStatus === 0 ? (
                <View className={clsx(Styles.releaseWrap, Styles.mt10)}>
                  <Image src="/images/alarm/icon_success.png" className={Styles.successIcon} />
                  <Text>{item.endTimeFormat}</Text>
                </View>
              ) : null}
            </Card>
          ))}
        </View>
      </View>
    </Layout>
  );
}
