import { THEME_COLOR } from '@/constant';
import { deviceTimerCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import store from '@/redux';
import { useProps, utils } from '@ray-js/panel-sdk';
import { Text, View, router } from '@ray-js/ray';
import { TimerData, decodeDeviceTimer0x31 } from '@ray-js/robot-protocol';
import { DateTimePicker, Icon, NavBar, Popup } from '@ray-js/smart-ui';
import React, { useCallback, useEffect, useState } from 'react';
import rightIcon from '@tuya-miniapp/icons/dist/svg/Right';
import leftIcon from '@tuya-miniapp/icons/dist/svg/Left';

import { useDeviceTimerList } from '@/hooks/useDeviceTimerList';
import { trim } from 'lodash-es';
import { CleanCount } from './components/cleanCount';
import { CleanRange } from './components/cleanRange';
import { Loops } from './components/loops';
import { AddTimingMapView } from './components/mapView';
import styles from './index.module.less';
import { ECleaningRange } from './props';

const { toFixedString } = utils;

const defaultWeeks = [0, 0, 0, 0, 0, 0, 0];

// 新增时默认的其他字段值
const defaultTiming: TimerData = {
  effectiveness: 1,
  week: defaultWeeks,
  roomIds: [],
  time: { hour: new Date().getHours(), minute: new Date().getMinutes() },
  sweepCount: 1,
  roomNum: 0,
  fanLevel: 0,
  waterLevel: 0,
  cleanMode: 0,
};

const AddTiming = props => {
  const index = props.location.query.index || -1;
  const [currentTiming, setCurrentTiming] = useState<TimerData>(defaultTiming);
  const timerValue = useProps(props => props[deviceTimerCode]);
  const [week, setWeek] = useState(defaultWeeks);
  const [sweepCount, setSweepCount] = useState(1); // 清扫次数
  const [cleaningRange, setCleaningRange] = useState(ECleaningRange.auto);
  const [roomIds, setRoomIds] = useState([]);
  const [show, setShow] = useState(false);
  const [time, setTime] = useState({
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  });

  const { updateTimer, addTimer } = useDeviceTimerList();

  useEffect(() => {
    if (index > -1) {
      const data = decodeDeviceTimer0x31({ command: timerValue, version: '1' });
      if (data) {
        const { list } = data;
        const timerList = list;
        setCurrentTiming(timerList[index]);
      }
    }
  }, [timerValue]);

  useEffect(() => {
    setWeek(currentTiming.week);
    setSweepCount(currentTiming.sweepCount);
    setRoomIds(currentTiming.roomIds);
    setTime(currentTiming.time);
    setCleaningRange(currentTiming.roomNum > 0 ? ECleaningRange.selectRoom : ECleaningRange.auto);
  }, [currentTiming]);

  const save = () => {
    const isEdit = index > -1;
    const modifiedTiming: TimerData = {
      ...defaultTiming,
      time,
      week,
      sweepCount,
      roomIds,
      roomNum: roomIds.length,
    };

    if (isEdit) {
      updateTimer(index, modifiedTiming);
    } else {
      addTimer(modifiedTiming);
    }
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  useEffect(() => {
    ty.hideMenuButton();
  }, []);

  const handleCleaningRangeChange = useCallback(async key => {
    const { roomNum } = store.getState().mapState;
    // 如果选择选区清扫,同时地图未分区,则弹窗提示
    if (key === ECleaningRange.selectRoom && roomNum <= 0) {
      ty.showToast({ title: Strings.getLang('dsc_time_no_room'), icon: 'error' });
      return;
    }

    setCleaningRange(key);
    // 如果从选区切换到全屋,则清空已选择的房间id
    if (key === ECleaningRange.auto) {
      setRoomIds([]);
    }
  }, []);

  const onSaveTiming = useCallback(event => {
    const { detail } = event;
    const [hour, minute] = detail.split(':');
    setTime({
      hour: parseInt(trim(hour), 10),
      minute: parseInt(trim(minute), 10),
    });
    setShow(false);
  }, []);

  const { hour, minute } = time;
  return (
    <View className={styles.page}>
      <NavBar
        title={Strings.getLang('dsc_add_timing')}
        slot={{
          left: <Icon name={leftIcon} size="35px" onClick={router.back} />,
          right: (
            <View style={{ color: THEME_COLOR }} onClick={save}>
              <Text style={{ fontSize: '16px', fontWeight: '500' }}>
                {Strings.getLang('dsc_save')}
              </Text>
            </View>
          ),
        }}
      />
      <View className={styles.lineBox} onClick={() => setShow(true)}>
        <Text className={styles.itemText}>{Strings.getLang('dsc_add_timing_time')}</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text className={styles.itemText} style={{ marginLeft: '5px' }}>{`${hour}:${toFixedString(
            minute,
            2
          )}`}</Text>

          <Icon name={rightIcon} size="20px" />
        </View>
      </View>

      {/* <TimePicker time={time} setTime={setTime} /> */}
      <Loops week={week} setWeek={setWeek} />
      <CleanCount sweepCount={sweepCount} onChange={setSweepCount} />
      <CleanRange
        cleaningRange={cleaningRange}
        handleCleaningRangeChange={handleCleaningRangeChange}
      />
      {cleaningRange === ECleaningRange.selectRoom && (
        <AddTimingMapView setRoomIds={setRoomIds} roomIds={roomIds} />
      )}

      <Popup
        show={show}
        position="bottom"
        customStyle={{ height: '250px' }}
        onClose={() => {
          setShow(false);
        }}
      >
        <DateTimePicker
          cancelButtonText={Strings.getLang('dsc_cancel')}
          confirmButtonText={Strings.getLang('dsc_confirm')}
          type="time"
          value={`${hour}:${minute}`}
          onConfirm={onSaveTiming}
          onCancel={() => setShow(false)}
        />
      </Popup>
    </View>
  );
};

export default AddTiming;
