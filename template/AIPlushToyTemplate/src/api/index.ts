import { utils } from '@ray-js/panel-sdk';
import {
  addAITimbreClone,
  apiRequestByAtop,
  bindAIAgentEndpoint,
  deleteAIAgentContext,
  deleteAIAgentHistory,
  deleteAITimbreClone,
  getAIAgentDetail,
  getAIAgentHistory,
  getAIAgentList as rayGetAIAgentList,
  getAIAgentMarketList,
  getAITimbreCloneList,
  getAITimbreCloneStatus,
  getAITimbreMarketList,
  getDevInfo,
  renameAITimbreClone,
  unbindAIAgent,
  updateAIAgent,
  updateAITimbreClone,
} from '@ray-js/ray';
import dayjs from 'dayjs';
import {
  GetAIAgentListParams,
  GetHistoryParams,
  GetListAtopParams,
  GetStandardVoiceParams,
} from '@/types';
import { getDevId } from '@/utils';

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

export const getBoundAgents = async () => {
  try {
    const response = await rayGetAIAgentList({
      devId: getDevId(),
      pageNo: 1,
      pageSize: 10,
      isIncludeWakeWord: true,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUnboundAgent = async (params: GetListAtopParams) => {
  try {
    const response = await rayGetAIAgentList({
      devId: getDevInfo().devId,
      pageNo: params.pageNo,
      pageSize: params.pageSize,
      isIncludeWakeWord: false,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * 添加端点智能体
 */
export const addAgentEndpoint = (data: { devId: string; agentId: number; wakeWord?: string }) => {
  return bindAIAgentEndpoint(data);
};

/**
 * 获取智能体市场分页列表
 */
export const getAIAgentList = async (data: GetAIAgentListParams) => {
  const res = await getAIAgentMarketList({ params: data });
  return {
    list: res.datas.map(item => ({ ...item, id: item.agentId })),
    totalPage: res.totalCount,
  };
};

export const getAgentInfo = async (endpointAgentId: number) => {
  try {
    const response = await getAIAgentDetail({
      devId: getDevInfo().devId,
      endpointAgentId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getDialogHistoryList = async (params: GetHistoryParams) => {
  try {
    const response = await getAIAgentHistory({
      devId: getDevInfo().devId,
      endpointAgentId: params.endpointAgentId,
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
    const response = await deleteAIAgentContext({
      devId: getDevInfo().devId,
      endpointAgentId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const clearingHistoryRecord = async (endpointAgentId: number) => {
  try {
    const response = await deleteAIAgentHistory({
      devId: getDevInfo().devId,
      endpointAgentId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteCloneVoice = async (voiceId: string) => {
  try {
    const response = await deleteAITimbreClone({
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
    const response = await renameAITimbreClone({
      voiceId,
      name: nameText,
      devId: getDevInfo().devId,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const editAgentInfo = async (params: any) => {
  try {
    const response = await updateAIAgent({
      devId: getDevInfo().devId,
      ...params,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const unbindingAgent = async (endpointAgentId: number) => {
  try {
    const response = await unbindAIAgent({
      devId: getDevInfo().devId,
      endpointAgentId,
    });

    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getCloneVoiceList = async () => {
  try {
    const response = await getAITimbreCloneList({ devId: getDevInfo().devId });

    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getStandardVoiceList = async (params: GetStandardVoiceParams) => {
  try {
    const response = await getAITimbreMarketList({
      devId: getDevInfo().devId,
      pageNo: params.pageNo,
      pageSize: params.pageSize,
      agentId: params.agentId,
      tag: params.tag,
      keyWord: params.keyWord,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

// 查询更新克隆音色状态
export const checkCloneStatus = async (voiceId: string) => {
  try {
    const response = await getAITimbreCloneStatus({
      devId: getDevInfo().devId,
      voiceId,
    });

    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

// 创建克隆音色
export const createCloneVoice = async (lang: string, voiceUrl: string, text: string) => {
  try {
    const response = await addAITimbreClone({
      devId: getDevInfo().devId,
      lang,
      voiceUrl,
      text,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

// 重置克隆音色
export const resetCloneVoice = async (
  voiceId: string,
  lang: string,
  voiceUrl: string,
  text: string
) => {
  try {
    const response = await updateAITimbreClone({
      devId: getDevInfo().devId,
      voiceId,
      lang,
      voiceUrl,
      text,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};
