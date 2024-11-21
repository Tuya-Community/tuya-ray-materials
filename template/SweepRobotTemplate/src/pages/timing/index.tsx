import { THEME_COLOR } from '@/constant';
import { useMemoizedFn } from '@/hooks';
import Strings from '@/i18n';
import Res from '@/res';
import { ScrollView, View, router } from '@ray-js/ray';
import { TimerData } from '@ray-js/robot-protocol';
import { Button, Empty } from '@ray-js/smart-ui';
import React, { FC, useCallback, useEffect } from 'react';
import { useDeviceTimerList } from '@/hooks/useDeviceTimerList';
import { useDisturbTime } from '@/hooks/useDisturbTime';

import Disturb from './disturb';
import styles from './index.module.less';
import TimingItem from './timingItem';

const Timing: FC = () => {
  const { disturbTimeSetData } = useDisturbTime();

  const { timerList, updateTimer, deleteTimer } = useDeviceTimerList();

  const handleSwitchChange = (index: number, data: TimerData) => {
    updateTimer(index, data);
  };

  useEffect(() => {
    ty.setNavigationBarTitle({
      title: Strings.getLang('dsc_timer_title'),
    });
  }, []);

  const handleRemoveSchedule = useCallback(
    (index: number) => {
      deleteTimer(index);
    },
    [timerList]
  );

  const handleEditTiming = useMemoizedFn((item: TimerData, index: number) => {
    // navigation.navigate('addTiming', { index });
    router.push(`/addTiming?index=${index}`);
  });

  const { enable: disturbSwitch } = disturbTimeSetData || {};
  return (
    <View className={styles.container}>
      <View className={styles.content}>
        {disturbSwitch && <Disturb />}

        {timerList.length > 0 ? (
          <View>
            {timerList.map((timer: TimerData, index: number) => {
              return (
                <TimingItem
                  item={timer}
                  enable={timer.effectiveness === 1}
                  onSwitchChange={value =>
                    handleSwitchChange(index, { ...timer, effectiveness: value.detail ? 1 : 0 })
                  }
                  onRemove={() => handleRemoveSchedule(index)}
                  onPress={() => handleEditTiming(timer, index)}
                  key={index}
                />
              );
            })}
          </View>
        ) : (
          <View className={styles.emptyBox}>
            <Empty description={Strings.getLang('dsc_timer_empty_desc')} image={Res.emptyTimer} />
          </View>
        )}
      </View>

      <View className={styles.footerButtonBox}>
        <Button type="primary" block color={THEME_COLOR} onClick={() => router.push('/addTiming')}>
          {Strings.getLang('dsc_add_timing')}
        </Button>
      </View>
    </View>
  );
};

export default Timing;
