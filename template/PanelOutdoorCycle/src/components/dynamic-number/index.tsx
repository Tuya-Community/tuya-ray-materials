import React, { useState, useEffect } from 'react';
import { Text, usePageEvent } from '@ray-js/ray';
import clsx from 'clsx';
import styles from './index.module.less';

export const DynamicNumber = ({ counts, time = 1000, point = 0, className = styles.number }) => {
  // counts：传入的数字，time: 默认1000毫秒之内整个动画完成
  const targetNumber = counts;
  // 显示小数点后几位
  const pointNumber = 10 ** point;
  const [count, setCount] = useState(0);
  const [updateNum, setUpdate] = useState(0);

  usePageEvent('onShow', () => {
    setUpdate(updateNum + 1);
  });

  useEffect(() => {
    const startTime = Date.now();
    const duration = time;
    const timer = setInterval(() => {
      setCount(() => {
        // 数字增长逻辑：.定时操作
        let after =
          Math.ceil(((Date.now() - startTime) / duration) * targetNumber * pointNumber) /
          pointNumber;
        if (after > targetNumber) {
          clearInterval(timer);
          after = targetNumber;
        }
        return after;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [counts, updateNum]);

  const cls = clsx('icon-number', `${className}`);
  return <Text className={cls}>{count.toFixed(point)}</Text>;
};
