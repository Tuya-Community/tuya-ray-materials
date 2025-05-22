import { usePanelConfig } from '@ray-js/panel-sdk';

const usePanelConfigs = (code = 'tyabihr3mn', value: any = false) => {
  return usePanelConfig()?.fun?.[code] ?? value;
};

export default usePanelConfigs;
