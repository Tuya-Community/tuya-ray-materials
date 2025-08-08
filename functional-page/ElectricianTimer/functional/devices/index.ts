/* eslint-disable prefer-destructuring */
import { SmartDeviceModel, SmartGroupModel } from '@ray-js/panel-sdk';
import { createDpKit } from '@ray-js/panel-sdk/lib/sdm/interceptors/dp-kit';
import { protocols } from '@/devices/protocols';
// @ts-expect-error
import { SmartDeviceSchema, SmartDevice } from '@/typings/sdm';
import { getCachedLaunchOptions } from '@/api/getCachedLaunchOptions';

export const dpKit = createDpKit<SmartDeviceSchema>({ protocols });

/**
 * SmartDevice 定义来自于 typings/sdm.d.ts，非 TypeScript 开发者可忽略
 * The SmartDevice definition comes from typings/sdm.d.ts and can be ignored by non-TypeScript developers
 */
export const devices = {} as Record<string, SmartDeviceModel<SmartDeviceSchema>>;

interface Options {
  deviceId?: string;
  groupId?: string;
}

/**
 * 初始化设备并返回设备实例对象
 */
export const initDevice: (options: Options) => [SmartDevice, typeof devices] = (options: Options) => {
  let deviceId: string;
  let groupId: string;

  /**
   * 如果功能页的 query 中存在 deviceId 或 groupId，
   * 则使用 query 中的值去初始化智能设备模型
   */
  if (options.deviceId || options.groupId) {
    deviceId = options.deviceId;
    groupId = options.groupId;
  } else {
    /**
     * 如果功能页的 query 中不存在 deviceId 或 groupId，
     * 那么调用 getLaunchOptions 去获取主小程序的 query，
     * 如果存在则使用主小程序的 query 去初始化智能设备模型
     */
    const query = getCachedLaunchOptions()?.query ?? {};
    deviceId = query.deviceId;
    groupId = query.groupId;
  }

  /**
   * 如果都不存在，那么以为这个，这个功能页是一个智能小程序，和设备无关
   */
  if (!deviceId && !groupId) {
    return [null, devices];
  }

  const isGroupDevice = !!groupId;
  const instance = isGroupDevice
    ? new SmartGroupModel<SmartDeviceSchema>({ groupId })
    : new SmartDeviceModel<SmartDeviceSchema>({ deviceId, interceptors: dpKit.interceptors });
  /**
   * 此处建议以智能设备的名称作为键名赋值
   * It is recommended to assign the name of the smart device as the key name.
   */
  devices.common = instance as SmartDeviceModel<SmartDeviceSchema>;
  return [devices.common, devices];
};
