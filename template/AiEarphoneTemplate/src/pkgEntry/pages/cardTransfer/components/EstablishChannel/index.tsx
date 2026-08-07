/*
 * @Author: hkc
 * @Date: 2026-01-23 18:45:08
 * @Description: 建立快传通道
 * @LastEditTime: 2026-01-30 21:13:54
 * @LastEditors: hkc
 */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Image } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';
import { useRequest } from 'ahooks';
import clsx from 'clsx';

// eslint-disable-next-line import/named
import { DotsLoader, EllipsisText, WiFiSignal } from '@/components';
import { ApConnectState, CardTransferChannel } from '@/types/card';
import { tttSwitchModeLoadOfflineFile } from '@/api/ttt';
import { useSelector } from '@/redux';
import Strings from '@/i18n';
import Res from '@/res';
import CardTransferContext from '../../context';
import HelpModal from '../HelpModal';

import styles from './index.module.less';

// ==================== 类型定义 ====================

interface IProps {
  errorCode: number;
  apConnectState: ApConnectState;
  initEstablishState: () => void;
}

interface StepRenderResult {
  text: string;
  icon: React.ReactNode;
}

// ==================== 枚举定义 ====================

enum WifiOpenStatus {
  Pending = 0, // 开启中
  Success = 1, // 成功
  Failed = 2, // 失败
}

enum WifiConnectedStatus {
  Pending = 0, // 连接中
  Success = 1, // 成功
  Failed = 2, // 失败
}

// ==================== 常量定义 ====================

/** WiFi 开启失败的错误码 */
const WIFI_OPEN_ERROR_CODE = 10091;

/** WiFi 连接失败的错误码列表 */
const CONNECT_ERROR_CODE_LIST = [10092, 10096, 10300, 10301, 10302, 10303, 10304, 10305];

// ==================== 辅助函数 ====================

/**
 * 获取错误提示文案
 */
const getErrorTipText = (errorCode: number): string => {
  const errorKey = `cardTransfer.errorCode_${errorCode}` as any;
  return Strings[errorKey] ? Strings.getLang(errorKey) : '';
};

/**
 * 渲染步骤1（WiFi开启）的状态
 */
const renderStep1 = (status: WifiOpenStatus): StepRenderResult => {
  switch (status) {
    case WifiOpenStatus.Pending:
      return {
        text: Strings.getLang('cardTransfer.establishing_step1'),
        icon: <DotsLoader canvasId="wifiOpenDotsLoader" dotSize={3} />,
      };
    case WifiOpenStatus.Success:
      return {
        text: Strings.getLang('cardTransfer.establishing_step1_success'),
        icon: <Image src={Res.cardTransferSuccessIcon} className={styles.icon} />,
      };
    case WifiOpenStatus.Failed:
      return {
        text: Strings.getLang('cardTransfer.establishing_step1_failed'),
        icon: <Image src={Res.cardTransferFailedIcon} className={styles.icon} />,
      };
    default:
      return {
        text: '',
        icon: null,
      };
  }
};

/**
 * 渲染步骤2（WiFi连接）的状态
 */
const renderStep2 = (
  wifiOpenStatus: WifiOpenStatus,
  wifiConnectedStatus: WifiConnectedStatus
): StepRenderResult => {
  // 如果WiFi还未开启，显示等待状态
  if (wifiOpenStatus !== WifiOpenStatus.Success) {
    return {
      text: Strings.getLang('cardTransfer.establishing_step2'),
      icon: null,
    };
  }

  // WiFi已开启，根据连接状态渲染
  switch (wifiConnectedStatus) {
    case WifiConnectedStatus.Pending:
      return {
        text: Strings.getLang('cardTransfer.establishing_step2_pending'),
        icon: <DotsLoader canvasId="wifiConnectedDotsLoader" dotSize={3} />,
      };
    case WifiConnectedStatus.Success:
      return {
        text: Strings.getLang('cardTransfer.establishing_step2_success'),
        icon: <Image src={Res.cardTransferSuccessIcon} className={styles.icon} />,
      };
    case WifiConnectedStatus.Failed:
      return {
        text: Strings.getLang('cardTransfer.establishing_step2_failed'),
        icon: <Image src={Res.cardTransferFailedIcon} className={styles.icon} />,
      };
    default:
      return {
        text: '',
        icon: null,
      };
  }
};

// ==================== 主组件 ====================

const Index: React.FC<IProps> = ({ errorCode, apConnectState, initEstablishState }) => {
  const { setIsEstablishing, retryCountRef, setErrorModalConfig, setErrorCode, setChannel } =
    useContext(CardTransferContext);
  const { currentSyncCardDevInfo } = useSelector(state => state.fileSync);
  // ==================== 状态管理 ====================
  const [wifiOpenStatus, setWifiOpenStatus] = useState<WifiOpenStatus>(WifiOpenStatus.Pending);
  const [wifiConnectedStatus, setWifiConnectedStatus] = useState<WifiConnectedStatus>(
    WifiConnectedStatus.Pending
  );
  const [isEstablishFailed, setIsEstablishFailed] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // ==================== 接口请求 ====================
  // 切换到AP/BLE模式传输
  const { runAsync: runSwitchMode } = useRequest(tttSwitchModeLoadOfflineFile, {
    manual: true,
  });

  const handleRetryEstablish = async () => {
    // 如果重试次数大于3次，则显示错误弹窗
    if (retryCountRef.current > 2) {
      setErrorModalConfig({
        show: true,
        title: Strings.getLang('cardTransfer.establishing_failed'),
        tip: getErrorTipText(errorCode),
        showConnectBtn: false,
      });
      return;
    }
    // 重试后重置ui状态
    setWifiOpenStatus(WifiOpenStatus.Pending);
    setWifiConnectedStatus(WifiConnectedStatus.Pending);
    setIsEstablishFailed(false);
    initEstablishState();

    retryCountRef.current += 1;
    // 切换到AP模式传输
    await runSwitchMode({
      channel: CardTransferChannel.Wifi,
      deviceId: currentSyncCardDevInfo?.deviceId,
    });
  };

  // 返回ble传输
  const handleBackBle = async () => {
    setIsEstablishing(false);
    setChannel(CardTransferChannel.Ble);
    await runSwitchMode({
      channel: CardTransferChannel.Ble,
      deviceId: currentSyncCardDevInfo?.deviceId,
    });
  };

  // ==================== 副作用处理 ====================
  useEffect(() => {
    // 处理错误码
    if (errorCode === WIFI_OPEN_ERROR_CODE) {
      setWifiOpenStatus(WifiOpenStatus.Failed);
    } else if (CONNECT_ERROR_CODE_LIST.includes(errorCode)) {
      setWifiConnectedStatus(WifiConnectedStatus.Failed);
    }

    // 处理连接状态变化
    if (apConnectState === ApConnectState.Opened) {
      setWifiOpenStatus(WifiOpenStatus.Success);
    }

    if (apConnectState === ApConnectState.Connected) {
      setWifiConnectedStatus(WifiConnectedStatus.Success);
      // 连接成功后，设置为非建立中状态, 并且重置重试次数
      setIsEstablishing(false);
    }
  }, [errorCode, apConnectState]);

  useEffect(() => {
    initEstablishState();
    setWifiOpenStatus(WifiOpenStatus.Pending);
    setWifiConnectedStatus(WifiConnectedStatus.Pending);
  }, []);

  useEffect(() => {
    if (
      wifiOpenStatus === WifiOpenStatus.Failed ||
      wifiConnectedStatus === WifiConnectedStatus.Failed
    ) {
      setIsEstablishFailed(true);
    }
  }, [wifiOpenStatus, wifiConnectedStatus]);

  // ==================== 计算属性 ====================
  const titleText = useMemo(() => {
    return isEstablishFailed
      ? Strings.getLang('cardTransfer.establishing_failed')
      : Strings.getLang('cardTransfer.establishing');
  }, [isEstablishFailed]);

  const tipText = useMemo(() => {
    return isEstablishFailed
      ? getErrorTipText(errorCode)
      : Strings.getLang('cardTransfer.establishing_estimated');
  }, [isEstablishFailed, errorCode]);

  const step1Render = useMemo(() => renderStep1(wifiOpenStatus), [wifiOpenStatus]);

  const step2Render = useMemo(
    () => renderStep2(wifiOpenStatus, wifiConnectedStatus),
    [wifiOpenStatus, wifiConnectedStatus]
  );

  // ==================== 渲染 ====================
  return (
    <>
      <View className={styles.container}>
        <View>
          {/* 标题区域 */}
          <View className={styles.title}>{titleText}</View>
          <View className={styles.tip}>{tipText}</View>

          {/* Banner 区域 */}
          <View className={styles.banner}>
            <View className={styles.bannerImg}>
              <Image src={Res.cardShadowPreviewImg} className={styles.cardImg} />
              <WiFiSignal />
              <Image src={Res.cardTransferPhoneImg} className={styles.phoneImg} />
            </View>
            <View className={styles.bannerTip}>
              {Strings.getLang('cardTransfer.establishing_tip')}
            </View>
          </View>

          {/* 步骤区域 */}
          <View className={styles.step}>
            {/* 步骤1：WiFi开启 */}
            <View className={styles.stepItem}>
              <EllipsisText
                text={step1Render.text}
                className={clsx(styles.text, {
                  [styles.active]: wifiOpenStatus === WifiOpenStatus.Success,
                  [styles.failed]: wifiOpenStatus === WifiOpenStatus.Failed,
                })}
              />
              {step1Render.icon}
            </View>

            {/* 步骤2：WiFi连接 */}
            <View className={styles.stepItem}>
              <EllipsisText
                text={step2Render.text}
                className={clsx(styles.text, {
                  [styles.active]:
                    wifiOpenStatus === WifiOpenStatus.Success &&
                    wifiConnectedStatus === WifiConnectedStatus.Success,
                  [styles.failed]:
                    wifiOpenStatus === WifiOpenStatus.Success &&
                    wifiConnectedStatus === WifiConnectedStatus.Failed,
                })}
              />
              {step2Render.icon}
            </View>
          </View>
        </View>
        <View className={styles.buttonWrapper}>
          {isEstablishFailed && (
            <>
              <Button customClass={styles.retry} onClick={handleRetryEstablish}>
                {Strings.getLang('cardTransfer.retry')}
              </Button>
              <Button customClass={styles.back} onClick={handleBackBle}>
                {Strings.getLang('cardTransfer.backBle')}
              </Button>
            </>
          )}
          <View className={styles.help} onClick={() => setShowHelpModal(true)}>
            <Image src={Res.cardTransferHelpIcon} className={styles.icon} />
            {Strings.getLang('cardTransfer.help')}
          </View>
        </View>
      </View>
      <HelpModal show={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>
  );
};

export default React.memo(Index);
