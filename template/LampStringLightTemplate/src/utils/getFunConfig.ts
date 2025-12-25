import { camelize } from '@ray-js/panel-sdk/lib/utils';

export const getFunConfig = devInfo => {
  const funConfig = {} as any;
  if (!devInfo) return {};
  if (!devInfo.panelConfig) return {};
  const { fun } = devInfo.panelConfig;
  if (!fun) return {};
  // eslint-disable-next-line no-restricted-syntax
  for (const i in fun) {
    if (Object.prototype.hasOwnProperty.call(fun, i)) {
      const key = camelize(`panel_fun_${i}`);
      funConfig[key] = fun[i];
    }
  }
  return funConfig;
};
