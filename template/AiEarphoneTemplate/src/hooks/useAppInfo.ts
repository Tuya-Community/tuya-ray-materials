import { useEffect } from 'react';
import { getAppInfo } from '@ray-js/api';
import store from '@/redux';
import { updateAppInfo } from '@/redux/modules/appInfoSlice';

/**
 * 获取app信息的 hook
 */
export const useAppInfo = () => {
  useEffect(() => {
    getAppInfo({
      success: res => {
        store.dispatch(updateAppInfo(res));
      },
    });
  }, []);
};
