import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateRecordTransferResultList } from '@/redux/modules/audioFileSlice';
import { tttGetRecordTransferProcessStatus } from '@/api/ttt';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';

/**
 * 轮训更新转写状态
 */
export default function useUpdateSingleTransferStatus(recordTransferId: number, recordFile: any) {
  // const { fileList } = useSelector(selectAudioFile);
  const { devId } = useSelector(selectDevInfo);
  const dispatch = useDispatch();
  // const [fileDetail, setFileDetail] = useState(null);
  const [loopStatus, setLoopStatus] = useState(0); // 0-初始 1-成功 2-失败

  const intervalId = useRef(null);

  const getTransferProcessStatus = useCallback(async () => {
    console.warn('single getTransferProcessStatus', recordTransferId, ' recordFile', recordFile);
    try {
      // 对已上传且转录中的录音进行轮询
      if (recordFile?.status === 2 && recordFile?.transfer === 1) {
        const d: any = await tttGetRecordTransferProcessStatus({
          deviceId: devId,
          fileIds: [`${recordTransferId}`],
        });
        if (d?.success?.length || d?.fail?.length) {
          dispatch(updateRecordTransferResultList());
          if (d?.success?.length) {
            setLoopStatus(1);
          } else if (d?.fail?.length) {
            setLoopStatus(2);
          }
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
      }
    } catch (error) {
      console.log(error);
      setLoopStatus(2);
      clearInterval(intervalId.current);
    }
  }, [recordFile]);

  useEffect(() => {
    if (recordFile?.status === 2 && recordFile?.transfer === 1) {
      getTransferProcessStatus();
      if (!intervalId.current) {
        intervalId.current = setInterval(getTransferProcessStatus, 10000); // 每十秒调用
      }
    }
    return () => {
      intervalId.current && clearInterval(intervalId.current); // 卸载时清除定时器
      intervalId.current = null;
    };
  }, [getTransferProcessStatus]);

  return {
    loopStatus,
    setLoopStatus,
    getTransferProcessStatus,
  };
}
