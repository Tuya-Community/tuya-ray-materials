import React, { useEffect, useMemo, useState } from 'react';
import Scales from './compo';
import { View, getSystemInfoSync } from '@ray-js/ray';
import Strings from '@/i18n';
import clsx from 'clsx';
import styles from './index.module.less';

const system = getSystemInfoSync();

interface IProps {
  className?: string;
  onReset: () => void;
  value: number; // 剩余倒计时时间，单位秒
  total: number; // 倒计时总时间，单位秒
}

export default function Clock({ value, onReset, className, total }: IProps) {
  const [countdown, setCountdown] = useState(value);
  const data = useMemo(() => {
    let hour = Math.floor(value / 3600);
    let minute = Math.ceil((value % 3600) / 60);
    if (minute === 60) {
      hour += 1;
      minute = 0;
    }

    return {
      hour: hour.toString(10).padStart(2, '0'),
      minute: minute.toString(10).padStart(2, '0'),
    };
  }, [value]);

  const lineData = useMemo(() => {
    if (system.theme === 'light') {
      return {
        lineColor: 'rgba(0,0,0,.4)',
        activeColor: '#000',
      };
    }
    return {
      lineColor: 'rgba(255,255,255,.4)',
      activeColor: '#fff',
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((d) => {
        const newValue = --d;
        if (newValue === 0) {
          clearInterval(timer);
        }
        return newValue;
      });
    }, 1000);
    setCountdown(value);
    return () => {
      clearInterval(timer);
    };
  }, [value]);
  return (
    <View className={clsx(styles.clock, className)}>
      <Scales
        size={540}
        value={countdown}
        total={total}
        line-width={4}
        line-length={12}
        line-count={72}
        line-color={lineData.lineColor}
        active-color={lineData.activeColor}
      />
      <View className={styles.countdown}>
        <View className={styles.row}>
          <View className={styles.hour}>{data.hour}</View>
          <View className={styles.dot}>:</View>
          <View className={styles.minute}>{data.minute}</View>
        </View>
        <View className={styles.reset} onClick={onReset}>
          {Strings.getLang('ret_countdown_reset')}
        </View>
      </View>
    </View>
  );
}
