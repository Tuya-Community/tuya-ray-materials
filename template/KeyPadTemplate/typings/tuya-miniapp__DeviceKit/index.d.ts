
declare namespace ty.device {
  
  export function unregisterLeaveBeaconFenceEvent(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function registerLeaveBeaconFenceEvent(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function writeBeaconFenceConfig(params: {
    
    deviceId: string
    
    beaconFenceRssi: number
    
    isOpenEventWhenApproachingBeaconFence: boolean
    
    isOpenEventWhenLeaveBeaconFence: boolean
    
    isOpenNotifyWhenLeaveBeaconFence: boolean
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function readBeaconFenceConfig(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      deviceId: string
      
      beaconFenceRssi: number
      
      isOpenEventWhenApproachingBeaconFence: boolean
      
      isOpenEventWhenLeaveBeaconFence: boolean
      
      isOpenNotifyWhenLeaveBeaconFence: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function disconnectBTBond(params: {
    
    mac: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function connectBTBond(params: {
    
    mac: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function cancelBLEFileTransfer(params: {
    
    deviceId: string
    
    fileId: number
    
    fileIdentifier: string
    
    fileVersion: number
    
    filePath: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function postBLEFileTransfer(params: {
    
    deviceId: string
    
    fileId: number
    
    fileIdentifier: string
    
    fileVersion: number
    
    filePath: string
    complete?: () => void
    success?: (params: {
      
      result: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getBLEDeviceRSSI(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      signal: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function subscribeBLEConnectStatus(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unsubscribeBLEConnectStatus(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function connectBLEDevice(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function directConnectBLEDevice(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function disconnectBLEDevice(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getBLEOnlineState(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      isOnline: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function subscribeBLETransparentDataReport(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unsubscribeBLETransparentDataReport(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishBLETransparentData(params: {
    
    deviceId: string
    
    data: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getEncryptLocalKeyWithData(params: {
    
    deviceId: string
    
    keyDeviceId: string
    complete?: () => void
    success?: (params: string) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function postBLEBigDataChannelWithProgress(params: {
    
    deviceId: string
    
    requestParams: Record<string, {}>
    complete?: () => void
    success?: (params: {
      
      deviceId: string
      
      resultParams: Record<string, {}>
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startBLEMeshLowPowerConnection(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function stopBLEMeshLowPowerConnection(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startBLEScanBeacon(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function stopBLEScanBeacon(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function bluetoothCapabilityOfBLEBeacon(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function bluetoothIsPowerOn(params?: {
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startBLEScanBindDevice(params: {
    
    interval: number
    
    scanType: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startBLEScan(params?: {
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startBLEScanSync(): null

  
  export function stopBLEScan(params?: {
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function stopBLEScanSync(): null

  
  export function bluetoothCapabilityIsSupport(params: {
    
    deviceId: string
    
    capability: number
    complete?: () => void
    success?: (params: {
      
      isSupport: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getBTDeviceInfo(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      deviceName?: string
      
      isConnected?: boolean
      
      isBond?: boolean
      
      mac?: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startGWActivation(params: {
    
    gateway: Gateway
    
    timeout: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function stopGWActivation(params: {
    
    gwId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openReconnectPage(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startDirectlyConnectedDeviceActivator(params: {
    
    device: Device
    
    timeout: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function stopDirectlyConnectedDeviceActivator(params: {
    
    device: Device
    
    timeout: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openCategoryActivatorPage(params?: {
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startDirectlyConnectedSearchDevice(params: {
    
    device: Device
    
    timeout: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function stopDirectlyConnectedSearchDevice(params: {
    
    device: Device
    
    timeout: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getDeviceWifiActivatorStatus(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      wifiActivator: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startDeviceWifiActivator(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      wifiActivator: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function renameDeviceName(params: {
    
    deviceId: string
    
    name: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function resetFactory(params: {
    
    deviceId: string
    
    dps?: Record<string, {}>
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function removeDevice(params: {
    
    deviceId: string
    
    dps?: Record<string, {}>
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function registerZigbeeGateWaySubDeviceListener(params: {
    
    deviceId: string
    
    dps?: Record<string, {}>
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unregisterZigbeeGateWaySubDeviceListener(params: {
    
    deviceId: string
    
    dps?: Record<string, {}>
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getDeviceOnlineType(params: {
    
    deviceId: string
    
    dps?: Record<string, {}>
    complete?: () => void
    success?: (params: {
      
      onlineType: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getDeviceInfo(params: {
    
    deviceId: string
    
    dps?: Record<string, {}>
    complete?: () => void
    success?: (params: {
      
      schema: {}[]
      
      dps: Record<string, {}>
      
      attribute: number
      
      capability: number
      
      dpName: Record<string, string>
      
      ability: number
      
      icon: string
      
      devId: string
      
      verSw: string
      
      isShare: boolean
      
      bv: string
      
      uuid: string
      
      panelConfig: Record<string, {}>
      
      activeTime: number
      
      devAttribute: number
      
      pcc: string
      
      nodeId: string
      
      parentId: string
      
      category: string
      
      standSchemaModel: {}
      
      productId: string
      
      bizAttribute: number
      
      meshId: string
      
      sigmeshId: string
      
      meta: Record<string, {}>
      
      isLocalOnline: boolean
      
      isCloudOnline: boolean
      
      isOnline: boolean
      
      name: string
      
      groupId: string
      
      dpCodes: Record<string, {}>
      
      devTimezoneId: string
      
      dpsTime: Record<string, {}>
      
      latitude: string
      
      longitude: string
      
      ip: string
      
      isVirtualDevice: boolean
      
      isZigbeeInstallCode: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getProductInfo(params: {
    
    productId: string
    complete?: () => void
    success?: (params: {
      
      panelConfig: Record<string, {}>
      
      schema: string
      
      schemaExt: string
      
      capability: number
      
      attribute: number
      
      productId: string
      
      category: string
      
      categoryCode: string
      
      standard: boolean
      
      pcc: string
      
      vendorInfo: string
      
      quickOpDps: string[]
      
      faultDps: string[]
      
      displayDps: string[]
      
      displayMsgs: Record<string, {}>
      
      uiPhase: string
      
      uiId: string
      
      uiVersion: string
      
      ui: string
      
      rnFind: boolean
      
      uiType: string
      
      uiName: string
      
      i18nTime: number
      
      supportGroup: boolean
      
      supportSGroup: boolean
      
      configMetas: Record<string, {}>
      
      productVer: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getSubDeviceInfoList(params: {
    
    meshId: string
    complete?: () => void
    success?: (params: DeviceInfo[]) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function validDeviceOnlineType(params: {
    
    deviceId: string
    
    onlineType: number
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishDps(params: {
    
    deviceId: string
    
    dps: Record<string, {}>
    
    mode: number
    
    pipelines: number[]
    
    options: Record<string, {}>
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishCommands(params: {
    
    deviceId: string
    
    dps: Record<string, {}>
    
    mode: number
    
    pipelines: number[]
    
    options: Record<string, {}>
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishDpsWithPipeType(params: {
    
    deviceId: string
    
    dps: Record<string, {}>
    
    mode: number
    
    pipelines: number[]
    
    options: Record<string, {}>
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function queryDps(params: {
    
    deviceId: string
    
    dpIds: number[]
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishMqttMessage(params: {
    
    message: Record<string, {}>
    
    deviceId: string
    
    protocol: number
    
    options: Record<string, {}>
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishLanMessage(params: {
    
    message: string
    
    deviceId: string
    
    protocol: number
    
    options?: Record<string, {}>
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishSocketMessage(params: {
    
    message: Record<string, {}>
    
    deviceId: string
    
    type: number
    
    options: Record<string, {}>
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getDeviceProperty(params: {
    
    deviceId: string
    
    dps?: Record<string, {}>
    complete?: () => void
    success?: (params: {
      
      properties: Record<string, Object>
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function setDeviceProperty(params: {
    
    deviceId: string
    
    code: string
    
    value: string
    complete?: () => void
    success?: (params: {
      
      deviceId: string
      
      result: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function syncDeviceInfo(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function subscribeDeviceRemoved(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unSubscribeDeviceRemoved(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function registerMQTTDeviceListener(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unregisterMQTTDeviceListener(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function registerMQTTProtocolListener(params: {
    
    protocol: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unregisterMQTTProtocolListener(params: {
    
    protocol: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function registerDeviceListListener(params: {
    
    deviceIdList: string[]
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unregisterDeviceListListener(params?: {
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function registerTopicListListener(params: {
    
    topicList: string[]
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unregisterTopicListListener(params?: {
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getMqttConnectState(params?: {
    complete?: () => void
    success?: (params: {
      
      connectState: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function checkOTAUpdateInfo(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openDeviceDetailPage(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openGroupDetailPage(params: {
    
    groupId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openTimerPage(params: {
    
    deviceId: string
    
    category: string
    
    repeat?: number
    
    data: {}[]
    
    timerConfig?: TimerConfig
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openGroupTimerPage(params: {
    
    groupId: string
    
    category: string
    
    repeat?: number
    
    data: {}[]
    
    timerConfig?: TimerConfig
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openDeviceWifiNetworkMonitorPage(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function syncTimerTask(params: {
    
    deviceId?: string
    
    groupId?: string
    
    category: string
    complete?: () => void
    success?: (params: {
      
      timers: TimerModel[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function addTimer(params: {
    
    deviceId?: string
    
    groupId?: string
    
    category: string
    
    timer: AddTimerModel
    complete?: () => void
    success?: (params: {
      
      timerId: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function updateTimer(params: {
    
    deviceId?: string
    
    groupId?: string
    
    timer: UpdateTimerModel
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function updateTimerStatus(params: {
    
    deviceId?: string
    
    groupId?: string
    
    timerId: string
    
    status: boolean
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function removeTimer(params: {
    
    deviceId?: string
    
    groupId?: string
    
    timerId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getShareDeviceInfo(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      name: string
      
      mobile: string
      
      email: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openDeviceEdit(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openGroupEdit(params: {
    
    groupId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openDeviceInfo(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function isDeviceSupportOfflineReminder(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      isSupport: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getDeviceOfflineReminderState(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      state: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function toggleDeviceOfflineReminder(params: {
    
    deviceId: string
    
    state: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getDeviceOfflineReminderWarningText(params?: {
    complete?: () => void
    success?: (params: {
      
      warningText: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openDeviceQuestionsAndFeedback(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openShareDevice(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function addDeviceToDesk(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function removeShareDevice(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getSupportedThirdPartyServices(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      services: ThirdPartyService[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openRecommendSceneDetail(params: {
    
    source: string
    
    sceneModel: Record<string, {}>
    complete?: () => void
    success?: (params: {
      
      status?: boolean
      
      type: number
      
      data?: Record<string, {}>
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openDeviceExecutionAndAnutomation(params: {
    
    deviceId: string
    
    title?: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function saveSceneAction(params: {
    
    deviceId: string
    
    taskPosition: number
    
    actionExecutor?: string
    
    executorProperty: Record<string, {}>
    
    extraProperty: Record<string, {}>
    
    actionDisplayNew: Record<string, {}>
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function createAction(params: {
    
    createType: string
    
    smartType: string
    
    actionArray: SceneAction[]
    complete?: () => void
    success?: (params: {
      
      actionArray: SceneAction[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function editAction(params: {
    
    editIndex: string
    
    smartType: string
    
    actionArray: SceneAction[]
    complete?: () => void
    success?: (params: {
      
      actionArray: SceneAction[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function showSceneDialog(params?: {
    
    smartType?: string
    
    color?: string
    
    icon?: string
    
    image?: string
    complete?: () => void
    success?: (params: {
      
      color?: string
      
      icon?: string
      
      image?: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openPreConditionPage(params?: {
    
    id?: string
    
    condType?: string
    
    expr?: Expr
    complete?: () => void
    success?: (params: {
      
      id: string
      
      condType: string
      
      expr: Expr
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function createCondition(params: {
    
    type: string
    
    condition?: string
    
    index?: number
    complete?: () => void
    success?: (params: {
      
      type?: string
      
      condition?: string
      
      index?: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function editCondition(params: {
    
    type: string
    
    condition?: string
    
    index?: number
    complete?: () => void
    success?: (params: {
      
      type?: string
      
      condition?: string
      
      index?: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getGroupDeviceList(params: {
    
    groupId: string
    complete?: () => void
    success?: (params: {
      
      groupId: string
      
      deviceList: DeviceInfo_dKTU5x[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getGroupDeviceNum(params: {
    
    groupId: string
    complete?: () => void
    success?: (params: {
      
      groupId: string
      
      devieNum: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getDeviceNumWithDpCode(params: {
    
    groupId: string
    
    dpCode: string
    complete?: () => void
    success?: (params: {
      
      groupId: string
      
      devieNum: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishGroupDpCodes(params: {
    
    groupId: string
    
    dpCodes: Record<string, Object>
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishSigMeshMultiDps(params: {
    
    groupId: string
    
    localId: string
    
    dps: Record<string, {}>
    
    pcc: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openMeshLocalGroup(params: {
    
    deviceId: string
    
    localId: string
    
    vendorIds: string
    
    type?: string
    
    pccs?: string[]
    
    codes?: string[]
    
    categoryCode?: string
    
    isSupportLowPower?: boolean
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getGroupInfo(params: {
    
    groupId: string
    complete?: () => void
    success?: (params: {
      
      groupId: string
      
      productId: string
      
      name: string
      
      time: number
      
      iconUrl: string
      
      type: number
      
      isShare: boolean
      
      dps: {}
      
      dpCodes: {}
      
      deviceNum: number
      
      localKey: string
      
      pv: number
      
      productInfo: {}
      
      dpName: {}
      
      deviceList: DeviceInfo_dKTU5x[]
      
      localId: string
      
      pcc: string
      
      meshId: string
      
      groupKey: string
      
      schema: {}[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishGroupDps(params: {
    
    groupId: string
    
    dps: {}
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getGroupProperty(params: {
    
    groupId: string
    complete?: () => void
    success?: (params: {
      
      result: Record<string, {}>
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function setGroupProperty(params: {
    
    groupId: string
    
    code: string
    
    value: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function registerGroupChange(params: {
    
    groupIdList: string[]
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unRegisterGroupChange(params?: {
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getMeshDeviceId(params: {
    
    nodeId: string
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      deviceId: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getDpDataByMesh(params: {
    
    deviceId: string
    
    dpIds: Object[]
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function checkOTAUpgradeStatus(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: {
      
      status: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function openOTAUpgrade(params: {
    
    deviceId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function deviceIsSupportThingModel(params: {
    
    devId: string
    complete?: () => void
    success?: (params: {
      
      isSupport: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function updateDeviceThingModelInfo(params: {
    
    pid: string
    
    productVersion: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getDeviceThingModelInfo(params: {
    
    devId: string
    complete?: () => void
    success?: (params: {
      
      modelId: string
      
      productId: string
      
      productVersion: string
      
      services: ServiceModel[]
      
      extensions: Record<string, any>
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function publishThingModelMessage(params: {
    
    devId: string
    
    type: number
    
    payload: Record<string, any>
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function subscribeReceivedThingModelMessage(params: {
    
    devId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function unSubscribeReceivedThingModelMessage(params: {
    
    devId: string
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function onLeaveBeaconFence(
    listener: (params: LeaveBeaconFenceEvent) => void
  ): void

  
  export function offLeaveBeaconFence(
    listener: (params: LeaveBeaconFenceEvent) => void
  ): void

  
  export function onFileTransferProgress(
    listener: (params: FileTransferProgressResult) => void
  ): void

  
  export function offFileTransferProgress(
    listener: (params: FileTransferProgressResult) => void
  ): void

  
  export function onBLEConnectStatusChange(
    listener: (params: ThingBLEConnectStatusEvent) => void
  ): void

  
  export function offBLEConnectStatusChange(
    listener: (params: ThingBLEConnectStatusEvent) => void
  ): void

  
  export function onBLETransparentDataReport(
    listener: (params: ThingBLETransparentDataBean) => void
  ): void

  
  export function offBLETransparentDataReport(
    listener: (params: ThingBLETransparentDataBean) => void
  ): void

  
  export function onBLEBigDataChannelProgressEvent(
    listener: (params: ThingBLEBigDataProgressEvent) => void
  ): void

  
  export function offBLEBigDataChannelProgressEvent(
    listener: (params: ThingBLEBigDataProgressEvent) => void
  ): void

  
  export function onBLEScanBindDevice(
    listener: (params: ThingBLEScanDeviceEvent) => void
  ): void

  
  export function offBLEScanBindDevice(
    listener: (params: ThingBLEScanDeviceEvent) => void
  ): void

  
  export function onBLEBigDataChannelDeviceToAppSuccess(
    listener: (params: BLEBigDataChannelDeviceToAppSuccessResponse) => void
  ): void

  
  export function offBLEBigDataChannelDeviceToAppSuccess(
    listener: (params: BLEBigDataChannelDeviceToAppSuccessResponse) => void
  ): void

  
  export function onBLEBigDataChannelUploadCloudProgress(
    listener: (params: ThingBLEBigDataProgressEvent) => void
  ): void

  
  export function offBLEBigDataChannelUploadCloudProgress(
    listener: (params: ThingBLEBigDataProgressEvent) => void
  ): void

  
  export function onSubDeviceInfoUpdateEvent(
    listener: (params: GWActivationRespond) => void
  ): void

  
  export function offSubDeviceInfoUpdateEvent(
    listener: (params: GWActivationRespond) => void
  ): void

  
  export function onDirectlyConnectedSearchDeviceEvent(
    listener: (params: DirectlyConnectedSearchRespond) => void
  ): void

  
  export function offDirectlyConnectedSearchDeviceEvent(
    listener: (params: DirectlyConnectedSearchRespond) => void
  ): void

  
  export function onDpDataChange(listener: (params: DpsChanged) => void): void

  
  export function offDpDataChange(listener: (params: DpsChanged) => void): void

  
  export function onMqttMessageReceived(
    listener: (params: MqttResponse) => void
  ): void

  
  export function offMqttMessageReceived(
    listener: (params: MqttResponse) => void
  ): void

  
  export function onSocketMessageReceived(
    listener: (params: SocketResponse) => void
  ): void

  
  export function offSocketMessageReceived(
    listener: (params: SocketResponse) => void
  ): void

  
  export function onDeviceOnlineStatusUpdate(
    listener: (params: Online) => void
  ): void

  
  export function offDeviceOnlineStatusUpdate(
    listener: (params: Online) => void
  ): void

  
  export function onDeviceInfoUpdated(
    listener: (params: Device_BKVfwx) => void
  ): void

  
  export function offDeviceInfoUpdated(
    listener: (params: Device_BKVfwx) => void
  ): void

  
  export function onDeviceRemoved(
    listener: (params: OnDeviceRemovedBody) => void
  ): void

  
  export function offDeviceRemoved(
    listener: (params: OnDeviceRemovedBody) => void
  ): void

  
  export function onMqttConnectState(
    listener: (params: MqttConnectStateResponse) => void
  ): void

  
  export function offMqttConnectState(
    listener: (params: MqttConnectStateResponse) => void
  ): void

  
  export function onTimerUpdate(listener: (params: {}) => void): void

  
  export function offTimerUpdate(listener: (params: {}) => void): void

  
  export function onGroupInfoChange(
    listener: (params: GroupInfoResponse) => void
  ): void

  
  export function offGroupInfoChange(
    listener: (params: GroupInfoResponse) => void
  ): void

  
  export function onGroupDpCodeChange(
    listener: (params: GroupDpCodeBean) => void
  ): void

  
  export function offGroupDpCodeChange(
    listener: (params: GroupDpCodeBean) => void
  ): void

  
  export function onGroupRemovedEvent(
    listener: (params: GroupBean) => void
  ): void

  
  export function offGroupRemovedEvent(
    listener: (params: GroupBean) => void
  ): void

  
  export function onGroupDpDataChangeEvent(
    listener: (params: GroupDpDataBean) => void
  ): void

  
  export function offGroupDpDataChangeEvent(
    listener: (params: GroupDpDataBean) => void
  ): void

  
  export function onReceivedThingModelMessage(
    listener: (params: OnReceivedThingModelMessageBody) => void
  ): void

  
  export function offReceivedThingModelMessage(
    listener: (params: OnReceivedThingModelMessageBody) => void
  ): void

  export type Gateway = {
    
    gwId: string
  }

  export type Device = {
    
    deviceId: string
  }

  export type DeviceInfo = {
    
    schema: {}[]
    
    dps: Record<string, {}>
    
    attribute: number
    
    capability: number
    
    dpName: Record<string, string>
    
    ability: number
    
    icon: string
    
    devId: string
    
    verSw: string
    
    isShare: boolean
    
    bv: string
    
    uuid: string
    
    panelConfig: Record<string, {}>
    
    activeTime: number
    
    devAttribute: number
    
    pcc: string
    
    nodeId: string
    
    parentId: string
    
    category: string
    
    standSchemaModel: {}
    
    productId: string
    
    bizAttribute: number
    
    meshId: string
    
    sigmeshId: string
    
    meta: Record<string, {}>
    
    isLocalOnline: boolean
    
    isCloudOnline: boolean
    
    isOnline: boolean
    
    name: string
    
    groupId: string
    
    dpCodes: Record<string, {}>
    
    devTimezoneId: string
    
    dpsTime: Record<string, {}>
    
    latitude: string
    
    longitude: string
    
    ip: string
    
    isVirtualDevice: boolean
    
    isZigbeeInstallCode: boolean
  }

  export type Object = {}

  export type TimerConfig = {
    
    background?: string
  }

  export type TimerModel = {
    
    timerId: string
    
    date: string
    
    time: string
    
    status: boolean
    
    loops: string
    
    dps: Record<string, {}>
    
    timezoneId: string
    
    aliasName: string
    
    isAppPush: boolean
    
    id: string
  }

  export type AddTimerModel = {
    
    time: string
    
    loops: string
    
    dps: Record<string, {}>
    
    aliasName: string
    
    isAppPush: boolean
  }

  export type UpdateTimerModel = {
    
    timerId: string
    
    time: string
    
    loops: string
    
    dps: Record<string, {}>
    
    aliasName: string
    
    isAppPush: boolean
  }

  export type ThirdPartyService = {
    
    serviceId: number
    
    name: string
    
    iconUrl: string
    
    url: string
    
    attributeKey: string
    
    attributeSign: number
    
    originJson: Record<string, {}>
  }

  export type SceneAction = {
    
    id?: string
    
    ruleId?: string
    
    orderNum?: number
    
    entityId: string
    
    entityName?: string
    
    actionExecutor: string
    
    executorProperty: Record<string, {}>
    
    extraProperty: Record<string, {}>
    
    isDevOnline?: boolean
    
    devDelMark?: boolean
    
    deleteDevIcon?: string
    
    devIcon?: string
    
    actionStrategy?: string
    
    extraPanelInfo?: ExtraPanelInfo
    
    pid?: string
    
    productId?: string
    
    productPic?: string
    
    defaultIconUrl?: string
    
    actionDisplayNew?: Record<string, {}>
    
    status?: boolean
  }

  export type Expr = {
    
    start: string
    
    end: string
    
    timeInterval: string
    
    loops: string
    
    timeZoneId: string
    
    cityId: string
    
    cityName: string
  }

  export type DeviceInfo_dKTU5x = {
    
    schema: {}[]
    
    dps: Record<string, {}>
    
    attribute: number
    
    capability: number
    
    dpName: Record<string, string>
    
    ability: number
    
    icon: string
    
    devId: string
    
    verSw: string
    
    isShare: boolean
    
    bv: string
    
    uuid: string
    
    panelConfig: Record<string, {}>
    
    activeTime: number
    
    devAttribute: number
    
    pcc: string
    
    nodeId: string
    
    parentId: string
    
    category: string
    
    standSchemaModel: {}
    
    productId: string
    
    bizAttribute: number
    
    meshId: string
    
    sigmeshId: string
    
    meta: Record<string, {}>
    
    isLocalOnline: boolean
    
    isOnline: boolean
    
    name: string
    
    groupId: string
    
    dpCodes: Record<string, {}>
    
    originJson: Record<string, {}>
    
    dpsTime: {}
  }

  export type ServiceModel = {
    
    properties: ThingProperty[]
    
    actions: ThingAction[]
    
    events: ThingEvent[]
  }

  export type LeaveBeaconFenceEvent = {
    
    deviceId: string
    
    text: string
  }

  export type FileTransferProgressResult = {
    
    deviceId: string
    
    fileId: number
    
    fileIdentifier: string
    
    fileVersion: number
    
    filePath: string
    
    progress: number
  }

  export type ThingBLEConnectStatusEvent = {
    
    deviceId: string
    
    status: string
  }

  export type ThingBLETransparentDataBean = {
    
    deviceId: string
    
    data: string
  }

  export type ThingBLEBigDataProgressEvent = {
    
    deviceId: string
    
    progress: number
  }

  export type ThingBLEScanDeviceEvent = {
    
    deviceId: string
  }

  export type BLEBigDataChannelDeviceToAppSuccessResponse = {
    
    data: BLEBigDataChannelData[]
  }

  export type GWActivationRespond = {
    
    deviceId: string
    
    gwId: string
  }

  export type DirectlyConnectedSearchRespond = {
    
    isActive: boolean
  }

  export type DpsChanged = {
    
    deviceId: string
    
    gwId: string
    
    dps: Record<string, {}>
    
    options: Record<string, {}>
  }

  export type MqttResponse = {
    
    deviceId?: string
    
    message: Record<string, {}>
    
    messageData: Record<string, {}>
    
    type: string
    
    protocol: number
    
    topic?: string
  }

  export type SocketResponse = {
    
    message: Record<string, {}>
    
    deviceId: string
    
    type: number
  }

  export type Online = {
    
    online: boolean
    
    deviceId: string
    
    onlineType: number
  }

  export type Device_BKVfwx = {
    
    deviceId: string
    
    dps?: Record<string, {}>
  }

  export type OnDeviceRemovedBody = {
    
    deviceId: string
  }

  export type MqttConnectStateResponse = {
    
    connectState: number
  }

  export type GroupInfoResponse = {
    
    groupId: string
  }

  export type GroupDpCodeBean = {
    
    groupId: string
    
    dpCodes: Record<string, Object>
  }

  export type GroupBean = {
    
    groupId: string
  }

  export type GroupDpDataBean = {
    
    groupId: string
    
    dps: {}
  }

  export type OnReceivedThingModelMessageBody = {
    
    type: number
    
    payload: Record<string, any>
  }

  export type BLEBigDataChannelData = {
    
    dpsTime: string
    
    dps: Record<string, {}>
  }

  export type ActivationInfoBean = {
    
    gateway: Gateway
    
    timeout: number
  }

  export type DirectlyConnectedActivationBean = {
    
    device: Device
    
    timeout: number
  }

  export type DeviceWifiActivatorResponse = {
    
    wifiActivator: boolean
  }

  export type DeviceNameParams = {
    
    deviceId: string
    
    name: string
  }

  export type DeviceOnlineTypeResponse = {
    
    onlineType: number
  }

  export type Product = {
    
    productId: string
  }

  export type ProductInfo = {
    
    panelConfig: Record<string, {}>
    
    schema: string
    
    schemaExt: string
    
    capability: number
    
    attribute: number
    
    productId: string
    
    category: string
    
    categoryCode: string
    
    standard: boolean
    
    pcc: string
    
    vendorInfo: string
    
    quickOpDps: string[]
    
    faultDps: string[]
    
    displayDps: string[]
    
    displayMsgs: Record<string, {}>
    
    uiPhase: string
    
    uiId: string
    
    uiVersion: string
    
    ui: string
    
    rnFind: boolean
    
    uiType: string
    
    uiName: string
    
    i18nTime: number
    
    supportGroup: boolean
    
    supportSGroup: boolean
    
    configMetas: Record<string, {}>
    
    productVer: string
  }

  export type Mesh = {
    
    meshId: string
  }

  export type DeviceOnline = {
    
    deviceId: string
    
    onlineType: number
  }

  export type DpsPublish = {
    
    deviceId: string
    
    dps: Record<string, {}>
    
    mode: number
    
    pipelines: number[]
    
    options: Record<string, {}>
  }

  export type QueryDps = {
    
    deviceId: string
    
    dpIds: number[]
  }

  export type MqttMessage = {
    
    message: Record<string, {}>
    
    deviceId: string
    
    protocol: number
    
    options: Record<string, {}>
  }

  export type LanMessageParams = {
    
    message: string
    
    deviceId: string
    
    protocol: number
    
    options?: Record<string, {}>
  }

  export type SocketMessage = {
    
    message: Record<string, {}>
    
    deviceId: string
    
    type: number
    
    options: Record<string, {}>
  }

  export type DeviceProperties = {
    
    properties: Record<string, Object>
  }

  export type DeviceProperty = {
    
    deviceId: string
    
    code: string
    
    value: string
  }

  export type DevicePropertyCB = {
    
    deviceId: string
    
    result: boolean
  }

  export type SyncDeviceInfoParams = {
    
    deviceId: string
  }

  export type SubscribeDeviceRemovedParams = {
    
    deviceId: string
  }

  export type UnSubscribeDeviceRemovedParams = {
    
    deviceId: string
  }

  export type MQTTDeviceListenerParams = {
    
    deviceId: string
  }

  export type MQTTProtocolListenerParams = {
    
    protocol: number
  }

  export type DeviceListListenerParams = {
    
    deviceIdList: string[]
  }

  export type TopicListListenerParams = {
    
    topicList: string[]
  }

  export type OTAUpdateInfoParams = {
    
    deviceId: string
  }

  export type DeviceDetailParams = {
    
    deviceId: string
  }

  export type GroupDetailParams = {
    
    groupId: string
  }

  export type TimerParams = {
    
    deviceId: string
    
    category: string
    
    repeat?: number
    
    data: {}[]
    
    timerConfig?: TimerConfig
  }

  export type GroupTimerParams = {
    
    groupId: string
    
    category: string
    
    repeat?: number
    
    data: {}[]
    
    timerConfig?: TimerConfig
  }

  export type WifiNetworkParams = {
    
    deviceId: string
  }

  export type SyncTimerParams = {
    
    deviceId?: string
    
    groupId?: string
    
    category: string
  }

  export type SyncTimerResult = {
    
    timers: TimerModel[]
  }

  export type AddTimerParams = {
    
    deviceId?: string
    
    groupId?: string
    
    category: string
    
    timer: AddTimerModel
  }

  export type AddNewTimerModel = {
    
    timerId: string
  }

  export type UpdateTimerParams = {
    
    deviceId?: string
    
    groupId?: string
    
    timer: UpdateTimerModel
  }

  export type UpdateTimerStatusParams = {
    
    deviceId?: string
    
    groupId?: string
    
    timerId: string
    
    status: boolean
  }

  export type RemoveTimerParams = {
    
    deviceId?: string
    
    groupId?: string
    
    timerId: string
  }

  export type GetShareDeviceInfoParams = {
    
    deviceId: string
  }

  export type GetShareDeviceInfoResponse = {
    
    name: string
    
    mobile: string
    
    email: string
  }

  export type OpenDeviceEditParams = {
    
    deviceId: string
  }

  export type OpenGroupEditParams = {
    
    groupId: string
  }

  export type OpenDeviceInfoParams = {
    
    deviceId: string
  }

  export type IsDeviceSupportOfflineReminderParams = {
    
    deviceId: string
  }

  export type IsDeviceSupportOfflineReminderResponse = {
    
    isSupport: boolean
  }

  export type GetDeviceOfflineReminderStateParams = {
    
    deviceId: string
  }

  export type GetDeviceOfflineReminderStateResponse = {
    
    state: number
  }

  export type ToggleDeviceOfflineReminderParams = {
    
    deviceId: string
    
    state: number
  }

  export type GetDeviceOfflineReminderWarningTextResponse = {
    
    warningText: string
  }

  export type Device_6dV67O = {
    
    deviceId: string
  }

  export type OpenShareDeviceParams = {
    
    deviceId: string
  }

  export type AddDeviceToDeskParams = {
    
    deviceId: string
  }

  export type RemoveShareDeviceParams = {
    
    deviceId: string
  }

  export type GetSupportedThirdPartyServicesParams = {
    
    deviceId: string
  }

  export type GetSupportedThirdPartyServicesResponse = {
    
    services: ThirdPartyService[]
  }

  export type UiComponent = {
    
    code: string
    
    version: string
    
    sort: number
    
    content?: string
    
    fileSize?: string
    
    fileMd5?: string
  }

  export type UiInfo = {
    
    phase?: string
    
    type?: string
    
    ui?: string
    
    appRnVersion?: string
    
    name?: string
    
    rnFind?: boolean
    
    uiConfig?: Record<string, {}>
    
    content?: string
    
    fileSize?: string
    
    fileMd5?: string
    
    rnBizPack?: number
    
    bizClientId?: string
    
    uiComponentList?: UiComponent[]
  }

  export type RNPanelInfo = {
    
    uiid?: string
    
    uiInfo?: UiInfo
    
    androidUiInfo?: UiInfo
    
    i18nTime?: number
  }

  export type MiniInfo = {
    
    extraMiniInfo?: Record<string, {}>
  }

  export type ExtraPanelInfo = {
    
    rnPanelInfo?: RNPanelInfo
    
    miniInfo?: MiniInfo
  }

  export type RecommendSceneParams = {
    
    source: string
    
    sceneModel: Record<string, {}>
  }

  export type RecommendSceneCallBack = {
    
    status?: boolean
    
    type: number
    
    data?: Record<string, {}>
  }

  export type OpenDeviceExecutionAndAnutomationParams = {
    
    deviceId: string
    
    title?: string
  }

  export type SaveSceneActionParams = {
    
    deviceId: string
    
    taskPosition: number
    
    actionExecutor?: string
    
    executorProperty: Record<string, {}>
    
    extraProperty: Record<string, {}>
    
    actionDisplayNew: Record<string, {}>
  }

  export type ActionParams = {
    
    createType: string
    
    smartType: string
    
    actionArray: SceneAction[]
  }

  export type ActionResponse = {
    
    actionArray: SceneAction[]
  }

  export type EditActionParams = {
    
    editIndex: string
    
    smartType: string
    
    actionArray: SceneAction[]
  }

  export type SceneDialogParams = {
    
    smartType?: string
    
    color?: string
    
    icon?: string
    
    image?: string
  }

  export type SceneDialogResponse = {
    
    color?: string
    
    icon?: string
    
    image?: string
  }

  export type PreConditionPageParams = {
    
    id?: string
    
    condType?: string
    
    expr?: Expr
  }

  export type PreConditionPageResponse = {
    
    id: string
    
    condType: string
    
    expr: Expr
  }

  export type ConditionParams = {
    
    type: string
    
    condition?: string
    
    index?: number
  }

  export type ConditionResponse = {
    
    type?: string
    
    condition?: string
    
    index?: number
  }

  export type DeviceListResponse = {
    
    groupId: string
    
    deviceList: DeviceInfo_dKTU5x[]
  }

  export type DeviceNumResponse = {
    
    groupId: string
    
    devieNum: number
  }

  export type DpCodeParams = {
    
    groupId: string
    
    dpCode: string
  }

  export type SigMeshMultiDpDataParams = {
    
    groupId: string
    
    localId: string
    
    dps: Record<string, {}>
    
    pcc: string
  }

  export type MeshLocalGroupParams = {
    
    deviceId: string
    
    localId: string
    
    vendorIds: string
    
    type?: string
    
    pccs?: string[]
    
    codes?: string[]
    
    categoryCode?: string
    
    isSupportLowPower?: boolean
  }

  export type GroupInfo = {
    
    groupId: string
    
    productId: string
    
    name: string
    
    time: number
    
    iconUrl: string
    
    type: number
    
    isShare: boolean
    
    dps: {}
    
    dpCodes: {}
    
    deviceNum: number
    
    localKey: string
    
    pv: number
    
    productInfo: {}
    
    dpName: {}
    
    deviceList: DeviceInfo_dKTU5x[]
    
    localId: string
    
    pcc: string
    
    meshId: string
    
    groupKey: string
    
    schema: {}[]
  }

  export type GetGroupPropertyResponse = {
    
    result: Record<string, {}>
  }

  export type SetGroupPropertyBean = {
    
    groupId: string
    
    code: string
    
    value: string
  }

  export type GroupIdListBean = {
    
    groupIdList: string[]
  }

  export type NodeParams = {
    
    nodeId: string
    
    deviceId: string
  }

  export type DeviceResult = {
    
    deviceId: string
  }

  export type DpDataParams = {
    
    deviceId: string
    
    dpIds: Object[]
  }

  export type CheckOTAUpgradeStatusParams = {
    
    deviceId: string
  }

  export type CheckOTAUpgradeStatusResponse = {
    
    status: number
  }

  export type OpenOTAUpgradeParams = {
    
    deviceId: string
  }

  export type ThingProperty = {
    
    abilityId: number
    
    accessMode: string
    
    typeSpec: Record<string, any>
    
    defaultValue: {}
    
    code: string
  }

  export type ThingAction = {
    
    abilityId: number
    
    inputParams: {}[]
    
    outputParams: {}[]
    
    code: string
  }

  export type ThingEvent = {
    
    abilityId: number
    
    outputParams: {}[]
    
    code: string
  }

  export type DeviceIsSupportThingModelParams = {
    
    devId: string
  }

  export type DeviceIsSupportThingModelResponse = {
    
    isSupport: boolean
  }

  export type UpdateThingModelInfoParams = {
    
    pid: string
    
    productVersion: string
  }

  export type GetDeviceThingModelInfoParams = {
    
    devId: string
  }

  export type GetDeviceThingModelInfoResponse = {
    
    modelId: string
    
    productId: string
    
    productVersion: string
    
    services: ServiceModel[]
    
    extensions: Record<string, any>
  }

  export type PublishThingModelMessageParams = {
    
    devId: string
    
    type: number
    
    payload: Record<string, any>
  }

  export type SubscribeReceivedThingModelMessageParams = {
    
    devId: string
  }

  export type UnSubscribeReceivedThingModelMessageParams = {
    
    devId: string
  }
}
