import { useEffect } from 'react';
import store from '@/redux';
import { getSupportLangList } from '@/redux/modules/uiStateSlice';

/**
 * 获取支持的语言列表的 hook
 */
export const useSupportLangList = () => {
  useEffect(() => {
    // 根据模块获取支持的语言列表
    store.dispatch(getSupportLangList(null));
  }, []);
};
