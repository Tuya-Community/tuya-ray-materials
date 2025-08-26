import { GlobalConfig } from '@ray-js/types';

export const wechat = {
  window: {
    backgroundColor: '#0b0909',
    navigationBarBackgroundColor: '#0b0909',
    navigationBarTitleText: 'Ray Template',
  },
};

export const tuya = {
  themeLocation: 'theme.json',
  functionalPages: {
    LampNoDisturbFunctional: {
      appid: 'typsxgb7vfl1unmkbt',
    },
  },
  window: {
    backgroundColor: '#0b0909',
    navigationBarBackgroundColor: '#0b0909',
  },
};

export const web = {
  window: {
    backgroundColor: '#0b0909',
    navigationBarBackgroundColor: '#0b0909',
    navigationBarTitleText: 'Ray Web App',
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
