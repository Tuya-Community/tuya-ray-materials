import { PowerMemoryFunctionalData, CustomColor } from '../types';
import { navigateTo } from '@ray-js/ray';

export const LampPowerMemoryFunctionalId = 'LampPowerMemoryFunctional';

/**
 * @name: 存储功能页数据Promise化
 * @desc:
 * @return {*}
 */
export const presetPowerMemoryFunctionalData = (
  url: string,
  data: PowerMemoryFunctionalData
): Promise<boolean> => {
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

/**
 * 清除数据
 */
export const clearPowerMemoryFunctionalData = (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    ty.presetFunctionalData({
      url,
      data: null,
      success: () => resolve(true),
      fail: err => reject(err),
    });
  });
};

/**
 * 跳转至第三方数据同步功能页
 */
export const navigateToPowerMemoryFunctional = (
  url: string,
  data: PowerMemoryFunctionalData = {}
): void => {
  presetPowerMemoryFunctionalData(url, data)
    .then(() => {
      navigateTo({ url, fail: err => console.warn(err) });
    })
    .catch(err => console.warn(err));

  presetPowerMemoryFunctionalData(url.replace('home', 'customColor'), data)
    .then(() => {})
    .catch(err => console.warn(err));
};

export const PowerMemoryFunctionalRef = {
  value: null,
};

export type PowerMemoryFunctionalRes = Partial<CustomColor> & { mode?: number };

/**
 * @name: 注册监听功能页返回数据
 * @desc:
 * @return {*}
 */
export const onPowerMemoryFunctionalChange = (
  func: (res: {
    id: 'LampPowerMemoryFunctional';
    type: 'cancel' | 'save';
    data: PowerMemoryFunctionalRes;
  }) => void
) => {
  PowerMemoryFunctionalRef.value = func;
  ty.device.onSubFunctionDataChange(res => {
    const { id } = res;
    if (id !== LampPowerMemoryFunctionalId) return;
    func(res as any);
  });
};

/**
 * @name: 清除监听功能页返回数据
 * @desc:
 * @return {*}
 */
export const offPowerMemoryFunctionalChange = () => {
  ty.device.offSubFunctionDataChange(PowerMemoryFunctionalRef.value);
};

/**
 * @name: 发送功能页返回数据
 * @desc:
 * @return {*}
 */
export const sendPowerMemoryFunctionalData = (
  type: 'cancel' | 'save',
  data: PowerMemoryFunctionalRes
) => {
  ty.device.dispatchDataResult({
    id: LampPowerMemoryFunctionalId,
    type,
    data: data as any,
  });
};
