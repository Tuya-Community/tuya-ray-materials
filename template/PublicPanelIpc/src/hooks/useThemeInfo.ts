import { useState, useEffect } from 'react';
import { onThemeChange, offThemeChange, usePageEvent } from '@ray-js/ray';
import { useMemoizedFn } from 'ahooks';
import { useSystemInfo } from './useSystemInfo';

type Theme = 'light' | 'dark';

export function useTheme(): Theme {
  const systemInfo = useSystemInfo();
  const [theme, setTheme] = useState(systemInfo.theme);

  const listenTheme = useMemoizedFn(e => {
    setTheme(e.theme);
  });

  useEffect(() => {
    onThemeChange(listenTheme);
    return () => {
      offThemeChange(listenTheme);
    };
  }, []);

  usePageEvent('onUnload', () => {
    offThemeChange(listenTheme);
  });

  return theme;
}
