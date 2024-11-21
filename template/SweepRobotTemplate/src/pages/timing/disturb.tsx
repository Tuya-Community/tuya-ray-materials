import { useDisturbTime } from '@/hooks/useDisturbTime';
import Strings from '@/i18n';
import Res from '@/res';
import { Image, Text, View } from '@ray-js/ray';
import React from 'react';
import styles from './index.module.less';

const toFixed = (str: string | number, count: number) => {
  return `${'0'.repeat(count)}${str}`.slice(-1 * count);
};

const Disturb = () => {
  const { disturbTimeSetData } = useDisturbTime();

  if (!disturbTimeSetData || !disturbTimeSetData.enable) {
    return null;
  }

  const { startHour, startMinute, endHour, endMinute } = disturbTimeSetData;
  const nextDay = true;
  return (
    <View className={styles.disturb}>
      <Image src={Res.disturb} className={styles.img} />
      <View className={styles.disturbContent}>
        <View className={styles.headBox}>
          <Text className={styles.title}>{Strings.getLang('dsc_disturb_time_set_title')}</Text>
          <Text className={styles.value}>
            {`(${toFixed(startHour, 2)}:${toFixed(startMinute, 2)}-${toFixed(endHour, 2)}:${toFixed(
              endMinute,
              2
            )} ${nextDay ? Strings.getLang('dsc_next_day') : ''})`}
          </Text>
        </View>
        <Text className={styles.desc}>{Strings.getLang('dsc_disturb_time_set_tip')}</Text>
      </View>
    </View>
  );
};

export default Disturb;
