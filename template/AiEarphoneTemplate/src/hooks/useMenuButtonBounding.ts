import { useEffect } from 'react';
import { getMenuButtonBoundingClientRect } from '@ray-js/ray';
import store from '@/redux';
import { updateSystemInfo } from '@/redux/modules/systemInfoSlice';

/**
 * 获取菜单按钮边界的 hook
 */
export const useMenuButtonBounding = () => {
  useEffect(() => {
    getMenuButtonBoundingClientRect({
      success: menuBounding => {
        store.dispatch(
          updateSystemInfo({
            menuBounding,
          })
        );
      },
    });
  }, []);
};
