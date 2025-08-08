import { config } from '@/config';
import { CountdownData } from '@ray-js/electrician-timing-sdk/lib/interface';
import { useMemo } from 'react';

// 根据dp过滤掉不需要显示的开关
export const useCountdownFilter = (data: CountdownData[]) => {
  return useMemo(() => {
    return data.filter((item) => {
      return config.switchCodes.includes(item.effectCode) && item.leftTime > 0;
    });
  }, [data]);
};
