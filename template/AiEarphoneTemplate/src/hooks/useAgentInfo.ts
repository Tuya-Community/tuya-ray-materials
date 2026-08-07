import { useAsyncEffect } from 'ahooks';
import store from '@/redux';
import { updateAgentSync } from '@/redux/modules/agentSlice';
import { atopGetAgentInfo } from '@/api/common';

/**
 * 获取Agent信息的 hook
 */
export const useAgentInfo = () => {
  useAsyncEffect(async () => {
    const res = await atopGetAgentInfo();
    store.dispatch(updateAgentSync({ agentId: res || '' }));
  }, []);
};
