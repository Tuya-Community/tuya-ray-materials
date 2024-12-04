import { SmartDeviceSchema } from '@/typings/sdm';
import { SmartDeviceModel } from '@ray-js/panel-sdk';
import { createDpKit } from '@ray-js/panel-sdk/lib/sdm/interceptors/dp-kit';
import { protocols } from '@/devices/protocols';

export const dpKit = createDpKit<SmartDeviceSchema>({ protocols });

const options = {
  interceptors: dpKit.interceptors,
};

/**
 * SmartDevices 定义来自于 typings/sdm.d.ts，非 TypeScript 开发者可忽略
 * The SmartDevices definition comes from typings/sdm.d.ts and can be ignored by non-TypeScript developers
 */
const devices = {
  /**
   * 此处建议以智能设备的名称作为键名赋值
   * It is recommended to assign the name of the smart device as the key name.
   */
  // common: new SmartDeviceModel<SmartDeviceSchema>(options),
  common: null,
  init() {
    // 微信中需要调用这个来变更设备信息，微信中不支持群组
    devices.common = new SmartDeviceModel<SmartDeviceSchema>(options);
  },
};

export { devices };
