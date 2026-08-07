import { useState, useRef } from 'react';
import { useRequest } from 'ahooks';
import { RecordTransferResultDetail } from '@/api/ttt.interface';
import { tttGetRecordTransferRecognizeResult, tttGetRecordTransferRealTimeResult } from '@/api/ttt';
import { TranscriptSegment } from '@/types/file';
import { TransferStatus } from '@/constant/enums';
import { TransferType } from '../enum';
import { processRealtimeData, processCloudTransferData } from '../util';
import { GenerateType } from '@/redux/modules/fileDetailSlice';
/**
 * 转写结果管理Hook
 * 负责获取、处理和管理转写结果数据
 *
 * @param fileDetailRef - 文件详情引用
 * @param fileDetail - 文件详情数据
 * @param setTranscribeLoading - 设置转写tab骨架屏状态的函数
 * @returns {Object} 转写结果状态和方法
 * @property {TranscriptSegment[]} transferList - 转写列表
 * @property {Function} setTransferList - 设置转写列表
 * @property {boolean} transferResultLoading - 转写结果加载状态
 * @property {Function} setTransferResultLoading - 设置加载状态
 * @property {Function} getTransferResult - 获取转写结果
 * @property {React.MutableRefObject} originTransferListRef - 原始转写列表引用
 * @property {React.MutableRefObject} originRecognizeListRef - 原始识别列表引用
 */
export const useTransferResult = (
  fileDetailRef: React.MutableRefObject<RecordTransferResultDetail | null>,
  fileDetail: RecordTransferResultDetail | undefined,
  setTranscribeLoading: (loading: boolean) => void
) => {
  const [transferList, setTransferList] = useState<TranscriptSegment[]>([]);
  const [transferResultLoading, setTransferResultLoading] = useState(false);

  const originTransferListRef = useRef<TranscriptSegment[]>([]);
  const originRecognizeListRef = useRef<any>(null);
  const generateTypeRef = useRef<GenerateType>(null);

  /**
   * 获取转写结果
   */
  const fetchRecordTransferResult = async (): Promise<TranscriptSegment[]> => {
    if (!fileDetailRef.current) return Promise.resolve([]);

    const {
      transfer,
      recordId,
      transferType,
      cloudTranscription,
      recordTransferId,
      isFromCloud,
      duration,
    } = fileDetailRef.current;

    let result: TranscriptSegment[] = [];

    // 实时转写且非云端转录
    if (transferType === TransferType.Realtime && !cloudTranscription && !isFromCloud) {
      const realTimeResult = await tttGetRecordTransferRealTimeResult({
        recordId,
      });
      result = processRealtimeData(realTimeResult);
    } else if (transfer === TransferStatus.Success || cloudTranscription || isFromCloud) {
      // 获取云端录音转写数据
      const cloudResult = await tttGetRecordTransferRecognizeResult({
        recordTransferId,
        from: 0, // 本地
      });
      const list = cloudResult?.text ? JSON.parse(cloudResult?.text) : [];
      originRecognizeListRef.current = list;
      result = processCloudTransferData(list, duration);
    }

    originTransferListRef.current = result;
    return result;
  };

  const { runAsync: getTransferResult } = useRequest(fetchRecordTransferResult, {
    manual: true,
    onSuccess: res => {
      setTransferList(res);
    },
    onFinally: () => {
      setTransferResultLoading(false);
      // 转写接口返回后，总是取消转写tab的骨架屏（因为转写数据已加载完成）
      setTranscribeLoading(false);
      if (generateTypeRef.current === GenerateType.Translate) {
        generateTypeRef.current = null;
      }
    },
  });

  return {
    transferList,
    setTransferList,
    transferResultLoading,
    setTransferResultLoading,
    getTransferResult,
    originTransferListRef,
    originRecognizeListRef,
    generateTypeRef,
  };
};
