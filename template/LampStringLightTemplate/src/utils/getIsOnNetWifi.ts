import store from '@/redux';

export const getIsOnNetWifi = () => getIsOnNetWork();

// wifi在线，非局域网
export const getIsOnNetWork = async () => {
  return store.getState()?.common?.isOnNet;
};
