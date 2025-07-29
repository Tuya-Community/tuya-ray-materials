import { SmartDeviceSchema, SmartGroupSchema } from '@/typings/sdm';
import { SmartDeviceModel, SmartGroupModel } from '@ray-js/panel-sdk';
import { createDpKit } from '@ray-js/panel-sdk/lib/sdm/interceptors/dp-kit';
import { getLaunchOptionsSync } from '@ray-js/ray';
import { protocols } from '@/devices/protocols';

const isGroupDevice = !!getLaunchOptionsSync()?.query?.groupId;

export const dpKit = createDpKit<SmartDeviceSchema>({ protocols });

const deviceOptions = {
  interceptors: dpKit.interceptors,
} as SmartDeviceModel<SmartDeviceSchema>['options'];

/**
 * 群组环境的模型配置选项和单设备环境的模型配置选项有所不同，如 abilities 能力方面并非所有群组模型均支持，开发者需要关注
 * The model configuration options for group environments differ from those for single-device environments, particularly in terms of abilities. Developers should take note.
 */
const groupOptions = {} as SmartGroupModel<SmartGroupSchema>['options'];

/**
 * SmartDevices 定义来自于 typings/sdm.d.ts，非 TypeScript 开发者可忽略
 * The SmartDevices definition comes from typings/sdm.d.ts and can be ignored by non-TypeScript developers
 */
export const devices = {
  /**
   * 此处建议以智能设备的名称作为键名赋值，若当前设备不需要支持群组环境，则可直接使用 SmartDeviceModel
   * It is recommended to assign the name of the smart device as the key name, Note that if the current device does not need to support group environments, you can directly use SmartDeviceModel
   */
  // common: new SmartDeviceModel<SmartDeviceSchema>(options),
  common: isGroupDevice
    ? new SmartGroupModel<SmartGroupSchema>(groupOptions)
    : new SmartDeviceModel<SmartDeviceSchema>(deviceOptions),
};
