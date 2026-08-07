/*
 * @Author: hkc
 * @Date: 2026-01-23 14:35:56
 * @Description:
 * @LastEditTime: 2026-03-09 11:24:49
 * @LastEditors: hkc
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router, ScrollView, showToast, usePageEvent, View } from '@ray-js/ray';
import { Button, Dialog, DialogInstance } from '@ray-js/smart-ui';
import { useSetState } from 'ahooks';

import { TopBar } from '@/components';

import Strings from '@/i18n';
import { ApConnectState, CardTransferChannel, CardTransferStatus } from '@/types/card';
import { DeviceOfflineFileResult } from '@/api/ttt.interface';
import { tttLoadOfflineFile, tttSwitchModeLoadOfflineFile } from '@/api/ttt';
import { useSelector } from '@/redux';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';
import { isAnyAppRecordingTask } from '@/redux/modules/audioFileSlice';
import {
  OFFLINE_FILES_PROGRESS_EVENT,
  offlineFilesProgressEmitter,
} from '@/utils/offlineFilesProgressEmitter';
import CardTransferContext from './context';
import ErrorModal from './components/ErrorModal';
import ConnectWifiPopup from './components/ConnectWifiPopup';
import EstablishChannel from './components/EstablishChannel';
import Transferring from './components/Transferring';

import styles from './index.module.less';

const Index = () => {
  const { currentSyncCardDevInfo } = useSelector(state => state.fileSync);
  const { useWindowHeight, topBarHeight, safeBottomHeight } = useSelector(
    state => state.systemInfo
  );
  const [fileTransferInfo, setFileTransferInfo] =
    useState<DeviceOfflineFileResult>(currentSyncCardDevInfo);
  const [scrollHeight, setScrollHeight] = useState<number>(
    useWindowHeight - topBarHeight - safeBottomHeight
  );
  const [isDone, setIsDone] = useState<boolean>(false);
  const [showConnectWifiPopup, setShowConnectWifiPopup] = useState<boolean>(false);
  const [isEstablishing, setIsEstablishing] = useState<boolean>(false); // 是否正在建立快传通道
  const [errorCode, setErrorCode] = useState<number>(); // 错误码
  const [apConnectState, setApConnectState] = useState<number>(ApConnectState.Pending); // 热点连接状态
  const [channel, setChannel] = useState<CardTransferChannel>(CardTransferChannel.Ble);
  const [wentToWifiSettings, setWentToWifiSettings] = useState<boolean>(false); // 是否刚从 wifi 设置页返回
  const retryCountRef = useRef(0); // 重试次数
  const [errorModalConfig, setErrorModalConfig] = useSetState({
    show: false,
    errorCode: null,
    title: '',
    tip: '',
    showConnectBtn: false,
  }); // 是否展示错误弹窗
  const { task } = useSelector(state => state.audioFile);

  // 初始化建立连接页面状态，每次进入建立连接页面时调用
  const initEstablishState = () => {
    setIsEstablishing(true);
    setApConnectState(ApConnectState.Pending);
    setErrorCode(0);
  };

  useAppFloatCtrl(true);

  const handleOfflineFilesProgressEvent = useCallback((data: DeviceOfflineFileResult) => {
    const {
      status,
      errorCode,
      response: { apConnectState, channel },
    } = data;
    if (errorCode) {
      setErrorCode(errorCode);
    }
    // 传输结束展示完成按钮
    if (status === CardTransferStatus.Finished) {
      setIsDone(true);
    } else {
      setIsDone(false);
    }
    // 收到10094错误码，展示连接wifi弹窗，仅安卓会出现
    if (errorCode === 10094) {
      setShowConnectWifiPopup(true);
    }

    setChannel(channel);
    setApConnectState(apConnectState);
    setFileTransferInfo(data);
  }, []);

  // 原生监听已提升到 App 级，此处订阅 emitter，与首页共用同一路进度
  useEffect(() => {
    offlineFilesProgressEmitter.on(OFFLINE_FILES_PROGRESS_EVENT, handleOfflineFilesProgressEvent);
    return () => {
      offlineFilesProgressEmitter.off(
        OFFLINE_FILES_PROGRESS_EVENT,
        handleOfflineFilesProgressEvent
      );
    };
  }, [handleOfflineFilesProgressEvent]);

  // 从 wifi 设置页回显时，若刚去过 wifi 设置页则重新拉取离线文件，成功后清除标记
  usePageEvent('onShow', () => {
    if (!wentToWifiSettings || !currentSyncCardDevInfo?.deviceId) return;
    tttLoadOfflineFile({
      deviceId: currentSyncCardDevInfo.deviceId,
      sessionId: currentSyncCardDevInfo.sessionId ?? 0,
      channel: CardTransferChannel.Wifi,
    })
      .then(() => {
        setWentToWifiSettings(false);
      })
      .catch(() => {
        setWentToWifiSettings(false);
      });
  });

  useEffect(() => {
    if (isDone) {
      setScrollHeight(useWindowHeight - topBarHeight - safeBottomHeight - 52);
    }
  }, [useWindowHeight, topBarHeight, safeBottomHeight, isDone]);

  const backTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAnyAppRecordingTask(task)) return;

    showToast({
      icon: 'none',
      title: Strings.getLang('cardTransfer.recording_warn'),
    });
    backTimerRef.current = setTimeout(() => {
      router.back();
    }, 3000);
  }, [task?.state, task?.sourceTaskState, task?.businessType]);

  useEffect(() => {
    return () => {
      if (backTimerRef.current) clearTimeout(backTimerRef.current);
    };
  }, []);

  const handleBack = () => {
    // 如果正在建立传输通道，显示确认弹窗
    if (isEstablishing && !isDone) {
      DialogInstance.confirm({
        selector: '#back-confirm-dialog',
        title: Strings.getLang('cardTransfer.finish_establish_title'),
        message: Strings.getLang('cardTransfer.finish_establish_tip'),
        cancelButtonText: Strings.getLang('cardTransfer.continue_establish'),
        confirmButtonText: Strings.getLang('cardTransfer.finish_establish'),
      })
        .then(async () => {
          // 确认，切换到BLE传输
          try {
            setIsEstablishing(false);
            setChannel(CardTransferChannel.Ble);
            await tttSwitchModeLoadOfflineFile({
              channel: CardTransferChannel.Ble,
              deviceId: currentSyncCardDevInfo?.deviceId,
            });
          } catch (error) {
            console.error('切换传输模式失败:', error);
          }
        })
        .catch(() => {
          // 取消，关闭弹窗
        });
      return;
    }

    // 如果正在快传（Wifi），显示确认弹窗
    if (channel === CardTransferChannel.Wifi && !isDone) {
      DialogInstance.confirm({
        selector: '#back-confirm-dialog',
        title: Strings.getLang('cardTransfer.finish_wifi_title'),
        message: Strings.getLang('cardTransfer.finish_wifi_tip'),
        cancelButtonText: Strings.getLang('cardTransfer.continue_wifi'),
        confirmButtonText: Strings.getLang('cardTransfer.finish_wifi'),
      })
        .then(async () => {
          // 确认，切换到BLE传输
          try {
            await tttSwitchModeLoadOfflineFile({
              channel: CardTransferChannel.Ble,
              deviceId: currentSyncCardDevInfo?.deviceId,
            });
          } catch (error) {
            console.error('切换传输模式失败:', error);
          }
        })
        .catch(() => {
          // 取消，关闭弹窗
        });
      return;
    }

    // 其他情况直接返回
    router.back();
  };

  return (
    <CardTransferContext.Provider
      value={{
        showConnectWifiPopup,
        setShowConnectWifiPopup,
        isEstablishing,
        setIsEstablishing,
        retryCountRef,
        errorModalConfig,
        setErrorModalConfig,
        setErrorCode,
        channel,
        setChannel,
        initEstablishState,
      }}
    >
      <View className={styles.container}>
        <TopBar title={Strings.getLang('cardTransfer.title')} onBack={handleBack} />
        <ScrollView
          id="transfer-list-scroll"
          scrollY
          className={styles.scrollView}
          style={{ height: `${scrollHeight}px` }}
        >
          {isEstablishing ? (
            <EstablishChannel
              errorCode={errorCode}
              apConnectState={apConnectState}
              initEstablishState={initEstablishState}
            />
          ) : (
            <Transferring fileTransferInfo={fileTransferInfo} />
          )}
        </ScrollView>
        {isDone && !isEstablishing && (
          <Button
            customClass={styles.doneButton}
            customStyle={{ bottom: `${safeBottomHeight}px` }}
            onClick={() => {
              router.back();
            }}
          >
            {Strings.getLang('cardTransfer.done')}
          </Button>
        )}
      </View>
      <ConnectWifiPopup
        show={showConnectWifiPopup}
        onClose={() => setShowConnectWifiPopup(false)}
        onOpenWifiSettings={() => setWentToWifiSettings(true)}
      />
      <ErrorModal
        show={errorModalConfig.show}
        onClose={() =>
          setErrorModalConfig({
            show: false,
            errorCode: null,
            title: '',
            tip: '',
            showConnectBtn: false,
          })
        }
        title={errorModalConfig.title}
        tip={errorModalConfig.tip}
        showConnectBtn={errorModalConfig.showConnectBtn}
      />
      <Dialog id="back-confirm-dialog" />
    </CardTransferContext.Provider>
  );
};

export default Index;
