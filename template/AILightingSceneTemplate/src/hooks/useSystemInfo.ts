import { getSystemInfo, useAppEvent } from '@ray-js/ray';
import { useCallback, useEffect, useState } from 'react';

export function useSystemInfo() {
  const [sysInfo, setSysInfo] = useState<any>({});

  const handleThemeChange = useCallback(data => {
    setSysInfo(curSysInfo => {
      const result = { ...curSysInfo, ...data };
      const windowWidth = result.windowWidth || 375;
      const isPad = windowWidth >= 768;
      return { ...result, isDarkMode: result.theme === 'dark', isPad };
    });
  }, []);

  useAppEvent('onThemeChange', handleThemeChange);

  useEffect(() => {
    getSystemInfo({
      success: data => {
        const windowWidth = data.windowWidth || 375;
        const isPad = windowWidth >= 768;
        setSysInfo({ ...data, isDarkMode: data.theme === 'dark', isPad });
      },
    });
  }, []);

  return sysInfo;
}
