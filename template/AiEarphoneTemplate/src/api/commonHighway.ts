/**
 * wearableAudio 云能力封装层（仅供 api 模块内部使用）。
 * 底层统一走 @tuya-miniapp/cloud-api；业务代码请继续从 common / customTemplate / share / shop 引入 atop* 接口名。
 */
import {
  updateRecordVisit,
  getConfigByKey,
  getMindmapFooterConfig as sdkGetMindmapFooterConfig,
  getTagList,
  submitFeedback as sdkSubmitFeedback,
  getFeedbackDetails,
  getTagHistory,
  queryShareLink,
  getRecommendTemplateList,
  getTemplateListByCategory,
  polishPrompt,
  getPromptPolishCount,
  createTemplatePrompt as sdkCreateTemplatePrompt,
  updateTemplatePrompt as sdkUpdateTemplatePrompt,
  deleteTemplatePrompt as sdkDeleteTemplatePrompt,
  listTemplateIcons,
  editTranscribeText,
  editSummary,
  getTranslateLangList,
  getAppPopupSwitchConfig,
  getPreference,
  updatePreference,
  getProductLink as sdkGetProductLink,
  getUserStatisticsOverview as sdkGetUserStatisticsOverview,
  getPurchaseOrder as sdkGetPurchaseOrder,
  getAccountDetail as sdkGetAccountDetail,
  getAccountQuota as sdkGetAccountQuota,
  getSubscriptionPackage as sdkGetSubscriptionPackage,
  saveSyncSwitch as sdkSaveSyncSwitch,
  addAudioRecord,
  getShareFileLinkV3,
} from '@tuya-miniapp/cloud-api';
import { requestPromiseWithCache, withRequestErrorToast } from './universal';

import {
  atopGetUrlFromApolloReq,
  atopGetUrlFromApolloRes,
  SummaryTemplateRecommendListRes,
  SummaryTemplateListByCategoryParams,
  SummaryTemplateListByCategoryResult,
  GetFeedbackTagListParams,
  FeedbackTagListByBizType,
  SubmitFeedbackParams,
  GetFeedbackDetailParams,
  FeedbackDetailItem,
  MindConfigResult,
  AtopGetShareLinkDetailRes,
  CustomTemplateCreateParams,
  CustomTemplateCreateResult,
  CustomTemplateUpdateParams,
  CustomTemplateDeleteParams,
  CustomTemplatePolishParams,
  CustomTemplatePolishResult,
  PromptPolishCountResult,
  TemplateIconItem,
  TranslateLangListItem,
  SwitchConfigResult,
  StatisticInfoResult,
  CloudSyncSwitchParams,
} from './interface';

/** =============================== 录音 ========================= */

/**
 * 标记录音已读
 * 仅用于「已读」跃迁：visit 0 → 1、2 → 3
 * 失败 fire-and-forget，调用方无需感知错误
 */
export const updateRecordRead = async (params: {
  recordId: string;
  visit: number;
}): Promise<boolean> => {
  return withRequestErrorToast(updateRecordVisit(params), true).catch(() => {
    return false;
  });
};

/** =============================== 配置 ========================= */

/** 通过 key 获取配置 */
export const getWearableConfig = async (
  params: atopGetUrlFromApolloReq
): Promise<atopGetUrlFromApolloRes> => {
  return withRequestErrorToast(getConfigByKey(params));
};

/** 思维导图底部栏配置 */
export const getMindmapFooterConfig = async (): Promise<MindConfigResult> => {
  return withRequestErrorToast(
    sdkGetMindmapFooterConfig({})
  ) as unknown as Promise<MindConfigResult>;
};

/** =============================== 反馈 ========================= */

/** 反馈标签列表 */
export const getFeedbackTagList = async (
  params: GetFeedbackTagListParams
): Promise<FeedbackTagListByBizType[]> => {
  return withRequestErrorToast(getTagList(params)) as Promise<FeedbackTagListByBizType[]>;
};

/** 提交反馈 */
export const submitFeedback = async (params: SubmitFeedbackParams): Promise<boolean> => {
  return withRequestErrorToast(sdkSubmitFeedback(params));
};

/** 反馈详情 */
export const getFeedbackDetail = async (
  params: GetFeedbackDetailParams
): Promise<FeedbackDetailItem[]> => {
  return withRequestErrorToast(getFeedbackDetails(params)) as Promise<FeedbackDetailItem[]>;
};

/** =============================== 标签 ========================= */

/** 历史标签库 */
export const getAudioTagHistory = async (): Promise<string[]> => {
  return withRequestErrorToast(getTagHistory({}));
};

/** =============================== 分享 ========================= */

/** 分享链接详情（路径为 /detail，非 SAAS /query） */
export const getShareLinkDetail = async (recordId: string): Promise<AtopGetShareLinkDetailRes> => {
  return withRequestErrorToast(
    queryShareLink({ recordId })
  ) as unknown as Promise<AtopGetShareLinkDetailRes>;
};

/** =============================== 总结模板 ========================= */

/** 推荐列表（每分类最多 6 条） */
export const getSummaryTemplateRecommendList =
  async (): Promise<SummaryTemplateRecommendListRes> => {
    return withRequestErrorToast(
      getRecommendTemplateList({})
    ) as Promise<SummaryTemplateRecommendListRes>;
  };

/** 按分类分页列表 */
export const getSummaryTemplateListByCategory = async (
  params: SummaryTemplateListByCategoryParams
): Promise<SummaryTemplateListByCategoryResult> => {
  return withRequestErrorToast(
    getTemplateListByCategory(params)
  ) as Promise<SummaryTemplateListByCategoryResult>;
};

/** 提示词润色 */
export const polishGeneratorPrompt = async (
  params: CustomTemplatePolishParams
): Promise<CustomTemplatePolishResult> => {
  return withRequestErrorToast(polishPrompt(params));
};

/** 今日润色次数 */
export const getGeneratorPromptCount = async (): Promise<PromptPolishCountResult> => {
  return withRequestErrorToast(getPromptPolishCount({}));
};

/** 创建自定义模板 */
export const createTemplatePrompt = async (
  params: CustomTemplateCreateParams
): Promise<CustomTemplateCreateResult> => {
  return withRequestErrorToast(sdkCreateTemplatePrompt(params as any));
};

/** 修改自定义模板 */
export const updateTemplatePrompt = async (params: CustomTemplateUpdateParams): Promise<void> => {
  await withRequestErrorToast(sdkUpdateTemplatePrompt(params as any));
};

/** 删除自定义模板 */
export const deleteTemplatePrompt = async (params: CustomTemplateDeleteParams): Promise<void> => {
  await withRequestErrorToast(sdkDeleteTemplatePrompt(params));
};

/** 模板图标列表 */
export const getTemplateIconList = async (): Promise<TemplateIconItem[]> => {
  return withRequestErrorToast(listTemplateIcons({})) as Promise<TemplateIconItem[]>;
};

/** =============================== 转写 / 总结 ========================= */

export const editAudioContent = async (params: Record<string, any>): Promise<boolean> => {
  return withRequestErrorToast(editTranscribeText(params as any));
};

export const editAudioSummary = async (params: Record<string, any>): Promise<boolean> => {
  return withRequestErrorToast(editSummary(params as any));
};

/** =============================== 配置 ========================= */

export const getTranslateLangListWithCache = (
  source: string,
  opt?: { onUpdate?: (data: TranslateLangListItem[]) => void }
) => {
  return requestPromiseWithCache<TranslateLangListItem[]>(
    '/v1.0/m/wearable/audio/translate/lang/list/query',
    { source },
    () => getTranslateLangList({ source }) as Promise<TranslateLangListItem[]>,
    opt
  );
};

export const getAgentChannel = async (objectId: string): Promise<string> => {
  // 云端可能直接返回纯字符串渠道码（如 aipt_xxx），cloud-api 一律 JSON.parse 会打 console.error
  return withRequestErrorToast(
    new Promise<string>((resolve, reject) => {
      ty.apiRequestByHighway({
        api: '/v1.0/m/wearable/audio/agent/channel',
        method: 'GET',
        data: { objectId },
        success: (d: unknown) => {
          if (typeof d !== 'string') {
            resolve(d == null ? '' : String(d));
            return;
          }
          const trimmed = d.trim();
          const looksLikeJson =
            (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
            (trimmed.startsWith('"') && trimmed.endsWith('"'));
          if (looksLikeJson) {
            try {
              const parsed = JSON.parse(d);
              resolve(typeof parsed === 'string' ? parsed : String(parsed ?? ''));
              return;
            } catch {
              // 非 JSON 时按原字符串返回
            }
          }
          resolve(d);
        },
        fail: reject,
      });
    })
  );
};

export const getPopupSwitchConfig = async (params?: {
  miniapp?: string;
  ownerId?: string;
}): Promise<SwitchConfigResult> => {
  return withRequestErrorToast(
    getAppPopupSwitchConfig(params || {})
  ) as unknown as Promise<SwitchConfigResult>;
};

export const getAudioPreference = async (): Promise<{
  transcribeOptimizeEnabled: boolean;
}> => {
  return withRequestErrorToast(getPreference({})) as Promise<{
    transcribeOptimizeEnabled: boolean;
  }>;
};

export const updateAudioPreference = async (preferences: string): Promise<boolean> => {
  return withRequestErrorToast(updatePreference({ preferences }));
};

/** =============================== 权益 ========================= */

export const getProductLink = async (): Promise<string> => {
  return withRequestErrorToast(sdkGetProductLink({}));
};

export const getUserStatisticsOverview = async (): Promise<StatisticInfoResult> => {
  return withRequestErrorToast(sdkGetUserStatisticsOverview({})) as Promise<StatisticInfoResult>;
};

export const getPurchaseOrder = async (params: {
  ownerId?: string;
  offset?: number;
  limit?: number;
}): Promise<any> => {
  return withRequestErrorToast(sdkGetPurchaseOrder(params));
};

export const getAccountDetail = async (params: { ownerId?: string }): Promise<any> => {
  return withRequestErrorToast(sdkGetAccountDetail(params));
};

export const getAccountQuota = async (params: Record<string, any>): Promise<number> => {
  return withRequestErrorToast(sdkGetAccountQuota(params));
};

export const getSubscriptionPackage = async (): Promise<string[]> => {
  return withRequestErrorToast(sdkGetSubscriptionPackage({}));
};

/** =============================== 同步 / 录音 ========================= */

export const saveSyncSwitch = async (params: CloudSyncSwitchParams): Promise<boolean> => {
  return withRequestErrorToast(sdkSaveSyncSwitch(params));
};

export const saveAudioRecord = async (params: { audioRecordRequest: string }): Promise<boolean> => {
  return withRequestErrorToast(addAudioRecord(params));
};

/** =============================== 分享 ========================= */

export const createSttShareLink = async (params: {
  key: string;
  exportType: string;
  format: string;
  devId?: string;
  contentOption?: string;
  paragraphTime?: boolean;
  speakerLabel?: boolean;
}): Promise<string> => {
  return withRequestErrorToast(getShareFileLinkV3(params as any));
};
