import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  entryPagePath: 'pages/home/index',
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '--app-B3',
    navigationBarBackgroundColor: '--app-B3',
    navigationBarTextStyle: '--app-B3-N1',
  },
  functionalPages: {
    // 配置右上角“点点点”设备详情跳转
    settings: {
      appid: 'tycryc71qaug8at6yt',
    },
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
