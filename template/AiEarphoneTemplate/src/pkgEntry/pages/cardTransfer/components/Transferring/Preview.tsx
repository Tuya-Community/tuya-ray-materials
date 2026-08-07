/*
 * @Author: hkc
 * @Date: 2026-01-23 21:01:36
 * @Description: 预览组件
 * @LastEditTime: 2026-02-10 16:57:21
 * @LastEditors: hkc
 */
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { View, Image } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';
import { useRequest } from 'ahooks';

// eslint-disable-next-line import/named
import { CanvasProgressBar, DotsLoader } from '@/components';
import { CardTransferChannel } from '@/types/card';
import { formatDurationToTime } from '@/utils/time';
import { tttLoadOfflineFile } from '@/api/ttt';
import { useSelector } from '@/redux';
import Strings from '@/i18n';
import Res from '@/res';
import CardTransferContext from '../../context';
import { TransferStatus } from '.';

import styles from './index.module.less';

interface IProps {
  transferStatus: TransferStatus;
  successCount: number;
  failedCount: number;
  remainTime: number;
  speed: number;
  progress: number;
}

const Preview: React.FC<IProps> = ({
  transferStatus = TransferStatus.Transferring,
  successCount = 0,
  failedCount = 0,
  remainTime = 0,
  speed = 0,
  progress = 0,
}) => {
  const { currentSyncCardDevInfo } = useSelector(state => state.fileSync);
  const { setIsEstablishing, channel } = useContext(CardTransferContext);

  // 异常情况下 remainTime 可能为负数，小于零时不更新，保留上次有效值
  const [displayRemainTime, setDisplayRemainTime] = useState(0);
  useEffect(() => {
    if (remainTime >= 0) {
      setDisplayRemainTime(remainTime);
    }
  }, [remainTime]);

  // AP/BLE模式传输
  const { run: runLoadOfflineFile, loading: switchLoading } = useRequest(tttLoadOfflineFile, {
    manual: true,
  });

  // 传输标题
  const transferTitle = useMemo(() => {
    if (
      transferStatus === TransferStatus.AllSuccess ||
      transferStatus === TransferStatus.PartialFailed
    ) {
      return Strings.getLang('cardTransfer.transferCompleted');
    }
    return channel === CardTransferChannel.Ble
      ? Strings.getLang('cardTransfer.bleTransferring')
      : Strings.getLang('cardTransfer.fastTransferring');
  }, [channel, transferStatus]);

  // 传输状态Icon
  const transferStatusIcon = useMemo(() => {
    switch (transferStatus) {
      case TransferStatus.AllSuccess:
        return <Image src={Res.cardTransferSuccessIcon} className={styles.icon} />;
      case TransferStatus.PartialFailed:
        return <Image src={Res.cardTransferFailedIcon} className={styles.icon} />;
      case TransferStatus.Transferring:
        return <DotsLoader />;
      default:
        return <DotsLoader />;
    }
  }, [transferStatus]);

  // 传输提示
  const transferTip = useMemo(() => {
    switch (transferStatus) {
      case TransferStatus.AllSuccess:
        return '';
      case TransferStatus.PartialFailed:
        return Strings.formatValue('cardTransfer.result_failed', successCount, failedCount);
      default:
        return Strings.getLang('cardTransfer.transferTip');
    }
  }, [transferStatus, successCount, failedCount]);

  // 剩余时间（使用 displayRemainTime，异常时保持上次有效值）
  const formattedRemainTime = useMemo(() => {
    const formattedTime = formatDurationToTime(displayRemainTime, 'seconds', true);
    return Strings.formatValue('cardTransfer.remain', formattedTime);
  }, [displayRemainTime]);

  return (
    <View className={styles.previewWrapper}>
      <View className={styles.preview}>
        <Image src={Res.cardPreviewImg} className={styles.cardImg} />
        <View className={styles.status}>{transferStatusIcon}</View>
        <Image src={Res.cardTransferPhoneImg} className={styles.phoneImg} />
      </View>
      <View className={styles.title}>{transferTitle}</View>
      {transferTip && <View className={styles.tip}>{transferTip}</View>}
      {transferStatus === TransferStatus.Transferring && (
        <View className={styles.progress}>
          <CanvasProgressBar percent={progress} />
          <View className={styles.info}>
            <View className={styles.left}>{`${formattedRemainTime} | ${speed.toFixed(
              2
            )}KB/s`}</View>
            {channel === CardTransferChannel.Ble && (
              <Button
                type="info"
                icon={Res.cardTransferFastIcon}
                customClass={styles.fastTransferBtn}
                loadingSize="14px"
                onClick={() => {
                  setIsEstablishing(true);
                  runLoadOfflineFile({
                    channel: CardTransferChannel.Wifi,
                    deviceId: currentSyncCardDevInfo?.deviceId,
                    sessionId: currentSyncCardDevInfo?.sessionId,
                  });
                }}
                disabled={switchLoading}
              >
                {Strings.getLang('cardTransfer.fastTransfer')}
              </Button>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(Preview);
