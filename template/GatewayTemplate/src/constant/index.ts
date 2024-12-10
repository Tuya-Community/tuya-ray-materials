import Strings from '@/i18n';
import { DeviceManageOptions, DeviceCapability } from '@/types';

export const SYSTEM_INFO = 'SYSTEM_INFO';

// 子设备操作
export const manageMenuConfigList = [
  {
    label: Strings.getLang('addNewDevice'),
    value: DeviceManageOptions.addNewDevice,
  },
  {
    label: Strings.getLang('associateDevice'),
    value: DeviceManageOptions.associateDevice,
  },
  {
    label: Strings.getLang('disassociateDevice'),
    value: DeviceManageOptions.disassociateDevice,
  },
  {
    label: Strings.getLang('migrateToOtherGateways'),
    value: DeviceManageOptions.migrateToOtherGateways,
  },
  {
    label: Strings.getLang('matterScanAdd'),
    value: DeviceManageOptions.matterScanAdd,
  },
];

// 云端离线时，禁用的选项
export const offlineDisabledOptions = [
  DeviceManageOptions.addNewDevice,
  DeviceManageOptions.associateDevice,
];

// 子设备列表缓存key的后缀
export const SUB_DEVICE_LIST_CACHE_KEY_SUFFIX = '_subDeviceList';

// 子设备列表页标题
export const subDevPageTitle = [
  {
    title: Strings.getLang('bleSubDevice'),
    capabilityList: [DeviceCapability.BLUETOOTH, DeviceCapability.SIGMESH, DeviceCapability.BEACON],
  },
  { title: Strings.getLang('zigbeeSubDevice'), capabilityList: [DeviceCapability.ZIGBEE] },
];
