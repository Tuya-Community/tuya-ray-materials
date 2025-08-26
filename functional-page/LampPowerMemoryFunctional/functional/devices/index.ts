import {
  SmartDeviceModel,
  SmartGroupModel,
  SmartStorageAbility,
  SmartSupportAbility,
} from '@ray-js/panel-sdk';
import { createDpKit } from '@ray-js/panel-sdk/lib/sdm/interceptors/dp-kit';
import { protocols } from '@/devices/protocols';
import { lampSchema } from '@/devices/schema';

type SmartDeviceSchema = typeof lampSchema;

export const dpKit = createDpKit<SmartDeviceSchema>({ protocols });

export const options = {
  abilities: [new SmartSupportAbility(), new SmartStorageAbility()],
  interceptors: dpKit.interceptors,
};
export const devices = {
  lamp: null,
};
export const getDevice = (deviceId: string, groupId: string) => {
  devices.lamp = groupId
    ? // @ts-ignore
      new SmartGroupModel({ groupId, ...options })
    : new SmartDeviceModel({ deviceId, ...options });
  return devices.lamp;
};
