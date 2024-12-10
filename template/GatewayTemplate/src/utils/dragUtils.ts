import {
  bleSubDevRelationUpdate,
  sigmeshSubDevRelationUpdate,
  beaconSubDevRelationUpdate,
} from '@/api';
import { OperationType, DevInfo, BleNodeInfo, DeviceCapability } from '@/types';
import { checkCapability } from './deviceCapability';

/**
 * @language zh-CN
 * @description 转换mac字符串的格式
 * @param {string} mac 要转换的mac字符串
 * @return {boolean} isLowerCase 是否要转为小写，如果传false则会转为大写，默认为true
 * @return {boolean} isSplitByColon 是否要用冒号分割，默认为false
 */
const transformMac = (mac: string, isLowerCase = true, isSplitByColon = false): string => {
  const casedMac = isLowerCase ? mac.toLowerCase() : mac.toUpperCase();
  // 以两个字符为一组，不匹配末尾的一组
  const replaceRegex = /(\w{2})(?!$)/g;
  // 已经用冒号分隔的mac
  const macWithColonRegex = /(\w{2}:){5}(\w{2})/;
  // 不使用冒号分割的mac
  const macWithoutColonRegex = /(\w{2}){6}/;

  // 如果需要用冒号分割，并且当前的mac不符合用冒号分隔的mac的正则，则按两个字符一组替换
  if (isSplitByColon && !macWithColonRegex.test(casedMac)) {
    return casedMac.replace(replaceRegex, '$1:');
  }
  // 如果不需要用冒号分割，并且当前的mac不符合不使用冒号分割的mac的正则，需要替换所有冒号为空字符
  if (!isSplitByColon && !macWithoutColonRegex.test(casedMac)) {
    return casedMac.replace(/:/g, '');
  }
  return casedMac;
};

const splitList = (sourceList, size) => {
  const tempList = [...sourceList];
  const resultList = [];

  const pageNo = 1;
  while (tempList.length) {
    const list = tempList.splice((pageNo - 1) * size, size);
    resultList.push(list);
  }
  return resultList;
};

/** 每次请求最多放置的设备数量 */
const MAX_DEVICE_SIZE_PEER_REQUEST = 10;
/**
 * @description 获取拖拽请求列表
 * @return
 */
const getDragFetchList = ({
  /** 操作类型 */
  operationType,
  /** 要操作的设备列表 */
  devList,
  /** 当前的网关信息 */
  currentGatewayInfo,
  /** 移动目标的设备id */
  targetGatewayDevId,
  /** 每次请求最多放置的设备数量 */
  maxSizePeerRequest = MAX_DEVICE_SIZE_PEER_REQUEST,
}: {
  operationType: OperationType;
  devList: DevInfo[];
  currentGatewayInfo: DevInfo;
  targetGatewayDevId?: string;
  maxSizePeerRequest: number;
}) => {
  let bleSource;
  let bleTarget;

  let sigmeshSource;
  let sigmeshTarget;

  let beaconSource;
  let beaconTarget;

  const {
    devId: gatewayDevId,
    meshId: gatewayMeshId,
    capability: gatewayCapability,
    parentId: gatewayParentId,
  } = currentGatewayInfo;
  const bleNodeList: BleNodeInfo[] = [];
  const sigmeshNodeList: string[] = [];
  const beaconNodeList: Record<string, any>[] = [];
  let getMeshId = '';
  devList.forEach(({ capability, nodeId, uuid, devId, meshId, mac }) => {
    const isSigMesh = checkCapability(capability, [DeviceCapability.SIGMESH]);
    const isBeacon = checkCapability(capability, [DeviceCapability.BEACON]);
    if (isSigMesh) {
      if (meshId) {
        getMeshId = meshId;
      }
      sigmeshNodeList.push(nodeId);
    } else if (isBeacon) {
      beaconNodeList.push({ devId, mac: transformMac(mac, true, false) });
    } else {
      bleNodeList.push({ uuid, devId });
    }
  });

  // 是否是sigMesh网关
  const unBindMeshId = checkCapability(gatewayCapability, [DeviceCapability.SIGMESH])
    ? gatewayMeshId
    : gatewayParentId;

  switch (operationType) {
    case OperationType.associate:
    default:
      bleSource = gatewayMeshId;
      bleTarget = gatewayDevId;

      sigmeshSource = getMeshId;
      sigmeshTarget = gatewayDevId;

      beaconSource = null;
      beaconTarget = gatewayDevId;
      break;
    case OperationType.disassociate:
      bleSource = gatewayDevId;
      bleTarget = null;

      sigmeshSource = gatewayDevId;
      sigmeshTarget = unBindMeshId;

      beaconSource = gatewayDevId;
      beaconTarget = null;
      break;
    case OperationType.migrate:
      bleSource = gatewayDevId;
      bleTarget = targetGatewayDevId;

      sigmeshSource = gatewayDevId;
      sigmeshTarget = targetGatewayDevId;

      beaconSource = gatewayDevId;
      beaconTarget = targetGatewayDevId;
      break;
  }

  const fetchList: Promise<any>[] = [];
  if (bleNodeList.length > 0) {
    // 蓝牙子设备的添加和删除
    const splittedList = splitList(bleNodeList, maxSizePeerRequest);
    splittedList.forEach(nodeList => {
      console.log(`蓝牙子设备拖拽 source: ${bleSource},target: ${bleTarget}`, nodeList);
      fetchList.push(bleSubDevRelationUpdate(bleSource, nodeList, bleTarget));
    });
  }

  if (sigmeshNodeList.length > 0) {
    // SIG Mesh子设备的添加和删除
    const splittedList = splitList(sigmeshNodeList, maxSizePeerRequest);
    splittedList.forEach(nodeList => {
      console.log(`SIG Mesh子设备拖拽 source: ${sigmeshSource},target: ${sigmeshTarget}`, nodeList);
      fetchList.push(sigmeshSubDevRelationUpdate(sigmeshSource, nodeList, sigmeshTarget));
    });
  }

  if (beaconNodeList.length > 0) {
    // Beacon子设备的添加和删除
    const splittedList = splitList(beaconNodeList, maxSizePeerRequest);
    splittedList.forEach(nodeList => {
      console.log(`Beacon子设备拖拽 source: ${beaconSource},target: ${beaconTarget}`, nodeList);
      fetchList.push(beaconSubDevRelationUpdate(beaconSource, nodeList, beaconTarget));
    });
  }

  return fetchList;
};

export { transformMac, getDragFetchList };
