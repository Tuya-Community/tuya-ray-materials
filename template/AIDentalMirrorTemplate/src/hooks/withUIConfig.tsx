import React from 'react';
import { getUIValue } from '@/utils/getUIValue';
import { useWithUIConfig } from './useWithUIConfig';

export interface WithUIConfigOps {
  waitUiConfigFetch?: boolean;
  FetchLoadingElement?: () => React.JSX.Element;
}

export const withUIConfig = (Component: () => React.JSX.Element, ops?: WithUIConfigOps) => {
  const HookWrapComponent: React.FC = () => {
    // 获取 UIConfig
    const initialized = useWithUIConfig({
      onInit(config) {
        return {
          schema: config.schema,
        };
      },
      onApplyConfig(config) {
        const isDefault = config.iot?.theme === 'default';
        const themeColor = getUIValue(config.iot, 'themeColor');
        const themeImage = getUIValue(config.iot, 'themeImage');
        const fontColor = isDefault ? getUIValue(config.iot, 'fontColor') : '#000000';
        const background = getUIValue(config.iot, 'background');
        const backgroundColor = isDefault ? 'rgba(255,255,255,0.1)' : '#F5F5F5';

        const globalTheme = {
          isDefaultTheme: isDefault,
          brand: themeColor,
          backgroundColor,
          themeColor,
          background,
          fontColor,
          iconColor: isDefault ? '#fff' : '#333',
          text: {
            light: fontColor,
            dark: fontColor,
          },
        };

        return {
          isDefaultTheme: isDefault,
          themeColor,
          fontColor,
          themeImage,
          type: config.iot?.theme === 'default' ? 'dark' : 'light',
          global: globalTheme,
        };
      },
    });

    // 请求ui配置是否阻塞渲染
    const { waitUiConfigFetch = true, FetchLoadingElement = () => <></> } = ops || {};

    if (waitUiConfigFetch) {
      if (!initialized) return <FetchLoadingElement />;
    }

    return <Component />;
  };

  return HookWrapComponent;
};
