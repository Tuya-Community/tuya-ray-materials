import { useCallback, useEffect, useState } from 'react';
import { GetTTTSuccessData } from '@ray-js/panel-sdk';
import { getSystemInfo, useAppEvent } from '@ray-js/ray';

type SystemInfo = GetTTTSuccessData<typeof getSystemInfo>;

export function useSystemInfo() {
  const [sysInfo, setSysInfo] = useState<SystemInfo>({} as SystemInfo);

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
