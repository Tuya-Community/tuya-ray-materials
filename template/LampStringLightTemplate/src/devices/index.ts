import {
  SmartDeviceModel,
  SmartGroupModel,
  SmartSupportAbility,
  SmartStorageAbility,
  SmartDeviceModelOptions,
} from '@ray-js/panel-sdk';
import { createDpKit } from '@ray-js/panel-sdk/lib/sdm/interceptors/dp-kit';
import { getLaunchOptionsSync } from '@ray-js/ray';
import { defaultSchema as lampSchema } from '@/devices/schema';

import { protocols } from '@/devices/protocols';
import { dpCodes } from '@/constant/dpCodes';

type SmartDeviceSchema = typeof lampSchema;

type SmartLampSupportAbility = SmartSupportAbility<SmartDeviceSchema>;

type Abilities = { support: SmartLampSupportAbility; storage: SmartStorageAbility };

const isGroupDevice = !!getLaunchOptionsSync()?.query?.groupId;

export const dpKit = createDpKit<SmartDeviceSchema>({
  protocols,
  sendDpOption: {
    immediate: true,
    // 会导致面板遥控器控制时状态不对应，先禁用
    ignoreDpDataResponse: {
      debug: true,
      timeout: 1000,
      whiteDpCodes: [
        dpCodes.work_mode,
        dpCodes.temp_value,
        dpCodes.bright_value,
        dpCodes.paint_colour_1,
        dpCodes.colour_data,
        dpCodes.segment_num_set,
        dpCodes.led_number_set,
      ],
    },
  },
});

const options = {
  abilities: [new SmartSupportAbility(), new SmartStorageAbility()],
  interceptors: dpKit.interceptors,
} as SmartDeviceModelOptions;

export const devices = {
  common: isGroupDevice
    ? new SmartGroupModel<SmartDeviceSchema, Abilities>(options as any)
    : new SmartDeviceModel<SmartDeviceSchema, Abilities>(options),
};
