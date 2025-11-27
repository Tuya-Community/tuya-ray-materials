import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  darkmode: 'light',
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '#f6f8fa',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#000000',
    navigationBarTextStyle: '#ffffff',
  },
  functionalPages: {
    // 设备详情功能页，若未自定义实现设备详情界面，该项为必填配置，不可删除。
    settings: {
      appid: 'tycryc71qaug8at6yt',
      entryCode: 'entrye0n05idydmmfv',
    },
  },
  webviewRoot: 'node_modules/@ray-js/gyro-map-sdk/dist-app',
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
