import { SmartDeviceModel, SmartGroupModel } from '@ray-js/panel-sdk';
import { getLaunchOptionsSync } from '@ray-js/ray';

const isGroupDevice = !!getLaunchOptionsSync()?.query?.groupId;

/** DP Schema 和状态由 SDM 从当前设备读取。 */
export const devices = {
  common: isGroupDevice ? new SmartGroupModel() : new SmartDeviceModel(),
};
