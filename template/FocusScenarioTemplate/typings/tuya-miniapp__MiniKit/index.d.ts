
declare namespace ty {
  
  export function nativeDisabled(params: {
    
    nativeDisabled: boolean
    
    pageId: string
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

  
  export function nativeInovke(params: {
    
    type?: number
    
    apiName: string
    
    id: string
    
    pageId: string
    
    params: Record<string, string>
    complete?: () => void
    success?: (params: {}) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  
  export function getPermissionConfig(params?: {
    complete?: () => void
    success?: (params: {
      
      result: Record<string, any>
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

  
  export function getPermissionConfigSync(): {
    
    result: Record<string, any>
  }

  
  export function openSetting(params?: {
    complete?: () => void
    success?: (params: {
      
      scope: Record<string, boolean>
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

  
  export function changeDebugMode(params: {
    
    isEnable: boolean
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

  
  export function openHelpCenter(params?: {
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

  
  export function showTabBarRedDot(params: {
    
    index: number
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

  
  export function showTabBar(params: {
    
    animation: boolean
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

  
  export function setTabBarStyle(params: {
    
    color: string
    
    selectedColor: string
    
    backgroundColor: string
    
    borderStyle: string
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

  
  export function setTabBarItem(params: {
    
    index: number
    
    text: string
    
    iconPath: string
    
    selectedIconPath: string
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

  
  export function setTabBarBadge(params: {
    
    index: number
    
    text: string
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

  
  export function removeTabBarBadge(params: {
    
    index: number
    
    text: string
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

  
  export function hideTabBarRedDot(params: {
    
    index: number
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

  
  export function hideTabBar(params: {
    
    animation: boolean
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

  
  export function apiRequestByHighway(params: {
    
    api: string
    
    data?: Record<string, any>
    
    method?: HighwayMethod
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

  
  export function navigateBackMiniProgram(params?: {
    
    extraData?: Record<string, any>
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

  
  export function exitMiniProgram(params?: {
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

  
  export function getLaunchOptions(params?: {
    complete?: () => void
    success?: (params: {
      
      path: string
      
      query: Record<string, any>
      
      referrerInfo: ReferrerInfo
      
      apiCategory?: string
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

  
  export function getLaunchOptionsSync(): {
    
    path: string
    
    query: Record<string, any>
    
    referrerInfo: ReferrerInfo
    
    apiCategory?: string
  }

  
  export function getEnterOptions(params?: {
    complete?: () => void
    success?: (params: {
      
      path: string
      
      query: Record<string, any>
      
      referrerInfo: ReferrerInfo
      
      apiCategory?: string
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

  
  export function getEnterOptionsSync(): {
    
    path: string
    
    query: Record<string, any>
    
    referrerInfo: ReferrerInfo
    
    apiCategory?: string
  }

  
  export function setBoardTitle(params: {
    
    title: string
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

  
  export function setBoardTitleSync(boardBean?: BoardBean): null

  
  export function getMenuButtonBoundingClientRect(params?: {
    complete?: () => void
    success?: (params: {
      
      width: number
      
      height: number
      
      top: number
      
      right: number
      
      bottom: number
      
      left: number
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

  
  export function getMenuButtonBoundingClientRectSync(): {
    
    width: number
    
    height: number
    
    top: number
    
    right: number
    
    bottom: number
    
    left: number
  }

  
  export function preDownloadMiniApp(params: {
    
    miniAppId: string
    
    miniAppVersion?: string
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

  
  export function login(params?: {
    
    timeout?: number
    complete?: () => void
    success?: (params: {
      
      code: string
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

  
  export function setPageOrientation(params: {
    
    pageOrientation: string
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

  
  export function hideMenuButton(params?: {
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

  
  export function showMenuButton(params?: {
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

  
  export function showStatusBar(params?: {
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

  
  export function hideStatusBar(params?: {
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

  
  export function exitMiniWidget(params?: {
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

  
  export function canOpenURL(params: {
    
    url: string
    complete?: () => void
    success?: (params: {
      
      isCanOpen?: boolean
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

  
  export function canOpenURLSync(openURLBean?: OpenURLBean): {
    
    isCanOpen?: boolean
  }

  
  export function openURL(params: {
    
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

  
  export function showNavigationBarLoading(params?: {
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

  
  export function setNavigationBarTitle(params: {
    
    title: string
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

  
  export function setNavigationBarColor(params: {
    
    frontColor: string
    
    backgroundColor: string
    
    animation: NavigationBarColorAnimationInfo
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

  
  export function hideNavigationBarLoading(params?: {
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

  
  export function hideHomeButton(params?: {
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

  
  export function navigateTo(params: {
    
    url: string
    
    type?: string
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

  
  export function navigateBack(params?: {
    
    delta?: number
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

  
  export function redirectTo(params: {
    
    url: string
    
    type?: string
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

  
  export function reLaunch(params: {
    
    url: string
    
    type?: string
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

  
  export function switchTab(params: {
    
    url: string
    
    type?: string
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

  
  export function extApiCanIUse(params: {
    
    api: string
    
    params?: Record<string, any>
    complete?: () => void
    success?: (params: {
      
      result: boolean
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

  
  export function extApiCanIUseSync(extApiBean?: ExtApiBean): {
    
    result: boolean
  }

  
  export function extApiInvoke(params: {
    
    api: string
    
    params?: Record<string, any>
    complete?: () => void
    success?: (params: {
      
      data?: {}
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

  
  export function extApiInvokeSync(extApiBean?: ExtApiBean): {
    
    data?: {}
  }

  
  export function startPullDownRefresh(params?: {
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

  
  export function stopPullDownRefresh(params?: {
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

  
  export function onNativeEvent(
    listener: (params: NativeUploadData) => void
  ): void

  
  export function offNativeEvent(
    listener: (params: NativeUploadData) => void
  ): void

  export enum HighwayMethod {
    
    OPTIONS = "OPTIONS",

    
    GET = "GET",

    
    HEAD = "HEAD",

    
    POST = "POST",

    
    PUT = "PUT",

    
    DELETE = "DELETE",

    
    TRACE = "TRACE",

    
    CONNECT = "CONNECT",
  }

  export type ReferrerInfo = {
    
    appId: string
    
    extraData: Record<string, any>
  }

  export type BoardBean = {
    
    title: string
  }

  export type OpenURLBean = {
    
    url: string
  }

  export type NavigationBarColorAnimationInfo = {
    
    duration?: number
    
    timingFunc?: string
  }

  export type ExtApiBean = {
    
    api: string
    
    params?: Record<string, any>
  }

  export type NativeUploadData = {
    
    eventName: string
    
    id: string
    
    pageId: string
    
    data: Record<string, Object>
  }

  export type Object = {}

  export type NativeDisabledParam = {
    
    nativeDisabled: boolean
    
    pageId: string
  }

  export type NativeParams = {
    
    type?: number
    
    apiName: string
    
    id: string
    
    pageId: string
    
    params: Record<string, string>
  }

  export type PermissionConfig = {
    
    result: Record<string, any>
  }

  export type AuthSetting = {
    
    scope: Record<string, boolean>
  }

  export type DebugModeSetting = {
    
    isEnable: boolean
  }

  export type RedDotParams = {
    
    index: number
  }

  export type OperateTabBarParams = {
    
    animation: boolean
  }

  export type TabBarStyleParams = {
    
    color: string
    
    selectedColor: string
    
    backgroundColor: string
    
    borderStyle: string
  }

  export type TabBarItemParams = {
    
    index: number
    
    text: string
    
    iconPath: string
    
    selectedIconPath: string
  }

  export type TabBarBadgeParams = {
    
    index: number
    
    text: string
  }

  export type HighwayRequestBean = {
    
    api: string
    
    data?: Record<string, any>
    
    method?: HighwayMethod
  }

  export type HighwayRequestResponse = {
    
    thing_json_?: {}
    
    data: string
  }

  export type BackMiniProgramBean = {
    
    extraData?: Record<string, any>
  }

  export type MiniAppOptions = {
    
    path: string
    
    query: Record<string, any>
    
    referrerInfo: ReferrerInfo
    
    apiCategory?: string
  }

  export type CapsuleButtonRectBean = {
    
    width: number
    
    height: number
    
    top: number
    
    right: number
    
    bottom: number
    
    left: number
  }

  export type PreDownloadMiniAppParams = {
    
    miniAppId: string
    
    miniAppVersion?: string
  }

  export type LoginBean = {
    
    timeout?: number
  }

  export type LoginResult = {
    
    code: string
  }

  export type OrientationBean = {
    
    pageOrientation: string
  }

  export type CanOpenURLResultBean = {
    
    isCanOpen?: boolean
  }

  export type NavigationBarLoadingParams = {
    
    title: string
  }

  export type NavigationBarColorParams = {
    
    frontColor: string
    
    backgroundColor: string
    
    animation: NavigationBarColorAnimationInfo
  }

  export type RouteBean = {
    
    url: string
    
    type?: string
  }

  export type BackRouteBean = {
    
    delta?: number
  }

  export type SuccessResult = {
    
    result: boolean
  }

  export type InvokeResult = {
    
    data?: {}
  }
}
