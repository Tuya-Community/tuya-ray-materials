import { getCachedLaunchOptions } from '@/api/getCachedLaunchOptions';
import { navigateTo } from '@ray-js/ray';

const { deviceId, groupId } = getCachedLaunchOptions()?.query ?? {};

/**
 * @name: 跳转情景酷玩功能页
 * @desc:
 * @param {boolean} supportSceneData 是否是全彩
 * @return {*}
 */
export const openPlayCoolFunctional = () => {
  // 进入幻彩情景功能页
  const url = `functional://rayPlayCoolFunctional/home?deviceId=${deviceId ||
    ''}&groupId=${groupId || ''}&type=C`;
  navigateTo({ url, fail: err => console.warn(err) });
};
