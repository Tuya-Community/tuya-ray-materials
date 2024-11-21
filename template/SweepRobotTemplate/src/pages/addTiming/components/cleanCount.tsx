import { SelectorItem } from '@/components/Selector';
import Strings from '@/i18n';
import React, { useMemo } from 'react';

export const CleanCount = (props: { sweepCount: number; onChange: (v: number) => void }) => {
  const { sweepCount, onChange } = props;
  const sweepCountOptions = useMemo(
    () => [
      { title: Strings.getLang('dsc_timing_sweep_count1'), value: 1 },
      { title: Strings.getLang('dsc_timing_sweep_count2'), value: 2 },
    ],
    []
  );

  return (
    <SelectorItem
      name={Strings.getLang('dsc_timing_sweep_count_title')}
      options={sweepCountOptions}
      activeKey={sweepCount}
      onChange={onChange}
    />
  );
};
