import React, { useMemo, useCallback } from 'react';
import { showLoading, hideLoading, showToast } from '@ray-js/ray';
import Strings from '@/i18n';
import { OperationType } from '@/types';
import { showModal, getDragFetchList, showErrorMsgModal } from '@/utils';

// 拖拽页面不同操作类型的配置
const useGetOperationMap = ({
  operationType,
  selectedDeviceList,
  startListenProgressChange,
  devInfo,
  disassociateCallBack,
  migratableGatewayList,
  selectedGatewayId,
  setShowSelectGateway,
}) => {
  const associateDevice = useCallback(async () => {
    const isConfirm = await showModal(
      Strings.getLang('associateDeviceConfirmPopupTitle'),
      Strings.getLang('associateDeviceConfirmPopupSubtitle')
    );
    if (!isConfirm) return;
    const fetchList = getDragFetchList({
      operationType,
      devList: selectedDeviceList,
      currentGatewayInfo: devInfo,
    });
    showLoading({
      title: Strings.getLang('requesting'),
    });
    Promise.all(fetchList)
      .then(data => {
        // 重复的设备id
        const repeatedIds = data.reduce((prev, cur) => {
          const repList = cur && Array.isArray(cur.repeatNodeIds) ? cur.repeatNodeIds : [];
          return [...prev, ...repList];
        }, []);
        hideLoading();
        startListenProgressChange(devInfo.devId, repeatedIds);
      })
      .catch(error => {
        showErrorMsgModal(error, 'Associate device fail:');
        hideLoading();
      });
  }, [selectedDeviceList]);

  const disassociateDevice = useCallback(async () => {
    const isConfirm = await showModal(
      Strings.getLang('disassociateDeviceConfirmPopupTitle'),
      Strings.getLang('disassociateDeviceConfirmPopupSubtitle')
    );
    if (!isConfirm) return;
    const fetchList = getDragFetchList({
      operationType,
      devList: selectedDeviceList,
      currentGatewayInfo: devInfo,
    });
    showLoading({
      title: Strings.getLang('requesting'),
    });
    Promise.all(fetchList)
      .then(data => {
        hideLoading();
        showToast({
          title: Strings.getLang('disassociateDeviceSuccess'),
          icon: 'success',
          duration: 2000,
          success: () => {
            disassociateCallBack();
          },
        });
      })
      .catch(error => {
        showErrorMsgModal(error, 'Disassociate device fail:');
        hideLoading();
      });
  }, [selectedDeviceList]);

  const migrateToOtherGateways = useCallback(async () => {
    const targetGateway = migratableGatewayList.find(
      gateway => gateway.devId === selectedGatewayId
    );
    const isConfirm = await showModal(
      Strings.formatValue('migrateToOtherGatewayConfirmPopupTitle', targetGateway.name),
      Strings.getLang('migrateToOtherGatewayConfirmPopupSubtitle')
    );
    if (!isConfirm) return;
    setShowSelectGateway(false);
    const fetchList = getDragFetchList({
      operationType,
      // 过滤掉第三方matter设备和thread设备
      devList: selectedDeviceList.filter(
        ({ capability, isTripartiteMatter }) =>
          !isTripartiteMatter && !checkCapability(capability, DeviceCapability.THREAD)
      ),
      targetGatewayDevId: selectedGatewayId,
      currentGatewayInfo: devInfo,
    });
    showLoading({
      title: Strings.getLang('requesting'),
    });
    Promise.all(fetchList)
      .then(data => {
        hideLoading();
        startListenProgressChange(selectedGatewayId);
      })
      .catch(error => {
        showErrorMsgModal(error, 'Migrate device fail:');
        hideLoading();
      });
  }, [selectedGatewayId, selectedDeviceList, migratableGatewayList]);

  const operationMap = useMemo(
    () => ({
      [OperationType.associate]: {
        title: Strings.getLang('associateDevicePageTitle'),
        buttonText: Strings.getLang('associateDeviceButtonText'),
        progressTitle: Strings.getLang('associateDeviceProgressTitle'),
        getProgressResultTitle: (value: string) =>
          Strings.formatValue('associateDeviceProgressResultTitle', value),
        progressPrompt: Strings.getLang('associateDeviceProgressPrompt'),
        getProgressResultPrompt: (value: string) =>
          Strings.formatValue('associateDeviceProgressResultPrompt', value),
        onButtonClick: associateDevice,
      },
      [OperationType.disassociate]: {
        title: Strings.getLang('disassociateDevicePageTitle'),
        buttonText: Strings.getLang('disassociateDeviceButtonText'),
        progressTitle: '',
        getProgressResultTitle: () => '',
        progressPrompt: '',
        getProgressResultPrompt: () => '',
        onButtonClick: disassociateDevice,
      },
      [OperationType.migrate]: {
        title: Strings.getLang('migrateToOtherGatewayPageTitle'),
        buttonText: Strings.getLang('migrateToOtherGatewayButtonText'),
        progressTitle: Strings.getLang('migrateToOtherGatewayProgressTitle'),
        getProgressResultTitle: (value: string) =>
          Strings.formatValue('migrateToOtherGatewayProgressResultTitle', value),
        progressPrompt: Strings.getLang('migrateToOtherGatewayProgressPrompt'),
        getProgressResultPrompt: (value: string) =>
          Strings.formatValue('migrateToOtherGatewayProgressResultPrompt', value),
        onButtonClick: migrateToOtherGateways,
      },
    }),
    [associateDevice, disassociateDevice, migrateToOtherGateways]
  );

  const currentOperation = useMemo(() => operationMap[operationType], [operationMap]);

  return currentOperation;
};

export default useGetOperationMap;
