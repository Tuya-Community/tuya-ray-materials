import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  window: {
    backgroundColor: '#f2f4f6',
    navigationBarTitleText: 'Ray Template',
    navigationBarBackgroundColor: '#ff592a',
  },
  usingPlugins: ['rjs://echarts'],
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
