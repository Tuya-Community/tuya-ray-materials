
declare namespace ty {
  
  export function stopAccelerometer(params?: {
    complete?: () => void
    success?: (params: null) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startAccelerometer(params?: {
    
    interval?: AccelerometerInterval
    complete?: () => void
    success?: (params: null) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getAudioFileDuration(params: {
    
    path: string
    complete?: () => void
    success?: (params: {
      
      duration: number
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

  
  export function authorize(params: {
    
    scope: string
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

  
  export function authorizeStatus(params: {
    
    scope: string
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

  
  export function navigateToMiniProgram(params?: {
    
    appId?: string
    
    path?: string
    
    position?: string
    
    extraData?: Record<string, any>
    
    envVersion?: string
    
    shortLink?: string
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

  
  export function startCompass(params?: {
    complete?: () => void
    success?: (params: null) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function stopCompass(params?: {
    complete?: () => void
    success?: (params: null) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function startDeviceMotionListening(params?: {
    
    interval?: DeviceMotionInterval
    complete?: () => void
    success?: (params: null) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function stopDeviceMotionListening(params?: {
    complete?: () => void
    success?: (params: null) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getTempDirectory(params?: {
    complete?: () => void
    success?: (params: {
      
      tempDirectory: string
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

  
  export function startGyroscope(params?: {
    
    interval?: GyroscopeInterval
    complete?: () => void
    success?: (params: null) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function stopGyroscope(params?: {
    complete?: () => void
    success?: (params: null) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function chooseImage(params?: {
    
    count?: number
    
    sizeType?: string[]
    
    sourceType?: string[]
    complete?: () => void
    success?: (params: {
      
      tempFilePaths: string[]
      
      tempFiles?: TempFileCB[]
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

  
  export function chooseMedia(params?: {
    
    count?: number
    
    mediaType?: string
    
    sourceType?: string[]
    
    maxDuration?: number
    complete?: () => void
    success?: (params: {
      
      type: string
      
      tempFiles?: TempMediaFileCB[]
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

  
  export function chooseCropImage(params?: {
    
    sourceType?: string[]
    complete?: () => void
    success?: (params: {
      
      path: string
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

  
  export function previewImage(params: {
    
    urls: string[]
    
    current: number
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

  
  export function getImageInfo(params: {
    
    src: string
    complete?: () => void
    success?: (params: {
      
      width: number
      
      height: number
      
      orientation: string
      
      type: string
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

  
  export function getVideoInfo(params: {
    
    src: string
    complete?: () => void
    success?: (params: {
      
      width: number
      
      height: number
      
      orientation: string
      
      type: string
      
      duration: number
      
      size: number
      
      fps: number
      
      bitrate: number
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

  
  export function saveVideoToPhotosAlbum(params: {
    
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

  
  export function showToast(params: {
    
    title: string
    
    icon?: string
    
    image?: string
    
    duration?: number
    
    mask?: boolean
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

  
  export function showModal(params: {
    
    title: string
    
    content?: string
    
    showCancel?: boolean
    
    cancelText?: string
    
    cancelColor?: string
    
    confirmText?: string
    
    confirmColor?: string
    complete?: () => void
    success?: (params: {
      
      confirm: boolean
      
      cancel: boolean
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

  
  export function showLoading(params: {
    
    title: string
    
    mask?: boolean
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

  
  export function showActionSheet(params: {
    
    alertText?: string
    
    itemList: string[]
    
    itemColor?: string
    complete?: () => void
    success?: (params: {
      
      tapIndex: number
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

  
  export function hideToast(params?: {
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

  
  export function hideLoading(params?: {
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

  
  export function makePhoneCall(params: {
    
    phoneNumber: string
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

  
  export function setClipboardData(params: {
    
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

  
  export function getClipboardData(params?: {
    complete?: () => void
    success?: (params: {
      
      data: string
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

  
  export function updateVolume(params: {
    
    value: number
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

  
  export function getCurrentVolume(params?: {
    complete?: () => void
    success?: (params: {
      
      value: number
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

  
  export function registerSystemVolumeChange(params?: {
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

  
  export function unRegisterSystemVolumeChange(params?: {
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

  
  export function getSystemSetting(params?: {
    complete?: () => void
    success?: (params: {
      
      bluetoothEnabled?: boolean
      
      locationEnabled?: boolean
      
      wifiEnabled?: boolean
      
      deviceOrientation?: string
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

  
  export function getDeviceInfo(params?: {
    complete?: () => void
    success?: (params: {
      
      abi: string
      
      brand: string
      
      model: string
      
      system: string
      
      platform: string
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

  
  export function getSystemInfo(params?: {
    complete?: () => void
    success?: (params: {
      is24Hour: boolean
      system: string
      brand: string
      model: string
      platform: string
      timezoneId: string
      pixelRatio: number
      screenWidth: number
      screenHeight: number
      windowWidth: number
      windowHeight: number
      statusBarHeight: number
      language: string
      safeArea: SafeArea
      albumAuthorized: boolean
      cameraAuthorized: boolean
      locationAuthorized: boolean
      microphoneAuthorized: boolean
      notificationAuthorized: boolean
      notificationAlertAuthorized: boolean
      notificationBadgeAuthorized: boolean
      notificationSoundAuthorized: boolean
      bluetoothEnabled: boolean
      locationEnabled: boolean
      wifiEnabled: boolean
      theme?: Themes
      deviceOrientation?: Orientation
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

  
  export function getSystemInfoSync(): {
    is24Hour: boolean
    system: string
    brand: string
    model: string
    platform: string
    timezoneId: string
    pixelRatio: number
    screenWidth: number
    screenHeight: number
    windowWidth: number
    windowHeight: number
    statusBarHeight: number
    language: string
    safeArea: SafeArea
    albumAuthorized: boolean
    cameraAuthorized: boolean
    locationAuthorized: boolean
    microphoneAuthorized: boolean
    notificationAuthorized: boolean
    notificationAlertAuthorized: boolean
    notificationBadgeAuthorized: boolean
    notificationSoundAuthorized: boolean
    bluetoothEnabled: boolean
    locationEnabled: boolean
    wifiEnabled: boolean
    theme?: Themes
    deviceOrientation?: Orientation
  }

  
  export function getWifiList(params?: {
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

  
  export function getConnectedWifi(params?: {
    
    partialInfo?: boolean
    complete?: () => void
    success?: (params: {
      
      SSID: string
      
      BSSID: string
      
      signalStrength: number
      
      secure: boolean
      
      frequency: number
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

  
  export function openSystemBluetoothSetting(params?: {
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

  
  export function getNetworkType(params?: {
    complete?: () => void
    success?: (params: {
      
      networkType: string
      
      signalStrength: number
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

  
  export function setScreenBrightness(params: {
    
    value: number
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

  
  export function getScreenBrightness(params?: {
    complete?: () => void
    success?: (params: {
      
      value: number
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

  
  export function setKeepScreenOn(params: {
    
    keepScreenOn: boolean
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

  
  export function vibrateShort(params: {
    
    type: string
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

  
  export function vibrateLong(params?: {
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

  
  export function scanCode(params?: {
    
    onlyFromCamera?: boolean
    
    scanType?: string[]
    complete?: () => void
    success?: (params: {
      
      result: string
      
      scanType: string
      
      charSet: string
      
      path: string
      
      rawData: string
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

  
  export function setStorage(params: {
    
    key: string
    
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

  
  export function setStorageSync(storageDataBean?: StorageDataBean): null

  
  export function getStorage(params: {
    
    key: string
    complete?: () => void
    success?: (params: {
      
      data?: string
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

  
  export function getStorageSync(storageKeyBean?: StorageKeyBean): {
    
    data?: string
  }

  
  export function removeStorage(params: {
    
    key: string
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

  
  export function removeStorageSync(storageKeyBean?: StorageKeyBean): null

  
  export function clearStorage(params?: {
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

  
  export function clearStorageSync(): null

  
  export function onSystemVolumeChangeEvent(
    listener: (params: CurrentVolumeResponse) => void
  ): void

  
  export function offSystemVolumeChangeEvent(
    listener: (params: CurrentVolumeResponse) => void
  ): void

  
  export function onGetWifiList(
    listener: (params: WifiListResponse) => void
  ): void

  
  export function offGetWifiList(
    listener: (params: WifiListResponse) => void
  ): void

  
  export function onRecordingEvent(
    listener: (params: AudioRecordBufferBean) => void
  ): void

  
  export function offRecordingEvent(
    listener: (params: AudioRecordBufferBean) => void
  ): void

  
  export function onAccelerometerChange(
    listener: (params: {
      
      x: number
      
      y: number
      
      z: number
    }) => void
  ): void

  
  export function offAccelerometerChange(
    listener: (params: {
      
      x: number
      
      y: number
      
      z: number
    }) => void
  ): void

  
  export function onCompassChange(
    listener: (params: {
      
      direction: number
      
      accuracy: string
    }) => void
  ): void

  
  export function offCompassChange(
    listener: (params: {
      
      direction: number
      
      accuracy: string
    }) => void
  ): void

  
  export function onDeviceMotionChange(
    listener: (params: {
      
      alpha: number
      
      beta: number
      
      gamma: number
    }) => void
  ): void

  
  export function offDeviceMotionChange(
    listener: (params: {
      
      alpha: number
      
      beta: number
      
      gamma: number
    }) => void
  ): void

  
  export function onGyroscopeChange(
    listener: (params: {
      
      x: number
      
      y: number
      
      z: number
    }) => void
  ): void

  
  export function offGyroscopeChange(
    listener: (params: {
      
      x: number
      
      y: number
      
      z: number
    }) => void
  ): void

  
  export function onMemoryWarning(
    listener: (params: {
      
      level: number
    }) => void
  ): void

  
  export function offMemoryWarning(
    listener: (params: {
      
      level: number
    }) => void
  ): void

  
  export function onBluetoothAdapterStateChange(
    listener: (params: {
      
      available: boolean
    }) => void
  ): void

  
  export function offBluetoothAdapterStateChange(
    listener: (params: {
      
      available: boolean
    }) => void
  ): void

  
  export function onNetworkStatusChange(
    listener: (params: {
      
      isConnected: boolean
      
      networkType: string
    }) => void
  ): void

  
  export function offNetworkStatusChange(
    listener: (params: {
      
      isConnected: boolean
      
      networkType: string
    }) => void
  ): void

  export enum WidgetVersionType {
    
    release = "release",

    
    preview = "preview",
  }

  export enum WidgetPosition {
    
    bottom = "bottom",

    
    top = "top",
  }

  export type Profile = {
    
    redirectStart: number
    
    redirectEnd: number
    
    fetchStart: number
    
    domainLookupStart: number
    
    domainLookupEnd: number
    
    connectStart: number
    
    connectEnd: number
    
    SSLconnectionStart: number
    
    SSLconnectionEnd: number
    
    requestStart: number
    
    requestEnd: number
    
    responseStart: number
    
    responseEnd: number
    
    rtt: number
    
    estimate_nettype: string
    
    httpRttEstimate: number
    
    transportRttEstimate: number
    
    downstreamThroughputKbpsEstimate: number
    
    throughputKbps: number
    
    peerIP: string
    
    port: number
    
    socketReused: boolean
    
    sendBytesCount: number
    
    receivedBytedCount: number
  }

  export type FileReadFileReqBean = {
    
    filePath: string
    
    encoding?: string
    
    position?: number
    
    length?: number
  }

  export type SaveFileSyncParams = {
    
    fileId: string
    
    tempFilePath: string
    
    filePath: string
  }

  export type FileStats = {
    
    mode: string
    
    size: number
    
    lastAccessedTime: number
    
    lastModifiedTime: number
    
    isDirectory: boolean
    
    isFile: boolean
  }

  export type FileStatsParams = {
    
    fileId: string
    
    path: string
    
    recursive?: boolean
  }

  export type MakeDirParams = {
    
    fileId: string
    
    dirPath: string
    
    recursive?: boolean
  }

  export type RemoveDirParams = {
    
    fileId: string
    
    dirPath: string
    
    recursive?: boolean
  }

  export type WriteFileParams = {
    
    fileId: string
    
    filePath: string
    
    data: string
    
    encoding?: string
  }

  export enum HTTPMethod {
    
    OPTIONS = "OPTIONS",

    
    GET = "GET",

    
    HEAD = "HEAD",

    
    POST = "POST",

    
    PUT = "PUT",

    
    DELETE = "DELETE",

    
    TRACE = "TRACE",

    
    CONNECT = "CONNECT",
  }

  export enum AccelerometerInterval {
    
    game = "game",

    
    ui = "ui",

    
    normal = "normal",
  }

  export enum DeviceMotionInterval {
    
    game = "game",

    
    ui = "ui",

    
    normal = "normal",
  }

  export enum GyroscopeInterval {
    
    game = "game",

    
    ui = "ui",

    
    normal = "normal",
  }

  export type TempFileCB = {
    
    path: string
    
    size?: number
  }

  export type TempMediaFileCB = {
    
    tempFilePath: string
    
    size: number
    
    duration: number
    
    height: number
    
    width: number
    
    thumbTempFilePath: string
    
    fileType: string
  }

  export type SafeArea = {
    left: number
    right: number
    top: number
    bottom: number
    width: number
    height: number
  }

  export enum Themes {
    dark = "dark",

    light = "light",
  }

  export enum Orientation {
    portrait = "portrait",

    landscape = "landscape",
  }

  export type StorageDataBean = {
    
    key: string
    
    data: string
  }

  export type StorageKeyBean = {
    
    key: string
  }

  export type CurrentVolumeResponse = {
    
    value: number
  }

  export type WifiListResponse = {
    
    wifiList: WifiInfo[]
  }

  export type AudioRecordBufferBean = {
    
    buffer: number[]
  }

  export type InnerAudioContext = {
    
    contextId: string
  }

  export type AudioFileParams = {
    
    path: string
  }

  export type AudioFileResponse = {
    
    duration: number
  }

  export type InnerAudioBean = {
    
    contextId: string
    
    src: string
    
    startTime?: number
    
    autoplay?: boolean
    
    loop?: boolean
    
    volume?: number
    
    playbackRate?: number
  }

  export type InnerAudioSeekBean = {
    
    contextId: string
    
    position?: number
  }

  export type AuthorizeBean = {
    
    scope: string
  }

  export type ToMiniProgramBean = {
    
    appId?: string
    
    path?: string
    
    position?: string
    
    extraData?: Record<string, any>
    
    envVersion?: string
    
    shortLink?: string
  }

  export type MiniWidgetDeploysBean = {
    
    dialogId: string
    
    appId: string
    
    pagePath?: string
    
    deviceId?: string
    
    groupId?: string
    
    style?: string
    
    versionType?: WidgetVersionType
    
    version?: string
    
    position?: WidgetPosition
    
    autoDismiss?: boolean
  }

  export type MiniWidgetDialogBean = {
    
    dialogId: string
  }

  export type DeviceMotionBean = {
    
    interval?: DeviceMotionInterval
  }

  export type DownLoadBean = {
    
    requestId: string
    
    url: string
    
    header?: Record<string, string>
    
    timeout?: number
    
    filePath?: string
  }

  export type DownLoadResult = {
    
    tempFilePath: string
    
    filePath: string
    
    statusCode: number
    
    profile: Profile
  }

  export type RequestBean = {
    
    requestId: string
  }

  export type AccessFileParams = {
    
    path: string
  }

  export type ReadFileBean = {
    
    data: string
  }

  export type SaveFileSyncCallback = {
    
    savedFilePath: string
  }

  export type TempDirectoryResponse = {
    
    tempDirectory: string
  }

  export type FileStatsResponse = {
    
    fileStatsList: FileStats[]
  }

  export type RemoveFileParams = {
    
    fileId: string
    
    filePath: string
  }

  export type GyroscopeBean = {
    
    interval?: GyroscopeInterval
  }

  export type ChooseImageBean = {
    
    count?: number
    
    sizeType?: string[]
    
    sourceType?: string[]
  }

  export type ChooseImageCB = {
    
    tempFilePaths: string[]
    
    tempFiles?: TempFileCB[]
  }

  export type ChooseMediaBean = {
    
    count?: number
    
    mediaType?: string
    
    sourceType?: string[]
    
    maxDuration?: number
  }

  export type ChooseMediaCB = {
    
    type: string
    
    tempFiles?: TempMediaFileCB[]
  }

  export type ChooseCropImageBean = {
    
    sourceType?: string[]
  }

  export type ChooseCropImageCB = {
    
    path: string
  }

  export type PreviewImageBean = {
    
    urls: string[]
    
    current: number
  }

  export type GetImageInfoParams = {
    
    src: string
  }

  export type ImageInfoCB = {
    
    width: number
    
    height: number
    
    orientation: string
    
    type: string
  }

  export type GetVideoInfoParams = {
    
    src: string
  }

  export type VideoInfoCB = {
    
    width: number
    
    height: number
    
    orientation: string
    
    type: string
    
    duration: number
    
    size: number
    
    fps: number
    
    bitrate: number
  }

  export type SaveVideoParams = {
    
    filePath: string
  }

  export type ToastBean = {
    
    title: string
    
    icon?: string
    
    image?: string
    
    duration?: number
    
    mask?: boolean
  }

  export type ModalBean = {
    
    title: string
    
    content?: string
    
    showCancel?: boolean
    
    cancelText?: string
    
    cancelColor?: string
    
    confirmText?: string
    
    confirmColor?: string
  }

  export type ModalCallback = {
    
    confirm: boolean
    
    cancel: boolean
  }

  export type LoadingBean = {
    
    title: string
    
    mask?: boolean
  }

  export type ActionSheet = {
    
    alertText?: string
    
    itemList: string[]
    
    itemColor?: string
  }

  export type ActionSheetCallback = {
    
    tapIndex: number
  }

  export type HTTPRequest = {
    
    url: string
    
    taskId: string
    
    data?: string
    
    header?: Record<string, string>
    
    timeout?: number
    
    method?: HTTPMethod
    
    dataType?: any
    
    responseType?: string
    
    enableHttp2?: boolean
    
    enableQuic?: boolean
    
    enableCache?: boolean
  }

  export type SuccessResult = {
    
    data: string
    
    statusCode: number
    
    header: Record<string, string>
    
    cookies: string[]
    
    profile: Profile
    
    taskId: string
  }

  export type RequestContext = {
    
    taskId: string
  }

  export type PhoneCallBean = {
    
    phoneNumber: string
  }

  export type ClipboradDataBean = {
    
    data: string
  }

  export type WifiInfo = {
    
    SSID: string
    
    BSSID: string
    
    signalStrength: number
    
    secure: boolean
    
    frequency: number
  }

  export type UpdateVolumeParams = {
    
    value: number
  }

  export type SystemSetting = {
    
    bluetoothEnabled?: boolean
    
    locationEnabled?: boolean
    
    wifiEnabled?: boolean
    
    deviceOrientation?: string
  }

  export type DeviceInfoResponse = {
    
    abi: string
    
    brand: string
    
    model: string
    
    system: string
    
    platform: string
  }

  export type SystemInfo = {
    is24Hour: boolean
    system: string
    brand: string
    model: string
    platform: string
    timezoneId: string
    pixelRatio: number
    screenWidth: number
    screenHeight: number
    windowWidth: number
    windowHeight: number
    statusBarHeight: number
    language: string
    safeArea: SafeArea
    albumAuthorized: boolean
    cameraAuthorized: boolean
    locationAuthorized: boolean
    microphoneAuthorized: boolean
    notificationAuthorized: boolean
    notificationAlertAuthorized: boolean
    notificationBadgeAuthorized: boolean
    notificationSoundAuthorized: boolean
    bluetoothEnabled: boolean
    locationEnabled: boolean
    wifiEnabled: boolean
    theme?: Themes
    deviceOrientation?: Orientation
  }

  export type GetConnectedWifiParams = {
    
    partialInfo?: boolean
  }

  export type NetworkTypeCB = {
    
    networkType: string
    
    signalStrength: number
  }

  export type ScreenBean = {
    
    value: number
  }

  export type SetKeepScreenOnParam = {
    
    keepScreenOn: boolean
  }

  export type TUNIVibrateBean = {
    
    type: string
  }

  export type AudioStart = {
    
    duration?: number
    
    sampleRate?: number
    
    numberOfChannels?: number
    
    encodeBitRate?: number
    
    format?: string
    
    frameSize: number
    
    audioSource?: string
    
    contextId: string
  }

  export type AudioRecordResult = {
    
    tempFilePath: string
  }

  export type AudioRecordContext = {
    
    contextId: string
  }

  export type AudioRecordingRequest = {
    
    contextId: string
    
    period: number
  }

  export type ScanCodeBean = {
    
    onlyFromCamera?: boolean
    
    scanType?: string[]
  }

  export type ScanCodeResult = {
    
    result: string
    
    scanType: string
    
    charSet: string
    
    path: string
    
    rawData: string
  }

  export type StorageCallback = {
    
    data?: string
  }

  export type UpLoadBean = {
    
    requestId: string
    
    url: string
    
    filePath: string
    
    name: string
    
    header?: Record<string, string>
    
    formData?: Record<string, string>
    
    timeout?: number
  }

  export type UpLoadResult = {
    
    data: string
    
    statusCode: number
  }

  
  interface CreateInnerAudioContextTask {
    
    pause(params: {
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

    
    resume(params: {
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

    
    play(params: {
      
      src: string
      
      startTime?: number
      
      autoplay?: boolean
      
      loop?: boolean
      
      volume?: number
      
      playbackRate?: number
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

    
    seek(params: {
      
      position?: number
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

    
    stop(params: {
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

    
    destroy(params: {
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

    
    onTimeUpdate(
      listener: (params: {
        
        contextId: string
        
        time: number
      }) => void
    ): void
  }
  export function createInnerAudioContext(params?: {
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
  }): CreateInnerAudioContextTask

  
  interface MiniWidgetDialogTask {
    
    dismissMiniWidget(params: {
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

    
    onWidgetDismiss(
      listener: (params: {
        
        dialogId: string
      }) => void
    ): void

    
    offWidgetDismiss(
      listener: (params: {
        
        dialogId: string
      }) => void
    ): void
  }
  export function openMiniWidget(params: {
    
    appId: string
    
    pagePath?: string
    
    deviceId?: string
    
    groupId?: string
    
    style?: string
    
    versionType?: WidgetVersionType
    
    version?: string
    
    position?: WidgetPosition
    
    autoDismiss?: boolean
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
  }): MiniWidgetDialogTask

  
  interface DownloadFileTask {
    
    abort(params: {
      complete?: () => void
      success?: (params: null) => void
      failure?: (params: {
        errorMsg: string
        errorCode: string | number
        innerError: {
          errorCode: string | number
          errorMsg: string
        }
      }) => void
    }): void

    
    onHeadersReceived(
      listener: (params: {
        
        header: Record<string, string>
        
        requestId: string
      }) => void
    ): void

    
    offHeadersReceived(
      listener: (params: {
        
        header: Record<string, string>
        
        requestId: string
      }) => void
    ): void

    
    onProgressUpdate(
      listener: (params: {
        
        progress: number
        
        totalBytesSent: number
        
        totalBytesExpectedToSend: number
        
        requestId: string
      }) => void
    ): void

    
    offProgressUpdate(
      listener: (params: {
        
        progress: number
        
        totalBytesSent: number
        
        totalBytesExpectedToSend: number
        
        requestId: string
      }) => void
    ): void
  }
  export function downloadFile(params: {
    
    url: string
    
    header?: Record<string, string>
    
    timeout?: number
    
    filePath?: string
    complete?: () => void
    success?: (params: {
      
      tempFilePath: string
      
      filePath: string
      
      statusCode: number
      
      profile: Profile
    }) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): DownloadFileTask

  
  interface GetFileSystemManagerTask {
    
    access(params: {
      
      path: string
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

    
    readFile(params: {
      
      filePath: string
      
      encoding?: string
      
      position?: number
      
      length?: number
      complete?: () => void
      success?: (params: {
        
        data: string
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

    
    readFileSync(req?: FileReadFileReqBean): {
      
      data: string
    }

    
    saveFile(params: {
      
      tempFilePath: string
      
      filePath: string
      complete?: () => void
      success?: (params: {
        
        savedFilePath: string
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

    
    saveFileSync(params?: SaveFileSyncParams): {
      
      savedFilePath: string
    }

    
    stat(params: {
      
      path: string
      
      recursive?: boolean
      complete?: () => void
      success?: (params: {
        
        fileStatsList: FileStats[]
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

    
    statSync(params?: FileStatsParams): {
      
      fileStatsList: FileStats[]
    }

    
    mkdir(params: {
      
      dirPath: string
      
      recursive?: boolean
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

    
    mkdirSync(params?: MakeDirParams): null

    
    rmdir(params: {
      
      dirPath: string
      
      recursive?: boolean
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

    
    rmdirSync(params?: RemoveDirParams): null

    
    writeFile(params: {
      
      filePath: string
      
      data: string
      
      encoding?: string
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

    
    writeFileSync(params?: WriteFileParams): null

    
    removeSavedFile(params: {
      
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
  }
  export function getFileSystemManager(params?: {
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
  }): GetFileSystemManagerTask

  
  interface RequestTask {
    
    abort(params: {
      complete?: () => void
      success?: (params: null) => void
      failure?: (params: {
        errorMsg: string
        errorCode: string | number
        innerError: {
          errorCode: string | number
          errorMsg: string
        }
      }) => void
    }): void

    
    onHeadersReceived(
      listener: (params: {
        
        header: Record<string, string>
        
        requestId: string
      }) => void
    ): void

    
    offHeadersReceived(
      listener: (params: {
        
        header: Record<string, string>
        
        requestId: string
      }) => void
    ): void
  }
  export function request(params: {
    
    url: string
    
    data?: string
    
    header?: Record<string, string>
    
    timeout?: number
    
    method?: HTTPMethod
    
    dataType?: any
    
    responseType?: string
    
    enableHttp2?: boolean
    
    enableQuic?: boolean
    
    enableCache?: boolean
    complete?: () => void
    success?: (params: {
      
      data: string
      
      statusCode: number
      
      header: Record<string, string>
      
      cookies: string[]
      
      profile: Profile
      
      taskId: string
    }) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): RequestTask

  
  interface GetRecorderManagerTask {
    
    start(params: {
      
      duration?: number
      
      sampleRate?: number
      
      numberOfChannels?: number
      
      encodeBitRate?: number
      
      format?: string
      
      frameSize: number
      
      audioSource?: string
      complete?: () => void
      success?: (params: {
        
        tempFilePath: string
      }) => void
      failure?: (params: {
        errorMsg: string
        errorCode: string | number
        innerError: {
          errorCode: string | number
          errorMsg: string
        }
      }) => void
    }): void

    
    resume(params: {
      complete?: () => void
      success?: (params: {
        
        tempFilePath: string
      }) => void
      failure?: (params: {
        errorMsg: string
        errorCode: string | number
        innerError: {
          errorCode: string | number
          errorMsg: string
        }
      }) => void
    }): void

    
    pause(params: {
      complete?: () => void
      success?: (params: {
        
        tempFilePath: string
      }) => void
      failure?: (params: {
        errorMsg: string
        errorCode: string | number
        innerError: {
          errorCode: string | number
          errorMsg: string
        }
      }) => void
    }): void

    
    stop(params: {
      complete?: () => void
      success?: (params: {
        
        tempFilePath: string
      }) => void
      failure?: (params: {
        errorMsg: string
        errorCode: string | number
        innerError: {
          errorCode: string | number
          errorMsg: string
        }
      }) => void
    }): void

    
    startRecording(params: {
      
      period: number
      complete?: () => void
      success?: (params: null) => void
      failure?: (params: {
        errorMsg: string
        errorCode: string | number
        innerError: {
          errorCode: string | number
          errorMsg: string
        }
      }) => void
    }): void

    
    stopRecording(params: {
      complete?: () => void
      success?: (params: null) => void
      failure?: (params: {
        errorMsg: string
        errorCode: string | number
        innerError: {
          errorCode: string | number
          errorMsg: string
        }
      }) => void
    }): void
  }
  export function getRecorderManager(params?: {
    complete?: () => void
    success?: (params: null) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): GetRecorderManagerTask

  
  interface UploadFileTask {
    
    abort(params: {
      complete?: () => void
      success?: (params: null) => void
      failure?: (params: {
        errorMsg: string
        errorCode: string | number
        innerError: {
          errorCode: string | number
          errorMsg: string
        }
      }) => void
    }): void

    
    onHeadersReceived(
      listener: (params: {
        
        header: Record<string, string>
        
        requestId: string
      }) => void
    ): void

    
    offHeadersReceived(
      listener: (params: {
        
        header: Record<string, string>
        
        requestId: string
      }) => void
    ): void

    
    onProgressUpdate(
      listener: (params: {
        
        progress: number
        
        totalBytesSent: number
        
        totalBytesExpectedToSend: number
        
        requestId: string
      }) => void
    ): void

    
    offProgressUpdate(
      listener: (params: {
        
        progress: number
        
        totalBytesSent: number
        
        totalBytesExpectedToSend: number
        
        requestId: string
      }) => void
    ): void
  }
  export function uploadFile(params: {
    
    url: string
    
    filePath: string
    
    name: string
    
    header?: Record<string, string>
    
    formData?: Record<string, string>
    
    timeout?: number
    complete?: () => void
    success?: (params: {
      
      data: string
      
      statusCode: number
    }) => void
    failure?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): UploadFileTask
}
