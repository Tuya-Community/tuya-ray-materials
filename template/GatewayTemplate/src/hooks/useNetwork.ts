import { useState, useEffect } from 'react';
import useMqttManager from './useMqttManager';

/** 查询网关网络状态返回结果 */
export interface NetworkStatusResponse {
  /** 0：表示有线，1：表示wifi */
  connType: number;
  /** 信号强度 */
  rssi: number;
  /** ssid */
  wifiSsid: string;
}

export interface UseNetworkResult {
  /** 查询网关网络状态返回结果 */
  networkStatus: NetworkStatusResponse;
  /** 发起查询的方法 */
  query: () => void;
}

const reqType = 'gwNetStat';

/** 网关网络信息mqtt操作相关的hooks */
const useNetwork = (callback?: (messageData: any) => void): UseNetworkResult => {
  const { subscribe, unsubscribe, sendMqttMessageAsync } = useMqttManager();

  const [networkStatus, setNetworkStatus] = useState<NetworkStatusResponse>(
    {} as NetworkStatusResponse
  );

  useEffect(() => {
    subscribe({
      reqType,
      protocol: 65,
      callback: handleMqttCallback,
    });
    return () => {
      unsubscribe({ reqType, protocol: 65, callback: handleMqttCallback });
    };
  }, []);

  const handleMqttCallback = ({ messageData }) => {
    setNetworkStatus(messageData);
    typeof callback === 'function' && callback(messageData);
  };

  const publishNetworkMqttMessage = (data: any) =>
    sendMqttMessageAsync({ reqType, protocol: 64, data });

  /**
   * 下发获取网络状态
   */
  const query = () => publishNetworkMqttMessage({});

  return { networkStatus, query };
};

export default useNetwork;
