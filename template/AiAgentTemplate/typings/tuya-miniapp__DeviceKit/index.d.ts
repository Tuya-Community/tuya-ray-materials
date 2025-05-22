/**
 * DeviceKit
 *
 * @version 4.14.0
 */
declare namespace ty.device {
  /**
   *@description 判断设备是否支持多控关联*/
  export function checkSupportMultiControl(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    success?: (params: {
      /**
       * result
       * 是否支持多控关联
       */
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
    complete?: () => void
  }): void

  /**
   *@description 判断设备是否支持多控关联*/
  export function checkSupportMultiControlSync(
    params?: CheckSupportMultiControlParams
  ): {
    /**
     * result
     * 是否支持多控关联
     */
    result: boolean
  }

  /**
   *@description 获取设备支持多控的dp点信息
   *@error {9006: 'netowrk request error'}*/
  export function getMultiControlDp(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    success?: (params: {
      /**
       * infos
       * dp点信息
       */
      infos: MultiControlDpInfo[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备多控dp点下的多控组信息
   *@error {9006: 'netowrk request error'}*/
  export function getMultiControlGroup(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    /**
     * dpId
     * dp id
     */
    dpId: number
    success?: (params: {
      /**
       * info
       * 多控组信息
       */
      info: MultiControlGroupInfo
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 多控组使能状态更新
   *@error {9006: 'netowrk request error'}*/
  export function updateMultiControlGroupStatus(params: {
    /**
     * multiControlGroupId
     * 多控组id
     */
    multiControlGroupId: number
    /**
     * enable
     * 是否使能
     */
    enable: boolean
    success?: (params: {
      /**
       * result
       * 是否成功
       */
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
    complete?: () => void
  }): void

  /**
   *@description 获取可以与指定设备组成多控组的其他设备
   *@error {9006: 'netowrk request error'}*/
  export function getMultiControlDevices(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    success?: (params: {
      /**
       * devices
       * 设备列表
       */
      devices: MultiControlDevice[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备可以与指定设备指定dp点组成多控组的dp点信息
   *@error {9006: 'netowrk request error'}*/
  export function getAvailableMultiControlDp(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    /**
     * targetDeviceId
     * 指定设备id
     */
    targetDeviceId: string
    /**
     * targetDpId
     * 指定dpid
     */
    targetDpId: number
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    success?: (params: {
      /**
       * info
       * dp点信息
       */
      info: MultiControlDeviceDpsInfo
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 更新多控群组
   *@error {9006: 'netowrk request error'}*/
  export function updateMultiControlGroup(params: {
    /**
     * multiControlGroupId
     * 多控组id
     */
    multiControlGroupId: number
    /**
     * name
     * 多控组名称
     */
    name: string
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    /**
     * deviceDps
     * 多控组设备dp关系 [{devId:xxx, dpId:xxx},{devId:xxx, dpId:xxx}]
     */
    deviceDps: UpdateMultiControlDPInfo[]
    success?: (params: {
      /**
       * result
       * 多控组信息
       */
      result: MultiControlGroup
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 判断设备是否支持双控关联*/
  export function checkSupportDoubleControl(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    success?: (params: {
      /**
       * result
       * 是否支持双控关联
       */
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
    complete?: () => void
  }): void

  /**
   *@description 判断设备是否支持双控关联*/
  export function checkSupportDoubleControlSync(
    params?: CheckSupportDoubleControlParams
  ): {
    /**
     * result
     * 是否支持双控关联
     */
    result: boolean
  }

  /**
   *@description 获取设备的双控组信息
   *@error {9006: 'netowrk request error'}*/
  export function getDoubleControlGroup(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    success?: (params: {
      /**
       * info
       * 双控组信息
       */
      info: DoubleControlGroup
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 移除双控关联从设备
   *@error {9006: 'netowrk request error'}*/
  export function removeDoubleControlSlaveDevice(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取可以与指定主设备形成双控关联的从设备列表
   *@error {9006: 'netowrk request error'}*/
  export function getDoubleControlAvailableSlaveDevices(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    success?: (params: {
      /**
       * devices
       * 设备信息
       */
      devices: DoubleControlDevice[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 更新双控关联从设备
   *@error {9006: 'netowrk request error'}*/
  export function updateDoubleControl(params: {
    /**
     * mainDeviceId
     * 主设备id
     */
    mainDeviceId: string
    /**
     * slaveDeviceIds
     * 从设备id列表
     */
    slaveDeviceIds: string[]
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取双控关联主从设备dp点关系
   *@error {9006: 'netowrk request error'}*/
  export function getDoubleControlDPRelation(params: {
    /**
     * mainDeviceId
     * 主设备id
     */
    mainDeviceId: string
    /**
     * slaveDeviceId
     * 从设备id
     */
    slaveDeviceId: string
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    success?: (params: {
      /**
       * relation
       * dp点关系
       */
      relation: DoubleControlDPRelation
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备本地化的dp点信息
   *@error {9006: 'netowrk request error'}*/
  export function getLocalizedDpInfo(params: {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    success?: (params: {
      /**
       * infos
       * dp点信息
       */
      infos: DoubleControlDPInfo[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 更新双控关联dp点关系
   *@error {9006: 'netowrk request error'}*/
  export function updateDoubleControlDpRelation(params: {
    /**
     * mainDeviceId
     * 主设备id
     */
    mainDeviceId: string
    /**
     * slaveDeviceId
     * 从设备id
     */
    slaveDeviceId: string
    /**
     * relations
     * 主从设备dp点关系, key: 主设备dpId, value: 从设备dpId
     */
    relations: any
    /**
     * spaceId
     * 家庭id
     */
    spaceId: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注册监听远离beacon设备范围事件*/
  export function unregisterLeaveBeaconFenceEvent(params: {
    /** 设备模型 设备id */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注册监听远离beacon设备范围事件*/
  export function registerLeaveBeaconFenceEvent(params: {
    /** 设备模型 设备id */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 写入BeaconFence配置*/
  export function writeBeaconFenceConfig(params: {
    /** 设备模型 设备id */
    deviceId: string
    /** 最小信号强度 */
    beaconFenceRssi: number
    /** 设置是否打开进入范围强度区间发送dp功能 */
    isOpenEventWhenApproachingBeaconFence: boolean
    /** 设置是否打开离开范围强度区间发送dp功能 */
    isOpenEventWhenLeaveBeaconFence: boolean
    /** 设置是否打开离开范围强度区间发送本地通知 */
    isOpenNotifyWhenLeaveBeaconFence: boolean
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 读取beaconFence配置*/
  export function readBeaconFenceConfig(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: {
      /** 设备模型 设备id */
      deviceId: string
      /** 最小信号强度 */
      beaconFenceRssi: number
      /** 设置是否打开进入范围强度区间发送dp功能 */
      isOpenEventWhenApproachingBeaconFence: boolean
      /** 设置是否打开离开范围强度区间发送dp功能 */
      isOpenEventWhenLeaveBeaconFence: boolean
      /** 设置是否打开离开范围强度区间发送本地通知 */
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
    complete?: () => void
  }): void

  /**
   *@description 移除BT配对 (仅Android端实现)*/
  export function disconnectBTBond(params: {
    /** 设备的mac地址 */
    mac: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 打开BT配对窗口 (仅Android端实现)*/
  export function connectBTBond(params: {
    /** 设备的mac地址 */
    mac: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 取消文件传输到蓝牙设备 仅IOS支持*/
  export function cancelBLEFileTransfer(params: {
    /** 设备模型 设备id */
    deviceId: string
    /** 文件id */
    fileId: number
    /** 文件标识符 */
    fileIdentifier: string
    /** 文件版本 */
    fileVersion: number
    /** 文件地址 */
    filePath: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 传输文件到蓝牙设备*/
  export function postBLEFileTransfer(params: {
    /** 设备模型 设备id */
    deviceId: string
    /** 文件id */
    fileId: number
    /** 文件标识符 */
    fileIdentifier: string
    /** 文件版本 */
    fileVersion: number
    /** 文件地址 */
    filePath: string
    success?: (params: {
      /** true/false 传输成功/传输失败 */
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
    complete?: () => void
  }): void

  /**
   *@description 获取BLE外设的信号*/
  export function getBLEDeviceRSSI(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: {
      /**
       * 设备信号
       * signal 若为 0，则获取失败
       */
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
    complete?: () => void
  }): void

  /**
   *@description 开始监听BLE(thing)连接状态*/
  export function subscribeBLEConnectStatus(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 停止监听BLE(thing)连接状态*/
  export function unsubscribeBLEConnectStatus(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 连接BLE(thing)设备，该方法只执行连接动作，连接状态通过【onBLEConnectStatusChange】事件获取*/
  export function connectBLEDevice(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 直连BLE(thing)设备，该方法只执行连接动作，连接状态通过【onBLEConnectStatusChange】事件获取*/
  export function directConnectBLEDevice(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 断开BLE(thing)设备*/
  export function disconnectBLEDevice(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 查询BLE(thing)本地在线状态*/
  export function getBLEOnlineState(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: {
      /**
       * 蓝牙在线状态的回调boolean值
       * isOnline 是否在线
       */
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
    complete?: () => void
  }): void

  /**
   *@description 开始监听BLE(thing)设备数据透传通道上报，上报情况通过【onBLETransparentDataReport】事件获取*/
  export function subscribeBLETransparentDataReport(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 停止监听BLE(thing)设备数据透传通道上报*/
  export function unsubscribeBLETransparentDataReport(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description BLE(thing)下发透传数据*/
  export function publishBLETransparentData(params: {
    /**
     * 蓝牙透传数据
     * deviceId: 设备 id
     */
    deviceId: string
    /** data: 透传内容 */
    data: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取加密过的设备 localKey
   *BLE(thing)蓝牙大数据通道传输过程中需要用到的特殊加密操作*/
  export function getEncryptLocalKeyWithData(params: {
    /**
     * 大数据通道加密计算结构
     * deviceId 设备 id
     */
    deviceId: string
    /** keyDeviceId 需要传输加密密钥的设备Id */
    keyDeviceId: string
    success?: (params: string) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 大数据通道操作，支持进度反馈。不同的反馈通过以下事件返回给前端
   *1. 大数据从设备传输到App成功通过【onBLEBigDataChannelDeviceToAppSuccess】事件获取
   *2. 大数据上传到云端进度通过【onBLEBigDataChannelUploadCloudProgress】事件获取
   *3. BLE数据通道传输进度通过【onBLEBigDataChannelProgressEvent】事件获取*/
  export function postBLEBigDataChannelWithProgress(params: {
    /** deviceId 设备 id */
    deviceId: string
    /**
     * 建立数据传输所需相关参数
     * command：通道操作的具体指令；start/stop：开启/关闭大数据通道；type：要上传的数据类型
     * requestParams 通道指令集
     * {
     *    "command": "start",
     *    "type": "1"
     * }
     */
    requestParams: any
    success?: (params: {
      /** deviceId 设备 id */
      deviceId: string
      /**
       * 数据传输完毕相关参数（type dps fileUrl）
       * resultParams 数据传输完毕相关参数
       */
      resultParams: any
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 发起蓝牙mesh设备连接。该方法只执行连接动作，连接状态通过【onTYBLEConnectStatusChange】事件获取*/
  export function startBLEMeshLowPowerConnection(params: {
    /** deviceId 设备 id */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 断开蓝牙mesh设备连接。该方法只执行断开动作，连接状态通过【onTYBLEConnectStatusChange】事件获取*/
  export function stopBLEMeshLowPowerConnection(params: {
    /** deviceId 设备 id */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 启动扫描Beacon扫描*/
  export function startBLEScanBeacon(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 停止扫描Beacon扫描。*/
  export function stopBLEScanBeacon(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 设备是否支持BLEBeacon能力*/
  export function bluetoothCapabilityOfBLEBeacon(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 判断手机蓝牙是否打开*/
  export function bluetoothIsPowerOn(params?: {
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 在指定时间内扫描已配网的设备，扫描结果通过【onBLEScanBindDevice】事件获取*/
  export function startBLEScanBindDevice(params: {
    /** 间隔扫描时间。如果<0，则返回错误 */
    interval: number
    /**
     * 【废弃】扫描不区分type
     * 扫描类型
     * SINGLE -> "SINGLE"
     * SINGLE_QR -> "SINGLE_QR"
     * MESH -> "MESH"
     * SIG_MESH -> "SIG_MESH"
     * NORMAL -> "NORMAL"
     * Thing_BEACON -> "Thing_BEACON"
     */
    scanType: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 【废弃】iOS单端插件方法。调用 connectBLEDevice 连接蓝牙设备前需要先调用该方法开启扫描。
   *开启扫描*/
  export function startBLEScan(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 【废弃】iOS单端插件方法。调用 connectBLEDevice 连接蓝牙设备前需要先调用该方法开启扫描。
   *开启扫描*/
  export function startBLEScanSync(): null

  /**
   *@description 【废弃】iOS单端插件方法。不需要连接设备时调用该方法关闭扫描。
   *关闭扫描*/
  export function stopBLEScan(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 【废弃】iOS单端插件方法。不需要连接设备时调用该方法关闭扫描。
   *关闭扫描*/
  export function stopBLEScanSync(): null

  /**
   *@description 蓝牙设备是否支持某个能力
   *capability 不同值对应查询的具体能力值
   *0：OTA时DP是否可控
   *1：网关和App对于该设备是否使用低功耗在线逻辑
   *2：是否具备Beacon能力
   *3：是否有蓝牙LINK层加密使能
   *4：是否支持扩展模块
   *5：是否支持定时
   *6：是否支持蓝牙BT/BLE双模
   *7：是否需要强制LINK层加密*/
  export function bluetoothCapabilityIsSupport(params: {
    /** 设备Id */
    deviceId: string
    /**
     * 能力值标位
     * 5：定时
     */
    capability: number
    success?: (params: {
      /**
       * 是否支持蓝牙相关能力的结果回调
       * isSupport 是否支持
       */
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
    complete?: () => void
  }): void

  /**
   *@description 获取设备BT信息*/
  export function getBTDeviceInfo(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: {
      /** 设备名称 */
      deviceName?: string
      /** 是否连接 */
      isConnected?: boolean
      /** 是否配对 */
      isBond?: boolean
      /** mac */
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
    complete?: () => void
  }): void

  /**
   *@description 蓝牙连接
   *聚合接口, 支持ble, 双模中ble, beacon, mesh, mesh单火类连接*/
  export function connectBluetoothDevice(params: {
    /** 设备ID */
    devId: string
    /**
     * 连接超时时限
     * 单位: 毫秒
     */
    timeoutMillis?: number
    /**
     * 来源类型
     * 如果是面板进来的自动连接, 输入1; 否则默认0, 为主动连接
     */
    souceType?: number
    /**
     * 蓝牙连接方式,默认0
     * 0 : 网关和app都需要，默认值，本地和网关两个途径任何一个可用均可生效
     * 1 : 仅app，只会判定本地是否在线，以及本地连接是否成功
     * 2 : 仅网关连接，只会判定网关是否在线，以及坚持网关连接是否成功
     */
    connectType?: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 蓝牙断开连接
   *聚合接口, 支持ble, 双模中的ble, mesh单火类以及mesh连接断开. beacon设备调用无效*/
  export function disconnectBluetoothDevice(params: {
    /** 设备ID */
    devId: string
    /**
     * 蓝牙连接方式,默认0
     * 0 : 网关和app都需要，默认值，本地和网关两个途径任何一个可用均可生效
     * 1 : 仅app，只会判定本地是否在线，以及本地连接是否成功
     * 2 : 仅网关连接，只会判定网关是否在线，以及坚持网关连接是否成功
     */
    connectType?: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 激活设备的扩展模块*/
  export function activeDeviceExtendModule(params: {
    /** 设备id */
    deviceId: string
    /** Wi-Fi的ssid */
    ssid?: string
    /** Wi-Fi的pwd */
    password?: string
    /**
     * 激活的类型
     * 0：普通双模设备的连云激活
     * 1：ble+x设备的可插拔模块的连云激活
     * 2：ble+Wi-Fi设备的 Wi-Fi模块的连云激活
     * 区别：类型0、2需要传设备ID、Wi-Fi的ssid和pwd。类型位1只需传设备id
     */
    activeType: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 更新mesh设备proxy开关状态*/
  export function updateMeshProxyState(params: {
    /** 设备id */
    deviceId: string
    /** mesh设备的Proxy或relay功能是否开启 */
    isOpen: boolean
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 更新mesh设备relay开关状态*/
  export function updateMeshRelayState(params: {
    /** 设备id */
    deviceId: string
    /** mesh设备的Proxy或relay功能是否开启 */
    isOpen: boolean
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 操作蓝牙连接记录打点*/
  export function recordBleConnectEvent(params: {
    /** 设备id */
    deviceId: string
    /** 来源: 1: 门锁面板, 其他-暂未定义，后续可扩展 */
    src: number
    /** 操作动作id，用于关联其他埋点的信息id */
    actId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 扫描新能源通信棒，扫描结果通过【onBLECommRodScanDevice】事件获取*/
  export function startBLECommRodScanDevice(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 停止扫描新能源通信棒*/
  export function stopBLECommRodScanDevice(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 通信棒蓝牙连接，通过【onBLECommRodConnectStatusChange】返回连接状态*/
  export function connectBLECommRodDevice(params: {
    /** 设备信息 */
    deviceInfo: CommRodDeviceModel
    /** 设备密码 */
    machineKey: string
    /** 设备schema信息 */
    schema: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 断开通信棒蓝牙连接*/
  export function disconnectBLECommRodDevice(params: {
    /** 扫描到的设备ID */
    deviceId: string
    /** 扫描到的设备名称 */
    name: string
    /** 扫描到的设备uuid */
    uuid: string
    /** 扫描到的设备pid */
    pid: string
    /** 设备的mac */
    mac: string
    /** 是否激活 */
    isActive: boolean
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 蓝牙通信棒dps下发*/
  export function publishBLECommRodDps(params: {
    /** 设备信息 */
    deviceInfo: CommRodDeviceModel
    /** dps */
    dps: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 通过mesh vendor透传下发控制指令*/
  export function publishMeshCustomDataEvent(params: {
    /** mesh id(面板parentId) */
    meshId: string
    /** 节点 id(面板localId) */
    nodeId: string
    /** opCode */
    opCode: number
    /** 透传数据，需要hexString */
    payloadHexString: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 本地连接设备初始化，小程序基础层会默认调用（type=1），通常情况下小程序面板业务侧不需要调用。
   *执行内容:
   *1.蓝牙设备: 执行连接策略检查
   *2.Mesh 设备: 执行 query
   *3.Beacon 设备: 执行 ping
   *4.其他设备: 不执行任何操作*/
  export function localDeviceEntry(params: {
    /** 设备id */
    deviceId: string
    /** 群组id */
    groupId: string
    /**
     * 类型
     * 0: 默认值 all ping. (iOS、安卓 均执行 “蓝牙连接策略/BeaconPing/MeshQuery”)
     * 1: 进入面板时 ping. (安卓执行 “蓝牙连接策略/BeaconPing/MeshQuery”,  iOS 仅执行 “蓝牙连接策略”，不执行“BeaconPing/MeshQuery”)
     */
    type?: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 本地连接设备销毁，小程序基础层会默认调用，通常情况下小程序面板业务侧不需要调用。
   *执行内容:
   *1.蓝牙设备: 执行连接策略检查
   *2.其他设备: 不执行任何操作*/
  export function localDeviceExit(params: {
    /** 设备id */
    deviceId: string
    /** 群组id */
    groupId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 使网关进入配网模式，对其子设备进行配网*/
  export function startGWActivation(params: {
    /**
     * 网关子设备激活数据
     * gateway Gateway 网关模型
     */
    gateway: Gateway
    /** timeout 超时时间设定（秒），建议值120 */
    timeout: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 停止网关的配网模式*/
  export function stopGWActivation(params: {
    /**
     * 网关模型
     * gwId 网关设备Id
     */
    gwId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转设备断线重连页面*/
  export function openReconnectPage(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 免配网-开始设备激活*/
  export function startDirectlyConnectedDeviceActivator(params: {
    /**
     * 设备Id
     * device Device 设备模型
     */
    device: Device
    /** timeout 超时时间设定（秒），建议值120 */
    timeout: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 免配网-停止设备激活*/
  export function stopDirectlyConnectedDeviceActivator(params: {
    /**
     * 设备Id
     * device Device 设备模型
     */
    device: Device
    /** timeout 超时时间设定（秒），建议值120 */
    timeout: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 进入配网-选品类首页*/
  export function openCategoryActivatorPage(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 免配网-开始设备扫描*/
  export function startDirectlyConnectedSearchDevice(params: {
    /**
     * 设备Id
     * device Device 设备模型
     */
    device: Device
    /** timeout 超时时间设定（秒），建议值120 */
    timeout: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 免配网-结束设备扫描*/
  export function stopDirectlyConnectedSearchDevice(params: {
    /**
     * 设备Id
     * device Device 设备模型
     */
    device: Device
    /** timeout 超时时间设定（秒），建议值120 */
    timeout: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 连云激活-WiFi的激活状态
   *@error {20001: 'DeviceId is invalid'} | {20021: 'Cannot find service'}*/
  export function getDeviceWifiActivatorStatus(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: {
      /** 设备是否WiFi激活 */
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
    complete?: () => void
  }): void

  /**
   *@description 连云激活-进行wifi激活
   *@error {20001: 'DeviceId is invalid'} | {20021: 'Cannot find service'} | {20086: 'device wifi activator error'}*/
  export function startDeviceWifiActivator(params: {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    success?: (params: {
      /** 设备是否WiFi激活 */
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
    complete?: () => void
  }): void

  /**
   *@description 大禹通道单设备启用/关闭配置更新*/
  export function yuChannelSaveState(params: {
    /** 设备id */
    deviceId: string
    /** 状态 0-关闭, 1-启用 */
    state: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 大禹状态同步，让其他直连节点在线的设备状态同步到大禹（单个设备同步）*/
  export function yuChannelSyncSingle(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 大禹状态同步，让其他直连节点在线的设备状态同步到大禹（单个设备同步）*/
  export function yuChannelSyncSingleSync(device?: Device_fUC2mh): null

  /**
   *@description 大禹通道主节点查询其他从节点node信息*/
  export function yuChannelQueryNodes(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: {
      /** 返回结果 */
      result: string[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 查询设备Wi-Fi信号*/
  export function requestWifiSignal(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: string) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 大禹状态同步，让其他直连节点在线的设备状态同步到大禹(全量设备同步)*/
  export function yuChannelSync(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 大禹状态同步，让其他直连节点在线的设备状态同步到大禹(全量设备同步)*/
  export function yuChannelSyncSync(): null

  /**
   *@description 大禹在线状态*/
  export function isYuDeviceOnline(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 大禹在线状态*/
  export function isYuDeviceOnlineSync(device?: Device_fUC2mh): boolean

  /**
   *@description 同步Mesh设备的dps点*/
  export function syncDeviceMeshDps(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 修改设备名称
   *@error {20001: 'DeviceId is invalid'} | {20021: 'Cannot find service'} | {20077: 'rename device error'}*/
  export function renameDeviceName(params: {
    /** deviceId 设备id */
    deviceId: string
    /** name 设备名称 */
    name: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 重置设备并恢复出厂设置。
   *设备数据会被清除并进入待配网状态。*/
  export function resetFactory(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 移除设备
   *@error {20001: 'DeviceId is invalid'} | {20021: 'Cannot find service'} | {20026: 'Remove device error'}*/
  export function removeDevice(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注册网关子设备监听器*/
  export function registerGateWaySubDeviceListener(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注销网关子设备监听器*/
  export function unregisterGateWaySubDeviceListener(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注册Zigbee网关子设备监听器*/
  export function registerZigbeeGateWaySubDeviceListener(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注销Zigbee网关子设备监听器*/
  export function unregisterZigbeeGateWaySubDeviceListener(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 检查设备某个通道是否在线*/
  export function getDeviceOnlineType(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: {
      /** 设备网络在线类型 */
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
    complete?: () => void
  }): void

  /**
   *@description 获取设备的设备信息*/
  export function getDeviceInfo(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: {
      /** 设备所处房间名 */
      roomName?: string
      /** 产品信息，schema，功能定义都在里面 */
      schema: {}[]
      /**
       * dps
       * 设备的功能点状态，可以根据对应的 dpid 拿到具体的状态值去做业务逻辑
       */
      dps: any
      /**
       * attribute
       * 产品属性定义，在 backend-ng 平台上可查到对应配置，使用二进制位运算的方式进行管理
       */
      attribute: number
      /**
       * baseAttribute
       * 基础产品属性定义
       */
      baseAttribute: number
      /**
       * capability
       * 产品能力值，在 backend-ng 平台上可以查询对应的勾选项，整体业务逻辑会根据该数据进行划分
       * 区分设备类型也可以根据该属性进行调整，按二进制位运算的方式进行管理
       */
      capability: number
      /**
       * dpName
       * 自定义 dp 的名字，通常在面板里会使用到
       */
      dpName: any
      /**
       * ability
       * 目前业务很少使用，用于区分特殊类型的设备
       */
      ability: number
      /**
       * icon
       * 设备的 icon url
       */
      icon: string
      /**
       * devId
       * 设备的唯一 id
       */
      devId: string
      /**
       * verSw
       * 设备固件版本号
       */
      verSw: string
      /**
       * isShare
       * 是否为分享设备，true 则是分享设备
       */
      isShare: boolean
      /**
       * bv
       * 设备的基线版本号
       */
      bv: string
      /**
       * uuid
       * 设备的固件唯一标识
       */
      uuid: string
      /**
       * panelConfig
       * 产品面板里的配置项，通常在 IoT 平台上可以查看到对应的配置
       */
      panelConfig: any
      /**
       * activeTime
       * 设备激活时间，时间戳
       */
      activeTime: number
      /**
       * devAttribute
       * 设备的业务能力拓展，二进制位的方式进行运算
       */
      devAttribute: number
      /**
       * pcc
       * Thing自研蓝牙 mesh 产品的分类标识
       */
      pcc: string
      /**
       * nodeId
       * 子设备的短地址
       */
      nodeId: string
      /**
       * parentId
       * 上级节点 id，子设备/或蓝牙 mesh 设备通常会有该字段，用于内部寻找相关的网关或上级模型来进行业务处理
       */
      parentId?: string
      /**
       * category
       * 产品的分类
       */
      category: string
      /**
       * standSchemaModel
       * 标准产品功能集定义模型
       */
      standSchemaModel?: {}
      /**
       * productId
       * 设备对应的产品 id
       */
      productId: string
      /**
       * productVer
       * 设备对应的产品的版本号
       */
      productVer: string
      /**
       * bizAttribute
       * 业务属性能力
       */
      bizAttribute: number
      /**
       * meshId
       * 当前设备对应的蓝牙 mesh id
       */
      meshId: string
      /**
       * 【废弃】sigmeshId
       * 当前设备所属行业属性对应的蓝牙 mesh id
       */
      sigmeshId: string
      /**
       * meta
       * 设备自定义配置元属性，用于存放业务数据
       */
      meta: any
      /**
       * isLocalOnline
       * 本地局域网是否在线
       */
      isLocalOnline: boolean
      /** 设备云端在线情况 */
      isCloudOnline: boolean
      /**
       * isOnline
       * 设备总的在线情况，只要一个情况在线，就是在线，复合在线情况
       */
      isOnline: boolean
      /**
       * name
       * 设备名称
       */
      name: string
      /** groupId */
      groupId: string
      /**
       * dpCodes
       * 标准功能集 code
       */
      dpCodes: any
      /** 时区信息 */
      devTimezoneId: string
      /** 设备的功能点执行的时间 */
      dpsTime: any
      /** 设备纬度 */
      latitude: string
      /** 设备经度 */
      longitude: string
      /** 设备ip地址 */
      ip?: string
      /** 是否为虚拟设备 */
      isVirtualDevice: boolean
      /** zigbeeInstallCode to the cloud to mark the gateway with installation code ability */
      isZigbeeInstallCode: boolean
      /** Activate sub-device capability flag. */
      protocolAttribute: number
      /** 连接状态，nearby状态 */
      connectionStatus: number
      /** 部分设备需要用mac进行唯一识别 ，比如mesh */
      mac?: string
      /** 蓝牙的设备能力值，由设备进行上报 */
      bluetoothCapability?: string
      /** 是否三方matter设备 */
      isTripartiteMatter: boolean
      /** 是否网关设备 */
      isGW: boolean
      /** 是否支持群组 */
      isSupportGroup: boolean
      /** 是否zigbee子设备 */
      isZigBeeSubDev: boolean
      /** cadv版本号 */
      cadv?: string
      /** 设备是否支持OTA */
      isSupportOTA: boolean
      /** 设备图标 */
      iconUrl: string
      /** 设备是否有Wi-Fi模块 */
      hasWifi: boolean
      /** 快捷控制dp */
      switchDp: number
      /** 快捷控制dp */
      switchDps: number[]
      /** 设备Wi-Fi模块的状态：1:不可用 2:可用 */
      wifiEnableState: number
      /** 设备产品配置 */
      configMetas: any
      /** 是否为matter设备 */
      isMatter: boolean
      /** 设备是否支持双控 */
      isSupportLink: boolean
      /** 是否支持将设备添加到苹果家庭中 */
      isSupportAppleHomeKit?: boolean
      /**
       * attribute 格式化的二进制字符串
       * 产品属性定义，在 backend-ng 平台上可查到对应配置，使用二进制位运算的方式进行管理
       */
      attributeString: string
      /**
       * 设备的扩展模块的类型
       * 0：无扩展模块
       * 1：表示存在扩展模块，即设备为ble+x的设备
       * 2：扩展模块为Wi-Fi模块。即设备为ble+Wi-Fi的设备
       */
      extModuleType: number
      /** mesh设备的relay功能是否开启 */
      isRelayOpen: boolean
      /** mesh设备的proxy功能是否开启 */
      isProxyOpen: boolean
      /** mesh设备是否支持proxy和relay功能 */
      isSupportProxyAndRelay: boolean
      /** 设备大禹通道用户启用状态，0-不启用，1-启用 */
      yuNetState: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 通过设备id队列获取设备的设备信息队列*/
  export function getDeviceListByDevIds(params: {
    /** deviceId 设备ids */
    deviceIds: string[]
    success?: (params: {
      /** 设备信息队列 */
      deviceInfos: DeviceInfo[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取产品信息*/
  export function getProductInfo(params: {
    /** 产品id */
    productId: string
    /** 产品版本号 */
    productVer?: string
    success?: (params: {
      /** 面板配置项，可以在平台进行配置 */
      panelConfig: any
      /** 产品功能定义集合 */
      schema: string
      /** 产品功能定义集合拓展 */
      schemaExt: string
      /**
       * capability
       * 产品能力值，在 backend-ng 平台上可以查询对应的勾选项，整体业务逻辑会根据该数据进行划分
       * 区分设备类型也可以根据该属性进行调整，按二进制位运算的方式进行管理
       */
      capability: number
      /**
       * attribute
       * 产品属性定义，在 backend-ng 平台上可查到对应配置，使用二进制位运算的方式进行管理
       */
      attribute: number
      /**
       * productId
       * 产品 id
       */
      productId: string
      /**
       * category
       * 产品的分类
       */
      category: string
      /**
       * categoryCode
       * 产品的二级分类
       */
      categoryCode: string
      /**
       * standard
       * 是否为标准产品
       */
      standard: boolean
      /**
       * pcc
       * Thing自研蓝牙 mesh 产品的分类标识
       */
      pcc: string
      /**
       * vendorInfo
       * Thing自研蓝牙 mesh 产品的分类标识，融合类使用
       */
      vendorInfo: string
      /**
       * quickOpDps
       * 快捷操作的 dp ids
       */
      quickOpDps: string[]
      /**
       * faultDps
       * 告警/错误的显示 dp ids
       */
      faultDps: string[]
      /**
       * displayDps
       * 快捷操作的 dp ids
       */
      displayDps: string[]
      /**
       * displayMsgs
       * 快捷操作显示文案
       */
      displayMsgs: any
      /**
       * uiPhase
       * ui 包当前环境，预览包或线上包
       */
      uiPhase: string
      /**
       * uiId
       * ui 包唯一包名识别
       */
      uiId: string
      /**
       * uiVersion
       * ui 包版本号
       */
      uiVersion: string
      /**
       * ui
       * ui 小标识
       */
      ui: string
      /**
       * rnFind
       * 是否有包含 RN 包
       */
      rnFind: boolean
      /**
       * uiType
       * ui 包类型
       */
      uiType: string
      /**
       * uiName
       * ui 包名称
       */
      uiName: string
      /**
       * i18nTime
       * 产品语言包最新更新时间
       */
      i18nTime: number
      /**
       * supportGroup
       * 是否支持创建群组
       */
      supportGroup: boolean
      /**
       * supportSGroup
       * 是否支持创建标准群组
       */
      supportSGroup: boolean
      /**
       * configMetas
       * 产品特殊配置项，一些功能业务的特殊配置
       */
      configMetas: any
      /**
       * productVer
       * 产品版本
       */
      productVer: string
      /**
       * attribute 格式化的二进制字符串
       * 产品属性定义，在 backend-ng 平台上可查到对应配置，使用二进制位运算的方式进行管理
       */
      attributeString: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取子设备信息*/
  export function getSubDeviceInfoList(params: {
    /** 网关设备id或上级节点id */
    meshId: string
    success?: (params: DeviceInfo[]) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 判断设备上网类型是否与deviceModel物模型一致*/
  export function validDeviceOnlineType(params: {
    /** 设备id */
    deviceId: string
    /**
     * 设备在线类型，
     * Wi-Fi online             1 << 0
     * Local online             1 << 1
     * Bluetooth LE online      1 << 2
     * Bluetooth LE mesh online 1 << 3
     */
    onlineType: number
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 判断设备上网类型是否与deviceModel物模型一致*/
  export function validDeviceOnline(params: {
    /** 设备id */
    deviceId: string
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 发送 dps
   *@error {20001: 'DeviceId is invalid'} | {20021: 'Cannot find service'} | {20028: 'Publish Dps error'}*/
  export function publishDps(params: {
    /** 设备id */
    deviceId: string
    /** dps */
    dps: any
    /**
     * 下发通道类型
     * 0: 局域网
     * 1: 网络
     * 2: 自动
     */
    mode: number
    /**
     * 下发通道的优先级
     * LAN       = 0, // LAN
     * MQTT      = 1, // MQTT
     * HTTP      = 2, // Http
     * BLE       = 3, // Single Point Bluetooth
     * SIGMesh   = 4, // Sig Mesh
     * BLEMesh   = 5, // Thing Private Mesh
     * BLEBeacon = 6, // Beacon
     */
    pipelines: number[]
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options: any
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 发送 标准dp*/
  export function publishCommands(params: {
    /** 设备id */
    deviceId: string
    /** dps */
    dps: any
    /**
     * 下发通道类型
     * 0: 局域网
     * 1: 网络
     * 2: 自动
     */
    mode: number
    /**
     * 下发通道的优先级
     * LAN       = 0, // LAN
     * MQTT      = 1, // MQTT
     * HTTP      = 2, // Http
     * BLE       = 3, // Single Point Bluetooth
     * SIGMesh   = 4, // Sig Mesh
     * BLEMesh   = 5, // Thing Private Mesh
     * BLEBeacon = 6, // Beacon
     */
    pipelines: number[]
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options: any
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 指定通道发送dps控制指令*/
  export function publishDpsWithPipeType(params: {
    /** 设备id */
    deviceId: string
    /** dps */
    dps: any
    /**
     * 下发通道类型
     * 0: 局域网
     * 1: 网络
     * 2: 自动
     */
    mode: number
    /**
     * 下发通道的优先级
     * LAN       = 0, // LAN
     * MQTT      = 1, // MQTT
     * HTTP      = 2, // Http
     * BLE       = 3, // Single Point Bluetooth
     * SIGMesh   = 4, // Sig Mesh
     * BLEMesh   = 5, // Thing Private Mesh
     * BLEBeacon = 6, // Beacon
     */
    pipelines: number[]
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options: any
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 查询 dps*/
  export function queryDps(params: {
    /** 设备id */
    deviceId: string
    /** dpids 数组 */
    dpIds: number[]
    /** 查询类型 0 */
    queryType?: number
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 【废弃】指定通过 MQTT 通道下发 dps。（若下发其他 mqtt 消息，请使用 `sendMqttMessage`）*/
  export function publishMqttMessage(params: {
    /** 消息内容 */
    message: any
    /** 设备id */
    deviceId: string
    /** 协议号 */
    protocol: number
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options: any
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 通过 MQTT 通道下发消息。*/
  export function sendMqttMessage(params: {
    /** 消息内容 */
    message: any
    /** 设备id */
    deviceId: string
    /** 协议号 */
    protocol: number
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options: any
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 通过 局域网 消息通道下发消息*/
  export function publishLanMessage(params: {
    /** 消息内容 */
    message: string
    /** 设备id */
    deviceId: string
    /** 协议号 */
    protocol: number
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options?: any
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 通过 Socket 消息通道下发消息*/
  export function publishSocketMessage(params: {
    /** 消息内容 */
    message: any
    /** 设备id */
    deviceId: string
    /** 局域网消息 type */
    type: number
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options: any
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备属性*/
  export function getDeviceProperty(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: {
      /** the properties map */
      properties: any
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 设置设备属性*/
  export function setDeviceProperty(params: {
    /** deviceId */
    deviceId: string
    /** the custom data key */
    code: string
    /** the custom data value */
    value: string
    success?: (params: {
      /** deviceId */
      deviceId: string
      /** set DeviceProperty successfully */
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
    complete?: () => void
  }): void

  /**
   *@description 同步设备信息*/
  export function syncDeviceInfo(params: {
    /** 设备id */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 订阅设备移除事件 (430版本之后，请用registerDeviceListListener接口替换)*/
  export function subscribeDeviceRemoved(params: {
    /** 设备id */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 取消订阅设备移除事件 (430版本之后，请用unregisterDeviceListListener接口替换)*/
  export function unSubscribeDeviceRemoved(params: {
    /** 设备id */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注册设备的MQTT信息监听*/
  export function registerMQTTDeviceListener(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注销设备的MQTT信息监听*/
  export function unregisterMQTTDeviceListener(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注册MQTT协议监听*/
  export function registerMQTTProtocolListener(params: {
    /**
     * protocol 协议号
     * MQTT预定义的协议号
     */
    protocol: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注销MQTT协议监听*/
  export function unregisterMQTTProtocolListener(params: {
    /**
     * protocol 协议号
     * MQTT预定义的协议号
     */
    protocol: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注册需要监听的设备列表的监听器*/
  export function registerDeviceListListener(params: {
    /** 需注册的设备列表 */
    deviceIdList: string[]
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注销需要监听的设备列表的监听器*/
  export function unregisterDeviceListListener(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注册需要监听的topci列表 [仅m/m/i topic 订阅]
   *@error {6: 'The parameter format is incorrect'} | {20053: 'Subscribe topic failed'}*/
  export function registerTopicListListener(params: {
    /** 需监听的topic列表 */
    topicList: string[]
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注销需要监听的topic列表
   *@error {20054: 'Unsubscribe topic failed'}*/
  export function unregisterTopicListListener(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取mqtt连接状态  回调返回当前连接情况*/
  export function getMqttConnectState(params?: {
    success?: (params: {
      /**
       * mqtt连接状态
       * 0 连接失败
       * 1 连接成功
       */
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
    complete?: () => void
  }): void

  /**
   *@description 请求dp点的高级能力*/
  export function requestAdvancedCapability(params: {
    /** 设备/群组 id */
    resId: string
    /** dpCodes */
    dpCodes: string[]
    /** 设备："6" 群组："5" */
    type: string
    /** 当前空间id */
    spaceId: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 需要先调用requestAdvancedCapability方法获取高级能力后，才可以调用此方法进行dp数据高级能力转换*/
  export function dpTranslateAdvancedCapability(params: {
    /** 设备/群组 id */
    resId: string
    /** 需要转换的dps */
    dps: OriginalDps[]
    /** 设备："6" 群组："5" */
    type: string
    success?: (params: {
      /** 转换后的高级能力 */
      advancedCapability: TranslateAdvancedCapability[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 低功耗唤醒，调用后监听设备上线*/
  export function wakeUpDevice(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 新低功耗打标设备唤醒方法*/
  export function lowPowerDeviceAwake(params: {
    /** 设备id */
    deviceId: string
    /** 超时时间，传 <= 0 则会使用默认值(10s) */
    timeout: number
    success?: (params: {
      /**
       * 唤醒结果
       * 1: 设备不支持新唤醒流程（内部只会发一包唤醒消息）
       * 2: 设备唤醒成功
       * 3: 设备唤醒超时
       */
      awakeRsp: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 查询设备是否可以进行替换操作*/
  export function queryGatewayReplacementCapabilityDeviceModel(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 查询可以替换的子设备列表*/
  export function fetchReplaceableSubDevicesDeviceModel(params: {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    success?: (params: {
      /** 返回结果 */
      result: string[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 进行子设备替换操作*/
  export function subDeviceReplace(params: {
    /** 故障设备 */
    defaultSubDeviceId: string
    /** 新设备 device id */
    replaceSubDevId: string
    /** 是否删除被替换设备 */
    deleteOriginal: boolean
    /** 超时时间/ms，默认 50s */
    timeout: number
    success?: (params: {
      /** 替换任务的job */
      jobId: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 查询子设备替换结果*/
  export function fetchReplacementOutcomeJobModel(params: {
    /** 故障设备 */
    defaultSubDeviceId: string
    /** job id */
    jobId: string
    success?: (params: {
      /** job Id */
      jobId: number
      /** 触发转移的人 */
      operatorUid: string
      /** 家庭ID */
      groupId: number
      /** 网关ID */
      gwId: string
      /** 目标网关ID(存在故障子设备的网关) */
      existFaultSubDevGwId: string
      /** 故障子设备 */
      faultSubDevId: string
      /** 新子设备 */
      replaceSubDevId: string
      /** 转移类型.1 -> zigbee 同网关; 2 -> zigbee 不同网关 */
      type: number
      /**
       * 当前状态。同网关 mesh 类子设备替换 可选值:
       * Z_S_TRANSFER_TRIGGER			: 第一步 ： zigbee 同网关 转移触发
       * Z_S_DEVICE_SAVE_LOCAL_DATA   : 第二步 ： zigbee同网关子设备替换 设备保存本地数据 成功
       * Z_S_SIGMAX_DATA_UPDATED : 第三步 zigbee同网关子设备替换 定时数据更改
       * Z_S_JUPITER_DATA_UPDATED ： 第四步 zigbee 同网关 联动数据更改
       * Z_S_SUCCESS ： 第五步 成功
       */
      currentStatus: string
      /** 转移结果。0 -> 进行中. -1 失败 1 成功 */
      result: string
      /** 失败原因 */
      failReason: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备详情-设备信息内容
   *设备详情信息接口的数据来源有多个部分，每个数据源的响应时间不定，但总耗时不超过 5 秒，仅部分设备会在 5 秒后返回数据。*/
  export function getDeviceDetailInfo(params: {
    /** 设备id */
    deviceId: string
    success?: (params: {
      /** 设备id */
      deviceId: string
      /** 设备的 ICCID（物联网卡（SIM 卡）的唯一 ID，该参数仅支持 LTE Cat.1 类设备。 */
      iccid: string
      /** 设备的IMEI */
      imei: string
      /** 设备信号强度 */
      netStrength: string
      /** 设备本地 IP 地址 */
      lanIp: string
      /** 设备 IP 地址 */
      ip: string
      /** 设备 Mac 地址 */
      mac: string
      /** 设备时区 */
      timezone: string
      /** 信道号，该参数仅支持 Zigbee 网关。 */
      channel: string
      /**
       * 设备连接方式：
       *   UNKNOWN
       *   PHONE
       *   GATEWAY
       *   PHONE_AND_GATEWAY
       */
      connectAbility: DeviceDetailConnectAbility
      /** 设备的 RSRP（Reference Signal Received Power）值，该参数仅支持 LTE Cat.1 类设备，用于表示该设备网络的信号强度。 */
      rsrp: number
      /** 设备的 Wi-Fi 信号强度 */
      wifiSignal: number
      /** 设备厂商名称，该参数仅支持第三方 Matter 设备。 */
      vendorName: string
      /** 原始meta */
      meta: any
      /** Matter code */
      matterCode: string
      /** Matter QR code */
      matterQRCode: string
      /** homeKit code （iOS特有） */
      homekitCode: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 设备详情 私有云配置项*/
  export function getDeviceDetailCubeConfig(params?: {
    success?: (params: {
      /** 是否支持 */
      isSupport: boolean
      /** 小程序链接 */
      miniAppUrl: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 检查固件升级信息
   *@error {6: 'The parameter format is incorrect'} | {9002: 'Context is invalid'} | {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20021: 'Cannot find service'} | {20022: 'Device model is null'}*/
  export function checkOTAUpdateInfo(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取固件升级信息
   *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'} | {20001: 'DeviceId is invalid'} | {20021: 'Cannot find service'} | {20022: 'Device model is null'}*/
  export function getOTAUpdateInfo(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    /** 直连设备额外信息 */
    extra?: DirectlyDeviceExtraParams[]
    success?: (params: OTAUpdateInfo[]) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转设备详情
   *@error {9002: 'Context is invalid'} | {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'}*/
  export function openDeviceDetailPage(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转群组详情
   *@error {9002: 'Context is invalid'} | {9005: 'can‘t find service'} | {20002: 'GroupId is invalid'} | {20064: 'Group model is null'}*/
  export function openGroupDetailPage(params: {
    /**
     * groupId
     * 群组 id
     */
    groupId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转定时界面
   *@error {6: 'The parameter format is incorrect'} | {9002: 'Context is invalid'} | {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'}*/
  export function openTimerPage(params: {
    /**
     * deviceId
     * 设备 id ，deviceId 和 groupId 至少传一个
     */
    deviceId: string
    /**
     * category
     * 定时分类
     */
    category: string
    /** 注意该字段已废弃 */
    repeat?: number
    /**
     * data
     * dp 数据
     * {
     *      "dpName": dp 点名称，string
     *      "dpId": dp 点 id，string
     *      "selected": dp 点默认值的 index，t.Integer
     *      "rangeKeys": dp 点的值范围，Array<object>
     *      "rangeValues": dp 点的显示数据范围，Array<string>
     * }
     */
    data: {}[]
    /**
     * timerConfig
     * UI配置
     */
    timerConfig?: TimerConfig
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转定时界面
   *@error {6: 'The parameter format is incorrect'} | {9002: 'Context is invalid'} | {9005: 'can‘t find service'} | {20002: 'GroupId is invalid'} | {20064: 'Group model is null'}*/
  export function openGroupTimerPage(params: {
    /**
     * groupId
     * 群组 id
     */
    groupId: string
    /**
     * category
     * 定时分类
     */
    category: string
    /** 注意该字段已废弃 */
    repeat?: number
    /**
     * data
     * dp 数据
     * {
     *      "dpName": dp 点名称，string
     *      "dpId": dp 点 id，string
     *      "selected": dp 点默认值的 index，t.Integer
     *      "rangeKeys": dp 点的值范围，Array<object>
     *      "rangeValues": dp 点的显示数据范围，Array<string>
     * }
     */
    data: {}[]
    /**
     * timerConfig
     * UI配置
     */
    timerConfig?: TimerConfig
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转设备 wifi 网络监测页面
   *@error {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'}*/
  export function openDeviceWifiNetworkMonitorPage(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 同步定时任务
   *@error {6: 'The parameter format is incorrect'} | {9005: 'can‘t find service'} | {20002: 'GroupId is invalid'} | {20005: 'DeviceId and GroupId is invalid'} | {20006: 'Device model and Group model is null'} | {20007: 'Device network error'} | {20022: 'Device model is null'}*/
  export function syncTimerTask(params: {
    /**
     * deviceId
     * 设备 id ，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id ，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * category
     * 定时分类
     */
    category: string
    success?: (params: {
      /**
       * timers
       * 定时列表
       */
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
    complete?: () => void
  }): void

  /**
   *@description 添加定时
   *@error {6: 'The parameter format is incorrect'} | {9005: 'can‘t find service'} | {20002: 'GroupId is invalid'} | {20005: 'DeviceId and GroupId is invalid'} | {20006: 'Device model and Group model is null'} | {20007: 'Device network error'} | {20022: 'Device model is null'}*/
  export function addTimer(params: {
    /**
     * deviceId
     * 设备 id ，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id ，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * category
     * 定时分类
     */
    category: string
    /**
     * timer
     * 添加定时模型
     */
    timer: AddTimerModel
    success?: (params: {
      /**
       * timerId
       * 定时器 id
       */
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
    complete?: () => void
  }): void

  /**
   *@description 更新定时
   *@error {6: 'The parameter format is incorrect'} | {9005: 'can‘t find service'} | {20002: 'GroupId is invalid'} | {20005: 'DeviceId and GroupId is invalid'} | {20006: 'Device model and Group model is null'} | {20007: 'Device network error'} | {20022: 'Device model is null'}*/
  export function updateTimer(params: {
    /**
     * deviceId
     * 设备 id，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * timer
     * 更新定时模型
     */
    timer: UpdateTimerModel
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 更新定时状态
   *@error {6: 'The parameter format is incorrect'} | {9005: 'can‘t find service'} | {20002: 'GroupId is invalid'} | {20005: 'DeviceId and GroupId is invalid'} | {20006: 'Device model and Group model is null'} | {20007: 'Device network error'} | {20022: 'Device model is null'}*/
  export function updateTimerStatus(params: {
    /**
     * deviceId
     * 设备 id，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * timerId
     * 定时 id
     */
    timerId: string
    /**
     * status
     * 状态
     */
    status: boolean
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 删除定时
   *@error {6: 'The parameter format is incorrect'} | {9005: 'can‘t find service'} | {20002: 'GroupId is invalid'} | {20005: 'DeviceId and GroupId is invalid'} | {20006: 'Device model and Group model is null'} | {20007: 'Device network error'} | {20022: 'Device model is null'}*/
  export function removeTimer(params: {
    /**
     * deviceId
     * 设备 id，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * timerId
     * 定时器 id
     */
    timerId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取共享设备信息
   *@error {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'} | {20057: 'Get share device info failed'}*/
  export function getShareDeviceInfo(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: {
      /** 姓名 */
      name: string
      /** 手机号 */
      mobile: string
      /** 邮件 */
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
    complete?: () => void
  }): void

  /**
   *@description 跳转设备编辑页面
   *@error {9001: 'Activity is invalid'} | {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'}*/
  export function openDeviceEdit(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转群组编辑页面
   *@error {9002: 'Context is invalid'} | {9005: 'can‘t find service'} | {20002: 'GroupId is invalid'} | {20064: 'Group model is null'}*/
  export function openGroupEdit(params: {
    /**
     * groupId
     * 设备 id
     */
    groupId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转设备信息页面
   *@error {9002: 'Context is invalid'} | {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'}*/
  export function openDeviceInfo(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 设备是否支持离线提醒
   *@error {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'} | {20059: 'Get device offline reminder support failed'}*/
  export function isDeviceSupportOfflineReminder(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: {
      /**
       * support
       * 是否支持设备离线提醒
       */
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
    complete?: () => void
  }): void

  /**
   *@description 获取设备离线提醒的开关状态
   *@error {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'} | {20060: 'Get device offline reminder state failed'}*/
  export function getDeviceOfflineReminderState(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: {
      /**
       * state
       * 设备离线提醒的开关状态 0:关 1:开
       */
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
    complete?: () => void
  }): void

  /**
   *@description 离线提醒开关
   *@error {6: 'The parameter format is incorrect'} | {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'} | {20061: 'Toggle device offline reminder failed'}*/
  export function toggleDeviceOfflineReminder(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    /**
     * state
     * 设备离线提醒的开关状态 0:关 1:开
     */
    state: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取离线提醒警告内容（关闭离线提醒开关后的警告）
   *@error {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20074: 'Get device offline reminder warning text failed'}*/
  export function getDeviceOfflineReminderWarningText(params?: {
    success?: (params: {
      /** 离线提醒关闭警告文案 */
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
    complete?: () => void
  }): void

  /**
   *@description 跳转常见问题与反馈页面
   *@error {9001: 'Activity is invalid'} | {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'}*/
  export function openDeviceQuestionsAndFeedback(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转共享设备页面
   *@error {9001: 'Activity is invalid'} | {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'}*/
  export function openShareDevice(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 添加设备到桌面
   *@error {7: 'API Internal processing failed'} | {9001: 'Activity is invalid'} | {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'}*/
  export function addDeviceToDesk(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 移除共享设备
   *@error {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'} | {20058: 'Remove received shared device failed'}*/
  export function removeShareDevice(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备支持的三方服务
   *@error {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'} | {20072: 'Get supported third party services failed'}*/
  export function getSupportedThirdPartyServices(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: {
      /** 服务列表 */
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
    complete?: () => void
  }): void

  /**
   *@description 获取设备详情App侧配置信息*/
  export function getDeviceDetailConfiguration(params?: {
    success?: (params: {
      /** 定制业务配置项 */
      customConfiguration: {}[]
      /** 有实现的子功能列表 */
      hasImplFunctionList: string[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 分发设备详情子功能事件*/
  export function dispatchSubFunctionTouchEvent(params: {
    /** 子功能id */
    id: string
    /** 名称 */
    name?: string
    /** 子功能显示类型 */
    type?: string
    /** 子功能分组类型 */
    optionType?: string
    /** 子功能来源：RN｜小程序｜APP */
    from?: string
    /** 排序 */
    order?: number
    /** 是否隐藏 */
    isHide?: boolean
    /** 业务参数 */
    data?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 分发子功能数据结果*/
  export function dispatchDataResult(params: {
    /** 子功能id */
    id: string
    /** 名称 */
    name?: string
    /** 子功能显示类型 */
    type?: string
    /** 子功能分组类型 */
    optionType?: string
    /** 子功能来源：RN｜小程序｜APP */
    from?: string
    /** 排序 */
    order?: number
    /** 是否隐藏 */
    isHide?: boolean
    /** 业务参数 */
    data?: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 设备详情子功能显示状态
   *@deprecated 方法已停止维护，请谨慎使用。*/
  export function getSubFunctionShowState(params: {
    /** 需要获取显示状态的子功能Id */
    ids: string[]
    /** 设备Id */
    deviceId?: string
    /** 群组Id */
    groupId?: number
    success?: (params: {
      /** 需要监听的子功能列表 */
      showStateList: SubFunctionShowState[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取子功能额外的显示数据
   *注意：该接口只供设备详情小程序使用。涵盖的子功能有：连云激活、定位服务、展示遥控器。
   *@error {7: 'API Internal processing failed'} | {20021: 'Cannot find service'} | {20022: 'Device model is null'} | {20064: 'Group model is null'}*/
  export function getSubFunctionExtShowData(params: {
    /** 子功能id */
    id: string
    /** 查询参数 / 返回的数据 */
    data?: any
    success?: (params: {
      /** 子功能id */
      id: string
      /** 查询参数 / 返回的数据 */
      data?: any
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取远程重启定时
   *@error {20001: 'DeviceId is invalid'} | {20007: 'Device network error'} | {20022: 'Device model is null'}*/
  export function getRemoteRebootTimers(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: {
      /** 定时列表 */
      timers: RemoteRebootTimers[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 打开推荐场景详情页面*/
  export function openRecommendSceneDetail(params: {
    /** 来源 */
    source: string
    /** 场景模型 */
    sceneModel: any
    success?: (params: {
      /** 返回状态，默认返回 true */
      status?: boolean
      /** 成功返回的类型。0-未操作，1-保存成功，2-点击不感兴趣 */
      type: number
      /** 返回的场景数据，可能为空 */
      data?: any
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转一键执行和自动化页面*/
  export function openDeviceExecutionAndAnutomation(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    /** 页面标题，Android 需要 */
    title?: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 保存场景动作数据*/
  export function saveSceneAction(params: {
    /** 设备id */
    deviceId: string
    /** 动作的索引位置 */
    taskPosition: number
    /** 动作执行器 */
    actionExecutor?: string
    /** 动作执行信息 */
    executorProperty: any
    /** 动作额外信息 */
    extraProperty: any
    /** 动作展示信息 */
    actionDisplayNew: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 创建自动化动作*/
  export function createAction(params: {
    /**
     * 动作类型:device,smart,remind,delay
     * device:设备
     * smart:操作某个智能（执行智能、开关自动化）
     * remind:提醒
     * delay:延时
     */
    createType: string
    /**
     * 智能类型：scene,auto
     * scene:一键执行
     * auto：自动化
     */
    smartType: string
    /** 当前场景动作列表 */
    actionArray: SceneAction[]
    success?: (params: {
      /** 动作列表 */
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
    complete?: () => void
  }): void

  /**
   *@description 编辑场景动作*/
  export function editAction(params: {
    /** 当前编辑的actionIndex */
    editIndex: string
    /** 智能类型 */
    smartType: string
    /** 动作列表 */
    actionArray: SceneAction[]
    success?: (params: {
      /** 动作列表 */
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
    complete?: () => void
  }): void

  /**
   *@description 展示场景的风格弹窗*/
  export function showSceneDialog(params?: {
    /**
     * 智能类型：scene,auto
     * scene:一键执行
     * auto：自动化
     */
    smartType?: string
    /** 颜色 */
    color?: string
    /** 图标 */
    icon?: string
    /** 图片 */
    image?: string
    success?: (params: {
      /** 颜色 */
      color?: string
      /** 图标 */
      icon?: string
      /** 图片 */
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
    complete?: () => void
  }): void

  /**
   *@description 打开生效时间段页面*/
  export function openPreConditionPage(params?: {
    /** id */
    id?: string
    /** 固定值 timeCheck */
    condType?: string
    /** 规则 */
    expr?: Expr
    success?: (params: {
      /** id */
      id: string
      /** 固定值 timeCheck */
      condType: string
      /** 规则 */
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
    complete?: () => void
  }): void

  /**
   *@description 创建条件*/
  export function createCondition(params: {
    /** 条件类型 */
    type: string
    /** 条件内容 */
    condition?: string
    /** 索引 */
    index?: number
    success?: (params: {
      /** 条件类型 */
      type?: string
      /** 条件内容 */
      condition?: string
      /** 索引 */
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
    complete?: () => void
  }): void

  /**
   *@description 编辑条件*/
  export function editCondition(params: {
    /** 条件类型 */
    type: string
    /** 条件内容 */
    condition?: string
    /** 索引 */
    index?: number
    success?: (params: {
      /** 条件类型 */
      type?: string
      /** 条件内容 */
      condition?: string
      /** 索引 */
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
    complete?: () => void
  }): void

  /**
   *@description 判断设备或者群组是否支持分享*/
  export function checkSupportShare(params: {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    success?: (params: {
      /**
       * support
       * 是否支持分享
       */
      support: boolean
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备或者群组的剩余分享次数*/
  export function getRemainingShareTimes(params: {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    success?: (params: {
      /**
       * times
       * 剩余分享次数，-1表示无限制
       */
      times: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 添加被分享者*/
  export function addReceiver(params: {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * spaceId
     * 空间id, 也就是家庭id
     */
    spaceId: number
    /**
     * userAccount
     * 用户的账号
     */
    userAccount: string
    success?: (params: {
      /**
       * memberId
       * 用户关系id
       */
      memberId: number
      /**
       * nickName
       * 用户的昵称
       */
      nickName: string
      /**
       * userName
       * 用户的手机号或者邮箱
       */
      userName: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 移除被分享者*/
  export function removeReceiver(params: {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取被分享者列表*/
  export function getReceivers(params: {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * page
     * 分页, based 1, 只对设备有效，群组会返回全部数据
     */
    page: number
    /**
     * pageSize
     * 分页大小, 只对设备有效，群组会返回全部数据
     */
    pageSize: number
    success?: (params: {
      /**
       * receivers
       * 被分享者
       */
      receivers: Receiver[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 更新分享有效期*/
  export function updateShareExpirationDate(params: {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    /**
     * shareMode
     * 分享模式, 0永久有效, 1一段时间有效, 只对设备分享起作用
     */
    shareMode: number
    /**
     * endTime
     * 分享结束时间, 单位毫秒, 只对设备分享起作用
     */
    endTime: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取最近分享过的用户*/
  export function getRelationMembers(params?: {
    success?: (params: {
      /**
       * members
       * 最近分享过的被分享者
       */
      members: Member[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 移除最近的分享者*/
  export function removeRelationMember(params: {
    /**
     * uid
     * 用户id
     */
    uid: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 创建分享码, 只支持设备，不支持群组*/
  export function createShareInfo(params: {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * spaceId
     * 空间id, 也就是家庭id
     */
    spaceId: number
    /**
     * shareType
     * 分享类型 0账号 1QQ 2微信 3消息 4邮件 5复制 6更多 7联系人
     */
    shareType: number
    /**
     * shareCount
     * 分享数量
     */
    shareCount: number
    success?: (params: {
      /**
       * content
       * 分享内容
       */
      content: string
      /**
       * code
       * 分享码
       */
      code: string
      /**
       * shortUrl
       * 短链
       */
      shortUrl: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 验证分享码*/
  export function validateShareCode(params: {
    /**
     * code
     * 分享码
     */
    code: string
    success?: (params: {
      /**
       * result
       * 是否有效
       */
      result: boolean
      /** 元数据 */
      originResult: any
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取分享码信息*/
  export function getShareCodeInfo(params: {
    /**
     * code
     * 分享码
     */
    code: string
    success?: (params: {
      /**
       * appId
       * app的id
       */
      appId: string
      /**
       * resId
       * 设备id 或者 群组id
       */
      resId: string
      /**
       * resType
       * 资源类型, 1是设备, 2是群组
       */
      resType: number
      /**
       * resIcon
       * 设备或者群组的图标
       */
      resIcon: string
      /**
       * resName
       * 设备或者群组的名称
       */
      resName: string
      /**
       * nickName
       * 分享者的名称
       */
      nickName: string
      /**
       * shareSource
       * 分享来源 0账号 1QQ 2微信 3消息 4邮件 5复制 6更多 7联系人
       */
      shareSource: number
      /**
       * spaceId
       * 空间id,也就是家庭id
       */
      spaceId: number
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 接受分享邀请*/
  export function acceptShareInvite(params: {
    /**
     * code
     * 分享码
     */
    code: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 移除接收到的分享设备或者群组*/
  export function removeReceivedDeviceOrGroup(params: {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取分享者*/
  export function getSharers(params?: {
    success?: (params: {
      /**
       * sharers
       * 分享者列表
       */
      sharers: Sharer[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备或者群组分享者的名称*/
  export function getSharerNameOfDeviceOrGroup(params: {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    success?: (params: {
      /**
       * userName
       * 用户的手机号或者邮箱
       */
      userName: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取分享者详情*/
  export function getSharerDetail(params: {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    success?: (params: {
      /**
       * memberId
       * 用户关系id
       */
      memberId: number
      /**
       * account
       * 账号
       */
      account: string
      /**
       * name
       * 昵称
       */
      name: string
      /**
       * remarkName
       * 备注
       */
      remarkName: string
      /**
       * devices
       * 分享者共享的设备列表
       */
      devices: SharerDevice[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 删除分享者*/
  export function removeSharer(params: {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 更新分享者昵称*/
  export function updateSharer(params: {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    /**
     * name
     * 用户的昵称
     */
    name: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取群组下设备列表
   *@error {20002: 'GroupId is invalid'}*/
  export function getGroupDeviceList(params: {
    /** 群组id */
    groupId: string
    success?: (params: {
      /** groupId 群组id */
      groupId: string
      /** deviceList 设备列表 */
      deviceList: DeviceInfo_YFvMov[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取群组下设备数量
   *@error {20002: 'GroupId is invalid'}*/
  export function getGroupDeviceNum(params: {
    /** 群组id */
    groupId: string
    success?: (params: {
      /** groupId 群组id */
      groupId: string
      /** deviceNum 设备数量 */
      deviceNum: number
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
    complete?: () => void
  }): void

  /**
   *@description 根据dpCode获取群组下具备此dpCode的设备数量。如果是一个分享的群组，请通过接口获取。
   *@error {20002: 'GroupId is invalid'} | {20078: 'dp code invalid'} | {20079: 'Error obtaining the number of devices in the group'}*/
  export function getDeviceNumWithDpCode(params: {
    /** groupId 群组id */
    groupId: string
    /** dpCode内容 */
    dpCode: string
    success?: (params: {
      /** groupId 群组id */
      groupId: string
      /** deviceNum 设备数量 */
      deviceNum: number
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
    complete?: () => void
  }): void

  /**
   *@description 通过dpCode下发控制指令
   *@error {20002: 'GroupId is invalid'} | {20064: 'Group model is null'} | {20066: 'Publish group dps failed'}*/
  export function publishGroupDpCodes(params: {
    /** groupId 群组id */
    groupId: string
    /**
     * dp信息
     * 示例: dpCodes: {"switch" : true}
     */
    dpCodes: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description mesh群组控制（仅用于单设备面板中的群控，如PIR传感器面板）
   *@error {6: 'The parameter format is incorrect'} | {20064: 'Group model is null'} | {20080: 'publish sigMesh multiDps error'}*/
  export function publishSigMeshMultiDps(params: {
    /** groupId 群组id */
    groupId: string
    /** localId 群组本地标识 */
    localId: string
    /**
     * dp信息
     * 示例: dps: {"1" : true}
     */
    dps: any
    /** pcc mesh设备品类 */
    pcc: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 跳转本地mesh群组
   *@error {6: 'The parameter format is incorrect'} | {9001: 'Activity is invalid'} | {20021: 'Cannot find service'}*/
  export function openMeshLocalGroup(params: {
    /**
     * 整体说明
     * 支持2个版本:
     * 1、本地版本仅支持根据vendorIds进行过滤，为本地逻辑，设备列表APP本地根据meshCategory进行比对过滤，群组结果保存在设备上，云端不参与群组的列表获取与保存。
     * 2、云端版本支持根据pccs或者codes进行过滤，为云端逻辑，设备列表获取及群组设备关系保存在云端。
     * 本地版本参数：
     * {
     * "localId": "203a",
     * "vendorIds": "1F10,2F10"
     * }
     * 云端版本参数：
     * 1、pcc过滤，相当于旧版本的vendorIds
     * {
     * "localId": "203a",
     * "type": "0",
     * "pccs":  ["1210"],
     * "categoryCode": "7001"
     * }
     * 2、code过滤，根据二级品类进行过滤，目前云端只支持ykq和gykzq这两种遥控器
     * {
     * "localId": "203a",
     * "type": "1",
     * "codes": ["xxxx"],
     * "categoryCode": "7001"
     * }
     * 关于categoryCode：categoryCode  并非三级品类，与localId匹配范围为7001-7008；localId 为云端分配，步长为8，因此一个遥控器内部最多支持关联8个群组，localid为初始值依次+1，与之匹配的categoryCode从7001依次+1.
     * vendorIds 必传 可以为空字符串
     * devId 遥控器设备id
     */
    deviceId: string
    /** localId 群组本地标识 */
    localId: string
    /**
     * 遥控器群组本地版本，使用功能此参数，云端版本传空字符串
     * vendorIds 使用meshCategory进行设备列表筛选
     * 示例：vendorIds: "1F10,2F10"
     */
    vendorIds: string
    /**
     * 遥控器群组云端版本，使用此功能参数
     * type 筛选条件  0:pccs过滤，1：codes过滤
     */
    type?: string
    /**
     * 遥控器群组云端版本，使用此功能参数
     * pccs 使用meshCategory进行设备列表筛选
     * 示例：pccs: ["1F10","2F10"]
     */
    pccs?: string[]
    /**
     * 遥控器群组云端版本，使用此功能参数
     * codes 使用二级品类进行设备列表筛选
     * 示例：pccs: ["1F10","2F10"]
     */
    codes?: string[]
    /**
     * categoryCode  并非三级品类，与localId匹配范围为7001-7008；
     * localId 为云端分配，步长为8，因此一个遥控器内部最多支持关联8个群组，localid为初始值依次+1，与之匹配的categoryCode从7001依次+1.
     */
    categoryCode?: string
    /**
     * 是否支持低功耗,部分无线开关需要用到
     * 默认值:false
     */
    isSupportLowPower?: boolean
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取 group 信息*/
  export function getGroupInfo(params: {
    /** 群组id */
    groupId: string
    success?: (params: {
      /**
       * groupId
       * The group ID.
       */
      groupId: string
      /**
       * productId
       * The product ID.
       */
      productId: string
      /**
       * name
       * The name of the group.
       */
      name: string
      /**
       * time
       * The time when the group was created.
       */
      time: number
      /**
       * iconUrl
       * The URL of the icon.
       */
      iconUrl: string
      /**
       * type
       * The type of group.
       * Wifi = 0, Mesh = 1, Zigbee = 2, SIGMesh = 3, Beacon = 4,
       */
      type: number
      /** isShare */
      isShare: boolean
      /** dps */
      dps: {}
      /** dpCodes */
      dpCodes: {}
      /**
       * deviceNum
       * The number of devices,
       */
      deviceNum: number
      /**
       * localKey
       * The local key.
       */
      localKey: string
      /** The protocol version. */
      pv: number
      /** The product information. */
      productInfo: {}
      /** The custom DP name. */
      dpName: {}
      /** The device list. */
      deviceList: DeviceInfo_YFvMov[]
      /** The local short address of groups. */
      localId: string
      /** The subclass. */
      pcc: string
      /** The mesh ID or gateway ID. */
      meshId: string
      /** Add the beacon beaconKey. */
      groupKey: string
      /** The schema array. */
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
    complete?: () => void
  }): void

  /**
   *@description 批量获取 group 信息*/
  export function getGroupInfoList(params: {
    /** groupIdList 群组id 列表 */
    groupIdList: string[]
    success?: (params: {
      /** group info 列表 */
      groupInfoList: GroupInfo[]
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 群组控制*/
  export function publishGroupDps(params: {
    /** groupId 群组id */
    groupId: string
    /**
     * dp信息
     * 示例: dps: {"1" : true}
     */
    dps: {}
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取群组的属性*/
  export function getGroupProperty(params: {
    /** 群组id */
    groupId: string
    success?: (params: {
      /** 群组属性信息 */
      result: any
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 设置群组的属性*/
  export function setGroupProperty(params: {
    /** 群组id */
    groupId: string
    /** code 属性code */
    code: string
    /** value */
    value: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 开启对群组事件的监听*/
  export function registerGroupChange(params: {
    /** groupIdList 群组id 列表 */
    groupIdList: string[]
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 关闭对群组事件的监听*/
  export function unRegisterGroupChange(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取是否展示加入Matter按钮*/
  export function checkCanJoinMatter(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取家庭下可用Matter网关列表*/
  export function fetchAvailableMatterGatewayList(params: {
    /**
     * spaceId
     * 家庭Id
     */
    spaceId: string
    success?: (params: AvailableGatewayModel[]) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取是否展示Matter分享入口*/
  export function checkShowMatterMutilpleShare(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 让Matter设备再次进入Matter配网状态*/
  export function changeDeviceAdvMatterState(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: {
      /**
       * matterCode
       * matterCode 配网码
       */
      matterCode: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 将Matter设备配入HomeKit*/
  export function pairDeviceIntoHomeKit(params: {
    /**
     * matterCode
     * matterCode 配网码
     */
    matterCode: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 将Matter设备配入涂鸦体系，需要配网码和涂鸦网关ID*/
  export function pairMatterDevice(params: {
    /**
     * matterCode
     * matterCode 配网码
     */
    matterCode: string
    /**
     * gwID
     * gwID 网关ID,必传
     */
    gwID: string
    /**
     * spaceID
     * spaceID 家庭ID,必传
     */
    spaceID: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 停止Matter设备配入涂鸦体系的行为(仅pairMatterDevice方法取消时需要调用)*/
  export function cancelMatterActivator(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 通过nodeId获取子设备的设备Id*/
  export function getMeshDeviceId(params: {
    /** nodeId */
    nodeId: string
    /** deviceId 网关id */
    deviceId: string
    success?: (params: {
      /** 设备id */
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
    complete?: () => void
  }): void

  /**
   *@description 通过nodeId Hex 获取子设备的设备Id*/
  export function getMeshDeviceIdHex(params: {
    /** nodeId */
    nodeId: string
    /** deviceId 网关id */
    deviceId: string
    success?: (params: {
      /** 设备id */
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
    complete?: () => void
  }): void

  /**
   *@description 获取mesh子子设备的dp数据*/
  export function getDpDataByMesh(params: {
    /** 设备模型 设备id */
    deviceId: string
    /** dpId */
    dpIds: Object[]
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备的固件版本状态(即将废弃，请使用otaStatus)
   *@error {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'} | {20063: 'Check ota upgrade status failed'}*/
  export function checkOTAUpgradeStatus(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: {
      /**
       * status
       * 设备的固件版本状态 0已是最新版本、1有待升级的固件、2正在升级
       */
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
    complete?: () => void
  }): void

  /**
   *@description 获取设备的固件版本状态
   *@error {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'} | {20063: 'Check ota upgrade status failed'}*/
  export function otaStatus(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: {
      /**
       * status
       * 设备的固件版本状态 0已是最新版本、1有待升级的固件、2正在升级、3成功、4失败、5等待唤醒、6下载、7超时、13排队中、100准备中
       */
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
    complete?: () => void
  }): void

  /**
   *@description 跳转设备升级页面
   *@error {9005: 'can‘t find service'} | {20001: 'DeviceId is invalid'} | {20022: 'Device model is null'}*/
  export function openOTAUpgrade(params: {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 注册ota升级监听*/
  export function registerOTACompleted(params?: {
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 设备是否支持物模型*/
  export function deviceIsSupportThingModel(params: {
    /** 设备id */
    devId: string
    success?: (params: {
      /** 是否支持物模型控制 */
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
    complete?: () => void
  }): void

  /**
   *@description 更新物模型信息*/
  export function updateDeviceThingModelInfo(params: {
    /** 产品id */
    pid: string
    /** 产品版本号 */
    productVersion: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 获取设备物模型信息*/
  export function getDeviceThingModelInfo(params: {
    /** 设备id */
    devId: string
    success?: (params: {
      /** 物模型id */
      modelId: string
      /** 产品id */
      productId: string
      /** 产品版本 */
      productVersion: string
      /** 服务列表 */
      services: ServiceModel[]
      /** 扩展属性 */
      extensions: any
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 通过物模型投递消息*/
  export function publishThingModelMessage(params: {
    /** 设备id */
    devId: string
    /**
     * 类型
     * 0:属性, 1:动作, 2:事件
     */
    type: number
    /**
     * Example:
     * type == property:
     *     payload = {
     *      "color":"green",
     *         "brightness": 50
     *      }
     * type == action:
     *     payload = {
     *        "actionCode": "testAction",
     *        "inputParams": {
     *          "inputParam1":"value1",
     *          "inputParam2":"value2"
     *        }
     *     }
     */
    payload: any
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 订阅接受物模型消息。订阅之后才可以接收到onReceivedThingModelMessage事件。*/
  export function subscribeReceivedThingModelMessage(params: {
    /** 设备id */
    devId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 取消订阅接收物模型消息。取消订阅之后接收不到onReceivedThingModelMessage事件。*/
  export function unSubscribeReceivedThingModelMessage(params: {
    /** 设备id */
    devId: string
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 初始化虚拟设备
   *@error {5: 'The necessary parameters are missing'} | {7: 'API Internal processing failed'} | {30001: 'atop request error'}*/
  export function initVirtualDevice(params: {
    /** 产品id */
    pid: string
    success?: (params: {
      /** 设备id */
      devId: string
    }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 远离beacon设备的事件*/
  export function onLeaveBeaconFence(
    listener: (params: LeaveBeaconFenceEvent) => void
  ): void

  /**
   *@description 移除监听：远离beacon设备的事件*/
  export function offLeaveBeaconFence(
    listener: (params: LeaveBeaconFenceEvent) => void
  ): void

  /**
   *@description 传输文件的到蓝牙设备的进度事件*/
  export function onFileTransferProgress(
    listener: (params: FileTransferProgressResult) => void
  ): void

  /**
   *@description 移除监听：传输文件的到蓝牙设备的进度事件*/
  export function offFileTransferProgress(
    listener: (params: FileTransferProgressResult) => void
  ): void

  /**
   *@description BLE(thing)连接状态变更通知事件*/
  export function onBLEConnectStatusChange(
    listener: (params: ThingBLEConnectStatusEvent) => void
  ): void

  /**
   *@description 移除监听：BLE(thing)连接状态变更通知事件*/
  export function offBLEConnectStatusChange(
    listener: (params: ThingBLEConnectStatusEvent) => void
  ): void

  /**
   *@description BLE(thing)设备数据透传通道上报通知*/
  export function onBLETransparentDataReport(
    listener: (params: ThingBLETransparentDataBean) => void
  ): void

  /**
   *@description 移除监听：BLE(thing)设备数据透传通道上报通知*/
  export function offBLETransparentDataReport(
    listener: (params: ThingBLETransparentDataBean) => void
  ): void

  /**
   *@description BLE(thing)大数据通道传输进度*/
  export function onBLEBigDataChannelProgressEvent(
    listener: (params: ThingBLEBigDataProgressEvent) => void
  ): void

  /**
   *@description 移除监听：BLE(thing)大数据通道传输进度*/
  export function offBLEBigDataChannelProgressEvent(
    listener: (params: ThingBLEBigDataProgressEvent) => void
  ): void

  /**
   *@description 扫描到设备后进行通知*/
  export function onBLEScanBindDevice(
    listener: (params: ThingBLEScanDeviceEvent) => void
  ): void

  /**
   *@description 移除监听：扫描到设备后进行通知*/
  export function offBLEScanBindDevice(
    listener: (params: ThingBLEScanDeviceEvent) => void
  ): void

  /**
   *@description 大数据从设备传输到App成功的事件*/
  export function onBLEBigDataChannelDeviceToAppSuccess(
    listener: (params: BLEBigDataChannelDeviceToAppSuccessResponse) => void
  ): void

  /**
   *@description 移除监听：大数据从设备传输到App成功的事件*/
  export function offBLEBigDataChannelDeviceToAppSuccess(
    listener: (params: BLEBigDataChannelDeviceToAppSuccessResponse) => void
  ): void

  /**
   *@description 大数据上传到云端进度的事件*/
  export function onBLEBigDataChannelUploadCloudProgress(
    listener: (params: ThingBLEBigDataProgressEvent) => void
  ): void

  /**
   *@description 移除监听：大数据上传到云端进度的事件*/
  export function offBLEBigDataChannelUploadCloudProgress(
    listener: (params: ThingBLEBigDataProgressEvent) => void
  ): void

  /**
   *@description 扫描到蓝牙通信棒后进行通知*/
  export function onBLECommRodScanDevice(
    listener: (params: CommRodScanDeviceEvent) => void
  ): void

  /**
   *@description 移除监听：扫描到蓝牙通信棒后进行通知*/
  export function offBLECommRodScanDevice(
    listener: (params: CommRodScanDeviceEvent) => void
  ): void

  /**
   *@description 连接到设备后进行通知*/
  export function onBLECommRodConnectStatusChange(
    listener: (params: CommRodConnectStatusEvent) => void
  ): void

  /**
   *@description 移除监听：连接到设备后进行通知*/
  export function offBLECommRodConnectStatusChange(
    listener: (params: CommRodConnectStatusEvent) => void
  ): void

  /**
   *@description 设备schema更新通知*/
  export function onBLECommRodSchemaUpload(
    listener: (params: CommRodSchemaUploadEvent) => void
  ): void

  /**
   *@description 移除监听：设备schema更新通知*/
  export function offBLECommRodSchemaUpload(
    listener: (params: CommRodSchemaUploadEvent) => void
  ): void

  /**
   *@description 设备dps更新通知*/
  export function onBLECommRodDpsChange(
    listener: (params: CommRodDpsChangeEvent) => void
  ): void

  /**
   *@description 移除监听：设备dps更新通知*/
  export function offBLECommRodDpsChange(
    listener: (params: CommRodDpsChangeEvent) => void
  ): void

  /**
   *@description 子设备配网结果事件*/
  export function onSubDeviceInfoUpdateEvent(
    listener: (params: GWActivationRespond) => void
  ): void

  /**
   *@description 移除监听：子设备配网结果事件*/
  export function offSubDeviceInfoUpdateEvent(
    listener: (params: GWActivationRespond) => void
  ): void

  /**
   *@description 免配网-设备扫描结果事件*/
  export function onDirectlyConnectedSearchDeviceEvent(
    listener: (params: DirectlyConnectedSearchRespond) => void
  ): void

  /**
   *@description 移除监听：免配网-设备扫描结果事件*/
  export function offDirectlyConnectedSearchDeviceEvent(
    listener: (params: DirectlyConnectedSearchRespond) => void
  ): void

  /**
   *@description dp点变更*/
  export function onDpDataChange(listener: (params: DpsChanged) => void): void

  /**
   *@description 移除监听：dp点变更*/
  export function offDpDataChange(listener: (params: DpsChanged) => void): void

  /**
   *@description MQTT消息通道消息上报*/
  export function onMqttMessageReceived(
    listener: (params: MqttResponse) => void
  ): void

  /**
   *@description 移除监听：MQTT消息通道消息上报*/
  export function offMqttMessageReceived(
    listener: (params: MqttResponse) => void
  ): void

  /**
   *@description socket消息通道消息上报*/
  export function onSocketMessageReceived(
    listener: (params: SocketResponse) => void
  ): void

  /**
   *@description 移除监听：socket消息通道消息上报*/
  export function offSocketMessageReceived(
    listener: (params: SocketResponse) => void
  ): void

  /**
   *@description 设备上下线状态变更*/
  export function onDeviceOnlineStatusUpdate(
    listener: (params: Online) => void
  ): void

  /**
   *@description 移除监听：设备上下线状态变更*/
  export function offDeviceOnlineStatusUpdate(
    listener: (params: Online) => void
  ): void

  /**
   *@description 设备信息变化*/
  export function onDeviceInfoUpdated(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 移除监听：设备信息变化*/
  export function offDeviceInfoUpdated(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 子设备替换结果*/
  export function onSubDeviceReplaceResult(
    listener: (params: SubDevReplaceResult) => void
  ): void

  /**
   *@description 移除监听：子设备替换结果*/
  export function offSubDeviceReplaceResult(
    listener: (params: SubDevReplaceResult) => void
  ): void

  /**
   *@description 设备移除事件*/
  export function onDeviceRemoved(
    listener: (params: OnDeviceRemovedBody) => void
  ): void

  /**
   *@description 移除监听：设备移除事件*/
  export function offDeviceRemoved(
    listener: (params: OnDeviceRemovedBody) => void
  ): void

  /**
   *@description mqtt连接状态变化事件*/
  export function onMqttConnectState(
    listener: (params: MqttConnectStateResponse) => void
  ): void

  /**
   *@description 移除监听：mqtt连接状态变化事件*/
  export function offMqttConnectState(
    listener: (params: MqttConnectStateResponse) => void
  ): void

  /**
   *@description 网关子设备dp信息变化事件*/
  export function onSubDeviceDpUpdate(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 移除监听：网关子设备dp信息变化事件*/
  export function offSubDeviceDpUpdate(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 网关子设备被移除事件*/
  export function onSubDeviceRemoved(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 移除监听：网关子设备被移除事件*/
  export function offSubDeviceRemoved(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 网关添加子设备的事件*/
  export function onSubDeviceAdded(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 移除监听：网关添加子设备的事件*/
  export function offSubDeviceAdded(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 网关子设备信息变化的事件*/
  export function onSubDeviceInfoUpdate(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 移除监听：网关子设备信息变化的事件*/
  export function offSubDeviceInfoUpdate(
    listener: (params: Device_fUC2mh) => void
  ): void

  /**
   *@description 定时变化事件*/
  export function onTimerUpdate(listener: (params: {}) => void): void

  /**
   *@description 移除监听：定时变化事件*/
  export function offTimerUpdate(listener: (params: {}) => void): void

  /**
   *@description 子功能数据变化事件*/
  export function onSubFunctionDataChange(
    listener: (params: SubFunctionParams) => void
  ): void

  /**
   *@description 移除监听：子功能数据变化事件*/
  export function offSubFunctionDataChange(
    listener: (params: SubFunctionParams) => void
  ): void

  /**
   *@description 子功能分发事件*/
  export function onDispatchEvent(
    listener: (params: SubFunctionParams) => void
  ): void

  /**
   *@description 移除监听：子功能分发事件*/
  export function offDispatchEvent(
    listener: (params: SubFunctionParams) => void
  ): void

  /**
   *@description 群组内增加/移除设备事件*/
  export function onGroupInfoChange(
    listener: (params: GroupInfoResponse) => void
  ): void

  /**
   *@description 移除监听：群组内增加/移除设备事件*/
  export function offGroupInfoChange(
    listener: (params: GroupInfoResponse) => void
  ): void

  /**
   *@description 群组dpCode变化事件*/
  export function onGroupDpCodeChange(
    listener: (params: GroupDpCodeBean) => void
  ): void

  /**
   *@description 移除监听：群组dpCode变化事件*/
  export function offGroupDpCodeChange(
    listener: (params: GroupDpCodeBean) => void
  ): void

  /**
   *@description 群组移除事件*/
  export function onGroupRemovedEvent(
    listener: (params: GroupBean) => void
  ): void

  /**
   *@description 移除监听：群组移除事件*/
  export function offGroupRemovedEvent(
    listener: (params: GroupBean) => void
  ): void

  /**
   *@description 群组DP变更事件*/
  export function onGroupDpDataChangeEvent(
    listener: (params: GroupDpDataBean) => void
  ): void

  /**
   *@description 移除监听：群组DP变更事件*/
  export function offGroupDpDataChangeEvent(
    listener: (params: GroupDpDataBean) => void
  ): void

  /**
   *@description ota升级结果*/
  export function onOtaCompleted(
    listener: (params: OtaCompletedParams) => void
  ): void

  /**
   *@description 移除监听：ota升级结果*/
  export function offOtaCompleted(
    listener: (params: OtaCompletedParams) => void
  ): void

  /**
   *@description 接收物模型消息事件。只有subscribeReceivedThingModelMessage订阅了，才会收到该事件。*/
  export function onReceivedThingModelMessage(
    listener: (params: OnReceivedThingModelMessageBody) => void
  ): void

  /**
   *@description 移除监听：接收物模型消息事件。只有subscribeReceivedThingModelMessage订阅了，才会收到该事件。*/
  export function offReceivedThingModelMessage(
    listener: (params: OnReceivedThingModelMessageBody) => void
  ): void

  export type CheckSupportMultiControlParams = {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
  }

  export type MultiControlDpInfo = {
    /**
     * dpCode
     * dp码
     */
    dpCode: string
    /**
     * dpName
     * dp名称
     */
    dpName: string
    /**
     * dpId
     * dp id
     */
    dpId: number
  }

  export type MultiControlGroupInfo = {
    /**
     * bindMaxValue
     * 多控组支持的最大设备数
     */
    bindMaxValue: number
    /**
     * multiGroup
     * 多控组信息
     */
    multiGroup?: MultiControlGroup
    /** parentRules */
    parentRules: MultiControlGroupParentRule[]
  }

  export type MultiControlDevice = {
    /**
     * datapoints
     * 设备dp数据
     */
    datapoints: MultiControlGroupDeviceDp[]
    /**
     * devId
     * 设备id
     */
    devId: string
    /**
     * iconUrl
     * 设备图标
     */
    iconUrl: string
    /** inRule */
    inRule: boolean
    /**
     * multiControlIds
     * 所在的多控组id列表
     */
    multiControlIds: number[]
    /**
     * name
     * 设备名称
     */
    name: string
    /**
     * productId
     * 设备产品id
     */
    productId: string
    /**
     * roomName
     * 设备所在的房间名称
     */
    roomName: string
  }

  export type MultiControlDeviceDpsInfo = {
    /**
     * bindMaxValue
     * 多控组支持的最大设备数
     */
    bindMaxValue: number
    /** datapoints */
    datapoints: MultiControlGroupDeviceDp[]
    /** mcGroups */
    mcGroups: MultiControlGroup[]
    /** parentRules */
    parentRules: MultiControlGroupParentRule[]
  }

  export type UpdateMultiControlDPInfo = {
    /** dpId */
    dpId: number
    /** 设备id */
    devId: string
  }

  export type MultiControlGroup = {
    /**
     * multiControlGroupId
     * 多控组id
     */
    multiControlGroupId: number
    /**
     * multiControlId
     * 多控组id
     */
    multiControlId: number
    /**
     * groupName
     * 多控组名称
     */
    groupName: string
    /**
     * enabled
     * 是否使能
     */
    enabled: boolean
    /**
     * groupDetail
     * 多控组设备信息
     */
    groupDetail: MultiControlGroupDevice[]
    /**
     * groupType
     * 多控组类型，0为面板入口的多控，1为设备入口的多控；
     * 类型为0的多控组，当任意设备移除时，会解散群组；
     */
    groupType: number
  }

  export type CheckSupportDoubleControlParams = {
    /**
     * deviceId
     * 设备id
     */
    deviceId: string
  }

  export type DoubleControlGroup = {
    /**
     * mainDeviceId
     * 主设备id
     */
    mainDeviceId: string
    /**
     * slaveDeviceIds
     * 从设备id列表
     */
    slaveDeviceIds: string[]
  }

  export type DoubleControlDevice = {
    /**
     * devId
     * 设备id
     */
    devId: string
    /**
     * isRelate
     * 是否已经关联
     */
    isRelate: boolean
    /**
     * parentId
     * 主设备id
     */
    parentId: string
  }

  export type DoubleControlDPRelation = {
    /**
     * dpIds
     * 主设备dpId列表
     */
    dpIds: string[]
    /**
     * subDpIds
     * 从设备dpId列表
     */
    subDpIds: string[]
    /**
     * dpIdMap
     * 主从设备dpId关联关系, key: 从设备dpId, value: 主设备dpId
     */
    dpIdMap: any
  }

  export type DoubleControlDPInfo = {
    /**
     * code
     * dp码
     */
    code: string
    /**
     * dpId
     * dp id
     */
    dpId: number
    /**
     * name
     * dp名称
     */
    name: string
    /** schema id */
    schemaId: string
  }

  export type CommRodDeviceModel = {
    /** 扫描到的设备ID */
    deviceId: string
    /** 扫描到的设备名称 */
    name: string
    /** 扫描到的设备uuid */
    uuid: string
    /** 扫描到的设备pid */
    pid: string
    /** 设备的mac */
    mac: string
    /** 是否激活 */
    isActive: boolean
  }

  export type Gateway = {
    /**
     * 网关模型
     * gwId 网关设备Id
     */
    gwId: string
  }

  export type Device = {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
  }

  export type Device_fUC2mh = {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
    /** dps */
    dps?: any
  }

  export type DeviceInfo = {
    /** 设备所处房间名 */
    roomName?: string
    /** 产品信息，schema，功能定义都在里面 */
    schema: {}[]
    /**
     * dps
     * 设备的功能点状态，可以根据对应的 dpid 拿到具体的状态值去做业务逻辑
     */
    dps: any
    /**
     * attribute
     * 产品属性定义，在 backend-ng 平台上可查到对应配置，使用二进制位运算的方式进行管理
     */
    attribute: number
    /**
     * baseAttribute
     * 基础产品属性定义
     */
    baseAttribute: number
    /**
     * capability
     * 产品能力值，在 backend-ng 平台上可以查询对应的勾选项，整体业务逻辑会根据该数据进行划分
     * 区分设备类型也可以根据该属性进行调整，按二进制位运算的方式进行管理
     */
    capability: number
    /**
     * dpName
     * 自定义 dp 的名字，通常在面板里会使用到
     */
    dpName: any
    /**
     * ability
     * 目前业务很少使用，用于区分特殊类型的设备
     */
    ability: number
    /**
     * icon
     * 设备的 icon url
     */
    icon: string
    /**
     * devId
     * 设备的唯一 id
     */
    devId: string
    /**
     * verSw
     * 设备固件版本号
     */
    verSw: string
    /**
     * isShare
     * 是否为分享设备，true 则是分享设备
     */
    isShare: boolean
    /**
     * bv
     * 设备的基线版本号
     */
    bv: string
    /**
     * uuid
     * 设备的固件唯一标识
     */
    uuid: string
    /**
     * panelConfig
     * 产品面板里的配置项，通常在 IoT 平台上可以查看到对应的配置
     */
    panelConfig: any
    /**
     * activeTime
     * 设备激活时间，时间戳
     */
    activeTime: number
    /**
     * devAttribute
     * 设备的业务能力拓展，二进制位的方式进行运算
     */
    devAttribute: number
    /**
     * pcc
     * Thing自研蓝牙 mesh 产品的分类标识
     */
    pcc: string
    /**
     * nodeId
     * 子设备的短地址
     */
    nodeId: string
    /**
     * parentId
     * 上级节点 id，子设备/或蓝牙 mesh 设备通常会有该字段，用于内部寻找相关的网关或上级模型来进行业务处理
     */
    parentId?: string
    /**
     * category
     * 产品的分类
     */
    category: string
    /**
     * standSchemaModel
     * 标准产品功能集定义模型
     */
    standSchemaModel?: {}
    /**
     * productId
     * 设备对应的产品 id
     */
    productId: string
    /**
     * productVer
     * 设备对应的产品的版本号
     */
    productVer: string
    /**
     * bizAttribute
     * 业务属性能力
     */
    bizAttribute: number
    /**
     * meshId
     * 当前设备对应的蓝牙 mesh id
     */
    meshId: string
    /**
     * 【废弃】sigmeshId
     * 当前设备所属行业属性对应的蓝牙 mesh id
     */
    sigmeshId: string
    /**
     * meta
     * 设备自定义配置元属性，用于存放业务数据
     */
    meta: any
    /**
     * isLocalOnline
     * 本地局域网是否在线
     */
    isLocalOnline: boolean
    /** 设备云端在线情况 */
    isCloudOnline: boolean
    /**
     * isOnline
     * 设备总的在线情况，只要一个情况在线，就是在线，复合在线情况
     */
    isOnline: boolean
    /**
     * name
     * 设备名称
     */
    name: string
    /** groupId */
    groupId: string
    /**
     * dpCodes
     * 标准功能集 code
     */
    dpCodes: any
    /** 时区信息 */
    devTimezoneId: string
    /** 设备的功能点执行的时间 */
    dpsTime: any
    /** 设备纬度 */
    latitude: string
    /** 设备经度 */
    longitude: string
    /** 设备ip地址 */
    ip?: string
    /** 是否为虚拟设备 */
    isVirtualDevice: boolean
    /** zigbeeInstallCode to the cloud to mark the gateway with installation code ability */
    isZigbeeInstallCode: boolean
    /** Activate sub-device capability flag. */
    protocolAttribute: number
    /** 连接状态，nearby状态 */
    connectionStatus: number
    /** 部分设备需要用mac进行唯一识别 ，比如mesh */
    mac?: string
    /** 蓝牙的设备能力值，由设备进行上报 */
    bluetoothCapability?: string
    /** 是否三方matter设备 */
    isTripartiteMatter: boolean
    /** 是否网关设备 */
    isGW: boolean
    /** 是否支持群组 */
    isSupportGroup: boolean
    /** 是否zigbee子设备 */
    isZigBeeSubDev: boolean
    /** cadv版本号 */
    cadv?: string
    /** 设备是否支持OTA */
    isSupportOTA: boolean
    /** 设备图标 */
    iconUrl: string
    /** 设备是否有Wi-Fi模块 */
    hasWifi: boolean
    /** 快捷控制dp */
    switchDp: number
    /** 快捷控制dp */
    switchDps: number[]
    /** 设备Wi-Fi模块的状态：1:不可用 2:可用 */
    wifiEnableState: number
    /** 设备产品配置 */
    configMetas: any
    /** 是否为matter设备 */
    isMatter: boolean
    /** 设备是否支持双控 */
    isSupportLink: boolean
    /** 是否支持将设备添加到苹果家庭中 */
    isSupportAppleHomeKit?: boolean
    /**
     * attribute 格式化的二进制字符串
     * 产品属性定义，在 backend-ng 平台上可查到对应配置，使用二进制位运算的方式进行管理
     */
    attributeString: string
    /**
     * 设备的扩展模块的类型
     * 0：无扩展模块
     * 1：表示存在扩展模块，即设备为ble+x的设备
     * 2：扩展模块为Wi-Fi模块。即设备为ble+Wi-Fi的设备
     */
    extModuleType: number
    /** mesh设备的relay功能是否开启 */
    isRelayOpen: boolean
    /** mesh设备的proxy功能是否开启 */
    isProxyOpen: boolean
    /** mesh设备是否支持proxy和relay功能 */
    isSupportProxyAndRelay: boolean
    /** 设备大禹通道用户启用状态，0-不启用，1-启用 */
    yuNetState: number
  }

  export type OriginalDps = {
    /** dpId */
    dpId: string
    /** dpCode */
    dpCode: string
    /** dpValue */
    dpValue: {}
  }

  export type TranslateAdvancedCapability = {
    /** dpCode */
    dpCode: string
    /** 转换后的值 */
    translatedValue: string
    /** 单位 */
    unit: string
  }

  export enum DeviceDetailConnectAbility {
    /** 未知 */
    UNKNOW = 0,

    /** 仅手机 */
    PHONE = 1,

    /** 仅网关 */
    GATEWAY = 2,

    /** 手机和网关 */
    PHONE_AND_GATEWAY = 3,
  }

  export type DirectlyDeviceExtraParams = {
    /** 固件类型 */
    type: string
    /** 版本 */
    version: string
  }

  export type OTAUpdateInfo = {
    /** 升级文案 */
    desc: string
    /** 模组文案 */
    typeDesc: string
    /**
     * 升级状态
     * 0: 不需要升级. 1: 有新的固件可以升级. 2: 升级中. 5: 等待设备唤醒
     */
    upgradeStatus: number
    /** 固件版本 */
    version: string
    /** 设备当前固件版本 */
    currentVersion: string
    /** 升级超时时间，单位秒 */
    timeout: number
    /**
     * 升级提醒类型
     * 0: 提醒升级、2: 强制升级、3: 检测升级
     */
    upgradeType: number
    /** 固件类型 */
    type: number
    /**
     * 设备类型
     * 0: 普通设备. 1: 低功耗设备
     */
    devType: number
    /**
     * 升级过程中设备是否可控
     * 1: 可控. 0: 不可控
     */
    controlType: boolean
    /** 设备等待唤醒描述 */
    waitingDesc: string
    /** 升级描述 */
    upgradingDesc: string
    /** 设备是否可以升级 */
    canUpgrade: boolean
    /** 设备不能升级的原因 */
    remind: string
    /**
     * 固件升级模式
     * 0: 正常升级. 1: pid 版本升级
     */
    upgradeMode: number
  }

  export type TimerConfig = {
    /**
     * background
     * 定时界面导航栏的背景颜色，十六进制，例如：FFFFFF
     */
    background?: string
  }

  export type TimerModel = {
    /**
     * timerId
     * 定时器 id
     */
    timerId: string
    /**
     * date
     * 日期
     */
    date: string
    /**
     * time
     * 定时器运行的时间
     */
    time: string
    /**
     * status
     * 状态
     */
    status: boolean
    /**
     * loops
     * 七位数字字符串，"1000000" 代表周日，"0100000" 代表周一
     */
    loops: string
    /**
     * dps
     * dp 点数据，示例：
     * {
     *      "1": true,
     *      "2": false
     * }
     */
    dps: any
    /**
     * timezoneId
     * 时区
     */
    timezoneId: string
    /**
     * aliasName
     * 别名
     */
    aliasName: string
    /**
     * isAppPush
     * 是否发送执行通知
     */
    isAppPush: boolean
    /**
     * id
     * 任务 id
     */
    id: string
  }

  export type AddTimerModel = {
    /**
     * time
     * 定时器运行的时间
     */
    time: string
    /**
     * loops
     * 七位数字字符串，"1000000" 代表周日，"0100000" 代表周一
     */
    loops: string
    /**
     * dps
     * dp 点数据，示例：
     * {
     *      "1": true,
     *      "2": false
     * }
     */
    dps: any
    /**
     * aliasName
     * 别名
     */
    aliasName?: string
    /**
     * isAppPush
     * 是否发送执行通知
     */
    isAppPush?: boolean
  }

  export type UpdateTimerModel = {
    /**
     * timerId
     * 定时器 id
     */
    timerId: string
    /**
     * time
     * 定时器运行的时间
     */
    time: string
    /**
     * loops
     * 七位数字字符串，"1000000" 代表周日，"0100000" 代表周一
     */
    loops: string
    /**
     * dps
     * dp 点数据，示例：
     * {
     *      "1": true,
     *      "2": false
     * }
     */
    dps: any
    /**
     * aliasName
     * 别名
     */
    aliasName?: string
    /**
     * isAppPush
     * 是否发送执行通知
     */
    isAppPush?: boolean
  }

  export type ThirdPartyService = {
    /** 服务 id */
    serviceId: number
    /** 服务名称 */
    name: string
    /** 图标 url */
    iconUrl: string
    /** 服务 url */
    url: string
    /** attributeKey */
    attributeKey: string
    /** attributeSign */
    attributeSign: number
    /** widgetUrl */
    widgetUrl: string
    /** 包含云端完整字段的 json 对象 */
    originJson: any
  }

  export type SubFunctionShowState = {
    /** 子功能Id */
    id: string
    /** 是否显示 */
    isShow: boolean
  }

  export type RemoteRebootTimers = {
    /** 定时id */
    tid: string
    /** 定时时间 */
    time: string
    /** 定时循环 */
    loops: string
    /** 定时状态 */
    status: boolean
  }

  export type SceneAction = {
    /** 条件 ID */
    id?: string
    /** 场景 ID */
    ruleId?: string
    /** 场景 ID */
    orderNum?: number
    /** 条件为设备类型时，表示设备 ID */
    entityId: string
    /** 设备名称 */
    entityName?: string
    /**
     * 动作类型。枚举：
     * ruleTrigger：触发场景
     * ruleEnable：启用场景
     * ruleDisable：禁用场景
     * appPushTrigger：推送消息
     * mobileVoiceSend：电话服务
     * smsSend：短信服务
     * deviceGroupDpIssue：执行群组
     * irIssue：执行红外设备
     * dpIssue：执行普通设备
     * delay：延时
     * irIssueVii：执行红外设备，执行参数为真实的红外控制码
     * toggle：执行切换开关动作
     * dpStep：执行步进动作
     */
    actionExecutor: string
    /** 动作执行信息 */
    executorProperty: any
    /** 动作额外信息 */
    extraProperty: any
    /** 设备是否在线 */
    isDevOnline?: boolean
    /** 条件为设备类型时，表示设备是否被移除 */
    devDelMark?: boolean
    /** 条件为设备类型时，表示设备被删除时的图标 */
    deleteDevIcon?: string
    /** 条件为设备类型时，设备的图标 */
    devIcon?: string
    /** 动作的策略 */
    actionStrategy?: string
    /** 面板信息（小程序或者RN面板） */
    extraPanelInfo?: ExtraPanelInfo
    /** 设备产品 ID */
    pid?: string
    /** 设备产品 ID */
    productId?: string
    /** 条件为设备类型时，表示设备产品图片 */
    productPic?: string
    /** 条件默认图标 */
    defaultIconUrl?: string
    /** 动作展示信息 */
    actionDisplay?: string
    /** 动作展示信息 */
    actionDisplayNew?: any
    /** 执行状态 */
    status?: boolean
    /** 批量控制设备的数据 */
    relationGroup?: any
  }

  export type Expr = {
    /** 开始时间  imeInterval=custom时自定义，其余默认00:00 */
    start: string
    /** 结束时间，timeInterval=custom时自定义，其余默认23:59 */
    end: string
    /** 自定义:custom，全天:allDay，白天:daytime，夜间:night,默认allDay */
    timeInterval: string
    /** 按7123456顺序标记，例：0001100，每周三、四；0000000表示只执行一次 */
    loops: string
    /** 时区 */
    timeZoneId: string
    /** 城市Id */
    cityId: string
    /** 城市名称 */
    cityName: string
  }

  export type Receiver = {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    /**
     * nickName
     * 用户的昵称
     */
    nickName: string
    /**
     * userName
     * 用户的手机号或者邮箱
     */
    userName: string
    /**
     * iconUrl
     * 用户头像图标链接
     */
    iconUrl: string
    /**
     * shareMode
     * 分享模式, 0永久有效, 1一段时间有效, 只对设备分享起作用
     */
    shareMode: number
    /**
     * endTime
     * 分享结束时间, 单位毫秒, 只对设备分享起作用
     */
    endTime: number
    /**
     * uid
     * 用户id
     */
    uid?: string
  }

  export type Member = {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    /**
     * nickName
     * 用户的昵称
     */
    nickName: string
    /**
     * userName
     * 用户的手机号或者邮箱
     */
    userName: string
    /**
     * iconUrl
     * 用户头像图标链接
     */
    iconUrl: string
    /**
     * shareMode
     * 分享模式, 0永久有效, 1一段时间有效, 只对设备分享起作用
     */
    shareMode: number
    /**
     * endTime
     * 分享结束时间, 单位毫秒, 只对设备分享起作用
     */
    endTime: number
    /**
     * uid
     * 用户id
     */
    uid: string
  }

  export type Sharer = {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    /**
     * nickName
     * 用户的昵称
     */
    nickName: string
    /**
     * userName
     * 用户的手机号或者邮箱
     */
    userName: string
  }

  export type SharerDevice = {
    /**
     * iconUrl
     * 设备图标
     */
    iconUrl: string
    /**
     * devId
     * 设备id
     */
    devId: string
    /**
     * name
     * 设备名称
     */
    name: string
    /**
     * roomName
     * 房间名出
     */
    roomName: string
    /**
     * homeName
     * 家庭名称
     */
    homeName: string
  }

  export type DeviceInfo_YFvMov = {
    /** 产品信息，schema，功能定义都在里面 */
    schema: {}[]
    /**
     * dps
     * 设备的功能点状态，可以根据对应的 dpid 拿到具体的状态值去做业务逻辑
     */
    dps: any
    /**
     * attribute
     * 产品属性定义，在 backend-ng 平台上可查到对应配置，使用二进制位运算的方式进行管理
     */
    attribute: number
    /**
     * capability
     * 产品能力值，在 backend-ng 平台上可以查询对应的勾选项，整体业务逻辑会根据该数据进行划分
     * 区分设备类型也可以根据该属性进行调整，按二进制位运算的方式进行管理
     */
    capability: number
    /**
     * dpName
     * 自定义 dp 的名字，通常在面板里会使用到
     */
    dpName: any
    /**
     * ability
     * 目前业务很少使用，用于区分特殊类型的设备
     */
    ability: number
    /**
     * icon
     * 设备的 icon url
     */
    icon: string
    /**
     * devId
     * 设备的唯一 id
     */
    devId: string
    /**
     * verSw
     * 设备固件版本号
     */
    verSw: string
    /**
     * isShare
     * 是否为分享设备，true 则是分享设备
     */
    isShare: boolean
    /**
     * bv
     * 设备的基线版本号
     */
    bv: string
    /**
     * uuid
     * 设备的固件唯一标识
     */
    uuid: string
    /**
     * panelConfig
     * 产品面板里的配置项，通常在 IoT 平台上可以查看到对应的配置
     */
    panelConfig: any
    /**
     * activeTime
     * 设备激活时间，时间戳
     */
    activeTime: number
    /**
     * devAttribute
     * 设备的业务能力拓展，二进制位的方式进行运算
     */
    devAttribute: number
    /**
     * pcc
     * Thing自研蓝牙 mesh 产品的分类标识
     */
    pcc: string
    /**
     * nodeId
     * 子设备的短地址
     */
    nodeId: string
    /**
     * parentId
     * 上级节点 id，子设备/或蓝牙 mesh 设备通常会有该字段，用于内部寻找相关的网关或上级模型来进行业务处理
     */
    parentId: string
    /**
     * category
     * 产品的分类
     */
    category: string
    /**
     * standSchemaModel
     * 标准产品功能集定义模型
     */
    standSchemaModel: {}
    /**
     * productId
     * 设备对应的产品 id
     */
    productId: string
    /**
     * bizAttribute
     * 设备自主上报的能力位
     */
    bizAttribute: number
    /**
     * meshId
     * Thing自研的蓝牙 mesh id
     */
    meshId: string
    /**
     * sigmeshId
     * 当前设备所属行业属性对应的蓝牙 mesh id
     */
    sigmeshId: string
    /**
     * meta
     * 设备自定义配置元属性，用于存放业务数据
     */
    meta: any
    /**
     * isLocalOnline
     * 本地局域网是否在线
     */
    isLocalOnline: boolean
    /**
     * isOnline
     * 设备总的在线情况，只要一个情况在线，就是在线，复合在线情况
     */
    isOnline: boolean
    /**
     * name
     * 设备名称
     */
    name: string
    /** groupId */
    groupId: string
    /**
     * dpCodes
     * 标准功能集 code
     */
    dpCodes: any
    /** 原始 json，业务来不及拓展更新的时候，可以根据这个来获取处理 */
    originJson: any
    /**
     * dpsTime
     * 设备DP的执行时间
     */
    dpsTime: {}
    /**
     * secCategory
     * 二级品类
     */
    secCategory: string
  }

  export type GroupInfo = {
    /**
     * groupId
     * The group ID.
     */
    groupId: string
    /**
     * productId
     * The product ID.
     */
    productId: string
    /**
     * name
     * The name of the group.
     */
    name: string
    /**
     * time
     * The time when the group was created.
     */
    time: number
    /**
     * iconUrl
     * The URL of the icon.
     */
    iconUrl: string
    /**
     * type
     * The type of group.
     * Wifi = 0, Mesh = 1, Zigbee = 2, SIGMesh = 3, Beacon = 4,
     */
    type: number
    /** isShare */
    isShare: boolean
    /** dps */
    dps: {}
    /** dpCodes */
    dpCodes: {}
    /**
     * deviceNum
     * The number of devices,
     */
    deviceNum: number
    /**
     * localKey
     * The local key.
     */
    localKey: string
    /** The protocol version. */
    pv: number
    /** The product information. */
    productInfo: {}
    /** The custom DP name. */
    dpName: {}
    /** The device list. */
    deviceList: DeviceInfo_YFvMov[]
    /** The local short address of groups. */
    localId: string
    /** The subclass. */
    pcc: string
    /** The mesh ID or gateway ID. */
    meshId: string
    /** Add the beacon beaconKey. */
    groupKey: string
    /** The schema array. */
    schema: {}[]
  }

  export type AvailableGatewayModel = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    /**
     * deviceName
     * 设备 name
     */
    deviceName: string
    /**
     * isLocalOnline
     * 是否在线
     */
    isLocalOnline: boolean
  }

  export type Object = {}

  export type ServiceModel = {
    /** 属性列表 */
    properties: ThingProperty[]
    /** 动作列表 */
    actions: ThingAction[]
    /** 事件列表 */
    events: ThingEvent[]
  }

  export type LeaveBeaconFenceEvent = {
    /** 设备模型 设备id */
    deviceId: string
    /** 具体文案 */
    text: string
  }

  export type FileTransferProgressResult = {
    /** 设备模型 设备id */
    deviceId: string
    /** 文件id */
    fileId: number
    /** 文件标识符 */
    fileIdentifier: string
    /** 文件版本 */
    fileVersion: number
    /** 文件地址 */
    filePath: string
    /** 传输进度 */
    progress: number
  }

  export type ThingBLEConnectStatusEvent = {
    /**
     * BLE（thing）连接状态
     * deviceId: 设备 id
     */
    deviceId: string
    /**
     * status 状态值
     *   CONNECTED:已连接
     *   CONNECTING:连接中
     *   CONNECT_BREAK:连接失败
     */
    status: string
  }

  export type ThingBLETransparentDataBean = {
    /**
     * 蓝牙透传数据
     * deviceId: 设备 id
     */
    deviceId: string
    /** data: 透传内容 */
    data: string
  }

  export type ThingBLEBigDataProgressEvent = {
    /**
     * 大数据通道传输进度
     * deviceId 设备 id
     */
    deviceId: string
    /** progress 传输进度，范围: 0 - 100 */
    progress: number
  }

  export type ThingBLEScanDeviceEvent = {
    /** 扫描到的设备ID */
    deviceId: string
  }

  export type BLEBigDataChannelDeviceToAppSuccessResponse = {
    /** data */
    data: BLEBigDataChannelData[]
  }

  export type CommRodScanDeviceEvent = {
    /** 设备广播包原始数据 */
    deviceInfo: CommRodDeviceModel
  }

  export type CommRodConnectStatusEvent = {
    /**
     * BLE（thing）连接状态
     * uuid: 设备 mac
     */
    uuid: string
    /**
     * status 状态值
     *   CONNECTED:已连接
     *   CONNECT_BREAK:连接失败
     */
    status: string
  }

  export type CommRodSchemaUploadEvent = {
    /** 设备uuid */
    uuid: string
    /** 设备schema信息 */
    schema: string
  }

  export type CommRodDpsChangeEvent = {
    /** 设备uuid */
    uuid: string
    /** dps */
    dps: any
  }

  export type GWActivationRespond = {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
    /**
     * 网关模型
     * gwId 网关设备Id
     */
    gwId: string
  }

  export type DirectlyConnectedSearchRespond = {
    /**
     * 设备是否激活
     * isActive 激活结果
     */
    isActive: boolean
  }

  export type DpsChanged = {
    /** dps 对应的设备 id */
    deviceId: string
    /** 子设备对应的网关设备 id，可以根据此进行网关面板的状态刷新 */
    gwId: string
    /**
     * dps
     * 变化的数据
     */
    dps: any
    /** dpsTime dp变化的时间戳（可能为空） */
    dpsTime?: any
    /**
     * options
     * 预留的标记位，后续可以区分来源等
     */
    options: any
  }

  export type MqttResponse = {
    /** 设备 id */
    deviceId?: string
    /** 原始消息数据 */
    message: any
    /** 双端抹平后的消息数据 */
    messageData: any
    /** 消息类型 */
    type: string
    /** 协议号 */
    protocol: number
    /** topic */
    topic?: string
  }

  export type SocketResponse = {
    /** 消息内容 */
    message: any
    /** 设备 id */
    deviceId: string
    /** 局域网消息 type */
    type: number
  }

  export type Online = {
    /** 在线状态 */
    online: boolean
    /** 设备 id */
    deviceId: string
    /**
     * 设备在线类型(预留，后期使用)
     * Wi-Fi online             1 << 0
     * Local online             1 << 1
     * Bluetooth LE online      1 << 2
     * Bluetooth LE mesh online 1 << 3
     */
    onlineType: number
  }

  export type SubDevReplaceResult = {
    /** 替换结果 */
    replaceResult: boolean
    /** 错误码，replaceResult为true时为空 */
    errorCode?: string
    /** 错误信息，replaceResult为true时为空 */
    errorMsg?: string
  }

  export type OnDeviceRemovedBody = {
    /** 设备id */
    deviceId: string
  }

  export type MqttConnectStateResponse = {
    /**
     * mqtt连接状态
     * 0 连接失败
     * 1 连接成功
     */
    connectState: number
  }

  export type SubFunctionParams = {
    /** 子功能id */
    id: string
    /** 名称 */
    name?: string
    /** 子功能显示类型 */
    type?: string
    /** 子功能分组类型 */
    optionType?: string
    /** 子功能来源：RN｜小程序｜APP */
    from?: string
    /** 排序 */
    order?: number
    /** 是否隐藏 */
    isHide?: boolean
    /** 业务参数 */
    data?: any
  }

  export type GroupInfoResponse = {
    /** groupId 群组id */
    groupId: string
  }

  export type GroupDpCodeBean = {
    /** groupId 群组id */
    groupId: string
    /**
     * dp信息
     * 示例: dpCodes: {"switch" : true}
     */
    dpCodes: any
  }

  export type GroupBean = {
    /** 群组id */
    groupId: string
  }

  export type GroupDpDataBean = {
    /** groupId 群组id */
    groupId: string
    /**
     * dp信息
     * 示例: dps: {"1" : true}
     */
    dps: {}
  }

  export type OtaCompletedParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    /**
     * result
     * 结果 0成功、1失败、2超时
     */
    result: number
  }

  export type OnReceivedThingModelMessageBody = {
    /**
     * 类型
     * 0:属性, 1:动作, 2:事件
     */
    type: number
    /** payload */
    payload: any
  }

  export type MultiControlGroupDeviceDp = {
    /**
     * dpId
     * dp id
     */
    dpId: number
    /**
     * code
     * dp码
     */
    code: string
    /**
     * name
     * dp名称
     */
    name: string
  }

  export type MultiControlGroupDevice = {
    /**
     * multiControlId
     * 多控组id
     */
    multiControlId: number
    /**
     * datapoints
     * 设备dp数据
     */
    datapoints: MultiControlGroupDeviceDp[]
    /**
     * devId
     * 设备id
     */
    devId: string
    /**
     * devName
     * 设备名称
     */
    devName: string
    /**
     * dpId
     * dp id
     */
    dpId: number
    /**
     * dpName
     * dp名称
     */
    dpName: string
    /**
     * 状态
     * status
     */
    status: number
    /**
     * enabled
     * 是否生效
     */
    enabled: boolean
  }

  export type MultiControlGroupParentRuleDpInfo = {
    /**
     * dpId
     * dp id
     */
    dpId: number
    /**
     * dpName
     * dp名称
     */
    dpName: string
  }

  export type MultiControlGroupParentRule = {
    /** ruleId */
    ruleId: string
    /** name */
    name: string
    /** dpList */
    dpList: MultiControlGroupParentRuleDpInfo[]
  }

  export type BLEBigDataChannelData = {
    /** dpsTime */
    dpsTime: string
    /** dps */
    dps: any
  }

  export type BeaconFenceParams = {
    /** 设备模型 设备id */
    deviceId: string
  }

  export type BeaconFenceConfigParams = {
    /** 设备模型 设备id */
    deviceId: string
    /** 最小信号强度 */
    beaconFenceRssi: number
    /** 设置是否打开进入范围强度区间发送dp功能 */
    isOpenEventWhenApproachingBeaconFence: boolean
    /** 设置是否打开离开范围强度区间发送dp功能 */
    isOpenEventWhenLeaveBeaconFence: boolean
    /** 设置是否打开离开范围强度区间发送本地通知 */
    isOpenNotifyWhenLeaveBeaconFence: boolean
  }

  export type Device_oRnfnm = {
    /**
     * 设备模型
     * deviceId 设备Id
     */
    deviceId: string
  }

  export type BeaconFenceConfigResponse = {
    /** 设备模型 设备id */
    deviceId: string
    /** 最小信号强度 */
    beaconFenceRssi: number
    /** 设置是否打开进入范围强度区间发送dp功能 */
    isOpenEventWhenApproachingBeaconFence: boolean
    /** 设置是否打开离开范围强度区间发送dp功能 */
    isOpenEventWhenLeaveBeaconFence: boolean
    /** 设置是否打开离开范围强度区间发送本地通知 */
    isOpenNotifyWhenLeaveBeaconFence: boolean
  }

  export type BTBondParams = {
    /** 设备的mac地址 */
    mac: string
  }

  export type ThingBLEFileTransferParams = {
    /** 设备模型 设备id */
    deviceId: string
    /** 文件id */
    fileId: number
    /** 文件标识符 */
    fileIdentifier: string
    /** 文件版本 */
    fileVersion: number
    /** 文件地址 */
    filePath: string
  }

  export type ThingBLEFileTransferResult = {
    /** true/false 传输成功/传输失败 */
    result: boolean
  }

  export type BLERSSIBean = {
    /**
     * 设备信号
     * signal 若为 0，则获取失败
     */
    signal: number
  }

  export type ThingBLEOnlineStateBean = {
    /**
     * 蓝牙在线状态的回调boolean值
     * isOnline 是否在线
     */
    isOnline: boolean
  }

  export type ThingBLEEncryptDeviceBean = {
    /**
     * 大数据通道加密计算结构
     * deviceId 设备 id
     */
    deviceId: string
    /** keyDeviceId 需要传输加密密钥的设备Id */
    keyDeviceId: string
  }

  export type ThingBLEBigDataBean = {
    /** deviceId 设备 id */
    deviceId: string
    /**
     * 建立数据传输所需相关参数
     * command：通道操作的具体指令；start/stop：开启/关闭大数据通道；type：要上传的数据类型
     * requestParams 通道指令集
     * {
     *    "command": "start",
     *    "type": "1"
     * }
     */
    requestParams: any
  }

  export type ThingBLEBigDataResultBean = {
    /** deviceId 设备 id */
    deviceId: string
    /**
     * 数据传输完毕相关参数（type dps fileUrl）
     * resultParams 数据传输完毕相关参数
     */
    resultParams: any
  }

  export type BleMeshLowPowerConnectionParams = {
    /** deviceId 设备 id */
    deviceId: string
  }

  export type ThingBLEScanParams = {
    /** 间隔扫描时间。如果<0，则返回错误 */
    interval: number
    /**
     * 【废弃】扫描不区分type
     * 扫描类型
     * SINGLE -> "SINGLE"
     * SINGLE_QR -> "SINGLE_QR"
     * MESH -> "MESH"
     * SIG_MESH -> "SIG_MESH"
     * NORMAL -> "NORMAL"
     * Thing_BEACON -> "Thing_BEACON"
     */
    scanType: string
  }

  export type ThingBLECapabilitySupportParams = {
    /** 设备Id */
    deviceId: string
    /**
     * 能力值标位
     * 5：定时
     */
    capability: number
  }

  export type ThingBLECapabilitySupportResult = {
    /**
     * 是否支持蓝牙相关能力的结果回调
     * isSupport 是否支持
     */
    isSupport: boolean
  }

  export type BTDeviceInfoResponse = {
    /** 设备名称 */
    deviceName?: string
    /** 是否连接 */
    isConnected?: boolean
    /** 是否配对 */
    isBond?: boolean
    /** mac */
    mac?: string
  }

  export type BluetoothConnectReq = {
    /** 设备ID */
    devId: string
    /**
     * 连接超时时限
     * 单位: 毫秒
     */
    timeoutMillis?: number
    /**
     * 来源类型
     * 如果是面板进来的自动连接, 输入1; 否则默认0, 为主动连接
     */
    souceType?: number
    /**
     * 蓝牙连接方式,默认0
     * 0 : 网关和app都需要，默认值，本地和网关两个途径任何一个可用均可生效
     * 1 : 仅app，只会判定本地是否在线，以及本地连接是否成功
     * 2 : 仅网关连接，只会判定网关是否在线，以及坚持网关连接是否成功
     */
    connectType?: number
  }

  export type BluetoothDisconnectReq = {
    /** 设备ID */
    devId: string
    /**
     * 蓝牙连接方式,默认0
     * 0 : 网关和app都需要，默认值，本地和网关两个途径任何一个可用均可生效
     * 1 : 仅app，只会判定本地是否在线，以及本地连接是否成功
     * 2 : 仅网关连接，只会判定网关是否在线，以及坚持网关连接是否成功
     */
    connectType?: number
  }

  export type ActiveDeviceExtendModuleParams = {
    /** 设备id */
    deviceId: string
    /** Wi-Fi的ssid */
    ssid?: string
    /** Wi-Fi的pwd */
    password?: string
    /**
     * 激活的类型
     * 0：普通双模设备的连云激活
     * 1：ble+x设备的可插拔模块的连云激活
     * 2：ble+Wi-Fi设备的 Wi-Fi模块的连云激活
     * 区别：类型0、2需要传设备ID、Wi-Fi的ssid和pwd。类型位1只需传设备id
     */
    activeType: number
  }

  export type MeshProxyOrRelayStateParams = {
    /** 设备id */
    deviceId: string
    /** mesh设备的Proxy或relay功能是否开启 */
    isOpen: boolean
  }

  export type RecordBleConnectEventParams = {
    /** 设备id */
    deviceId: string
    /** 来源: 1: 门锁面板, 其他-暂未定义，后续可扩展 */
    src: number
    /** 操作动作id，用于关联其他埋点的信息id */
    actId: string
  }

  export type CommRodConnectParams = {
    /** 设备信息 */
    deviceInfo: CommRodDeviceModel
    /** 设备密码 */
    machineKey: string
    /** 设备schema信息 */
    schema: string
  }

  export type CommRodDpsPublish = {
    /** 设备信息 */
    deviceInfo: CommRodDeviceModel
    /** dps */
    dps: any
  }

  export type ThingMeshVendorControlEventParams = {
    /** mesh id(面板parentId) */
    meshId: string
    /** 节点 id(面板localId) */
    nodeId: string
    /** opCode */
    opCode: number
    /** 透传数据，需要hexString */
    payloadHexString: string
  }

  export type LocalDeviceEntryParams = {
    /** 设备id */
    deviceId: string
    /** 群组id */
    groupId: string
    /**
     * 类型
     * 0: 默认值 all ping. (iOS、安卓 均执行 “蓝牙连接策略/BeaconPing/MeshQuery”)
     * 1: 进入面板时 ping. (安卓执行 “蓝牙连接策略/BeaconPing/MeshQuery”,  iOS 仅执行 “蓝牙连接策略”，不执行“BeaconPing/MeshQuery”)
     */
    type?: number
  }

  export type LocalDeviceExitParams = {
    /** 设备id */
    deviceId: string
    /** 群组id */
    groupId: string
  }

  export type ActivationInfoBean = {
    /**
     * 网关子设备激活数据
     * gateway Gateway 网关模型
     */
    gateway: Gateway
    /** timeout 超时时间设定（秒），建议值120 */
    timeout: number
  }

  export type DirectlyConnectedActivationBean = {
    /**
     * 设备Id
     * device Device 设备模型
     */
    device: Device
    /** timeout 超时时间设定（秒），建议值120 */
    timeout: number
  }

  export type DeviceWifiActivatorResponse = {
    /** 设备是否WiFi激活 */
    wifiActivator: boolean
  }

  export type YuNetStateParams = {
    /** 设备id */
    deviceId: string
    /** 状态 0-关闭, 1-启用 */
    state: number
  }

  export type GeneralArrayStringResponse = {
    /** 返回结果 */
    result: string[]
  }

  export type DeviceNameParams = {
    /** deviceId 设备id */
    deviceId: string
    /** name 设备名称 */
    name: string
  }

  export type DeviceOnlineTypeResponse = {
    /** 设备网络在线类型 */
    onlineType: number
  }

  export type DeviceListReq = {
    /** deviceId 设备ids */
    deviceIds: string[]
  }

  export type DeviceListResp = {
    /** 设备信息队列 */
    deviceInfos: DeviceInfo[]
  }

  export type Product = {
    /** 产品id */
    productId: string
    /** 产品版本号 */
    productVer?: string
  }

  export type ProductInfo = {
    /** 面板配置项，可以在平台进行配置 */
    panelConfig: any
    /** 产品功能定义集合 */
    schema: string
    /** 产品功能定义集合拓展 */
    schemaExt: string
    /**
     * capability
     * 产品能力值，在 backend-ng 平台上可以查询对应的勾选项，整体业务逻辑会根据该数据进行划分
     * 区分设备类型也可以根据该属性进行调整，按二进制位运算的方式进行管理
     */
    capability: number
    /**
     * attribute
     * 产品属性定义，在 backend-ng 平台上可查到对应配置，使用二进制位运算的方式进行管理
     */
    attribute: number
    /**
     * productId
     * 产品 id
     */
    productId: string
    /**
     * category
     * 产品的分类
     */
    category: string
    /**
     * categoryCode
     * 产品的二级分类
     */
    categoryCode: string
    /**
     * standard
     * 是否为标准产品
     */
    standard: boolean
    /**
     * pcc
     * Thing自研蓝牙 mesh 产品的分类标识
     */
    pcc: string
    /**
     * vendorInfo
     * Thing自研蓝牙 mesh 产品的分类标识，融合类使用
     */
    vendorInfo: string
    /**
     * quickOpDps
     * 快捷操作的 dp ids
     */
    quickOpDps: string[]
    /**
     * faultDps
     * 告警/错误的显示 dp ids
     */
    faultDps: string[]
    /**
     * displayDps
     * 快捷操作的 dp ids
     */
    displayDps: string[]
    /**
     * displayMsgs
     * 快捷操作显示文案
     */
    displayMsgs: any
    /**
     * uiPhase
     * ui 包当前环境，预览包或线上包
     */
    uiPhase: string
    /**
     * uiId
     * ui 包唯一包名识别
     */
    uiId: string
    /**
     * uiVersion
     * ui 包版本号
     */
    uiVersion: string
    /**
     * ui
     * ui 小标识
     */
    ui: string
    /**
     * rnFind
     * 是否有包含 RN 包
     */
    rnFind: boolean
    /**
     * uiType
     * ui 包类型
     */
    uiType: string
    /**
     * uiName
     * ui 包名称
     */
    uiName: string
    /**
     * i18nTime
     * 产品语言包最新更新时间
     */
    i18nTime: number
    /**
     * supportGroup
     * 是否支持创建群组
     */
    supportGroup: boolean
    /**
     * supportSGroup
     * 是否支持创建标准群组
     */
    supportSGroup: boolean
    /**
     * configMetas
     * 产品特殊配置项，一些功能业务的特殊配置
     */
    configMetas: any
    /**
     * productVer
     * 产品版本
     */
    productVer: string
    /**
     * attribute 格式化的二进制字符串
     * 产品属性定义，在 backend-ng 平台上可查到对应配置，使用二进制位运算的方式进行管理
     */
    attributeString: string
  }

  export type Mesh = {
    /** 网关设备id或上级节点id */
    meshId: string
  }

  export type DeviceOnline = {
    /** 设备id */
    deviceId: string
    /**
     * 设备在线类型，
     * Wi-Fi online             1 << 0
     * Local online             1 << 1
     * Bluetooth LE online      1 << 2
     * Bluetooth LE mesh online 1 << 3
     */
    onlineType: number
  }

  export type DeviceOnlineParam = {
    /** 设备id */
    deviceId: string
  }

  export type DpsPublish = {
    /** 设备id */
    deviceId: string
    /** dps */
    dps: any
    /**
     * 下发通道类型
     * 0: 局域网
     * 1: 网络
     * 2: 自动
     */
    mode: number
    /**
     * 下发通道的优先级
     * LAN       = 0, // LAN
     * MQTT      = 1, // MQTT
     * HTTP      = 2, // Http
     * BLE       = 3, // Single Point Bluetooth
     * SIGMesh   = 4, // Sig Mesh
     * BLEMesh   = 5, // Thing Private Mesh
     * BLEBeacon = 6, // Beacon
     */
    pipelines: number[]
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options: any
  }

  export type QueryDps = {
    /** 设备id */
    deviceId: string
    /** dpids 数组 */
    dpIds: number[]
    /** 查询类型 0 */
    queryType?: number
  }

  export type MqttMessage = {
    /** 消息内容 */
    message: any
    /** 设备id */
    deviceId: string
    /** 协议号 */
    protocol: number
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options: any
  }

  export type LanMessageParams = {
    /** 消息内容 */
    message: string
    /** 设备id */
    deviceId: string
    /** 协议号 */
    protocol: number
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options?: any
  }

  export type SocketMessage = {
    /** 消息内容 */
    message: any
    /** 设备id */
    deviceId: string
    /** 局域网消息 type */
    type: number
    /** 预留下发逻辑配置标记，后续可以拓展，例如下发声音，下发操作后续动作等等 */
    options: any
  }

  export type DeviceProperties = {
    /** the properties map */
    properties: any
  }

  export type DeviceProperty = {
    /** deviceId */
    deviceId: string
    /** the custom data key */
    code: string
    /** the custom data value */
    value: string
  }

  export type DevicePropertyCB = {
    /** deviceId */
    deviceId: string
    /** set DeviceProperty successfully */
    result: boolean
  }

  export type SyncDeviceInfoParams = {
    /** 设备id */
    deviceId: string
  }

  export type SubscribeDeviceRemovedParams = {
    /** 设备id */
    deviceId: string
  }

  export type UnSubscribeDeviceRemovedParams = {
    /** 设备id */
    deviceId: string
  }

  export type MQTTDeviceListenerParams = {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
  }

  export type MQTTProtocolListenerParams = {
    /**
     * protocol 协议号
     * MQTT预定义的协议号
     */
    protocol: number
  }

  export type DeviceListListenerParams = {
    /** 需注册的设备列表 */
    deviceIdList: string[]
  }

  export type TopicListListenerParams = {
    /** 需监听的topic列表 */
    topicList: string[]
  }

  export type AdvancedCapabilityParams = {
    /** 设备/群组 id */
    resId: string
    /** dpCodes */
    dpCodes: string[]
    /** 设备："6" 群组："5" */
    type: string
    /** 当前空间id */
    spaceId: number
  }

  export type TranslateAdvancedCapabilityParams = {
    /** 设备/群组 id */
    resId: string
    /** 需要转换的dps */
    dps: OriginalDps[]
    /** 设备："6" 群组："5" */
    type: string
  }

  export type TranslateAdvancedCapabilityResponse = {
    /** 转换后的高级能力 */
    advancedCapability: TranslateAdvancedCapability[]
  }

  export type LowPowerDeviceAwakeParams = {
    /** 设备id */
    deviceId: string
    /** 超时时间，传 <= 0 则会使用默认值(10s) */
    timeout: number
  }

  export type LowPowerDeviceAwakeResponse = {
    /**
     * 唤醒结果
     * 1: 设备不支持新唤醒流程（内部只会发一包唤醒消息）
     * 2: 设备唤醒成功
     * 3: 设备唤醒超时
     */
    awakeRsp: number
  }

  export type ReplaceDeviceModel = {
    /**
     * deviceId 设备id
     * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
     */
    deviceId: string
  }

  export type SubDeviceIdList = {
    /** 返回结果 */
    result: string[]
  }

  export type SubDeviceReplaceParams = {
    /** 故障设备 */
    defaultSubDeviceId: string
    /** 新设备 device id */
    replaceSubDevId: string
    /** 是否删除被替换设备 */
    deleteOriginal: boolean
    /** 超时时间/ms，默认 50s */
    timeout: number
  }

  export type SubDevReplaceRequestResult = {
    /** 替换任务的job */
    jobId: number
  }

  export type JobIdModel = {
    /** 故障设备 */
    defaultSubDeviceId: string
    /** job id */
    jobId: string
  }

  export type JobModel = {
    /** job Id */
    jobId: number
    /** 触发转移的人 */
    operatorUid: string
    /** 家庭ID */
    groupId: number
    /** 网关ID */
    gwId: string
    /** 目标网关ID(存在故障子设备的网关) */
    existFaultSubDevGwId: string
    /** 故障子设备 */
    faultSubDevId: string
    /** 新子设备 */
    replaceSubDevId: string
    /** 转移类型.1 -> zigbee 同网关; 2 -> zigbee 不同网关 */
    type: number
    /**
     * 当前状态。同网关 mesh 类子设备替换 可选值:
     * Z_S_TRANSFER_TRIGGER			: 第一步 ： zigbee 同网关 转移触发
     * Z_S_DEVICE_SAVE_LOCAL_DATA   : 第二步 ： zigbee同网关子设备替换 设备保存本地数据 成功
     * Z_S_SIGMAX_DATA_UPDATED : 第三步 zigbee同网关子设备替换 定时数据更改
     * Z_S_JUPITER_DATA_UPDATED ： 第四步 zigbee 同网关 联动数据更改
     * Z_S_SUCCESS ： 第五步 成功
     */
    currentStatus: string
    /** 转移结果。0 -> 进行中. -1 失败 1 成功 */
    result: string
    /** 失败原因 */
    failReason: string
  }

  export type DeviceDetailInfoReq = {
    /** 设备id */
    deviceId: string
  }

  export type DeviceDetailInfoResp = {
    /** 设备id */
    deviceId: string
    /** 设备的 ICCID（物联网卡（SIM 卡）的唯一 ID，该参数仅支持 LTE Cat.1 类设备。 */
    iccid: string
    /** 设备的IMEI */
    imei: string
    /** 设备信号强度 */
    netStrength: string
    /** 设备本地 IP 地址 */
    lanIp: string
    /** 设备 IP 地址 */
    ip: string
    /** 设备 Mac 地址 */
    mac: string
    /** 设备时区 */
    timezone: string
    /** 信道号，该参数仅支持 Zigbee 网关。 */
    channel: string
    /**
     * 设备连接方式：
     *   UNKNOWN
     *   PHONE
     *   GATEWAY
     *   PHONE_AND_GATEWAY
     */
    connectAbility: DeviceDetailConnectAbility
    /** 设备的 RSRP（Reference Signal Received Power）值，该参数仅支持 LTE Cat.1 类设备，用于表示该设备网络的信号强度。 */
    rsrp: number
    /** 设备的 Wi-Fi 信号强度 */
    wifiSignal: number
    /** 设备厂商名称，该参数仅支持第三方 Matter 设备。 */
    vendorName: string
    /** 原始meta */
    meta: any
    /** Matter code */
    matterCode: string
    /** Matter QR code */
    matterQRCode: string
    /** homeKit code （iOS特有） */
    homekitCode: string
  }

  export type CubeConfigRes = {
    /** 是否支持 */
    isSupport: boolean
    /** 小程序链接 */
    miniAppUrl: string
  }

  export type OTAUpdateInfoParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type GetOTAUpdateInfoParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    /** 直连设备额外信息 */
    extra?: DirectlyDeviceExtraParams[]
  }

  export type DeviceDetailParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type GroupDetailParams = {
    /**
     * groupId
     * 群组 id
     */
    groupId: string
  }

  export type TimerParams = {
    /**
     * deviceId
     * 设备 id ，deviceId 和 groupId 至少传一个
     */
    deviceId: string
    /**
     * category
     * 定时分类
     */
    category: string
    /** 注意该字段已废弃 */
    repeat?: number
    /**
     * data
     * dp 数据
     * {
     *      "dpName": dp 点名称，string
     *      "dpId": dp 点 id，string
     *      "selected": dp 点默认值的 index，t.Integer
     *      "rangeKeys": dp 点的值范围，Array<object>
     *      "rangeValues": dp 点的显示数据范围，Array<string>
     * }
     */
    data: {}[]
    /**
     * timerConfig
     * UI配置
     */
    timerConfig?: TimerConfig
  }

  export type GroupTimerParams = {
    /**
     * groupId
     * 群组 id
     */
    groupId: string
    /**
     * category
     * 定时分类
     */
    category: string
    /** 注意该字段已废弃 */
    repeat?: number
    /**
     * data
     * dp 数据
     * {
     *      "dpName": dp 点名称，string
     *      "dpId": dp 点 id，string
     *      "selected": dp 点默认值的 index，t.Integer
     *      "rangeKeys": dp 点的值范围，Array<object>
     *      "rangeValues": dp 点的显示数据范围，Array<string>
     * }
     */
    data: {}[]
    /**
     * timerConfig
     * UI配置
     */
    timerConfig?: TimerConfig
  }

  export type WifiNetworkParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type SyncTimerParams = {
    /**
     * deviceId
     * 设备 id ，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id ，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * category
     * 定时分类
     */
    category: string
  }

  export type SyncTimerResult = {
    /**
     * timers
     * 定时列表
     */
    timers: TimerModel[]
  }

  export type AddTimerParams = {
    /**
     * deviceId
     * 设备 id ，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id ，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * category
     * 定时分类
     */
    category: string
    /**
     * timer
     * 添加定时模型
     */
    timer: AddTimerModel
  }

  export type AddNewTimerModel = {
    /**
     * timerId
     * 定时器 id
     */
    timerId: string
  }

  export type UpdateTimerParams = {
    /**
     * deviceId
     * 设备 id，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * timer
     * 更新定时模型
     */
    timer: UpdateTimerModel
  }

  export type UpdateTimerStatusParams = {
    /**
     * deviceId
     * 设备 id，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * timerId
     * 定时 id
     */
    timerId: string
    /**
     * status
     * 状态
     */
    status: boolean
  }

  export type RemoveTimerParams = {
    /**
     * deviceId
     * 设备 id，deviceId 和 groupId 至少传一个
     */
    deviceId?: string
    /**
     * groupId
     * 群组 id，deviceId 和 groupId 至少传一个
     */
    groupId?: string
    /**
     * timerId
     * 定时器 id
     */
    timerId: string
  }

  export type GetShareDeviceInfoParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type GetShareDeviceInfoResponse = {
    /** 姓名 */
    name: string
    /** 手机号 */
    mobile: string
    /** 邮件 */
    email: string
  }

  export type OpenDeviceEditParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type OpenGroupEditParams = {
    /**
     * groupId
     * 设备 id
     */
    groupId: string
  }

  export type OpenDeviceInfoParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type IsDeviceSupportOfflineReminderParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type IsDeviceSupportOfflineReminderResponse = {
    /**
     * support
     * 是否支持设备离线提醒
     */
    isSupport: boolean
  }

  export type GetDeviceOfflineReminderStateParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type GetDeviceOfflineReminderStateResponse = {
    /**
     * state
     * 设备离线提醒的开关状态 0:关 1:开
     */
    state: number
  }

  export type ToggleDeviceOfflineReminderParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    /**
     * state
     * 设备离线提醒的开关状态 0:关 1:开
     */
    state: number
  }

  export type GetDeviceOfflineReminderWarningTextResponse = {
    /** 离线提醒关闭警告文案 */
    warningText: string
  }

  export type Device_oFabXc = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type OpenShareDeviceParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type AddDeviceToDeskParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type RemoveShareDeviceParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type GetSupportedThirdPartyServicesParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type GetSupportedThirdPartyServicesResponse = {
    /** 服务列表 */
    services: ThirdPartyService[]
  }

  export type ConfigurationResponse = {
    /** 定制业务配置项 */
    customConfiguration: {}[]
    /** 有实现的子功能列表 */
    hasImplFunctionList: string[]
  }

  export type SubFunctionShowParams = {
    /** 需要获取显示状态的子功能Id */
    ids: string[]
    /** 设备Id */
    deviceId?: string
    /** 群组Id */
    groupId?: number
  }

  export type SubFunctionShowResponse = {
    /** 需要监听的子功能列表 */
    showStateList: SubFunctionShowState[]
  }

  export type SubFunctionExtShowData = {
    /** 子功能id */
    id: string
    /** 查询参数 / 返回的数据 */
    data?: any
  }

  export type GetRemoteRebootTimersParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type GetRemoteRebootTimersResult = {
    /** 定时列表 */
    timers: RemoteRebootTimers[]
  }

  export type UiComponent = {
    /** 组件code */
    code: string
    /** 组件版本 */
    version: string
    /** 排序 */
    sort: number
    /** 版本路径 */
    content?: string
    /** 文件大小 */
    fileSize?: string
    /** 文件md5 */
    fileMd5?: string
  }

  export type UiInfo = {
    /** 发布状态 */
    phase?: string
    /** 类型：H5 RN */
    type?: string
    /** uiId版本 */
    ui?: string
    /** rn版本 */
    appRnVersion?: string
    /** 名称 */
    name?: string
    /** 是否找到面板 */
    rnFind?: boolean
    /** 面板配置 */
    uiConfig?: any
    /** 包下载地址相对路径 */
    content?: string
    /** 文件大小 */
    fileSize?: string
    /** 文件md5 */
    fileMd5?: string
    /** 包类型:0.全量包,1.拆分包 */
    rnBizPack?: number
    /** 包ID */
    bizClientId?: string
    /** 拆分包依赖组件列表 */
    uiComponentList?: UiComponent[]
  }

  export type RNPanelInfo = {
    /** 面板id */
    uiid?: string
    /** 面板信息 */
    uiInfo?: UiInfo
    /** Android 面板信息 */
    androidUiInfo?: UiInfo
    /** 多语言 */
    i18nTime?: number
  }

  export type MiniInfo = {
    /** 小程序额外信息 */
    extraMiniInfo?: any
  }

  export type ExtraPanelInfo = {
    /** RN面板信息 */
    rnPanelInfo?: RNPanelInfo
    /** 小程序信息 */
    miniInfo?: MiniInfo
  }

  export type RecommendSceneParams = {
    /** 来源 */
    source: string
    /** 场景模型 */
    sceneModel: any
  }

  export type RecommendSceneCallBack = {
    /** 返回状态，默认返回 true */
    status?: boolean
    /** 成功返回的类型。0-未操作，1-保存成功，2-点击不感兴趣 */
    type: number
    /** 返回的场景数据，可能为空 */
    data?: any
  }

  export type OpenDeviceExecutionAndAnutomationParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
    /** 页面标题，Android 需要 */
    title?: string
  }

  export type SaveSceneActionParams = {
    /** 设备id */
    deviceId: string
    /** 动作的索引位置 */
    taskPosition: number
    /** 动作执行器 */
    actionExecutor?: string
    /** 动作执行信息 */
    executorProperty: any
    /** 动作额外信息 */
    extraProperty: any
    /** 动作展示信息 */
    actionDisplayNew: any
  }

  export type ActionParams = {
    /**
     * 动作类型:device,smart,remind,delay
     * device:设备
     * smart:操作某个智能（执行智能、开关自动化）
     * remind:提醒
     * delay:延时
     */
    createType: string
    /**
     * 智能类型：scene,auto
     * scene:一键执行
     * auto：自动化
     */
    smartType: string
    /** 当前场景动作列表 */
    actionArray: SceneAction[]
  }

  export type ActionResponse = {
    /** 动作列表 */
    actionArray: SceneAction[]
  }

  export type EditActionParams = {
    /** 当前编辑的actionIndex */
    editIndex: string
    /** 智能类型 */
    smartType: string
    /** 动作列表 */
    actionArray: SceneAction[]
  }

  export type SceneDialogParams = {
    /**
     * 智能类型：scene,auto
     * scene:一键执行
     * auto：自动化
     */
    smartType?: string
    /** 颜色 */
    color?: string
    /** 图标 */
    icon?: string
    /** 图片 */
    image?: string
  }

  export type SceneDialogResponse = {
    /** 颜色 */
    color?: string
    /** 图标 */
    icon?: string
    /** 图片 */
    image?: string
  }

  export type PreConditionPageParams = {
    /** id */
    id?: string
    /** 固定值 timeCheck */
    condType?: string
    /** 规则 */
    expr?: Expr
  }

  export type PreConditionPageResponse = {
    /** id */
    id: string
    /** 固定值 timeCheck */
    condType: string
    /** 规则 */
    expr: Expr
  }

  export type ConditionParams = {
    /** 条件类型 */
    type: string
    /** 条件内容 */
    condition?: string
    /** 索引 */
    index?: number
  }

  export type ConditionResponse = {
    /** 条件类型 */
    type?: string
    /** 条件内容 */
    condition?: string
    /** 索引 */
    index?: number
  }

  export type CheckSupportShareParams = {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
  }

  export type CheckSupportShareResponse = {
    /**
     * support
     * 是否支持分享
     */
    support: boolean
  }

  export type GetRemainingShareTimesParams = {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
  }

  export type GetRemainingShareTimesResponse = {
    /**
     * times
     * 剩余分享次数，-1表示无限制
     */
    times: number
  }

  export type AddReceiverParams = {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * spaceId
     * 空间id, 也就是家庭id
     */
    spaceId: number
    /**
     * userAccount
     * 用户的账号
     */
    userAccount: string
  }

  export type AddReceiverResponse = {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    /**
     * nickName
     * 用户的昵称
     */
    nickName: string
    /**
     * userName
     * 用户的手机号或者邮箱
     */
    userName: string
  }

  export type RemoveReceiverParams = {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
  }

  export type GetReceiversParams = {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * page
     * 分页, based 1, 只对设备有效，群组会返回全部数据
     */
    page: number
    /**
     * pageSize
     * 分页大小, 只对设备有效，群组会返回全部数据
     */
    pageSize: number
  }

  export type GetReceiversResponse = {
    /**
     * receivers
     * 被分享者
     */
    receivers: Receiver[]
  }

  export type UpdateShareExpirationDateParams = {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    /**
     * shareMode
     * 分享模式, 0永久有效, 1一段时间有效, 只对设备分享起作用
     */
    shareMode: number
    /**
     * endTime
     * 分享结束时间, 单位毫秒, 只对设备分享起作用
     */
    endTime: number
  }

  export type GetRelationMembersResponse = {
    /**
     * members
     * 最近分享过的被分享者
     */
    members: Member[]
  }

  export type RemoveRelationMemberParams = {
    /**
     * uid
     * 用户id
     */
    uid: string
  }

  export type CreateShareInfoParams = {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * spaceId
     * 空间id, 也就是家庭id
     */
    spaceId: number
    /**
     * shareType
     * 分享类型 0账号 1QQ 2微信 3消息 4邮件 5复制 6更多 7联系人
     */
    shareType: number
    /**
     * shareCount
     * 分享数量
     */
    shareCount: number
  }

  export type CreateShareInfoResponse = {
    /**
     * content
     * 分享内容
     */
    content: string
    /**
     * code
     * 分享码
     */
    code: string
    /**
     * shortUrl
     * 短链
     */
    shortUrl: string
  }

  export type ValidateShareCodeParams = {
    /**
     * code
     * 分享码
     */
    code: string
  }

  export type ValidateShareCodeResponse = {
    /**
     * result
     * 是否有效
     */
    result: boolean
    /** 元数据 */
    originResult: any
  }

  export type GetShareCodeInfoParams = {
    /**
     * code
     * 分享码
     */
    code: string
  }

  export type GetShareCodeInfoResponse = {
    /**
     * appId
     * app的id
     */
    appId: string
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
    /**
     * resIcon
     * 设备或者群组的图标
     */
    resIcon: string
    /**
     * resName
     * 设备或者群组的名称
     */
    resName: string
    /**
     * nickName
     * 分享者的名称
     */
    nickName: string
    /**
     * shareSource
     * 分享来源 0账号 1QQ 2微信 3消息 4邮件 5复制 6更多 7联系人
     */
    shareSource: number
    /**
     * spaceId
     * 空间id,也就是家庭id
     */
    spaceId: number
  }

  export type AcceptShareInviteParams = {
    /**
     * code
     * 分享码
     */
    code: string
  }

  export type RemoveReceivedDeviceOrGroupParams = {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
  }

  export type GetSharersResponse = {
    /**
     * sharers
     * 分享者列表
     */
    sharers: Sharer[]
  }

  export type GetSharerNameOfDeviceOrGroupParams = {
    /**
     * resId
     * 设备id 或者 群组id
     */
    resId: string
    /**
     * resType
     * 资源类型, 1是设备, 2是群组
     */
    resType: number
  }

  export type GetSharerNameOfDeviceOrGroupResponse = {
    /**
     * userName
     * 用户的手机号或者邮箱
     */
    userName: string
  }

  export type GetSharerDetailParams = {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
  }

  export type GetSharerDetailResponse = {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    /**
     * account
     * 账号
     */
    account: string
    /**
     * name
     * 昵称
     */
    name: string
    /**
     * remarkName
     * 备注
     */
    remarkName: string
    /**
     * devices
     * 分享者共享的设备列表
     */
    devices: SharerDevice[]
  }

  export type RemoveSharerParams = {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
  }

  export type UpdateSharerParams = {
    /**
     * memberId
     * 用户关系id
     */
    memberId: number
    /**
     * name
     * 用户的昵称
     */
    name: string
  }

  export type DeviceListResponse = {
    /** groupId 群组id */
    groupId: string
    /** deviceList 设备列表 */
    deviceList: DeviceInfo_YFvMov[]
  }

  export type DeviceNumResponse = {
    /** groupId 群组id */
    groupId: string
    /** deviceNum 设备数量 */
    deviceNum: number
    devieNum: number
  }

  export type DpCodeParams = {
    /** groupId 群组id */
    groupId: string
    /** dpCode内容 */
    dpCode: string
  }

  export type SigMeshMultiDpDataParams = {
    /** groupId 群组id */
    groupId: string
    /** localId 群组本地标识 */
    localId: string
    /**
     * dp信息
     * 示例: dps: {"1" : true}
     */
    dps: any
    /** pcc mesh设备品类 */
    pcc: string
  }

  export type MeshLocalGroupParams = {
    /**
     * 整体说明
     * 支持2个版本:
     * 1、本地版本仅支持根据vendorIds进行过滤，为本地逻辑，设备列表APP本地根据meshCategory进行比对过滤，群组结果保存在设备上，云端不参与群组的列表获取与保存。
     * 2、云端版本支持根据pccs或者codes进行过滤，为云端逻辑，设备列表获取及群组设备关系保存在云端。
     * 本地版本参数：
     * {
     * "localId": "203a",
     * "vendorIds": "1F10,2F10"
     * }
     * 云端版本参数：
     * 1、pcc过滤，相当于旧版本的vendorIds
     * {
     * "localId": "203a",
     * "type": "0",
     * "pccs":  ["1210"],
     * "categoryCode": "7001"
     * }
     * 2、code过滤，根据二级品类进行过滤，目前云端只支持ykq和gykzq这两种遥控器
     * {
     * "localId": "203a",
     * "type": "1",
     * "codes": ["xxxx"],
     * "categoryCode": "7001"
     * }
     * 关于categoryCode：categoryCode  并非三级品类，与localId匹配范围为7001-7008；localId 为云端分配，步长为8，因此一个遥控器内部最多支持关联8个群组，localid为初始值依次+1，与之匹配的categoryCode从7001依次+1.
     * vendorIds 必传 可以为空字符串
     * devId 遥控器设备id
     */
    deviceId: string
    /** localId 群组本地标识 */
    localId: string
    /**
     * 遥控器群组本地版本，使用功能此参数，云端版本传空字符串
     * vendorIds 使用meshCategory进行设备列表筛选
     * 示例：vendorIds: "1F10,2F10"
     */
    vendorIds: string
    /**
     * 遥控器群组云端版本，使用此功能参数
     * type 筛选条件  0:pccs过滤，1：codes过滤
     */
    type?: string
    /**
     * 遥控器群组云端版本，使用此功能参数
     * pccs 使用meshCategory进行设备列表筛选
     * 示例：pccs: ["1F10","2F10"]
     */
    pccs?: string[]
    /**
     * 遥控器群组云端版本，使用此功能参数
     * codes 使用二级品类进行设备列表筛选
     * 示例：pccs: ["1F10","2F10"]
     */
    codes?: string[]
    /**
     * categoryCode  并非三级品类，与localId匹配范围为7001-7008；
     * localId 为云端分配，步长为8，因此一个遥控器内部最多支持关联8个群组，localid为初始值依次+1，与之匹配的categoryCode从7001依次+1.
     */
    categoryCode?: string
    /**
     * 是否支持低功耗,部分无线开关需要用到
     * 默认值:false
     */
    isSupportLowPower?: boolean
  }

  export type GroupIdListBean = {
    /** groupIdList 群组id 列表 */
    groupIdList: string[]
  }

  export type GroupInfoList = {
    /** group info 列表 */
    groupInfoList: GroupInfo[]
  }

  export type GetGroupPropertyResponse = {
    /** 群组属性信息 */
    result: any
  }

  export type SetGroupPropertyBean = {
    /** 群组id */
    groupId: string
    /** code 属性code */
    code: string
    /** value */
    value: string
  }

  export type Device_s3kwX9 = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type Space = {
    /**
     * spaceId
     * 家庭Id
     */
    spaceId: string
  }

  export type MatterManualCode = {
    /**
     * matterCode
     * matterCode 配网码
     */
    matterCode: string
  }

  export type MatterActivatorParam = {
    /**
     * matterCode
     * matterCode 配网码
     */
    matterCode: string
    /**
     * gwID
     * gwID 网关ID,必传
     */
    gwID: string
    /**
     * spaceID
     * spaceID 家庭ID,必传
     */
    spaceID: string
  }

  export type NodeParams = {
    /** nodeId */
    nodeId: string
    /** deviceId 网关id */
    deviceId: string
  }

  export type DeviceResult = {
    /** 设备id */
    deviceId: string
  }

  export type DpDataParams = {
    /** 设备模型 设备id */
    deviceId: string
    /** dpId */
    dpIds: Object[]
  }

  export type CheckOTAUpgradeStatusParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type CheckOTAUpgradeStatusResponse = {
    /**
     * status
     * 设备的固件版本状态 0已是最新版本、1有待升级的固件、2正在升级
     */
    status: number
  }

  export type OtaStatusResponse = {
    /**
     * status
     * 设备的固件版本状态 0已是最新版本、1有待升级的固件、2正在升级、3成功、4失败、5等待唤醒、6下载、7超时、13排队中、100准备中
     */
    status: number
  }

  export type OpenOTAUpgradeParams = {
    /**
     * deviceId
     * 设备 id
     */
    deviceId: string
  }

  export type ThingProperty = {
    /** 属性id */
    abilityId: number
    /** 访问模式: ro-只读, wr-只写, rw-读写 */
    accessMode: string
    /** 属性类型 */
    typeSpec: any
    /** 属性默认值 */
    defaultValue: {}
    /** 标识代码 */
    code: string
  }

  export type ThingAction = {
    /** 动作id */
    abilityId: number
    /** 动作的输入参数列表 */
    inputParams: {}[]
    /** 动作的输出参数列表 */
    outputParams: {}[]
    /** 标识代码 */
    code: string
  }

  export type ThingEvent = {
    /** 事件id */
    abilityId: number
    /** 事件的输出参数列表 */
    outputParams: {}[]
    /** 标识代码 */
    code: string
  }

  export type DeviceIsSupportThingModelParams = {
    /** 设备id */
    devId: string
  }

  export type DeviceIsSupportThingModelResponse = {
    /** 是否支持物模型控制 */
    isSupport: boolean
  }

  export type UpdateThingModelInfoParams = {
    /** 产品id */
    pid: string
    /** 产品版本号 */
    productVersion: string
  }

  export type GetDeviceThingModelInfoParams = {
    /** 设备id */
    devId: string
  }

  export type GetDeviceThingModelInfoResponse = {
    /** 物模型id */
    modelId: string
    /** 产品id */
    productId: string
    /** 产品版本 */
    productVersion: string
    /** 服务列表 */
    services: ServiceModel[]
    /** 扩展属性 */
    extensions: any
  }

  export type PublishThingModelMessageParams = {
    /** 设备id */
    devId: string
    /**
     * 类型
     * 0:属性, 1:动作, 2:事件
     */
    type: number
    /**
     * Example:
     * type == property:
     *     payload = {
     *      "color":"green",
     *         "brightness": 50
     *      }
     * type == action:
     *     payload = {
     *        "actionCode": "testAction",
     *        "inputParams": {
     *          "inputParam1":"value1",
     *          "inputParam2":"value2"
     *        }
     *     }
     */
    payload: any
  }

  export type SubscribeReceivedThingModelMessageParams = {
    /** 设备id */
    devId: string
  }

  export type UnSubscribeReceivedThingModelMessageParams = {
    /** 设备id */
    devId: string
  }

  export type InitReq = {
    /** 产品id */
    pid: string
  }

  export type InitRes = {
    /** 设备id */
    devId: string
  }
}
