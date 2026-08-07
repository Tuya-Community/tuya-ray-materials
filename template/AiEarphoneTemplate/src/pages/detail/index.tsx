// ============ React & 框架依赖 ============
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from '@ray-js/components';
import {
  showModal,
  showToast,
  usePageEvent,
  hideMenuButton,
  getStorageSync,
  setStorageSync,
} from '@ray-js/ray';
import { Skeleton, Tab, Tabs } from '@ray-js/smart-ui';
import { useDispatch } from 'react-redux';
import { useRequest } from 'ahooks';

// ============ API ============
import { tttTransfer, tttUpdateFile } from '@/api/ttt';
import {
  atopSubmitFeedback,
  atopGetFeedbackTagList,
  atopGetFeedbackDetail,
  atopUpdateUserPreference,
  atopGetUserPreference,
  atopUpdateRecordRead,
} from '@/api/common';
import { FeedbackTagItem, FeedbackDetailItem, FeedbackType } from '@/api/interface';

// ============ 组件 ============
import AddToHomePopup from '@/components/AddToHomePopup';
import AiGeneratedDisclaimer from '@/components/AiGeneratedDisclaimer';
import BenefitRestrictedDialog from '@/components/BenefitRestrictedDialog';
import ThemedImage from '@/components/ThemedImage';
import Res from '@/res';

// ============ Hooks ============
import { useFirstTransformSuccessPopup } from '@/hooks';
import { useSwitchConfig } from '@/hooks/useSwitchConfig';

// ============ Redux ============
import { updateFileListItem } from '@/redux/modules/audioFileSlice';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { useSelector } from '@/redux';
import { updateUiState } from '@/redux/modules/uiStateSlice';
import { GenerateType, resetFileDetail, updateFileDetail } from '@/redux/modules/fileDetailSlice';
import { useEnsurePageReady } from '@/utils/pageReadyBus';
import { isAudioSourceType } from '@/utils/file';
import EventEmitter from '@/utils/emitter';
import {
  TransferStatus,
  SummaryStatus,
  SummaryImageStatus,
  TranslateStatus,
  SingleCloudSyncStatus,
  AudioSource,
} from '@/constant/enums';
import { checkBalance, updateVisitState } from '@/utils';
import { OfflineFileUploadStatus } from '@/types/file';
import Strings from '@/i18n';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';
import { shouldShowDurationWarning } from './util';
import { DetailTabType } from './constants';
import FileDetailContext from './context';
import {
  useAudioPlayer,
  useFileDetail,
  useFileUpload,
  usePartialUpdate,
  useSummaryResult,
  useTabManagement,
  useTransferResult,
} from './hooks';
import TranslateLangSelectPopup from './component/TranslateLangSelectPopup';
import CustomProgress from './component/CustomProgress';
import TranscriptContent from './component/TranscriptContent';
import SummaryContent from './component/SummaryContent';
import MindMapContent from './component/MindMapContent';
import CustomNavBar from './component/CustomNavBar';
import ChooseTransferTemplate from './component/ChooseTransferTemplate';
import FeedbackModal from './component/FeedbackModal';
import TranscribeOptimizePopup from './component/TranscribeOptimizePopup';

import styles from './index.module.less';

const TRANSCRIBE_OPTIMIZE_POPUP_KEY = 'transcribe_optimize_popup_seen';

// ============ 文件详情页的事件总线 ============
export const fileEmitter = new EventEmitter();

// ============ 导出类型 ============
export { DetailTabType };

// Tab类型到业务类型的映射
const TAB_TO_BIZ_TYPE_MAP: Record<DetailTabType, number> = {
  [DetailTabType.Transcribe]: 1, // 转写
  [DetailTabType.Summarize]: 2, // 总结
  [DetailTabType.MindMap]: 3, // 思维导图
};

// ============ 组件定义 ============
const Detail: FC<any> = props => {
  // -------- 路由参数 --------
  const { recordId = '', tab = '', from = '' } = props?.location?.query;
  // -------- Redux状态 --------
  const dispatch = useDispatch();
  const { selectTemplateShow, generateType, selectedTemplate } = useSelector(
    state => state.fileDetail
  );
  const { homeId } = useSelector(selectDevInfo);
  const { topBarHeight, language } = useSelector(selectSystemInfo);
  const switchConfig = useSelector(state => state.uiState.switchConfig);
  useSwitchConfig();

  // -------- 局部状态 --------
  // 各tab独立的骨架屏状态
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false); // 总结和思维导图tab共用的骨架屏状态

  // -------- 自定义Hooks - 核心业务逻辑 --------
  const {
    fileDetail,
    getFileDetail,
    refreshFileDetail,
    updateFileDetailLocal,
    fileDetailRef,
    handleBackToHome,
    markAsLeaving,
  } = useFileDetail(recordId, from);

  const {
    transferList,
    setTransferList,
    setTransferResultLoading,
    getTransferResult,
    originTransferListRef,
    originRecognizeListRef,
    generateTypeRef,
  } = useTransferResult(fileDetailRef, fileDetail, setTranscribeLoading);

  const {
    summaryData,
    outlineList,
    setOutlineList,
    setSummaryResultLoading,
    getSummaryResult,
    updateSummary,
    summaryImageUrl,
    setSummaryImageUrl,
  } = useSummaryResult(fileDetailRef, fileDetail, refreshFileDetail, setSummaryLoading);

  const audioPlayer = useAudioPlayer();

  const { activeTab, setActiveTab, tabList, setActiveTabByGenerateType } = useTabManagement(tab);
  const [isEditMode, setIsEditMode] = useState(false);
  const [transEditIndex, setTransEditIndex] = useState(-1);
  const [summaryLang, setSummaryLang] = useState<string>('');
  const [translateLang, setTranslateLang] = useState<string>();
  const [translatePopupShow, setTranslatePopupShow] = useState(false);
  const [audioDownloadStatus, setAudioDownloadStatus] = useState(SingleCloudSyncStatus.Default);
  const [scrollVisibleChapterTime, setScrollVisibleChapterTime] = useState<number | null>(null);
  const [enableSpeaker, setEnableSpeaker] = useState(false);

  // -------- 转写优化弹窗 --------
  const [showOptimizePopup, setShowOptimizePopup] = useState(false);
  const pendingTransferRef = useRef<(() => void) | null>(null);

  // -------- 反馈相关状态 --------
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  // 标记是否由"提交"触发的关闭，避免 onClose 里的接口被重复调用
  const feedbackJustSubmittedRef = useRef(false);
  // 防止时长告警弹窗在一次操作里被重复触发
  const durationWarningModalVisibleRef = useRef(false);
  const [feedbackTagListCache, setFeedbackTagListCache] = useState<{
    [key: number]: FeedbackTagItem[];
  }>({});
  const [feedbackDetailCache, setFeedbackDetailCache] = useState<{
    [key: number]: FeedbackDetailItem | null;
  }>({});

  const navRef = useRef(null);

  // -------- 文件上传进度管理 --------
  const { progress, uploadStatus } = useFileUpload(
    fileDetailRef,
    updateFileDetailLocal,
    fileDetail?.offlineUploadProgress,
    fileDetail?.offlineUploadStatus
  );

  // -------- 延迟隐藏进度条 --------
  const [shouldShowProgress, setShouldShowProgress] = useState(false);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useAppFloatCtrl(true);

  useEffect(() => {
    const isUploading =
      uploadStatus === OfflineFileUploadStatus.Waiting ||
      uploadStatus === OfflineFileUploadStatus.Uploading;

    if (isUploading) {
      // 显示进度条
      setShouldShowProgress(true);
      // 清除可能存在的隐藏定时器
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    } else if (shouldShowProgress) {
      // 延迟隐藏进度条，确保canvas有足够时间绘制
      progressTimerRef.current = setTimeout(() => {
        // 使用函数式更新，避免依赖 shouldShowProgress
        setShouldShowProgress(false);
        progressTimerRef.current = null;
      }, 300);
    }

    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
        progressTimerRef.current = null; // 清理时也要置为 null
      }
    };
  }, [uploadStatus, shouldShowProgress]);

  // -------- 部分更新事件监听 --------
  usePartialUpdate({
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
  });

  // -------- 计算属性 --------
  const isTransfered = useMemo(() => {
    return transferList.length > 0;
  }, [transferList.length]);

  const firstTransformSuccessPopup = useFirstTransformSuccessPopup(isTransfered);

  // -------- 初始化逻辑 --------
  useEffect(() => {
    // 隐藏菜单按钮
    hideMenuButton();
  }, []);

  useEffect(() => {
    // 获取文件详情
    if (!recordId) return;
    // 首次请求详情前，所有tab都显示骨架屏
    setTranscribeLoading(true);
    setSummaryLoading(true);

    getFileDetail({
      recordId,
      amplitudeMaxCount: 100,
    }).then(async res => {
      // 增加已生成未读状态
      if (res?.visit === 0 || res?.visit === 2) {
        const visit = updateVisitState(res?.visit);
        // 更新文件信息，调用atop/ttt接口更新
        try {
          // 上报云端已读状态（fire-and-forget：失败不阻塞 UI，不回滚本地状态）
          atopUpdateRecordRead({ recordId, visit });
          await tttUpdateFile({
            visit,
            recordTransferId: res?.recordTransferId,
          });
          // 立即更新列表页本地状态，确保返回列表红点消失（不要依赖异步局部刷新事件）
          if (res?.recordTransferId !== undefined) {
            dispatch(
              updateFileListItem({
                key: 'recordTransferId',
                value: res.recordTransferId,
                patch: { visit },
              })
            );
          }
          // 更新 ref，保持数据一致性
          if (fileDetailRef.current) {
            fileDetailRef.current.visit = visit;
          }
        } catch (error) {
          console.error('updateFileInfo error', error);
        }
      }

      // 总结语言优先级：目标语言 > 用户上次使用 > 源语言 > 自动检测（空）
      const lastSummaryLang = (getStorageSync({ key: 'lastSummaryLang' }) as string) || '';
      const defaultSummaryLang =
        res?.targetLanguage || lastSummaryLang || res?.originalLanguage || '';
      if (defaultSummaryLang) {
        setSummaryLang(defaultSummaryLang);
      }

      // 更新音频下载状态
      if (res?.cloudSyncStatus === SingleCloudSyncStatus.Downloading) {
        setAudioDownloadStatus(res?.cloudSyncStatus);
      }

      // 根据转写和总结状态，决定各tab的骨架屏显示逻辑
      const transferSuccess = res?.transfer === TransferStatus.Success;
      const summarySuccess = res?.summary === SummaryStatus.Success;

      // 转写tab的骨架屏逻辑：只有在转写成功时等待转写接口返回，其他状态立即取消
      if (transferSuccess) {
        // 转写成功：等待转写接口返回后取消转写tab的骨架屏
        getTransferResult().finally(() => {
          setTranscribeLoading(false);
        });
      } else {
        // 其他状态（转写中、转写失败、转写未开始等）：立即取消转写tab的骨架屏
        setTranscribeLoading(false);
      }

      // 总结tab和思维导图tab的骨架屏逻辑：只有在总结成功时等待总结接口返回，其他状态立即取消
      if (summarySuccess) {
        // 总结成功：等待总结接口返回后取消总结和思维导图tab的骨架屏
        getSummaryResult().finally(() => {
          setSummaryLoading(false);
        });
      } else {
        // 其他状态（总结未成功、总结失败等）：立即取消总结和思维导图tab的骨架屏
        setSummaryLoading(false);
      }
    });
  }, [recordId]);

  // -------- 翻译语言变化时触发转写 --------
  useEffect(() => {
    if (translateLang) {
      setActiveTabByGenerateType(GenerateType.Translate);
      runTransferOrSummary();
    }
  }, [translateLang]);

  // -------- 页面生命周期 --------
  usePageEvent('onUnload', () => {
    ty.hideLoading();
    dispatch(resetFileDetail());
    dispatch(updateUiState({ tempMarkdownText: '' }));

    // 主动停止音频播放，释放原生资源
    if (audioPlayer.audioContext) {
      audioPlayer.audioContext.stop?.({});
    }

    // 清空大数据 ref，加速 GC
    fileDetailRef.current = null;
    originTransferListRef.current = [];
    originRecognizeListRef.current = null;

    // 清除 fileEmitter 所有残留监听，防止闭包泄漏
    fileEmitter.removeAll();
  });

  useEnsurePageReady('/detail');

  // -------- 业务逻辑方法 --------

  /**
   * 开始转写或者总结
   */
  const fetchTransferOrSummary = async () => {
    !ty.wear?.onRecordTransferFileUploadEvent && ty.showLoading({ title: '' });

    // 记录生成类型, 用于局部刷新时是否获取详情
    generateTypeRef.current = generateType;

    // 提前变更状态（每个分支只调用一次 updateFileDetailLocal，避免 ahooks mutate 竞态覆盖）
    if (generateType === GenerateType.Transcribe) {
      setOutlineList([]);
      setTranslateLang('');
      setTransferResultLoading(true);
      setSummaryResultLoading(true);
      setSummaryImageUrl('');
      updateFileDetailLocal(prev =>
        prev ? { ...prev, summaryImageStatus: SummaryImageStatus.Initial } : prev
      );
    }
    if (generateType === GenerateType.Summarize) {
      setSummaryImageUrl('');
      updateFileDetailLocal(prev =>
        prev
          ? {
              ...prev,
              summary: SummaryStatus.Process,
              summaryImageStatus: SummaryImageStatus.Initial,
            }
          : prev
      );
      setSummaryResultLoading(true);
    }
    if (generateType === GenerateType.Translate) {
      updateFileDetailLocal(prev =>
        prev ? { ...prev, translateState: TranslateStatus.Process } : prev
      );
      setTransferResultLoading(true);
    }

    let taskType = generateType;
    if (fileDetail?.transfer === 0) {
      taskType = 0;
    }

    const params: any = {
      recordTransferId: fileDetail?.recordTransferId,
      template: selectedTemplate === 'auto' ? '' : selectedTemplate,
      language: fileDetail?.originalLanguage || language,
      summaryLang,
      taskType,
      enableSpeaker,
    };

    if (taskType === GenerateType.Translate) {
      params.transLang = translateLang;
    }

    return tttTransfer(params);
  };

  const { runAsync: runTransferOrSummary } = useRequest(fetchTransferOrSummary, {
    manual: true,
    onSuccess: () => {
      refreshFileDetail();
    },
    onError: () => {
      setTransferResultLoading(false);
      setSummaryResultLoading(false);
      if (generateTypeRef.current === GenerateType.Translate) {
        updateFileDetailLocal(prev =>
          prev ? { ...prev, translateState: TranslateStatus.Fail } : prev
        );
      }
    },
    onFinally: () => {
      // dispatch(updateRecordTransferResultList());
      !ty.wear?.onRecordTransferFileUploadEvent && ty.hideLoading();
    },
  });

  /**
   * 触发转写或总结处理
   */
  const handleTriggerTransferOrSummaryProcess = async () => {
    setActiveTabByGenerateType(generateType);
    try {
      await runTransferOrSummary();
    } catch {
      // keep prior behavior: swallow errors after failed generate
    }
  };

  /**
   * 确认转写模板
   */
  const handleConfirmTemplate = async () => {
    const isImport =
      isAudioSourceType(fileDetail?.source, 'import') ||
      fileDetail?.source === AudioSource.mergeImport;
    const isTransferImport = generateType === GenerateType.Transcribe && isImport;
    const balance = (await checkBalance(homeId, fileDetail.deviceId, isTransferImport)) || 0;
    if (balance !== 1) return;
    dispatch(
      updateFileDetail({
        selectTemplateShow: false,
      })
    );
    navRef.current?.closeMorePopup();

    // 检查是否需要显示时长警告，提取为内部函数供优化弹窗回调复用
    const doContinueTransfer = () => {
      const { duration } = fileDetailRef.current || {};
      if (shouldShowDurationWarning(duration)) {
        if (durationWarningModalVisibleRef.current) {
          return;
        }
        durationWarningModalVisibleRef.current = true;
        showModal({
          title: Strings.getLang('transfer_start_recordTime_warn_title'),
          content: Strings.getLang('transfer_start_recordTime_warn_tip'),
          showCancel: true,
          cancelText: Strings.getLang('cancel'),
          cancelColor: 'var(--color-gray-66666)',
          confirmText: Strings.getLang('confirm'),
          confirmColor: 'var(--color-primary)',
          success: async ({ confirm }) => {
            durationWarningModalVisibleRef.current = false;
            try {
              if (confirm) {
                handleTriggerTransferOrSummaryProcess();
              }
            } catch {
              // ignore transfer trigger failure
            }
          },
          fail: () => {
            durationWarningModalVisibleRef.current = false;
          },
        });
      } else {
        handleTriggerTransferOrSummaryProcess();
      }
    };

    // 首次转写时弹出转写优化提示（仅在转写优化开关开启时执行）
    if (generateType === GenerateType.Transcribe && switchConfig?.transcribeOptimizeEnabled) {
      try {
        const stored: any = getStorageSync({ key: TRANSCRIBE_OPTIMIZE_POPUP_KEY });
        const hasSeen = stored === 'true' || stored?.data === 'true';
        if (!hasSeen) {
          const preference = await atopGetUserPreference();
          if (preference?.transcribeOptimizeEnabled) {
            // 已开启优化，标记已见，直接走流程
            setStorageSync({ key: TRANSCRIBE_OPTIMIZE_POPUP_KEY, data: 'true' });
          } else {
            pendingTransferRef.current = doContinueTransfer;
            setShowOptimizePopup(true);
            return;
          }
        }
      } catch {
        // storage 或接口失败则正常走流程
      }
    }

    doContinueTransfer();
  };

  const handleOptimizeEnable = async () => {
    setStorageSync({ key: TRANSCRIBE_OPTIMIZE_POPUP_KEY, data: 'true' });
    setShowOptimizePopup(false);
    try {
      await atopUpdateUserPreference(JSON.stringify({ transcribeOptimizeEnabled: true }));
    } catch {
      // ignore
    }
    pendingTransferRef.current?.();
    pendingTransferRef.current = null;
  };

  const handleOptimizeSkip = () => {
    setStorageSync({ key: TRANSCRIBE_OPTIMIZE_POPUP_KEY, data: 'true' });
    setShowOptimizePopup(false);
    pendingTransferRef.current?.();
    pendingTransferRef.current = null;
  };

  // -------- 反馈业务逻辑 --------

  // 初始化时获取三个 tab 的反馈标签列表（只调用一次）
  useEffect(() => {
    const fetchFeedbackTags = async () => {
      try {
        const tagResult = await atopGetFeedbackTagList({ bizTypes: '1,2,3' });
        const tagCache: { [key: number]: FeedbackTagItem[] } = {};
        tagResult.forEach(item => {
          tagCache[item.bizType] = item.tags || [];
        });
        setFeedbackTagListCache(tagCache);
      } catch (error) {
        console.error('Failed to fetch feedback tags:', error);
        setFeedbackTagListCache({});
      }
    };
    fetchFeedbackTags();
  }, []);

  // 获取反馈详情（依赖 fileDetail?.recordId）
  useEffect(() => {
    if (!fileDetail?.recordId) return;
    const fetchFeedbackDetail = async () => {
      try {
        const detailResult = await atopGetFeedbackDetail({
          recordId: fileDetail.recordId,
          bizTypes: '1,2,3',
        });
        const detailCache: { [key: number]: FeedbackDetailItem | null } = {};
        detailResult.forEach(item => {
          detailCache[item.bizType] = item;
        });
        setFeedbackDetailCache(detailCache);
      } catch (error) {
        console.error('Failed to fetch feedback detail:', error);
        setFeedbackDetailCache({});
      }
    };
    fetchFeedbackDetail();
  }, [fileDetail?.recordId]);

  // 获取当前 tab 的 bizType
  const currentBizType = useMemo(() => {
    if (!activeTab) return null;
    return TAB_TO_BIZ_TYPE_MAP[activeTab] || null;
  }, [activeTab]);

  // 获取当前 tab 的反馈详情
  const currentFeedbackDetail = useMemo(() => {
    if (!currentBizType) return null;
    return feedbackDetailCache[currentBizType] || null;
  }, [currentBizType, feedbackDetailCache]);

  // 刷新反馈详情
  const refreshFeedbackDetail = async () => {
    if (!fileDetail?.recordId) return;
    try {
      const detailResult = await atopGetFeedbackDetail({
        recordId: fileDetail.recordId,
        bizTypes: '1,2,3',
      });
      const detailCache: { [key: number]: FeedbackDetailItem | null } = {};
      detailResult.forEach(item => {
        detailCache[item.bizType] = item;
      });
      setFeedbackDetailCache(detailCache);
    } catch (error) {
      console.error('Failed to refresh feedback detail:', error);
    }
  };

  // 重新转写完成后，刷新反馈详情
  const prevTransferStatusRef = useRef<TransferStatus | null>(null);
  useEffect(() => {
    const prevStatus = prevTransferStatusRef.current;
    prevTransferStatusRef.current = fileDetail?.transfer;
    if (prevStatus === TransferStatus.Process && fileDetail?.transfer === TransferStatus.Success) {
      refreshFeedbackDetail();
    }
  }, [fileDetail?.transfer]);

  // 处理反馈提交
  const handleFeedbackSubmit = useCallback(
    async (feedbackType: FeedbackType, data?: { tag?: string; content?: string }) => {
      if (!fileDetail?.recordId || !currentBizType) return;
      try {
        await atopSubmitFeedback({
          recordId: fileDetail.recordId,
          bizType: currentBizType,
          feedbackType,
          tagIds: data?.tag,
          remark: data?.content || undefined,
        });
        await refreshFeedbackDetail();
        showToast({ title: Strings.getLang('feedback_thanks'), icon: 'success' });
      } catch (error) {
        console.error('Submit feedback error:', error);
        showToast({ title: Strings.getLang('feedback_submit_fail'), icon: 'error' });
      }
    },
    [fileDetail?.recordId, currentBizType]
  );

  // 处理点赞
  const handleLike = useCallback(() => {
    if (currentFeedbackDetail?.feedbackType === 2) {
      handleFeedbackSubmit(4); // 取消点赞
    } else {
      handleFeedbackSubmit(2); // 点赞
    }
  }, [currentFeedbackDetail, handleFeedbackSubmit]);

  // 处理点踩
  const handleDislike = useCallback(() => {
    if (currentFeedbackDetail?.feedbackType === 1) {
      handleFeedbackSubmit(3); // 取消点踩
    } else {
      setShowFeedbackModal(true); // 弹窗反馈
    }
  }, [currentFeedbackDetail, handleFeedbackSubmit]);

  // 根据反馈状态判断图标显示
  const feedbackIconState = useMemo(() => {
    const feedbackType = currentFeedbackDetail?.feedbackType;
    if (feedbackType === 1) {
      return {
        likeIcon: Res.likeImg,
        likeIconName: 'likeImg',
        dislikeIcon: Res.dislikeActiveImg,
        dislikeIconName: 'dislikeActiveImg',
      };
    }
    if (feedbackType === 2) {
      return {
        likeIcon: Res.likeActiveImg,
        likeIconName: 'likeActiveImg',
        dislikeIcon: Res.dislikeImg,
        dislikeIconName: 'dislikeImg',
      };
    }
    return {
      likeIcon: Res.likeImg,
      likeIconName: 'likeImg',
      dislikeIcon: Res.dislikeImg,
      dislikeIconName: 'dislikeImg',
    };
  }, [currentFeedbackDetail]);

  // 是否显示反馈底部栏
  const shouldShowFeedbackBar = useMemo(() => {
    if (!activeTab) return false;
    if (activeTab === DetailTabType.Transcribe) {
      return fileDetail?.transfer === TransferStatus.Success && transferList.length > 0;
    }
    if (activeTab === DetailTabType.Summarize || activeTab === DetailTabType.MindMap) {
      return fileDetail?.summary === SummaryStatus.Success && summaryData?.length > 0;
    }
    return false;
  }, [activeTab, fileDetail?.transfer, fileDetail?.summary, transferList.length, summaryData]);

  // -------- 渲染逻辑 --------

  // 反馈栏公共内容（分割线 + 两个按钮），通过 wrapperClass 控制定位方式
  const renderFeedbackBar = useCallback(
    (wrapperClass: string) => (
      <View className={wrapperClass}>
        <View
          className={`${styles.feedbackBarDivider} ${
            activeTab === DetailTabType.Summarize ? styles.feedbackBarDividerInline : ''
          }`}
        />
        <AiGeneratedDisclaimer className={styles.feedbackAiDisclaimer} />
        <View className={styles.feedbackBarButtons}>
          <View className={styles.feedbackBtn} onClick={handleLike}>
            <ThemedImage
              imageName={feedbackIconState.likeIconName}
              src={feedbackIconState.likeIcon}
              className={styles.feedbackBtnIcon}
            />
            <Text className={styles.feedbackBtnText}>{Strings.getLang('feedback_like')}</Text>
          </View>
          <View className={styles.feedbackBtn} onClick={handleDislike}>
            <ThemedImage
              imageName={feedbackIconState.dislikeIconName}
              src={feedbackIconState.dislikeIcon}
              className={styles.feedbackBtnIcon}
            />
            <Text className={styles.feedbackBtnText}>{Strings.getLang('feedback_dislike')}</Text>
          </View>
        </View>
      </View>
    ),
    [feedbackIconState, handleLike, handleDislike]
  );

  // 内联反馈栏（转写/总结tab，跟随内容滚动到底部才可见）
  const feedbackBarContent = useMemo(() => {
    if (!shouldShowFeedbackBar || activeTab === DetailTabType.MindMap) return null;
    return renderFeedbackBar(styles.feedbackBarInline);
  }, [shouldShowFeedbackBar, activeTab, renderFeedbackBar]);

  // 处理标签变更：同时同步详情态与首页/搜索列表的 store，避免返回首页看到旧标签
  const handleFileTagsChange = useCallback(
    (next: string[]) => {
      updateFileDetailLocal(prev => (prev ? { ...prev, tags: next } : prev));
      if (recordId) {
        dispatch(updateFileListItem({ value: recordId, patch: { tags: next } }));
      }
    },
    [updateFileDetailLocal, dispatch, recordId]
  );

  /**
   * 根据当前激活的Tab渲染对应内容
   */
  const renderContent = useMemo(() => {
    switch (activeTab) {
      case DetailTabType.Transcribe:
        return (
          <TranscriptContent
            updateSummary={updateSummary}
            outlineList={outlineList}
            footer={feedbackBarContent}
            onFileTagsChange={handleFileTagsChange}
          />
        );
      case DetailTabType.Summarize:
        return (
          <SummaryContent
            summary={summaryData}
            updateSummary={updateSummary}
            footer={feedbackBarContent}
            summaryImageUrl={summaryImageUrl}
          />
        );
      case DetailTabType.MindMap:
        return <MindMapContent summary={summaryData} />;
      default:
        return null;
    }
  }, [
    activeTab,
    summaryData,
    updateSummary,
    outlineList,
    feedbackBarContent,
    handleFileTagsChange,
  ]);

  /**
   * 根据当前激活的tab决定是否显示骨架屏
   */
  const shouldShowSkeleton = useMemo(() => {
    if (activeTab === DetailTabType.Transcribe) {
      return transcribeLoading;
    }
    if (activeTab === DetailTabType.Summarize || activeTab === DetailTabType.MindMap) {
      return summaryLoading;
    }
    return false;
  }, [activeTab, transcribeLoading, summaryLoading]);

  /**
   * 渲染内容区域（骨架屏、进度条或实际内容）
   */
  const renderContentArea = useMemo(() => {
    if (shouldShowSkeleton) {
      return (
        <View className={styles.skeleton}>
          <Skeleton title row={3} rowWidth={['100%', '100%', '80%']} />
        </View>
      );
    }

    if (shouldShowProgress) {
      return (
        <CustomProgress
          progress={progress}
          uploadStatus={uploadStatus}
          updateSummary={updateSummary}
        />
      );
    }

    return renderContent;
  }, [
    shouldShowSkeleton,
    shouldShowProgress,
    progress,
    uploadStatus,
    updateSummary,
    renderContent,
  ]);

  // -------- JSX渲染 --------
  return (
    <FileDetailContext.Provider
      value={{
        playerShow: audioPlayer.playerShow,
        setPlayerShow: audioPlayer.setPlayerShow,
        playStatus: audioPlayer.playStatus,
        setPlayStatus: audioPlayer.setPlayStatus,
        currentPlaySecond: audioPlayer.currentPlaySecond,
        setCurrentPlaySecond: audioPlayer.setCurrentPlaySecond,
        audioContext: audioPlayer.audioContext,
        translateLang,
        setTranslateLang,
        summaryLang,
        setSummaryLang,
        translatePopupShow,
        setTranslatePopupShow,
        fileDetail,
        transferList,
        originTransferListRef,
        originRecognizeListRef,
        setTransferList,
        isEditMode,
        setIsEditMode,
        transEditIndex,
        setTransEditIndex,
        audioDownloadStatus,
        setAudioDownloadStatus,
        updateFileDetailLocal,
        scrollVisibleChapterTime,
        setScrollVisibleChapterTime,
        refreshFileDetail,
        markAsLeaving,
      }}
    >
      {/* tab是思维导图，且总结有内容时才设置透明 */}
      <View
        className={styles.main}
        style={{
          backgroundColor:
            activeTab === DetailTabType.MindMap && summaryData?.length
              ? 'transparent'
              : 'var(--color-bg-page)',
        }}
      >
        <CustomNavBar
          summary={summaryData}
          updateSummary={updateSummary}
          activeTab={activeTab}
          ref={navRef}
        />

        {/* Tab页签 */}
        <Tabs
          active={activeTab}
          onChange={e => {
            setActiveTab(e?.detail?.name as DetailTabType);
          }}
          customClass={styles.tabs}
          sticky
          offsetTop={topBarHeight}
        >
          {tabList.map(item => (
            <Tab key={item.key} title={item.title} name={item.key} />
          ))}
        </Tabs>

        {/* 内容区域 */}
        <View
          onTouchMove={() => {
            audioPlayer.setPlayerShow(false);
          }}
        >
          {renderContentArea}
        </View>

        {/* 选择转录模版弹窗 */}
        {selectTemplateShow && (
          <ChooseTransferTemplate
            enableSpeaker={enableSpeaker}
            show={selectTemplateShow}
            onBottomBtnClick={handleConfirmTemplate}
            onClose={() => {
              dispatch(
                updateFileDetail({
                  selectTemplateShow: false,
                })
              );
            }}
            onSpeakerChange={value => {
              setEnableSpeaker(value);
            }}
          />
        )}

        {/* 翻译弹窗 */}
        {translatePopupShow && <TranslateLangSelectPopup />}

        {/* 首次总结成功弹窗 */}
        {firstTransformSuccessPopup.show && (
          <AddToHomePopup
            show={firstTransformSuccessPopup.show}
            onClose={firstTransformSuccessPopup.onClose}
            onAdd={firstTransformSuccessPopup.onAdd}
            onLater={firstTransformSuccessPopup.onLater}
          />
        )}

        {/* 反馈底部栏 - 思维导图tab固定在页面底部 */}
        {shouldShowFeedbackBar &&
          activeTab === DetailTabType.MindMap &&
          renderFeedbackBar(styles.feedbackBar)}

        {/* 反馈弹窗 */}
        {showFeedbackModal && (
          <FeedbackModal
            show={showFeedbackModal}
            onClose={() => {
              setShowFeedbackModal(false);
              // 只有非提交触发的关闭（点X/遮罩）才调接口
              if (!feedbackJustSubmittedRef.current) {
                handleFeedbackSubmit(1);
              }
              feedbackJustSubmittedRef.current = false;
            }}
            onSubmit={(...args) => {
              // 标记是提交触发的关闭，防止 onClose 里再次调用接口
              feedbackJustSubmittedRef.current = true;
              handleFeedbackSubmit(...args);
            }}
            feedbackTagList={currentBizType ? feedbackTagListCache[currentBizType] : undefined}
          />
        )}

        {/* 转写优化首次提示弹窗 */}
        <TranscribeOptimizePopup
          show={showOptimizePopup}
          onEnable={handleOptimizeEnable}
          onSkip={handleOptimizeSkip}
        />

        <BenefitRestrictedDialog />
      </View>
    </FileDetailContext.Provider>
  );
};

export default React.memo(Detail);
