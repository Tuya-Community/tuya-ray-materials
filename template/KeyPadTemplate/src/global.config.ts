import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  useCloudTheme: false,
  routers: [
    'tuyaSmart://config_device',
    'tuyaSmart://tysh_family_add_member_rn',
    'tuyaSmart://thingsh_family_add_member_rn',
  ],
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
  },
  functionalPages: {
    // 标准设备详情功能页。
    settings: { appid: 'tycryc71qaug8at6yt', entryCode: 'entrye0n05idydmmfv' },
  },
};

const globalConfig: GlobalConfig = { basename: '' };
export default globalConfig;
