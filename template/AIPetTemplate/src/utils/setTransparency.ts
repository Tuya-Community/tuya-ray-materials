import { setNavigationBarColor } from '@ray-js/ray';
import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';

const sysInfo = getCachedSystemInfo();

export const setNavbarTransparency = () => {
  let backgroundColor = '#ffffff';
  if (sysInfo.platform === 'ios') backgroundColor = '#ffffff00';
  else if (sysInfo.platform === 'android') backgroundColor = '#00ffffff';
  if (sysInfo.platform === 'android' && sysInfo.theme === 'dark') {
    return;
  }
  setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor,
    animation: {},
  });
};
