import { useEffect } from 'react';
import { onThemeChange, offThemeChange } from '@ray-js/ray';
import store from '@/redux';
import { updateSystemInfo } from '@/redux/modules/systemInfoSlice';
import { invalidateThemeCache } from '@/utils/getCdnThemePath';
import { applyCdnImageVars, invalidateCdnImageStyleCache } from '@/utils/cdnImageVars';

/**
 * 监听系统主题变化的 hook
 */
export const useThemeChange = () => {
  useEffect(() => {
    if (typeof onThemeChange !== 'function') return null;

    const onHandleThemeChange = data => {
      // 清除主题缓存，确保获取最新主题
      invalidateThemeCache();
      invalidateCdnImageStyleCache();
      applyCdnImageVars();
      store.dispatch(
        updateSystemInfo({
          theme: data.theme,
        })
      );
    };

    onThemeChange(onHandleThemeChange);
    return () => {
      offThemeChange(onHandleThemeChange);
    };
  }, []);
};
