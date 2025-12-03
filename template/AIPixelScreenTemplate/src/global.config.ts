import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  themeLocation: 'theme.json',
  darkmode: 'dark',
  window: {
    backgroundColor: '#080620',
    backgroundColorBottom: '#080620',
    backgroundColorTop: '#080620',
    navigationBarBackgroundColor: '#080620',
    navigationBarTextStyle: 'white',
    backgroundTextStyle: 'light',
    navigationBarTitleText: '',
    disableScroll: true,
    hideMenuButton: true,
  },
  functionalPages: {
    settings: {
      appid: 'tycryc71qaug8at6yt',
      entryCode: 'entrye0n05idydmmfv', // 必填，IDE 调试的时候优先使用
    },
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
