import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f2f4f6',
    navigationBarTextStyle: 'black',
  },
  functionalPages: {
    settings: {
      appid: 'tycryc71qaug8at6yt',
      entryCode: 'entrye0n05idydmmfv',
    },
  },
  routers: ['tuyaSmart://tsod_cycling_navigation', 'tuyaSmart://tsod_additional_unlock_methods'],
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
