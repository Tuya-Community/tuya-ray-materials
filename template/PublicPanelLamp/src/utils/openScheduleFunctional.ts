import { getCachedLaunchOptions } from '@/api/getCachedLaunchOptions';
import { navigateTo } from '@ray-js/ray';

const { deviceId, groupId } = getCachedLaunchOptions()?.query ?? {};

// 存储功能页数据Promise化
export const presetFunctionalData = (url: string, data: Record<string, any>): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    ty.presetFunctionalData({
      url,
      data,
      success: () => resolve(true),
      fail: err => reject(err),
    });
  });
};

export const openScheduleFunctional = async () => {
  const extraData = {
    rhythmsType: 1,
    cloudTimerCategory: 'category_timer',
    themeConfig: {
      themeType: 'dark',
    },
    normalTimerAdvances: {
      remarks: true,
      notice: true,
    },
  };

  const jumpUrl = `functional://LampScheduleSetFunction/home?deviceId=${deviceId ||
    ''}&groupId=${groupId || ''}`;

  await presetFunctionalData(jumpUrl, extraData);

  navigateTo({
    url: jumpUrl,
    fail: err => console.warn(err),
  });
};
