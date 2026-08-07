import { useEffect, useCallback } from 'react';
import { useAppEvent } from '@ray-js/ray';
import store from '@/redux';
import {
  RecordStatus,
  isForeignAppRecordingTask,
  updateAudioFile,
  updateRecordTask,
  updateRecordTransferResultList,
  updateTaskState,
} from '@/redux/modules/audioFileSlice';
import { devInfoChange } from '@/redux/modules/devInfoSlice';
import { formatDevSchema } from '@/utils';
import { updateMode } from '@/redux/modules/recordConfigSlice';
import { DEVTYPES } from '@/constant/enums';

/**
 * 处理录音状态变更的 hook
 */
export const useRecordStatus = () => {
  const handleUpdateRecordStatus = useCallback(async (res: any) => {
    const { deviceId, state } = res || {};
    const before = store.getState()?.audioFile;
    console.warn('[FTF-RecordDebug][statusEvent]', {
      deviceId,
      eventState: state,
      beforeTaskState: before?.taskState,
      beforeTask: before?.task
        ? {
            state: before.task.state,
            sourceTaskState: before.task.sourceTaskState,
            businessType: before.task.businessType,
            recordType: before.task.recordType,
            devId: before.task.devId,
          }
        : null,
    });

    // 新增一个任务状态字段，用于解决任务状态updateRecordTask返回前获取不到最新状态的问题, 修改task会引起录音页面渲染异常
    store.dispatch(updateTaskState(state));

    const afterTaskState = store.getState()?.audioFile?.taskState;
    const currentTask = store.getState()?.audioFile?.task;
    const isForeign = isForeignAppRecordingTask(currentTask);
    console.warn('[FTF-RecordDebug][afterUpdateTaskState]', {
      afterTaskState,
      isForeign,
      currentTask: currentTask
        ? {
            state: currentTask.state,
            sourceTaskState: currentTask.sourceTaskState,
            businessType: currentTask.businessType,
            recordType: currentTask.recordType,
          }
        : null,
    });

    if (isForeign) {
      // 翻译小程序任务不应驱动笔记小程序的录音态 UI，只做一次任务同步兜底
      console.warn('[FTF-RecordDebug][foreignTask] only updateRecordTask', { deviceId });
      store.dispatch(updateRecordTask(deviceId));
      return;
    }

    const deviceList = store.getState()?.deviceList || [];
    // 当前有任务进行中，并且当前任务设备是存在当前家庭下的
    const currentDev = deviceList.find(item => item.devId === deviceId);
    const selectedDevId = store.getState()?.devInfo?.devId;
    // 如果推送的设备是card并且状态是录音中，则将设备切换到card
    if (
      currentDev?.customDevType === DEVTYPES.card &&
      state === RecordStatus.RECORDING &&
      selectedDevId !== deviceId
    ) {
      currentDev && (await store.dispatch(devInfoChange(formatDevSchema(currentDev))));
    }

    if (currentDev) {
      // 只要存在家庭下的设备，录音任务变更都处理
      if (state === RecordStatus.FINISH) {
        console.warn('[FTF-RecordDebug][statusFinish] clear task');
        store.dispatch(updateRecordTransferResultList({ source: 'record_status_finish' }));
        // 将下面的任务转化为延时任务，避免录音完成后页面闪烁。
        setTimeout(() => {
          store.dispatch(
            updateAudioFile({
              task: null,
            })
          );
          store.dispatch(updateMode(null));
        }, 0);
      } else {
        // 状态事件自带真实录音设备。按事件 deviceId 拉任务，避免当前 devInfo 仍是 PHONE 时拉错。
        console.warn('[FTF-RecordDebug][dispatchUpdateRecordTask]', { deviceId });
        store.dispatch(updateRecordTask(deviceId));
      }
    } else {
      console.warn('[FTF-RecordDebug][statusEvent] device not in home list, skip updateRecordTask', {
        deviceId,
        selectedDevId,
      });
    }
  }, []);

  useEffect(() => {
    // 录音状态变更事件
    ty.wear.onRecordTransferStatusUpdateEvent(handleUpdateRecordStatus);

    return () => {
      ty.wear.offRecordTransferStatusUpdateEvent(handleUpdateRecordStatus);
    };
  }, [handleUpdateRecordStatus]);

  useAppEvent('onUnload', () => {
    ty.wear.offRecordTransferStatusUpdateEvent(handleUpdateRecordStatus);
  });
};
