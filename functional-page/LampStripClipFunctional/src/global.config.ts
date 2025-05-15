import { GlobalConfig } from '@ray-js/types';

export const wechat = {
  window: {
    backgroundColor: '#000',
    navigationBarBackgroundColor: '#000',
    navigationBarTitleText: '灯带裁剪功能页',
  },
};

export const tuya = {
  themeLocation: 'theme.json',
  navigationBarTitleText: '灯带裁剪功能页',
  functionalPages: {
    rayStripClipFunctional: {
      appid: 'tyj0zkwgqubepk3r1h',
    },
  },
  window: {
    backgroundColor: '#000',
    navigationBarBackgroundColor: '#000',
  },
};

export const web = {
  window: {
    backgroundColor: '#000',
    navigationBarBackgroundColor: '#000',
    navigationBarTitleText: '灯带裁剪功能页',
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
