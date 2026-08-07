import { useCallback, useEffect } from 'react';
import store from '@/redux';
import { updateFileSync } from '@/redux/modules/fileSyncSlice';
import { DeviceOfflineFileResult } from '@/api/ttt.interface';
import { CardTransferStatus } from '@/types/card';
import {
  OFFLINE_FILES_PROGRESS_EVENT,
  offlineFilesProgressEmitter,
} from '@/utils/offlineFilesProgressEmitter';

/**
 * App 级别的离线文件传输进度事件接入点。
 *
 * 设计动机：
 *   ty.wear.onOfflineFilesProgressEvent 在首页 / 传输页各自 on/off 时，
 *   页面切换（onHide 无参 off）会卸掉对方监听，导致进度空窗或互相覆盖。
 *
 * 解决方案：
 *   - 仅在 DelayedHooksContainer 中调用本 hook，应用启动后注册一次；
 *   - 收到事件后：
 *       a) 通过 offlineFilesProgressEmitter 转发给首页 / 传输页；
 *       b) 合并更新 fileSync.currentSyncCardDevInfo（保留 deviceId / name）。
 *
 * @return none
 */
export const useOfflineFilesProgress = () => {
  const handleOfflineFilesProgress = useCallback((data: DeviceOfflineFileResult) => {

    // 1) 转发给页面订阅方
    offlineFilesProgressEmitter.emit(OFFLINE_FILES_PROGRESS_EVENT, data);

    // 2) 同步 Redux，保留探测时写入的 deviceId / name
    const prev = store.getState()?.fileSync?.currentSyncCardDevInfo || ({} as any);
    const deviceId =
      (data as any)?.deviceId || data?.response?.deviceId || prev.deviceId || '';
    store.dispatch(
      updateFileSync({
        isCardSyncing: data?.status === CardTransferStatus.Downloading,
        currentSyncCardDevInfo: {
          ...prev,
          ...data,
          deviceId,
          name: prev.name || '',
        },
      })
    );
  }, []);

  useEffect(() => {
    // @ts-ignore - ty.wear API
    ty.wear?.onOfflineFilesProgressEvent?.(handleOfflineFilesProgress);

    return () => {
      // @ts-ignore - ty.wear API
      ty.wear?.offOfflineFilesProgressEvent?.(handleOfflineFilesProgress);
    };
  }, [handleOfflineFilesProgress]);
};
