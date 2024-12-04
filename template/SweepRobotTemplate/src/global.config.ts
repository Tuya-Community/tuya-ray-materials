import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f2f4f6',
    navigationBarTextStyle: 'black',
  },
  webviewRoot: 'webview',
  functionalPages: {
    settings: {
      // 这个小程序id写死不需要更改！！！
      // This applet ID is hard-coded and does not need to be changed!!!
      appid: 'tycryc71qaug8at6yt',
    },
  },
  routers: ['camera_playback_panel', 'ipc_album_panel'],
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
