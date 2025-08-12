import { useCallback, useState } from 'react';
import { useAppEvent, usePageEvent, getSystemInfo, getSystemInfoSync } from '@ray-js/ray';

const initSysInfo = getSystemInfoSync();

export function useSystemInfo(): ReturnType<typeof getSystemInfoSync> {
  const [sysInfo, setSysInfo] = useState(initSysInfo);

  const handleThemeChange = useCallback(data => {
    setSysInfo(curSysInfo => {
      const result = { ...curSysInfo, ...data };
      return result;
    });
  }, []);

  const handleResize = useCallback(() => {
    getSystemInfo({
      success: data => {
        setSysInfo(curSysInfo => {
          const result = { ...curSysInfo, ...data };
          return result;
        });
      },
    });
  }, []);

  // @ts-ignore
  useAppEvent('onThemeChange', handleThemeChange);
  usePageEvent('onResize', handleResize);

  return sysInfo;
}
