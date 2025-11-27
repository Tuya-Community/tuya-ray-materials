
declare namespace ty {
  
  export function apiRequestByAtop(params: {
    
    api: string
    
    version?: string
    
    postData: Record<string, any>
    
    extData?: Record<string, any>
    complete?: () => void
    success?: (params: {
      
      thing_json_?: {}
      
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

  
  export function event(params: {
    
    eventId: string
    
    event: Record<string, {}>
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

  
  export function beginEvent(params: {
    
    eventName: string
    
    identifier: string
    
    attributes: Record<string, {}>
    
    infos: Record<string, {}>
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

  
  export function trackEvent(params: {
    
    eventName: string
    
    identifier: string
    
    attributes: Record<string, {}>
    
    infos: Record<string, {}>
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

  
  export function endEvent(params: {
    
    eventName: string
    
    identifier: string
    
    attributes: Record<string, {}>
    
    infos: Record<string, {}>
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

  
  export function getAppInfo(params?: {
    complete?: () => void
    success?: (params: {
      
      serverTimestamp: number
      appVersion: string
      language: string
      countryCode: string
      regionCode: string
      
      appName: string
      
      appIcon: string
      
      appEnv?: number
      
      appBundleId: string
      
      appScheme: string
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

  
  export function getCurrentWifiSSID(params?: {
    complete?: () => void
    success?: (params: {
      
      ssId: string
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

  
  export function openCountrySelectPage(params?: {
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

  
  export function getIconfontInfo(params?: {
    complete?: () => void
    success?: (params: {
      
      nameMap: string
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

  
  export function uploadImage(params: {
    
    filePath: string
    
    bizType: string
    
    contentType?: string
    
    delayTime?: number
    
    pollMaxCount?: number
    complete?: () => void
    success?: (params: {
      
      result: string
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

  
  export function getLangKey(params?: {
    complete?: () => void
    success?: (params: {
      
      langKey: string
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

  
  export function getLangContent(params?: {
    complete?: () => void
    success?: (params: {
      
      langContent: {}
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

  
  export function openRNPanel(params: {
    
    deviceId: string
    
    uiId: string
    
    panelUiInfoBean?: PanelUiInfoBean
    
    initialProps?: Record<string, {}>
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

  
  export function openPanel(params: {
    
    deviceId: string
    
    extraInfo?: PanelExtraParams
    
    initialProps?: Record<string, {}>
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

  
  export function preloadPanel(params: {
    
    deviceId: string
    
    extraInfo?: PanelExtraParams
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

  
  export function openInnerH5(params: {
    
    url: string
    
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

  
  export function openAppSystemSettingPage(params: {
    
    scope: string
    
    requestCode?: number
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

  
  export function openSystemSettingPage(params: {
    
    scope: string
    
    requestCode?: number
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

  
  export function emitChannel(params: {
    
    eventName: string
    
    event?: {}
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

  
  export function router(params: {
    
    url: string
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

  
  export function canIUseRouter(params: {
    
    url: string
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

  
  export function goDeviceDetail(params: {
    
    deviceId: string
    
    groupId?: string
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

  
  export function goDeviceAlarm(params: {
    
    deviceId: string
    
    groupId?: string
    
    category?: string
    
    repeat?: number
    
    timerConfig?: TimeConfig
    
    data: {}[]
    
    enableFilter?: boolean
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

  
  export function share(params: {
    
    type: string
    
    title: string
    
    message: string
    
    contentType: string
    
    recipients?: string[]
    
    imagePath?: string
    
    filePath?: string
    
    webPageUrl?: string
    
    miniProgramInfo?: MiniProgramInfo
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

  
  export function getShareChannelList(params?: {
    complete?: () => void
    success?: (params: {
      
      shareChannelList: string[]
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

  
  export function getUserInfo(params?: {
    complete?: () => void
    success?: (params: {
      
      nickName: string
      
      avatarUrl: string
      
      phoneCode: string
      
      isTemporaryUser: boolean
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

  
  export function resizeImage(params: {
    
    aspectFitWidth: number
    
    aspectFitHeight: number
    
    maxFileSize?: number
    
    path: string
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

  
  export function rotateImage(params: {
    
    path: string
    
    orientation: number
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

  
  export function saveToAlbum(params: {
    
    url: string
    
    encryptKey: string
    
    orientation: number
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

  
  export function onCountrySelectResult(
    listener: (params: CountrySelectResultResponse) => void
  ): void

  
  export function offCountrySelectResult(
    listener: (params: CountrySelectResultResponse) => void
  ): void

  
  export function onUploadProgressUpdate(
    listener: (params: ProgressEvent) => void
  ): void

  
  export function offUploadProgressUpdate(
    listener: (params: ProgressEvent) => void
  ): void

  
  export function onReceiveMessage(
    listener: (params: EventChannelMessageParams) => void
  ): void

  
  export function offReceiveMessage(
    listener: (params: EventChannelMessageParams) => void
  ): void

  
  export function onRouterEvent(listener: (params: RouterEvent) => void): void

  
  export function offRouterEvent(listener: (params: RouterEvent) => void): void

  
  export function onRouterResult(
    listener: (params: RouterResultResponse) => void
  ): void

  
  export function offRouterResult(
    listener: (params: RouterResultResponse) => void
  ): void

  export type PanelUiInfoBean = {
    
    phase?: string
    
    type?: string
    
    ui?: string
    
    version?: string
    
    appRnVersion?: string
    
    name?: string
    
    uiConfig?: Record<string, {}>
    
    rnFind?: boolean
    
    pid?: string
    
    i18nTime?: number
  }

  export type PanelExtraParams = {
    
    productId: string
    
    productVersion: string
    
    i18nTime: string
    
    bizClientId: string
    
    uiType?: string
    
    uiPhase?: string
  }

  export type TimeConfig = {
    
    background: string
  }

  export type MiniProgramInfo = {
    
    userName: string
    
    path: string
    
    hdImagePath: string
    
    withShareTicket: boolean
    
    miniProgramType: number
    
    webPageUrl: string
  }

  export type CountrySelectResultResponse = {
    
    countryCode?: string
    
    countryAbb?: string
    
    countryName?: string
  }

  export type ProgressEvent = {
    
    filePath: string
    
    progress: number
  }

  export type EventChannelMessageParams = {
    
    eventId: string
    
    event?: {}
  }

  export type RouterEvent = {
    
    bizEventName: string
    
    bizEventData: Object
  }

  export type RouterResultResponse = {
    
    url: string
    
    data?: string
  }

  export type EventBean = {
    
    eventId: string
    
    event: Record<string, {}>
  }

  export type TrackEventBean = {
    
    eventName: string
    
    identifier: string
    
    attributes: Record<string, {}>
    
    infos: Record<string, {}>
  }

  export type AppInfoBean = {
    
    serverTimestamp: number
    appVersion: string
    language: string
    countryCode: string
    regionCode: string
    
    appName: string
    
    appIcon: string
    
    appEnv?: number
    
    appBundleId: string
    
    appScheme: string
  }

  export type SystemWirelessInfoBean = {
    
    ssId: string
  }

  export type IconfontInfoBean = {
    
    nameMap: string
  }

  export type UploadParams = {
    
    filePath: string
    
    bizType: string
    
    contentType?: string
    
    delayTime?: number
    
    pollMaxCount?: number
  }

  export type UploadResponse = {
    
    result: string
  }

  export type LocalConstants = {
    
    langKey: string
    
    langContent: {}
  }

  export type LangKeyResult = {
    
    langKey: string
  }

  export type LangContentResult = {
    
    langContent: {}
  }

  export type PanelBean = {
    
    deviceId: string
    
    uiId: string
    
    panelUiInfoBean?: PanelUiInfoBean
    
    initialProps?: Record<string, {}>
  }

  export type PanelParams = {
    
    deviceId: string
    
    extraInfo?: PanelExtraParams
    
    initialProps?: Record<string, {}>
  }

  export type PreloadPanelParams = {
    
    deviceId: string
    
    extraInfo?: PanelExtraParams
  }

  export type WebViewBean = {
    
    url: string
    
    title?: string
  }

  export type SettingPageBean = {
    
    scope: string
    
    requestCode?: number
  }

  export type EventEmitChannelParams = {
    
    eventName: string
    
    event?: {}
  }

  export type EventChannelParams = {
    
    eventId: string
    
    eventName: string
  }

  export type EventOffChannelParams = {
    
    eventId: string
  }

  export type Object = {}

  export type RouterBean = {
    
    url: string
  }

  export type RouteUsageResult = {
    
    result: boolean
  }

  export type DeviceDetailBean = {
    
    deviceId: string
    
    groupId?: string
  }

  export type AlarmBean = {
    
    deviceId: string
    
    groupId?: string
    
    category?: string
    
    repeat?: number
    
    timerConfig?: TimeConfig
    
    data: {}[]
    
    enableFilter?: boolean
  }

  export type ShareInformationBean = {
    
    type: string
    
    title: string
    
    message: string
    
    contentType: string
    
    recipients?: string[]
    
    imagePath?: string
    
    filePath?: string
    
    webPageUrl?: string
    
    miniProgramInfo?: MiniProgramInfo
  }

  export type ShareChannelResponse = {
    
    shareChannelList: string[]
  }

  export type UserInfoResult = {
    
    nickName: string
    
    avatarUrl: string
    
    phoneCode: string
    
    isTemporaryUser: boolean
  }

  export type ImageResizeBean = {
    
    aspectFitWidth: number
    
    aspectFitHeight: number
    
    maxFileSize?: number
    
    path: string
  }

  export type ImageResizeResultBean = {
    
    path: string
  }

  export type ImageRotateBean = {
    
    path: string
    
    orientation: number
  }

  export type ImageEncryptBean = {
    
    url: string
    
    encryptKey: string
    
    orientation: number
  }

  
  interface RegisterChannelTask {
    
    unRegisterChannel(params: {
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
  export function registerChannel(params: {
    
    eventName: string
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
  }): RegisterChannelTask
}
