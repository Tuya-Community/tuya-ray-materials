import {
  createTemplatePrompt,
  updateTemplatePrompt,
  deleteTemplatePrompt,
  polishGeneratorPrompt,
  getGeneratorPromptCount,
  getTemplateIconList,
} from './commonHighway';
import {
  CustomTemplateDeleteParams,
  CustomTemplatePolishParams,
  CustomTemplatePolishResult,
  PromptPolishCountResult,
  TemplateIconItem,
  CustomTemplateCreateParams,
  CustomTemplateCreateResult,
  CustomTemplateUpdateParams,
} from './interface';

/** 创建自定义模板（@tuya-miniapp/cloud-api） */
export const atopCreateCustomTemplate = (params: CustomTemplateCreateParams) => {
  return createTemplatePrompt(params) as Promise<CustomTemplateCreateResult>;
};

/** 修改自定义模板（@tuya-miniapp/cloud-api） */
export const atopUpdateCustomTemplate = (params: CustomTemplateUpdateParams) => {
  return updateTemplatePrompt(params);
};

/** 删除自定义模板（@tuya-miniapp/cloud-api） */
export const atopDeleteCustomTemplate = (params: CustomTemplateDeleteParams) => {
  return deleteTemplatePrompt(params);
};

/** 提示词润色（@tuya-miniapp/cloud-api） */
export const atopPolishCustomTemplatePrompt = (params: CustomTemplatePolishParams) => {
  return polishGeneratorPrompt(params) as Promise<CustomTemplatePolishResult>;
};

/** 今日润色次数（@tuya-miniapp/cloud-api） */
export const atopGetPromptPolishCount = () => {
  return getGeneratorPromptCount() as Promise<PromptPolishCountResult>;
};

/** 模板图标列表（@tuya-miniapp/cloud-api） */
export const atopGetTemplateIconList = () => {
  return getTemplateIconList() as Promise<TemplateIconItem[]>;
};
