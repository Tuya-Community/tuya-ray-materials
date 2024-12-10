import { device, home, gateway } from '@ray-js/ray';
import {
  GetGatewayAbilityResponseItem,
  BleNodeInfo,
  BeaconNodeInfo,
  RoomItem,
  DevInfo,
} from '@/types';

const {
  getSubDeviceInfoList,
  registerGateWaySubDeviceListener: registerGateWaySubDeviceListenerApi,
  onSubDeviceDpUpdate,
  onSubDeviceRemoved,
  onSubDeviceAdded,
  onSubDeviceInfoUpdate,
  unregisterGateWaySubDeviceListener: unregisterGateWaySubDeviceListenerApi,
  offSubDeviceDpUpdate,
  offSubDeviceRemoved,
  offSubDeviceAdded,
  offSubDeviceInfoUpdate,
} = device;
const { getCurrentHomeInfo, getRoomList: getRoomListApi } = home;
const {
  getGatewayAbility: getGatewayAbilityApi,
  updateRelationBlue,
  updateRelationMesh,
  updateRelationBeacon,
} = gateway;

/**
 * @language zh-CN
 * @description 获取网关下的所有子设备
 * @param {string} meshId 网关设备id或上级节点id
 * @return {Promise<Array<DevInfo>>} 子设备列表的Promise对象
 */
export const getSubDeviceList = (meshId: string): Promise<Array<DevInfo>> => {
  return new Promise((resolve, reject) => {
    getSubDeviceInfoList({
      meshId,
      success: resolve,
      fail: reject,
    });
  });
};

/**
 * @description 获取当前家庭的homeId。用到了 HomeKit
 * @return 当前家庭的homeId
 */
export const getCurrentHomeId = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    getCurrentHomeInfo({
      success: ({ homeId }) => {
        resolve(homeId);
      },
      fail: reject,
    });
  });
};

/** 监听子设备状态变化回调时的入参 */
type DeviceListenerParams = {
  /**
   * deviceId 设备id
   * 支持跨面板获取其他的设备信息，当前面板可以传当前设备的 id 来进行获取
   */
  deviceId: string;
  /** dps 科学变化的数据 */
  dps?: Record<string, any>;
};

/**
 * @description 监听网关子设备状态变化（包括dp变化，添加，移除，设备信息变更）
 * @param {String} gwId 网关id
 * @param {Function} callback 发生变化时触发的回调
 * @param {Object} dps dps 科学变化的数据
 * @return
 */
export const registerGateWaySubDeviceListener = (
  gwId: string,
  callback: (params: DeviceListenerParams) => void,
  dps?: Record<string, any>
) => {
  registerGateWaySubDeviceListenerApi({
    deviceId: gwId,
    dps,
    complete: () => {
      onSubDeviceDpUpdate(callback);
      onSubDeviceRemoved(callback);
      onSubDeviceAdded(callback);
      onSubDeviceInfoUpdate(callback);
    },
  });
};

/**
 * @description 取消监听网关子设备状态变化
 * @param {String} gwId 网关id
 * @param {Function} callback 发生变化时触发的回调
 * @return
 */
export const unregisterGateWaySubDeviceListener = (
  gwId: string,
  callback?: (params: DeviceListenerParams) => void
) => {
  unregisterGateWaySubDeviceListenerApi({
    deviceId: gwId,
    complete: () => {
      offSubDeviceDpUpdate(callback);
      offSubDeviceRemoved(callback);
      offSubDeviceAdded(callback);
      offSubDeviceInfoUpdate(callback);
    },
  });
};

/**
 * @description 获取当前家庭下房间列表。用到了 HomeKit
 * @param {String} homeId 家庭id
 * @return 当前家庭下房间列表
 */
export const getRoomList = async (homeId: string): Promise<RoomItem[]> => {
  return new Promise((resolve, reject) => {
    getRoomListApi({
      ownerId: homeId,
      success: ({ roomDatas }) => {
        resolve(roomDatas);
      },
      fail: reject,
    });
  });
};

/**
 * 获取网关的能力，包括信号检测、设备数量上限、指示灯状态能力、网关网络状态查询能力等。
 * @param {string} devIds 设备id集合(最多20个)
 */
const getGatewayAbility = (devIds: string): Promise<GetGatewayAbilityResponseItem[]> => {
  return new Promise((resolve, reject) => {
    getGatewayAbilityApi({
      devIds,
      success: data => {
        resolve(data);
      },
      fail: reject,
    });
  });
};

/**
 * @description: 绑定 BLE 设备到网关、从网关解绑 BLE 设备。
 * @param {string} sourceMeshId 子设备当前所属的 meshId 或网关设备 ID。绑定到网关下时，传网关的 sigmeshId。从网关解绑时，传网关的设备 ID。
 * @param {BleNodeInfo[]} nodes BLE 设备信息列表
 * @param {string | null} targetMeshId 绑定目标的 meshId。绑定到网关下时，传网关的设备 ID。从网关解绑时，传 null。
 * @return {Promise<string[]>} 已在网关下的设备
 */
const bleSubDevRelationUpdate = (
  sourceMeshId: string,
  nodes: BleNodeInfo[],
  targetMeshId: string | null
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    updateRelationBlue({
      sourceMeshId,
      nodes,
      targetMeshId,
      success: data => {
        resolve(data);
      },
      fail: reject,
    });
  });
};

/**
 * @description: 绑定 SIG MESH 设备到网关、从网关解绑 SIG MESH 设备。
 * @param {string} sourceMeshId 子设备当前所属的 meshId 或网关设备 ID。绑定到网关下时，传子设备的 meshId。从网关解绑时，传网关的设备 ID。
 * @param {string[]} nodeIds SIG MESH 设备 nodeId 列表
 * @param {string | null} targetMeshId 绑定目标的 meshId。绑定到网关下时，传网关的设备 ID。从网关解绑时，传 null。
 * @return {Promise<string[]>} 已在网关下的设备
 */
const sigmeshSubDevRelationUpdate = (
  sourceMeshId: string,
  nodeIds: string[],
  targetMeshId: string | null
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    updateRelationMesh({
      sourceMeshId,
      nodeIds,
      targetMeshId,
      success: data => {
        resolve(data);
      },
      fail: reject,
    });
  });
};

/**
 * @description: 绑定 Beacon 设备到网关、从网关解绑 Beacon 设备。
 * @param {string | null} sourceMeshId 子设备当前所属的网关设备 ID。绑定到网关下时，传null。从网关解绑时，传网关的设备 ID。
 * @param {BeaconNodeInfo[]} nodes Beacon 设备信息列表（mac要求小写并且去掉冒号）
 * @param {string | null} targetMeshId 绑定目标的 meshId。绑定到网关下时，传网关的设备 ID。从网关解绑时，传 null。
 * @return {Promise<string[]>} 已在网关下的设备
 */
const beaconSubDevRelationUpdate = (
  sourceMeshId: string | null,
  nodes: BeaconNodeInfo[],
  targetMeshId: string | null
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    updateRelationBeacon({
      sourceMeshId,
      nodes,
      targetMeshId,
      success: data => {
        resolve(data);
      },
      fail: reject,
    });
  });
};

/**
 * @description 获取当前家庭下所有设备的id列表。用到了 HomeKit
 * @param {String} homeId 家庭id
 * @return 当前家庭下所有设备的id列表
 */
const getDeviceIdList = (homeId: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    ty.home.getDeviceIdList({
      ownerId: homeId as unknown as number,
      success: ({ devIds }) => {
        resolve(devIds);
      },
      fail: reject,
    });
  });
};

/**
 * @description 获取当前家庭下所有设备列表。用到了 HomeKit
 * @param {String} homeId 家庭id
 * @return 当前家庭下所有设备列表
 */
const getDeviceList = async (homeId: string): Promise<ty.device.DeviceInfo[]> => {
  if (!homeId) throw new Error('homeId is undefined');
  try {
    const deviceIdList = await getDeviceIdList(homeId);
    return new Promise((resolve, reject) => {
      ty.device.getDeviceListByDevIds({
        deviceIds: deviceIdList,
        success: ({ deviceInfos }) => {
          resolve(deviceInfos);
        },
        fail: reject,
      });
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export {
  getGatewayAbility,
  bleSubDevRelationUpdate,
  sigmeshSubDevRelationUpdate,
  beaconSubDevRelationUpdate,
  getDeviceList,
};
