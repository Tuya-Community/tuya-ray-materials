/*
 * @Author: hkc
 * @Date: 2025-07-15 17:54:08
 * @LastEditors: hkc
 * @LastEditTime: 2026-04-17 20:09:29
 * @Description: 详情页顶部自定义导航栏
 */
import React, {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { navigateBackMiniProgram, router, showToast, usePageEvent, View, Text } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import cloneDeep from 'lodash/cloneDeep';
import { TopBar } from '@/components';
import { RecordType, removeFileListItem } from '@/redux/modules/audioFileSlice';
import { GenerateType, updateFileDetail } from '@/redux/modules/fileDetailSlice';
import moreIcon from '@tuya-miniapp/icons/dist/svg/More';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import CustomCoverView from '@/components/CustomCoverView';
import {
  TransferStatus,
  SummaryStatus,
  SummaryImageStatus,
  TranslateStatus,
  SingleCloudSyncStatus,
} from '@/constant/enums';
import {
  tttSaveRecordTransferRealTimeRecognizeResult,
  tttSaveRecordTransferRecognizeResult,
  tttDownloadFile,
  tttDownloadNoteAudio,
  tttOperateAudioFileSafePath,
  tttSetClipboardData,
  tttShareLocalFile,
  tttRemoveFiles,
} from '@/api/ttt';
import { atopAudioContentEdit, atopUpdateFileInfo } from '@/api/common';
import { atopGetSttShareLinkV3 } from '@/api/share';
import { isAndroid, sanitizeFileName } from '@/utils';
import { getCDNFileType } from '@/utils/url';
import { useRequest, useUpdateEffect } from 'ahooks';
import Res from '@/res';
import { processCloudTransferData } from '../../util';
import MoreModal from '../MoreModal';
import NameEditPopup from '../NameEditPopup';
import DeleteDialog from '../../../home/component/History/component/DeleteDialog';
import AudioPlayer from '../AudioPlayer';
import AudioExportPopup from '../AudioExportPopup';
import CopyTranscriptionConfigPopup from '../CopyTranscriptionConfigPopup';
import ExportTranscriptionConfigPopup, {
  ContentType,
  ExportFormatType,
} from '../ExportTranscriptionConfigPopup';
import ExportSummaryConfigPopup from '../ExportSummaryConfigPopup';
import ShareConfigPopup from '../ShareLinkModal';
import CloudSyncPopup from '../CloudSyncPopup';
import ExportMindMapPopup from '../ExportMindMapPopup';
import { DetailTabType } from '../..';
import FileDetailContext from '../../context';
import { TransferType, PlayStatus } from '../../enum';

import styles from './index.module.less';

interface IProps {
  summary: string; // 总结
  updateSummary: (params: { title: string; summary: string }) => Promise<void>;
  activeTab: DetailTabType;
}

interface IRef {
  closeMorePopup: () => void;
}

const disabledRetranscribeConfig = [
  RecordType.FaceToFacePro,
  RecordType.FaceToFace,
  RecordType.CallTranslation,
  RecordType.PhoneEar,
];

const Index = React.forwardRef<IRef, IProps>((props, ref) => {
  const { summary, updateSummary, activeTab } = props;
  const { cloudSyncSwitchStatus } = useSelector(state => state.uiState);
  const { homeId } = useSelector(state => state.devInfo);
  const [showMore, setShowMore] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [from, setFrom] = useState(''); // 来源

  // 弹窗状态
  const [showMindMapExportPopup, setShowMindMapExportPopup] = useState(false);
  const [showAudioExportPopup, setShowAudioExportPopup] = useState(false);
  const [showCopyConfigPopup, setShowCopyConfigPopup] = useState(false);
  const [showExportTranscriptionConfigPopup, setShowExportTranscriptionConfigPopup] =
    useState(false);
  const [showExportSummaryConfigPopup, setShowExportSummaryConfigPopup] = useState(false);
  const [showShareConfigPopup, setShowShareConfigPopup] = useState(false);
  const [showCloudSyncPopup, setShowCloudSyncPopup] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRemoveLocalDialog, setShowRemoveLocalDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [removeLocalLoading, setRemoveLocalLoading] = useState(false);

  const dispatch = useDispatch();
  const { devId = '' } = useSelector(state => state.devInfo);
  const {
    setTranslatePopupShow,
    fileDetail,
    transferList,
    setTransferList,
    originTransferListRef,
    originRecognizeListRef,
    isEditMode,
    setIsEditMode,
    setTransEditIndex,
    audioDownloadStatus,
    setAudioDownloadStatus,
    audioContext,
    playStatus,
    setPlayStatus,
    refreshFileDetail,
    markAsLeaving,
  } = useContext(FileDetailContext);
  const transferStatus = fileDetail?.transfer;
  const summaryStatus = fileDetail?.summary;
  const translateStatus = fileDetail?.translateState;
  const summaryImageStatus = fileDetail?.summaryImageStatus;

  const { fileId, recordId, filePath, wavFilePath } = fileDetail || {};
  const [safePath, setSafePath] = useState<string>();
  const isShareAudioRef = useRef(false);

  const sharedFilePath = useMemo(() => wavFilePath || filePath, [wavFilePath, filePath]);

  // 是否有翻译
  const hasTranslate = useMemo(() => {
    if (!transferList || transferList.length === 0) return false;
    return transferList.some(item => !!item?.transText?.trim());
  }, [transferList]);

  // 是否有说话人
  const hasSpeaker = useMemo(() => {
    if (!transferList || transferList.length === 0) return false;
    return transferList.some(item => !!item?.speaker?.trim());
  }, [transferList]);

  // 检查转写是否成功
  const isTransferSuccess = transferStatus === TransferStatus.Success;

  // 检查编辑内容是否可用
  const isEditContentAvailable = useMemo(() => {
    return isTransferSuccess && transferList?.length > 0;
  }, [isTransferSuccess, transferList?.length]);

  // 检查翻译是否可用
  const isTranslateAvailable = useMemo(() => {
    return isTransferSuccess && hasTranslate;
  }, [isTransferSuccess, hasTranslate]);

  // 检查转写或者导出讲话人是否可用
  const isSpeakerLabelAvailable = useMemo(() => {
    return isTransferSuccess && hasSpeaker;
  }, [isTransferSuccess, hasSpeaker]);

  // 检查总结是否可用
  const isSummaryAvailable = useMemo(() => {
    return isTransferSuccess && summaryStatus === SummaryStatus.Success;
  }, [isTransferSuccess, summaryStatus]);

  // 获取音频分享小程序合规路径
  const { runAsync: operateAudioFileSafePath } = useRequest(tttOperateAudioFileSafePath, {
    manual: true,
    onSuccess: res => {
      setSafePath(res?.safePath);
    },
  });

  // 分享文件
  const { runAsync: shareFile } = useRequest(tttShareLocalFile, {
    manual: true,
    onFinally: () => {
      if (safePath && isShareAudioRef.current) {
        operateAudioFileSafePath({
          isGetPath: false,
          audioPath: safePath,
        });
      }
    },
  });

  // 音频下载失败，关闭音频导出弹窗
  const downloadFailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useUpdateEffect(() => {
    if (audioDownloadStatus === SingleCloudSyncStatus.DownloadFailed && showAudioExportPopup) {
      downloadFailTimerRef.current = setTimeout(() => {
        setShowAudioExportPopup(false);
        downloadFailTimerRef.current = null;
      }, 1000);
    }
  }, [audioDownloadStatus]);
  useEffect(() => {
    return () => {
      if (downloadFailTimerRef.current) {
        clearTimeout(downloadFailTimerRef.current);
        downloadFailTimerRef.current = null;
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    closeMorePopup: () => setShowMore(false),
  }));

  // 保存文件名
  const handleSaveName = async (name: string) => {
    if (name && name !== fileDetail?.name) {
      updateSummary({
        title: name,
        summary,
      });
      // 更新云端文件名
      await atopUpdateFileInfo({
        audioRecordRequest: JSON.stringify({
          recordId: fileDetail?.recordId,
          name,
          ownerId: homeId,
        }),
      });
    }
    setShowEditName(false);
  };

  // 保存编辑
  const handleEditSave = useCallback(async () => {
    if (!fileDetail) return;
    const { duration, recordTransferId, transferType, cloudTranscription, recordId } =
      fileDetail || {};
    try {
      // 实时转写/同声传译的编辑保存逻辑 与 离线转写不同
      if (transferType === TransferType.Realtime && !cloudTranscription) {
        transferList.forEach(async item => {
          const { asrId, text, transText } = item;
          await tttSaveRecordTransferRealTimeRecognizeResult({
            asrId,
            asr: text,
            translate: transText,
          });
        });
      } else {
        if (!originRecognizeListRef.current) return;
        // 处理修改后的转写记录，分别存到云端和APP本地
        const newSttList = cloneDeep(originRecognizeListRef.current).map(
          (item: any, idx: string | number) => ({
            ...item,
            transcript: transferList[idx]?.text || '',
            translation: transferList[idx]?.transText || '',
          })
        );
        const newSttListJsonStr = JSON.stringify(newSttList);
        // 存云端
        const cloudParams = {
          devId,
          key: recordId,
          content: newSttListJsonStr,
        };
        await atopAudioContentEdit(cloudParams);
        // 存APP本地
        const localParams = {
          recordTransferId,
          text: newSttListJsonStr,
        };
        await tttSaveRecordTransferRecognizeResult(localParams);
        // resolveSttText(newSttListJsonStr);
        originRecognizeListRef.current = newSttList;
        const newList = processCloudTransferData(newSttList, duration);
        setTransferList(newList);
        originTransferListRef.current = newList;
      }
    } catch {
      // ignore save failure
    } finally {
      setIsEditMode(false);
      setTransEditIndex(-1);
    }
  }, [transferList, fileDetail]);

  // 取消编辑
  const handleEditCancel = useCallback(() => {
    setTransferList(originTransferListRef.current);
    setIsEditMode(false);
    setTransEditIndex(-1);
  }, []);

  const renderRight = useMemo(
    () => (
      <View className={styles.rightBox}>
        {isEditMode ? (
          <Text className={styles.save} onClick={handleEditSave}>
            {Strings.getLang('save')}
          </Text>
        ) : (
          <View className={styles.icons}>
            <Icon
              name={moreIcon}
              className={styles.icon}
              onClick={() => {
                setShowMore(true);
              }}
            />
          </View>
        )}
      </View>
    ),
    [isEditMode, handleEditSave]
  );

  usePageEvent('onLoad', query => {
    if (query?.from) {
      setFrom(query?.from);
    }
  });

  const handleBack = () => {
    if (isEditMode) {
      handleEditCancel();
    } else if (from === 'translate') {
      navigateBackMiniProgram();
    } else if (from === 'notification') {
      router.replace('/');
    } else {
      router.back();
    }
  };

  // 监听侧滑返回
  useEffect(() => {
    // @ts-ignore
    ty?.onNavigationBarBack(handleBack);

    return () => {
      // @ts-ignore
      ty?.offNavigationBarBack(handleBack);
    };
  }, [isEditMode]);

  // 更多列表选项
  const moreList = useMemo(
    () => [
      {
        title: Strings.getLang('more_edit_name'),
        disabled:
          transferStatus === TransferStatus.Process || summaryStatus === SummaryStatus.Process,
        icon: Res.editSvg,
        iconName: 'editSvg',
        onClick: () => {
          if (transferStatus === TransferStatus.Process) {
            ty.showToast({
              title: Strings.getLang('action_transcribing_tip'),
              icon: 'none',
            });
            return;
          }
          if (summaryStatus === SummaryStatus.Process) {
            ty.showToast({
              title: Strings.getLang('action_summarizing_tip'),
              icon: 'none',
            });
            return;
          }
          setShowMore(false);
          setShowEditName(true);
        },
      },
      {
        title: Strings.getLang('more_edit_content'),
        icon: Res.contentSvg,
        iconName: 'contentSvg',
        disabled: !isEditContentAvailable,
        category: 'edit' as const,
        onClick: () => {
          if (transferStatus === TransferStatus.Process) {
            ty.showToast({
              title: Strings.getLang('action_transcribing_tip'),
              icon: 'none',
            });
            return;
          }

          if (transferStatus !== TransferStatus.Success) {
            showToast({
              title: Strings.getLang('action_not_transfer_tip'),
              icon: 'none',
            });
            return;
          }

          if (transferList?.length === 0) {
            showToast({
              title: Strings.getLang('action_transcribe_empty_tip'),
              icon: 'none',
            });
            return;
          }

          setIsEditMode(true);
          setShowMore(false);
        },
      },
      {
        title: Strings.getLang('more_re_transcribe'),
        icon: Res.transcribeSvg,
        iconName: 'transcribeSvg',
        disabled:
          disabledRetranscribeConfig.includes(fileDetail?.recordType) ||
          transferStatus === TransferStatus.Process ||
          summaryStatus === SummaryStatus.Process,
        category: 'process' as const,
        onClick: () => {
          if (disabledRetranscribeConfig.includes(fileDetail?.recordType)) {
            return;
          }
          if (transferStatus === TransferStatus.Process) {
            showToast({
              title: Strings.getLang('action_transcribing_tip'),
              icon: 'none',
            });
            return;
          }
          if (summaryStatus === SummaryStatus.Process) {
            showToast({
              title: Strings.getLang('action_summarizing_tip'),
              icon: 'none',
            });
            return;
          }
          dispatch(
            updateFileDetail({
              generateType: GenerateType.Transcribe,
              selectTemplateShow: true,
            })
          );
          setShowMore(false);
        },
      },
      {
        title: Strings.getLang('more_re_summarize'),
        icon: Res.summarizeSvg,
        iconName: 'summarizeSvg',
        disabled:
          summaryStatus === SummaryStatus.Process ||
          transferStatus === TransferStatus.Process ||
          summaryImageStatus === SummaryImageStatus.Generating,
        category: 'process' as const,
        onClick: () => {
          if (transferStatus === TransferStatus.Process) {
            showToast({
              title: Strings.getLang('action_transcribing_tip'),
              icon: 'none',
            });
            return;
          }
          if (
            summaryStatus === SummaryStatus.Process ||
            summaryImageStatus === SummaryImageStatus.Generating
          ) {
            showToast({
              title: Strings.getLang('action_summarizing_tip'),
              icon: 'none',
            });
            return;
          }
          // 部分转写（transcriptionStatus === 2）时即使已转写成功，也需要先补充转写再总结
          const isPartialTranscription = fileDetail?.transcriptionStatus === 2;
          dispatch(
            updateFileDetail({
              generateType:
                fileDetail?.transfer === TransferStatus.Success && !isPartialTranscription
                  ? GenerateType.Summarize
                  : GenerateType.Transcribe,
              selectTemplateShow: true,
            })
          );
          setShowMore(false);
        },
      },
      {
        title: Strings.getLang('more_translate'),
        icon: Res.translateIcon,
        iconName: 'translateIcon',
        disabled:
          !fileDetail?.cloudTranscription ||
          transferStatus !== TransferStatus.Success ||
          summaryStatus === SummaryStatus.Process ||
          translateStatus === TranslateStatus.Process,
        category: 'translate' as const,
        onClick: () => {
          if (transferStatus === TransferStatus.Process) {
            ty.showToast({
              title: Strings.getLang('action_transcribing_tip'),
              icon: 'none',
            });
            return;
          }
          if (summaryStatus === SummaryStatus.Process) {
            ty.showToast({
              title: Strings.getLang('action_summarizing_tip'),
              icon: 'none',
            });
            return;
          }
          if (transferStatus !== TransferStatus.Success || !fileDetail?.cloudTranscription) {
            ty.showToast({
              title: Strings.getLang(
                transferStatus === TransferStatus.Success
                  ? 'action_re_transcribe_tip'
                  : 'action_not_transfer_tip'
              ),
              icon: 'none',
            });
            return;
          }
          if (translateStatus === TranslateStatus.Process) {
            ty.showToast({
              title: Strings.getLang('action_translating_tip'),
              icon: 'none',
            });
            return;
          }
          dispatch(
            updateFileDetail({
              generateType: GenerateType.Translate,
            })
          );
          setTranslatePopupShow(true);
          setShowMore(false);
        },
      },
      {
        title: Strings.getLang('more_remove_local_audio'),
        icon: Res.removeLocalFile,
        iconName: 'removeLocalFile',
        disabled:
          (fileDetail?.cloudSyncStatus !== SingleCloudSyncStatus.UploadSuccess &&
            !fileDetail?.isFromCloud) ||
          !filePath,
        category: 'manage' as const,
        onClick: () => {
          if (
            fileDetail?.cloudSyncStatus !== SingleCloudSyncStatus.UploadSuccess &&
            !fileDetail?.isFromCloud
          ) {
            showToast({
              title: Strings.getLang('remove_local_audio_no_cloud_backup'),
              icon: 'none',
            });
            return;
          }
          if (!filePath) {
            showToast({
              title: Strings.getLang('remove_local_audio_not_exist'),
              icon: 'none',
            });
            return;
          }
          if (fileDetail?.offlineUploadStatus === 1) {
            showToast({
              title: Strings.getLang('remove_local_audio_uploading'),
              icon: 'none',
            });
            return;
          }
          setShowMore(false);
          setShowRemoveLocalDialog(true);
        },
      },
      {
        title: Strings.getLang('delete'),
        icon: Res.removeIcon,
        iconName: 'removeIcon',
        category: 'manage' as const,
        onClick: () => {
          setShowMore(false);
          setShowDeleteDialog(true);
        },
      },
    ],
    [transferStatus, summaryStatus, translateStatus, fileDetail, activeTab]
  );

  const handleCloseMoreModal = useCallback(() => {
    setShowMore(false);
  }, []);

  const handleShowMoreModal = useCallback(() => {
    setShowMore(true);
  }, []);

  // 确认删除录音
  const handleDeleteConfirm = useCallback(async () => {
    if (!fileDetail?.recordTransferId) return;
    setDeleteLoading(true);
    try {
      await tttRemoveFiles({
        fileIds: [fileDetail.recordTransferId],
        isDeleteAll: true,
      });
      dispatch(removeFileListItem({ value: fileDetail.recordTransferId, key: 'recordTransferId' }));
      setShowDeleteDialog(false);
      markAsLeaving?.();
      showToast({ title: Strings.getLang('delete_success'), icon: 'success' });
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch {
      showToast({ title: Strings.getLang('delete_fail'), icon: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  }, [fileDetail?.recordTransferId, dispatch, markAsLeaving]);

  // 确认移除本地音频
  const handleRemoveLocalConfirm = useCallback(async () => {
    if (!fileDetail?.recordTransferId) return;
    setRemoveLocalLoading(true);
    try {
      // 正在播放时自动停止
      if (playStatus === PlayStatus.Play || playStatus === PlayStatus.Resume) {
        audioContext?.stop();
        setPlayStatus(PlayStatus.Initial);
      }
      await tttRemoveFiles({
        fileIds: [fileDetail.recordTransferId],
        isDeleteAll: false,
      });
      setShowRemoveLocalDialog(false);
      showToast({ title: Strings.getLang('remove_local_audio_success'), icon: 'success' });
      setAudioDownloadStatus?.(SingleCloudSyncStatus.Default);
      refreshFileDetail?.();
    } catch {
      showToast({ title: Strings.getLang('remove_local_audio_fail'), icon: 'error' });
    } finally {
      setRemoveLocalLoading(false);
    }
  }, [
    fileDetail?.recordTransferId,
    playStatus,
    audioContext,
    setPlayStatus,
    refreshFileDetail,
    setAudioDownloadStatus,
  ]);

  // 复制到剪贴板
  const copyToClipboard = useCallback(async (text: string) => {
    await tttSetClipboardData(text);
    ty.showToast({
      title: Strings.getLang('share_modal_copy_success_toast'),
      icon: 'success',
    });
    setShowMore(false);
  }, []);

  // 校验转写状态函数
  const checkTransferStatus = useCallback(() => {
    if (transferStatus === TransferStatus.Process) {
      showToast({
        title: Strings.getLang('action_transcribing_tip'),
        icon: 'none',
      });
      return false;
    }
    if (transferStatus !== TransferStatus.Success) {
      showToast({
        title: Strings.getLang('action_not_transfer_tip'),
        icon: 'none',
      });
      return false;
    }
    return true;
  }, [transferStatus]);

  // 验证并提示总结不可用
  const checkSummaryAvailable = useCallback(() => {
    if (!checkTransferStatus()) return false;
    if (!isSummaryAvailable) {
      showToast({
        title: Strings.getLang('action_not_summarize_tip'),
        icon: 'none',
      });
      return false;
    }
    return true;
  }, [checkTransferStatus, isSummaryAvailable]);

  const checkMindAvailable = useCallback(() => {
    if (!checkTransferStatus()) return false;
    if (!isSummaryAvailable) {
      showToast({
        title: Strings.getLang('action_not_summarize_tip'),
        icon: 'none',
      });
      return false;
    }
    if (summary === '') {
      showToast({
        title: Strings.getLang('mind_map_empty_tip'),
        icon: 'none',
      });
      return false;
    }
    return true;
  }, [checkTransferStatus, isSummaryAvailable, summary]);

  const downloadFile = useCallback(
    async link => {
      if (!link) {
        ty.showToast({ title: Strings.getLang('export_empty'), icon: 'error' });
        return;
      }

      // 对文件名进行安全处理
      const safeFileName = sanitizeFileName(fileDetail.name);
      const fileType = getCDNFileType(link);
      const sourcePath = `thingfile://tmp/${safeFileName}.${fileType}`;
      const filePath = isAndroid() ? sourcePath : encodeURI(sourcePath);
      // 下载并指定文件后缀名
      const fileObj: any = await tttDownloadFile({
        url: link,
        filePath,
      });

      if (fileObj?.filePath) {
        await shareFile(decodeURI(fileObj?.filePath));
      }
    },
    [shareFile, fileDetail]
  );

  // 处理导出转写配置确认
  const handleExportTranscriptionConfirm = useCallback(
    async (config: {
      contentType: Extract<ContentType, 'ORIGINAL' | 'TRANSLATION' | 'ORIGINAL_AND_TRANSLATION'>;
      showTime: boolean;
      showSpeaker: boolean;
      exportType: ExportFormatType;
    }) => {
      const { contentType, showSpeaker, showTime, exportType } = config;
      const link = await atopGetSttShareLinkV3({
        key: recordId,
        exportType: 'TRANSCRIPTION',
        format: exportType,
        contentOption: contentType,
        paragraphTime: showTime,
        speakerLabel: showSpeaker,
      });
      try {
        await downloadFile(link);
        setShowMore(false);
        setShowExportTranscriptionConfigPopup(false);
      } catch {
        // ignore download failure
      }
    },
    [recordId, downloadFile]
  );

  // 处理导出总结配置确认
  const handleExportSummaryConfirm = useCallback(
    async (config: { exportType: ExportFormatType }) => {
      const { exportType } = config;
      const link = await atopGetSttShareLinkV3({
        key: recordId,
        exportType: 'SUMMARY',
        format: exportType,
      });
      try {
        downloadFile(link);
        setShowMore(false);
        setShowExportSummaryConfigPopup(false);
      } catch {
        // ignore download failure
      }
    },
    [recordId, downloadFile]
  );

  // 分享音频文件（处理安全路径）
  const shareAudioFile = useCallback(
    async (audioPath: string) => {
      isShareAudioRef.current = true;
      let safePath = audioPath;
      const res = await operateAudioFileSafePath({
        isGetPath: true,
        audioPath,
      });
      if (res?.safePath) {
        safePath = res?.safePath;
      }
      await shareFile(safePath);
    },
    [operateAudioFileSafePath, shareFile]
  );

  // 音频下载完成后自动分享
  useEffect(() => {
    if (
      audioDownloadStatus === SingleCloudSyncStatus.DownloadSuccess &&
      sharedFilePath &&
      showAudioExportPopup
    ) {
      setShowAudioExportPopup(false);
      shareAudioFile(sharedFilePath);
    }
  }, [audioDownloadStatus, sharedFilePath, showAudioExportPopup, shareAudioFile]);

  // MoreModal 弹窗控制函数
  const handleOpenCopyConfigPopup = useCallback(() => {
    setShowCopyConfigPopup(true);
    setShowMore(false);
  }, []);

  const handleOpenExportTranscriptionConfigPopup = useCallback(() => {
    setShowExportTranscriptionConfigPopup(true);
    setShowMore(false);
  }, []);

  const handleOpenExportSummaryConfigPopup = useCallback(() => {
    setShowExportSummaryConfigPopup(true);
    setShowMore(false);
  }, []);

  const handleOpenShareConfigPopup = useCallback(() => {
    if (
      fileDetail?.cloudSyncStatus !== SingleCloudSyncStatus.UploadSuccess &&
      !fileDetail?.isFromCloud &&
      !cloudSyncSwitchStatus?.enabled
    ) {
      showToast({
        title: Strings.getLang('share_audio_not_uploaded_tip'),
        icon: 'none',
      });
      return;
    }
    setShowShareConfigPopup(true);
    setShowMore(false);
  }, [fileDetail?.cloudSyncStatus]);

  const handleOpenCloudSyncPopup = useCallback(() => {
    setShowCloudSyncPopup(true);
    setShowMore(false);
  }, []);

  const handleExportAudio = useCallback(async () => {
    // 如果音频文件不存在，则自动下载音频
    if (!sharedFilePath) {
      setShowAudioExportPopup(true);
      await tttDownloadNoteAudio({
        fileId,
        recordId,
      });
      return;
    }
    await shareAudioFile(sharedFilePath);
  }, [sharedFilePath, fileId, recordId, shareAudioFile]);

  const handleCopySummary = useCallback(async () => {
    copyToClipboard(summary);
  }, [summary, copyToClipboard]);

  // 触发思维导图导出
  const handleExportMindMap = useCallback(() => {
    setShowMindMapExportPopup(true);
  }, []);

  return (
    <View className={styles.navBar}>
      <TopBar
        titleClass={styles.title}
        onBack={handleBack}
        type={isEditMode ? 'custom' : 'system'}
        ignoreSyncing
        slot={{
          title: (
            <View>
              <AudioPlayer showCoverView={activeTab === DetailTabType.MindMap} />
            </View>
          ),
          right: renderRight,
        }}
      />
      {/* 更多菜单 */}
      {showMore && (
        <MoreModal
          show={showMore}
          onClose={handleCloseMoreModal}
          moreListData={moreList}
          onOpenCopyConfigPopup={handleOpenCopyConfigPopup}
          onOpenExportTranscriptionConfigPopup={handleOpenExportTranscriptionConfigPopup}
          onOpenExportSummaryConfigPopup={handleOpenExportSummaryConfigPopup}
          onOpenShareConfigPopup={handleOpenShareConfigPopup}
          onOpenCloudSyncPopup={handleOpenCloudSyncPopup}
          onExportAudio={handleExportAudio}
          onCopySummary={handleCopySummary}
          onExportMindMap={handleExportMindMap}
          checkTransferStatus={checkTransferStatus}
          checkSummaryAvailable={checkSummaryAvailable}
          checkMindAvailable={checkMindAvailable}
        />
      )}
      {/* 文件名编辑 */}
      {showEditName && (
        <CustomCoverView>
          <NameEditPopup
            show={showEditName}
            onClose={() => {
              setShowEditName(false);
            }}
            fileName={fileDetail?.name}
            onSave={handleSaveName}
          />
        </CustomCoverView>
      )}

      {/* 音频导出弹窗 */}
      {showAudioExportPopup && (
        <AudioExportPopup
          show={showAudioExportPopup}
          onClose={() => {
            setShowAudioExportPopup(false);
          }}
        />
      )}
      {/* 复制转写配置弹窗 */}
      {showCopyConfigPopup && (
        <CopyTranscriptionConfigPopup
          isTranslateAvailable={isTranslateAvailable}
          isSpeakerLabelAvailable={isSpeakerLabelAvailable}
          show={showCopyConfigPopup}
          onClose={() => {
            // 误触或者关闭后，显示更多菜单
            setShowCopyConfigPopup(false);
            handleShowMoreModal();
          }}
          transferList={transferList}
          onSuccess={() => {
            setShowCopyConfigPopup(false);
            setShowMore(false);
          }}
        />
      )}
      {/* 导出转写配置弹窗 */}
      {showExportTranscriptionConfigPopup && (
        <ExportTranscriptionConfigPopup
          isTranslateAvailable={isTranslateAvailable}
          isSpeakerLabelAvailable={isSpeakerLabelAvailable}
          show={showExportTranscriptionConfigPopup}
          onClose={() => {
            // 误触或者关闭后，显示更多菜单
            setShowExportTranscriptionConfigPopup(false);
            handleShowMoreModal();
          }}
          onConfirm={handleExportTranscriptionConfirm}
        />
      )}
      {/* 导出总结配置弹窗 */}
      {showExportSummaryConfigPopup && (
        <ExportSummaryConfigPopup
          show={showExportSummaryConfigPopup}
          onClose={() => {
            // 误触或者关闭后，显示更多菜单
            setShowExportSummaryConfigPopup(false);
            handleShowMoreModal();
          }}
          onConfirm={handleExportSummaryConfirm}
        />
      )}
      {/* 分享配置弹窗 */}
      {showShareConfigPopup && (
        <ShareConfigPopup
          show={showShareConfigPopup}
          recordId={recordId}
          isSpeakerLabelAvailable={isSpeakerLabelAvailable}
          isTranslateAvailable={isTranslateAvailable}
          summary={summary}
          cloudSyncStatus={fileDetail?.cloudSyncStatus}
          isFromCloud={fileDetail?.isFromCloud}
          transferList={transferList}
          onClose={() => {
            setShowShareConfigPopup(false);
            handleShowMoreModal();
          }}
        />
      )}
      {/* 云同步弹窗 */}
      {showCloudSyncPopup && (
        <CloudSyncPopup
          show={showCloudSyncPopup}
          onClose={() => {
            setShowCloudSyncPopup(false);
            handleShowMoreModal();
          }}
        />
      )}
      {/* 导出思维导图弹窗 */}
      {showMindMapExportPopup && (
        <ExportMindMapPopup
          show={showMindMapExportPopup}
          summary={summary}
          onClose={() => setShowMindMapExportPopup(false)}
        />
      )}

      {/* 删除录音确认弹窗 */}
      <DeleteDialog
        show={showDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onClose={() => setShowDeleteDialog(false)}
        loading={deleteLoading}
      />

      {/* 移除本地音频确认弹窗 */}
      <DeleteDialog
        show={showRemoveLocalDialog}
        onConfirm={handleRemoveLocalConfirm}
        onClose={() => setShowRemoveLocalDialog(false)}
        loading={removeLocalLoading}
        titleKey="remove_local_audio_title"
        subtitleKey="remove_local_audio_subtitle"
        confirmKey="remove_local_audio_confirm"
      />
    </View>
  );
});

export default Index;
