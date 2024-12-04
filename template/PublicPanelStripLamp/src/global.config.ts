import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  window: {
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black',
  },
  functionalPages: {
    // 定时倒计时功能页
    rayScheduleFunctional: {
      // tyjks565yccrej3xvo 为功能页的id
      appid: 'tyjks565yccrej3xvo',
    },
    rayStripClipFunctional: {
      // tyj0zkwgqubepk3r1h 为功能页的id
      appid: 'tyj0zkwgqubepk3r1h',
    },
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
