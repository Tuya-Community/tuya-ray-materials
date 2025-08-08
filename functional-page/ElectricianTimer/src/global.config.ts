import { GlobalConfig } from '@ray-js/types';

export const wechat = {
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: 'Ray Template',
    navigationBarBackgroundColor: '#ff592a',
  },
};

export const tuya = {
  themeLocation: 'theme.json',
  window: {
    // 注意，这里无必要请不要做调整，目前功能页的默认配置使用的是此配置
    navigationBarBackgroundColor: '--app-B1',
    navigationBarTextStyle: '--app-B3-N1',
    backgroundColor: '--app-B1',
    backgroundTextStyle: '--app-B3-N1',
    backgroundColorTop: '--app-B1',
    backgroundColorBottom: '--app-B1',
    navigationBarTitleText: 'MiniApp',
    enablePullDownRefresh: false,
    onReachBottomDistance: 50,
    pageOrientation: 'portrait',
  },
  functionalPages: {
    ElectricianTimer: {
      appid: 'typtepohxfeukudmyi',
    },
  },
};

export const web = {
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: 'Ray Web App',
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
