import { GetTTTSuccessData } from '@ray-js/panel-sdk';
import { getMobileDeviceInfo } from '@ray-js/ray';

let deviceInfo = null;

getMobileDeviceInfo({
  success: data => {
    deviceInfo = data;
  },
});

export const getCachedDeviceInfo = (): GetTTTSuccessData<typeof getMobileDeviceInfo> => {
  if (deviceInfo === null) {
    getMobileDeviceInfo({
      success: data => {
        deviceInfo = data;
      },
    });
  }
  return deviceInfo ?? {};
};
