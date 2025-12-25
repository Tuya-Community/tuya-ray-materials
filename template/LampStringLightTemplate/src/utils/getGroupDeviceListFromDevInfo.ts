import { devices } from '@/devices';
import { getArray } from './kit';
import { getDeviceInfo } from '@ray-js/ray';

export const getGroupDeviceListFromDevInfo = async params => {
  const devInfo = devices.common.getDevInfo() as any;

  const ret = getArray(devInfo?.deviceList);

  const list = await Promise.all(
    ret.map(
      item =>
        new Promise(resolve => {
          getDeviceInfo({
            deviceId: item.devId,
            success: res => {
              resolve(res);
            },
            fail: err => {
              console.log('getDeviceInfo fail', err);
              resolve(item);
            },
          });
        })
    )
  );

  if (params.success) {
    params.success({
      deviceList: list,
    });
  }

  return list;
};
