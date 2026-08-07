/**
 * 说话人修改逻辑的自定义 Hook
 * 负责管理说话人修改弹窗和处理说话人修改请求
 */

import { useState, useCallback } from 'react';
import { showToast } from '@ray-js/ray';
import Strings from '@/i18n';
import { atopAudioContentEdit } from '@/api/common';
import { tttSaveRecordTransferRecognizeResult } from '@/api/ttt';
import { TranscriptSegment } from '@/types/file';
import { RecordTransferResultDetail } from '@/api/ttt.interface';

interface UseSpeakerModificationParams {
  devId: string;
  fileDetail: RecordTransferResultDetail;
  transferList: TranscriptSegment[];
  originRecognizeListRef: React.MutableRefObject<any>;
  originTransferListRef: React.MutableRefObject<TranscriptSegment[]>;
  setTransferList: (list: TranscriptSegment[]) => void;
}

interface UseSpeakerModificationReturn {
  open: boolean;
  selectedSpeaker: string;
  selectedIndex: number;
  handleClickSpeaker: (speaker: string, index: number) => void;
  handleConfirm: (value: string, isCheckAll: boolean) => Promise<void>;
  handleClose: () => void;
}

/**
 * 使用说话人修改
 * @param params 参数对象
 * @returns 说话人修改相关的状态和方法
 */
export const useSpeakerModification = (
  params: UseSpeakerModificationParams
): UseSpeakerModificationReturn => {
  const {
    devId,
    fileDetail,
    transferList,
    originRecognizeListRef,
    originTransferListRef,
    setTransferList,
  } = params;

  const [open, setOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 点击说话人
  const handleClickSpeaker = useCallback((speaker: string, index: number) => {
    setOpen(true);
    setSelectedSpeaker(speaker);
    setSelectedIndex(index);
  }, []);

  // 确认修改说话人
  const handleConfirm = useCallback(
    async (value: string, isCheckAll: boolean) => {
      if (value.length <= 1) {
        showToast({
          icon: 'none',
          title: Strings.getLang('modify_speaker_length_error'),
        });
        return;
      }

      // 创建更新函数
      const updateSpeaker = (item: any, index: number) => {
        if (isCheckAll) {
          return item.speaker === selectedSpeaker ? { ...item, speaker: value } : item;
        }
        return index === selectedIndex && item.speaker !== value
          ? { ...item, speaker: value }
          : item;
      };

      // 使用函数式更新避免直接修改原数组
      const newTransferList = transferList.map(updateSpeaker);
      const newRecognizeList = originRecognizeListRef.current.map(updateSpeaker);

      // 更新状态和引用
      setTransferList(newTransferList);
      originTransferListRef.current = newTransferList;
      originRecognizeListRef.current = newRecognizeList;

      try {
        const RecognizeListStr = JSON.stringify(newRecognizeList);

        // 并行执行云端和本地存储操作
        await Promise.all([
          // 存云端
          atopAudioContentEdit({
            devId,
            key: fileDetail.recordId,
            content: RecognizeListStr,
          }),
          // 存APP本地
          tttSaveRecordTransferRecognizeResult({
            recordTransferId: fileDetail.recordTransferId,
            text: RecognizeListStr,
          }),
        ]);

        showToast({
          icon: 'none',
          title: Strings.getLang('save_success'),
        });
        setOpen(false);
      } catch (error) {
        console.error('保存失败:', error);
        showToast({
          icon: 'none',
          title: Strings.getLang('save_failed'),
        });
      }
    },
    [
      selectedSpeaker,
      selectedIndex,
      transferList,
      originRecognizeListRef,
      originTransferListRef,
      setTransferList,
      devId,
      fileDetail,
    ]
  );

  // 关闭弹窗
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    selectedSpeaker,
    selectedIndex,
    handleClickSpeaker,
    handleConfirm,
    handleClose,
  };
};
