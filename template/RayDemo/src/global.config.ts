import { GlobalConfig } from "@ray-js/types-next";

// 导出 tuya 平台特定配置，包含主题配置
export const tuya = {
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '@bgColor',
    backgroundTextStyle: '@bgTxtStyle',
    backgroundColorTop: '@bgColorTop',
    backgroundColorBottom: '@bgColorBottom',
    navigationBarTitleText: "@I18n.t('appTitle')",
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
  },
};

const globalConfig: GlobalConfig = {};

export default tuya;
