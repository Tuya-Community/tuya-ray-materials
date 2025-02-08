import { GlobalConfig } from '@ray-js/types';

export const wechat = {
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: '@ray-js/lamp-bead-strip',
    navigationBarBackgroundColor: '#f2f4f6',
    navigationBarTextStyle: 'black',
  },
};

export const web = {
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: '@ray-js/lamp-bead-strip',
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
  pageWrapper: [],
};

export const tuya = {
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: '@ray-js/lamp-bead-strip',
    navigationBarBackgroundColor: '#f2f4f6',
    navigationBarTextStyle: 'black',
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
