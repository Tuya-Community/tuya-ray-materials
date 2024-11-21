import { THEME_COLOR } from '@/constant';
import Strings from '@/i18n';
import { utils } from '@ray-js/panel-sdk';
import { Text, View } from '@ray-js/ray';
import { SmartEventHandler, SwipeCell, Switch } from '@ray-js/smart-ui';
import { map } from 'lodash-es';
import React from 'react';
import styles from './index.module.less';

const { toFixedString } = utils;

export type Time = {
  hour: number;
  minute: number;
};

export interface TimerData {
  effectiveness: number;
  week: number[];
  time: Time;
  roomIds: number[];
  cleanMode: number;
  fanLevel: number;
  waterLevel: number;
  sweepCount: number;
  roomNum: number;
}

interface TimingItem {
  item: TimerData;
  enable: boolean;
  onSwitchChange: SmartEventHandler<boolean>;
  // onGesture?: (state: boolean) => void;
  onRemove: () => void;
  onPress: () => void;
}

const style = {
  display: 'flex',
  width: '65px',
  height: '100%',
  fontSize: '15px',
  color: '#fff',
  backgroundColor: THEME_COLOR,
  justifyContent: 'center',
  alignItems: 'center',
} as React.CSSProperties;

const TimingItem = (props: TimingItem) => {
  const { onPress, onSwitchChange, item } = props;
  const { time, effectiveness, roomIds, week } = item;

  const selectedWeekTexts = map(week, (w, index: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    if (w === 1) {
      return Strings.getLang(`dsc_timer_week${index + 1}` as 'dsc_timer_week1');
    }
    return undefined;
  }).filter(str => str !== undefined);

  const cleaningRange =
    roomIds.length === 0
      ? Strings.getLang('dsc_timer_cleaning_auto')
      : Strings.getLang('dsc_timer_cleaning_room');
  const momentTime = `${time.hour}:${toFixedString(time.minute, 2)}`;

  return (
    <SwipeCell
      rightWidth={65}
      slot={{
        right: (
          <View style={style} onClick={props.onRemove}>
            {Strings.getLang('dsc_delete')}
          </View>
        ),
      }}
    >
      <View
        className={styles.item}
        style={effectiveness !== 1 ? { opacity: 0.3 } : {}}
        onClick={e => {
          onPress && onPress();
        }}
      >
        <View className={styles.head}>
          <View className={styles.timeBox}>
            <Text className={styles.headTitle}>{momentTime}</Text>
          </View>
          <Switch
            checked={props.enable}
            onChange={onSwitchChange}
            activeColor={THEME_COLOR}
            size="middle"
            stopClickPropagation
          />
        </View>
        <View className={styles.itemBottom}>
          <Text className={styles.text}>
            {selectedWeekTexts?.length
              ? selectedWeekTexts.join('、 ')
              : Strings.getLang('dsc_timer_once')}
          </Text>
          <Text className={styles.divider} />
          <Text className={styles.text}>{cleaningRange}</Text>
        </View>
      </View>
    </SwipeCell>
  );
};

export default TimingItem;
