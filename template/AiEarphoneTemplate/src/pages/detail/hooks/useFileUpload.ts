/*
 * @Author: hkc
 * @Date: 2026-01-27 11:34:12
 * @Description:
 * @LastEditTime: 2026-02-05 17:43:24
 * @LastEditors: hkc
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { RecordTransferResultDetail } from '@/api/ttt.interface';
import { OfflineFileUploadStatus } from '@/types/file';
import { TransferStatus, SummaryStatus } from '@/constant/enums';
/**
 * 文件上传进度管理Hook
 * 负责监听文件上传进度和状态更新
 *
 * @param fileDetailRef - 文件详情引用
 * @param updateFileDetailLocal - 本地更新文件详情（用于上传完成后更新 transfer/summary）
 * @param initialProgress - 初始上传进度
 * @param initialUploadStatus - 初始上传状态
 * @returns {Object} 上传状态和进度
 * @property {number} progress - 上传进度（0-100）
 * @property {OfflineFileUploadStatus} uploadStatus - 上传状态
 */
export const useFileUpload = (
  fileDetailRef: React.MutableRefObject<RecordTransferResultDetail | null>,
  updateFileDetailLocal: (
    updater: (
      prev: RecordTransferResultDetail | undefined
    ) => RecordTransferResultDetail | undefined
  ) => void,
  initialProgress?: number,
  initialUploadStatus?: OfflineFileUploadStatus
) => {
  const [progress, setProgress] = useState<number>(initialProgress);
  const [uploadStatus, setUploadStatus] = useState<OfflineFileUploadStatus>(initialUploadStatus);
  const isInitializedRef = useRef(false);
  /**
   * 监听初始值变化，当 fileDetail 从空变为有值时更新状态
   */
  useEffect(() => {
    // 只在初始化时执行一次，且初始值有效时才更新
    if (
      !isInitializedRef.current &&
      (initialProgress !== undefined || initialUploadStatus !== undefined)
    ) {
      if (initialProgress !== undefined) {
        setProgress(initialProgress);
      }
      if (initialUploadStatus !== undefined) {
        setUploadStatus(initialUploadStatus);
      }
      isInitializedRef.current = true;
    }
  }, [initialProgress, initialUploadStatus]);

  /**
   * 处理文件上传进度事件
   */
  const handleGetProgress = useCallback(
    (res: any) => {
      if (!fileDetailRef.current) return;

      const { recordTransferId } = fileDetailRef.current;
      const { fileId, progress, status } = res || {};

      // 只处理当前文件的上传进度
      if (Number(fileId) !== recordTransferId) return;

      // 更新上传状态
      setUploadStatus(status);

      // 处理等待上传状态
      if (status === OfflineFileUploadStatus.Waiting) {
        return;
      }

      // 更新进度
      setProgress(progress || 0);

      // 处理上传完成状态
      if (status === OfflineFileUploadStatus.Completed) {
        // 上传完成，直接将状态改为转录中
        updateFileDetailLocal(prev =>
          prev
            ? { ...prev, transfer: TransferStatus.Process, summary: SummaryStatus.Process }
            : prev
        );
      }
    },
    [updateFileDetailLocal]
  );

  useEffect(() => {
    // @ts-ignore - ty.wear API
    ty?.wear?.onRecordTransferFileUploadEvent(handleGetProgress);

    return () => {
      // @ts-ignore - ty.wear API
      ty?.wear?.offRecordTransferFileUploadEvent(handleGetProgress);
    };
  }, [handleGetProgress]);

  return {
    progress,
    uploadStatus,
  };
};
