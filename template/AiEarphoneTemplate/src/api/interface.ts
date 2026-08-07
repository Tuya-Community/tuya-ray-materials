export interface RemoveFilesParams {
  fileIds: number[];
  isDeleteAll: boolean;
}

export interface LoadFileRequest {
  deviceId: string;
  /**
   *t.Integer; 选择通道 0:未指定  1:ble  2:ap
   */
  channel: number;
  /**
   * 0代表开启新任务，任务Id
   */
  sessionId: number;
}

export interface ChangeRecodeChannelRequest {
  deviceId: string;
  /**
   *t.Integer; 选择通道 0:未指定  1 Bt 2 micro
   */
  recordChannel: number;
}

// 统计信息返回
export interface StatisticInfoResult {
  totalTranscribeMinutes: number; // 累计转写分钟数
  totalTranscribeWords: number; // 累计转写字数
  totalSummaryCount: number; // 累计总结次数
  totalUsageDays: number; // 累计使用天数
}

// 开启/关闭云同步参数
export interface CloudSyncSwitchParams {
  enabled: boolean;
  syncType: string; // 同步类型 wifi: 仅在Wi-Fi下同步 all: 同步所有网络
}

// 获取开关配置返回
export interface SwitchConfigResult {
  /** @deprecated 礼包能力已移除，服务端字段保留兼容 */
  newGift: boolean;
  subGuide: boolean; // 引导订阅开关
  /** @deprecated 礼包能力已移除，服务端字段保留兼容 */
  homeGift: boolean;
  quotaGuide: boolean; // 耗尽时是否引导购买
  benefitCard: boolean; // 我的页面权益卡片开关
  vasList: boolean; // 增值服务商品列表开关
  deviceGuide: boolean; // 设备购买引导开关
  transcribeOptimizeEnabled: boolean; // 转写优化配置开关
  webEntry: boolean; // 网页版入口开关
  myDevice: boolean; // 我的设备/添加设备开关
}

// 获取各种网址
export interface atopGetUrlFromApolloReq {
  key: string;
}

export type atopGetUrlFromApolloRes = string;

export interface AtopGetShareLinkDetailRes {
  shareType: string[];
  shareStatus: number;
  expireTime: number;
  password?: string;
}
// 总结模版信息
export interface SummaryTemplateInfo {
  id: string; // 模板主键 ID
  icon: string; // 模板图标标识
  templateName: string; // 模板名称
  sort: number; // 排序权重，值越小越靠前
  templateDesc: string; // 模板描述
  /** 模板唯一 code（接口文档推荐列表等场景可能下发） */
  templateCode?: string;
  /** 是否自定义模板（m.wearable.summary.template.recommend.list.get 等接口新增） */
  customize?: boolean;
  /** 提示词；`categoryCode=my_template` 等列表若下发该字段，字段名为 **prompt**（与创建/更新入参一致） */
  prompt?: string;
  /** 是否需要颜色适配（true=纯色图标，深色主题需加 img-theme-bw；false/undefined=彩色图标，无需适配） */
  needColorAdapt?: boolean;
  /** 图标 objectKey，用于编辑时匹配图标列表选中项 */
  objectKey?: string;
}

// 总结模版查询返回 - 分类项
export interface SummaryTemplateCategory {
  nodeName: string; // 一级分类名称（来自 ai_voice_summary_category.node_name）
  nodeCode: string; // 一级分类编码（来自 ai_voice_summary_category.node_code）
  templates: SummaryTemplateInfo[]; // 该一级行业下的模板列表（最多 6 条）
}

// 总结模版查询返回类型
export type SummaryTemplateRecommendListRes = SummaryTemplateCategory[];

// 按分类获取总结模版列表 - 请求参数
export interface SummaryTemplateListByCategoryParams {
  categoryCode: string; // 一级行业编码，对应 summary_category.node_code（仅支持一级节点）
  pageNo?: number; // 页码，从 1 开始，默认 1
  pageSize?: number; // 每页条数，默认 20，建议不超过 50
}

// 按分类获取总结模版列表 - 响应结果
export interface SummaryTemplateListByCategoryResult {
  nodeName: string; // 一级行业名称（来自 summary_category.node_name）
  nodeCode: string; // 一级行业编码（来自 summary_category.node_code）
  pageNo: number; // 当前页码（从 1 开始）
  pageSize: number; // 每页数量
  total: number; // 符合条件的模板总数
  hasMore: boolean; // 是否还有下一页（用于懒加载判断）
  list: SummaryTemplateInfo[]; // 模板列表
}

// 反馈标签项
export interface FeedbackTagItem {
  id: number; // tag ID
  tag: string; // 标签
}

// 反馈标签列表项（按业务类型分组）
export interface FeedbackTagListByBizType {
  bizType: number; // 业务类型.1-转写/2-总结/3-思维导图
  tags: FeedbackTagItem[]; // 标签数据
}

// 获取反馈标签列表 - 请求参数
export interface GetFeedbackTagListParams {
  bizTypes: string; // 需要获取的业务类型,多个以逗号隔开 (1-转写/2-总结/3-思维导图)
}

// 提交反馈 - 请求参数
/** 反馈类型。1-点踩;2-点赞;3-取消点踩;4-取消点赞;5-重置(比如重新转写或总结导致的) */
export type FeedbackType = 1 | 2 | 3 | 4 | 5;

export interface SubmitFeedbackParams {
  recordId: string; // 文件ID
  bizType: number; // 1-转写/2-总结/3-思维导图
  feedbackType: FeedbackType;
  tagIds?: string; // 标签ID列表,多个以逗号隔开
  remark?: string; // 备注信息
}

// 反馈详情项
export interface FeedbackDetailItem {
  recordId: string; // 文件ID
  bizType: number; // 1-转写/2-总结/3-思维导图
  feedbackType: FeedbackType;
}

// 获取反馈详情 - 请求参数
export interface GetFeedbackDetailParams {
  recordId: string; // 文件ID
  bizTypes: string; // 需要获取的业务类型,多个以逗号隔开 (1-转写/2-总结/3-思维导图)
}
export interface MindConfigResult {
  enabled: string; // 当前 App 是否开启底部栏（是否在 Apollo 的 enabledAppIds 内且有对应 appConfig）
  logoUrl: string; // Logo 图片地址
  qrCodeUrl: string; // 二维码图片地址
  appName: string; // 标题文案
  slogan: string; // 副标题/标语
}
// 是否展示悬浮框
export interface OperateRecordingFloatParams {
  isVisible: boolean; // 是否显示悬浮组件
}

// 获取带源语言的语言列表项
export interface TranslateLangListItem {
  code: string;
  selfDescribing: string;
}

// ============ 自定义模板 ============
export interface CustomTemplateItem {
  templateId: string; // 模板ID（接口文档为 String）
  templateCode?: string; // 模板唯一code（云端生成）
  icon?: string; // 图标展示 URL（仅用于 Image src）
  objectKey?: string; // 图标 objectKey（用于保存/更新，与 icon 列表一致）
  templateName: string; // 模板名称
  prompt: string;
  templateDesc?: string; // 模板描述（云端生成/返回）
  /** 是否自定义模板（与列表接口 customize 一致；my_template 列表在 slice 中固定为 true） */
  customize?: boolean;
  /** 是否需要颜色适配（true=纯色图标，深色主题需加 img-theme-bw；false/undefined=彩色图标，无需适配） */
  needColorAdapt?: boolean;
  /** 图标 objectKey，用于编辑时匹配图标列表选中项 */
  sort?: number;
  gmtCreate?: number;
  gmtModified?: number;
}

export interface CustomTemplateCreateParams {
  templateName: string;
  prompt: string;
  icon?: string;
}

export interface CustomTemplateCreateResult {
  templateId: string;
  templateCode: string;
  templateDesc: string;
}

export interface CustomTemplateUpdateParams {
  templateId: string;
  templateName?: string;
  prompt?: string;
  icon?: string;
}

export interface CustomTemplateSaveParams {
  /** 有 templateId 则 update，否则 create */
  templateId?: string;
  objectKey?: string;
  templateName: string;
  prompt: string;
}

export interface CustomTemplateDeleteParams {
  templateId: string;
}

export interface CustomTemplatePolishParams {
  prompt: string;
}

export interface CustomTemplatePolishResult {
  polishedPrompt: string;
}

export interface PromptPolishCountResult {
  usedCount: number;
  totalCount: number;
}

export interface TemplateIconItem {
  iconUrl: string;
  objectKey: string;
  /** 是否需要颜色适配（true=纯色图标，深色主题需加 img-theme-bw；false=彩色图标，无需适配） */
  needColorAdapt?: boolean;
}
