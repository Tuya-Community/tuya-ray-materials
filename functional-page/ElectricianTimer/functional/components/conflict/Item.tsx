import React, { useMemo, FC, ReactNode } from 'react';
import { View, Text } from '@ray-js/ray';
import { FuncType } from '@/constant';
import { formatWeeks } from '@/utils';
import Strings from '@/i18n';
import styles from './index.module.less';

type LabelType =
  | string
  | number
  | {
      text: string;
      size: 'num' | 'txt';
    };

interface Props {
  type: FuncType;
  label: Array<LabelType>;
  switches: string;
  action: string;
  weeks?: number[];
}

const TimerItem: FC<Props> = (props) => {
  const { weeks, switches, action, type, label } = props;
  const loops = useMemo(() => {
    if (!weeks) {
      return '';
    }
    return formatWeeks(weeks);
  }, [weeks?.join('')]);
  const labelText = useMemo(() => {
    return label.map((item, i) => {
      let isNumber: boolean;
      let isDot = false;
      if (typeof item === 'object') {
        isNumber = item.size === 'num';
      } else {
        isNumber = typeof item === 'number' || /\d+/.test(item);
        isDot = item === '-';
      }
      return (
        <Text key={i} className={isNumber ? styles.number : isDot ? styles.dot : styles.txt}>
          {typeof item === 'object' ? item.text : item}
        </Text>
      );
    });
  }, [label.join()]);
  return (
    <View className={styles.infos}>
      <View className={styles.label}>{labelText}</View>
      <View className={styles.loops}>{!!weeks && loops}</View>
      <View className={styles.switches}>{switches}</View>
      <View className={styles.action}>{action}</View>
      <View className={styles.type}>{Strings.getLang(`ret_tag_${type}`)}</View>
    </View>
  );
};

export default TimerItem;
