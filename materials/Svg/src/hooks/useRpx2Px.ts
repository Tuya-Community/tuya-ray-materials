import React from 'react';
import { useSystemInfo } from './useSystemInfo';
import { rpx2px } from '../utils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useRpx2Px() {
  const sysInfo = useSystemInfo();
  const fn = React.useCallback(
    (maybeRpx: string) => {
      return rpx2px(maybeRpx, sysInfo);
    },
    [sysInfo]
  );
  return fn;
}
