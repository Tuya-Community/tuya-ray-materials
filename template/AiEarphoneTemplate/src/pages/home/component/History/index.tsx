import React, { useMemo, useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { View, Text } from '@ray-js/components';
import { usePageEvent, router, showToast } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import searchIcon from '@tuya-miniapp/icons/dist/svg/Search';
import { useRequest } from 'ahooks';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import {
  RecordStatus,
  isAnyAppRecordingTask,
  selectAudioFileByKey,
  updateRecordTransferResultList,
} from '@/redux/modules/audioFileSlice';
import { useDispatch } from 'react-redux';
import {
  tttLoadOfflineFile,
  getDeviceOfflineFileStatus,
  tttGetAudioImportStatus,
  tttCancelRetry,
  tttSyncNoteRecord,
} from '@/api/ttt';
import { CurrentSyncCardDevInfo, updateFileSync } from '@/redux/modules/fileSyncSlice';
import { selectDpStateByDev } from '@/redux/modules/devsDpStateSlice';
import { offlineRecordCode } from '@/config/dpCodes';
import Strings from '@/i18n';
import store, { useSelector } from '@/redux';
import { CUSTOM_APPS } from '@/constant';
import { CloudSyncStatus, DEVTYPES, FileImportStatus } from '@/constant/enums';
import { getDeviceList } from '@/redux/modules/deviceListSlice';
import { CardTransferStatus, CardTransferChannel } from '@/types/card';
import { getDomClientRect, getDomRectTop } from '@/utils/dom';
import { getShareImportErrorMsg } from '@/utils/file';
import CloudSyncCard from '@/components/CloudSyncCard';
import { selectAppInfo } from '@/redux/modules/appInfoSlice';
import { DeviceOfflineFileResult, FileImportStatusResult } from '@/api/ttt.interface';
import {
  OFFLINE_FILES_PROGRESS_EVENT,
  offlineFilesProgressEmitter,
} from '@/utils/offlineFilesProgressEmitter';
import FileRecycleList from '../FileRecycleList';
import AudioImportModal from '../AudioImportModal';
import Modes from '../Modes';
import CardSyncTip from '../CardSyncTip';

import styles from './index.module.less';

const CLOUD_SYNC_CARD_DEFAULT_HEIGHT = 72;
const FILE_RECYCLE_LIST_DEFAULT_HEADER_HEIGHT = 252;

const HistoryContent = () => {
  const { appId } = useSelector(selectAppInfo);
  const dispatch = useDispatch();
  const deviceList = useSelector(getDeviceList);
  const { useWindowHeight } = useSelector(selectSystemInfo);
  const [showCardSyncTip, setShowCardSyncTip] = useState(false);
  const [currentSyncCardDevInfo, setCurrentSyncCardDevInfo] = useState(
    {} as CurrentSyncCardDevInfo
  );

  const task = useSelector(selectAudioFileByKey('task'));
  const taskState = useSelector(selectAudioFileByKey('taskState'));
  const { cloudSyncStatus } = useSelector(state => state.uiState);
  const taskStateRef = useRef(taskState);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(useWindowHeight);
  const [cloudSyncCardHeight, setCloudSyncCardHeight] = useState(0); // 云同步卡片高度
  const [currentCloudCardHeight, setCurrentCloudCardHeight] = useState(0); // 云同步卡片实时高度
  const [isImporting, setIsImporting] = useState(false); // 是否正在导入音频
  const startTouchYRef = useRef(0);
  const isScrollTopRef = useRef(true);
  const isPageVisibleRef = useRef(true); // 页面是否在前台，onHide 时不再响应 onlineCardDevices 的副作用
  const prevTaskStateRef = useRef<RecordStatus | undefined>(undefined);
  const [importInfo, setImportInfo] = useState<FileImportStatusResult>(
    {} as FileImportStatusResult
  );
  const [isShowImportModal, setIsShowImportModal] = useState(false);
  const [shouldMountImportModal, setShouldMountImportModal] = useState(false);
  const [canRegisterImportEvent, setCanRegisterImportEvent] = useState(false);
  const TOUCH_ACTIVATION_THRESHOLD = 24; // px 内的轻微滑动忽略，降低误触

  useEffect(() => {
    taskStateRef.current = taskState;
  }, [taskState]);

  // 在线卡片设备
  const onlineCardDevices = useMemo(() => {
    return deviceList?.filter(item => item.customDevType === DEVTYPES.card && item.isOnline);
  }, [deviceList]);

  // 同步 Note 记录
  const { runAsync: runSyncNoteRecord, loading: syncNoteRecordLoading } = useRequest(
    tttSyncNoteRecord,
    {
      manual: true,
    }
  );

  // 获取头部高度
  const getHeaderHeight = async () => {
    setTimeout(async () => {
      const headerRect = await getDomClientRect('home-container-header');
      setHeaderHeight(headerRect?.height || 0);
    }, 300);
  };

  // 获取滚动高度
  const getScrollHeight = async () => {
    const containerRectTop = await getDomRectTop('home-container-scroll-view');
    setScrollHeight(useWindowHeight - containerRectTop);
  };

  useEffect(() => {
    ty.hideLoading(); // 初次进入先隐藏任何已有的loading
  }, []);

  // 获取云同步卡片高度
  const getCloudSyncCardHeight = async () => {
    const cloudSyncCardRect = await getDomClientRect('home-cloud-sync-card');
    const height = cloudSyncCardRect?.height || 0;
    setCloudSyncCardHeight(height);
  };

  // 云同步卡片状态变更时，获取卡片高度
  useEffect(() => {
    getCloudSyncCardHeight();
  }, [cloudSyncStatus]);

  // 列表滚动（useCallback 避免每次渲染创建新函数，减少子组件重渲染）
  const handleScroll = useCallback(event => {
    const { scrollTop } = event.detail;
    if (scrollTop <= 0) {
      isScrollTopRef.current = true;
    } else {
      isScrollTopRef.current = false;
    }
  }, []);

  // 屏幕触摸移动事件处理
  const handleTouchMove = event => {
    if (startTouchYRef.current <= 0) return;
    const currentTouchY = event.changedTouches[0]?.pageY;
    const offset = currentTouchY - startTouchYRef.current;
    // 死区过滤，降低灵敏度
    if (Math.abs(offset) < TOUCH_ACTIVATION_THRESHOLD) return;
    if (offset >= 0 && isScrollTopRef.current) {
      setCurrentCloudCardHeight(cloudSyncCardHeight || CLOUD_SYNC_CARD_DEFAULT_HEIGHT);
      startTouchYRef.current = 0;
      if (cloudSyncStatus.status !== CloudSyncStatus.Syncing && !syncNoteRecordLoading) {
        runSyncNoteRecord();
      }
    } else if (currentCloudCardHeight !== 0) {
      // 仅在确实需要收起时才更新，避免上滑过程中每帧重复 setState
      setCurrentCloudCardHeight(0);
    }
  };

  const isRecordingState = (s?: RecordStatus | null) =>
    s === RecordStatus.RECORDING || s === RecordStatus.PAUSE;

  const isAnyRecordingInProgress = () => {
    const currentTask = store.getState()?.audioFile?.task;
    return isRecordingState(taskStateRef.current) || isAnyAppRecordingTask(currentTask);
  };

  // 检查所有在线卡片设备的状态并处理同步逻辑
  const checkAndSyncCardDevices = async () => {
    // taskState 为 null 说明 getRecordTask 尚未完成，跳过等待就绪
    if (taskStateRef.current === null || isAnyRecordingInProgress()) {
      return;
    }

    // 获取所有在线的卡片设备
    if (!onlineCardDevices?.length) {
      setShowCardSyncTip(false);
      return;
    }

    // 直接从 store 读取最新 devsDpState，过滤正在离线录音的设备
    const currentState = store.getState();
    const devicesToCheck = onlineCardDevices.filter(
      dev => !selectDpStateByDev(dev.devId, offlineRecordCode as never)(currentState)
    );
    if (!devicesToCheck.length) {
      return;
    }

    try {
      // 调用所有在线卡片设备的 getDeviceOfflineFileStatus
      const statusResults = await Promise.all(
        devicesToCheck.map(dev =>
          getDeviceOfflineFileStatus(dev.devId, true)
            .then((res: any) => ({
              ...(typeof res === 'object' && res !== null ? res : {}),
              deviceId: dev.devId,
              name: dev.name,
            }))
            .catch(() => null)
        )
      );

      // 过滤掉失败的结果
      const validResults = statusResults.filter(item => item !== null);

      // 检查是否有 status === 1 (下载中) 的设备
      const downloadingDevice = validResults.find(
        item => item.status === CardTransferStatus.Downloading
      );

      if (downloadingDevice) {
        // 如果有下载中的设备，设置当前同步设备ID并显示提示
        setCurrentSyncCardDevInfo(downloadingDevice);
        dispatch(updateFileSync({ currentSyncCardDevInfo: downloadingDevice }));
        setShowCardSyncTip(true);
      } else {
        // 如果没有下载中的设备，找到第一个有 total 的设备
        const deviceWithFiles = validResults.find(item => item.response?.total > 0);

        if (deviceWithFiles) {
          // 调用 loadOfflineFile 前再次检查：异步过程中可能已重新开始录音
          if (taskStateRef.current === null || isAnyRecordingInProgress()) {
            return;
          }
          // 设置当前同步设备ID并显示提示
          setCurrentSyncCardDevInfo(deviceWithFiles);
          dispatch(updateFileSync({ currentSyncCardDevInfo: deviceWithFiles }));
          setShowCardSyncTip(true);

          // 调用 loadOfflineFile，channel 为 1 (ble)
          await tttLoadOfflineFile({
            deviceId: deviceWithFiles.deviceId,
            sessionId: deviceWithFiles.sessionId || 0,
            channel: CardTransferChannel.Ble,
          });
        } else {
          setShowCardSyncTip(false);
        }
      }
    } catch (error) {
      console.error('检查卡片设备状态失败:', error);
    }
  };

  // 录音结束时执行检查
  useEffect(() => {
    const wasRecording =
      prevTaskStateRef.current === RecordStatus.RECORDING ||
      prevTaskStateRef.current === RecordStatus.PAUSE;
    const isNowEnded =
      !task?.state || task.state === RecordStatus.FINISH || task.state === RecordStatus.UNKNOWN;

    if (wasRecording && isNowEnded && isPageVisibleRef.current) {
      checkAndSyncCardDevices();
    }
    prevTaskStateRef.current = task?.state;
  }, [task?.state]);

  useEffect(() => {
    if (!isPageVisibleRef.current || taskStateRef.current === null || isAnyRecordingInProgress())
      return;
    checkAndSyncCardDevices();
  }, [onlineCardDevices?.length]);

  useEffect(() => {
    if (isAnyAppRecordingTask(task)) {
      setShowCardSyncTip(false);
    }
  }, [task?.state, task?.sourceTaskState, task?.businessType]);

  // 处理文件导入状态事件
  const handleFileImportStatusEvent = useCallback(
    (res: FileImportStatusResult) => {
      if (res.status === FileImportStatus.Imported) {
        dispatch(updateRecordTransferResultList({ source: 'history_file_imported' }));
        if (!res?.failedFiles?.length) {
          setIsShowImportModal(false);
        }

        setTimeout(() => {
          setImportInfo(res);
        }, 300);
        return;
      }
      if (res.status === FileImportStatus.ShareImportFailed) {
        showToast({
          title: getShareImportErrorMsg(res.errorCode),
          icon: 'none',
        });
        return;
      }
      setImportInfo(res);
    },
    [dispatch]
  );

  // 用 ref 持有最新 check 函数，供稳定的 emitter 回调调用
  const checkAndSyncCardDevicesRef = useRef(checkAndSyncCardDevices);
  checkAndSyncCardDevicesRef.current = checkAndSyncCardDevices;

  // 处理文件上传进度（原生监听已提升到 App 级，此处只订阅 emitter）
  const handleOfflineFilesProgressEvent = useCallback((data: DeviceOfflineFileResult) => {
    // 首页不在前台时不处理，避免与传输页业务抢跑；原生监听本身保持不断
    if (!isPageVisibleRef.current) {
      return;
    }
    if (taskStateRef.current === null || isAnyRecordingInProgress()) {
      return;
    }
    // 如果有卡片上传完成，则需要 checkAndSyncCardDevices：还有未传完的继续传，否则关闭提示
    const { status } = data || {};
    if (status === CardTransferStatus.Finished) {
      checkAndSyncCardDevicesRef.current();
    }
  }, []);

  useEffect(() => {
    offlineFilesProgressEmitter.on(OFFLINE_FILES_PROGRESS_EVENT, handleOfflineFilesProgressEvent);
    return () => {
      offlineFilesProgressEmitter.off(
        OFFLINE_FILES_PROGRESS_EVENT,
        handleOfflineFilesProgressEvent
      );
    };
  }, [handleOfflineFilesProgressEvent]);

  // 获取文件导入状态
  const { run: getAudioImportStatus } = useRequest(tttGetAudioImportStatus, {
    manual: true,
    onSuccess: res => {
      setImportInfo(res);
      setCanRegisterImportEvent(true);
    },
    onError: () => {
      setCanRegisterImportEvent(true);
    },
  });

  // 取消重试
  const { run: handleCancelRetry } = useRequest(tttCancelRetry, {
    manual: true,
    onSuccess: () => {
      setIsShowImportModal(false);
    },
  });

  useEffect(() => {
    const importing = importInfo?.status === FileImportStatus.Importing;
    const needShow =
      importing ||
      (importInfo?.status === FileImportStatus.Imported && importInfo?.failedFiles?.length > 0);
    setIsImporting(importing);
    if (needShow) {
      setShouldMountImportModal(true);
      setIsShowImportModal(true);
      return;
    }
    if (importInfo?.status !== undefined && importInfo?.status !== null && !needShow) {
      setIsShowImportModal(false);
    }
  }, [importInfo?.status, importInfo?.failedFiles?.length]);

  useLayoutEffect(() => {
    setTimeout(() => {
      getHeaderHeight();
      getScrollHeight();
    }, 300);
  }, [showCardSyncTip]);

  useEffect(() => {
    getAudioImportStatus();
  }, []);

  useEffect(() => {
    if (!canRegisterImportEvent) return undefined;
    // @ts-ignore
    ty.wear?.onFileImportStatusEvent?.(handleFileImportStatusEvent);

    return () => {
      // @ts-ignore
      ty.wear?.offFileImportStatusEvent?.(handleFileImportStatusEvent);
    };
  }, [canRegisterImportEvent, handleFileImportStatusEvent]);

  // HistoryContent 在页面 onReady 后才挂载，会错过真正的首次 onShow。
  // 不能用 usePageReShow「跳过首次」：第一次收到的 onShow 往往是「从传输页返回」，
  // 若跳过则不会调用 getDeviceOfflineFileStatus。
  usePageEvent('onShow', () => {
    isPageVisibleRef.current = true;
    checkAndSyncCardDevicesRef.current();
  });

  usePageEvent('onHide', () => {
    isPageVisibleRef.current = false;
  });

  const renderExtraHeader = useCallback(
    () => (
      <>
        {!CUSTOM_APPS.includes(appId) && (
          <View
            style={{
              height: `${currentCloudCardHeight}px`,
            }}
            className={styles.cloudSyncCard}
          >
            <CloudSyncCard className={styles.cloudSyncInnerCard} />
          </View>
        )}
      </>
    ),
    [appId, currentCloudCardHeight]
  );

  const renderHeader = useCallback(
    () => (
      <View id="home-container-header">
        <Modes isImporting={isImporting} />
        <View className={styles.fileHeader}>
          <Text className={styles.title}>{Strings.getLang('allFiles')}</Text>
          <Icon
            name={searchIcon}
            size={22}
            color="var(--color-text-home)"
            onClick={() => {
              router.push('/search', { subpackage: 'pkgEntry' });
            }}
          />
        </View>
      </View>
    ),
    [isImporting]
  );

  const fileRecycleListHeaderHeight = useMemo(() => {
    // 使用 max 的是因为通过定时器获取的高度不稳定。
    return Math.max(FILE_RECYCLE_LIST_DEFAULT_HEADER_HEIGHT, headerHeight);
  }, [headerHeight]);

  return (
    <View className={styles.container}>
      <View
        id="home-container-scroll-view"
        className={styles.content}
        style={{
          height: `${scrollHeight}px`,
        }}
        onTouchStart={event => {
          if (!isScrollTopRef.current) return;
          startTouchYRef.current = event.changedTouches[0]?.pageY;
        }}
        onTouchMove={handleTouchMove}
      >
        <CardSyncTip
          show={showCardSyncTip && !isAnyAppRecordingTask(task)}
          deviceInfo={currentSyncCardDevInfo}
        />
        <FileRecycleList
          overScanCount={15}
          scrollThrottleTime={500}
          scrollHeight={scrollHeight}
          headerHeight={fileRecycleListHeaderHeight}
          onScroll={handleScroll}
          renderExtraHeader={renderExtraHeader}
          extraHeaderHeight={cloudSyncCardHeight}
          renderHeader={renderHeader}
        />
      </View>

      {/* 导入音频弹窗 */}
      {shouldMountImportModal && (
        <AudioImportModal
          show={isShowImportModal}
          importInfo={importInfo}
          onClose={() => setIsShowImportModal(false)}
          handleCancelRetry={handleCancelRetry}
        />
      )}
    </View>
  );
};

export default React.memo(HistoryContent);
