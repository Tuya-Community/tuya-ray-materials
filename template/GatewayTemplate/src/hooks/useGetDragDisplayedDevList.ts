import React, { useMemo } from 'react';
import Strings from '@/i18n';
import { OperationType } from '@/types';
import {
  hasBleCapability,
  hasManageBleCapability,
  hasManageMatterCapability,
  getDevListDisabledReasonByGatewayInfo,
  getBeaconVersion,
} from '@/utils';

const useGetDragDisplayedDevList = ({
  roomList,
  displayDataSource,
  currentRoomId,
  operationType,
  selectedGatewayId,
  migratableGatewayList,
  devInfo,
}) => {
  const isCurrentGatewayHasManageBleCapability = hasManageBleCapability(devInfo.protocolAttribute);
  const isCurrentGatewayHasManageMatterCapability = hasManageMatterCapability(
    devInfo.protocolAttribute
  );

  // 带roomId的设备列表
  const deviceListWithRoomId = useMemo(() => {
    return displayDataSource.map(device => {
      const roomItem = roomList.find(room => (room.deviceIds || []).includes(device.devId));
      return { ...device, roomId: roomItem ? roomItem.roomId : 0 };
    });
  }, [displayDataSource, roomList]);

  // 根据当前选中的房间，筛选出设备列表，并按照激活时间降序排序。
  const devListInRoom = useMemo(() => {
    return (
      currentRoomId === 0
        ? deviceListWithRoomId
        : deviceListWithRoomId.filter(d => Number(d.roomId) === Number(currentRoomId))
    )
      .map(d => ({ ...d, beaconVersion: getBeaconVersion(d) }))
      .sort((a, b) => b.activeTime - a.activeTime);
  }, [deviceListWithRoomId, currentRoomId]);

  /**
   * 最终展示的列表，根据不同的操作，判断当前设备是否可选，并给出不可选理由。
   */
  const displayedDevList = useMemo(() => {
    /**
     * 如果是关联子设备需要判断：
     * 1.当前网关是否支持管理这种子设备
     * 2.是否网关未启用安全，但是子设备已启用
     */
    if (operationType === OperationType.associate) {
      return getDevListDisabledReasonByGatewayInfo({
        gatewayInfo: devInfo,
        deviceList: devListInRoom,
        notSupportManageTip: Strings.getLang('currentGatewayNotSupport'),
        unSafeTip: Strings.getLang('currentGatewayUnsafeTip'),
      });
    }
    /**
     * 如果是取消关联子设备：
     * 1.过滤掉非蓝牙设备，因为它们无法被取消关联
     */
    if (operationType === OperationType.disassociate) {
      return devListInRoom.filter(({ capability }) => hasBleCapability(capability));
    }
    /**
     * 如果是迁移到另一个网关需要判断：
     * 1.目标网关是否支持管理这种子设备
     * 2.是否目标网关未启用安全，但是子设备已启用
     */
    if (operationType === OperationType.migrate) {
      // 如果是matter网关 仅展示网关下三方matter，如果是蓝牙网关 只展示蓝牙子设备
      const list = devListInRoom.filter(
        ({ capability, isTripartiteMatter }) =>
          (isCurrentGatewayHasManageMatterCapability && isTripartiteMatter) ||
          (isCurrentGatewayHasManageBleCapability && hasBleCapability(capability))
      );
      const targetGateway = migratableGatewayList.find(
        gateway => gateway.devId === selectedGatewayId
      );
      if (targetGateway) {
        return getDevListDisabledReasonByGatewayInfo({
          gatewayInfo: targetGateway,
          // 可以被迁移的设备只有蓝牙类型的和Matter类型的
          deviceList: list,
          notSupportManageTip: Strings.getLang('targetGatewayNotSupport'),
          unSafeTip: Strings.getLang('targetGatewayUnsafeTip'),
        });
      }
      return list;
    }
    return devListInRoom;
  }, [
    devListInRoom,
    selectedGatewayId,
    migratableGatewayList,
    devInfo.protocolAttribute,
    devInfo.meta,
  ]);

  return displayedDevList;
};

export default useGetDragDisplayedDevList;
