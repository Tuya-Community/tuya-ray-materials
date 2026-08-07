import { useEffect } from 'react';
import store from '@/redux';
import { updateRecordTask } from '@/redux/modules/audioFileSlice';

/**
 * 获取当前录音任务的 hook
 */
export const useRecordTask = () => {
  useEffect(() => {
    store.dispatch(updateRecordTask());
  }, []);
};
