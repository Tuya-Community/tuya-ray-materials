import { SmartDeviceModel, SmartGroupModel, SmartSupportAbility } from '@ray-js/panel-sdk';
import { createDpKit } from '@ray-js/panel-sdk/lib/sdm/interceptors/dp-kit';
import { protocols } from '@/devices/protocols';
import { SmartDeviceSchema } from 'typings/sdm';

const isGroupDevice = !!ty.getLaunchOptionsSync()?.query?.groupId;

export const dpKit = createDpKit<SmartDeviceSchema>({ protocols });

const options = {
  interceptors: dpKit.interceptors,
};

/**
 * SmartDevices 定义来自于 typings/sdm.d.ts，非 TypeScript 开发者可忽略
 * The SmartDevices definition comes from typings/sdm.d.ts and can be ignored by non-TypeScript developers
 */
export const devices = {
  /**
   * 此处建议以智能设备的名称作为键名赋值
   * It is recommended to assign the name of the smart device as the key name.
   */
  // common: new SmartDeviceModel<SmartDeviceSchema>(options),
  common: isGroupDevice
    ? new SmartGroupModel<SmartDeviceSchema>(options)
    : new SmartDeviceModel<SmartDeviceSchema>(options),
};

export const support = new SmartSupportAbility();
