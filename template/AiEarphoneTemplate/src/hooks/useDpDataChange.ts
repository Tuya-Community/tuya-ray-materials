import { useEffect, useCallback } from 'react';
import { onDpDataChange, offDpDataChange } from '@ray-js/api';
import store from '@/redux';
import { formatDevSchema, formatDps } from '@/utils';
import { responseUpdateDevsDp } from '@/redux/modules/devsDpStateSlice';
import { responseUpdateDp } from '@/redux/modules/dpStateSlice';
import { recordControlCode } from '@/config/dpCodes';
import { updateRecordTask } from '@/redux/modules/audioFileSlice';
import { devInfoChange } from '@/redux/modules/devInfoSlice';

// 卡片录音开始/录音中的 record_control 值。只有这些明确录音态才允许自动切当前设备。
const RECORD_CONTROL_RECORDING_VALUES = new Set(['011', '511']);
const RECORD_TASK_SYNC_DEBOUNCE = 800;
const lastRecordTaskSyncMap = new Map<string, number>();

/**
 * 处理DP数据变更监听的 hook
 */
export const useDpDataChange = () => {
  const handleDpDataChange = useCallback((data: any) => {
    const dpState = formatDps(data);
    if (Object.keys(dpState).length > 0) {
      // 暂时保留下，原先牵扯的逻辑有点多
      store.dispatch(responseUpdateDp(dpState));
    }

    store.dispatch(responseUpdateDevsDp({ deviceId: data.deviceId, dps: dpState }));

    const recordControlValue = dpState[recordControlCode];
    if (recordControlValue != null && data.deviceId) {
      if (!RECORD_CONTROL_RECORDING_VALUES.has(`${recordControlValue}`)) {
        return;
      }

      // 当前选中设备可能是 PHONE，但录音 DP 是卡片上报的。
      // 先把全局当前设备切到真正录音的设备，避免页面继续按手机显示和操作。
      const { devInfo, deviceList } = store.getState();
      if (devInfo?.devId !== data.deviceId) {
        const recordingDevice = deviceList?.find(item => item?.devId === data.deviceId);
        if (recordingDevice) {
          store.dispatch(devInfoChange(formatDevSchema(recordingDevice)));
        }
      }

      const syncKey = `${data.deviceId}:${recordControlValue}`;
      const now = Date.now();
      if (now - (lastRecordTaskSyncMap.get(syncKey) || 0) < RECORD_TASK_SYNC_DEBOUNCE) {
        return;
      }
      lastRecordTaskSyncMap.set(syncKey, now);
      // 按上报设备拉任务，不能使用默认 devInfo.devId，否则当前设备是 PHONE 时会拉错。
      store.dispatch(updateRecordTask(data.deviceId));
    }
  }, []);

  useEffect(() => {
    offDpDataChange(handleDpDataChange);
    onDpDataChange(handleDpDataChange);
    // onNetworkStatusChange(handleNetworkStatusChange);
    return () => {
      offDpDataChange(handleDpDataChange);
    };
  }, [handleDpDataChange]);
};
