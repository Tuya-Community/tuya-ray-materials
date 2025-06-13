import {
  SmartDeviceSchema,
  IgnoreDpChangeInterceptorOptions,
  OnDpDataChangeInterceptor,
} from '@/typings/sdm';
import { SmartDeviceModel, SmartGroupModel } from '@ray-js/panel-sdk';
import { createDpKit } from '@ray-js/panel-sdk/lib/sdm/interceptors/dp-kit';
import { getLaunchOptionsSync } from '@ray-js/ray';
import { protocols } from '@/devices/protocols';

const isGroupDevice = !!getLaunchOptionsSync()?.query?.groupId;

export const onDpChangeTransDpId =
  ctx =>
  next =>
  // eslint-disable-next-line consistent-return
  data => {
    const dpSchema = ctx.instance.getDpSchema();
    const idMapCode = Object.keys(dpSchema).reduce((ret, code) => {
      return {
        ...ret,
        [dpSchema[code].id]: code,
      };
    }, {});
    const { dps = {} } = data;
    const newData = { ...data };
    const dpState = Object.keys(dps).reduce((ret, id) => {
      return {
        ...ret,
        [idMapCode[id]]: dps[id],
      };
    }, {});
    newData.dpState = dpState;
    next(newData);
  };

export const dpKit = createDpKit<SmartDeviceSchema>({ protocols });
const options = {
  interceptors: {
    request: dpKit.interceptors.request,
    response: {
      ...dpKit.interceptors.request,
      onDpDataChange: [...dpKit.interceptors.response.onDpDataChange, onDpChangeTransDpId],
    },
  },
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
    ? new SmartGroupModel<SmartDeviceSchema>()
    : new SmartDeviceModel<SmartDeviceSchema>(options),
};
