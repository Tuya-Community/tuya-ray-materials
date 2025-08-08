import { config } from '@/config';
import { getArray } from '@/utils/array';
import { useMemo } from 'react';

export const getFilteredSwitches = <T extends { actions: { code: string }[] }>(data: T[]) => {
  return getArray(data).filter((item) => {
    return item.actions.some((x) => config.switchCodes.includes(x.code));
  });
}

// 根据dp过滤掉不需要显示的开关
export const useSwitchFilter = <T extends { actions: { code: string }[] }>(data: T[]) => {
  return useMemo(() => {
    return getArray(data).filter((item) => {
      return item.actions.some((x) => config.switchCodes.includes(x.code));
    });
  }, [data]);
};
