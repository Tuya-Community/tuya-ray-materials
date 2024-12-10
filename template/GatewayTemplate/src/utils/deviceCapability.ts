import { utils } from '@ray-js/panel-sdk';
import _get from 'lodash/get';
import { DeviceCapability, ProtocolAttribute, DevInfo } from '@/types';
import Res from '@/res';
const { getBitValue } = utils;

/**
 * @description 检测是否拥有需要的能力并且没有不需要的能力
 * @param {number} capability 设备能力值
 * @param {Array<DeviceCapability | number>} requiredCapabilities 需要的能力位列表
 * @param {Array<DeviceCapability | number>} unneededCapabilities 不需要的能力位列表
 * @return {boolean} 返回是否满足条件
 */
const checkCapability = (
  capability: number,
  requiredCapabilities: number | Array<DeviceCapability | number> = [],
  unneededCapabilities: number | Array<DeviceCapability | number> = []
): boolean => {
  const requiredCapabilityList = Array.isArray(requiredCapabilities)
    ? requiredCapabilities
    : [requiredCapabilities];
  const unneededCapabilityList = Array.isArray(unneededCapabilities)
    ? unneededCapabilities
    : [unneededCapabilities];
  return (
    requiredCapabilityList.every(d => !!getBitValue(capability, d)) &&
    !unneededCapabilityList.some(d => !!getBitValue(capability, d))
  );
};

const getIsSupportBleDevice = (protocolAttribute: number) =>
  !!getBitValue(protocolAttribute, ProtocolAttribute.BLUETOOTH) ||
  !!getBitValue(protocolAttribute, ProtocolAttribute.SIGMESH) ||
  !!getBitValue(protocolAttribute, ProtocolAttribute.BEACON) ||
  !!getBitValue(protocolAttribute, ProtocolAttribute.BEACON2);

const getIsSupportZigbeeDevice = (protocolAttribute: number) =>
  !!getBitValue(protocolAttribute, ProtocolAttribute.ZIGBEE);

const hasBleCapability = (capability: number) =>
  checkCapability(capability, [DeviceCapability.BLUETOOTH]) ||
  checkCapability(capability, [DeviceCapability.SIGMESH]) ||
  checkCapability(capability, [DeviceCapability.BEACON]);

const hasZigbeeCapability = (capability: number) =>
  checkCapability(capability, [DeviceCapability.ZIGBEE]);

const hasThreadCapability = (capability: number) =>
  checkCapability(capability, [DeviceCapability.THREAD]);

const getTypeIcon = (capability: number) => {
  if (checkCapability(capability, DeviceCapability.WIFI)) {
    return Res.iconWifi;
  }
  if (checkCapability(capability, DeviceCapability.ZIGBEE)) {
    return Res.iconZigbee;
  }
  if (checkCapability(capability, DeviceCapability.THREAD)) {
    return Res.iconThread;
  }
  if (checkCapability(capability, DeviceCapability.BLUETOOTH)) {
    return Res.iconBle;
  }
  if (checkCapability(capability, DeviceCapability.BEACON)) {
    return Res.iconBeacon;
  }
  if (checkCapability(capability, DeviceCapability.SIGMESH)) {
    return Res.iconSigmesh;
  }
  return '';
};

const isTreadDevice = (capability: number) => {
  return checkCapability(capability, DeviceCapability.THREAD);
};

const hasManageMatterCapability = (protocolAttribute: number) => {
  return (
    checkCapability(protocolAttribute, ProtocolAttribute.THREAD) ||
    checkCapability(protocolAttribute, 9)
  );
};

type ScyChannel = {
  enable: boolean;
  version: string;
};

const isSafeDevice = (scyChannel: string): boolean => {
  if (!scyChannel) return false;
  try {
    const scyChannelObj: ScyChannel = JSON.parse(scyChannel);
    return !!scyChannelObj.enable && scyChannelObj.version === '1.0';
  } catch (error) {
    return false;
  }
};

/**
 * beacon 的版本号和网关的 protocolAttribute 映射关系。
 */
const beaconAttributeVersionMap = {
  1: ProtocolAttribute.BEACON,
  2: ProtocolAttribute.BEACON2,
};

/**
 * @description 网关管理子设备的能力值与对应通讯能力的标位映射。
 */
const gatewayManagementCapabilitiesMap: Record<ProtocolAttribute, DeviceCapability | null> = {
  [ProtocolAttribute.BLUETOOTH]: DeviceCapability.BLUETOOTH,
  [ProtocolAttribute.SIGMESH]: DeviceCapability.SIGMESH,
  [ProtocolAttribute.BEACON]: DeviceCapability.BEACON,
  [ProtocolAttribute.BEACON2]: DeviceCapability.BEACON,
  [ProtocolAttribute.SUBPIECES]: DeviceCapability.SUBPIECES,
  [ProtocolAttribute.ZIGBEE]: DeviceCapability.ZIGBEE,
  [ProtocolAttribute.THREAD]: DeviceCapability.THREAD,
  [ProtocolAttribute.TYMESH]: DeviceCapability.TYMESH,
  [ProtocolAttribute.ROAMING]: null,
  [ProtocolAttribute.MatterOverWiFi]: DeviceCapability.WIFI,
};

/**
 * @language zh-CN
 * @description 判断网关是否支持管理此设备
 * @param {Number} protocolAttribute 网关的protocolAttribute
 * @param {Number} capability 设备的capability
 * @param {String} devId 设备的devId
 * @return {Boolean} 网关是否支持管理此设备
 */
const isGatewaySupportManageCurrentDevice = (
  protocolAttribute: number,
  capability: number,
  beaconVersion?: number
): boolean => {
  const isBeacon = checkCapability(capability, [DeviceCapability.BEACON]);
  if (isBeacon) {
    if (beaconVersion) {
      return !!getBitValue(protocolAttribute, beaconAttributeVersionMap[beaconVersion]);
    }
    return false;
  }
  const capabilities = Object.values(gatewayManagementCapabilitiesMap);
  const protocolAttributes = Object.keys(gatewayManagementCapabilitiesMap);

  const currentCapabilityIndex = capabilities.findIndex(cap => !!getBitValue(capability, cap));
  if (currentCapabilityIndex >= 0) {
    return !!getBitValue(protocolAttribute, Number(protocolAttributes[currentCapabilityIndex]));
  }
  return false;
};

const getDevListDisabledReasonByGatewayInfo = ({
  gatewayInfo,
  deviceList,
  notSupportManageTip,
  unSafeTip,
}: {
  gatewayInfo: DevInfo;
  deviceList: DevInfo[];
  notSupportManageTip: string;
  unSafeTip: string;
}) => {
  const { gwScyChannel } = gatewayInfo.meta || ({} as any);
  const isSafeGateway = isSafeDevice(gwScyChannel);
  const isSupportManageTripartiteMatter = checkCapability(gatewayInfo.protocolAttribute, 9);
  console.log('-------判断子设备和网关是否安全 start-------');
  console.log('网关是否安全', isSafeGateway, '源数据: ', gwScyChannel);
  const list = deviceList.map(devItem => {
    const { capability, beaconVersion, meta = {}, isTripartiteMatter } = devItem;
    const isGatewaySupportManage = isTripartiteMatter
      ? isSupportManageTripartiteMatter
      : isGatewaySupportManageCurrentDevice(
          gatewayInfo?.protocolAttribute || 0,
          capability,
          beaconVersion
        );
    let isUnsafeGatewayAndSafeSubDevice = false;
    const isBleTypeDevice = checkCapability(capability, DeviceCapability.BLUETOOTH);
    /**
     * ble设备需要校验是否安全
     */
    if (isBleTypeDevice) {
      const isSafeSubDevice = isSafeDevice(meta.btScyChannel as string);
      console.log(
        `子设备名称: ${devItem.name},子设备id: ${devItem.devId}, 子设备是否安全: ${isSafeSubDevice},源数据: `,
        meta.btScyChannel
      );

      isUnsafeGatewayAndSafeSubDevice = !isSafeGateway && isSafeSubDevice;
    }

    const disabled = !isGatewaySupportManage || isUnsafeGatewayAndSafeSubDevice;

    const disabledReason = disabled
      ? // 优先提示安全原因
        isUnsafeGatewayAndSafeSubDevice
        ? unSafeTip
        : notSupportManageTip
      : '';
    return { ...devItem, disabled, disabledReason };
  });
  console.log('-------判断子设备和网关是否安全 end-------');
  return list;
};

/**
 * @description 网关管理蓝牙类别的能力值列表
 */
const gatewayBleTypeCapabilities = [
  ProtocolAttribute.BLUETOOTH,
  ProtocolAttribute.SIGMESH,
  ProtocolAttribute.BEACON,
  ProtocolAttribute.BEACON2,
];

/**
 * @description 是否支持管理蓝牙类的设备
 * @param {Number} protocolAttribute 网关的protocolAttribute属性
 * @return
 */
const hasManageBleCapability = (protocolAttribute: number) => {
  return gatewayBleTypeCapabilities.some(
    capability => !!getBitValue(protocolAttribute, capability)
  );
};

/**
 * @description 获取beacon设备版本号
 * @param {String} devInfo 设备信息
 * @param {Number} defaultResult 取不到的情况下，返回的默认值。(默认为1)
 * @return beacon设备版本号
 */
const getBeaconVersion = (devInfo: DevInfo, defaultVersion = 1) => {
  if (!devInfo || !checkCapability(devInfo.capability, DeviceCapability.BEACON)) {
    return undefined;
  }
  const beaconData = _get(devInfo, 'meta.beaconData', `{"beaconVer":"${defaultVersion}"}`);
  const beaconInfo = JSON.parse(beaconData as string) || {};
  return Number(beaconInfo.beaconVer || defaultVersion);
};

/**
 * @language zh-CN
 * @description 根据设备的 baseAttribute 判断是否是漫游设备
 * @param {String} pcc 设备的 baseAttribute 属性值
 * @return {Boolean} 是否是漫游设备
 */
const isRoamingDevice = (baseAttribute: number) => {
  return checkCapability(baseAttribute, 5);
};

/**
 * @description 获取设备的各种属性，用于判断能否被拖拽。比如是否是共享设备、漫游设备
 * @param {DevInfo} devItem 子设备信息
 * @return 设备的各种属性
 */
const getDeviceAttribute = (devItem: DevInfo) => {
  const {
    isVirtualDevice,
    isShare,
    devAttribute,
    bluetoothCapability,
    capability,
    parentId,
    productId,
    baseAttribute,
  } = devItem;

  /** 十进制的蓝牙能力 */
  const intBluetoothCapability = parseInt(bluetoothCapability, 16);

  /** 非漫游设备 */
  const isNotRoamingDevice = !isRoamingDevice(baseAttribute);
  /** 非分享的设备 */
  const isNotSharedDevice = !isShare;
  /** 非共享的设备 */
  const isNotShareableDevice = !getBitValue(devAttribute, 8);
  /** 非仅支持本地连接的设备 */
  // eslint-disable-next-line no-bitwise
  const isNotOnlySupportLocalDevice = ((intBluetoothCapability >> 11) & 11) !== 2;
  /** 非支持扩展模块的设备 */
  // eslint-disable-next-line no-bitwise
  const isNotSupportExpansionModulesDevice = ((intBluetoothCapability >> 4) & 4) === 0;
  /** 非支持配件的设备 */
  // eslint-disable-next-line no-bitwise
  const isNotSupportAccessoriesBleDevice = ((intBluetoothCapability >> 9) & 9) === 0;
  /** 非虚拟设备 */
  const isNotVirtualDevice = !isVirtualDevice;
  /** 非红外设备 */
  const isNotInfraredDevice = !getBitValue(capability, DeviceCapability.INFRARED);
  /** 没有绑定在网关下的子设备 */
  const isSubDevice = !parentId;

  return {
    isNotRoamingDevice,
    intBluetoothCapability,
    isNotSharedDevice,
    isNotShareableDevice,
    isNotOnlySupportLocalDevice,
    isNotSupportExpansionModulesDevice,
    isNotSupportAccessoriesBleDevice,
    isNotVirtualDevice,
    isNotInfraredDevice,
    isSubDevice,
  };
};

/**
 * @description 获取设备和网关的关系，用于判断能否被拖拽
 * @param {DevInfo} devItem 子设备信息
 * @param {DevInfo} gatewayInfo 网关设备信息
 * @return 设备和网关的关系
 */
const getDeviceRelationWithGateway = (devItem: DevInfo, gatewayInfo: DevInfo) => {
  const { devId: gatewayDevId, meshId: gatewayMeshId } = gatewayInfo;
  const { devId, parentId } = devItem;
  /** 非本网关 */
  const isNotCurrentGateway = devId !== gatewayDevId;
  /** 在同一mesh */
  const isInSameMesh = parentId === gatewayMeshId;
  return {
    isNotCurrentGateway,
    isInSameMesh,
  };
};

/**
 * @description 根据设备和网关的信息，判断设备是否可用于被拖拽（不考虑网关是否支持）
 * @param {DevInfo} devItem 子设备信息
 * @param {DevInfo} gatewayInfo 网关设备信息
 * @return 设备是否可用于被拖拽
 */
const getAddableItemByGatewayInfo = (devItem: DevInfo, gatewayInfo: DevInfo) => {
  const {
    isNotRoamingDevice,
    isNotSharedDevice,
    isNotShareableDevice,
    isNotVirtualDevice,
    isNotInfraredDevice,
  } = getDeviceAttribute(devItem);

  const { isNotCurrentGateway } = getDeviceRelationWithGateway(devItem, gatewayInfo);

  const result =
    isNotRoamingDevice &&
    isNotSharedDevice &&
    isNotShareableDevice &&
    isNotVirtualDevice &&
    isNotCurrentGateway &&
    isNotInfraredDevice;

  return result;
};

/**
 * @language zh-CN
 * @description 判断是否是蓝牙子设备
 * @param {number} capability 设备能力值
 * @return {boolean} 返回是否是蓝牙子设备
 */
/**
 * @language en-US
 * @description Determine whether it is a Bluetooth sub-device
 * @param {number} capability device capability
 * @return {boolean} Return whether it is a Bluetooth sub-device
 */
const isBlueSub = (capability: number): boolean => {
  return checkCapability(
    capability,
    [DeviceCapability.BLUETOOTH],
    [DeviceCapability.ZIGBEE, DeviceCapability.SIGMESH, DeviceCapability.WIFI]
  );
};

/**
 * @language zh-CN
 * @description 判断是否是sigmesh子设备
 * @param {number} capability 设备能力值
 * @return {boolean} 返回是否是sigmesh子设备
 */
const isSigmeshSub = (capability: number): boolean => {
  return checkCapability(capability, [DeviceCapability.SIGMESH], [DeviceCapability.WIFI]);
};

/**
 * @language zh-CN
 * @description 判断是否是zigbee子设备
 * @param {number} capability 设备能力值
 * @return {boolean} 返回是否是zigbee子设备
 */
const isZigbeeSub = (capability: number): boolean => {
  return checkCapability(
    capability,
    [DeviceCapability.ZIGBEE],
    [DeviceCapability.WIFI, DeviceCapability.CABLE]
  );
};

/**
 * @language zh-CN
 * @description 判断是否是beacon子设备
 * @param {number} capability 设备能力值
 * @return {boolean} 返回是否是beacon子设备
 */
const isBeaconSub = (capability: number): boolean => {
  return checkCapability(
    capability,
    [DeviceCapability.BEACON],
    [DeviceCapability.WIFI, DeviceCapability.CABLE]
  );
};

/**
 * @language zh-CN
 * @description 判断是否是网关
 * @param {number} protocolAttribute 产品属性值
 * @return {boolean} 返回是否是网关
 */
const isGateway = (protocolAttribute: number): boolean => {
  return protocolAttribute > 0;
};

/**
 * @description 根据设备和网关的信息，判断ble设备是否可用于被拖拽（不考虑网关是否支持）
 * @param {DevInfo} devItem 子设备信息
 * @param {DevInfo} gatewayInfo 网关设备信息
 * @return bel设备是否可用于被拖拽
 */
const getAddableBleItemByGatewayInfo = (devItem: DevInfo, gatewayInfo: DevInfo) => {
  const { capability } = devItem;

  const { isNotOnlySupportLocalDevice, isNotSupportExpansionModulesDevice, isSubDevice } =
    getDeviceAttribute(devItem);

  const { isInSameMesh } = getDeviceRelationWithGateway(devItem, gatewayInfo);

  const result =
    (!!isBlueSub(capability) &&
      isNotOnlySupportLocalDevice &&
      isNotSupportExpansionModulesDevice &&
      isSubDevice) ||
    (!!isSigmeshSub(capability) && isInSameMesh) ||
    (!!isBeaconSub(capability) && isSubDevice);
  return result;
};

export {
  checkCapability,
  getIsSupportBleDevice,
  getIsSupportZigbeeDevice,
  hasBleCapability,
  hasZigbeeCapability,
  hasThreadCapability,
  getTypeIcon,
  isTreadDevice,
  hasManageMatterCapability,
  getDevListDisabledReasonByGatewayInfo,
  hasManageBleCapability,
  getBeaconVersion,
  getDeviceAttribute,
  getAddableItemByGatewayInfo,
  isBlueSub,
  isSigmeshSub,
  isZigbeeSub,
  isBeaconSub,
  isGateway,
  getAddableBleItemByGatewayInfo,
};
