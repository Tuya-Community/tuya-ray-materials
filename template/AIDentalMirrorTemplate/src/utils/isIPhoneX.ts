import { getSystemInfoSync } from '@ray-js/ray';

export const getIsIPhoneX = () => {
  const sysInfo = getSystemInfoSync();
  const isIOS = sysInfo.platform === 'ios';
  const isIPhoneX = isIOS && sysInfo.screenHeight >= 812;

  return isIPhoneX;
};
