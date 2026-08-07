/*
 * @Author: hkc
 * @Date: 2026-01-25 21:39:33
 * @Description:
 * @LastEditTime: 2026-01-30 19:38:57
 * @LastEditors: hkc
 */
import React from 'react';
import { CardTransferChannel } from '@/types/card';

interface CardTransferContextProps {
  showConnectWifiPopup: boolean;
  setShowConnectWifiPopup: (showConnectWifiPopup: boolean) => void;
  isEstablishing: boolean;
  setIsEstablishing: (isEstablishing: boolean) => void;
  retryCountRef: React.MutableRefObject<number>;
  errorModalConfig: {
    show: boolean;
    title: string;
    tip: string;
    showConnectBtn: boolean;
  };
  setErrorModalConfig: (errorModalConfig: {
    show: boolean;
    title: string;
    tip: string;
    showConnectBtn: boolean;
  }) => void;
  setErrorCode: (errorCode: number) => void;
  channel: CardTransferChannel;
  setChannel: (channel: CardTransferChannel) => void;
  initEstablishState: () => void;
}

const CardTransferContext = React.createContext<CardTransferContextProps>({
  showConnectWifiPopup: false,
  setShowConnectWifiPopup: () => {},
  isEstablishing: false,
  setIsEstablishing: () => {},
  retryCountRef: { current: 0 },
  errorModalConfig: {
    show: false,
    title: '',
    tip: '',
    showConnectBtn: false,
  },
  setErrorModalConfig: () => {},
  setErrorCode: () => {},
  channel: CardTransferChannel.Ble,
  setChannel: () => {},
  initEstablishState: () => {},
});

export default CardTransferContext;
