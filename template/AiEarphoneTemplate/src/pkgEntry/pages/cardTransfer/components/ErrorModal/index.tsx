/*
 * @Author: hkc
 * @Date: 2026-01-26 15:04:24
 * @Description: 错误弹窗
 * @LastEditTime: 2026-01-30 19:35:30
 * @LastEditors: hkc
 */
import React, { useContext } from 'react';
import { Button, Dialog } from '@ray-js/smart-ui';
import { View, Image } from '@ray-js/ray';
import { useRequest } from 'ahooks';

import Res from '@/res';
import Strings from '@/i18n';
import { tttSwitchModeLoadOfflineFile } from '@/api/ttt';
import { CardTransferChannel } from '@/types/card';
import { useSelector } from '@/redux';
import CardTransferContext from '../../context';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
  title: string;
  tip: string;
  showConnectBtn: boolean;
}

const Index: React.FC<IProps> = ({ show, onClose, title, tip, showConnectBtn }) => {
  const { currentSyncCardDevInfo } = useSelector(state => state.fileSync);
  const { setIsEstablishing, setChannel, initEstablishState } = useContext(CardTransferContext);

  // 切换到AP/BLE模式传输
  const { runAsync: runSwitchMode, loading: switchLoading } = useRequest(
    tttSwitchModeLoadOfflineFile,
    {
      manual: true,
    }
  );

  // 重连
  const handleRetry = async () => {
    onClose();
    await runSwitchMode({
      channel: CardTransferChannel.Wifi,
      deviceId: currentSyncCardDevInfo?.deviceId,
    });
    initEstablishState();
  };

  // 返回蓝牙
  const handleBackBle = async () => {
    onClose();
    await runSwitchMode({
      channel: CardTransferChannel.Ble,
      deviceId: currentSyncCardDevInfo?.deviceId,
    });
    // 连接中断不会推事件，维护一个channel手动设置为ble
    setChannel(CardTransferChannel.Ble);
    setIsEstablishing(false);
  };

  return (
    <Dialog
      useSlot
      closeOnClickOverlay={false}
      show={show}
      onClose={onClose}
      customClass={styles.container}
      showConfirmButton={false}
    >
      <Image src={Res.cardTransferErrorIcon} className={styles.icon} />
      <View className={styles.title}>{title}</View>
      <View className={styles.tip}>{tip}</View>
      {showConnectBtn && (
        <Button loading={switchLoading} customClass={styles.retry} onClick={handleRetry}>
          {Strings.getLang('cardTransfer.reconnect')}
        </Button>
      )}
      <Button loading={switchLoading} customClass={styles.back} onClick={handleBackBle}>
        {Strings.getLang('cardTransfer.backBle')}
      </Button>
    </Dialog>
  );
};

export default React.memo(Index);
