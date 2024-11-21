import { SelectorItem } from '@/components/Selector';
import Strings from '@/i18n';
import React, { useMemo } from 'react';
import { ECleaningRange } from '../props';

export const CleanRange = (props: {
  cleaningRange: ECleaningRange;
  handleCleaningRangeChange: any;
}) => {
  const { cleaningRange, handleCleaningRangeChange } = props;
  const cleaningRangeOptions = useMemo(
    () => [
      { title: Strings.getLang('dsc_timing_cleaning_range_auto'), value: 'auto' },
      { title: Strings.getLang('dsc_timing_cleaning_range_select_room'), value: 'selectRoom' },
    ],
    []
  );

  return (
    <SelectorItem
      name={Strings.getLang('dsc_timing_cleaning_range_title')}
      options={cleaningRangeOptions}
      activeKey={cleaningRange}
      onChange={handleCleaningRangeChange}
    />
  );
};
