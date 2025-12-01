import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAudioFile, updateRecordTransferResultList } from '@/redux/modules/audioFileSlice';
import { tttGetRecordTransferProcessStatus } from '@/api/ttt';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';

/**
 * 轮训更新转写状态
 */
export default function useUpdateTransferStatus() {
  const { fileList } = useSelector(selectAudioFile);
  const { devId } = useSelector(selectDevInfo);
  const dispatch = useDispatch();

  const [isPolling, setIsPolling] = useState(true);
  const intervalId = useRef(null);

  const getTransferProcessStatus = useCallback(async () => {
    // console.warn('getTransferProcessStatus fileList', fileList, new Date().getTime());
    if (fileList.length) {
      const doingRecordTransferIdList = [];
      fileList.forEach(item => {
        // 已上传且在转录中的记录，尝试去更新
        if (item.status === 2 && item.transfer === 1) {
          doingRecordTransferIdList.push(`${item.recordTransferId}`);
        }
      });

      if (doingRecordTransferIdList.length) {
        console.log('doingRecordTransferIdList', doingRecordTransferIdList);
        const d: any = await tttGetRecordTransferProcessStatus({
          deviceId: devId,
          fileIds: doingRecordTransferIdList,
        });
        if (d?.success?.length || d?.fail?.length) {
          dispatch(updateRecordTransferResultList());
        }
      }
    }
  }, [fileList]);

  useEffect(() => {
    if (isPolling) {
      getTransferProcessStatus();
      intervalId.current = setInterval(getTransferProcessStatus, 10000); // 每十秒调用
    }

    return () => clearInterval(intervalId.current); // 卸载时清除定时器
  }, [isPolling, getTransferProcessStatus]);

  return {
    getTransferProcessStatus,
  };
}
