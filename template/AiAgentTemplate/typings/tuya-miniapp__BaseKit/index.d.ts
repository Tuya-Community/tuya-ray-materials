/**
 * BaseKit
 *
 * @version 3.19.3
 */
declare namespace ty {
  /**
   *@description 停止监听加速度数据
   *@error {10001: 'Sensor initialization fail'}*/
  export function stopAccelerometer(params?: {
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
   *@description 开始监听加速度数据，初始化事件回调方法
   *@error {10001: 'Sensor initialization fail'}*/
  export function startAccelerometer(params?: {
    /** 监听加速度数据回调函数的执行频率 */
    interval?: AccelerometerInterval
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
   *@description 获取音频文件时长信息
   *@error {5: 'The necessary parameters are missing'} | {10011: 'file not exist'}*/
  export function getAudioFileDuration(params: {
    /** 音频文件路径 */
    path: string
    success?: (params: {
      /** 音频时长, 单位 ms */
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
    complete?: () => void
  }): void

  /**
   *@description 权限请求方法
   *@error {9001: 'Activity is invalid'} | {9003: 'can‘t find scope permission'} | {9004: 'app no permission'}*/
  export function authorize(params?: {
    /** scope 权限名称 */
    scope?: ScopeBean
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
   *@description 查询权限状态
   *@error {9001: 'Activity is invalid'} | {9003: 'can‘t find scope permission'} | {9004: 'app no permission'} | {9005: 'can‘t find service'}*/
  export function authorizeStatus(params?: {
    /** scope 权限名称 */
    scope?: ScopeBean
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
   *@description 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限*/
  export function getSetting(params?: {
    success?: (params: {
      /** 用户授权结果 */
      authSetting: any
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
   *@description 授权某个协议*/
  export function authorizePolicy(params: {
    /** 当前授权的协议类型，不同协议可以独立授权.例如：ai_algorithm 表示AI算法协议 */
    type: string
    /** 协议的版本 */
    version: string
    /** 协议授权操作 /1 同意 2 不同意 */
    status: number
    success?: (params: {
      /** 是否同意 */
      agreed: boolean
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
   *@description 查询协议的授权状态*/
  export function authorizePolicyStatus(params: {
    /** 当前授权的协议类型，不同协议可以独立授权. 例如：ai_algorithm 表示AI算法协议 */
    type: string
    success?: (params: {
      /** 标题 */
      title: string
      /** 协议名称 */
      agreementName: string
      /** 协议描述 */
      agreementDesc: string
      /** 协议链接 */
      link: string
      /** 协议版本 */
      version: string
      /** 0 未签署（首次）1 未签署（更新）2 已签署 */
      sign: number
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
   *@description 打开另一个小程序
   *@error {9005: 'can‘t find service'} | {40009: 'miniapp already been open, cannot be open again'}*/
  export function navigateToMiniProgram(params?: {
    /** 要打开的小程序appId */
    appId?: string
    /** 要打开的智能体小程序的智能体Id */
    aiPtChannel?: string
    /**
     * 要打开的小程序智能体的版本。
     * preview：体验版
     * release：正式版
     */
    aiPtType?: string
    /** 打开的页面路径,如果为空则打开首页,path 中 ? 后面的部分会成为 query，在小程序的 `App.onLaunch`、`App.onShow` 和 `Page.onLoad` 的回调函数 */
    path?: string
    /** 打开小程序的转场方式,分为right|bottom,指代水平和竖直方向 */
    position?: string
    /** 传递给目标小程序的数据,目标小程序可在 `App.onLaunch`，`App.onShow` 中获取到这份数据 */
    extraData?: any
    /**
     * 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版
     * trial：体验版
     * release：正式版
     */
    envVersion?: string
    /** 小程序链接，当传递该参数后，可以不传 appId 和 path */
    shortLink?: string
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
   *@description 判断API，回调，参数等是否在当前版本可用。
   *@error {5: 'The necessary parameters are missing'}*/
  export function canIUse(params: {
    /** 使用 ${API}.${method}.${param}.${option}方式来调用 */
    schema: string
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
   *@description 判断API，回调，参数等是否在当前版本可用。
   *@error {5: 'The necessary parameters are missing'}*/
  export function canIUseSync(schemaBean?: SchemaBean): {
    /** 当前版本是否可用 */
    result: boolean
  }

  /**
   *@description 获取视频缩略图*/
  export function fetchVideoThumbnails(params: {
    /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 (本地路径) */
    filePath: string
    /** 开始时间，毫秒 */
    startTime: number
    /** 结束时间，毫秒 */
    endTime: number
    /** 缩略图个数 */
    thumbnailCount: number
    /** 缩略图宽高，期望值 */
    thumbnailWidth: number
    /** 缩略图高，期望值 */
    thumbnailHeight: number
    success?: (params: {
      /** 缩略图路径 */
      thumbnailsPath?: string[]
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
   *@description 清空视频缩略图*/
  export function clearVideoThumbnails(params: {
    /** 对应视频文件名称 */
    videoName: string
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
   *@description 裁剪视频*/
  export function clipVideo(params: {
    /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 (本地路径) */
    filePath: string
    /** 开始时间，毫秒 */
    startTime: number
    /** 结束时间，毫秒 */
    endTime: number
    /**
     * 目标压缩的分辨率
     * 1 - 480*854  码率：1572*1000
     * 2 - 540*960   码率：2128*1000
     * 3 - 720*1280  码率：3145*1000
     * 4 - 1080*1920  码率：3500*1000
     */
    level: number
    success?: (params: {
      /** 裁剪视频路径 */
      videoClipPath?: string
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
   *@description 开始监听罗盘数据
   *@error {10001: 'Sensor initialization fail'}*/
  export function startCompass(params?: {
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
   *@description 停止监听罗盘数据
   *@error {10001: 'Sensor initialization fail'}*/
  export function stopCompass(params?: {
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
   *@description 开始监听设备方向的变化。
   *@error {10001: 'Sensor initialization fail'}*/
  export function startDeviceMotionListening(params?: {
    /** 监听加速度数据回调函数的执行频率 */
    interval?: DeviceMotionInterval
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
   *@description 停止监听设备方向的变化。
   *@error {10001: 'Sensor initialization fail'}*/
  export function stopDeviceMotionListening(params?: {
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
   *@description 获取通用缓存路径
   *@error {9002: 'Context is invalid'}*/
  export function getTempDirectory(params?: {
    success?: (params: {
      /** 【待废弃， 不建议使用】临时文件夹路径 */
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
    complete?: () => void
  }): void

  /**
   *@description 写日志文件,需要APP配套使用检测设备网络功能进行日志上传查看。
   *@error {5: 'The necessary parameters are missing'} | {6: 'The parameter format is incorrect'} | {10011: 'file not exist'} | {10019: 'write file error'} | {10020: 'sdcard not mounted error'}*/
  export function writeLogFile(params: {
    /** 标识信息，传入devId或groupId */
    resId: string
    /** 要写入的文本数据, 使用utf8编码 */
    data: string
    /** 内容添加形式，true为追加在文件尾部，false为覆写文件 */
    append?: boolean
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
   *@description 获取该小程序下的 本地临时文件 或 本地缓存文件 信息
   *@error {5: 'The necessary parameters are missing'} | {6: 'The parameter format is incorrect'} | {10011: 'file not exist'} | {10026: 'get file info error'}*/
  export function getFileInfo(params: {
    /** 要读取的文件路径 */
    filePath: string
    /** 计算文件摘要的算法, md5/sha1/sha256 默认MD5 */
    digestAlgorithm: string
    success?: (params: {
      /** 文件大小,字节 */
      size: number
      /** 按照传入的 digestAlgorithm 计算得出的的文件摘要 */
      digest: string
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
   *@description 开始监听陀螺仪数据。
   *@error {7: 'API Internal processing failed'} | {10001: 'Sensor initialization fail'}*/
  export function startGyroscope(params?: {
    /** 监听陀螺仪数据回调函数的执行频率 */
    interval?: GyroscopeInterval
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
   *@description 停止监听陀螺仪数据。
   *@error {10001: 'Sensor initialization fail'}*/
  export function stopGyroscope(params?: {
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
   *@description 初始化*/
  export function initializeUploadFile(params: {
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
   *@description 上传文件*/
  export function uploadFileToDevice(params: {
    /** 设备id */
    deviceId: string
    /** sid */
    sid: string
    /** 上传文件路径列表 */
    fileList?: string[]
    /** 扩展字段 */
    extData?: Object
    success?: (params: {
      /** 任务id */
      taskId: string
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
   *@description 取消上传*/
  export function cancelUploadFileToDevice(params: {
    /** 任务id */
    taskId: string
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
   *@description 压缩图片*/
  export function compressImage(params: {
    /** 压缩图片路径列表 */
    fileList?: string[]
    /** 压缩图片的目标宽 */
    dstWidth: number
    /** 压缩图片的目标高 */
    dstHeight: number
    success?: (params: {
      /** 压缩完成的图片路径列表 */
      fileList?: string[]
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
   *@description 图片裁剪*/
  export function cropImages(params?: {
    /** 裁剪图片的地址 */
    cropFileList?: CropImageItemBean[]
    success?: (params: {
      /** 裁剪完成的图片路径列表 */
      fileList?: string[]
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
   *@description 从本地相册选择图片或使用相机拍照, 可用chooseMedia替代此方法
   *
   *权限：[scope.camera, scope.writePhotosAlbum]
   *关联API：[chooseMedia]
   *@error {7: 'API Internal processing failed'} | {10002: 'Image picker error'}*/
  export function chooseImage(params?: {
    /**
     * 最多可以选择的图片张数
     * 注意：Android13以上的版本，使用的是系统图片选择器，该字段不生效
     */
    count?: number
    /** sizeType ['original', 'compressed'] */
    sizeType?: string[]
    /** 选择图片的来源 ['album', 'camera'] */
    sourceType?: string[]
    /** 是否取消选择图片后关闭界面的动画效果 */
    disableDismissAnimationAfterSelect?: boolean
    success?: (params: {
      /** 图片的本地临时文件路径列表 (本地路径) */
      tempFilePaths: string[]
      /** sizeType ['original', 'compressed'] */
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
    complete?: () => void
  }): void

  /**
   *@description 拍摄或从手机相册中选择图片或视频
   *
   *权限：[scope.camera, scope.writePhotosAlbum]
   *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'} | {8: 'Method Unauthorized access'} | {10002: 'Image picker error'}*/
  export function chooseMedia(params?: {
    /**
     * 最多可以选择的文件数。
     * 注意：Android13以上的版本，使用的是系统图片选择器，该字段不生效
     */
    count?: number
    /**
     * 选择类型, 默认图片
     * 'image' 只能拍摄图片或从相册选择图片
     * 'video' 只能拍摄视频或从相册选择视频
     */
    mediaType?: string
    /**
     * 图片和视频选择的来源, 默认['album', 'camera']
     * 'album' 从相册选择
     * 'camera' 	使用相机拍摄
     */
    sourceType?: string[]
    /**
     * 拍摄视频最长拍摄时间，单位秒。默认10s
     * 时间范围为 3s 至 60s 之间。不限制相册。
     */
    maxDuration?: number
    /**
     * 该参数只对iOS有效
     * 是否拷贝视频：
     * 默认true，拷贝视频，返回视频拷贝地址，返回视频封面地址
     * false，不拷贝视频，返回视频相册中的地址，返回视频封面图地址
     */
    isFetchVideoFile?: boolean
    /**
     * 该参数只对iOS有效
     * 相册选择的视频是否需要裁剪
     * 默认为false, 不裁剪视频
     */
    isClipVideo?: boolean
    /**
     * 视频最长剪辑时间，单位秒。默认60s
     * 需要设置isClipVideo为true才生效
     * 时间范围为 60s 至 600 之间。 选择视频的时长小于15s不裁剪
     */
    maxClipDuration?: number
    /**
     * 该参数只对iOS有效
     * 选择导出的文件名称，和相册中文件的名称一致
     * 默认为false, 使用每次文件名称唯一
     */
    isGetAlbumFileName?: boolean
    success?: (params: {
      /**
       * 文件类型
       * 'image' 图片
       * 'video' 视频
       */
      type: string
      /** 本地临时文件列表 */
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
    complete?: () => void
  }): void

  /**
   *@description 从本地相册选择图片或使用相机拍照（可裁剪）
   *@error {7: 'API Internal processing failed'} | {9: 'Method UnKnown error'} | {9001: 'Activity is invalid'} | {9004: 'app no permission'} | {9005: 'can‘t find service'} | {10002: 'Image picker error'}*/
  export function chooseCropImage(params?: {
    /** 选择图片的来源 ['album', 'camera']，默认都支持 */
    sourceType?: string[]
    success?: (params: {
      /** 文件路径 */
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
   *@description 在新页面中全屏预览图片。
   *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'} | {9001: 'Activity is invalid'} | {10002: 'Image picker error'}*/
  export function previewImage(params: {
    /** 需要预览的图片链接列表 */
    urls: string[]
    /** 当前显示图片的链接 */
    current: number
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
   *@description 获取图片信息
   *@error {6: 'The parameter format is incorrect'} | {10022: 'media info parse error'} | {10023: 'nvalid params when parse media info'}*/
  export function getImageInfo(params: {
    /** 图片的路径，支持网络路径、本地路径 */
    src: string
    success?: (params: {
      /** 图片原始宽度，单位px。不考虑旋转。 */
      width: number
      /** 图片原始高度，单位px。不考虑旋转。 */
      height: number
      /**
       * 拍照时设备方向
       * 合法值	说明
       * up	默认方向（手机横持拍照），对应 Exif 中的 1。或无 orientation 信息。
       * up-mirrored	同 up，但镜像翻转，对应 Exif 中的 2
       * down	旋转180度，对应 Exif 中的 3
       * down-mirrored	同 down，但镜像翻转，对应 Exif 中的 4
       * left-mirrored	同 left，但镜像翻转，对应 Exif 中的 5
       * right	顺时针旋转90度，对应 Exif 中的 6
       * right-mirrored	同 right，但镜像翻转，对应 Exif 中的 7
       * left	逆时针旋转90度，对应 Exif 中的 8
       */
      orientation: string
      /**
       * 图片格式。
       * 合法值	说明
       * unknown	未知格式
       * jpeg	jpeg压缩格式
       * png	png压缩格式
       * gif	gif压缩格式
       * tiff	tiff压缩格式
       */
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
    complete?: () => void
  }): void

  /**
   *@description 获取视频信息
   *@error {6: 'The parameter format is incorrect'} | {10022: 'media info parse error'} | {10023: 'nvalid params when parse media info'}*/
  export function getVideoInfo(params: {
    /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 */
    src: string
    success?: (params: {
      /** 图片原始宽度，单位px。不考虑旋转。 */
      width: number
      /** 图片原始高度，单位px。不考虑旋转。 */
      height: number
      /**
       * 画面方向
       * 合法值	说明
       * up	默认方向（手机横持拍照），对应 Exif 中的 1。或无 orientation 信息。
       * up-mirrored	同 up，但镜像翻转，对应 Exif 中的 2
       * down	旋转180度，对应 Exif 中的 3
       * down-mirrored	同 down，但镜像翻转，对应 Exif 中的 4
       * left-mirrored	同 left，但镜像翻转，对应 Exif 中的 5
       * right	顺时针旋转90度，对应 Exif 中的 6
       * right-mirrored	同 right，但镜像翻转，对应 Exif 中的 7
       * left	逆时针旋转90度，对应 Exif 中的 8
       */
      orientation: string
      /** 视频格式 */
      type: string
      /** 视频时长 */
      duration: number
      /** 视频大小，单位 kB */
      size: number
      /** 视频帧率 */
      fps: number
      /** 视频码率，单位 kbps */
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
    complete?: () => void
  }): void

  /**
   *@description 保存视频到系统相册，支持mp4视频格式，需要相册权限
   *@error {8: 'Method Unauthorized access'} | {10023: 'nvalid params when parse media info'} | {10024: 'invalid params when save video'} | {10025: 'save video error'}*/
  export function saveVideoToPhotosAlbum(params: {
    /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 (本地路径) */
    filePath: string
    /**
     * 是否修改视频的创建日期
     * 默认false，不修改视频的创建日期。ture，修改视频的创建日期为当前保存时间
     */
    modifyCreationDate?: boolean
    success?: (params: {
      /** 相册视频标识符 */
      localIdentifier: string
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
   *@description 保存图片到系统相册
   *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'} | {8: 'Method Unauthorized access'} | {10023: 'nvalid params when parse media info'}*/
  export function saveImageToPhotosAlbum(params: {
    /** 图片文件路径，可以是临时文件路径也可以是永久文件路径 (本地路径) */
    filePath: string
    /**
     * 是否修改视频的创建日期
     * 默认false，不修改视频的创建日期。ture，修改视频的创建日期为当前保存时间
     */
    modifyCreationDate?: boolean
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
   *@description 裁剪图片选择
   *@error {5: 'The necessary parameters are missing'} | {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'} | {10002: 'Image picker error'}*/
  export function cropImage(params: {
    /** 图片路径 */
    path: string
    /** 裁剪的宽度 */
    width: number
    /** 裁剪的高度 */
    height: number
    /** 裁剪后的图片类型, 0:jpg 1:png */
    type: number
    success?: (params: {
      /** 裁剪后图片路径 */
      cropPath: string
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
   *@description 获取图片的缩略图
   *@error {5: 'The necessary parameters are missing'} | {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'}*/
  export function fetchImageThumbnail(params: {
    /** 资源原始地址 */
    originPath: string
    /** 缩略图宽度 px */
    thumbWidth: number
    /** 缩略图高度 px */
    thumbHeight: number
    success?: (params: {
      /** 缩略图地址 */
      thumbnailPath: string
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
   *@description 显示消息提示框
   *@error {9001: 'Activity is invalid'}*/
  export function showToast(params: {
    /** 提示的内容 */
    title: string
    /** 图标 'success' / 'error' / 'loading' / 'none' */
    icon?: string
    /** 自定义图标的本地路径，image 的优先级高于 icon */
    image?: string
    /** 提示的延迟时间（仅iOS生效） */
    duration?: number
    /** 是否显示透明蒙层，防止触摸穿透 */
    mask?: boolean
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
   *@description 显示模态对话框
   *@error {9001: 'Activity is invalid'}*/
  export function showModal(params: {
    /** 提示的标题 */
    title: string
    /** 提示的内容 */
    content?: string
    /** 是否显示取消按钮 */
    showCancel?: boolean
    /** 取消按钮的文字，最多 4 个字符 */
    cancelText?: string
    /** 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
    cancelColor: string
    /** 确认按钮的文字，最多 4 个字符 */
    confirmText?: string
    /** 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
    confirmColor: string
    /** 是否全局弹窗，若为全局弹窗，弹在最顶上 */
    isShowGlobal?: boolean
    success?: (params: {
      /** 为 true 时，表示用户点击了确定按钮 */
      confirm: boolean
      /** 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭） */
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
    complete?: () => void
  }): void

  /**
   *@description 显示 loading 提示框。需主动调用 thing.hideLoading 才能关闭提示框*/
  export function showLoading(params: {
    /** 提示的内容 */
    title: string
    /** 是否显示透明蒙层，防止触摸穿透 */
    mask?: boolean
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
   *@description 显示操作菜单
   *@error {6: 'The parameter format is incorrect'} | {9001: 'Activity is invalid'}*/
  export function showActionSheet(params: {
    /** 警示文案 */
    alertText?: string
    /** 按钮的文字数组，数组长度最大为 6 */
    itemList: string[]
    /** 按钮的文字颜色 */
    itemColor?: string
    /** 按钮的文字颜色 */
    itemColors?: string[]
    success?: (params: {
      /** 用户点击的按钮序号，从上到下的顺序，从0开始 */
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
    complete?: () => void
  }): void

  /**
   *@description 隐藏消息提示框*/
  export function hideToast(params?: {
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
   *@description 隐藏 loading 提示框*/
  export function hideLoading(params?: {
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
   *@description 拨打电话*/
  export function makePhoneCall(params: {
    /** 需要拨打的电话号码 */
    phoneNumber: string
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
   *@description 设置系统剪贴板的内容
   *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'}*/
  export function setClipboardData(params: {
    /**
     * 是否敏感信息
     * true 是; false 否; 默认非敏感信息
     * 如果是敏感信息, 则可组织敏感内容出现在Android 13及更高版本中的复制视觉确认中显示的任何内容预览中
     * 需要注意的是, 该属性仅针对Android 13及更高版本的机型上适用
     */
    isSensitive?: boolean
    /** 剪贴板的内容 */
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
   *@description 获取系统剪贴板的内容
   *@error {7: 'API Internal processing failed'}*/
  export function getClipboardData(params?: {
    success?: (params: {
      /** 剪贴板的内容 */
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
   *@description 设置系统音量
   *@error {6: 'The parameter format is incorrect'}*/
  export function updateVolume(params: {
    /** 音量，阈值【0 - 1】 */
    value: number
    /**
     * 音量类型（仅Android生效）
     * 0：语音电话的声音
     * 1：手机系统声音
     * 2：响铃，通知，系统默认音等
     * 3：手机音乐的声音
     * 4：手机闹铃的声音
     * 5：手机通知的声音
     * 6：蓝牙音量
     */
    volumeMode?: number[]
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
   *@description 获取当前系统音量
   *注意：Android是系统的音量是有区分的，该接口获取的是系统电话铃声的音量值。如需要获取其他系统音量值，请使用getCurrentVolumeByMode接口*/
  export function getCurrentVolume(params?: {
    success?: (params: {
      /** 音量，阈值【0 - 1】 */
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
    complete?: () => void
  }): void

  /**
   *@description 获取不同模式的系统音量
   *注意：Android支持通过volumeMode参数获取不同系统声音的音量值。iOS仅有一个系统音量值，volumeMode不生效。*/
  export function getCurrentVolumeByMode(params?: {
    /**
     * 音量类型（仅Android生效）
     * 0：语音电话的声音
     * 1：手机系统声音
     * 2：响铃，通知，系统默认音等
     * 3：手机音乐的声音
     * 4：手机闹铃的声音
     * 5：手机通知的声音
     * 6：蓝牙音量
     */
    volumeMode?: number
    success?: (params: {
      /** 音量，阈值【0 - 1】 */
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
    complete?: () => void
  }): void

  /**
   *@description 注册系统音量监听
   *
   *关联API：[onSystemVolumeChangeEvent, unRegisterSystemVolumeChange]*/
  export function registerSystemVolumeChange(params?: {
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
   *@description 取消注册系统音量监听
   *
   *关联API：[onSystemVolumeChangeEvent, registerSystemVolumeChange]*/
  export function unRegisterSystemVolumeChange(params?: {
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
   *@description 获取设备设置*/
  export function getSystemSetting(params?: {
    success?: (params: {
      /** 蓝牙的系统开关，默认false */
      bluetoothEnabled?: boolean
      /** 地理位置的系统开关，默认false */
      locationEnabled?: boolean
      /** Wi-Fi 的系统开关，默认false */
      wifiEnabled?: boolean
      /**
       * 设备方向, 默认竖屏
       * 竖屏 = "portrait"， 横屏 = "landscape"
       */
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
    complete?: () => void
  }): void

  /**
   *@description 获取设备基础信息*/
  export function getDeviceInfo(params?: {
    success?: (params: {
      /** 应用二进制接口类型（仅 Android 支持） */
      abi: string
      /** 设备品牌 */
      brand: string
      /** 设备型号。新机型刚推出一段时间会显示unknown。 */
      model: string
      /** 操作系统及版本 */
      system: string
      /** 客户端平台 */
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
    complete?: () => void
  }): void

  /**
   *@description 获取系统信息
   *@error {9002: 'Context is invalid'}*/
  export function getSystemInfo(params?: {
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
      /** 可使用窗口宽度 */
      useableWindowWidth: number
      /** 可使用窗口高度 */
      useableWindowHeight: number
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
      /** 设备等级(低:low-中:middle-高:high) */
      deviceLevel: string
      /** 手机系统是否支持创建快捷方式（仅Android使用） */
      isSupportPinShortcut?: boolean
      /**
       * 设备类型
       * phone：手机
       * pad：平板
       */
      deviceType?: string
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
   *@description 获取系统信息
   *@error {9002: 'Context is invalid'}*/
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
    /** 可使用窗口宽度 */
    useableWindowWidth: number
    /** 可使用窗口高度 */
    useableWindowHeight: number
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
    /** 设备等级(低:low-中:middle-高:high) */
    deviceLevel: string
    /** 手机系统是否支持创建快捷方式（仅Android使用） */
    isSupportPinShortcut?: boolean
    /**
     * 设备类型
     * phone：手机
     * pad：平板
     */
    deviceType?: string
  }

  /**
   *@description 获取手机附近的Wi-Fi列表；列表数据通过onGetWifiList事件发送
   *注意：Android需要申请手机的位置权限、Wi-Fi状态权限、网络权限；iOS上不可用
   *@error {9004: 'app no permission'} | {9005: 'can‘t find service'}*/
  export function getWifiList(params?: {
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
   *@description 获取当前连接的wifi信息
   *注意：Android需要申请手机的位置权限、Wi-Fi状态权限、网络权限；iOS上不可用
   *@error {9004: 'app no permission'} | {9005: 'can‘t find service'} | {10021: 'SSID nil error'}*/
  export function getConnectedWifi(params?: {
    /**
     * 是否需要返回部分 Wi-Fi 信息
     * 安卓 thing.getConnectedWifi 若设置了 partialInfo:true ，将会返回只包含 SSID 属性的 WifiInfo 对象。
     * iOS thing.getConnectedWifi 若设置了 partialInfo:true ，将会返回只包含 SSID、BSSID 属性的 WifiInfo 对象。
     * 默认值：false
     */
    partialInfo?: boolean
    success?: (params: {
      /** wifi的SSID */
      SSID: string
      /** wifi的BSSID */
      BSSID: string
      /** Wi-Fi 信号强度, 安卓取值 0 ～ 100 ，iOS 取值 0 ～ 1 ，值越大强度越大 */
      signalStrength: number
      /**
       * Wi-Fi是否安全
       * Android：Android系统12开始支持。
       */
      secure: boolean
      /** Wi-Fi 频段单位 MHz */
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
    complete?: () => void
  }): void

  /**
   *@description 跳转系统蓝牙设置页 (仅Android支持)
   *@error {9002: 'Context is invalid'}*/
  export function openSystemBluetoothSetting(params?: {
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
   *@description 获取当前APP授权设置*/
  export function getAppAuthorizeSetting(params?: {
    success?: (params: {
      /** 允许使用相册的开关（仅 iOS 有效）authorized'/'denied'/'not determined */
      albumAuthorized: string
      /** 允许使用蓝牙的开关（仅 iOS 有效） authorized'/'denied'/'not determined */
      bluetoothAuthorized: string
      /** 允许使用摄像头的开关 authorized'/'denied'/'not determined */
      cameraAuthorized: string
      /** 允许使用定位的开关 authorized'/'denied'/'not determined */
      locationAuthorized: string
      /** 定位准确度。true 表示模糊定位，false 表示精确定位（仅 iOS 有效） */
      locationReducedAccuracy: boolean
      /** 允许使用麦克风的开关 'authorized'/'denied'/'not determined' */
      microphoneAuthorized: string
      /** 允许通知的开关 'authorized'/'denied'/'not determined' */
      notificationAuthorized: string
      /** 允许通知带有提醒的开关（仅 iOS 有效） 'authorized'/'denied'/'not determined' */
      notificationAlertAuthorized: string
      /** 允许通知带有标记的开关（仅 iOS 有效） 'authorized'/'denied'/'not determined' */
      notificationBadgeAuthorized: string
      /** 允许通知带有声音的开关（仅 iOS 有效） 'authorized'/'denied'/'not determined' */
      notificationSoundAuthorized: string
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
   *@description 获取网络类型
   *@error {7: 'API Internal processing failed'} | {9001: 'Activity is invalid'}*/
  export function getNetworkType(params?: {
    success?: (params: {
      /** 网络类型 */
      networkType: string
      /**
       * 信号强弱，单位 dbm
       * 注意: iOS不支持
       */
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
    complete?: () => void
  }): void

  /**
   *@description 设置屏幕亮度
   *@error {6: 'The parameter format is incorrect'} | {9001: 'Activity is invalid'}*/
  export function setScreenBrightness(params: {
    /** 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮 */
    value: number
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
   *@description 获取屏幕亮度
   *@error {9001: 'Activity is invalid'}*/
  export function getScreenBrightness(params?: {
    success?: (params: {
      /** 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮 */
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
    complete?: () => void
  }): void

  /**
   *@description 设置是否保持常亮状态
   *@error {9001: 'Activity is invalid'}*/
  export function setKeepScreenOn(params: {
    /** 是否保持屏幕常亮 */
    keepScreenOn: boolean
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
   *@description 使手机发生较短时间的振动（30 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
   *@error {9002: 'Context is invalid'}*/
  export function vibrateShort(params: {
    /** 震动强度类型，有效值为：heavy、medium、light */
    type: string
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
   *@description 使手机发生较长时间的振动（400 ms)
   *@error {9002: 'Context is invalid'}*/
  export function vibrateLong(params?: {
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
   *@description 调起客户端扫码界面进行扫码
   *注意：Android返回的数据中，只有result字段可用，其他字段无意义。
   *@error {7: 'API Internal processing failed'} | {9001: 'Activity is invalid'} | {9005: 'can‘t find service'}*/
  export function scanCode(params?: {
    /** 是否只能从相机扫码，不允许从相册选择图片 */
    onlyFromCamera?: boolean
    /** 是否显示动作标题(仅Android生效) */
    isShowActionTitle?: boolean
    /** 是否显示闪关灯(仅Android生效) */
    isShowTorch?: boolean
    /** 是否显示输入设置代码 */
    isShowKeyboard?: boolean
    /** 输入设置文案修改 */
    keyboardBean?: KeyboardBean
    /** 自定义提示标语(仅Android生效) */
    customTips?: string
    /** 扫码类型 */
    scanType?: string[]
    success?: (params: {
      /** 所扫码的内容 */
      result: string
      /** 所扫码的类型 */
      scanType: string
      /** 所扫码的字符集 */
      charSet: string
      /** 当所扫的码为当前小程序二维码时，会返回此字段，内容为二维码携带的 path (不一定会有返回值) */
      path: string
      /** 原始数据，base64编码 */
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
   *@description 调起客户端确认登录页面
   *@error {7: 'API Internal processing failed'}*/
  export function showScanLogin(params: {
    /** 扫码内容 */
    content: string
    success?: (params: {
      /** 扫码登录结果 0:确认登录成功 1:取消/返回 2:确认登录失败 */
      code: number
      /** 扫码登录失败错误描述 */
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
   *@description 将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。
   *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'} | {10010: 'storage json syntax error'}*/
  export function setStorage(params: {
    /** 本地缓存中指定的 key */
    key: string
    /** key对应的内容 */
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
   *@description 将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。
   *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'} | {10010: 'storage json syntax error'}*/
  export function setStorageSync(storageDataBean?: StorageDataBean): null

  /**
   *@description 从本地缓存中异步获取指定 key 的内容
   *@error {6: 'The parameter format is incorrect'}*/
  export function getStorage(params: {
    /** 本地缓存中指定的 key */
    key: string
    success?: (params: {
      /** key对应的内容 */
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
    complete?: () => void
  }): void

  /**
   *@description 从本地缓存中异步获取指定 key 的内容
   *@error {6: 'The parameter format is incorrect'}*/
  export function getStorageSync(storageKeyBean?: StorageKeyBean): {
    /** key对应的内容 */
    data?: string
  }

  /**
   *@description 清理本地数据缓存
   *@error {6: 'The parameter format is incorrect'}*/
  export function removeStorage(params: {
    /** 本地缓存中指定的 key */
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
   *@description 清理本地数据缓存
   *@error {6: 'The parameter format is incorrect'}*/
  export function removeStorageSync(storageKeyBean?: StorageKeyBean): null

  /**
   *@description 清理本地数据缓存*/
  export function clearStorage(params?: {
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
   *@description 清理本地数据缓存*/
  export function clearStorageSync(): null

  /**
   *@description 开始文件上传*/
  export function onUploadFileToDeviceStart(
    listener: (params: UploadStartEvent) => void
  ): void

  /**
   *@description 移除监听：开始文件上传*/
  export function offUploadFileToDeviceStart(
    listener: (params: UploadStartEvent) => void
  ): void

  /**
   *@description 上传文件进度回调*/
  export function onUploadFileToDeviceProgress(
    listener: (params: UploadProgressEvent) => void
  ): void

  /**
   *@description 移除监听：上传文件进度回调*/
  export function offUploadFileToDeviceProgress(
    listener: (params: UploadProgressEvent) => void
  ): void

  /**
   *@description 批量文件上传完成回调*/
  export function onUploadFileToDeviceComplete(
    listener: (params: UploadCompleteEvent) => void
  ): void

  /**
   *@description 移除监听：批量文件上传完成回调*/
  export function offUploadFileToDeviceComplete(
    listener: (params: UploadCompleteEvent) => void
  ): void

  /**
   *@description 分片上传进度回调*/
  export function onUploadFileFragToDeviceProgress(
    listener: (params: UploadFragProgressEvent) => void
  ): void

  /**
   *@description 移除监听：分片上传进度回调*/
  export function offUploadFileFragToDeviceProgress(
    listener: (params: UploadFragProgressEvent) => void
  ): void

  /**
   *@description onKeyboardHeightChange 发送键盘事件给js*/
  export function onKeyboardHeightChange(
    listener: (params: BeanRes) => void
  ): void

  /**
   *@description 移除监听：onKeyboardHeightChange 发送键盘事件给js*/
  export function offKeyboardHeightChange(
    listener: (params: BeanRes) => void
  ): void

  /**
   *@description 键盘弹出*/
  export function onKeyboardWillShow(listener: (params: BeanRes) => void): void

  /**
   *@description 移除监听：键盘弹出*/
  export function offKeyboardWillShow(listener: (params: BeanRes) => void): void

  /**
   *@description 键盘消息*/
  export function onKeyboardWillHide(listener: (params: BeanRes) => void): void

  /**
   *@description 移除监听：键盘消息*/
  export function offKeyboardWillHide(listener: (params: BeanRes) => void): void

  /**
   *@description 系统音量监听通知事件
   *
   *关联API：[registerSystemVolumeChange, unRegisterSystemVolumeChange]*/
  export function onSystemVolumeChangeEvent(
    listener: (params: VolumeResponse) => void
  ): void

  /**
   *@description 移除监听：系统音量监听通知事件
   *
   *关联API：[registerSystemVolumeChange, unRegisterSystemVolumeChange]*/
  export function offSystemVolumeChangeEvent(
    listener: (params: VolumeResponse) => void
  ): void

  /**
   *@description 监听获取到 Wi-Fi 列表数据事件*/
  export function onGetWifiList(
    listener: (params: WifiListResponse) => void
  ): void

  /**
   *@description 移除监听：监听获取到 Wi-Fi 列表数据事件*/
  export function offGetWifiList(
    listener: (params: WifiListResponse) => void
  ): void

  /**
   *@description 持续录音事件*/
  export function onRecordingEvent(
    listener: (params: AudioRecordBufferBean) => void
  ): void

  /**
   *@description 移除监听：持续录音事件*/
  export function offRecordingEvent(
    listener: (params: AudioRecordBufferBean) => void
  ): void

  /**
   *@description 监听加速度数据事件(精度为系统返回，双端可能不一致)
   *@error {10001: 'Sensor initialization fail'}*/
  export function onAccelerometerChange(
    listener: (params: {
      /** X 轴 */
      x: number
      /** Y 轴 */
      y: number
      /** Z 轴 */
      z: number
    }) => void
  ): void

  /**
   *@description 取消监听加速度数据事件，参数为空，则取消所有的事件监听*/
  export function offAccelerometerChange(
    listener: (params: {
      /** X 轴 */
      x: number
      /** Y 轴 */
      y: number
      /** Z 轴 */
      z: number
    }) => void
  ): void

  /**
   *@description 监听罗盘数据变化事件*/
  export function onCompassChange(
    listener: (params: {
      /** 面对的方向度数 */
      direction: number
      /**
       * 精度(iOS与Android平台差异原因，返回有差异)
       * Android：
       *    high 高精度
       *    medium    中等精度
       *    low    低精度
       *    no-contact    不可信，传感器失去连接
       *    unreliable    不可信，原因未知
       *    unknow ${value}    未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值
       * iOS：
       *    double类型精度
       */
      accuracy: string
    }) => void
  ): void

  /**
   *@description 取消监听罗盘数据变化事件，参数为空，则取消所有的事件监听*/
  export function offCompassChange(
    listener: (params: {
      /** 面对的方向度数 */
      direction: number
      /**
       * 精度(iOS与Android平台差异原因，返回有差异)
       * Android：
       *    high 高精度
       *    medium    中等精度
       *    low    低精度
       *    no-contact    不可信，传感器失去连接
       *    unreliable    不可信，原因未知
       *    unknow ${value}    未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值
       * iOS：
       *    double类型精度
       */
      accuracy: string
    }) => void
  ): void

  /**
   *@description 监听设备方向变化事件(数据为系统返回，双端精度可能不一致)*/
  export function onDeviceMotionChange(
    listener: (params: {
      /** 当 手机坐标 X/Y 和 地球 X/Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为 [0, 2*PI)。逆时针转动为正。 */
      alpha: number
      /** 当手机坐标 Y/Z 和地球 Y/Z 重合时，绕着 X 轴转动的夹角为 beta。范围值为 [-1*PI, PI) 。顶部朝着地球表面转动为正。也有可能朝着用户为正。 */
      beta: number
      /** 当手机 X/Z 和地球 X/Z 重合时，绕着 Y 轴转动的夹角为 gamma。范围值为 [-1*PI/2, PI/2)。右边朝着地球表面转动为正。 */
      gamma: number
    }) => void
  ): void

  /**
   *@description 取消监听设备方向变化事件，参数为空，则取消所有的事件监听。*/
  export function offDeviceMotionChange(
    listener: (params: {
      /** 当 手机坐标 X/Y 和 地球 X/Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为 [0, 2*PI)。逆时针转动为正。 */
      alpha: number
      /** 当手机坐标 Y/Z 和地球 Y/Z 重合时，绕着 X 轴转动的夹角为 beta。范围值为 [-1*PI, PI) 。顶部朝着地球表面转动为正。也有可能朝着用户为正。 */
      beta: number
      /** 当手机 X/Z 和地球 X/Z 重合时，绕着 Y 轴转动的夹角为 gamma。范围值为 [-1*PI/2, PI/2)。右边朝着地球表面转动为正。 */
      gamma: number
    }) => void
  ): void

  /**
   *@description 监听陀螺仪数据变化事件(数据为系统返回，双端精度可能不一致)*/
  export function onGyroscopeChange(
    listener: (params: {
      /** X 轴 */
      x: number
      /** Y 轴 */
      y: number
      /** Z 轴 */
      z: number
    }) => void
  ): void

  /**
   *@description 取消监听陀螺仪数据变化事件。*/
  export function offGyroscopeChange(
    listener: (params: {
      /** X 轴 */
      x: number
      /** Y 轴 */
      y: number
      /** Z 轴 */
      z: number
    }) => void
  ): void

  /**
   *@description 监听内存不足告警事件。
   *当 iOS/Android 向小程序进程发出内存警告时，触发该事件。触发该事件不意味小程序被杀，大部分情况下仅仅是告警，开发者可在收到通知后回收一些不必要资源避免进一步加剧内存紧张。*/
  export function onMemoryWarning(
    listener: (params: {
      /** 内存告警等级，只有 Android 才有，对应系统宏定义 */
      level: number
    }) => void
  ): void

  /**
   *@description 取消监听内存不足告警事件。*/
  export function offMemoryWarning(
    listener: (params: {
      /** 内存告警等级，只有 Android 才有，对应系统宏定义 */
      level: number
    }) => void
  ): void

  /**
   *@description 监听蓝牙适配器状态变化事件，需要申请蓝牙权限
   *@error {9002: 'Context is invalid'} | {9004: 'app no permission'} | {9005: 'can‘t find service'}*/
  export function onBluetoothAdapterStateChange(
    listener: (params: {
      /** 蓝牙适配器是否可用 */
      available: boolean
    }) => void
  ): void

  /**
   *@description 取消监听蓝牙适配器状态变化事件
   *@error {9002: 'Context is invalid'}*/
  export function offBluetoothAdapterStateChange(
    listener: (params: {
      /** 蓝牙适配器是否可用 */
      available: boolean
    }) => void
  ): void

  /**
   *@description 监听网络状态变化事件
   *注意：在Android上，该事件只通知网络状态的变化。如需获取最新的网络状态信息，请重新调用getNetworkType接口。
   *注意：在Android上，网络状态发生改变时，系统并不一定立马变更网络状态信息，存在一定的延迟。因此触发该事件时，业务上可能需要延迟调用getNetworkType接口，以便获取最新的信息。
   *@error {9002: 'Context is invalid'}*/
  export function onNetworkStatusChange(
    listener: (params: {
      /** 当前是否有网络连接 */
      isConnected: boolean
      /** 网络类型 */
      networkType: string
    }) => void
  ): void

  /**
   *@description 取消监听网络状态变化事件
   *@error {9002: 'Context is invalid'}*/
  export function offNetworkStatusChange(
    listener: (params: {
      /** 当前是否有网络连接 */
      isConnected: boolean
      /** 网络类型 */
      networkType: string
    }) => void
  ): void

  export enum WidgetVersionType {
    /** 线上版本 */
    release = "release",

    /** 预发版本 */
    preview = "preview",
  }

  export enum WidgetPosition {
    /** 居底展示 */
    bottom = "bottom",

    /** 居顶展示 */
    top = "top",

    /** 居中展示 */
    center = "center",
  }

  export type Profile = {
    /** 第一个 HTTP 重定向发生时的时间。有跳转且是同域名内的重定向才算，否则值为 0 */
    redirectStart: number
    /** 最后一个 HTTP 重定向完成时的时间。有跳转且是同域名内部的重定向才算，否则值为 0 */
    redirectEnd: number
    /** 组件准备好使用 HTTP 请求抓取资源的时间，这发生在检查本地缓存之前 */
    fetchStart: number
    /** DNS 域名查询开始的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等 */
    domainLookupStart: number
    /** DNS 域名查询完成的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等 */
    domainLookupEnd: number
    /** HTTP（TCP） 开始建立连接的时间，如果是持久连接，则与 fetchStart 值相等。注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接开始的时间 */
    connectStart: number
    /** HTTP（TCP） 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等。注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接完成的时间。注意这里握手结束，包括安全连接建立完成、SOCKS 授权通过 */
    connectEnd: number
    /** SSL建立连接的时间,如果不是安全连接,则值为 0 */
    SSLconnectionStart: number
    /** SSL建立完成的时间,如果不是安全连接,则值为 0 */
    SSLconnectionEnd: number
    /** HTTP请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存。连接错误重连时，这里显示的也是新建立连接的时间 */
    requestStart: number
    /** HTTP请求读取真实文档结束的时间 */
    requestEnd: number
    /** HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存 */
    responseStart: number
    /** HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存 */
    responseEnd: number
    /** 当次请求连接过程中实时 rtt */
    rtt: number
    /** 评估的网络状态 slow 2g/2g/3g/4g */
    estimate_nettype: string
    /** 协议层根据多个请求评估当前网络的 rtt（仅供参考） */
    httpRttEstimate: number
    /** 传输层根据多个请求评估的当前网络的 rtt（仅供参考） */
    transportRttEstimate: number
    /** 评估当前网络下载的kbps */
    downstreamThroughputKbpsEstimate: number
    /** 当前网络的实际下载kbps */
    throughputKbps: number
    /** 当前请求的IP */
    peerIP: string
    /** 当前请求的端口 */
    port: number
    /** 是否复用连接 */
    socketReused: boolean
    /** 发送的字节数 */
    sendBytesCount: number
    /** 收到字节数 */
    receivedBytedCount: number
  }

  export type FileReadFileReqBean = {
    /** 要写入的文件路径 (本地路径) */
    filePath: string
    /**
     * 指定读取文件的字符编码。
     * 支持 utf8/ascii/base64。如果不传 encoding，默认utf8
     */
    encoding?: string
    /** 从文件指定位置开始读，如果不指定，则从文件头开始读。读取的范围应该是左闭右开区间 [position, position+length)。有效范围：[0, fileLength - 1]。单位：byte */
    position?: number
    /** 指定文件的长度，如果不指定，则读到文件末尾。有效范围：[1, fileLength]。单位：byte */
    length?: number
  }

  export type SaveFileSyncParams = {
    /** taskId */
    fileId: string
    /** 需要存储的文件的临时路径 */
    tempFilePath: string
    /** 要存储的文件的目标路径 */
    filePath: string
  }

  export type FileStats = {
    /** 文件的类型和存取的权限 */
    mode: string
    /** 文件大小，单位：B */
    size: number
    /** 文件最近一次被存取或被执行的时间，UNIX 时间戳 */
    lastAccessedTime: number
    /** 文件最后一次被修改的时间，UNIX 时间戳 */
    lastModifiedTime: number
    /** 当前文件是否一个目录 */
    isDirectory: boolean
    /** 当前文件是否一个普通文件 */
    isFile: boolean
  }

  export type FileStatsParams = {
    /** taskId */
    fileId: string
    /** 文件/目录路径 (本地路径) */
    path: string
    /**
     * 是否递归获取目录下的每个文件的 Stats 信息
     * 默认值：false
     */
    recursive?: boolean
  }

  export type MakeDirParams = {
    /** taskId */
    fileId: string
    /** 创建的目录路径 (本地路径) */
    dirPath: string
    /**
     * 是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。
     * 如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，
     * 以此类推直至创建 a/b/c 目录下的 d 目录。
     * 默认值：false
     */
    recursive?: boolean
  }

  export type RemoveDirParams = {
    /** taskId */
    fileId: string
    /** 要删除的目录路径 (本地路径) */
    dirPath: string
    /**
     * 是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。
     * 默认值：false
     */
    recursive?: boolean
  }

  export type WriteFileParams = {
    /** taskId */
    fileId: string
    /** 要写入的文件路径 (本地路径) */
    filePath: string
    /** 要写入的文本数据, 根据encoding编码 */
    data: string
    /** 指定写入文件的字符编码,目前支持【utf8、ascii、base64】, 默认utf8 */
    encoding?: string
  }

  export enum HTTPMethod {
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

  export enum AudioSampleRate {
    /** 8000 采样率 */
    RATE_8000 = 8000,

    /** 11025 采样率 */
    RATE_11025 = 11025,

    /** 12000 采样率 */
    RATE_12000 = 12000,

    /** 16000 采样率 */
    RATE_16000 = 16000,

    /** 22050 采样率 */
    RATE_22050 = 22050,

    /** 24000 采样率 */
    RATE_24000 = 24000,

    /** 32000 采样率 */
    RATE_32000 = 32000,

    /** 44100 采样率 */
    RATE_44100 = 44100,

    /** 48000 采样率 */
    RATE_48000 = 48000,
  }

  export enum AudioNumChannel {
    /** 单通道 */
    SINGLE = 1,

    /** 双通道 */
    DOUBLE = 2,
  }

  export enum AudioFormat {
    /** mp3 格式（iOS暂不支持） */
    MP3 = "mp3",

    /** aac 格式 */
    AAC = "aac",

    /** wav 格式 */
    WAV = "wav",

    /** PCM 格式 */
    PCM = "PCM",
  }

  export enum AccelerometerInterval {
    /** 适用于更新游戏的回调频率，在 20ms/次 左右 */
    game = "game",

    /** 适用于更新 UI 的回调频率，在 60ms/次 左右 */
    ui = "ui",

    /** 普通的回调频率，在 200ms/次 左右 */
    normal = "normal",
  }

  export enum ScopeBean {
    /** 蓝牙权限 */
    BLUETOOTH = "scope.bluetooth",

    /** 麦克风权限 */
    RECORD = "scope.record",

    /** 写入权限 */
    WRITEPHOTOSALBUM = "scope.writePhotosAlbum",

    /** 摄像头权限 */
    CAMERA = "scope.camera",

    /** 低精度定位权限 */
    USERLOCATION = "scope.userLocation",

    /** 高精度定位权限 */
    USERPRECISELOCATION = "scope.userPreciseLocation",

    /**
     * 后台定位权限
     * 注意: iOS需要将TARGETS->Capabilities->Background Modes->Location updates打开
     */
    USERLOCATIONBACKGROUND = "scope.userLocationBackground",

    /** 用户信息 */
    USERINFO = "scope.userInfo",
  }

  export type SchemaBean = {
    /** 使用 ${API}.${method}.${param}.${option}方式来调用 */
    schema: string
  }

  export enum DeviceMotionInterval {
    /** 适用于更新游戏的回调频率，在 20ms/次 左右 */
    game = "game",

    /** 适用于更新 UI 的回调频率，在 60ms/次 左右 */
    ui = "ui",

    /** 普通的回调频率，在 200ms/次 左右 */
    normal = "normal",
  }

  export enum GyroscopeInterval {
    /** 适用于更新游戏的回调频率，在 20ms/次 左右 */
    game = "game",

    /** 适用于更新 UI 的回调频率，在 60ms/次 左右 */
    ui = "ui",

    /** 普通的回调频率，在 200ms/次 左右 */
    normal = "normal",
  }

  export type Object = {}

  export type CropImageItemBean = {
    /** 裁剪图片的地址 */
    filePath?: string
    /** 左上角坐标X */
    topLeftX: number
    /** 左上角坐标Y */
    topLeftY: number
    /** 右下角坐标X */
    bottomRightX: number
    /** 右下角坐标Y */
    bottomRightY: number
  }

  export type TempFileCB = {
    /** 本地临时文件路径 (本地路径) */
    path: string
    /** 本地临时文件大小，单位 B */
    size?: number
  }

  export type TempMediaFileCB = {
    /** 本地临时文件路径 (本地路径) */
    tempFilePath: string
    /** 本地临时文件大小，单位 B */
    size: number
    /** 视频的时间长度 */
    duration: number
    /** 视频的高度 */
    height: number
    /** 视频的宽度 */
    width: number
    /** 视频缩略图临时文件路径 */
    thumbTempFilePath: string
    /**
     * 文件类型
     * 'image' 	图片
     * 'video' 	视频
     */
    fileType: string
    /** 相册原始视频地址 */
    originalVideoPath: string
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
    /** 暗黑模式 */
    dark = "dark",

    /** 亮色模式 */
    light = "light",
  }

  export enum Orientation {
    /** 竖屏 */
    portrait = "portrait",

    /** 横屏 */
    landscape = "landscape",
  }

  export type KeyboardBean = {
    /** 键盘标题&&输入页标题 */
    title?: string
    /** 输入页输入框提示语 */
    placeholder?: string
    /** 输入页输入描述 */
    desc?: string
    /** 输入页操作按钮文案 */
    actionText?: string
  }

  export type StorageDataBean = {
    /** 本地缓存中指定的 key */
    key: string
    /** key对应的内容 */
    data: string
  }

  export type StorageKeyBean = {
    /** 本地缓存中指定的 key */
    key: string
  }

  export type UploadStartEvent = {
    /** 任务id */
    taskId: string
    /** sid */
    sid: string
    /** 文件前缀 */
    prefix: string
    /** 文件个数 */
    fileCount: number
    /** 扩展字段 */
    extData?: Object
  }

  export type UploadProgressEvent = {
    /** 任务id */
    taskId: string
    /** sid */
    sid: string
    /** 文件前缀 */
    prefix: string
    /**
     * 上传的文件名称，非本地文件名
     * 0001-1
     * 0001-2
     */
    name: string
    /** 文件路径 */
    filePath: string
    /** 文件上传Url， 如果有分片，该属性为空 */
    cloudUrl?: string
    /** 错误码，0 成功，非0失败 */
    code: string
    /** 错误信息 */
    error?: string
    /** 分片信息, 如果没分片，该属性为空 */
    frags?: FragInfoBean[]
    /** 扩展字段 */
    extData?: Object
  }

  export type UploadCompleteEvent = {
    /** 任务id */
    taskId: string
    /** sid */
    sid: string
    /** 文件前缀 */
    prefix: string
    /** 上传成功的文件 */
    uploaded?: string[]
    /** 上传失败的文件 */
    failed?: string[]
    /** 扩展字段 */
    extData?: Object
  }

  export type UploadFragProgressEvent = {
    /** 任务id */
    taskId: string
    /** sid */
    sid: string
    /** 文件前缀 */
    prefix: string
    /** 完整文件的路径 */
    filePath: string
    /** 文件大小 */
    fileSize?: number
    /**
     * 分片名称,
     * 上传的分片名称，非本地分片
     * 0001-4-frag-1
     * 0001-4-frag-2
     * 0001-4-frag-3
     * 0001-4-frag-4
     */
    fragName: string
    /** 分片路径 */
    fragPath: string
    /** 分片Url */
    fragCloudUrl?: string
    /** 错误码，0 成功，非0失败 */
    code: string
    /** 错误信息 */
    error?: string
    /** 分片序号 */
    fragIndex?: number
    /** 总分片数 */
    fragCount?: number
    /** 分片大小 */
    fragSize?: number
    /** 分片在文件中的偏移量 */
    fragPos?: number
    /** 扩展字段 */
    extData?: Object
  }

  export type BeanRes = {
    /** 键盘高度 */
    height: number
  }

  export type VolumeResponse = {
    /** 音量，阈值【0 - 1】 */
    value: number
    /**
     * 音量类型（仅Android生效）
     * 0：语音电话的声音
     * 1：手机系统声音
     * 2：响铃，通知，系统默认音等
     * 3：手机音乐的声音
     * 4：手机闹铃的声音
     * 5：手机通知的声音
     * 6：蓝牙音量
     */
    volumeMode?: number
  }

  export type WifiListResponse = {
    /** Wi-Fi列表 */
    wifiList: WifiInfo[]
  }

  export type AudioRecordBufferBean = {
    /** 数据流 */
    buffer: number[]
  }

  export type InnerAudioContextBean = {
    /** InnerAudioContext 对象 ContextId */
    contextId: string
  }

  export type AudioFileParams = {
    /** 音频文件路径 */
    path: string
  }

  export type AudioFileResponse = {
    /** 音频时长, 单位 ms */
    duration: number
  }

  export type InnerAudioBean = {
    /**
     * InnerAudioContext 对象 contextId
     * 需要传递createInnerAudioContext方法创建的InnerAudioContext对象Id才能找到播放实例
     */
    contextId: string
    /** src 音频资源的地址 */
    src: string
    /** startTime 开始播放的位置, 单位 s。精确到小数点后 3 位，即支持 ms 级别精确度 */
    startTime?: number
    /** autoplay 是否自动开始播放 */
    autoplay?: boolean
    /** 是否循环播放，默认为 false */
    loop?: boolean
    /** 音量。范围 0~1。默认为 1 */
    volume?: number
    /** 播放速度。范围 0.5-2.0，默认为 1。（Android 需要 6 及以上版本） */
    playbackRate?: number
  }

  export type InnerAudioSeekBean = {
    /** InnerAudioContext 对象 ContextId */
    contextId: string
    /** 跳转的时间，单位 s。精确到小数点后 3 位，即支持 ms 级别精确度 */
    position?: number
  }

  export type AuthorizeBean = {
    /** scope 权限名称 */
    scope?: ScopeBean
  }

  export type SettingBean = {
    /** 用户授权结果 */
    authSetting: any
  }

  export type AuthorizePolicyReqBean = {
    /** 当前授权的协议类型，不同协议可以独立授权.例如：ai_algorithm 表示AI算法协议 */
    type: string
    /** 协议的版本 */
    version: string
    /** 协议授权操作 /1 同意 2 不同意 */
    status: number
  }

  export type AuthorizePolicyRespBean = {
    /** 是否同意 */
    agreed: boolean
  }

  export type AuthorizePolicyStatusReqBean = {
    /** 当前授权的协议类型，不同协议可以独立授权. 例如：ai_algorithm 表示AI算法协议 */
    type: string
  }

  export type AuthorizePolicyStatusRespBean = {
    /** 标题 */
    title: string
    /** 协议名称 */
    agreementName: string
    /** 协议描述 */
    agreementDesc: string
    /** 协议链接 */
    link: string
    /** 协议版本 */
    version: string
    /** 0 未签署（首次）1 未签署（更新）2 已签署 */
    sign: number
  }

  export type ToMiniProgramBean = {
    /** 要打开的小程序appId */
    appId?: string
    /** 要打开的智能体小程序的智能体Id */
    aiPtChannel?: string
    /**
     * 要打开的小程序智能体的版本。
     * preview：体验版
     * release：正式版
     */
    aiPtType?: string
    /** 打开的页面路径,如果为空则打开首页,path 中 ? 后面的部分会成为 query，在小程序的 `App.onLaunch`、`App.onShow` 和 `Page.onLoad` 的回调函数 */
    path?: string
    /** 打开小程序的转场方式,分为right|bottom,指代水平和竖直方向 */
    position?: string
    /** 传递给目标小程序的数据,目标小程序可在 `App.onLaunch`，`App.onShow` 中获取到这份数据 */
    extraData?: any
    /**
     * 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版
     * trial：体验版
     * release：正式版
     */
    envVersion?: string
    /** 小程序链接，当传递该参数后，可以不传 appId 和 path */
    shortLink?: string
  }

  export type MiniWidgetDeploysBean = {
    /** widget弹窗id */
    dialogId: string
    /** 要打开的小部件appid */
    appId: string
    /** 对应的小部件页面相对url, 如果为空则打开首页,path 中 ? 后面的部分会成为 query */
    pagePath?: string
    /** 面板类型设备id */
    deviceId?: string
    /** 面板群组类型群组id */
    groupId?: string
    /** 小部件样式,默认middle */
    style?: string
    /** 版本类型,默认release */
    versionType?: WidgetVersionType
    /** 版本号 */
    version?: string
    /** 展示位置,默认bottom */
    position?: WidgetPosition
    /** 点击空白处是否关闭 */
    autoDismiss?: boolean
    /**
     * 是否优先展示默认缓存
     * 对应属性在小程序容器3.1.0生效
     */
    autoCache?: boolean
    /** 是否支持深色模式 */
    supportDark?: boolean
  }

  export type MiniWidgetDialogBean = {}

  export type SuccessResult = {
    /** 当前版本是否可用 */
    result: boolean
  }

  export type VideoThumbnailsBean = {
    /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 (本地路径) */
    filePath: string
    /** 开始时间，毫秒 */
    startTime: number
    /** 结束时间，毫秒 */
    endTime: number
    /** 缩略图个数 */
    thumbnailCount: number
    /** 缩略图宽高，期望值 */
    thumbnailWidth: number
    /** 缩略图高，期望值 */
    thumbnailHeight: number
  }

  export type VideoThumbnailsResult = {
    /** 缩略图路径 */
    thumbnailsPath?: string[]
  }

  export type ClearVideoThumbnailsBean = {
    /** 对应视频文件名称 */
    videoName: string
  }

  export type VideoClipBean = {
    /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 (本地路径) */
    filePath: string
    /** 开始时间，毫秒 */
    startTime: number
    /** 结束时间，毫秒 */
    endTime: number
    /**
     * 目标压缩的分辨率
     * 1 - 480*854  码率：1572*1000
     * 2 - 540*960   码率：2128*1000
     * 3 - 720*1280  码率：3145*1000
     * 4 - 1080*1920  码率：3500*1000
     */
    level: number
  }

  export type VideoClipResult = {
    /** 裁剪视频路径 */
    videoClipPath?: string
  }

  export type DeviceMotionBean = {
    /** 监听加速度数据回调函数的执行频率 */
    interval?: DeviceMotionInterval
  }

  export type DownLoadBean = {
    /** 网络请求id */
    requestId: string
    /** 下载资源的 url */
    url: string
    /** HTTP 请求的 Header，Header 中不能设置 Referer */
    header?: any
    /** 超时时间，单位为毫秒 */
    timeout?: number
    /** 指定文件下载后存储的路径 (本地路径) */
    filePath?: string
  }

  export type DownLoadResult = {
    /** 临时文件路径 (本地路径)。没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件 */
    tempFilePath: string
    /** 用户文件路径 (本地路径)。传入 filePath 时会返回，跟传入的 filePath 一致 */
    filePath: string
    /** 开发者服务器返回的 HTTP 状态码 */
    statusCode: number
    /** 网络请求过程中一些调试信息 */
    profile: Profile
  }

  export type RequestBean = {
    /** 网络请求id */
    requestId: string
  }

  export type AccessFileParams = {
    /** 要判断是否存在的文件/目录路径 (本地路径) */
    path: string
  }

  export type ReadFileBean = {
    /** 文件内容 */
    data: string
  }

  export type SaveFileSyncCallback = {
    /** 【待废弃， 不建议使用】存储后的文件路径 */
    savedFilePath: string
  }

  export type TempDirectoryResponse = {
    /** 【待废弃， 不建议使用】临时文件夹路径 */
    tempDirectory: string
  }

  export type FileStatsResponse = {
    /** 文件列表 */
    fileStatsList: FileStats[]
  }

  export type RemoveFileParams = {
    /** taskId */
    fileId: string
    /** 需要删除的文件路径 (本地路径) */
    filePath: string
  }

  export type LogFileParams = {
    /** 标识信息，传入devId或groupId */
    resId: string
    /** 要写入的文本数据, 使用utf8编码 */
    data: string
    /** 内容添加形式，true为追加在文件尾部，false为覆写文件 */
    append?: boolean
  }

  export type FileInfoParams = {
    /** 要读取的文件路径 */
    filePath: string
    /** 计算文件摘要的算法, md5/sha1/sha256 默认MD5 */
    digestAlgorithm: string
  }

  export type FileInfoRes = {
    /** 文件大小,字节 */
    size: number
    /** 按照传入的 digestAlgorithm 计算得出的的文件摘要 */
    digest: string
  }

  export type GyroscopeBean = {
    /** 监听陀螺仪数据回调函数的执行频率 */
    interval?: GyroscopeInterval
  }

  export type FragInfoBean = {
    /**
     * 分片名称,
     * 上传的分片名称，非本地分片
     * 0001-4-frag-1
     * 0001-4-frag-2
     * 0001-4-frag-3
     * 0001-4-frag-4
     */
    fragName: string
    /** 文件上传Url */
    fragCloudUrl?: string
    /** 分片本地路径 */
    fragPath: string
    /** 错误码，0 成功，非0失败 */
    code: string
    /** 错误信息 */
    error?: string
  }

  export type InitBean = {
    /** 设备id */
    deviceId: string
  }

  export type UploadFileBean = {
    /** 设备id */
    deviceId: string
    /** sid */
    sid: string
    /** 上传文件路径列表 */
    fileList?: string[]
    /** 扩展字段 */
    extData?: Object
  }

  export type UploadFileCb = {
    /** 任务id */
    taskId: string
  }

  export type CancelUploadBean = {
    /** 任务id */
    taskId: string
  }

  export type CompressImageBean = {
    /** 压缩图片路径列表 */
    fileList?: string[]
    /** 压缩图片的目标宽 */
    dstWidth: number
    /** 压缩图片的目标高 */
    dstHeight: number
  }

  export type CompressImageCb = {
    /** 压缩完成的图片路径列表 */
    fileList?: string[]
  }

  export type CropImageBean = {
    /** 裁剪图片的地址 */
    cropFileList?: CropImageItemBean[]
  }

  export type CropImageCb = {
    /** 裁剪完成的图片路径列表 */
    fileList?: string[]
  }

  export type ChooseImageBean = {
    /**
     * 最多可以选择的图片张数
     * 注意：Android13以上的版本，使用的是系统图片选择器，该字段不生效
     */
    count?: number
    /** sizeType ['original', 'compressed'] */
    sizeType?: string[]
    /** 选择图片的来源 ['album', 'camera'] */
    sourceType?: string[]
    /** 是否取消选择图片后关闭界面的动画效果 */
    disableDismissAnimationAfterSelect?: boolean
  }

  export type ChooseImageCB = {
    /** 图片的本地临时文件路径列表 (本地路径) */
    tempFilePaths: string[]
    /** sizeType ['original', 'compressed'] */
    tempFiles?: TempFileCB[]
  }

  export type ChooseMediaBean = {
    /**
     * 最多可以选择的文件数。
     * 注意：Android13以上的版本，使用的是系统图片选择器，该字段不生效
     */
    count?: number
    /**
     * 选择类型, 默认图片
     * 'image' 只能拍摄图片或从相册选择图片
     * 'video' 只能拍摄视频或从相册选择视频
     */
    mediaType?: string
    /**
     * 图片和视频选择的来源, 默认['album', 'camera']
     * 'album' 从相册选择
     * 'camera' 	使用相机拍摄
     */
    sourceType?: string[]
    /**
     * 拍摄视频最长拍摄时间，单位秒。默认10s
     * 时间范围为 3s 至 60s 之间。不限制相册。
     */
    maxDuration?: number
    /**
     * 该参数只对iOS有效
     * 是否拷贝视频：
     * 默认true，拷贝视频，返回视频拷贝地址，返回视频封面地址
     * false，不拷贝视频，返回视频相册中的地址，返回视频封面图地址
     */
    isFetchVideoFile?: boolean
    /**
     * 该参数只对iOS有效
     * 相册选择的视频是否需要裁剪
     * 默认为false, 不裁剪视频
     */
    isClipVideo?: boolean
    /**
     * 视频最长剪辑时间，单位秒。默认60s
     * 需要设置isClipVideo为true才生效
     * 时间范围为 60s 至 600 之间。 选择视频的时长小于15s不裁剪
     */
    maxClipDuration?: number
    /**
     * 该参数只对iOS有效
     * 选择导出的文件名称，和相册中文件的名称一致
     * 默认为false, 使用每次文件名称唯一
     */
    isGetAlbumFileName?: boolean
  }

  export type ChooseMediaCB = {
    /**
     * 文件类型
     * 'image' 图片
     * 'video' 视频
     */
    type: string
    /** 本地临时文件列表 */
    tempFiles?: TempMediaFileCB[]
  }

  export type ChooseCropImageBean = {
    /** 选择图片的来源 ['album', 'camera']，默认都支持 */
    sourceType?: string[]
  }

  export type ChooseCropImageCB = {
    /** 文件路径 */
    path: string
  }

  export type PreviewImageBean = {
    /** 需要预览的图片链接列表 */
    urls: string[]
    /** 当前显示图片的链接 */
    current: number
  }

  export type GetImageInfoParams = {
    /** 图片的路径，支持网络路径、本地路径 */
    src: string
  }

  export type ImageInfoCB = {
    /** 图片原始宽度，单位px。不考虑旋转。 */
    width: number
    /** 图片原始高度，单位px。不考虑旋转。 */
    height: number
    /**
     * 拍照时设备方向
     * 合法值	说明
     * up	默认方向（手机横持拍照），对应 Exif 中的 1。或无 orientation 信息。
     * up-mirrored	同 up，但镜像翻转，对应 Exif 中的 2
     * down	旋转180度，对应 Exif 中的 3
     * down-mirrored	同 down，但镜像翻转，对应 Exif 中的 4
     * left-mirrored	同 left，但镜像翻转，对应 Exif 中的 5
     * right	顺时针旋转90度，对应 Exif 中的 6
     * right-mirrored	同 right，但镜像翻转，对应 Exif 中的 7
     * left	逆时针旋转90度，对应 Exif 中的 8
     */
    orientation: string
    /**
     * 图片格式。
     * 合法值	说明
     * unknown	未知格式
     * jpeg	jpeg压缩格式
     * png	png压缩格式
     * gif	gif压缩格式
     * tiff	tiff压缩格式
     */
    type: string
  }

  export type GetVideoInfoParams = {
    /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 */
    src: string
  }

  export type VideoInfoCB = {
    /** 图片原始宽度，单位px。不考虑旋转。 */
    width: number
    /** 图片原始高度，单位px。不考虑旋转。 */
    height: number
    /**
     * 画面方向
     * 合法值	说明
     * up	默认方向（手机横持拍照），对应 Exif 中的 1。或无 orientation 信息。
     * up-mirrored	同 up，但镜像翻转，对应 Exif 中的 2
     * down	旋转180度，对应 Exif 中的 3
     * down-mirrored	同 down，但镜像翻转，对应 Exif 中的 4
     * left-mirrored	同 left，但镜像翻转，对应 Exif 中的 5
     * right	顺时针旋转90度，对应 Exif 中的 6
     * right-mirrored	同 right，但镜像翻转，对应 Exif 中的 7
     * left	逆时针旋转90度，对应 Exif 中的 8
     */
    orientation: string
    /** 视频格式 */
    type: string
    /** 视频时长 */
    duration: number
    /** 视频大小，单位 kB */
    size: number
    /** 视频帧率 */
    fps: number
    /** 视频码率，单位 kbps */
    bitrate: number
  }

  export type SaveVideoParams = {
    /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 (本地路径) */
    filePath: string
    /**
     * 是否修改视频的创建日期
     * 默认false，不修改视频的创建日期。ture，修改视频的创建日期为当前保存时间
     */
    modifyCreationDate?: boolean
  }

  export type VideoSaveAlbumResponse = {
    /** 相册视频标识符 */
    localIdentifier: string
  }

  export type SaveImageParams = {
    /** 图片文件路径，可以是临时文件路径也可以是永久文件路径 (本地路径) */
    filePath: string
    /**
     * 是否修改视频的创建日期
     * 默认false，不修改视频的创建日期。ture，修改视频的创建日期为当前保存时间
     */
    modifyCreationDate?: boolean
  }

  export type CropImageBean_Ar2JYV = {
    /** 图片路径 */
    path: string
    /** 裁剪的宽度 */
    width: number
    /** 裁剪的高度 */
    height: number
    /** 裁剪后的图片类型, 0:jpg 1:png */
    type: number
  }

  export type CropImageResult = {
    /** 裁剪后图片路径 */
    cropPath: string
  }

  export type ImageThumbnailBean = {
    /** 资源原始地址 */
    originPath: string
    /** 缩略图宽度 px */
    thumbWidth: number
    /** 缩略图高度 px */
    thumbHeight: number
  }

  export type ImageThumbnailResult = {
    /** 缩略图地址 */
    thumbnailPath: string
  }

  export type ToastBean = {
    /** 提示的内容 */
    title: string
    /** 图标 'success' / 'error' / 'loading' / 'none' */
    icon?: string
    /** 自定义图标的本地路径，image 的优先级高于 icon */
    image?: string
    /** 提示的延迟时间（仅iOS生效） */
    duration?: number
    /** 是否显示透明蒙层，防止触摸穿透 */
    mask?: boolean
  }

  export type ModalBean = {
    /** 提示的标题 */
    title: string
    /** 提示的内容 */
    content?: string
    /** 是否显示取消按钮 */
    showCancel?: boolean
    /** 取消按钮的文字，最多 4 个字符 */
    cancelText?: string
    /** 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
    cancelColor: string
    /** 确认按钮的文字，最多 4 个字符 */
    confirmText?: string
    /** 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
    confirmColor: string
    /** 是否全局弹窗，若为全局弹窗，弹在最顶上 */
    isShowGlobal?: boolean
  }

  export type ModalCallback = {
    /** 为 true 时，表示用户点击了确定按钮 */
    confirm: boolean
    /** 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭） */
    cancel: boolean
  }

  export type LoadingBean = {
    /** 提示的内容 */
    title: string
    /** 是否显示透明蒙层，防止触摸穿透 */
    mask?: boolean
  }

  export type ActionSheet = {
    /** 警示文案 */
    alertText?: string
    /** 按钮的文字数组，数组长度最大为 6 */
    itemList: string[]
    /** 按钮的文字颜色 */
    itemColor?: string
    /** 按钮的文字颜色 */
    itemColors?: string[]
  }

  export type ActionSheetCallback = {
    /** 用户点击的按钮序号，从上到下的顺序，从0开始 */
    tapIndex: number
  }

  export type HTTPRequest = {
    /** 开发者服务器接口地址 */
    url: string
    /** 网络请求 id */
    taskId: string
    /** 请求的参数 */
    data?: string
    /** 设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json */
    header?: any
    /** 超时时间，单位为毫秒 */
    timeout?: number
    /** HTTP 请求方法 */
    method?: HTTPMethod
    /** 请求体里的数据类型（仅Android，且请求方式不为GET时生效） */
    dataType?: string
    /** 返回的数据类型 */
    responseType?: string
    /** enableHttp2 */
    enableHttp2?: boolean
    /** enableQuic */
    enableQuic?: boolean
    /** enableCache */
    enableCache?: boolean
  }

  export type SuccessResult_HSEMbm = {
    /** 开发者服务器返回的数据 */
    data: string
    /** 开发者服务器返回的 HTTP 状态码 */
    statusCode: number
    /** 开发者服务器返回的 HTTP Response Header */
    header: any
    /** 开发者服务器返回的 cookies，格式为字符串数组 */
    cookies: string[]
    /** 网络请求过程中一些调试信息 */
    profile: Profile
    /** 网络请求id，用户取消、监听等操作 */
    taskId: string
  }

  export type RequestContext = {
    /** 网络请求id */
    taskId: string
  }

  export type PhoneCallBean = {
    /** 需要拨打的电话号码 */
    phoneNumber: string
  }

  export type ClipboradSetReqBean = {
    /**
     * 是否敏感信息
     * true 是; false 否; 默认非敏感信息
     * 如果是敏感信息, 则可组织敏感内容出现在Android 13及更高版本中的复制视觉确认中显示的任何内容预览中
     * 需要注意的是, 该属性仅针对Android 13及更高版本的机型上适用
     */
    isSensitive?: boolean
    /** 剪贴板的内容 */
    data: string
  }

  export type ClipboradDataBean = {
    /** 剪贴板的内容 */
    data: string
  }

  export type WifiInfo = {
    /** wifi的SSID */
    SSID: string
    /** wifi的BSSID */
    BSSID: string
    /** Wi-Fi 信号强度, 安卓取值 0 ～ 100 ，iOS 取值 0 ～ 1 ，值越大强度越大 */
    signalStrength: number
    /**
     * Wi-Fi是否安全
     * Android：Android系统12开始支持。
     */
    secure: boolean
    /** Wi-Fi 频段单位 MHz */
    frequency: number
  }

  export type UpdateVolumeParams = {
    /** 音量，阈值【0 - 1】 */
    value: number
    /**
     * 音量类型（仅Android生效）
     * 0：语音电话的声音
     * 1：手机系统声音
     * 2：响铃，通知，系统默认音等
     * 3：手机音乐的声音
     * 4：手机闹铃的声音
     * 5：手机通知的声音
     * 6：蓝牙音量
     */
    volumeMode?: number[]
  }

  export type CurrentVolumeResponse = {
    /** 音量，阈值【0 - 1】 */
    value: number
  }

  export type CurrentVolumeParams = {
    /**
     * 音量类型（仅Android生效）
     * 0：语音电话的声音
     * 1：手机系统声音
     * 2：响铃，通知，系统默认音等
     * 3：手机音乐的声音
     * 4：手机闹铃的声音
     * 5：手机通知的声音
     * 6：蓝牙音量
     */
    volumeMode?: number
  }

  export type SystemSetting = {
    /** 蓝牙的系统开关，默认false */
    bluetoothEnabled?: boolean
    /** 地理位置的系统开关，默认false */
    locationEnabled?: boolean
    /** Wi-Fi 的系统开关，默认false */
    wifiEnabled?: boolean
    /**
     * 设备方向, 默认竖屏
     * 竖屏 = "portrait"， 横屏 = "landscape"
     */
    deviceOrientation?: string
  }

  export type DeviceInfoResponse = {
    /** 应用二进制接口类型（仅 Android 支持） */
    abi: string
    /** 设备品牌 */
    brand: string
    /** 设备型号。新机型刚推出一段时间会显示unknown。 */
    model: string
    /** 操作系统及版本 */
    system: string
    /** 客户端平台 */
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
    /** 可使用窗口宽度 */
    useableWindowWidth: number
    /** 可使用窗口高度 */
    useableWindowHeight: number
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
    /** 设备等级(低:low-中:middle-高:high) */
    deviceLevel: string
    /** 手机系统是否支持创建快捷方式（仅Android使用） */
    isSupportPinShortcut?: boolean
    /**
     * 设备类型
     * phone：手机
     * pad：平板
     */
    deviceType?: string
  }

  export type GetConnectedWifiParams = {
    /**
     * 是否需要返回部分 Wi-Fi 信息
     * 安卓 thing.getConnectedWifi 若设置了 partialInfo:true ，将会返回只包含 SSID 属性的 WifiInfo 对象。
     * iOS thing.getConnectedWifi 若设置了 partialInfo:true ，将会返回只包含 SSID、BSSID 属性的 WifiInfo 对象。
     * 默认值：false
     */
    partialInfo?: boolean
  }

  export type AppAuthorizeSettingRes = {
    /** 允许使用相册的开关（仅 iOS 有效）authorized'/'denied'/'not determined */
    albumAuthorized: string
    /** 允许使用蓝牙的开关（仅 iOS 有效） authorized'/'denied'/'not determined */
    bluetoothAuthorized: string
    /** 允许使用摄像头的开关 authorized'/'denied'/'not determined */
    cameraAuthorized: string
    /** 允许使用定位的开关 authorized'/'denied'/'not determined */
    locationAuthorized: string
    /** 定位准确度。true 表示模糊定位，false 表示精确定位（仅 iOS 有效） */
    locationReducedAccuracy: boolean
    /** 允许使用麦克风的开关 'authorized'/'denied'/'not determined' */
    microphoneAuthorized: string
    /** 允许通知的开关 'authorized'/'denied'/'not determined' */
    notificationAuthorized: string
    /** 允许通知带有提醒的开关（仅 iOS 有效） 'authorized'/'denied'/'not determined' */
    notificationAlertAuthorized: string
    /** 允许通知带有标记的开关（仅 iOS 有效） 'authorized'/'denied'/'not determined' */
    notificationBadgeAuthorized: string
    /** 允许通知带有声音的开关（仅 iOS 有效） 'authorized'/'denied'/'not determined' */
    notificationSoundAuthorized: string
  }

  export type NetworkTypeCB = {
    /** 网络类型 */
    networkType: string
    /**
     * 信号强弱，单位 dbm
     * 注意: iOS不支持
     */
    signalStrength: number
  }

  export type ScreenBean = {
    /** 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮 */
    value: number
  }

  export type SetKeepScreenOnParam = {
    /** 是否保持屏幕常亮 */
    keepScreenOn: boolean
  }

  export type TUNIVibrateBean = {
    /** 震动强度类型，有效值为：heavy、medium、light */
    type: string
  }

  export type AudioStart = {
    /** 录音的时长，单位 ms，最大值 600000（10 分钟） */
    duration?: number
    /** 采样率 */
    sampleRate?: AudioSampleRate
    /** 录音通道数 */
    numberOfChannels?: AudioNumChannel
    /** 编码码率，有效值见下表格 */
    encodeBitRate?: number
    /** 音频格式 */
    format?: AudioFormat
    /** 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3、pcm 格式。 */
    frameSize: number
    /** 指定录音的音频输入源 */
    audioSource?: string
    /** 录音上下文 */
    contextId: string
  }

  export type AudioRecordResult = {
    /** 录音文件的临时路径 (本地路径) */
    tempFilePath: string
  }

  export type AudioRecordContext = {
    /** 对象id */
    contextId: string
  }

  export type AudioRecordingRequest = {
    /** 录音上下文 */
    contextId: string
    /** 间隔时间  ms */
    period: number
    /**
     * 由于历史原因，iOS默认32-bit PCM，Android默认16-bit PCM
     * true表示统一双端的默认值为16，false保持原有默认值
     * default true
     */
    pcm16IOS?: boolean
  }

  export type ScanCodeBean = {
    /** 是否只能从相机扫码，不允许从相册选择图片 */
    onlyFromCamera?: boolean
    /** 是否显示动作标题(仅Android生效) */
    isShowActionTitle?: boolean
    /** 是否显示闪关灯(仅Android生效) */
    isShowTorch?: boolean
    /** 是否显示输入设置代码 */
    isShowKeyboard?: boolean
    /** 输入设置文案修改 */
    keyboardBean?: KeyboardBean
    /** 自定义提示标语(仅Android生效) */
    customTips?: string
    /** 扫码类型 */
    scanType?: string[]
  }

  export type ScanCodeResult = {
    /** 所扫码的内容 */
    result: string
    /** 所扫码的类型 */
    scanType: string
    /** 所扫码的字符集 */
    charSet: string
    /** 当所扫的码为当前小程序二维码时，会返回此字段，内容为二维码携带的 path (不一定会有返回值) */
    path: string
    /** 原始数据，base64编码 */
    rawData: string
  }

  export type ScanLoginBean = {
    /** 扫码内容 */
    content: string
  }

  export type ScanLoginResult = {
    /** 扫码登录结果 0:确认登录成功 1:取消/返回 2:确认登录失败 */
    code: number
    /** 扫码登录失败错误描述 */
    msg: string
  }

  export type StorageCallback = {
    /** key对应的内容 */
    data?: string
  }

  export type UpLoadBean = {
    /** 网络请求id */
    requestId: string
    /** 开发者服务器地址 */
    url: string
    /** 要上传文件资源的路径 (本地路径) */
    filePath: string
    /** 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 */
    name: string
    /** HTTP 请求的 Header，Header 中不能设置 Referer */
    header?: any
    /** HTTP 请求中其他额外的 form data */
    formData?: any
    /** 超时时间，单位为毫秒 */
    timeout?: number
  }

  export type UpLoadResult = {
    /** 开发者服务器返回的数据 */
    data: string
    /** 开发者服务器返回的 HTTP 状态码 */
    statusCode: number
  }

  /**
   *@description 创建内部audio上下文InnerAudioContext对象*/
  interface InnerAudioContext {
    /**
     *@description 暂停
     *@error {6: 'The parameter format is incorrect'}*/
    pause(params: {
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
     *@description 恢复
     *@error {6: 'The parameter format is incorrect'}*/
    resume(params: {
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
     *@description 播放
     *@error {6: 'The parameter format is incorrect'} | {9002: 'Context is invalid'} | {10004: 'audio play error'}*/
    play(params: {
      /** src 音频资源的地址 */
      src: string
      /** startTime 开始播放的位置, 单位 s。精确到小数点后 3 位，即支持 ms 级别精确度 */
      startTime?: number
      /** autoplay 是否自动开始播放 */
      autoplay?: boolean
      /** 是否循环播放，默认为 false */
      loop?: boolean
      /** 音量。范围 0~1。默认为 1 */
      volume?: number
      /** 播放速度。范围 0.5-2.0，默认为 1。（Android 需要 6 及以上版本） */
      playbackRate?: number
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
     *@description 跳转到指定位置
     *@error {6: 'The parameter format is incorrect'} | {10005: 'audio seek error'}*/
    seek(params: {
      /** 跳转的时间，单位 s。精确到小数点后 3 位，即支持 ms 级别精确度 */
      position?: number
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
     *@description 停止。停止后的音频再播放会从头开始播放
     *@error {6: 'The parameter format is incorrect'} | {10006: 'audio stop error'}*/
    stop(params: {
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
     *@description 销毁当前实例
     *@deprecated 方法已停止维护，请谨慎使用，推荐使用destroyPlayer代替。
     *@error {6: 'The parameter format is incorrect'}*/
    destroy(params: {
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
     *@description 销毁当前实例
     *@error {6: 'The parameter format is incorrect'}*/
    destroyPlayer(params: {
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
     *@description 监听音频播放进度更新事件(进度为系统返回，双端可能不一致)*/
    onTimeUpdate(
      listener: (params: {
        /** 播放进度 【0 - 1】 */
        time: number
        /** 当前时间，单位秒 */
        current: number
      }) => void
    ): void

    /**
     *@description 取消监听音频播放进度更新事件*/
    offTimeUpdate(
      listener: (params: {
        /** 播放进度 【0 - 1】 */
        time: number
        /** 当前时间，单位秒 */
        current: number
      }) => void
    ): void

    /**
     *@description 监听音频播放状态事件*/
    onPlayerStatusUpdate(
      listener: (params: {
        /** 播放状态回调, 0暂停, 1缓存中, 2播放中 */
        status: number
      }) => void
    ): void

    /**
     *@description 取消监听音频播放状态事件*/
    offPlayerStatusUpdate(
      listener: (params: {
        /** 播放状态回调, 0暂停, 1缓存中, 2播放中 */
        status: number
      }) => void
    ): void
  }
  /**
   *@description 创建内部audio上下文InnerAudioContext对象*/
  export function createInnerAudioContext(params?: {
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
  }): InnerAudioContext

  /**
   *@description 一个用来控制小部件弹窗显示和关闭的对象*/
  interface MiniWidgetDialog {
    /**
     *@description 关闭小部件弹窗
     *@error {5: 'The necessary parameters are missing'} | {7: 'API Internal processing failed'}*/
    dismissMiniWidget(params: {
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
     *@description 监听widget关闭事件
     *@error {5: 'The necessary parameters are missing'} | {7: 'API Internal processing failed'}*/
    onWidgetDismiss(listener: (params: {}) => void): void

    /**
     *@description 取消监听widget关闭事件
     *@error {5: 'The necessary parameters are missing'} | {7: 'API Internal processing failed'}*/
    offWidgetDismiss(listener: (params: {}) => void): void
  }
  /**
   *@description 打开小部件弹窗
   *@error {5: 'The necessary parameters are missing'}*/
  export function openMiniWidget(params: {
    /** 要打开的小部件appid */
    appId: string
    /** 对应的小部件页面相对url, 如果为空则打开首页,path 中 ? 后面的部分会成为 query */
    pagePath?: string
    /** 面板类型设备id */
    deviceId?: string
    /** 面板群组类型群组id */
    groupId?: string
    /** 小部件样式,默认middle */
    style?: string
    /** 版本类型,默认release */
    versionType?: WidgetVersionType
    /** 版本号 */
    version?: string
    /** 展示位置,默认bottom */
    position?: WidgetPosition
    /** 点击空白处是否关闭 */
    autoDismiss?: boolean
    /**
     * 是否优先展示默认缓存
     * 对应属性在小程序容器3.1.0生效
     */
    autoCache?: boolean
    /** 是否支持深色模式 */
    supportDark?: boolean
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
  }): MiniWidgetDialog

  /**
   *@description 一个可以监听下载进度变化事件，以及取消下载任务的对象*/
  interface DownloadTask {
    /**
     *@description 中断下载任务
     *@error {7: 'API Internal processing failed'}*/
    abort(params: {
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
     *@description 监听 HTTP Response Header 事件。会比请求完成事件更早
     *@error {7: 'API Internal processing failed'}*/
    onHeadersReceived(
      listener: (params: {
        /** 开发者服务器返回的 HTTP Response Header */
        header: any
      }) => void
    ): void

    /**
     *@description 取消监听 HTTP Response Header 事件
     *@error {7: 'API Internal processing failed'}*/
    offHeadersReceived(
      listener: (params: {
        /** 开发者服务器返回的 HTTP Response Header */
        header: any
      }) => void
    ): void

    /**
     *@description 监听下载进度变化事件
     *@error {7: 'API Internal processing failed'}*/
    onProgressUpdate(
      listener: (params: {
        /** 下载进度百分比 */
        progress: number
        /** 已经下载的数据长度，单位 Bytes */
        totalBytesSent: number
        /** 预期需要下载的数据总长度，单位 Bytes */
        totalBytesExpectedToSend: number
      }) => void
    ): void

    /**
     *@description 取消监听下载进度变化事件
     *@error {7: 'API Internal processing failed'}*/
    offProgressUpdate(
      listener: (params: {
        /** 下载进度百分比 */
        progress: number
        /** 已经下载的数据长度，单位 Bytes */
        totalBytesSent: number
        /** 预期需要下载的数据总长度，单位 Bytes */
        totalBytesExpectedToSend: number
      }) => void
    ): void
  }
  /**
   *@description 下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径 (本地路径)，单次下载允许的最大文件为 200MB。使用前请注意阅读相关说明。
   *注意：请在服务端响应的 header 中指定合理的 Content-Type 字段，以保证客户端正确处理文件类型。
   *@error {5: 'The necessary parameters are missing'} | {10007: 'download file error'}*/
  export function downloadFile(params: {
    /** 下载资源的 url */
    url: string
    /** HTTP 请求的 Header，Header 中不能设置 Referer */
    header?: any
    /** 超时时间，单位为毫秒 */
    timeout?: number
    /** 指定文件下载后存储的路径 (本地路径) */
    filePath?: string
    success?: (params: {
      /** 临时文件路径 (本地路径)。没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件 */
      tempFilePath: string
      /** 用户文件路径 (本地路径)。传入 filePath 时会返回，跟传入的 filePath 一致 */
      filePath: string
      /** 开发者服务器返回的 HTTP 状态码 */
      statusCode: number
      /** 网络请求过程中一些调试信息 */
      profile: Profile
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
  }): DownloadTask

  /**
   *@description 文件管理器*/
  interface FileSystemManager {
    /**
     *@description 判断文件/目录是否存在
     *@error {5: 'The necessary parameters are missing'} | {10011: 'file not exist'} | {10020: 'sdcard not mounted error'}*/
    access(params: {
      /** 要判断是否存在的文件/目录路径 (本地路径) */
      path: string
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
     *@description 读取本地文件内容
     *@error {5: 'The necessary parameters are missing'} | {10011: 'file not exist'} | {10012: 'read file encoding invalid'} | {10013: 'read file error'}*/
    readFile(params: {
      /** 要写入的文件路径 (本地路径) */
      filePath: string
      /**
       * 指定读取文件的字符编码。
       * 支持 utf8/ascii/base64。如果不传 encoding，默认utf8
       */
      encoding?: string
      /** 从文件指定位置开始读，如果不指定，则从文件头开始读。读取的范围应该是左闭右开区间 [position, position+length)。有效范围：[0, fileLength - 1]。单位：byte */
      position?: number
      /** 指定文件的长度，如果不指定，则读到文件末尾。有效范围：[1, fileLength]。单位：byte */
      length?: number
      success?: (params: {
        /** 文件内容 */
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
     *@description 读取本地文件内容
     *@error {5: 'The necessary parameters are missing'} | {10011: 'file not exist'} | {10012: 'read file encoding invalid'} | {10013: 'read file error'}*/
    readFileSync(req?: FileReadFileReqBean): {
      /** 文件内容 */
      data: string
    }

    /**
     *@description 将文件另存一份到目标路径中。
     *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'} | {10020: 'sdcard not mounted error'}*/
    saveFile(params: {
      /** 需要存储的文件的临时路径 */
      tempFilePath: string
      /** 要存储的文件的目标路径 */
      filePath: string
      success?: (params: {
        /** 【待废弃， 不建议使用】存储后的文件路径 */
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
      complete?: () => void
    }): void

    /**
     *@description 将文件另存一份到目标路径中。
     *@error {6: 'The parameter format is incorrect'} | {7: 'API Internal processing failed'} | {10020: 'sdcard not mounted error'}*/
    saveFileSync(params?: SaveFileSyncParams): {
      /** 【待废弃， 不建议使用】存储后的文件路径 */
      savedFilePath: string
    }

    /**
     *@description 获取文件Stats对象，需要文件读写权限
     *@error {6: 'The parameter format is incorrect'} | {10011: 'file not exist'} | {10015: 'get file stats error'} | {10020: 'sdcard not mounted error'}*/
    stat(params: {
      /** 文件/目录路径 (本地路径) */
      path: string
      /**
       * 是否递归获取目录下的每个文件的 Stats 信息
       * 默认值：false
       */
      recursive?: boolean
      success?: (params: {
        /** 文件列表 */
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
      complete?: () => void
    }): void

    /**
     *@description 获取文件Stats对象，需要文件读写权限
     *@error {6: 'The parameter format is incorrect'} | {10011: 'file not exist'} | {10015: 'get file stats error'} | {10020: 'sdcard not mounted error'}*/
    statSync(params?: FileStatsParams): {
      /** 文件列表 */
      fileStatsList: FileStats[]
    }

    /**
     *@description 创建目录，需要文件读写权限
     *@error {6: 'The parameter format is incorrect'} | {9004: 'app no permission'} | {10016: 'create dir error'} | {10020: 'sdcard not mounted error'}*/
    mkdir(params: {
      /** 创建的目录路径 (本地路径) */
      dirPath: string
      /**
       * 是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。
       * 如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，
       * 以此类推直至创建 a/b/c 目录下的 d 目录。
       * 默认值：false
       */
      recursive?: boolean
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
     *@description 创建目录，需要文件读写权限
     *@error {6: 'The parameter format is incorrect'} | {9004: 'app no permission'} | {10016: 'create dir error'} | {10020: 'sdcard not mounted error'}*/
    mkdirSync(params?: MakeDirParams): null

    /**
     *@description 删除目录，需要文件读写权限
     *@error {6: 'The parameter format is incorrect'} | {10011: 'file not exist'} | {10017: 'delete dir error'} | {10020: 'sdcard not mounted error'}*/
    rmdir(params: {
      /** 要删除的目录路径 (本地路径) */
      dirPath: string
      /**
       * 是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。
       * 默认值：false
       */
      recursive?: boolean
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
     *@description 删除目录，需要文件读写权限
     *@error {6: 'The parameter format is incorrect'} | {10011: 'file not exist'} | {10017: 'delete dir error'} | {10020: 'sdcard not mounted error'}*/
    rmdirSync(params?: RemoveDirParams): null

    /**
     *@description 写文件，需要文件读写权限
     *@error {6: 'The parameter format is incorrect'} | {10011: 'file not exist'} | {10019: 'write file error'} | {10020: 'sdcard not mounted error'}*/
    writeFile(params: {
      /** 要写入的文件路径 (本地路径) */
      filePath: string
      /** 要写入的文本数据, 根据encoding编码 */
      data: string
      /** 指定写入文件的字符编码,目前支持【utf8、ascii、base64】, 默认utf8 */
      encoding?: string
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
     *@description 写文件，需要文件读写权限
     *@error {6: 'The parameter format is incorrect'} | {10011: 'file not exist'} | {10019: 'write file error'} | {10020: 'sdcard not mounted error'}*/
    writeFileSync(params?: WriteFileParams): null

    /**
     *@description 删除已保存的本地缓存文件，需要文件读写权限
     *@error {6: 'The parameter format is incorrect'} | {10011: 'file not exist'} | {10018: 'remove saved file error'} | {10020: 'sdcard not mounted error'}*/
    removeSavedFile(params: {
      /** 需要删除的文件路径 (本地路径) */
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
  }
  /**
   *@description 获取文件管理器，仅支持操作App内的文件。
   *如若文件操作的需要权，需另外调用权限接口申请。*/
  export function getFileSystemManager(params?: {
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
  }): FileSystemManager

  /**
   *@description 获取网络请求任务对象RequestTask*/
  interface RequestTask {
    /**
     *@description 中断请求任务
     *@error {7: 'API Internal processing failed'}*/
    abort(params: {
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
     *@description 监听 HTTP Response Header 事件。会比请求完成事件更早*/
    onHeadersReceived(
      listener: (params: {
        /** 开发者服务器返回的 HTTP Response Header */
        header: any
      }) => void
    ): void

    /**
     *@description 取消监听 HTTP Response Header 事件*/
    offHeadersReceived(
      listener: (params: {
        /** 开发者服务器返回的 HTTP Response Header */
        header: any
      }) => void
    ): void
  }
  /**
   *@description 发起 HTTPS 网络请求
   *@error {10003: 'network request error'}*/
  export function request(params: {
    /** 开发者服务器接口地址 */
    url: string
    /** 请求的参数 */
    data?: string
    /** 设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json */
    header?: any
    /** 超时时间，单位为毫秒 */
    timeout?: number
    /** HTTP 请求方法 */
    method?: HTTPMethod
    /** 请求体里的数据类型（仅Android，且请求方式不为GET时生效） */
    dataType?: string
    /** 返回的数据类型 */
    responseType?: string
    /** enableHttp2 */
    enableHttp2?: boolean
    /** enableQuic */
    enableQuic?: boolean
    /** enableCache */
    enableCache?: boolean
    success?: (params: {
      /** 开发者服务器返回的数据 */
      data: string
      /** 开发者服务器返回的 HTTP 状态码 */
      statusCode: number
      /** 开发者服务器返回的 HTTP Response Header */
      header: any
      /** 开发者服务器返回的 cookies，格式为字符串数组 */
      cookies: string[]
      /** 网络请求过程中一些调试信息 */
      profile: Profile
      /** 网络请求id，用户取消、监听等操作 */
      taskId: string
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
  }): RequestTask

  /**
   *@description 获取全局唯一的录音管理器*/
  interface RecorderManager {
    /**
     *@description 开始录音
     *@error {7: 'API Internal processing failed'} | {9004: 'app no permission'}*/
    start(params: {
      /** 录音的时长，单位 ms，最大值 600000（10 分钟） */
      duration?: number
      /** 采样率 */
      sampleRate?: AudioSampleRate
      /** 录音通道数 */
      numberOfChannels?: AudioNumChannel
      /** 编码码率，有效值见下表格 */
      encodeBitRate?: number
      /** 音频格式 */
      format?: AudioFormat
      /** 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3、pcm 格式。 */
      frameSize: number
      /** 指定录音的音频输入源 */
      audioSource?: string
      success?: (params: {
        /** 录音文件的临时路径 (本地路径) */
        tempFilePath: string
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
     *@description 继续录音
     *@error {7: 'API Internal processing failed'}*/
    resume(params: {
      success?: (params: {
        /** 录音文件的临时路径 (本地路径) */
        tempFilePath: string
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
     *@description 暂停录音
     *@error {7: 'API Internal processing failed'}*/
    pause(params: {
      success?: (params: {
        /** 录音文件的临时路径 (本地路径) */
        tempFilePath: string
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
     *@description 停止录音*/
    stop(params: {
      success?: (params: {
        /** 录音文件的临时路径 (本地路径) */
        tempFilePath: string
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
     *@description 开始持续录音
     *@error {6: 'The parameter format is incorrect'} | {9004: 'app no permission'}*/
    startRecording(params: {
      /** 间隔时间  ms */
      period: number
      /**
       * 由于历史原因，iOS默认32-bit PCM，Android默认16-bit PCM
       * true表示统一双端的默认值为16，false保持原有默认值
       * default true
       */
      pcm16IOS?: boolean
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
     *@description 停止持续录音
     *@error {6: 'The parameter format is incorrect'}*/
    stopRecording(params: {
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
   *@description 获取全局唯一的录音管理器*/
  export function getRecorderManager(params?: {
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
  }): RecorderManager

  /**
   *@description 获取网络请求任务对象RequestTask*/
  interface UploadTask {
    /**
     *@description 中断上传任务
     *@error {7: 'API Internal processing failed'}*/
    abort(params: {
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
     *@description 监听 HTTP Response Header 事件。会比请求完成事件更早
     *@error {7: 'API Internal processing failed'}*/
    onHeadersReceived(
      listener: (params: {
        /** 开发者服务器返回的 HTTP Response Header */
        header: any
      }) => void
    ): void

    /**
     *@description 取消监听 HTTP Response Header 事件
     *@error {7: 'API Internal processing failed'}*/
    offHeadersReceived(
      listener: (params: {
        /** 开发者服务器返回的 HTTP Response Header */
        header: any
      }) => void
    ): void

    /**
     *@description 监听上传进度变化事件
     *@error {7: 'API Internal processing failed'}*/
    onProgressUpdate(
      listener: (params: {
        /** 下载进度百分比 */
        progress: number
        /** 已经下载的数据长度，单位 Bytes */
        totalBytesSent: number
        /** 预期需要下载的数据总长度，单位 Bytes */
        totalBytesExpectedToSend: number
      }) => void
    ): void

    /**
     *@description 取消监听上传进度变化事件
     *@error {7: 'API Internal processing failed'}*/
    offProgressUpdate(
      listener: (params: {
        /** 下载进度百分比 */
        progress: number
        /** 已经下载的数据长度，单位 Bytes */
        totalBytesSent: number
        /** 预期需要下载的数据总长度，单位 Bytes */
        totalBytesExpectedToSend: number
      }) => void
    ): void
  }
  /**
   *@description 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data
   *@error {6: 'The parameter format is incorrect'} | {10008: 'upload file error'}*/
  export function uploadFile(params: {
    /** 开发者服务器地址 */
    url: string
    /** 要上传文件资源的路径 (本地路径) */
    filePath: string
    /** 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 */
    name: string
    /** HTTP 请求的 Header，Header 中不能设置 Referer */
    header?: any
    /** HTTP 请求中其他额外的 form data */
    formData?: any
    /** 超时时间，单位为毫秒 */
    timeout?: number
    success?: (params: {
      /** 开发者服务器返回的数据 */
      data: string
      /** 开发者服务器返回的 HTTP 状态码 */
      statusCode: number
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
  }): UploadTask
}
