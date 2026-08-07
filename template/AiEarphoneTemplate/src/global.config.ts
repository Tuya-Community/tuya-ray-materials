import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '@bgColor',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    navigationStyle: 'custom',
    custom: true,
  },
  webviewRoot: 'webview',
  usingPlugins: ['rjs://@tuya-miniapp/rjs-markmap'],
  preloadRule: {
    'pages/home/index': {
      network: 'all',
      packages: ['pkgEntry'],
    },
    'pages/detail/index': {
      network: 'all',
      packages: ['pkgTemplate'],
    },
  },
  // 设备面板：系统设置页（未自定义设备详情时必填；一般为平台公共功能页，通常无需修改）
  functionalPages: {
    settings: {
      appid: 'tycryc71qaug8at6yt',
      entryCode: 'entrye0n05idydmmfv',
    },
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
