/*
 * @Author: hkc
 * @Date: 2026-01-23 18:44:15
 * @Description: 传输中页面
 * @LastEditTime: 2026-03-02 18:37:46
 * @LastEditors: hkc
 */
import React, { useEffect, useState, useMemo, useContext, useRef } from 'react';
import { View } from '@ray-js/ray';

import Strings from '@/i18n';
import { CardTransferStatus, CardTransferFileStatus, CardTransferChannel } from '@/types/card';
import { DeviceOfflineFileResult } from '@/api/ttt.interface';
import { useSelector } from '@/redux';
import { selectDpStateByDev } from '@/redux/modules/devsDpStateSlice';
import { leftearBatteryPercentageCode } from '@/config/dpCodes';
import isNumber from 'lodash/isNumber';
import Preview from './Preview';
import ListItem from './ListItem';
import CardStatusTipModal from '../CardStatusTipModal';
import CardTransferContext from '../../context';

import styles from './index.module.less';

/** 蓝牙传输速率阈值 KB/s */
const BLE_SPEED_THRESHOLD = 20;
/** WiFi 传输速率阈值 KB/s */
const WIFI_SPEED_THRESHOLD = 200;
/** 低速率检测间隔（毫秒） */
const LOW_SPEED_CHECK__MS = 3000;

// 文件传输状态： 传输中，全部传输成功，传输完成但是存在传输失败
export enum TransferStatus {
  Transferring = 0, // 传输中
  AllSuccess = 1, // 全部传输成功
  PartialFailed = 2, // 传输完成但是存在传输失败
}

interface IProps {
  fileTransferInfo: DeviceOfflineFileResult;
}
const Index: React.FC<IProps> = ({ fileTransferInfo }) => {
  const { setErrorModalConfig, retryCountRef, channel } = useContext(CardTransferContext);
  const { currentSyncCardDevInfo } = useSelector(state => state.fileSync);
  const { response, status, errorCode } = fileTransferInfo || {};

  // CardStatusTipModal 状态
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState<'battery' | 'signal'>();
  const lowSpeedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelWhenTimerSetRef = useRef<CardTransferChannel | null>(null);
  const modalShowRef = useRef(false);
  const modalTypeRef = useRef<'battery' | 'signal'>('battery');
  const manuallyClosedBatteryRef = useRef(false);
  const manuallyClosedSignalRef = useRef(false);
  modalShowRef.current = modalShow;
  modalTypeRef.current = modalType;

  const cardBattery = useSelector(
    selectDpStateByDev(
      currentSyncCardDevInfo?.deviceId ?? '',
      leftearBatteryPercentageCode as never
    )
  ) as number | undefined;

  const speedRef = useRef(0);
  speedRef.current = response?.speed ?? 0;
  const thresholdRef = useRef(0);
  thresholdRef.current =
    channel === CardTransferChannel.Ble ? BLE_SPEED_THRESHOLD : WIFI_SPEED_THRESHOLD;

  // 用派生状态（useMemo）直接在渲染期计算 transferStatus，而不是 useState + useEffect。
  // 原先的 setState 多了一次渲染跳变，源自原生事件/轮询链路的更新在本框架下可能不会及时
  // flush 到被 React.memo 包裹的 Preview，导致“状态值正确但上方 UI 不刷新”。
  // 改为派生后，只要 status/response 变化，transferStatus 在同一次渲染内即更新并传给 Preview。
  const transferStatus = useMemo<TransferStatus>(() => {
    if (!response) return TransferStatus.Transferring;
    const { files_successed, files_failed, total, files_transform } = response;
    // 如果传输完成，但是存在传输失败，则状态为传输完成但是存在传输失败
    if (status === CardTransferStatus.Finished && files_failed.length > 0) {
      return TransferStatus.PartialFailed;
    }
    if (
      status === CardTransferStatus.Finished &&
      files_successed.length + files_transform.length === total
    ) {
      return TransferStatus.AllSuccess;
    }
    return TransferStatus.Transferring;
  }, [status, response]);

  useEffect(() => {
    switch (errorCode) {
      case 10095:
        setErrorModalConfig({
          show: true,
          title: Strings.getLang('cardTransfer.connectInterrupted'),
          tip: Strings.getLang('cardTransfer.errorCode_10095'),
          showConnectBtn: true,
        });
        break;
      case 10096:
        setErrorModalConfig({
          show: true,
          title: Strings.getLang('cardTransfer.wifiInterrupted'),
          tip: Strings.getLang('cardTransfer.errorCode_10096'),
          showConnectBtn: true,
        });
        break;
      default:
        break;
    }
  }, [errorCode, setErrorModalConfig]);

  // 关闭 CardStatusTipModal（自动关闭，如电量/信号恢复）
  const closeStatusModal = () => {
    setModalShow(false);
  };

  // 手动关闭弹窗，关闭后本类型不再自动弹出
  const handleManualClose = () => {
    if (modalType === 'battery') {
      manuallyClosedBatteryRef.current = true;
    } else if (modalType === 'signal') {
      manuallyClosedSignalRef.current = true;
    }
    setModalShow(false);
  };

  // 显示 CardStatusTipModal（覆盖时直接更新 type，不先关闭，避免内容不更新）
  const showStatusModal = (type: 'battery' | 'signal') => {
    setModalType(type);
    setModalShow(true);
  };
  const showStatusModalRef = useRef(showStatusModal);
  showStatusModalRef.current = showStatusModal;

  // 电量 < 20 时显示 battery 弹窗；电量 >= 20 时自动关闭。后出现的可覆盖先出现的（仅更新 modalType），battery 不依赖 modalType 避免 signal 覆盖时触发本 effect 导致死循环
  useEffect(() => {
    if (status !== CardTransferStatus.Downloading || cardBattery === undefined) return;
    if (manuallyClosedBatteryRef.current) return;
    if (cardBattery < 20) {
      // 无弹窗时显示，或当前是 signal 时覆盖为 battery
      if (!modalShowRef.current) {
        showStatusModal('battery');
      } else {
        setModalType('battery');
      }
    } else if (modalShowRef.current && modalTypeRef.current === 'battery') {
      closeStatusModal();
    }
  }, [status, cardBattery]);

  // 传输速率连续 3 秒低于阈值时显示 signal 弹窗；速率恢复时立即关闭。后出现的可覆盖先出现的（仅更新 modalType），signal 不覆盖 battery 避免死循环（battery 优先级更高）
  useEffect(() => {
    const clearLowSpeedTimer = () => {
      if (lowSpeedTimerRef.current) {
        clearTimeout(lowSpeedTimerRef.current);
        lowSpeedTimerRef.current = null;
        channelWhenTimerSetRef.current = null;
      }
    };
    if (status !== CardTransferStatus.Downloading || !isNumber(response?.speed)) {
      clearLowSpeedTimer();
      return;
    }
    const speed = response?.speed;
    const threshold =
      channel === CardTransferChannel.Ble ? BLE_SPEED_THRESHOLD : WIFI_SPEED_THRESHOLD;
    if (speed < threshold) {
      if (lowSpeedTimerRef.current) return;
      channelWhenTimerSetRef.current = channel;
      lowSpeedTimerRef.current = setTimeout(() => {
        if (manuallyClosedSignalRef.current) return;
        // 手动关闭 或者 channel 变化时阈值改变，需清理定时器
        if (channelWhenTimerSetRef.current !== channel) {
          clearLowSpeedTimer();
          return;
        }
        if (speedRef.current < thresholdRef.current) {
          if (!modalShowRef.current) {
            showStatusModalRef.current('signal');
          } else {
            setModalType('signal');
          }
        }
      }, LOW_SPEED_CHECK__MS);
    } else {
      clearLowSpeedTimer();
      if (modalShowRef.current && modalTypeRef.current === 'signal') {
        closeStatusModal();
      }
    }
  }, [status, channel, response?.speed]);

  const transferData = useMemo(() => {
    const successCount = response?.files_successed?.length ?? 0;
    const total = response?.total ?? 0;
    const failedCount = response?.files_failed?.length ?? 0;

    return {
      successCount,
      failedCount,
      remainTime: response?.remainingDownloadTime,
      speed: response?.speed,
      total,
      size: response?.size ?? 0,
      downloadedFileProgress: response?.downloadedFileProgress ?? 0,
    };
  }, [response]);

  const fileListText = useMemo(() => {
    return `${Strings.getLang('cardTransfer.fileList')} ${transferData.size}/${transferData.total}`;
  }, [transferData.size, transferData.total]);

  const fileList = useMemo(() => {
    const { files_successed, files_failed, files_transform, files_waiting, curFile } =
      response || {};
    const currentFileId = curFile?.fileId;

    const listWithStatus = [
      // 等待中的文件，优先通过 curFile.fileId 匹配，否则第一个标记为下载中
      ...(files_waiting || []).map((file, index) => ({
        ...file,
        status:
          currentFileId === file.fileId || (index === 0 && !currentFileId)
            ? CardTransferFileStatus.Downloading
            : CardTransferFileStatus.Waiting,
      })),
      // 转换中的文件
      ...(files_transform || []).map(file => ({
        ...file,
        status: CardTransferFileStatus.Transforming,
      })),
      // 成功的文件
      ...(files_successed || []).map(file => ({
        ...file,
        status: CardTransferFileStatus.Success,
      })),
      // 失败的文件
      ...(files_failed || []).map(file => ({
        ...file,
        status: CardTransferFileStatus.Failed,
      })),
    ].sort((a, b) => (b.timeStamp ?? 0) - (a.timeStamp ?? 0));

    return listWithStatus;
  }, [response]);

  useEffect(() => {
    // 进入传输页面，重置重试次数
    retryCountRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      closeStatusModal();
    };
  }, []);

  return (
    <View className={styles.container}>
      <Preview
        transferStatus={transferStatus}
        successCount={transferData.successCount}
        failedCount={transferData.failedCount}
        remainTime={transferData.remainTime}
        speed={transferData.speed}
        progress={transferData.downloadedFileProgress}
      />
      <View className={styles.list}>
        <View>{fileListText}</View>
        <View className={styles.listScroll}>
          {fileList.map(file => (
            <ListItem key={file.fileId} {...file} />
          ))}
        </View>
      </View>
      <CardStatusTipModal show={modalShow} type={modalType} onClose={handleManualClose} />
    </View>
  );
};

export default React.memo(Index);
