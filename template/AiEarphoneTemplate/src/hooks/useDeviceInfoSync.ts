import { useEffect } from 'react';
import store from '@/redux';
import { devInfoChange } from '@/redux/modules/devInfoSlice';
import { updateRecordTask } from '@/redux/modules/audioFileSlice';
import useDevChange from './useDevChange';

/**
 * 面板设备信息同步：homeId 写入 + 录音任务刷新
 * 多设备列表拉取已移除，仅同步当前面板设备与手机
 */
export const useDeviceInfoSync = () => {
  const homeId = store.getState()?.homeInfo?.homeId || '';
  const { isChangedCurrentDev } = useDevChange(false);

  useEffect(() => {
    if (homeId) {
      store.dispatch(devInfoChange({ homeId }));
    }
  }, [homeId]);

  useEffect(() => {
    if (isChangedCurrentDev) {
      store.dispatch(updateRecordTask());
    }
  }, [isChangedCurrentDev]);
};
