import { useEffect } from 'react';
import store from '@/redux';
import { atopGetSwitchConfig } from '@/api/common';
import { updateUiState } from '@/redux/modules/uiStateSlice';

/**
 * 获取开关配置的 hook
 */
export const useSwitchConfig = () => {
  useEffect(() => {
    const getSwitchConfig = async () => {
      try {
        const res = await atopGetSwitchConfig();
        if (res && typeof res === 'object') {
          store.dispatch(updateUiState({ switchConfig: res }));
        }
      } catch (error) {
        console.warn('atopGetSwitchConfig failed', error);
      }
    };
    getSwitchConfig();
  }, []);
};
