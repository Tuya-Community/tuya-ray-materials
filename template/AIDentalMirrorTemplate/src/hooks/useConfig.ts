import _ from 'lodash';

import { useAppSelector } from '@/redux';
import { CommonState } from '@/redux/modules/common';

export const useConfig = <T>(selector: (item: CommonState['config']) => T): T => {
  const config = useAppSelector(
    state => state?.common?.config,
    (a, b) => selector(a) === selector(b)
  );

  return selector(config);
};
