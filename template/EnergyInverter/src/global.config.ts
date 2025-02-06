import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f2f4f6',
    navigationBarTextStyle: 'white',
  },
  darkmode: 'light',
  functionalPages: {
    settings: {
      // 若未自定义实现设备详情界面，该项为必填配置，不可删除。
      appid: 'tycryc71qaug8at6yt',
      entryCode: 'entrye0n05idydmmfv', // 必填，IDE 调试的时候优先使用
    },
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
