import { getAssetHostname } from '@ray-js/ray';
import {
  updateRecordRead,
  getWearableConfig,
  getSummaryTemplateRecommendList,
  getSummaryTemplateListByCategory,
  getFeedbackTagList,
  submitFeedback,
  getFeedbackDetail,
  getMindmapFooterConfig,
  getAudioTagHistory,
  editAudioContent,
  editAudioSummary,
  getTranslateLangListWithCache,
  getAgentChannel,
  getPopupSwitchConfig,
  getAudioPreference,
  updateAudioPreference,
  getProductLink as highwayGetProductLink,
  getUserStatisticsOverview,
  saveSyncSwitch,
  saveAudioRecord,
} from './commonHighway';
import {
  CloudSyncSwitchParams,
  StatisticInfoResult,
  SwitchConfigResult,
  TranslateLangListItem,
  atopGetUrlFromApolloReq,
  SummaryTemplateListByCategoryParams,
  GetFeedbackTagListParams,
  SubmitFeedbackParams,
  GetFeedbackDetailParams,
} from './interface';
import { MINI_PROGRAM_ID } from '@/constant';

export const atopGetImageHost = () => {
  return getAssetHostname();
};

/** 转写内容编辑（@tuya-miniapp/cloud-api） */
export const atopAudioContentEdit = postData => {
  return editAudioContent(postData);
};

/** 总结内容编辑（@tuya-miniapp/cloud-api） */
export const atopAudioSummaryEdit = postData => {
  return editAudioSummary(postData);
};

/** 获取带源语言的语言列表（@tuya-miniapp/cloud-api，保留缓存） */
export const atopGetTranslateLangListWithCache = (source, opt) => {
  return getTranslateLangListWithCache(source, opt) as Promise<TranslateLangListItem[]>;
};

/** Agent 渠道编码（@tuya-miniapp/cloud-api） */
export const atopGetAgentInfo = () => {
  return getAgentChannel(MINI_PROGRAM_ID);
};

/** 获取商品地址（@tuya-miniapp/cloud-api） */
export const getProductLink = async (): Promise<string> => {
  return highwayGetProductLink();
};

/** 获取统计信息（@tuya-miniapp/cloud-api） */
export const getUserStatisticInfo = async (): Promise<StatisticInfoResult> => {
  return getUserStatisticsOverview();
};

/** 开启/关闭云同步（@tuya-miniapp/cloud-api） */
export const toggleCloudSync = async (params: CloudSyncSwitchParams) => {
  return saveSyncSwitch(params);
};

/** 新增/编辑文件信息（@tuya-miniapp/cloud-api） */
export const atopUpdateFileInfo = async (params: { audioRecordRequest: string }) => {
  return saveAudioRecord(params);
};

/**
 * 标记录音已读（@tuya-miniapp/cloud-api）
 * 仅用于「已读」跃迁场景：visit 0 → 1（未读 → 已读）、2 → 3（已转录未读 → 已转录已读）
 * 失败采用 fire-and-forget，调用方无需感知错误
 */
export const atopUpdateRecordRead = async (params: { recordId: string; visit: number }) => {
  return updateRecordRead(params);
};

/** 获取开关配置（@tuya-miniapp/cloud-api） */
export const atopGetSwitchConfig = () => {
  return getPopupSwitchConfig({ miniapp: 'note' }) as Promise<SwitchConfigResult>;
};

/** 涂鸦云获取 apollo 链接（@tuya-miniapp/cloud-api） */
export const atopGetUrlFromApollo = async (params: atopGetUrlFromApolloReq) => {
  return getWearableConfig(params);
};

/** 总结模版推荐列表（@tuya-miniapp/cloud-api） */
export const atopGetSummaryTemplateRecommendList = async () => {
  return getSummaryTemplateRecommendList();
};

/** 按分类获取总结模版列表（@tuya-miniapp/cloud-api） */
export const atopGetSummaryTemplateListByCategory = async (
  params: SummaryTemplateListByCategoryParams
) => {
  return getSummaryTemplateListByCategory(params);
};

/** 获取反馈标签列表（@tuya-miniapp/cloud-api） */
export const atopGetFeedbackTagList = async (params: GetFeedbackTagListParams) => {
  return getFeedbackTagList(params);
};

/** 提交反馈（@tuya-miniapp/cloud-api） */
export const atopSubmitFeedback = async (params: SubmitFeedbackParams) => {
  return submitFeedback(params);
};

/** 获取反馈详情（@tuya-miniapp/cloud-api） */
export const atopGetFeedbackDetail = async (params: GetFeedbackDetailParams) => {
  return getFeedbackDetail(params);
};

/** 获取思维导图底部品牌位信息（@tuya-miniapp/cloud-api） */
export const atopGetMindConfig = async () => {
  return getMindmapFooterConfig();
};

/** 历史添加过的标签列表（@tuya-miniapp/cloud-api） */
export const atopGetAudioTagHistory = () => {
  return getAudioTagHistory();
};

/** 获取用户偏好配置（@tuya-miniapp/cloud-api） */
export const atopGetUserPreference = () => {
  return getAudioPreference();
};

/** 更新用户偏好配置（@tuya-miniapp/cloud-api） */
export const atopUpdateUserPreference = (preferences: string) => {
  return updateAudioPreference(preferences);
};
