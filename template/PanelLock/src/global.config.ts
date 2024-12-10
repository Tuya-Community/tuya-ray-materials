import { GlobalConfig } from '@ray-js/types';

export const wechat = {
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: 'Ray 小程序示例',
    navigationBarBackgroundColor: '#f2f4f6',
    navigationBarTextStyle: 'black',
  },
};

export const web = {
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: 'Ray Web App',
  },
};

export const native = {
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black',
    backgroundColorTop: 'red',
    navigationStyle: 'custom',
  },
  dependencies: {
    BaseKit: '3.0.0',
    DeviceKit: '3.0.0',
    MiniKit: '3.0.0',
    BizKit: '3.0.1',
  },
};

export const tuya = {
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f2f4f6',
    navigationBarTextStyle: 'black',
  },
  dependencies: {
    BaseKit: '3.0.0',
    DeviceKit: '3.0.0',
    MiniKit: '3.0.0',
    BizKit: '3.0.1',
  },
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
