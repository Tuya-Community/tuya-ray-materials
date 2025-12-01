import { GlobalConfig } from '@ray-js/types';

export const thing = {
  window: {
    backgroundColor: '#e3eef6',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f2f4f6',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
    custom: true,
  },
  functionalPages: {
    // 若未自定义实现设备详情界面，该项为必填配置，不可删除。
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
