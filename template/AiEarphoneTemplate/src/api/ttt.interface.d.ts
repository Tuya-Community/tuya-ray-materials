export interface RecordTransferResultDetail {
  fileId: number; // 文件序列号（唯一主键）
  translateFileId: number; // 对应的translate表的id （外键，可为空）
  recordTransferId: number;
  directoryId: number;
  deviceUniqueId: string;
  name: string;
  recordTime: number;
  duration: number;
  recordType: number; // 录音类型 0: 电话 1: 现场录音+实时转录+同声传译 2: 面对面（Pro版）3: 面对面 4: 文本翻译 5: 音频导入
  audioFormat: number;
  deviceId: string; // 设备ID（手机是 "PHONE"）
  filePath?: string;
  wavFilePath?: string;
  amplitudes?: string;
  status: number; // 文件同步状态 0未上传、1上传中、2已上传、3上传失败
  visit: number; // 访问状态 0: 未读 1: 已读 2: 已转录未读 3: 已转录已读
  remove: boolean; // 是否移除 0: 未移除 1: 已移除
  storageKey?: string;
  transfer: number; // 转录状态 0：未转录 1：转录中 2：已转录 3：转录失败
  summary: number; // 总结状态：0：未知，680之前线上老数据 1：未总结 2：总结中 3：总结成功 4：总结失败
  source: number; // 写入audioSource的值 “老数据为-1，iOS拓展version字段”
  transferType: number; // 是否纯离线 0: 单纯离线录音数据 1: 实时录音数据
  needTranslate: boolean; // 是否翻译 0: 无翻译 1: 有翻译
  originalLanguage?: string; // 源语言 （以最后一次为主）
  targetLanguage?: string; // 目标语言（以最后一次为主）
  recordId?: string;
  agentId?: string; // 渠道Id
  cloudTranscription: boolean; // 是否云端二次转录 0: 未二次转录 1: 已二次转录
  ownerId?: string; // 设备当前所在家庭Id
  translateState: number; // 翻译状态 0：未知，1：未翻译 2：翻译中 3：翻译成功 4：翻译失败
  transcriptionStatus: number; // 0: 旧数据兼容，1：未转写  2:部分转写、3:全部转写
  isFromCloud?: boolean; // 是否来自云同步
  cloudSyncStatus?: number; // 云同步状态
  linkShared?: number; // 分享状态 0: 未分享 1: 分享中 2: 已关闭
  offlineUploadProgress: number; // 离线文件上传进度，默认0
  offlineUploadStatus: number; // 离线文件上传状态，-1未上传（默认），0等待上传、1正在上传、2上传完成、3上传失败、4取消
  /** 文件标签（展示用） */
  tags?: string[];
  /** 总结图片状态 0:未生成 1:生成中 2:生成完成 3:生成失败 */
  summaryImageStatus?: number;
  /** 总结图片url */
  summaryImageUrl?: string;
}

// 转写状态查询结果
export interface TransferProcessStatusResult {
  success: string[];
  fail: string[];
  summarySuccess: string[];
  summaryFail: string[];
  translateSuccess?: string[];
  translateFail?: string[];
}

// 权益列表项
export interface BenefitItem {
  type: 'usage' | 'day' | 'day_locked'; // 模式 按时长
  subscription?: boolean; // 是否订阅
  leftQuantity: number; // 剩余时间
  totalQuantity: number; // 总计时间
  effectiveStartDate: number; // 生效时间
  effectiveEndDate: number; // 过期时间
  desc?: string; // 描述
  deviceName?: string; // 设备名称
  scope: 'mall' | 'device' | 'heyTuya'; // 权益范围 mall:商城权益 device:设备权益 heyTuya:AI积分权益
  vasType: 'cycle' | 'single'; // 权益类型 cycle:周期 single:一次性
  usedQuantity: number; // 已使用时间
}

// 云同步开关状态
export interface CloudSyncSwitchStatusResult {
  enabled: boolean;
  syncType: number; // 同步类型 0: 同步所有网络  1: 仅在Wi-Fi下同步
  modifyTime: number;
}

// 下载音频文件参数
export interface SyncDownloadNoteAudioParams {
  fileId: number;
  recordId: string;
}

export interface FailedFileInfo {
  fileName: string; // 文件名
  code: string; // 错误码
}

export interface FileImportStatusResult {
  status: number; // 导入状态 0: 未开始 1: 正在导入中 2: 导入完成 3: 导入中断（中断错误，整个流程停止），4: 分享导入失败
  errorCode?: number; // 错误码（当 status = 3/4 时使用）
  errorMessage?: string; // 错误消息（当 status = 3/4 时使用）
  totalFileCount?: number; // 总文件数量
  successCount?: number; // 已成功导入的文件数量
  failedFiles?: FailedFileInfo[]; // 当前导入失败的文件列表（跳过失败的文件）
  timestamp: number; // 时间戳
}

// 获取音频分享小程序合规路径参数
export interface OperateAudioFileSafePathParams {
  isGetPath: boolean; // true:获取  false:删除
  /**
   * isGetPath为true, audioPath为通过getRecordTransferResultDetail拿到的filePath
   * isGetPath为false,audioPath为safePath
   */
  audioPath: string;
}

// 获取音频分享小程序合规路径结果
export interface OperateAudioFileSafePathResult {
  safePath: string;
}

// 离线文件摘要
export interface FileDigest {
  fileId: number;
  fileType: number;
  progress: number;
  timeStamp: number;
  fileName: string;
  fileDuring: number;
}

// 离线文件响应
export interface OfflineFilesResponse {
  channel: number;
  speed: number;
  total: number; // 可下载文件总数
  size: number; // 已下载文件总数
  downloadedFileProgress: number; // 下载进度
  curFile: FileDigest;
  files_waiting: FileDigest[];
  files_failed: FileDigest[];
  files_transform: FileDigest[];
  files_successed: FileDigest[];
  /**
   * 0.初始化状态.热点未开启
   * 1.Note热点已开启
   * 2.Note热点已连接
   */
  apConnectState: number;
  deviceId?: string;
  remainingDownloadTime: number; // 剩余下载时间
}

// 获取设备离线文件状态结果
export interface DeviceOfflineFileResult {
  errorCode: number;
  status: number; // 当前下载状态 0:未开始 1:下载中 2:已结束
  sessionId: number; // 当前任务Id，用于标识单次任务的唯一身份 0 标识任务未开始
  response: OfflineFilesResponse; // 当前资源的下载状态
}

// 保存/关闭分享链接参数
export interface OperateRecordShareLinkParams {
  recordId: string;
  shareType: string[];
  expireTime: number;
  password?: string;
  shareStatus: number; // 分享状态 1: 分享中 2: 分享关闭
}

/**
 * 批量合并录音参数
 */
export interface MergeRecordListParams {
  recordIds: string[]; // 录音记录ID列表
}

/** 任务状态 0: 未开始, 1: 执行中, 2: 执行结束, 3: 异常结束 */
export type FileMergeStatus = 0 | 1 | 2 | 3;

/**
 * 合并错误码
 * 20220: 参数为空（recordIds 为空）
 * 20221: 通用合并失败
 * 20222: 网络不可用
 * 20223: 本地文件不存在
 * 20224: 上传记录失败
 * 20225: 合并上报失败
 * 20226: 录音记录未找到
 * 20227: 未知错误
 * 20229: 创建合并 RecordFile 失败
 * 20230: 取消合并
 */
export type MergeErrorCode =
  | 20220
  | 20221
  | 20222
  | 20223
  | 20224
  | 20225
  | 20226
  | 20227
  | 20229
  | 20230;

/** 执行中子状态(当 status = 1 时使用) 10: 文件下载中, 20: 文件合并中 */
export type FileMergeSubStatus = 10 | 20;

/**
 * 文件合并状态事件
 */
export interface FileMergeStatusEvent {
  status: FileMergeStatus; // 任务状态 0: 未开始, 1: 执行中, 2: 执行结束, 3: 异常结束
  subStatus?: FileMergeSubStatus; // 执行中子状态(当 status = 1 时使用) 10: 文件下载中, 20: 文件合并中
  errorCode?: MergeErrorCode; // 错误码
  progress?: number; // 进度
  recordId?: string; // 文件ID
}

/**
 * 获取快速启动入口列表入参（可选，预留扩展）
 */
export interface GetQuickEntryListParams {
  [key: string]: any;
}

/**
 * 快速启动入口类型（int）
 * 安卓 1 开头：101=组件，102=快捷图标，103=磁贴
 * iOS 2 开头：201=组件，202=快捷图标，203=磁贴
 */
export type QuickEntryType = 101 | 102 | 103 | 201 | 202 | 203;

/**
 * 快速启动入口组件 ID（int）
 * 10101=组件 1*1，10102=组件 2*2，10201=快捷方式，10301=磁贴，10401=长按菜单
 */
export type QuickEntryComponentId = 10101 | 10102 | 10201 | 10301 | 10401;

/**
 * 快速启动入口添加状态（int）
 * 0=不显示添加，1=已添加，2=未添加
 */
export type QuickEntryState = 0 | 1 | 2;

/**
 * 快速启动入口信息，Android / iOS 通用约定。
 */
export interface QuickEntryInfo {
  /** 入口类型 */
  type: QuickEntryType;
  /**
   * 添加状态（int）：0=不显示添加，1=已添加，2=未添加
   */
  state: QuickEntryState;
  /** 组件 ID */
  componentId: QuickEntryComponentId;
}

/**
 * 快速启动入口开启/关闭请求参数
 */
export interface SetQuickEntryEnabledParams {
  /** 入口类型 */
  type: QuickEntryType;
  /** 组件 ID */
  componentId?: QuickEntryComponentId;
  /**
   * 开启/关闭状态（int）：0=关闭，1=开启
   */
  enabled: number;
}

/**
 * 搜索录音转写入参
 */
export interface SearchRecordTransferResultParams {
  /** 搜索关键词 */
  content: string;
  /** 页码，默认 1（保留，本期不使用） */
  pageNum?: number;
  /** 每页条数，默认 20（保留，本期不使用） */
  pageSize?: number;
}

/**
 * 搜索录音转写单条结果（标题/标签/总结为服务端高亮后的文案）
 */
export interface SearchRecordTransferResult {
  /** 录音转写 id */
  recordId: string;
  /** 高亮后的标题 */
  title: string;
  /** 高亮后的标签列表，如 ["客户拜访", "A级客户"] */
  tags?: string[];
  /** 高亮后的总结 */
  content: string;
  /** 音频文件来源 audioSource */
  audioSource: number;
  /** 是否来自云同步 */
  isFromCloud: boolean;
  /** 录音时间，时间戳，单位秒 */
  recordTime: number;
  /** 录音时长，单位毫秒 */
  duration: number;
}

// app首页常用添加卡片参数
export interface AddDIYHomeCardParams {
  card: {
    type: number; // 卡片类型 7: 设备，14: 笔记小程序，18: 翻译小程序
    contentId: string;
    style?: number;
  };
  gid: number; // 家庭id
}

/** 更新录音标签 */
export interface UpdateRecordTagResultParams {
  recordId: string;
  /** 0: 新增，1: 删除，2: 排序 */
  bizType: number;
  tags?: string[];
}
