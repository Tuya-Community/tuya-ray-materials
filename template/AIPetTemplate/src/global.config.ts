import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  themeLocation: 'theme.json',
  // darkmode: false,
  window: {
    backgroundColor: '#fff9ef',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#fff9ef',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
    custom: true,
    disableScroll: true,
    // app<5.10配置右上角“点点点”设备详情跳转
    // app<5.10 Configuring "Dot Dot" in the upper right corner Skip device details
    systemMenus: [
      {
        key: 'system_setting',
        text: "@I18n.t('ipc_set_page_title')",
        isShow: true,
      },
    ],
  },
  functionalPages: {
    settings: {
      // 这个小程序id写死不需要更改！！！
      // This small program id write dead do not need to change!!
      appid: 'tycryc71qaug8at6yt',
    },
  },
  routers: ['camera_playback_panel', 'ipc_album_panel'],
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
