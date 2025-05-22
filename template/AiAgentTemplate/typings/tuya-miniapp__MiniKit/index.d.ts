/**
 * MiniKit
 *
 * @version 3.16.1
 */
declare namespace ty {
  /**
   *@description 特殊方法：是否异层渲染响应
   *@error {9005: 'can‘t find service'}*/
  export function nativeDisabled(params: {
    /** 禁用异层渲染手势分发 */
    nativeDisabled: boolean
    /** 需要禁止或启用手势分发的页面id */
    pageId: string
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
   *@description 通用方法：用于基础库给原生异层渲染组件发送消息
   *@error {9005: 'can‘t find service'}*/
  export function nativeInovke(params: {
    /** 原生组件类型 */
    type?: number
    /** 原生组件的ApiName */
    apiName: string
    /** 异层渲染原生视图id */
    id: string
    /** 小程序页面id */
    pageId: string
    /** 参数等 */
    params: any
    success?: (params: {}) => void
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
   *@description 获取权限的配置信息*/
  export function getPermissionConfig(params?: {
    success?: (params: {
      /** 权限相关配置信息 */
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
   *@description 获取权限的配置信息*/
  export function getPermissionConfigSync(): {
    /** 权限相关配置信息 */
    result: any
  }

  /**
   *@description 调起客户端小程序设置界面，返回用户设置的操作结果。*/
  export function openSetting(params?: {
    success?: (params: {
      /** 用户授权设置信息 */
      scope: any
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
   *@description 设置vconsole调试模式开关
   *true: 开启vconsole
   *false: 关闭vconsole*/
  export function changeDebugMode(params: {
    /** 调试模式开关 */
    isEnable: boolean
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
   *@description 打开帮助中心，默认：面板小程序会跳转到面板帮助中心，普通小程序会跳转到App帮助中心
   *@error {7: 'API Internal processing failed'}*/
  export function openHelpCenter(params?: {
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
   *@description 显示 tabBar 某一项的右上角的红点
   *@error {40008: 'no tab config'}*/
  export function showTabBarRedDot(params: {
    /** tabBar 的哪一项，从左边算起 */
    index: number
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
   *@description 显示 tabBar
   *@error {40008: 'no tab config'}*/
  export function showTabBar(params: {
    /** 是否需要动画效果 */
    animation: boolean
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
   *@description 动态设置 tabBar 的整体样式
   *@error {40008: 'no tab config'}*/
  export function setTabBarStyle(params: {
    /** tab 上的文字默认颜色 */
    color: string
    /** tab 上的文字选中时的颜色 */
    selectedColor: string
    /** tab 的背景色 */
    backgroundColor: string
    /** tabBar上边框的颜色， 仅支持 black/white */
    borderStyle: string
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
   *@description 动态设置 tabBar 某一项的内容
   *@error {40008: 'no tab config'}*/
  export function setTabBarItem(params: {
    /** tabBar 的哪一项，从左边算起 */
    index: number
    /** tab 上的按钮文字 */
    text: string
    /** 图片路径 */
    iconPath: string
    /** 选中时的图片路径 */
    selectedIconPath: string
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
   *@description 为 tabBar 某一项的右上角添加文本
   *@error {40008: 'no tab config'}*/
  export function setTabBarBadge(params: {
    /** tabBar 的哪一项，从左边算起 */
    index: number
    /** 显示的文本，超过 4 个字符则显示成 ... */
    text: string
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
   *@description 移除 tabBar 某一项右上角的文本
   *@error {40008: 'no tab config'}*/
  export function removeTabBarBadge(params: {
    /** tabBar 的哪一项，从左边算起 */
    index: number
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
   *@description 隐藏 tabBar 某一项的右上角的红点
   *@error {40008: 'no tab config'}*/
  export function hideTabBarRedDot(params: {
    /** tabBar 的哪一项，从左边算起 */
    index: number
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
   *@description 隐藏 tabBar
   *@error {40008: 'no tab config'}*/
  export function hideTabBar(params: {
    /** 是否需要动画效果 */
    animation: boolean
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
   *@description 发起highway请求
   *@error {5: 'The necessary parameters are missing'} | {40015: 'miniapp highway request error'}*/
  export function apiRequestByHighway(params: {
    /** api 名称 */
    api: string
    /** data 请求入参 */
    data?: any
    /** method 请求方法 */
    method?: HighwayMethod
    success?: (params: {
      /** 接口返回数据的序列化对象，序列化失败时为null */
      thing_json_?: {}
      /** 接口返回的原始数据 */
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
    complete?: () => void
  }): void

  /**
   *@description 返回到上一个小程序。只有在当前小程序是被其他小程序打开时可以调用成功
   *@error {7: 'API Internal processing failed'} | {40003: 'miniapp not exist'}*/
  export function navigateBackMiniProgram(params?: {
    /** 需要返回给上一个小程序的数据，上一个小程序可在 App.onShow 中获取到这份数据 */
    extraData?: any
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
   *@description 退出当前小程序
   *@error {40003: 'miniapp not exist'} | {40010: 'miniapp can not be exit'}*/
  export function exitMiniProgram(params?: {
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
   *@description 获取小程序启动时的参数。与App.onLaunch的回调参数一致。
   *@error {7: 'API Internal processing failed'}*/
  export function getLaunchOptions(params?: {
    success?: (params: {
      /** 启动小程序的路径 (代码包路径) */
      path: string
      /** 启动小程序的场景值 */
      scene?: MiniAppScene
      /** 启动小程序的 query 参数 */
      query: any
      /** 分享转发 */
      referrerInfo: ReferrerInfo
      /** API 类别: default	默认类别; embedded 内嵌，通过打开半屏小程序能力打开的小程序 */
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
    complete?: () => void
  }): void

  /**
   *@description 获取小程序启动时的参数。与App.onLaunch的回调参数一致。
   *@error {7: 'API Internal processing failed'}*/
  export function getLaunchOptionsSync(): {
    /** 启动小程序的路径 (代码包路径) */
    path: string
    /** 启动小程序的场景值 */
    scene?: MiniAppScene
    /** 启动小程序的 query 参数 */
    query: any
    /** 分享转发 */
    referrerInfo: ReferrerInfo
    /** API 类别: default	默认类别; embedded 内嵌，通过打开半屏小程序能力打开的小程序 */
    apiCategory?: string
  }

  /**
   *@description 获取本次小程序启动时的参数。如果当前是冷启动，则返回值与App.onLaunch的回调参数一致；如果当前是热启动，则返回值与App.onShow 一致。
   *@error {7: 'API Internal processing failed'}*/
  export function getEnterOptions(params?: {
    success?: (params: {
      /** 启动小程序的路径 (代码包路径) */
      path: string
      /** 启动小程序的场景值 */
      scene?: MiniAppScene
      /** 启动小程序的 query 参数 */
      query: any
      /** 分享转发 */
      referrerInfo: ReferrerInfo
      /** API 类别: default	默认类别; embedded 内嵌，通过打开半屏小程序能力打开的小程序 */
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
    complete?: () => void
  }): void

  /**
   *@description 获取本次小程序启动时的参数。如果当前是冷启动，则返回值与App.onLaunch的回调参数一致；如果当前是热启动，则返回值与App.onShow 一致。
   *@error {7: 'API Internal processing failed'}*/
  export function getEnterOptionsSync(): {
    /** 启动小程序的路径 (代码包路径) */
    path: string
    /** 启动小程序的场景值 */
    scene?: MiniAppScene
    /** 启动小程序的 query 参数 */
    query: any
    /** 分享转发 */
    referrerInfo: ReferrerInfo
    /** API 类别: default	默认类别; embedded 内嵌，通过打开半屏小程序能力打开的小程序 */
    apiCategory?: string
  }

  /**
   *@description 设置小程序看板页标题，小程序名称，面板名称等
   *@error {5: 'The necessary parameters are missing'}*/
  export function setBoardTitle(params: {
    /** 看板页标题 */
    title: string
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
   *@description 设置小程序看板页标题，小程序名称，面板名称等
   *@error {5: 'The necessary parameters are missing'}*/
  export function setBoardTitleSync(boardBean?: BoardBean): null

  /**
   *@description 设置小程序看板页icon，小程序icon，面板icon等
   *@error {5: 'The necessary parameters are missing'}*/
  export function setBoardIcon(params: {
    /** 看板页icon */
    icon: string
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
   *@description 设置小程序看板页icon，小程序icon，面板icon等
   *@error {5: 'The necessary parameters are missing'}*/
  export function setBoardIconSync(boardIconBean?: BoardIconBean): null

  /**
   *@description 显示小程序看板页的标题和icon
   *@error {7: 'API Internal processing failed'}*/
  export function showBoardTitleIcon(params?: {
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
   *@description 显示小程序看板页的标题和icon
   *@error {7: 'API Internal processing failed'}*/
  export function showBoardTitleIconSync(): null

  /**
   *@description 隐藏小程序看板页的标题和icon
   *@error {7: 'API Internal processing failed'}*/
  export function hideBoardTitleIcon(params?: {
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
   *@description 隐藏小程序看板页的标题和icon
   *@error {7: 'API Internal processing failed'}*/
  export function hideBoardTitleIconSync(): null

  /**
   *@description 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
   *@error {7: 'API Internal processing failed'}*/
  export function getMenuButtonBoundingClientRect(params?: {
    success?: (params: {
      /** 宽度，单位：px */
      width: number
      /** 高度，单位：px */
      height: number
      /** 上边界坐标，单位：px */
      top: number
      /** 右边界坐标，单位：px */
      right: number
      /** 下边界坐标，单位：px */
      bottom: number
      /** 左边界坐标，单位：px */
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
    complete?: () => void
  }): void

  /**
   *@description 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
   *@error {7: 'API Internal processing failed'}*/
  export function getMenuButtonBoundingClientRectSync(): {
    /** 宽度，单位：px */
    width: number
    /** 高度，单位：px */
    height: number
    /** 上边界坐标，单位：px */
    top: number
    /** 右边界坐标，单位：px */
    right: number
    /** 下边界坐标，单位：px */
    bottom: number
    /** 左边界坐标，单位：px */
    left: number
  }

  /**
   *@description 预下载智能小程序，此接口仅供提供预下载普通智能小程序调用，面板小程序的预下载需要使用另外的接口。
   *@error {5: 'The necessary parameters are missing'} | {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'}*/
  export function preDownloadMiniApp(params: {
    /** 小程序id */
    miniAppId: string
    /** 指定小程序版本(可选参数) */
    miniAppVersion?: string
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
   *@description 调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户在当前小程序的唯一标识（openid）、iot账号下的唯一标识（unionid）
   *@error {8: 'Method Unauthorized access'} | {30001: 'atop request error'} | {40018: 'query auth code fail'}*/
  export function login(params?: {
    /** 超时时间，单位ms */
    timeout?: number
    success?: (params: {
      /** 用户登录凭证（有效期五分钟） */
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
    complete?: () => void
  }): void

  /**
   *@description 屏幕旋转设置，auto / portrait / landscape。pad模式下不支持屏幕旋转
   *@error {5: 'The necessary parameters are missing'} | {8: 'Method Unauthorized access'} | {40021: 'this page is not support set orientation'}*/
  export function setPageOrientation(params: {
    /** 屏幕旋转设置， auto(暂不支持) / portrait / landscape */
    pageOrientation: string
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
   *@description 隐藏右上角胶囊按钮
   *@error {40022: 'this page can not hide menu button'}*/
  export function hideMenuButton(params?: {
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
   *@description 显示右上角胶囊按钮
   *@error {40022: 'this page can not hide menu button'}*/
  export function showMenuButton(params?: {
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
   *@description 显示手机状态栏
   *@error {7: 'API Internal processing failed'}*/
  export function showStatusBar(params?: {
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
   *@description 隐藏手机状态栏
   *@error {7: 'API Internal processing failed'}*/
  export function hideStatusBar(params?: {
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
   *@description 关闭小部件
   *@error {7: 'API Internal processing failed'}*/
  export function exitMiniWidget(params?: {
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
   *@description 判断设备上是否有已经安装相应应用或可以处理URL的程序，返回结果是一个对象，只有一个参数，格式为Boolean值。
   *@error {7: 'API Internal processing failed'}*/
  export function canOpenURL(params: {
    /** 要打开的url */
    url: string
    success?: (params: {
      /** 是否支持打开对应的url */
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
    complete?: () => void
  }): void

  /**
   *@description 判断设备上是否有已经安装相应应用或可以处理URL的程序，返回结果是一个对象，只有一个参数，格式为Boolean值。
   *@error {7: 'API Internal processing failed'}*/
  export function canOpenURLSync(openURLBean?: OpenURLBean): {
    /** 是否支持打开对应的url */
    isCanOpen?: boolean
  }

  /**
   *@description 打开设备上的某个应用或可以处理URL的程序。
   *@error {40026: 'open url fail, not exist app can open it.'}*/
  export function openURL(params: {
    /** 要打开的url */
    url: string
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
   *@description 获取小程序账号信息
   *@error {7: 'API Internal processing failed'}*/
  export function getAccountInfo(params?: {
    success?: (params: {
      /** 小程序账号信息 */
      miniProgram: MiniProgramAccountInfo
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
   *@description 获取小程序账号信息
   *@error {7: 'API Internal processing failed'}*/
  export function getAccountInfoSync(): {
    /** 小程序账号信息 */
    miniProgram: MiniProgramAccountInfo
  }

  /**
   *@description 获取小程序自定义配置
   *@error {7: 'API Internal processing failed'}*/
  export function getMiniAppConfig(params?: {
    success?: (params: {
      /** 小程序自定义配置 */
      config: {}
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
   *@description 获取小程序自定义配置
   *@error {7: 'API Internal processing failed'}*/
  export function getMiniAppConfigSync(): {
    /** 小程序自定义配置 */
    config: {}
  }

  /**
   *@description 唤起小程序看板页
   *@error {7: 'API Internal processing failed'}*/
  export function showBoard(params?: {
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
   *@description 重置小程序看板页自定义栏item
   *@error {5: 'The necessary parameters are missing'}*/
  export function resetBoardMenus(params: {
    /** 生效页面, 默认当前页面 */
    effectPage?: EffectPage
    /** item列表 */
    menus: BoardItemBean[]
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
   *@description 重置小程序看板页默认栏item
   *@error {5: 'The necessary parameters are missing'}*/
  export function resetSystemMenus(params: {
    /** 生效页面, 默认当前页面 */
    effectPage?: EffectPage
    /** item列表 */
    menus: BoardItemBean[]
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
   *@description 针对具体的看板itemKey显示红点
   *@error {7: 'API Internal processing failed'}*/
  export function showRedBot(params: {
    /** 生效页面, 默认当前页面 */
    effectPage?: EffectPage
    /** 看板item名称 */
    key: string
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
   *@description 针对具体的看板itemKey隐藏红点
   *@error {7: 'API Internal processing failed'}*/
  export function hiddenRedBot(params: {
    /** 生效页面, 默认当前页面 */
    effectPage?: EffectPage
    /** 看板item名称 */
    key: string
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
   *@description 关闭小程序页面加载框, 如果页面配置中配置了manualHideLoading:true，需要手动调用此接口关闭加载框
   *@error {7: 'API Internal processing failed'}*/
  export function hideRenderLoading(params?: {
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
   *@description 设置小程序页面背景图片，调用后小程序导航栏背景色将变为透明
   *@error {7: 'API Internal processing failed'}*/
  export function setBackgroundImage(params: {
    /** 图片地址，支持网络图片和本地图片 */
    imageUrl: string
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
   *@description 设置小程序页面背景颜色
   *@error {7: 'API Internal processing failed'}*/
  export function setBackgroundColor(params: {
    /** 当前页面背景颜色 */
    color: string
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
   *@description 在当前页面显示导航条加载动画*/
  export function showNavigationBarLoading(params?: {
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
   *@description 动态设置当前页面的标题*/
  export function setNavigationBarTitle(params: {
    /** 页面标题 */
    title: string
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
   *@description 设置页面导航条颜色*/
  export function setNavigationBarColor(params: {
    /** 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000 */
    frontColor: string
    /** 背景颜色值，有效值为十六进制颜色 */
    backgroundColor: string
    /** 动画效果 */
    animation: NavigationBarColorAnimationInfo
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
   *@description 在当前页面隐藏导航条加载动画*/
  export function hideNavigationBarLoading(params?: {
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
   *@description 隐藏返回首页按钮*/
  export function hideHomeButton(params?: {
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
   *@description 路由到新页面
   *@error {40002: 'the page not be found'} | {40003: 'miniapp not exist'} | {40004: 'navigatorTo cannot open tab url'} | {40006: 'A maximum of ten pages can be opened'}*/
  export function navigateTo(params: {
    /** 页面路径, 参数需要做 url encode 处理 */
    url: string
    /** 打开方式，支持全屏full，半屏half；默认全屏full */
    type?: string
    /**
     * 非全屏页面距离屏幕顶部的距离，type 为 half 时有效
     * 取值范围：【1-屏幕的高度】单位：px
     * 注意：Android 显示区域不包括状态栏，iOS显示区域包括状态栏。
     * 因此 Android 的 topMargin 的最大值是屏幕高度减去状态栏的高度。
     */
    topMargin?: number
    /**
     * 非全屏页面距离屏幕顶部的百分比，type 为 half 时有效，优先级高于 topMargin
     * 取值范围【1-99】单位：百分比
     * 注意：Android 显示区域不包括状态栏，iOS显示区域包括状态栏。
     */
    topMarginPercent?: number
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
   *@description 关闭当前页面，返回上一页面或多级页面
   *@error {40001: 'the last page cannot be navigator back'} | {40003: 'miniapp not exist'} | {40017: 'navigate back event already been intercept'}*/
  export function navigateBack(params?: {
    /** 返回的页面数，如果 delta 大于现有页面数，则返回到首页 */
    delta?: number
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
   *@description 关闭当前页面，跳转到应用内的某个页面
   *@error {40002: 'the page not be found'} | {40003: 'miniapp not exist'} | {40004: 'navigatorTo cannot open tab url'}*/
  export function redirectTo(params: {
    /** 页面路径, 参数需要做 url encode 处理 */
    url: string
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
   *@description 关闭所有页面，打开到应用内的某个页面
   *@error {40002: 'the page not be found'} | {40003: 'miniapp not exist'}*/
  export function reLaunch(params: {
    /** 页面路径, 参数需要做 url encode 处理 */
    url: string
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
   *@description 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   *@error {40002: 'the page not be found'} | {40003: 'miniapp not exist'} | {40007: 'cannot find page url from tab config'} | {40008: 'no tab config'} | {40011: 'miniapp can not support on tab'}*/
  export function switchTab(params: {
    /** 页面路径, 不支持参数 */
    url: string
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
   *@description 判断自定义API是否可用
   *@error {5: 'The necessary parameters are missing'} | {40020: 'ext api fail'}*/
  export function extApiCanIUse(params: {
    /** api名称 */
    api: string
    success?: (params: {
      /** 当前版本是否可用 */
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
   *@description 判断自定义API是否可用
   *@error {5: 'The necessary parameters are missing'} | {40020: 'ext api fail'}*/
  export function extApiCanIUseSync(caniuseBean?: CanIUseBean): {
    /** 当前版本是否可用 */
    result: boolean
  }

  /**
   *@description 调用自定义API
   *@error {40019: 'ext api not found'} | {40020: 'ext api fail'}*/
  export function extApiInvoke(params: {
    /** api名称 */
    api: string
    /** api参数 */
    params?: any
    success?: (params: {
      /** extApi返回数据 */
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
    complete?: () => void
  }): void

  /**
   *@description 调用自定义API
   *@error {40019: 'ext api not found'} | {40020: 'ext api fail'}*/
  export function extApiInvokeSync(extApiBean?: ExtApiBean): {
    /** extApi返回数据 */
    data?: {}
  }

  /**
   *@description 开始下拉刷新。调用后触发当前页面下拉刷新动画，效果与用户手动下拉刷新一致。
   *@error {7: 'API Internal processing failed'}*/
  export function startPullDownRefresh(params?: {
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
   *@description 停止当前页面下拉刷新。
   *@error {7: 'API Internal processing failed'}*/
  export function stopPullDownRefresh(params?: {
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
   *@description 移除当前widget视图, 仅在widget内部调用且不支持Dialog形式*/
  export function widgetRemove(params?: {
    /** 移除模式 */
    mode?: WidgetMode
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
   *@description 原生上报的事件*/
  export function onNativeEvent(
    listener: (params: NativeUploadData) => void
  ): void

  /**
   *@description 移除监听：原生上报的事件*/
  export function offNativeEvent(
    listener: (params: NativeUploadData) => void
  ): void

  export enum HighwayMethod {
    /** HTTP 请求 OPTIONS */
    OPTIONS = "OPTIONS",

    /** HTTP 请求 GET */
    GET = "GET",

    /** HTTP 请求 HEAD */
    HEAD = "HEAD",

    /** HTTP 请求 POST */
    POST = "POST",

    /** HTTP 请求 PUT */
    PUT = "PUT",

    /** HTTP 请求 DELETE */
    DELETE = "DELETE",

    /** HTTP 请求 TRACE */
    TRACE = "TRACE",

    /** HTTP 请求 TRACE */
    CONNECT = "CONNECT",
  }

  export enum MiniAppScene {
    /** 默认值 */
    DEFAULT = 1000,

    /** 通过最近使用小程序列表进入 */
    RECENTLY_USED = 1001,

    /** 通过URL映射进入 */
    URL_MAPPING = 1002,
  }

  export type ReferrerInfo = {
    /** 来源小程序的 appId */
    appId: string
    /** 来源小程序传过来的数据，特定scene支持 */
    extraData: any
  }

  export type BoardBean = {
    /** 看板页标题 */
    title: string
  }

  export type BoardIconBean = {
    /** 看板页icon */
    icon: string
  }

  export type OpenURLBean = {
    /** 要打开的url */
    url: string
  }

  export type MiniProgramAccountInfo = {
    /** 小程序 appId */
    appId: string
    /**
     * 小程序版本
     * develop: 开发版
     * trail: 体验版
     * release: 正式版
     */
    envVersion: string
    /** 小程序版本号 */
    version: string
    /** 小程序名称 */
    appName: string
    /** 小程序图标 */
    appIcon: string
  }

  export enum EffectPage {
    /** 当前页面 */
    current = "current",

    /** 所有页面 */
    all = "all",
  }

  export type BoardItemBean = {
    /** item名称 */
    key: string
    /** item图标 */
    iconPath: string
    /** item文案 */
    text: string
    /** item是否显示 */
    isShow?: boolean
  }

  export type NavigationBarColorAnimationInfo = {
    /** 动画变化时间，单位 ms */
    duration?: number
    /**
     * 动画变化方式
     * 'linear'	动画从头到尾的速度是相同的
     * 'easeIn'	动画以低速开始
     * 'easeOut'	动画以低速结束
     * 'easeInOut'	动画以低速开始和结束
     */
    timingFunc?: string
  }

  export type CanIUseBean = {
    /** api名称 */
    api: string
  }

  export type ExtApiBean = {
    /** api名称 */
    api: string
    /** api参数 */
    params?: any
  }

  export enum WidgetMode {
    /** 单次移除 */
    ONCE = "ONCE",

    /** 永久移除 */
    FOREVER = "FOREVER",
  }

  export type NativeUploadData = {
    /** 原生组件的EventName */
    eventName: string
    /** 异层渲染原生视图id */
    id: string
    /** 小程序页面id */
    pageId: string
    /** 数据等 */
    data: any
  }

  export type NativeDisabledParam = {
    /** 禁用异层渲染手势分发 */
    nativeDisabled: boolean
    /** 需要禁止或启用手势分发的页面id */
    pageId: string
  }

  export type NativeParams = {
    /** 原生组件类型 */
    type?: number
    /** 原生组件的ApiName */
    apiName: string
    /** 异层渲染原生视图id */
    id: string
    /** 小程序页面id */
    pageId: string
    /** 参数等 */
    params: any
  }

  export type Object = {}

  export type PermissionConfig = {
    /** 权限相关配置信息 */
    result: any
  }

  export type AuthSetting = {
    /** 用户授权设置信息 */
    scope: any
  }

  export type DebugModeSetting = {
    /** 调试模式开关 */
    isEnable: boolean
  }

  export type TabBarIndexBean = {
    /** tabBar 的哪一项，从左边算起 */
    index: number
  }

  export type OperateTabBarParams = {
    /** 是否需要动画效果 */
    animation: boolean
  }

  export type TabBarStyleParams = {
    /** tab 上的文字默认颜色 */
    color: string
    /** tab 上的文字选中时的颜色 */
    selectedColor: string
    /** tab 的背景色 */
    backgroundColor: string
    /** tabBar上边框的颜色， 仅支持 black/white */
    borderStyle: string
  }

  export type TabBarItemParams = {
    /** tabBar 的哪一项，从左边算起 */
    index: number
    /** tab 上的按钮文字 */
    text: string
    /** 图片路径 */
    iconPath: string
    /** 选中时的图片路径 */
    selectedIconPath: string
  }

  export type TabBarBadgeParams = {
    /** tabBar 的哪一项，从左边算起 */
    index: number
    /** 显示的文本，超过 4 个字符则显示成 ... */
    text: string
  }

  export type HighwayRequestBean = {
    /** api 名称 */
    api: string
    /** data 请求入参 */
    data?: any
    /** method 请求方法 */
    method?: HighwayMethod
  }

  export type HighwayRequestResponse = {
    /** 接口返回数据的序列化对象，序列化失败时为null */
    thing_json_?: {}
    /** 接口返回的原始数据 */
    data: string
  }

  export type BackMiniProgramBean = {
    /** 需要返回给上一个小程序的数据，上一个小程序可在 App.onShow 中获取到这份数据 */
    extraData?: any
  }

  export type MiniAppOptions = {
    /** 启动小程序的路径 (代码包路径) */
    path: string
    /** 启动小程序的场景值 */
    scene?: MiniAppScene
    /** 启动小程序的 query 参数 */
    query: any
    /** 分享转发 */
    referrerInfo: ReferrerInfo
    /** API 类别: default	默认类别; embedded 内嵌，通过打开半屏小程序能力打开的小程序 */
    apiCategory?: string
  }

  export type CapsuleButtonRectBean = {
    /** 宽度，单位：px */
    width: number
    /** 高度，单位：px */
    height: number
    /** 上边界坐标，单位：px */
    top: number
    /** 右边界坐标，单位：px */
    right: number
    /** 下边界坐标，单位：px */
    bottom: number
    /** 左边界坐标，单位：px */
    left: number
  }

  export type PreDownloadMiniAppParams = {
    /** 小程序id */
    miniAppId: string
    /** 指定小程序版本(可选参数) */
    miniAppVersion?: string
  }

  export type LoginBean = {
    /** 超时时间，单位ms */
    timeout?: number
  }

  export type LoginResult = {
    /** 用户登录凭证（有效期五分钟） */
    code: string
  }

  export type OrientationBean = {
    /** 屏幕旋转设置， auto(暂不支持) / portrait / landscape */
    pageOrientation: string
  }

  export type CanOpenURLResultBean = {
    /** 是否支持打开对应的url */
    isCanOpen?: boolean
  }

  export type AccountInfoResp = {
    /** 小程序账号信息 */
    miniProgram: MiniProgramAccountInfo
  }

  export type MiniAppConfigResp = {
    /** 小程序自定义配置 */
    config: {}
  }

  export type BoardMenusBean = {
    /** 生效页面, 默认当前页面 */
    effectPage?: EffectPage
    /** item列表 */
    menus: BoardItemBean[]
  }

  export type RedBodReq = {
    /** 生效页面, 默认当前页面 */
    effectPage?: EffectPage
    /** 看板item名称 */
    key: string
  }

  export type BackgroundImageBean = {
    /** 图片地址，支持网络图片和本地图片 */
    imageUrl: string
  }

  export type BackgroundColorBean = {
    /** 当前页面背景颜色 */
    color: string
  }

  export type CreateReq = {
    /** managerId: 通知管理器id */
    managerId: string
    /** name: 通知名称 */
    name: string
  }

  export type ObserverReq = {
    /** managerId: 通知管理器id */
    managerId: string
  }

  export type NavigationBarLoadingParams = {
    /** 页面标题 */
    title: string
  }

  export type NavigationBarColorParams = {
    /** 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000 */
    frontColor: string
    /** 背景颜色值，有效值为十六进制颜色 */
    backgroundColor: string
    /** 动画效果 */
    animation: NavigationBarColorAnimationInfo
  }

  export type RouteBean = {
    /** 页面路径, 参数需要做 url encode 处理 */
    url: string
    /** 打开方式，支持全屏full，半屏half；默认全屏full */
    type?: string
    /**
     * 非全屏页面距离屏幕顶部的距离，type 为 half 时有效
     * 取值范围：【1-屏幕的高度】单位：px
     * 注意：Android 显示区域不包括状态栏，iOS显示区域包括状态栏。
     * 因此 Android 的 topMargin 的最大值是屏幕高度减去状态栏的高度。
     */
    topMargin?: number
    /**
     * 非全屏页面距离屏幕顶部的百分比，type 为 half 时有效，优先级高于 topMargin
     * 取值范围【1-99】单位：百分比
     * 注意：Android 显示区域不包括状态栏，iOS显示区域包括状态栏。
     */
    topMarginPercent?: number
  }

  export type BackRouteBean = {
    /** 返回的页面数，如果 delta 大于现有页面数，则返回到首页 */
    delta?: number
  }

  export type RedirectBean = {
    /** 页面路径, 参数需要做 url encode 处理 */
    url: string
  }

  export type ReLaunchBean = {
    /** 页面路径, 参数需要做 url encode 处理 */
    url: string
  }

  export type SwitchTabBean = {
    /** 页面路径, 不支持参数 */
    url: string
  }

  export type SuccessResult = {
    /** 当前版本是否可用 */
    result: boolean
  }

  export type InvokeResult = {
    /** extApi返回数据 */
    data?: {}
  }

  export type MiniWidgetRemoveBean = {
    /** 移除模式 */
    mode?: WidgetMode
  }

  /**
   *@description 原生主动发送通知*/
  interface NativeEventManager {
    /**
     *@description 停止监听通知
     *@deprecated 方法已停止维护，请谨慎使用，推荐使用offListener代替。
     *@error {5: 'The necessary parameters are missing'}*/
    offerListener(params: {
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
     *@description 开始监听通知
     *@error {5: 'The necessary parameters are missing'}*/
    onListener(
      listener: (params: {
        /** data: 通知内容 */
        data: {}
      }) => void
    ): void

    /**
     *@description 停止监听通知
     *@error {5: 'The necessary parameters are missing'}*/
    offListener(
      listener: (params: {
        /** data: 通知内容 */
        data: {}
      }) => void
    ): void
  }
  /**
   *@description 创建原生通知管理器*/
  export function createNativeEventManager(params: {
    /** name: 通知名称 */
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
  }): NativeEventManager
}
