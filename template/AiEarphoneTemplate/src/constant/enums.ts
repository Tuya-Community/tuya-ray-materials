// 转写状态
export enum TransferStatus {
  Initial, // 未转录
  Process, // 转写中
  Success, // 转写成功
  Fail, // 转写失败
}

// 总结状态
export enum SummaryStatus {
  Old, // 兼容老数据
  Initial, // 未总结
  Process, // 正在总结
  Success, // 总结成功
  Fail, // 总结失败
}

// 总结信息图状态
export enum SummaryImageStatus {
  Initial, // 未生成
  Generating, // 生成中
  Complete, // 生成完成
  Failed, // 生成失败
}

// 翻译状态
export enum TranslateStatus {
  Unknown, // 未知
  Initial, // 未翻译
  Process, // 翻译中
  Success, // 翻译成功
  Fail, // 翻译失败
}

export enum LangSource {
  faceToface = 'asr-llm-tts', // 语音输入 -大模型处理-语音返回
  transcription = 'asr', // 语音输入 -文字返回
  Simultaneous = 'asr-llm', // 语音输入 -大模型处理-文字返回
}

export enum RecordMode {
  liveRecording = 'liveRecording', // 现场录音
  phoneRecording = 'phoneRecording', // 电话录音
  realTimeRecording = 'realTimeRecording', // 实时转写
  simultaneousInterpretation = 'simultaneousInterpretation', // 同声传译
  faceToFaceTranslation = 'faceToFaceTranslation', // 面对面翻译
  importAudio = 'importAudio', // 导入音频
  smartDevice = 'smartDevice', // 智能设备
}

export const RecordModeTrackMap: Record<string, string> = {
  [RecordMode.liveRecording]: 'record_only',
  [RecordMode.realTimeRecording]: 'asr_realtime',
  [RecordMode.phoneRecording]: 'phone_call',
  [RecordMode.simultaneousInterpretation]: 'interpretation',
};

export enum AudioSource {
  entry = 0, // 入门版音源
  phone = 1, // 手机音源
  proLive = 20, // pro版现场音源
  proCall = 21, // pro版电话音源
  card = 41, // 卡片音源
  cardSigle = 40, // 卡片音源
  proFaceToFace = 23, // pro版面对面翻译音源
  glasses = 80, // 眼镜设备音源
  merge = 110, // 合并的音频
  mergeImport = 111, // 合并的音频（包含导入的音频）
  pc = 130, // PC音源
  wifiTrans = 140, // wifi翻译器音源
}

/** TTS 输出通道 */
export enum TtsOutput {
  Mic = 1, // 系统 MIC 通道
  Bt = 2, // 系统 BT 通道
  Device = 3, // 设备
}

/**
 * 音源范围映射
 * 定义哪些数值范围属于哪个音源类型
 */
export const AudioSourceRanges = {
  import: { min: 60, max: 72 }, // 60-72 都是导入音频
} as const;

// 设备类型
export enum DEVTYPES {
  entry = 'entry_version',
  phone = 'phone',
  pro = 'pro_version',
  card = 'card',
  os = 'os_buds',
  glasses = 'glasses',
  wifiTrans = 'wifi_trans',
  unKnown = 'unKnown',
}

// 权益类型
export enum BenefitType {
  Day = 'day',
  Usage = 'usage',
  DayLocked = 'day_locked',
}

// 权益范围
export enum BenefitScope {
  Device = 'device',
  Mall = 'mall',
  HeyTuya = 'heyTuya',
}

// 权益VAS类型
export enum BenefitVasType {
  Cycle = 'cycle',
  Single = 'single',
}

// 云同步状态 (所有文件)
export enum CloudSyncStatus {
  Disabled = -1, // 未开启
  Success = 0, // 同步成功
  Syncing = 1, // 同步中
  Failed = 2, // 同步失败
}

// 云同步状态 (单个文件)
export enum SingleCloudSyncStatus {
  Default = 0, // 不展示任何同步状态
  Uploading = 5, // 音频上传中
  UploadSuccess = 10, // 音频上传成功
  UploadFailed = -10, // 音频上传失败
  Downloading = 15, // 音频下载中
  DownloadSuccess = 20, // 音频下载成功
  DownloadFailed = -20, // 音频下载失败
}

// 文件列表局部刷新项状态
export enum FileOperateStatus {
  Add = 1, // 新增
  Update = 2, // 更新
  Delete = 3, // 删除
}

// 文件列表访问状态
export enum FileVisitStatus {
  Unread, // 未读
  Read, // 已读
  TransferUnread, // 已转写未读
  TransferRead, // 已转写已读
}

// 文件导入状态
export enum FileImportStatus {
  Initial, // 未导入
  Importing, // 正在导入
  Imported, // 导入成功
  ImportFailed, // 导入失败
  ShareImportFailed, // 分享导入异常
}

export enum BusinessType {
  Note, // 录音来源是note
  Trans, // 录音来源四翻译小程序
}

// 分享状态
export enum ShareStatus {
  UnShare = 0, // 未分享
  ShareIng = 1, // 分享中
  Closed = 2, // 已关闭
}

// 快速启动入口类型（int）
// 安卓 1 开头：101=组件，102=快捷图标，103=磁贴
// iOS 2 开头：201=组件，202=快捷图标，203=磁贴
export const QuickEntryTypeEnum = {
  ANDROID_WIDGET: 101,
  ANDROID_SHORTCUT: 102,
  ANDROID_TILE: 103,
  IOS_WIDGET: 201,
  IOS_SHORTCUT: 202,
  IOS_TILE: 203,
} as const;

// 快速启动入口组件 ID（int）
// 10101=组件 1*1，10102=组件 2*2，10201=快捷方式，10301=磁贴，10401=长按菜单
export const QuickEntryComponentIdEnum = {
  WIDGET_1X1: 10101,
  WIDGET_2X2: 10102,
  SHORTCUT: 10201,
  TILE: 10301,
  LONG_PRESS_MENU: 10401,
} as const;

// 快速启动入口添加状态（int）
// 0=不显示添加，1=已添加，2=未添加
export const QuickEntryStateEnum = {
  HIDE_ADD: 0,
  ADDED: 1,
  NOT_ADDED: 2,
} as const;

// 自定义模板保存错误枚举（后端返回）
export enum CustomTemplateSaveErrorCode {
  CUSTOM_TEMPLATE_LIMIT_EXCEEDED = 'CUSTOM_TEMPLATE_LIMIT_EXCEEDED',
  TEMPLATE_NOT_EXIST = 'TEMPLATE_NOT_EXIST',
  AI_INVALID_INPUT = 'AI_INVALID_INPUT',
}

export const CustomTemplateSaveErrorI18nKeyMap: Record<CustomTemplateSaveErrorCode, string> = {
  [CustomTemplateSaveErrorCode.CUSTOM_TEMPLATE_LIMIT_EXCEEDED]:
    'custom_template_error_limit_exceeded',
  [CustomTemplateSaveErrorCode.TEMPLATE_NOT_EXIST]: 'custom_template_error_not_exist',
  [CustomTemplateSaveErrorCode.AI_INVALID_INPUT]: 'custom_template_error_ai_invalid_input',
};

// 自定义模板提示词润色错误枚举（后端返回）
export enum CustomTemplatePromptPolishErrorCode {
  PROMPT_POLISH_LIMIT_EXCEEDED = 'PROMPT_POLISH_LIMIT_EXCEEDED',
}

export const CustomTemplatePromptPolishErrorI18nKeyMap: Record<
  CustomTemplatePromptPolishErrorCode,
  string
> = {
  [CustomTemplatePromptPolishErrorCode.PROMPT_POLISH_LIMIT_EXCEEDED]:
    'custom_template_error_polish_limit_exceeded',
};
