import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  themeLocation: 'theme.json',
  disableCache: true, // 多设备操作时，数据同步不及时
  window: {
    backgroundColor: '#000000',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#000000',
    navigationBarTextStyle: '#fff',
  },
  functionalPages: {
    rayStripClipFunctional: {
      appid: 'tyj0zkwgqubepk3r1h',
    },
    rayPlayCoolFunctional: {
      appid: 'tyg0szxsm3vog8nf6n',
    },
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
