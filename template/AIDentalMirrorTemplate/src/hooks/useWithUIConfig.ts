import { useEffect } from 'react';

import { devices } from '@/devices';
import { useAppDispatch } from '@/redux';
import { commonSlice } from '@/redux/modules/common';
import { ThemeConfigItem, themeSlice } from '@/redux/modules/themeSlice';
import {
  GetSmartDeviceModelDevInfo,
  GetSmartGroupModelGroupInfo,
  usePanelConfig,
} from '@ray-js/panel-sdk';
import { Config } from '@ray-js/panel-sdk/lib/hooks/usePanelConfig/type';

export interface UseApplyConfigOps {
  // 这里返回的对象会塞入 commonSlice.config.
  onInit: (devInfo: GetSmartDeviceModelDevInfo<any> | GetSmartGroupModelGroupInfo<any>) => any;
  // 这里返回的对象会塞入 themeSlice.config.
  onApplyConfig: (
    config: Config,
    devInfo: GetSmartDeviceModelDevInfo<any> | GetSmartGroupModelGroupInfo<any>
  ) => ThemeConfigItem;
}

export const useWithUIConfig = ({ onApplyConfig, onInit }: UseApplyConfigOps) => {
  const dispatch = useAppDispatch();
  const devInfo = devices.common.getDevInfo();

  const config = usePanelConfig();

  useEffect(() => {
    if (devInfo) {
      // withConfig
      dispatch(commonSlice.actions.updateConfig(onInit(devInfo)));

      if (config && config?.initialized) {
        // withUiConfig
        dispatch(themeSlice.actions.updateThemeConfig(onApplyConfig(config, devInfo)));
      }
    }
  }, [config, devInfo]);

  return config?.initialized;
};
