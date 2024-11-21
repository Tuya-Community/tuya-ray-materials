import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f2f4f6',
    navigationBarTextStyle: 'black',
  },
  routers: ['tuyaSmart://tsod_cycling_navigation', 'tuyaSmart://tsod_additional_unlock_methods'],
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
