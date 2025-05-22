/**
 * BizKit
 *
 * @version 4.15.2
 */
declare namespace ty {
  /**
   *@description 获取历史消息*/
  export function getAIAssistantHistory(params: {
    /** 数量，不传递默认值30 */
    size: number
    /** primaryId */
    primaryId: number
    /** 消息标识 */
    requestId: string
    /** 类型， TEXT_FINISH SKILL_FINISH */
    type: string
    /** 渠道 可选参数，不传表示首页AI组手 */
    channel: string
    success?: (params: {
      /** 列表数据 */
      data: string
      /** 渠道 */
      channel: string
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
   *@description 获取AI助手组历史消息*/
  export function getAIAssistantGroupHistory(params: {
    /** 数量，不传递默认值30 */
    size: number
    /** 分页依据，传入0查询最近n条，其他值后根据 id < primaryId 往前查询n条 */
    primaryId: number
    /** 渠道列表，数组其中一个元素支持传递null表示原有AI组手，整个数组为空时，查询所有数据 */
    channels?: string[]
    /** 会话列表，数组其中一个元素支持传递null，整个数组为空时，查询所有数据 */
    sessions?: string[]
    success?: (params: {
      /** 列表数据个数 */
      size: number
      /** 数据列表 */
      list: GroupHistoryResItem[][]
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
   *@description 删除消息*/
  export function deleteAIAssistant(params: {
    /** primaryId */
    primaryId: number
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
   *@description 发送消息*/
  export function sendAIAssistant(params: {
    /** 消息 */
    block: string
    /** 可选参数 */
    options: string
    /** 类型 TEXT/SKILL/其他任意字符CUSTOMXX，存在DB中的类型是TEXT_FINISH, SKILL_FINISH, CUSTOMXX_FINISH */
    type: string
    /** 可选字段，如果传递了，则会绑定到该消息上，如果没有传递，则会生成一个新的requestId */
    requestId?: string
    /** 渠道, 兼容历史不传从options中获取 */
    channel?: string
    /** 会话 */
    session?: string
    success?: (params: {
      /** 单次对话消息标识 */
      requestId: string
      /** primaryId */
      primaryId: number
      /** 发送消息 200成功 -2001 发送失败 */
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
   *@description 中断某一次对话/中断后监听onAIAssistantChange接受到一条type=TEXT_INTERRUPTED,code=5003消息/同时getAIAssistantGroupHistory接口返回一条type/code同样格式的消息*/
  export function terminateAIAssistant(params: {
    /** 单次对话消息标识 */
    requestId: string
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
   *@description 数据初始*/
  export function createAIAssistant(params?: {
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
   *@description 移除消息监听
   *获取单次对话消息标识*/
  export function getAIAssistantRequestId(params?: {
    success?: (params: {
      /** 单次对话消息标识 */
      requestId: string
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
   *@description 移除消息监听
   *获取单次对话消息标识*/
  export function getAIAssistantRequestIdSync(): {
    /** 单次对话消息标识 */
    requestId: string
  }

  /**
   *@description 插入数据*/
  export function insertAIAssistantInfo(params: {
    /** 消息标识：如果requestId是新生成的，则会作为宿主消息查询出来；如果是用的其他消息的requestId，列表查询的时候则会被绑定到这条消息上返回 */
    requestId: string
    /**
     * 类型， 自定义类型
     * 保留字段：TEXT_FINISH,CUSTOM_FINISH, 这两个字符串会被插件默认当做宿主消息，会被当做一个气泡，其他类型的比如SKILL_FINISH,XX_FINISH，都会绑定到该消息上，删除的时候会被一起删除掉
     * 1、如果你想插入一条河其他消息绑定的，则不能传入 TEXT_FINISH, CUSTOM_FINISH，传入其他的，比如：XX1_FINISH，requestId则需要传入绑定的那条消息的requestId
     * 2、如果你想插入一条消息作为单独的气泡，则需要传入 TEXT_FINISH 或者 CUSTOM_FINISH，requestId则需要重新生成，可以通过插件提供的api获取。
     * 3、消息的绑定也会根据插入的source值相关，只有source相同的才会绑定。比如requestId==1的数据在数据库中有两条，source分别是1和2，插入内容根据source匹配绑定到对应的消息上。
     */
    type: string
    /** 消息内容: 消息内容完全业务方自己定义，如果业务复杂，涉及到自定义的type很多，需要业务自己规划设计好data的结构进行区分。 */
    data: string
    /** 错误码 */
    code: string
    /** 错误信息 */
    message: string
    /**
     * 消息来源 1. 本地 2. 云端
     * 消息的绑定会根据插入的source值相关，只有source相同的才会绑定。比如requestId==1的数据在数据库中有两条，source分别是1和2，插入内容根据source匹配绑定到对应的消息上。
     */
    source: number
    /** 渠道 可选参数，不传表示首页AI组手 */
    channel?: string
    /** 会话 */
    session?: string
    /** 发送/接受ws 时候携带数据 */
    options?: string
    success?: (params: {
      /** 主键 */
      primaryId: number
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
   *@description 更新数据*/
  export function updateAIAssistantInfo(params: {
    /** 消息标识 */
    primaryId: number
    /** 消息内容 */
    data?: string
    /** 错误码 */
    code?: string
    /** 错误信息 */
    message?: string
    /** 消息来源 1. 本地 2. 云端 */
    source?: string
    /** 类型，以_FINISH结尾 */
    type: string
    /** 渠道 可选参数，不传表示首页AI组手 */
    channel?: string
    /** 会话 */
    session?: string
    /** 发送/接受ws 时候携带数据 */
    options?: string
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
   *@description 获取语音助手展示类型*/
  export function getSpeechDisplayType(params?: {
    success?: (params: {
      /** 0 不展示 1 显示老助手 2 显示新助手 */
      type: number
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
   *@description 关闭AI助手*/
  export function disableAIAssistant(params?: {
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
   *@description 打开AI助手*/
  export function enableAIAssistant(params?: {
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
   *@description 清除数据*/
  export function deleteAIAssistantDbSource(params: {
    /** 清除家庭数据, 不传表示清除当前家庭 */
    homeId: string
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
   *@description 获取单条数据*/
  export function getSingleAIAssistant(params: {
    /** 主键 */
    primaryId: number
    success?: (params: {
      /** 主键 */
      primaryId: number
      /** 消息标识 */
      requestId: string
      /** 消息来源 1. 本地 2. 云端 */
      source: number
      /** 消息内容 */
      data: string
      /** 错误码 */
      code: number
      /** 类型 */
      type: string
      /** 创建时间 */
      createTime: number
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
   *@description 是否支持老语音助手*/
  export function isSupportOldSpeech(params?: {
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
   *@description atop接口
   *@error {9006: 'netowrk request error'} | {30001: 'atop request error'}*/
  export function apiRequestByAtop(params: {
    /**
     * atop入参数据模型
     * api api名称
     */
    api: string
    /** version api版本号 */
    version?: string
    /** postData 入参结构体 */
    postData: any
    /**
     * extData 额外参数，当前只支持传递gid
     * 数据格式：{"gid":"xxxx"}
     */
    extData?: any
    success?: (params: {
      /**
       * 请求结果
       * thing_data_ 出参结构体， JSON序列化
       */
      thing_json_?: {}
      /** 元数据 */
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
   *@description highway面板接口
   *@error {9006: 'netowrk request error'} | {30010: 'highway request error'}*/
  export function apiRequestByHighwayRestful(params: {
    /** 域名 */
    host?: string
    /** 请求API, 严格遵循restful标准格式，"/"开头 */
    api: string
    /**
     * 数据不会被加密，以 HEADER 形式传递
     * 每一个request都包含了默认的公共参数，header会覆盖默认的公共参数
     */
    header?: any
    /** 数据会被加密，最终以 QUERY 形式传递 */
    query?: any
    /** 只针对 POST 请求，数据会被加密，最终以 BODY 形式传递 */
    body?: any
    /** http请求方式 */
    method?: HighwayMethod
    success?: (params: {
      /** 序列化返回结果 */
      result: {}
      /** apiName */
      api: string
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
   *@description 单次点 事件埋点
   *@error {7: 'API Internal processing failed'}*/
  export function event(params: {
    /** 事件id */
    eventId: string
    /** 事件点对象 */
    event: any
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
   *@description 链路点 开始事件埋点
   *开始一个（时长类）事件
   *@error {7: 'API Internal processing failed'}*/
  export function beginEvent(params: {
    /** 事件名称 */
    eventName: string
    /** 事件唯一ID （在同一条链路上，begin,track,end 的标识，以此标识识别是同一个链路事件） */
    identifier: string
    /** 事件参数，会按照链路点顺序start->track->end组装成数组 */
    attributes: any
    /** 事件info, 链路上靠后的info会覆盖前面的info */
    infos: any
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
   *@description 链路点 发送事件埋点
   *发送一个（时长类）事件
   *@error {7: 'API Internal processing failed'}*/
  export function trackEvent(params: {
    /** 事件名称 */
    eventName: string
    /** 事件唯一ID （在同一条链路上，begin,track,end 的标识，以此标识识别是同一个链路事件） */
    identifier: string
    /** 事件参数，会按照链路点顺序start->track->end组装成数组 */
    attributes: any
    /** 事件info, 链路上靠后的info会覆盖前面的info */
    infos: any
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
   *@description 链路点 结束事件埋点
   *结束一个（时长类）事件
   *@error {7: 'API Internal processing failed'}*/
  export function endEvent(params: {
    /** 事件名称 */
    eventName: string
    /** 事件唯一ID （在同一条链路上，begin,track,end 的标识，以此标识识别是同一个链路事件） */
    identifier: string
    /** 事件参数，会按照链路点顺序start->track->end组装成数组 */
    attributes: any
    /** 事件info, 链路上靠后的info会覆盖前面的info */
    infos: any
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
   *@description 链路埋点 支持10个链路点，链路下标：0 - 9
   *主要可以用于一个执行过程中的各个关键点的埋点
   *@error {7: 'API Internal processing failed'}*/
  export function eventLink(params: {
    /** 链路点位置，目前只支持10个链路点，0 - 9 */
    linkIndex: number
    /** 链路唯一id，保证唯一性，建议格式是：链路关键词_小程序id */
    linkId: string
    /** 业务扩展参数 map转成string */
    params: string
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
   *@description 业务侧定义的性能数据,会显示在性能工具中
   *@error {6: 'The parameter format is incorrect'}*/
  export function performanceEvent(params?: {
    /**
     * 性能数据, 这里的数据会以点击小程序的时间为起点，到调用performance方法的时间为终点自动计算耗时
     * example: ty.performanceEvent({launchData: 'map_render_time'})
     */
    launchData?: string
    /** 业务自定义性能数据，会以key-value的形式展示在性能工具中 */
    perfData?: any
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
   *@description 拿到当前App的业务信息*/
  export function getAppInfo(params?: {
    success?: (params: {
      /** serverTimestamp 云端时间戳 */
      serverTimestamp: number
      /** appVersion app版本 */
      appVersion: string
      /** language app语言包 */
      language: string
      /** countryCode 国家码 */
      countryCode: string
      /** regionCode 地区码， 在RN Api中被当作“service”字段 */
      regionCode: string
      /** appName app名称 */
      appName: string
      /** appIcon app图标 */
      appIcon: string
      /**
       * app环境
       * 0: 日常
       * 1: 预发
       * 2: 线上
       */
      appEnv?: number
      /** app包名 */
      appBundleId: string
      /** app scheme */
      appScheme: string
      /** app id */
      appId: string
      /** app clientId */
      clientId?: string
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
   *@description 拿到当前连接的wifi的ssid*/
  export function getCurrentWifiSSID(params?: {
    success?: (params: {
      /**
       * 拿到当前连接的wifi的ssid
       * 注意：iOS需要开启 Wireless Accessory Configuration 权限以及打开定位权限
       */
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
    complete?: () => void
  }): void

  /**
   *@description 获取NG配置*/
  export function getNGConfigByKeys(params: {
    /** ng配置的key */
    keys: string[]
    success?: (params: {
      /** ng配置 */
      config: any
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
   *@description 获取配置中心的配置*/
  export function getConfigByKeys(params: {
    /**
     * 三段式结构对应配置中心的业务配置
     * [
     *     "oem:config:open_device_network",
     *     "DeviceBiz:DeviceDetail:deviceDetailMini",
     *     "deviceBiz:deviceDetail:demotionDeviceDetailMini"
     * ]
     */
    keys: string[]
    success?: (params: {
      /** ng配置 */
      config: any
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
   *@description 获取三方服务信息
   *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'}*/
  export function getThirdPartyServiceInfo(params: {
    /** 三方服务列表 ThirdPartyType */
    types: number[]
    success?: (params: ThirdPartyServiceInfo[]) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 打开三方小程序（仅iOS）*/
  export function openThirdPartyMiniProgram(params: {
    /** 三方小程序类型 ThirdPartyMiniProgramType */
    type?: ThirdPartyMiniProgramType
    /** 三方小程序参数 */
    params: any
    success?: (params: {
      /** 三方小程序结果 */
      data: any
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
   *@description 获取云端环境*/
  export function getCloudEnv(params?: {
    success?: (params: {
      /** 云端环境 CloudEnvType */
      env?: CloudEnvType
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
   *@description 当前环境是否支持小程序*/
  export function isMiniAppAvailable(params?: {
    success?: (params: {
      /** 是否支持小程序环境 */
      availalble: boolean
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
   *@description 获取当前App的tab信息（仅Android）*/
  export function getAppTabInfo(params?: {
    success?: (params: {
      /** tab信息 */
      tabInfo: AppTabInfo[]
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
   *@description 进入选择国家页面*/
  export function openCountrySelectPage(params?: {
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
   *@description 获取iconfont信息*/
  export function getIconfontInfo(params?: {
    success?: (params: {
      /**
       * iconfont 信息结构体
       * nameMap iconfont信息载体
       */
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
    complete?: () => void
  }): void

  /**
   *@description IAP支付方法*/
  export function iapPay(params: {
    /** 订单ID */
    orderID: string
    /** 商品ID */
    productID: string
    /** 订阅单预支付code */
    preFlowCode: string
    /** 1: 订阅 0: 非订阅 */
    subscription?: number
    /**
     * 指定订阅升级/降级期间的按比例分配模式
     * Google提供的几种模式：
     * int UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY = 0;
     * int IMMEDIATE_WITH_TIME_PRORATION = 1;
     * int IMMEDIATE_AND_CHARGE_PRORATED_PRICE = 2;
     * int IMMEDIATE_WITHOUT_PRORATION = 3;
     * int DEFERRED = 4
     */
    billing_mode?: number
    /** 之前的sku商品，用于筛选和获取历史订单的令牌做升级处理 */
    previous_sku?: string
    success?: (params: {
      /** 订单ID */
      orderID?: string
      /** 选择订单为备选结算处理token，用于后台主动上报备选结算报告单 */
      token?: string
      /** 选择为备选结算处理的订单 */
      products?: string
      /** 0:iap  1:备选结算 */
      paymentType?: number
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
   *@description 支付类型*/
  export function iapType(params?: {
    success?: (params: {
      /** 支付类型 0:三方支付; 1:苹果支付,2:google支付,3:google支付支持备选结算 */
      data: number
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
   *@description 图片上传
   *@error {30008: 'image upload failed'}*/
  export function uploadImage(params: {
    /** the file path */
    filePath: string
    /** business type, get from cetus：scene alias, if not exist, please create it */
    bizType: string
    /** file type, ios necessary */
    contentType?: string
    /** polling interval of big file in second, default is 2 second */
    delayTime?: number
    /** max polling count, default is 5 */
    pollMaxCount?: number
    success?: (params: {
      /** The json string returned by the request */
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
    complete?: () => void
  }): void

  /**
   *@description 视频上传
   *@error {30024: 'video upload failed'}*/
  export function uploadVideo(params: {
    /** the file path */
    filePath: string
    /** business type, get from cetus：scene alias, if not exist, please create it */
    bizType: string
    /** file type, ios necessary */
    contentType?: string
    success?: (params: {
      /** The json string returned by the request */
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
    complete?: () => void
  }): void

  /**
   *@description 创建实时活动*/
  export function createLiveActivity(params: {
    /** 实时通知类型 */
    activityType?: any
    /** 实时通知ID */
    activityId: string
    /** 实时通知参数 */
    data: any
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
   *@description 小程序获取当前页面所有使用到的多语言code*/
  export function getDebugLangCodes(params?: {
    success?: (params: {
      /** 当前页面所有使用到的多语言code, 客户端不做解析 */
      codes: string[]
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
   *@description 存储当前页面所有使用到的多语言code, 客户端调用*/
  export function setDebugLangCodes(params: {
    /** 当前页面所有使用到的多语言code, 客户端不做解析 */
    codes: string[]
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
   *@description 获取手机当前地区语言 zh-hans 、en-GB
   *@error {7: 'API Internal processing failed'}*/
  export function getLangKey(params?: {
    success?: (params: {
      /** 手机当前地区语言 */
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
    complete?: () => void
  }): void

  /**
   *@description 获取多语言
   *@error {7: 'API Internal processing failed'}*/
  export function getLangContent(params?: {
    success?: (params: {
      /** 多语言 */
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
    complete?: () => void
  }): void

  /**
   *@description 注册界面刷新*/
  export function registerPageRefreshListener(params?: {
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
   *@description 传入key值，获取对应NG元数据
   *@error {30016: 'ng rawkey error'} | {30017: 'can&#39;t access private data'}*/
  export function getNgRawData(params: {
    /** 要获取元数据的key值，支持x.y.z格式 */
    rawKey: string
    success?: (params: {
      /** 返回元数据 */
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
    complete?: () => void
  }): void

  /**
   *@description 获取在线客户电子*/
  export function getOnlineCustomerService(params?: {
    success?: (params: { url: string }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 打开RN面板 (该方法已被废弃, 请使用openPanel替代)
   *@deprecated 方法已停止维护，请谨慎使用，推荐使用openPanel代替。
   *@error {20001: 'DeviceId is invalid'} | {20046: 'Open RN panel failed'} | {30005: 'UIId empty or null'}*/
  export function openRNPanel(params: {
    /**
     * 跳转RN面板（优先通过deviceId跳转设备面板，panelUiInfoBean不为null，则两者组合来跳转面板）
     * deviceId 设备Id
     */
    deviceId: string
    /** uiId 面板uiId */
    uiId: string
    /**
     * panelUiInfoBean 面板信息
     * panelUiInfoBean的信息需要与对应deviceId匹配。如果在传入时，两者不对应，跳转的面板可能会出现问题。
     */
    panelUiInfoBean?: PanelUiInfoBean
    /**
     * 面板初始化参数
     * initialProps 初始化参数
     */
    initialProps?: any
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
   *@description 跳转打开面板
   *不关心是跳转RN面板还是面板小程序
   *@error {20001: 'DeviceId is invalid'} | {20046: 'Open RN panel failed'}*/
  export function openPanel(params: {
    /** 设备信息Id */
    deviceId: string
    /**
     * 额外面板信息
     * 当跳转的是二级面板时, 需要传递的额外信息
     */
    extraInfo?: PanelExtraParams
    /** 面板携带业务启动参数 */
    initialProps?: any
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
   *@description 回到首页并打开面板
   *@error {20001: 'DeviceId is invalid'}*/
  export function backToHomeAndOpenPanel(params: {
    /** 设备信息Id */
    deviceId: string
    /**
     * 额外面板信息
     * 当跳转的是二级面板时, 需要传递的额外信息
     */
    extraInfo?: PanelExtraParams
    /** 面板携带业务启动参数 */
    initialProps?: any
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
   *@description 面板预下载
   *@error {20001: 'DeviceId is invalid'}*/
  export function preloadPanel(params: {
    /** 设备id */
    deviceId: string
    /**
     * 额外面板信息
     * 当预下载的是二级面板时, 需要传递的额外信息
     */
    extraInfo?: PanelExtraParams
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
   *@description 打开内置H5容器
   *@error {20009: 'The URL is invalid'}*/
  export function openInnerH5(params: {
    /** url H5链接地址 */
    url: string
    /** title H5标题 */
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
   *@description !!!注: 由于审核安全风险,在iOS端调用此方法只会打开当前应用对应的设置界面，不再支持以下scope
   *根据不同scope值，打开当前应用对应的设置界面
   *"App-Settings" -> App应用设置界面
   *"App-Settings-Permission" -> App应用权限设置界面 (Android 独有)
   *"App-Settings-Notification" -> App应用通知设置界面 (Android 独有)
   *@error {20045: 'Open URL failed'}*/
  export function openAppSystemSettingPage(params: {
    /**
     * 跳转系统-设置项名称
     * "Settings"-> 手机设置主界面
     * "Settings-Bluetooth" -> 手机蓝牙设置界面
     * "Settings-WiFi" -> 手机WiFi设置界面
     * "Settings-Location" -> 手机定位设置界面
     * "Settings-Notification" -> 手机通知设置界面
     * 跳转系统-应用-设置项名称
     * "App-Settings" -> App应用设置界面
     * "App-Settings-Permission" -> App应用权限设置界面 (Android 独有)
     * "App-Settings-Notification" -> App应用通知设置界面 (Android 独有)
     */
    scope: string
    /** 请求code,Android特有 */
    requestCode?: number
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
   *@description !!!注: 由于审核安全风险,在iOS端调用此方法只会打开当前应用对应的设置界面，不再支持以下scope
   *根据不同scope值，打开对应的手机系统设置界面
   *"Settings"-> 手机设置主界面
   *"Settings-Bluetooth" -> 手机蓝牙设置界面
   *"Settings-WiFi" -> 手机Wifi设置界面
   *"Settings-Location" -> 手机定位设置界面
   *"Settings-Notification" -> 手机通知设置界面
   *@error {20045: 'Open URL failed'}*/
  export function openSystemSettingPage(params: {
    /**
     * 跳转系统-设置项名称
     * "Settings"-> 手机设置主界面
     * "Settings-Bluetooth" -> 手机蓝牙设置界面
     * "Settings-WiFi" -> 手机WiFi设置界面
     * "Settings-Location" -> 手机定位设置界面
     * "Settings-Notification" -> 手机通知设置界面
     * 跳转系统-应用-设置项名称
     * "App-Settings" -> App应用设置界面
     * "App-Settings-Permission" -> App应用权限设置界面 (Android 独有)
     * "App-Settings-Notification" -> App应用通知设置界面 (Android 独有)
     */
    scope: string
    /** 请求code,Android特有 */
    requestCode?: number
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
   *@description 向已注册的事件通道发送事件，可通过onReceiveMessage接收事件
   *@error {6: 'The parameter format is incorrect'}*/
  export function emitChannel(params: {
    /** 事件名称 */
    eventName: string
    /** 传递事件对象 */
    event?: {}
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
   *@description Call this to set the result that your activity will return to its caller*/
  export function setActivityResult(params: {
    /** The result code to propagate back to the originating activity, often RESULT_CANCELED or RESULT_OK */
    resultCode: number
    /** The data to propagate back to the originating activity. */
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
   *@description 打开三方App*/
  export function openThirdApp(params: {
    /** an RFC 2396-compliant, encoded URI */
    uriString: string
    /** The name of the application package to handle the intent, or null to allow any application package. */
    packageName: string
    success?: (params: { isCanOpen?: boolean }) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
    complete?: () => void
  }): void

  /**
   *@description 打开三方App*/
  export function openThirdAppSync(params?: ThirdAppBean): {
    isCanOpen?: boolean
  }

  /**
   *@description 聚焦系统浏览器通过打开URL*/
  export function openUrlForceDefaultBrowser(params: {
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
   *@description 获取支付相关常量信息*/
  export function getIapInfo(params?: {
    success?: (params: {
      /**
       * 支付方式
       * 目前仅Android可用
       * 0: 三方支付方式
       * 1: 苹果支付
       * 2: google支付
       */
      iapType?: number
      /** google支付下是否支持用户自选的备选结算 */
      googleIapEnableUserChoice?: boolean
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
   *@description iap支付是否准备就绪*/
  export function iapPayReady(params: {
    /** 1: 订阅 0: 非订阅 */
    subscription: number
    success?: (params: {
      /**
       * iap是否准备就绪
       * true: 准备就绪, 可以支付
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
   *@description 发起iap应用内购买, 购买结果请通过onOrderStatusListener做相关的监听*/
  export function pay(params: {
    /** 前置订单id */
    order_id: string
    /** 关联商品id */
    product_id: string
    /** 1: 订阅 0: 非订阅 */
    subscription?: number
    /**
     * 指定订阅升级/降级期间的按比例分配模式
     * Google提供的几种模式：
     * int UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY = 0;
     * int IMMEDIATE_WITH_TIME_PRORATION = 1;
     * int IMMEDIATE_AND_CHARGE_PRORATED_PRICE = 2;
     * int IMMEDIATE_WITHOUT_PRORATION = 3;
     * int DEFERRED = 4
     */
    billing_mode?: number
    /** 之前的sku商品，用于筛选和获取历史订单的令牌做升级处理 */
    previous_sku?: string
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
   *@description 添加订单状态监听, 后可用onOrderStatusListener收到相关事件*/
  export function addOrderStatusListener(params: {
    /** 前置订单id */
    order_id: string
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
   *@description 移除订单状态监听*/
  export function removeOrderStatusListener(params: {
    /** 前置订单id */
    order_id: string
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
   *@description 查询商品详情-目前仅Android可用*/
  export function queryProductDetails(params: {
    /** 商品列表 */
    productList: ProductSub[]
    success?: (params: {
      /** 订阅类型下的商品详情 */
      productSubsMap?: any
      /** 一次支付类型下的商品详情 */
      productInAppMap?: any
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
   *@description 路由跳转原生页面
   *当传递的路由url带协议头, 则直接跳转; 若不带协议头, 则补充对应APP协议头进行跳转
   *1. 在使用万能路由跳转前, 需要在app.json中声明使用到的路由, 如果没有声明相关路由, 则该路由无法执行该方法
   *e.g. "routers":['deviceDetail', 'thingsmart://device']
   *2. 在使用router方法前, 建议使用canIUseRouter来做兼容, 处理当APP没有对应路由时执行业务兜底
   *errorCode 10014 当前路由不存在当前APP中, 不可用
   *@error {5: 'The necessary parameters are missing'} | {7: 'API Internal processing failed'} | {10014: 'can not use this route url in the APP'}*/
  export function router(params: {
    /** 路由链接 */
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
   *@description 判断该路由host是否存在在当前APP中
   *@error {5: 'The necessary parameters are missing'}*/
  export function canIUseRouter(params: {
    /** 路由链接 */
    url: string
    success?: (params: {
      /** 路由是否可用 */
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
   *@description 跳转设备详情页面, 已废弃
   *@deprecated 方法已停止维护，请谨慎使用，推荐使用openDeviceDetailPage代替。
   *@error {6: 'The parameter format is incorrect'}*/
  export function goDeviceDetail(params: {
    /** 设备Id */
    deviceId: string
    /** 群组id */
    groupId?: string
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
   *@description 跳转设备定时页面, 已废弃
   *@deprecated 方法已停止维护，请谨慎使用，推荐使用openTimerPage代替。
   *@error {6: 'The parameter format is incorrect'}*/
  export function goDeviceAlarm(params: {
    /** 设备Id */
    deviceId: string
    /** 群组id */
    groupId?: string
    /** category */
    category?: string
    /** repeat */
    repeat?: number
    /** timerConfig */
    timerConfig?: TimeConfig
    /** data */
    data: {}[]
    /** enableFilter */
    enableFilter?: boolean
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
   *@description 分享
   *@error {30009: 'share failed'}*/
  export function share(params: {
    /** 分享渠道 */
    type?: ShareInfoType
    /** title 标题 */
    title: string
    /** message 文本内容 */
    message: string
    /** contentType 内容类型 */
    contentType?: ShareInfoContentType
    /** recipients 邮件收件人/短信接收人 */
    recipients?: string[]
    /** imagePath 图片路径 */
    imagePath?: string
    /** filePath 当 contentType == file 时候使用 */
    filePath?: string
    /** web 当 contentType == file 时候使用 */
    webPageUrl?: string
    /** miniProgramInfo 当 contentType == miniProgram 时候使用，且分享渠道必须是微信。 */
    miniProgramInfo?: MiniProgramInfo
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
   *@description 获取可分享的渠道列表*/
  export function getShareChannelList(params?: {
    success?: (params: {
      /** 可分享的渠道列表(WeChat、Message、Email、More) */
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
    complete?: () => void
  }): void

  /**
   *@description 显示分享弹窗
   *@error {7: 'API Internal processing failed'}*/
  export function showSharePanel(params: {
    /** 分享内容类型 */
    contentType: number
    success?: (params: {
      /** 分享渠道类型 */
      platformType: string
      /** 选中渠道是否安装 */
      installed: boolean
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
   *@description 直接分享
   *@error {7: 'API Internal processing failed'}*/
  export function shareDirectly(params: {
    /** 分享渠道类型 */
    platformType: string
    /** 相册内容标识 */
    localIdentifier: string
    /** 分享内容类型 */
    contentType: number
    success?: (params: {
      /** 分享结果码 */
      code: number
      /** 分享结果描述 */
      msg: string
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
   *@description 是否支持 siri, 仅 iOS*/
  export function isSupportedShortcut(params?: {
    success?: (params: {
      /** 是否支持 */
      isSupported: boolean
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
   *@description 获取是否关联 siri 状态, 仅 iOS*/
  export function isAssociatedShortcut(params: {
    /** 场景 id */
    sceneId: string
    /** 场景 name */
    name?: string
    success?: (params: {
      /** 是否已关联 */
      isAssociated: boolean
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
   *@description 操作快捷方式，包括添加和移除, 仅 iOS*/
  export function handleShortcut(params: {
    /** 操作类型。0-添加、1-移除 */
    type: number
    /** 场景 id */
    sceneId: string
    /** 场景名称 */
    name: string
    /** 场景 logo */
    iconUrl?: string
    success?: (params: {
      /** 操作步骤，0-添加、1-移除、2-更新、3-取消 */
      operationStep: number
      /** 操作状态，YES，表示成功；NO，表示失败 */
      operationStatus: boolean
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
   *@description 获取用户信息*/
  export function getUserInfo(params?: {
    success?: (params: {
      /** nickName 用户昵称 */
      nickName: string
      /** 用户头像 */
      avatarUrl: string
      /** 国家代码 */
      phoneCode: string
      /** 所在服务器区域 RegionCode */
      regionCode: string
      /** 是否是临时用户 */
      isTemporaryUser: boolean
      /** 时区 */
      timezoneId: string
      /** 账号的注册方式 ThingRegType */
      regFrom: number
      /** 温度单位 TempUnit */
      tempUnit: number
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
   *@description 切换全屋首页模式
   *@error {2: 'can‘t find module'}*/
  export function changeDiyHomeStatus(params: {
    /** 是否开启全屋模式 */
    isOn: boolean
    success?: (params: {
      /** 是否操作成功, true 切换成功；false 用户取消 */
      isSuccess: boolean
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
   *@description 压缩图片， 在保持原图长宽比基础上先裁剪至目标尺寸， 然后根据文件大小限制去执行质量压缩
   *@error {30002: 'Cannot find image file from path'}*/
  export function resizeImage(params: {
    /**
     * 压缩参数
     * aspectFitWidth 自适应宽度
     */
    aspectFitWidth: number
    /** aspectFitHeight 自适应高度 */
    aspectFitHeight: number
    /** maxFileSize 最大图片文件大小限制值， 为空则不做限制, 单位:B */
    maxFileSize?: number
    /** path 图片路径 */
    path: string
    success?: (params: {
      /**
       * 图片返回内容
       * path 图片路径
       */
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
    complete?: () => void
  }): void

  /**
   *@description 旋转图片
   *@error {30002: 'Cannot find image file from path'}*/
  export function rotateImage(params: {
    /** path 图片路径 */
    path: string
    /**
     * orientation 旋转方向
     * 90 - 顺时针90°
     * 180 - 顺时针180°
     * 270 - 顺时针270°
     */
    orientation: number
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
   *@description 下载网络图片至相册
   *仅用于加密图片保存，不支持普通图片保存
   *@error {7: 'API Internal processing failed'} | {30003: 'encryptKey is empty or null'} | {30004: 'image url is empty or null'}*/
  export function saveToAlbum(params: {
    /** path 图片url */
    url: string
    /** encryptKey 密钥 */
    encryptKey: string
    /**
     * orientation 旋转方向
     * 90 - 顺时针90°
     * 180 - 顺时针180°
     * 270 - 顺时针270°
     */
    orientation: number
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
   *@description 截图
   *@error {30002: 'Cannot find image file from path'}*/
  export function takeScreenShot(params?: {
    success?: (params: {
      /**
       * 截图本地地址
       * path 图片路径
       */
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
    complete?: () => void
  }): void

  /**
   *@description 获取websocket的连接状态*/
  export function getWebSocketStatus(params?: {
    success?: (params: {
      /** 0.未初始化 1. 连接中 2. 连接成功 3. 连接失败 ', */
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
   *@description 获取websocket的连接状态*/
  export function getWebSocketStatusSync(): {
    /** 0.未初始化 1. 连接中 2. 连接成功 3. 连接失败 ', */
    status: number
  }

  /**
   *@description 绑定微信*/
  export function bindWechat(params?: {
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
   *@description 是否支持微信绑定*/
  export function isSupportWechat(params?: {
    success?: (params: {
      /** 是否支持微信绑定 */
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
   *@description 跳转微信小程序*/
  export function gotoWechatMiniApp(params: {
    /** 小程序原始 appId */
    miniAppId: string
    /** 小程序路径 */
    path: string
    /**
     * mini program Type:
     *  0: 正式版 MINIPTOGRAM_TYPE_RELEASE
     *  1: 测试版 MINIPROGRAM_TYPE_TEST
     *  2: 预览版 MINIPROGRAM_TYPE_PREVIEW
     */
    miniProgramType: number
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
   *@description 是否正在通话中*/
  export function isCalling(params?: {
    success?: (params: {
      /** 结果 */
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
   *@description 是否正在通话中*/
  export function canLaunchCall(params?: {
    success?: (params: {
      /** 结果 */
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
   *@description 发起呼叫*/
  export function launchCall(params: {
    /** 设备id */
    targetId: string
    /**
     * 超时时间，单位秒
     * note: 不要传时间戳
     */
    timeout: number
    /** 通话业务参数 例如linux中控 {"channelType": 1, "category": "dgnzk"} */
    extra: any
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
   *@description 添加消息监听*/
  export function onAIAssistantChange(
    listener: (params: ReceiveBean) => void
  ): void

  /**
   *@description 移除监听：添加消息监听*/
  export function offAIAssistantChange(
    listener: (params: ReceiveBean) => void
  ): void

  /**
   *@description 监听国家选择页面的选择结果*/
  export function onCountrySelectResult(
    listener: (params: CountrySelectResultResponse) => void
  ): void

  /**
   *@description 移除监听：监听国家选择页面的选择结果*/
  export function offCountrySelectResult(
    listener: (params: CountrySelectResultResponse) => void
  ): void

  /**
   *@description 上传进度回调*/
  export function onUploadProgressUpdate(
    listener: (params: ProgressEvent) => void
  ): void

  /**
   *@description 移除监听：上传进度回调*/
  export function offUploadProgressUpdate(
    listener: (params: ProgressEvent) => void
  ): void

  /**
   *@description 页面刷新事件*/
  export function onPageRefresh(listener: (params: RefreshParams) => void): void

  /**
   *@description 移除监听：页面刷新事件*/
  export function offPageRefresh(
    listener: (params: RefreshParams) => void
  ): void

  /**
   *@description 接收通过emitChannel发送的事件*/
  export function onReceiveMessage(
    listener: (params: EventChannelMessageParams) => void
  ): void

  /**
   *@description 移除监听：接收通过emitChannel发送的事件*/
  export function offReceiveMessage(
    listener: (params: EventChannelMessageParams) => void
  ): void

  /**
   *@description 订单状态监听, 只有在addOrderStatusListener之后, 才能收到监听*/
  export function onOrderStatusListener(
    listener: (params: OrderStatusEvent) => void
  ): void

  /**
   *@description 移除监听：订单状态监听, 只有在addOrderStatusListener之后, 才能收到监听*/
  export function offOrderStatusListener(
    listener: (params: OrderStatusEvent) => void
  ): void

  /**
   *@description 用户自选备选结算监听, 只有在addOrderStatusListener之后, 才能收到监听*/
  export function onUserSelectedAlternativeBilling(
    listener: (params: UserSelectedAlternativeEvent) => void
  ): void

  /**
   *@description 移除监听：用户自选备选结算监听, 只有在addOrderStatusListener之后, 才能收到监听*/
  export function offUserSelectedAlternativeBilling(
    listener: (params: UserSelectedAlternativeEvent) => void
  ): void

  /**
   *@description 统一路由事件通知*/
  export function onRouterEvent(listener: (params: RouterEvent) => void): void

  /**
   *@description 移除监听：统一路由事件通知*/
  export function offRouterEvent(listener: (params: RouterEvent) => void): void

  /**
   *@description 万能路由界面返回的数据*/
  export function onRouterResult(
    listener: (params: RouterResultResponse) => void
  ): void

  /**
   *@description 移除监听：万能路由界面返回的数据*/
  export function offRouterResult(
    listener: (params: RouterResultResponse) => void
  ): void

  /**
   *@description RN或小程序页面关闭事件（Android独有）*/
  export function onFrontPageClose(
    listener: (params: PageCloseResponse) => void
  ): void

  /**
   *@description 移除监听：RN或小程序页面关闭事件（Android独有）*/
  export function offFrontPageClose(
    listener: (params: PageCloseResponse) => void
  ): void

  /**
   *@description onWebSocketStatusChange 接受消息*/
  export function onWebSocketStatusChange(
    listener: (params: StatusBean) => void
  ): void

  /**
   *@description 移除监听：onWebSocketStatusChange 接受消息*/
  export function offWebSocketStatusChange(
    listener: (params: StatusBean) => void
  ): void

  export type GroupHistoryResItem = {
    /** 主键，消息标识 */
    primaryId: number
    /** 单条消息标识 */
    requestId: string
    /** 消息来源 1. 发送 2. 接收 */
    source: number
    /** 发送码 */
    code: string
    /** 错误信息 */
    message: string
    /** 类型，和发送时候type一致，以_Finish结尾 */
    type: string
    /** 创建时间 */
    createTime: number
    /** 家庭ID */
    homeId: string
    /** 渠道 */
    channel: string
    /** 会话 */
    session: string
    /** 发送/接收ws 时候携带数据 */
    options: string
    /** 数据内容 */
    data: string
  }

  export enum HighwayMethod {
    /** HTTP 请求 GET */
    GET = "GET",

    /** HTTP 请求 POST */
    POST = "POST",

    /** HTTP 请求 PUT */
    PUT = "PUT",

    /** HTTP 请求 DELETE */
    DELETE = "DELETE",
  }

  export type ThirdPartyServiceInfo = {
    /** 服务是否可用 */
    available: boolean
    /** app是否已经安装 */
    isAppInstalled: boolean
    /** app安装连接 */
    appInstallUrl: string
    /** 三方服务类型 ThirdPartyType */
    type: number
  }

  export enum ThirdPartyMiniProgramType {
    /** qq */
    QQ = 1,

    /** 微信 */
    Wechat = 2,
  }

  export enum CloudEnvType {
    /** 公有云环境 */
    Public = 0,

    /** 私有云环境 */
    Private = 1,
  }

  export type AppTabInfo = {
    /** tab的唯一标志符 */
    key: string
    /** tab的文案 */
    text: string
    /** tab的icon */
    iconPath: string
    /** tab的选中icon */
    selectedIconPath: string
  }

  export type PanelUiInfoBean = {
    /** phase 面板phase */
    phase?: string
    /** type 面板类型 */
    type?: string
    /** ui 面板ui */
    ui?: string
    /** ui 面板版本号 */
    version?: string
    /** appRnVersion rn版本号 */
    appRnVersion?: string
    /** name 面板名称 */
    name?: string
    /** uiConfig 面板配置项 */
    uiConfig?: any
    /** rnFind 面板Find */
    rnFind?: boolean
    /** pid 产品id */
    pid?: string
    /** i18nTime 多语言 */
    i18nTime?: number
  }

  export type PanelExtraParams = {
    /** 产品id */
    productId: string
    /** 产品版本 */
    productVersion: string
    /** 面板多语言时间戳 */
    i18nTime: string
    /**
     * 容器ID
     * 可能是uiid的值也可能是miniAppId的值
     */
    bizClientId: string
    /**
     * 包类型
     * RN RN类型
     * SMART_MINIPG 小程序类型
     */
    uiType?: string
    /** 包发布状态 */
    uiPhase?: string
  }

  export type ThirdAppBean = {
    /** an RFC 2396-compliant, encoded URI */
    uriString: string
    /** The name of the application package to handle the intent, or null to allow any application package. */
    packageName: string
  }

  export type ProductSub = {
    /** 产品 id */
    productId: string
    /** 1: 订阅 0: 非订阅 */
    subscription: number
  }

  export type TimeConfig = {
    /** background */
    background: string
  }

  export enum ShareInfoType {
    /** 微信 */
    WeChat = "WeChat",

    /** 短信 */
    Message = "Message",

    /** 邮件 */
    Email = "Email",

    /** 系统更多分享渠道（调用系统分享） */
    More = "More",
  }

  export enum ShareInfoContentType {
    /** 文本 */
    Text = "text",

    /** 图片 */
    Image = "image",

    /** 文件 */
    File = "file",

    /** 网页地址 */
    Web = "web",

    /** 微信小程序分享内容 */
    MiniProgram = "miniProgram",
  }

  export type MiniProgramInfo = {
    /** 用户名称 */
    userName: string
    /** 路径 */
    path: string
    /** 图片地址 */
    hdImagePath: string
    /** ticket */
    withShareTicket: boolean
    /** 类型 */
    miniProgramType: number
    /** 小程序地址 */
    webPageUrl: string
  }

  export type ReceiveBean = {
    /** 消息内容 */
    data: string
  }

  export type CountrySelectResultResponse = {
    /** 国家码 */
    countryCode?: string
    /** 国家编码 */
    countryAbb?: string
    /** 国家名称 */
    countryName?: string
  }

  export type ProgressEvent = {
    /** the file path */
    filePath: string
    /** progress */
    progress: number
  }

  export type RefreshParams = {
    /** 关键词 */
    key: string
    /** 业务参数 */
    data?: any
  }

  export type EventChannelMessageParams = {
    /** 事件id */
    eventId: string
    /** 传递事件对象 */
    event?: {}
  }

  export type OrderStatusEvent = {
    /** 前置订单id */
    order_id: string
    /**
     * 订单结果
     * 0: 订单支付成功
     * 1: 用户取消支付
     * 2: 支付失败, 有错误信息
     */
    resultCode: number
    /** 内部实际错误码, 只有当支付失败时, 有相关信息 */
    errorCode?: number
    /** 内部实际错误信息, 只有当支付失败时, 有相关信息 */
    errorMsg?: string
  }

  export type UserSelectedAlternativeEvent = {
    /** google支付下，在支持备选结算系统的情况下，用户选择备选结算方式，需要携带相关toke信息,后续完成支付以后，报告云端。 */
    externalTransactionToken?: string
    /** google支付下，在支持备选结算系统的情况下，用户选择备选结算方式，需要携带相关products信息。 */
    products?: string
  }

  export type RouterEvent = {
    /** 业务事件名称,例如设备定时更新onDeviceAlarmUpdate */
    bizEventName: string
    /** 业务事件数据 */
    bizEventData: Object
  }

  export type RouterResultResponse = {
    /** 路由链接 */
    url: string
    /** 路由调整之后返回的数据 */
    data?: string
  }

  export type PageCloseResponse = {
    /** 来源 */
    from?: string
  }

  export type StatusBean = {
    /** 0.未初始化 1. 连接中 2. 连接成功 3. 连接失败 ', */
    status: number
  }

  export type ApiRequestByAtopParams = {
    /**
     * atop入参数据模型
     * api api名称
     */
    api: string
    /** version api版本号 */
    version?: string
    /** postData 入参结构体 */
    postData: any
    /**
     * extData 额外参数，当前只支持传递gid
     * 数据格式：{"gid":"xxxx"}
     */
    extData?: any
  }

  export type ApiRequestByAtopResponse = {
    /**
     * 请求结果
     * thing_data_ 出参结构体， JSON序列化
     */
    thing_json_?: {}
    /** 元数据 */
    data: string
  }

  export type HighwayReq = {
    /** 域名 */
    host?: string
    /** 请求API, 严格遵循restful标准格式，"/"开头 */
    api: string
    /**
     * 数据不会被加密，以 HEADER 形式传递
     * 每一个request都包含了默认的公共参数，header会覆盖默认的公共参数
     */
    header?: any
    /** 数据会被加密，最终以 QUERY 形式传递 */
    query?: any
    /** 只针对 POST 请求，数据会被加密，最终以 BODY 形式传递 */
    body?: any
    /** http请求方式 */
    method?: HighwayMethod
  }

  export type HighwayResp = {
    /** 序列化返回结果 */
    result: {}
    /** apiName */
    api: string
  }

  export type EventBean = {
    /** 事件id */
    eventId: string
    /** 事件点对象 */
    event: any
  }

  export type TrackEventBean = {
    /** 事件名称 */
    eventName: string
    /** 事件唯一ID （在同一条链路上，begin,track,end 的标识，以此标识识别是同一个链路事件） */
    identifier: string
    /** 事件参数，会按照链路点顺序start->track->end组装成数组 */
    attributes: any
    /** 事件info, 链路上靠后的info会覆盖前面的info */
    infos: any
  }

  export type EventLinkBean = {
    /** 链路点位置，目前只支持10个链路点，0 - 9 */
    linkIndex: number
    /** 链路唯一id，保证唯一性，建议格式是：链路关键词_小程序id */
    linkId: string
    /** 业务扩展参数 map转成string */
    params: string
  }

  export type PerformanceBean = {
    /**
     * 性能数据, 这里的数据会以点击小程序的时间为起点，到调用performance方法的时间为终点自动计算耗时
     * example: ty.performanceEvent({launchData: 'map_render_time'})
     */
    launchData?: string
    /** 业务自定义性能数据，会以key-value的形式展示在性能工具中 */
    perfData?: any
  }

  export type ManagerContext = {
    /** managerId */
    managerId: number
    /** 家庭id */
    homeId: string
    /** 码率，eg：u律传8000，pcm传16000 */
    sampleRate: number
    /** 通道， eg：1 */
    channels: number
    /** 编码格式，eg：ThingAudioAsrCodeTypePCM = 0 ,ThingAudioAsrCodeTypePCMU = 1 */
    codec: string
    /** 云端asr解析选项， 注意不要设置其他跟文本无关的参数，本检测只会处理跟文本相关的数据，nlp，skill，tts不包含。 */
    options: string
  }

  export type AsrManagerContext = {
    /** managerId */
    managerId: number
  }

  export type Active = {
    /** 状态 */
    isActive: boolean
  }

  export type AppInfoBean = {
    /** serverTimestamp 云端时间戳 */
    serverTimestamp: number
    /** appVersion app版本 */
    appVersion: string
    /** language app语言包 */
    language: string
    /** countryCode 国家码 */
    countryCode: string
    /** regionCode 地区码， 在RN Api中被当作“service”字段 */
    regionCode: string
    /** appName app名称 */
    appName: string
    /** appIcon app图标 */
    appIcon: string
    /**
     * app环境
     * 0: 日常
     * 1: 预发
     * 2: 线上
     */
    appEnv?: number
    /** app包名 */
    appBundleId: string
    /** app scheme */
    appScheme: string
    /** app id */
    appId: string
    /** app clientId */
    clientId?: string
  }

  export type SystemWirelessInfoBean = {
    /**
     * 拿到当前连接的wifi的ssid
     * 注意：iOS需要开启 Wireless Accessory Configuration 权限以及打开定位权限
     */
    ssId: string
  }

  export type NGConfigParams = {
    /** ng配置的key */
    keys: string[]
  }

  export type ConfigResponse = {
    /** ng配置 */
    config: any
  }

  export type ConfigParams = {
    /**
     * 三段式结构对应配置中心的业务配置
     * [
     *     "oem:config:open_device_network",
     *     "DeviceBiz:DeviceDetail:deviceDetailMini",
     *     "deviceBiz:deviceDetail:demotionDeviceDetailMini"
     * ]
     */
    keys: string[]
  }

  export type ThirdPartyServiceParams = {
    /** 三方服务列表 ThirdPartyType */
    types: number[]
  }

  export type ThirdPartyMiniProgramParams = {
    /** 三方小程序类型 ThirdPartyMiniProgramType */
    type?: ThirdPartyMiniProgramType
    /** 三方小程序参数 */
    params: any
  }

  export type ThirdPartyMiniProgramResult = {
    /** 三方小程序结果 */
    data: any
  }

  export type CloudEnvResult = {
    /** 云端环境 CloudEnvType */
    env?: CloudEnvType
  }

  export type MiniAppAvailableRes = {
    /** 是否支持小程序环境 */
    availalble: boolean
  }

  export type AppTabInfoResponse = {
    /** tab信息 */
    tabInfo: AppTabInfo[]
  }

  export type IconfontInfoBean = {
    /**
     * iconfont 信息结构体
     * nameMap iconfont信息载体
     */
    nameMap: string
  }

  export type PaymentParam = {
    /** 订单ID */
    orderID: string
    /** 商品ID */
    productID: string
    /** 订阅单预支付code */
    preFlowCode: string
    /** 1: 订阅 0: 非订阅 */
    subscription?: number
    /**
     * 指定订阅升级/降级期间的按比例分配模式
     * Google提供的几种模式：
     * int UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY = 0;
     * int IMMEDIATE_WITH_TIME_PRORATION = 1;
     * int IMMEDIATE_AND_CHARGE_PRORATED_PRICE = 2;
     * int IMMEDIATE_WITHOUT_PRORATION = 3;
     * int DEFERRED = 4
     */
    billing_mode?: number
    /** 之前的sku商品，用于筛选和获取历史订单的令牌做升级处理 */
    previous_sku?: string
  }

  export type PaymentResponse = {
    /** 订单ID */
    orderID?: string
    /** 选择订单为备选结算处理token，用于后台主动上报备选结算报告单 */
    token?: string
    /** 选择为备选结算处理的订单 */
    products?: string
    /** 0:iap  1:备选结算 */
    paymentType?: number
  }

  export type TypeResponse = {
    /** 支付类型 0:三方支付; 1:苹果支付,2:google支付,3:google支付支持备选结算 */
    data: number
  }

  export type UploadParams = {
    /** the file path */
    filePath: string
    /** business type, get from cetus：scene alias, if not exist, please create it */
    bizType: string
    /** file type, ios necessary */
    contentType?: string
    /** polling interval of big file in second, default is 2 second */
    delayTime?: number
    /** max polling count, default is 5 */
    pollMaxCount?: number
  }

  export type UploadResponse = {
    /** The json string returned by the request */
    result: string
  }

  export type VideoUploadParams = {
    /** the file path */
    filePath: string
    /** business type, get from cetus：scene alias, if not exist, please create it */
    bizType: string
    /** file type, ios necessary */
    contentType?: string
  }

  export type RequestModel = {
    /** 实时通知类型 */
    activityType?: any
    /** 实时通知ID */
    activityId: string
    /** 实时通知参数 */
    data: any
  }

  export type DebugCodes = {
    /** 当前页面所有使用到的多语言code, 客户端不做解析 */
    codes: string[]
  }

  export type LocalConstants = {
    /** 手机当前地区语言 */
    langKey: string
    /** 多语言 */
    langContent: {}
  }

  export type LangKeyResult = {
    /** 手机当前地区语言 */
    langKey: string
  }

  export type LangContentResult = {
    /** 多语言 */
    langContent: {}
  }

  export type ManagerContext_Mx6wn8 = {
    /** managerId */
    managerId: number
    /** 自定义标记 */
    tag: string
  }

  export type ManagerReqContext = {
    /** managerId */
    managerId: number
    /** 单条日志不要过10k */
    message: string
  }

  export type ConnectBean = {
    /** 任务id */
    taskId: string
    /** mqtt服务器地址 */
    host: string
    /** mqtt服务器端口 */
    port: number
    /** mqtt服务器用户名 */
    userName?: string
    /** mqtt服务器密码 */
    password?: string
    /** mqtt服务器clientId */
    clientId: string
    /** 是否使用ssl */
    ssl: boolean
  }

  export type ClientBean = {
    /** 任务id */
    taskId: string
  }

  export type SubscribeBean = {
    /** 任务id */
    taskId: string
    /** 主题 */
    topic: string
  }

  export type PublishBean = {
    /** 任务id */
    taskId: string
    /** 主题 */
    topic: string
    /** 消息 */
    message: string
  }

  export type NGRequestBean = {
    /** 要获取元数据的key值，支持x.y.z格式 */
    rawKey: string
  }

  export type NGResponseBean = {
    /** 返回元数据 */
    rawData: string
  }

  export type CustomerServiceRes = {
    url: string
  }

  export type PanelBean = {
    /**
     * 跳转RN面板（优先通过deviceId跳转设备面板，panelUiInfoBean不为null，则两者组合来跳转面板）
     * deviceId 设备Id
     */
    deviceId: string
    /** uiId 面板uiId */
    uiId: string
    /**
     * panelUiInfoBean 面板信息
     * panelUiInfoBean的信息需要与对应deviceId匹配。如果在传入时，两者不对应，跳转的面板可能会出现问题。
     */
    panelUiInfoBean?: PanelUiInfoBean
    /**
     * 面板初始化参数
     * initialProps 初始化参数
     */
    initialProps?: any
  }

  export type PanelParams = {
    /** 设备信息Id */
    deviceId: string
    /**
     * 额外面板信息
     * 当跳转的是二级面板时, 需要传递的额外信息
     */
    extraInfo?: PanelExtraParams
    /** 面板携带业务启动参数 */
    initialProps?: any
  }

  export type PreloadPanelParams = {
    /** 设备id */
    deviceId: string
    /**
     * 额外面板信息
     * 当预下载的是二级面板时, 需要传递的额外信息
     */
    extraInfo?: PanelExtraParams
  }

  export type WebViewBean = {
    /** url H5链接地址 */
    url: string
    /** title H5标题 */
    title?: string
  }

  export type SettingPageBean = {
    /**
     * 跳转系统-设置项名称
     * "Settings"-> 手机设置主界面
     * "Settings-Bluetooth" -> 手机蓝牙设置界面
     * "Settings-WiFi" -> 手机WiFi设置界面
     * "Settings-Location" -> 手机定位设置界面
     * "Settings-Notification" -> 手机通知设置界面
     * 跳转系统-应用-设置项名称
     * "App-Settings" -> App应用设置界面
     * "App-Settings-Permission" -> App应用权限设置界面 (Android 独有)
     * "App-Settings-Notification" -> App应用通知设置界面 (Android 独有)
     */
    scope: string
    /** 请求code,Android特有 */
    requestCode?: number
  }

  export type EventEmitChannelParams = {
    /** 事件名称 */
    eventName: string
    /** 传递事件对象 */
    event?: {}
  }

  export type EventChannelParams = {
    /** 事件id */
    eventId: string
    /** 事件名称 */
    eventName: string
  }

  export type EventOffChannelParams = {
    /** 事件id */
    eventId: string
  }

  export type ActivityResultBean = {
    /** The result code to propagate back to the originating activity, often RESULT_CANCELED or RESULT_OK */
    resultCode: number
    /** The data to propagate back to the originating activity. */
    data?: any
  }

  export type CanOpenThirdAppBean = {
    isCanOpen?: boolean
  }

  export type OpenDefaultBrowserUrlBean = {
    /** 要打开的url */
    url: string
  }

  export type PricePhase = {
    /** 商品价格 */
    price: string
    /** 价格币种 */
    priceCode: string
    /** 商品微单位 */
    priceAmountMicros: number
    /** 订阅周期 */
    billingPeriod: string
    /** 续订模式 */
    recurrenceMode: number
    /** 订阅周期次数 */
    billingCycleCount: number
  }

  export type SubscriptionOfferDetail = {
    /** 商品订阅计划ID */
    basePlanId: string
    /** 商品订阅优惠ID */
    offerId: string
    /** 商品订阅报价令牌 */
    offerToken: string
    /** 商品订阅相关的优惠标签 */
    offerTags: string[]
    /** 商品订阅定价阶段 */
    pricingPhases: PricePhase[]
  }

  export type PayInfoBean = {
    /**
     * 支付方式
     * 目前仅Android可用
     * 0: 三方支付方式
     * 1: 苹果支付
     * 2: google支付
     */
    iapType?: number
    /** google支付下是否支持用户自选的备选结算 */
    googleIapEnableUserChoice?: boolean
  }

  export type iapPayReadyReq = {
    /** 1: 订阅 0: 非订阅 */
    subscription: number
  }

  export type iapPayReadyResp = {
    /**
     * iap是否准备就绪
     * true: 准备就绪, 可以支付
     */
    result: boolean
  }

  export type payReq = {
    /** 前置订单id */
    order_id: string
    /** 关联商品id */
    product_id: string
    /** 1: 订阅 0: 非订阅 */
    subscription?: number
    /**
     * 指定订阅升级/降级期间的按比例分配模式
     * Google提供的几种模式：
     * int UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY = 0;
     * int IMMEDIATE_WITH_TIME_PRORATION = 1;
     * int IMMEDIATE_AND_CHARGE_PRORATED_PRICE = 2;
     * int IMMEDIATE_WITHOUT_PRORATION = 3;
     * int DEFERRED = 4
     */
    billing_mode?: number
    /** 之前的sku商品，用于筛选和获取历史订单的令牌做升级处理 */
    previous_sku?: string
  }

  export type OrderReq = {
    /** 前置订单id */
    order_id: string
  }

  export type ProductQueryReq = {
    /** 商品列表 */
    productList: ProductSub[]
  }

  export type ProductQueryResp = {
    /** 订阅类型下的商品详情 */
    productSubsMap?: any
    /** 一次支付类型下的商品详情 */
    productInAppMap?: any
  }

  export type Object = {}

  export type RouterBean = {
    /** 路由链接 */
    url: string
  }

  export type RouteUsageResult = {
    /** 路由是否可用 */
    result: boolean
  }

  export type DeviceDetailBean = {
    /** 设备Id */
    deviceId: string
    /** 群组id */
    groupId?: string
  }

  export type AlarmBean = {
    /** 设备Id */
    deviceId: string
    /** 群组id */
    groupId?: string
    /** category */
    category?: string
    /** repeat */
    repeat?: number
    /** timerConfig */
    timerConfig?: TimeConfig
    /** data */
    data: {}[]
    /** enableFilter */
    enableFilter?: boolean
  }

  export type ShareInformationBean = {
    /** 分享渠道 */
    type?: ShareInfoType
    /** title 标题 */
    title: string
    /** message 文本内容 */
    message: string
    /** contentType 内容类型 */
    contentType?: ShareInfoContentType
    /** recipients 邮件收件人/短信接收人 */
    recipients?: string[]
    /** imagePath 图片路径 */
    imagePath?: string
    /** filePath 当 contentType == file 时候使用 */
    filePath?: string
    /** web 当 contentType == file 时候使用 */
    webPageUrl?: string
    /** miniProgramInfo 当 contentType == miniProgram 时候使用，且分享渠道必须是微信。 */
    miniProgramInfo?: MiniProgramInfo
  }

  export type ShareChannelResponse = {
    /** 可分享的渠道列表(WeChat、Message、Email、More) */
    shareChannelList: string[]
  }

  export type SharePanelParams = {
    /** 分享内容类型 */
    contentType: number
  }

  export type SharePanelResponse = {
    /** 分享渠道类型 */
    platformType: string
    /** 选中渠道是否安装 */
    installed: boolean
  }

  export type ShareContentParams = {
    /** 分享渠道类型 */
    platformType: string
    /** 相册内容标识 */
    localIdentifier: string
    /** 分享内容类型 */
    contentType: number
  }

  export type ShareContentResponse = {
    /** 分享结果码 */
    code: number
    /** 分享结果描述 */
    msg: string
  }

  export type SiriEnabledResponse = {
    /** 是否支持 */
    isSupported: boolean
  }

  export type ShortcutAssociatedParams = {
    /** 场景 id */
    sceneId: string
    /** 场景 name */
    name?: string
  }

  export type ShortcutAssociatedResponse = {
    /** 是否已关联 */
    isAssociated: boolean
  }

  export type ShortcutParams = {
    /** 操作类型。0-添加、1-移除 */
    type: number
    /** 场景 id */
    sceneId: string
    /** 场景名称 */
    name: string
    /** 场景 logo */
    iconUrl?: string
  }

  export type ShortcutOperationResponse = {
    /** 操作步骤，0-添加、1-移除、2-更新、3-取消 */
    operationStep: number
    /** 操作状态，YES，表示成功；NO，表示失败 */
    operationStatus: boolean
  }

  export type UserInfoResult = {
    /** nickName 用户昵称 */
    nickName: string
    /** 用户头像 */
    avatarUrl: string
    /** 国家代码 */
    phoneCode: string
    /** 所在服务器区域 RegionCode */
    regionCode: string
    /** 是否是临时用户 */
    isTemporaryUser: boolean
    /** 时区 */
    timezoneId: string
    /** 账号的注册方式 ThingRegType */
    regFrom: number
    /** 温度单位 TempUnit */
    tempUnit: number
  }

  export type DiyHomeStatusParam = {
    /** 是否开启全屋模式 */
    isOn: boolean
  }

  export type ChangeDiyHomeResponse = {
    /** 是否操作成功, true 切换成功；false 用户取消 */
    isSuccess: boolean
  }

  export type ImageResizeBean = {
    /**
     * 压缩参数
     * aspectFitWidth 自适应宽度
     */
    aspectFitWidth: number
    /** aspectFitHeight 自适应高度 */
    aspectFitHeight: number
    /** maxFileSize 最大图片文件大小限制值， 为空则不做限制, 单位:B */
    maxFileSize?: number
    /** path 图片路径 */
    path: string
  }

  export type ImageResizeResultBean = {
    /**
     * 图片返回内容
     * path 图片路径
     */
    path: string
  }

  export type ImageRotateBean = {
    /** path 图片路径 */
    path: string
    /**
     * orientation 旋转方向
     * 90 - 顺时针90°
     * 180 - 顺时针180°
     * 270 - 顺时针270°
     */
    orientation: number
  }

  export type ImageEncryptBean = {
    /** path 图片url */
    url: string
    /** encryptKey 密钥 */
    encryptKey: string
    /**
     * orientation 旋转方向
     * 90 - 顺时针90°
     * 180 - 顺时针180°
     * 270 - 顺时针270°
     */
    orientation: number
  }

  export type ScreenShotResultBean = {
    /**
     * 截图本地地址
     * path 图片路径
     */
    path: string
  }

  export type WechatSupport = {
    /** 是否支持微信绑定 */
    isSupport: boolean
  }

  export type MiniApp = {
    /** 小程序原始 appId */
    miniAppId: string
    /** 小程序路径 */
    path: string
    /**
     * mini program Type:
     *  0: 正式版 MINIPTOGRAM_TYPE_RELEASE
     *  1: 测试版 MINIPROGRAM_TYPE_TEST
     *  2: 预览版 MINIPROGRAM_TYPE_PREVIEW
     */
    miniProgramType: number
  }

  export type Result = {
    /** 结果 */
    result: boolean
  }

  export type Call = {
    /** 设备id */
    targetId: string
    /**
     * 超时时间，单位秒
     * note: 不要传时间戳
     */
    timeout: number
    /** 通话业务参数 例如linux中控 {"channelType": 1, "category": "dgnzk"} */
    extra: any
  }

  /**
   *@description AI语音助手管理器*/
  interface AsrListenerManager {
    /**
     *@description 状态*/
    getAsrActive(params: {
      success?: (params: {
        /** 状态 */
        isActive: boolean
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
     *@description 关闭麦克风，关闭后识音要等到全部识别完成才结束*/
    stopDetect(params: {
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
     *@description 关闭麦克风，关闭后识音要等到全部识别完成才结束*/
    startDetect(params: {
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
     *@description 开始监听 + 识音*/
    onDetect(
      listener: (params: {
        /** 拾音状态 0. 未开启 1.进行中 2.结束 3.发送错误 */
        state: number
        /** 语言转换内容 */
        text: string
        /** 错误码 0. 录音时间太短 */
        errorCode: number
      }) => void
    ): void

    /**
     *@description 取消监听*/
    offDetect(
      listener: (params: {
        /** 拾音状态 0. 未开启 1.进行中 2.结束 3.发送错误 */
        state: number
        /** 语言转换内容 */
        text: string
        /** 错误码 0. 录音时间太短 */
        errorCode: number
      }) => void
    ): void
  }
  /**
   *@description 创建拾音监听*/
  export function getAsrListenerManager(params: {
    /** 家庭id */
    homeId: string
    /** 码率，eg：u律传8000，pcm传16000 */
    sampleRate: number
    /** 通道， eg：1 */
    channels: number
    /** 编码格式，eg：ThingAudioAsrCodeTypePCM = 0 ,ThingAudioAsrCodeTypePCMU = 1 */
    codec: string
    /** 云端asr解析选项， 注意不要设置其他跟文本无关的参数，本检测只会处理跟文本相关的数据，nlp，skill，tts不包含。 */
    options: string
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
  }): AsrListenerManager

  /**
   *@description 日志管理器*/
  interface LogManager {
    /**
     *@description log日志*/
    log(params: {
      /** 单条日志不要过10k */
      message: string
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
     *@description error日志*/
    error(params: {
      /** 单条日志不要过10k */
      message: string
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
     *@description 上报日志
     *@error {7: 'API Internal processing failed'}*/
    feedback(params: {
      /** 单条日志不要过10k */
      message: string
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
     *@description debug日志*/
    debug(params: {
      /** 单条日志不要过10k */
      message: string
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
  }
  /**
   *@description 创建日志实例对象*/
  export function getLogManager(params: {
    /** 自定义标记 */
    tag: string
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
  }): LogManager

  /**
   *@description 建立MQTT连接通道*/
  interface MQTTClientTask {
    /**
     *@description 连接MQTT*/
    connect(params: {
      /** mqtt服务器地址 */
      host: string
      /** mqtt服务器端口 */
      port: number
      /** mqtt服务器用户名 */
      userName?: string
      /** mqtt服务器密码 */
      password?: string
      /** mqtt服务器clientId */
      clientId: string
      /** 是否使用ssl */
      ssl: boolean
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
     *@description 断开MQTT*/
    disconnect(params: {
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
     *@description 订阅主题*/
    subscribe(params: {
      /** 主题 */
      topic: string
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
     *@description 取消订阅*/
    unsubscribe(params: {
      /** 主题 */
      topic: string
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
     *@description 发布消息*/
    publish(params: {
      /** 主题 */
      topic: string
      /** 消息 */
      message: string
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
     *@description 监听MQTT消息*/
    onMessage(
      listener: (params: {
        /** 主题 */
        topic: string
        /** 消息 */
        message: string
      }) => void
    ): void

    /**
     *@description 取消监听MQTT消息*/
    offMessage(
      listener: (params: {
        /** 主题 */
        topic: string
        /** 消息 */
        message: string
      }) => void
    ): void

    /**
     *@description 监听MQTT状态变化*/
    onStateChange(
      listener: (params: {
        /**
         * 状态
         * 1:连接中
         * 2:连接成功
         * 3:断连中
         * 4:连接断开
         * 5:连接失败
         */
        state: number
      }) => void
    ): void

    /**
     *@description 取消监听MQTT状态变化*/
    offStateChange(
      listener: (params: {
        /**
         * 状态
         * 1:连接中
         * 2:连接成功
         * 3:断连中
         * 4:连接断开
         * 5:连接失败
         */
        state: number
      }) => void
    ): void
  }
  /**
   *@description 创建MQTT实例*/
  export function createMQTTClient(params?: {
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
  }): MQTTClientTask

  /**
   *@description EventChannel*/
  interface EventChannelManager {
    /**
     *@description 取消注册事件通道，取消注册后将不再接收事件
     *@error {6: 'The parameter format is incorrect'}*/
    unRegisterChannel(params: {
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
  }
  /**
   *@description 注册事件通道，可用于跨小程序/跨容器通信，需要配合emitChannel、onReceiveMessage使用
   *@error {6: 'The parameter format is incorrect'}*/
  export function registerChannel(params: {
    /** 事件名称 */
    eventName: string
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
  }): EventChannelManager
}
