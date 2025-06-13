import { useCallback, useEffect, useState } from 'react';
import { useAppEvent, getSystemInfo, getSystemInfoSync } from '@ray-js/ray';
import { GetTTTSuccessData } from '@ray-js/panel-sdk';

type SystemInfo = GetTTTSuccessData<typeof getSystemInfo>;

export function useSystemInfo() {
  const [sysInfo, setSysInfo] = useState<SystemInfo>(() => {
    return getSystemInfoSync();
  });

  const handleThemeChange = useCallback(data => {
    setSysInfo(curSysInfo => {
      const result = { ...curSysInfo, ...data };
      return result;
    });
  }, []);

  useAppEvent('onThemeChange', handleThemeChange);

  useEffect(() => {
    getSystemInfo({
      success: data => setSysInfo(data),
    });
  }, []);

  return sysInfo;
}
