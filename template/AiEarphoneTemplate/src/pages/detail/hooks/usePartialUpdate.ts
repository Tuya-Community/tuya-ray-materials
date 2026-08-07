import { useCallback, useEffect } from 'react';
import isNumber from 'lodash/isNumber';
import { RecordTransferResultDetail } from '@/api/ttt.interface';
import {
  TransferStatus,
  SummaryStatus,
  SummaryImageStatus,
  TranslateStatus,
  SingleCloudSyncStatus,
  FileOperateStatus,
} from '@/constant/enums';
import Strings from '@/i18n';
import { PARTIAL_RECORD_UPDATE_EVENT, partialRecordEmitter } from '@/utils/partialRecordEmitter';

interface UsePartialUpdateParams {
  fileDetailRef: React.MutableRefObject<RecordTransferResultDetail | null>;
  updateFileDetailLocal: (
    updater: (
      prev: RecordTransferResultDetail | undefined
    ) => RecordTransferResultDetail | undefined
  ) => void;
  getTransferResult: () => Promise<any>;
  getSummaryResult: () => Promise<any>;
  setTransferResultLoading: (loading: boolean) => void;
  setSummaryResultLoading: (loading: boolean) => void;
  setAudioDownloadStatus: (status: SingleCloudSyncStatus) => void;
  handleBackToHome: (tip: string) => void;
  refreshFileDetail: () => Promise<any>;
  setSummaryImageUrl: (url: string) => void;
}

/**
 * 部分更新事件处理Hook
 * 负责监听和处理MQTT局部刷新事件
 *
 * @param params - Hook参数
 * @returns void
 */
export const usePartialUpdate = ({
  fileDetailRef,
  updateFileDetailLocal,
  getTransferResult,
  getSummaryResult,
  setTransferResultLoading,
  setSummaryResultLoading,
  setAudioDownloadStatus,
  handleBackToHome,
  refreshFileDetail,
  setSummaryImageUrl,
}: UsePartialUpdateParams) => {
  /**
   * 处理详情状态更新事件(以前的轮训状态改成事件处理)
   */
  const handlePartialRecordUpdate = useCallback(
    (res: any) => {
      const { updateList } = res || {};

      if (!updateList?.length) return;

      const currentFile = updateList.find(
        item => item?.recordId === fileDetailRef.current?.recordId
      );

      if (!currentFile) return;

      const {
        name,
        transferStatus: tStatus,
        summaryStatus: sStatus,
        translateStatus: trStatus,
        cloudSyncStatus: csStatus,
        transcriptionStatus,
        operateStatus,
        summaryImageStatus,
        summaryImageUrl,
      } = currentFile || {};

      // 如果文件被删除，则直接返回列表
      if (operateStatus === FileOperateStatus.Delete) {
        handleBackToHome(Strings.getLang('file_detail_deleted'));
        return;
      }

      // 判断各项是否有更新（事件字段: transferStatus/summaryStatus/translateStatus -> fileDetail: transfer/summary/translateState）
      const hasNameUpdate = name !== fileDetailRef.current?.name;
      const hasTransferUpdate =
        isNumber(tStatus) &&
        tStatus !== TransferStatus.Initial &&
        tStatus !== fileDetailRef.current?.transfer;
      const hasSummaryUpdate =
        isNumber(sStatus) &&
        sStatus !== SummaryStatus.Initial &&
        sStatus !== fileDetailRef.current?.summary;
      const hasTranslateUpdate =
        isNumber(trStatus) &&
        trStatus !== TranslateStatus.Initial &&
        trStatus !== fileDetailRef.current?.translateState;
      const hasCloudSyncUpdate =
        (isNumber(csStatus) &&
          csStatus !== fileDetailRef.current?.cloudSyncStatus &&
          (csStatus === SingleCloudSyncStatus.Downloading ||
            csStatus === SingleCloudSyncStatus.DownloadSuccess ||
            csStatus === SingleCloudSyncStatus.DownloadFailed)) ||
        csStatus === SingleCloudSyncStatus.UploadSuccess;
      const hasTranscriptionUpdate =
        isNumber(transcriptionStatus) &&
        transcriptionStatus !== fileDetailRef.current?.transcriptionStatus;
      const hasSummaryImageUpdate =
        isNumber(summaryImageStatus) &&
        summaryImageStatus !== fileDetailRef.current?.summaryImageStatus;

      // 如果没有任何更新，直接返回
      if (
        !(
          hasTransferUpdate ||
          hasSummaryUpdate ||
          hasTranslateUpdate ||
          hasCloudSyncUpdate ||
          hasNameUpdate ||
          hasTranscriptionUpdate ||
          hasSummaryImageUpdate
        )
      ) {
        return;
      }

      // 音频下载状态更新
      if (hasCloudSyncUpdate) {
        setAudioDownloadStatus(csStatus);
        if (csStatus === SingleCloudSyncStatus.DownloadSuccess) {
          refreshFileDetail();
        }
      }

      // 合并所有字段更新为一次调用，避免 ahooks mutate 同步多次调用时后一次覆盖前一次（prev 拿到的都是旧值）
      const partialUpdates: Partial<RecordTransferResultDetail> = {};
      if (hasTransferUpdate) {
        partialUpdates.transfer = tStatus;
        // 局部刷新拿到已转写状态时，说明已完成云端转录，回写 cloudTranscription
        if (tStatus === TransferStatus.Success) {
          partialUpdates.cloudTranscription = true;
        }
      }
      if (hasSummaryUpdate) partialUpdates.summary = sStatus;
      if (hasTranslateUpdate) partialUpdates.translateState = trStatus;
      if (hasNameUpdate && name) partialUpdates.name = name;
      if (hasTranscriptionUpdate) partialUpdates.transcriptionStatus = transcriptionStatus;
      if (hasCloudSyncUpdate) partialUpdates.cloudSyncStatus = csStatus;
      if (hasSummaryImageUpdate) partialUpdates.summaryImageStatus = summaryImageStatus;

      if (Object.keys(partialUpdates).length > 0) {
        updateFileDetailLocal(prev => (prev ? { ...prev, ...partialUpdates } : prev));
      }

      // 副作用：根据状态触发接口请求等
      if (hasTransferUpdate) {
        if (tStatus === TransferStatus.Success) {
          getTransferResult();
        } else if (tStatus === TransferStatus.Fail) {
          setTransferResultLoading(false);
          setSummaryResultLoading(false);
        }
      }
      if (hasSummaryUpdate) {
        if (sStatus === SummaryStatus.Success) {
          getSummaryResult();
          refreshFileDetail();
        } else if (sStatus === SummaryStatus.Fail) {
          setSummaryResultLoading(false);
        }
      }
      if (hasTranslateUpdate && trStatus === TranslateStatus.Success) {
        getTransferResult();
      }
      if (
        hasSummaryImageUpdate &&
        summaryImageStatus === SummaryImageStatus.Complete &&
        summaryImageUrl
      ) {
        setSummaryImageUrl(summaryImageUrl);
      }
    },
    [
      fileDetailRef,
      updateFileDetailLocal,
      getTransferResult,
      getSummaryResult,
      setTransferResultLoading,
      setSummaryResultLoading,
      setAudioDownloadStatus,
      handleBackToHome,
      refreshFileDetail,
      setSummaryImageUrl,
    ]
  );

  useEffect(() => {
    // ty.wear.onPartialRecordUpdate 已统一在 DelayedHooksContainer 中注册，
    // 详情页通过 partialRecordEmitter 订阅，避免与首页注册时序冲突导致事件丢失。
    partialRecordEmitter.on(PARTIAL_RECORD_UPDATE_EVENT, handlePartialRecordUpdate);

    return () => {
      partialRecordEmitter.off(PARTIAL_RECORD_UPDATE_EVENT, handlePartialRecordUpdate);
    };
  }, [handlePartialRecordUpdate]);
};
