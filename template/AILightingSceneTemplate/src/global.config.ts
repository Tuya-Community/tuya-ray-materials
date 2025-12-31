import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  entryPagePath: 'pages/auto-generate/index',
  window: {
    backgroundColor: '@bgColor',
    navigationBarBackgroundColor: '@bgColor',
    backgroundColorTop: '@bgColorTop',
    backgroundColorBottom: '@bgColorBottom',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: 'miniprogram',
    backgroundTextStyle: '@bgTxtStyle',
    enablePullDownRefresh: false,
    onReachBottomDistance: 50,
    pageOrientation: 'portrait',
    disableScroll: true,
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
