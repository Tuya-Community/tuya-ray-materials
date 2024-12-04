import React, { useEffect, useMemo } from 'react';
import { View, Text } from '@ray-js/ray';
import { useDispatch, useSelector } from 'react-redux';
import { selectIpcCommonValue, updateIpcCommon } from '@/redux/modules/ipcCommonSlice';
import clsx from 'clsx';

import styles from './index.module.less';

const IpcRecordTimer = () => {
  const dispatch = useDispatch();

  const recordTime = useSelector(selectIpcCommonValue('recordTime'));
  const isRecording = useSelector(selectIpcCommonValue('isRecording'));
  const isFull = useSelector(selectIpcCommonValue('isFull'));

  const setTimeData = num => {
    dispatch(updateIpcCommon({ recordTime: num }));
  };

  useEffect(() => {
    if (isRecording) {
      setTimeout(() => {
        setTimeData(recordTime + 1);
      }, 1000);
    } else {
      setTimeData(0);
    }
  }, [recordTime, isRecording]);

  const timeText = useMemo(() => {
    const hour = Math.floor(recordTime / 60 / 60);
    const min = Math.floor(recordTime / 60) - hour * 60;
    const second = recordTime - min * 60 - hour * 60 * 60;

    const secondText = second <= 9 ? `0${second}` : second;
    const minText = min <= 9 ? `0${min}` : min;
    const hourText = hour <= 9 ? `0${hour}` : hour;

    return `${hourText === '00' ? '' : `${hourText}:`}${minText}:${secondText}`;
  }, [recordTime]);

  return (
    <View className={clsx(styles.container, isFull && styles.isFull)}>
      <View className={styles.circle} />
      <View className={styles.timeText}>
        <Text>{timeText}</Text>
      </View>
    </View>
  );
};

export default IpcRecordTimer;
