import React, { FC, useCallback } from 'react';
import { View } from '@ray-js/ray';
import classNames from 'clsx';
import Strings from '../../i18n';
import styles from './index.module.less';

interface Props {
  weeks: number[];
  className?: string;
  disabled?: boolean;
  onChange: (weeks: number[]) => void;
}

const weekMap = ['ret_sun', 'ret_mon', 'ret_tues', 'ret_wed', 'ret_thur', 'ret_fri', 'ret_sat'];

const Week: FC<Props> = ({ weeks, disabled, className, onChange }) => {
  const handleClick = useCallback(
    (e) => {
      if (disabled) return;
      const { i } = e.origin.target.dataset;
      weeks[i] = weeks[i] ? 0 : 1;
      onChange([...weeks]);
    },
    [weeks, disabled, onChange],
  );
  return (
    <View className={classNames(styles.weeks, className)}>
      {weeks.map((item, i) => {
        return (
          <View
            key={i}
            data-i={i}
            className={classNames(styles.week, item === 1 && styles.selected)}
            onClick={handleClick}
          >
            {/* @ts-ignore */}
            {Strings.getLang(weekMap[i])}
          </View>
        );
      })}
    </View>
  );
};

export default Week;
