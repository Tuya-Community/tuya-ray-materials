import { SelectorItem } from '@/components/Selector';
import Strings from '@/i18n';
import { View } from '@ray-js/ray';
import React, { useCallback, useMemo, useState } from 'react';
import { every } from 'lodash-es';

import styles from '../index.module.less';
import { WeeklyRepeatMode } from '../props';
import WeekSelector from './weekSelector';

export const Loops = (props: { week: number[]; setWeek: (v: number[]) => void }) => {
  const { week, setWeek } = props;
  // 多语言必须在组件内才起作用
  const weeklyRepeatModeOptions = useMemo(
    () => [
      { title: Strings.getLang('dsc_timing_week_never'), value: 'never' },
      { title: Strings.getLang('dsc_timing_week_repeat'), value: 'repeat' },
    ],
    []
  );

  // 周是否重复， Week：代表执行星期，一个字节，按位表示，00为仅执行一次，低位为周一
  const currentTimingWeeklyRepeatMode = useMemo(
    () => (every(week, v => v === 0) ? WeeklyRepeatMode.never : WeeklyRepeatMode.repeat),
    [week]
  );

  const [weeklyRepeatMode, setWeeklyRepeatMode] = useState(currentTimingWeeklyRepeatMode);

  const handleWeeklyRepeatModeChange = useCallback(key => {
    setWeeklyRepeatMode(key);
  }, []);

  const handleWeekChange = useCallback((value: number[]) => {
    setWeek(value);
  }, []);

  return (
    <>
      <SelectorItem
        name={Strings.getLang('dsc_timing_week_repeat_title')}
        options={weeklyRepeatModeOptions}
        activeKey={weeklyRepeatMode}
        onChange={handleWeeklyRepeatModeChange}
      />
      {weeklyRepeatMode === WeeklyRepeatMode.repeat ? (
        <View className={styles.weekSelectorBox}>
          <WeekSelector
            value={week}
            texts={week.map((item, i: number) => Strings.getLang(`dsc_timer_week${i + 1}`))}
            onChange={handleWeekChange}
          />
        </View>
      ) : null}
    </>
  );
};
