/*
 * @Author: mjh
 * @Date: 2025-03-25 17:28:56
 * @LastEditors: mjh
 * @LastEditTime: 2025-03-25 17:30:44
 * @Description:
 */
import { getCachedLaunchOptions } from '@/api/getCachedLaunchOptions';
import { navigateTo } from '@ray-js/ray';
import { presetFunctionalData } from './openPlayCoolFunctional';

const { deviceId, groupId } = getCachedLaunchOptions()?.query ?? {};

/**
 * @name: 跳转情景酷玩功能页
 * @desc:
 * @param {boolean} supportSceneData 是否是全彩
 * @return {*}
 */
export const openPowerMemoryFunctional = async (collectColors: any[], collectWhites: any[]) => {
  const jumpUrl = `functional://LampPowerMemoryFunctional/home?deviceId=${deviceId ||
    ''}&groupId=${groupId || ''}`;
  // 预设数据
  const data = {
    collectColors,
    collectWhites,
  };
  // 添加功能页预设数据
  await presetFunctionalData(jumpUrl, data);

  // 跳转
  navigateTo({ url: jumpUrl, fail: err => console.warn(err) });
};
