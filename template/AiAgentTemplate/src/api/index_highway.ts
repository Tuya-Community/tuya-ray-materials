import { utils } from '@ray-js/panel-sdk';
import { apiRequestByAtop, getDevInfo } from '@ray-js/ray';
import {
  getAI2AgentConfigLangList,
  getAI2AgentConfigLlmList,
  addAI2AgentRoles,
  updateAI2AgentRoles,
  getAI2AgentRolesDetail,
  deleteAI2AgentRoles,
  getAI2AgentRoles,
  bindAI2AgentRoles,
  restoreAI2AgentRolesSpeed,
  getAI2AgentRolesTemplatesDetail,
  getAI2AgentRolesTemplates,
  getAI2AgentEndpointHistory,
  clearAI2AgentEndpointHistory,
  deleteAI2AgentEndpointHistory,
  clearAI2AgentEndpointContext,
  getAI2TimbreMarketList,
  getAI2TimbreCloneList,
  addAI2TimbreClone,
  resetAI2TimbreClone,
  renameAI2TimbreClone,
  delAI2TimbreClone,
  validateAI2TimbreClone,
  getAI2TimbreCloneSupport,
  generateAI2TimbreCloneSample,
  getAI2AgentAvatars,
} from '@ray-js/ray';

import dayjs from 'dayjs';
import { GetHistoryParams } from '@/types';

const errStyle = 'background: red; color: #fff;';

export const api = <T>(a: string, postData: Record<string, any>, v = '1.0'): Promise<T> => {
  return new Promise((resolve, reject) => {
    const params = {
      api: a,
      postData: postData,
      version: v,
    };
    apiRequestByAtop({
      ...params,
      success: d => {
        const data = typeof d === 'string' ? utils.parseJSON(d) : d;
        resolve(data as T);
      },
      fail: err => {
        const e = typeof err === 'string' ? (utils.parseJSON(err) as typeof err) : err;
        console.log(`API Failed: %c${a}%o`, errStyle, e.errorMsg || e);
        reject(err);
      },
    });
  });
};

export const getAgentInfo = async (roleId: string) => {
  try {
    // getAIAgentDetail
    const response = await getAI2AgentRolesDetail({
      devId: getDevInfo().devId,
      roleId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getDialogHistoryList = async (params: GetHistoryParams) => {
  try {
    // getAIAgentHistory
    const response = await getAI2AgentEndpointHistory({
      devId: getDevInfo().devId,
      roleId: params.roleId,
      pageNo: params.pageNo,
      pageSize: params.pageSize,
      startTime: dayjs().subtract(3, 'months').format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const clearingContext = async (endpointAgentId: number) => {
  try {
    // deleteAIAgentContext
    const response = await clearAI2AgentEndpointContext({
      devId: getDevInfo().devId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const clearingHistoryRecord = async (roleId: string) => {
  try {
    // deleteAIAgentHistory
    const response = await clearAI2AgentEndpointHistory({
      devId: getDevInfo().devId,
      // endpointAgentId,
      roleId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteCloneVoice = async (voiceId: string) => {
  try {
    // deleteAITimbreClone
    const response = await delAI2TimbreClone({
      voiceId,
      devId: getDevInfo().devId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const renameCloneVoice = async (voiceId: string, nameText: string) => {
  try {
    // renameAITimbreClone
    const response = await renameAI2TimbreClone({
      voiceId,
      name: nameText,
      devId: getDevInfo().devId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

// 创建克隆音色
export const createCloneVoice = async (params: {
  lang: string;
  voiceUrl: string;
  text: string;
}) => {
  try {
    // addAITimbreClone
    const response = await addAI2TimbreClone({
      devId: getDevInfo().devId,
      ...params,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

// 重置克隆音色
export const resetCloneVoice = async (params: {
  voiceId: string;
  lang: string;
  voiceUrl: string;
  text: string;
}) => {
  try {
    // updateAITimbreClone
    const response = await resetAI2TimbreClone({
      devId: getDevInfo().devId,
      ...params,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const aSRCloneValidate = async ({ text, voiceText }) => {
  try {
    // updateAITimbreClone
    const response = await validateAI2TimbreClone({
      devId: getDevInfo().devId,
      voiceText,
      text,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getAgentLanguages = async () => {
  try {
    // getAgentLanguageConfig
    const response = await getAI2AgentConfigLangList({
      devId: getDevInfo().devId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getAgentModels = async () => {
  try {
    // getAgentModelConfig
    const response = await getAI2AgentConfigLlmList({
      devId: getDevInfo().devId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const clearAgentHistoryMessage = async (params: any) => {
  try {
    // deleteAIAgentHistoryMessage
    const response = await deleteAI2AgentEndpointHistory({
      devId: getDevInfo().devId,
      // endpointAgentId,
      ...params,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getAIAgentRoles = async () => {
  try {
    // getAgentRoles
    const response = await getAI2AgentRoles({
      devId: getDevInfo().devId,
      pageNo: 1,
      pageSize: 10,
      panelCode: 'ai_platform',
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getAIAgentRoleDetail = async (roleId: string) => {
  try {
    // getAgentRolesDetail
    const response = await getAI2AgentRolesDetail({
      devId: getDevInfo().devId,
      roleId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const bindAIAgentRoles = async (roleId: string) => {
  try {
    // bindAgentRoles
    const response = await bindAI2AgentRoles({
      devId: getDevInfo().devId,
      roleId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAIAgentRoles = async (roleId: string) => {
  try {
    // deleteAgentRoles
    const response = await deleteAI2AgentRoles({
      devId: getDevInfo().devId,
      roleId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

// 头像
export const getAIAvatars = async () => {
  try {
    // getAgentAvatars
    const response = await getAI2AgentAvatars({
      devId: getDevInfo().devId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createRole = async (params: any) => {
  try {
    // postCreateAgentRole
    const response = await addAI2AgentRoles({
      devId: getDevInfo().devId,
      ...params,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const checkClonePermission = async () => {
  try {
    // getCloneSupport
    const response = await getAI2TimbreCloneSupport({
      devId: getDevInfo().devId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getStandardVoiceList = async (params: any) => {
  try {
    // getMarketList
    const response = await getAI2TimbreMarketList({
      devId: getDevInfo().devId,
      pageNo: params.pageNo,
      pageSize: params.pageSize,
      tag: '',
      keyWord: params.keyWord,
      lang: params.lang,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getCloneVoiceList = async (params: any) => {
  try {
    // getCloneList
    const response = await getAI2TimbreCloneList({ devId: getDevInfo().devId, ...params });

    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getAIAgentRolesTemplateList = async () => {
  try {
    // getAgentRolesTemplates
    const response = await getAI2AgentRolesTemplates({
      devId: getDevInfo().devId,
      panelCode: 'ai_platform',
    });

    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getAIAgentRolesTemplatesDetail = async (roleId: string) => {
  try {
    // getAgentRolesTemplatesDetail
    const response = await getAI2AgentRolesTemplatesDetail({ devId: getDevInfo().devId, roleId });

    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateRole = async (params: any) => {
  try {
    // postUpdateAgentRole
    const response = await updateAI2AgentRoles({
      devId: getDevInfo().devId,
      ...params,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const localResetToDefaultVoice = async (params: any) => {
  try {
    // resetToDefaultVoice
    const response = await restoreAI2AgentRolesSpeed({
      devId: getDevInfo().devId,
      ...params,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const localGetCloneRadioSource = async (params: any) => {
  try {
    // apiGetCloneRadioSource
    const response = await generateAI2TimbreCloneSample({ devId: getDevInfo().devId, ...params });

    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};
