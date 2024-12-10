import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useDevInfo } from '@ray-js/panel-sdk';
import { Text, View, Image, usePageEvent, router } from '@ray-js/ray';
import Svg from '@ray-js/svg';
import { isIOS } from '@ray-js/env';
import Strings from '@/i18n';
import { DeviceManageOptions, DeviceCapability, ConnectType, SubDeviceType } from '@/types';
import { List, RotationView, HollowRing } from '@/components';
import Res from '@/res';
import { useGetSubDevList, useNetwork, useGetGatewayCapability } from '@/hooks';
import { getIsSupportZigbeeDevice, getIsSupportBleDevice, getIsOnline } from '@/utils';
import styles from './index.module.less';

const subDeviceListCacheKeySuffix = '_subDeviceList';

const rotationDuration = 20 * 1000; // 20s
/** 查询网关网络状态最多查询的次数 */
const MAX_QUERY_TIME = 3;
const QUERY_TIMEOUT = 3 * 1000; // 3s
let queryInterval;

// eslint-disable-next-line no-shadow
export enum NetworkStatus {
  good = 2,
  poor = 1,
  notConnected = 0,
}

const networkStatusMap = {
  [NetworkStatus.good]: {
    linearColor: ['#83DBFF', '#295DCB'],
    statusText: Strings.getLang('networkStatusGood'),
  },
  [NetworkStatus.poor]: {
    linearColor: ['#FF9A62', '#F84E28'],
    statusText: Strings.getLang('networkStatusPoor'),
  },
  [NetworkStatus.notConnected]: {
    linearColor: ['#8C8C8C', '#8C8C8C'],
    statusText: Strings.getLang('networkStatusNotConnected'),
  },
};
export function Home() {
  const devInfo = useDevInfo();

  const [isQueryingNetwork, setIsQueryingNetwork] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  const queryCount = useRef(0);

  const useNetworkCallback = () => {
    clearInterval(queryInterval);
    setIsQueryingNetwork(false);
    queryCount.current = 0;
  };

  const { query: queryNetworkStatus, networkStatus } = useNetwork(useNetworkCallback);
  const subDeviceListCacheKey = `${devInfo.devId}${subDeviceListCacheKeySuffix}`;
  const {
    subDevList = [],
    refreshAsync,
    mutate,
  } = useGetSubDevList(devInfo.devId, {
    manual: true,
    onSuccess: data => {
      if (isIOS) {
        const simpleData = data.map(d => ({
          devId: d.devId,
          pcc: d.pcc,
          isOnline: d.isOnline,
          name: d.name,
          icon: d.icon,
        }));
        ty.setStorageSync({
          key: subDeviceListCacheKey,
          data: JSON.stringify(simpleData),
        });
      }
    },
  });

  const { data = [], loading: isQueryingGatewayCapability } = useGetGatewayCapability(
    JSON.stringify([devInfo.devId])
  );

  const [{ isSupportQueryNetwork = false }] = data.length ? data : [{}];

  const dataSource = useMemo(() => {
    const list: React.ComponentProps<typeof List>['dataSource'] = [];
    if (getIsSupportZigbeeDevice(devInfo.protocolAttribute)) {
      list.push({
        key: 'zigbeeSubDevice',
        title: Strings.getLang('zigbeeSubDevice'),
        image: Res.iconSubDevice,
        isShowArrow: true,
        onClick: () => toSubDevice(SubDeviceType.zigbee),
      });
    }
    if (getIsSupportBleDevice(devInfo.protocolAttribute)) {
      list.push({
        key: 'bleSubDevice',
        title: Strings.getLang('bleSubDevice'),
        image: Res.iconSubDevice,
        isShowArrow: true,
        onClick: () => toSubDevice(SubDeviceType.ble),
      });
    }
    return list;
  }, [devInfo.isCloudOnline]);

  const toSubDevice = type => {
    let manageMenuList = [];
    let deviceCapabilities = [];
    switch (type) {
      case SubDeviceType.ble:
        manageMenuList = [
          DeviceManageOptions.addNewDevice,
          DeviceManageOptions.associateDevice,
          DeviceManageOptions.disassociateDevice,
          DeviceManageOptions.migrateToOtherGateways,
        ];
        deviceCapabilities = [
          DeviceCapability.BLUETOOTH,
          DeviceCapability.SIGMESH,
          DeviceCapability.BEACON,
        ];
        break;
      case SubDeviceType.zigbee:
      default:
        manageMenuList = [DeviceManageOptions.addNewDevice];
        deviceCapabilities = [DeviceCapability.ZIGBEE];
        break;
    }
    router.push(
      `/subDevice?manageMenuList=${encodeURIComponent(
        JSON.stringify(manageMenuList)
      )}&deviceCapabilities=${encodeURIComponent(JSON.stringify(deviceCapabilities))}`
    );
  };

  const startQuery = () => {
    setIsTimeout(false);
    setIsQueryingNetwork(true);
    queryCount.current += 1;
    queryNetworkStatus();
    queryInterval = setInterval(() => {
      if (queryCount.current < MAX_QUERY_TIME) {
        queryCount.current += 1;
        queryNetworkStatus();
      } else {
        clearInterval(queryInterval);
        setIsQueryingNetwork(false);
        setIsTimeout(true);
      }
    }, QUERY_TIMEOUT);
  };

  /**
   * 在线状态子设备数量
   */
  const onlineStateDeviceNumber = useMemo(() => {
    return subDevList.filter(getIsOnline).length;
  }, [subDevList]);

  const currentNetworkStatus = useMemo(() => {
    // 云端不在线，直接认为未连接
    if (!devInfo.isCloudOnline) {
      return NetworkStatus.notConnected;
    }
    if (isQueryingNetwork || isQueryingGatewayCapability) {
      return undefined;
    }
    // 如果不支持查询，则显示良好
    if (!isSupportQueryNetwork) {
      return NetworkStatus.good;
    }
    // 如果超时，则显示网络差
    if (isTimeout) {
      return NetworkStatus.poor;
    }
    // 有线连接则认为是好
    if (networkStatus.connType === ConnectType.wired) {
      return NetworkStatus.good;
    }
    // 信号强度小于 -66 则认为差。否则都认为好
    return networkStatus.rssi < -66 ? NetworkStatus.poor : NetworkStatus.good;
  }, [
    networkStatus.rssi,
    networkStatus.connType,
    devInfo.isCloudOnline,
    isSupportQueryNetwork,
    isQueryingNetwork,
    isQueryingGatewayCapability,
    isTimeout,
  ]);

  useEffect(() => {
    if (!isSupportQueryNetwork && !isQueryingGatewayCapability) {
      showUpdateModal();
    }
  }, [isQueryingGatewayCapability, isSupportQueryNetwork]);

  useEffect(() => {
    // 云端在线，并且支持查询，才发送
    if (isSupportQueryNetwork && devInfo.isCloudOnline) {
      startQuery();
    }
  }, [isSupportQueryNetwork, devInfo.isCloudOnline]);

  useEffect(() => {
    if (isIOS) {
      const cache = ty.getStorageSync({ key: subDeviceListCacheKey });
      console.log('cache :>> ', cache);
      if (cache) {
        const res = JSON.parse(cache);
        if (Array.isArray(res)) {
          mutate(res);
        }
      }
    }
    refreshAsync();
  }, []);

  useEffect(() => {
    setNavigationBar();
  }, [devInfo.name]);

  usePageEvent('onShow', () => {
    refreshAsync();
  });

  usePageEvent('onPullDownRefresh', () => {
    refreshAsync();
    // 云端在线，并且支持查询，才发送
    if (isSupportQueryNetwork && devInfo.isCloudOnline) {
      startQuery();
    }
    ty.stopPullDownRefresh();
  });

  const setNavigationBar = useCallback(() => {
    ty.setNavigationBarTitle({
      title: devInfo.name,
    });
  }, [devInfo.name]);

  const showUpdateModal = () => {
    ty.device.checkOTAUpgradeStatus({
      deviceId: devInfo.devId,
      success: ({ status }) => {
        if (status === 1) {
          ty.showModal({
            title: '',
            content: Strings.getLang('updateTip'),
            showCancel: false,
            confirmText: Strings.getLang('upgradeImmediately'),
            success: ({ confirm }) => {
              ty.device.openOTAUpgrade({
                deviceId: devInfo.devId,
              });
            },
          });
        }
      },
    });
  };

  const renderQuerying = () => {
    return (
      <>
        <RotationView className={styles['rotate-item']} duration={rotationDuration}>
          <Image src={Res.connecting} mode="aspectFit" className={styles['connecting-img']} />
        </RotationView>
        <Text className={styles['network-status-text']}>{Strings.getLang('connecting')}</Text>
      </>
    );
  };

  const renderQueryResult = () => {
    const currentStatus =
      networkStatusMap[currentNetworkStatus] || networkStatusMap[NetworkStatus.good];
    const startStyle = currentNetworkStatus
      ? `stop-color:${currentStatus.linearColor[0]};stop-opacity:0.1`
      : '';
    const endStyle = currentNetworkStatus
      ? `stop-color:${currentStatus.linearColor[1]};stop-opacity:0.1`
      : '';
    return (
      <>
        <RotationView className={styles['rotate-item']} duration={rotationDuration}>
          <Svg width="271px" height="276px" viewBox="0 0 271 276">
            <defs>
              <linearGradient x1="54.6%" y1="9.7%" x2="26.8%" y2="91.7%" id="f1">
                <stop offset="0%" style={startStyle} />
                <stop offset="100%" style={endStyle} />
              </linearGradient>
            </defs>
            <path
              fill="url(#f1)"
              d="M157.618028,0 C231.195385,0 270.396456,54.1936874 270.396456,127.802954 C270.396456,161.236837 275.830006,189.150887 254.091145,213.458124 C250.618338,217.341227 242.213011,224.163206 233.424616,230.91381 L232.276505,231.793671 L232.276505,231.793671 L231.126293,232.671238 L231.126293,232.671238 L229.976223,233.545027 C221.548382,239.93533 213.312988,245.901089 209.251512,248.807873 C186.174119,265.324348 156.842643,276 127.72495,276 C52.3259212,274.474217 0,205.491042 0,131.881778 C0,110.638127 4.07632834,73.4187158 14.946537,48.9458124 C34.0826294,5.86331447 105.27511,0 157.618028,0 Z M137.5,32 C83.6522379,32 40,75.6522379 40,129.5 C40,183.34776 83.6522379,227 137.5,227 C191.34776,227 235,183.34776 235,129.5 C235,75.6522379 191.34776,32 137.5,32 Z"
            />
          </Svg>
        </RotationView>
        <RotationView className={styles['rotate-item']} duration={rotationDuration}>
          <Svg width="266px" height="271px" viewBox="0 0 266 271">
            <defs>
              <linearGradient x1="54.6%" y1="9.7%" x2="26.8%" y2="91.7%" id="f2">
                <stop offset="0%" style={startStyle} />
                <stop offset="100%" style={endStyle} />
              </linearGradient>
            </defs>
            <path
              fill="url(#f2)"
              d="M141.03804,0.663096567 C212.680884,-7.36458841 268,58.7336728 268,131.887543 C268,174.662671 256.734094,235.737914 217.206039,260.866538 C189.133354,278.712796 137.507997,267.555419 107.201638,267.555419 C34.2220483,267.555419 11.6778541,214.572705 2.12547582,140.717997 C-1.05865021,79.7075905 56.6587014,13.5073934 141.03804,0.663096567 Z M140.5,44 C83.8908141,44 38,90.0155575 38,146.778622 C38,203.541694 91.0088693,231 147.618051,231 C204.227237,231 243,203.541694 243,146.778622 C243,90.0155575 197.109184,44 140.5,44 Z"
            />
          </Svg>
        </RotationView>
        <RotationView className={styles['rotate-item']} duration={rotationDuration}>
          <HollowRing size="240px" borderWidth="30px" linearColor={currentStatus.linearColor} />
        </RotationView>
        <View className={styles['network-status-content']}>
          <Text className={styles['network-status-text']}>{currentStatus.statusText}</Text>
          <Text className={styles['network-status-tip']}>
            {Strings.formatValue('onlineDeviceNum', onlineStateDeviceNumber)}
          </Text>
        </View>
      </>
    );
  };

  const renderNetworkStatus = () => {
    return (
      <View className={styles['network-status-container']}>
        {isQueryingNetwork || isQueryingGatewayCapability ? renderQuerying() : renderQueryResult()}
      </View>
    );
  };

  const renderSsidInfo = () => {
    return (
      <View className={styles['ssid-info']}>
        {networkStatus.connType === ConnectType.wired
          ? Strings.getLang('wiredConnection')
          : networkStatus.wifiSsid
          ? Strings.formatValue('wifiSsid', networkStatus.wifiSsid)
          : ''}
      </View>
    );
  };

  const renderList = () => {
    return <List dataSource={dataSource} className={clsx(styles['menu-list'])} />;
  };

  return (
    <View className={styles.container}>
      <View className={styles['top-container']}>
        {renderNetworkStatus()}
        {renderSsidInfo()}
      </View>
      {renderList()}
    </View>
  );
}

export default Home;
