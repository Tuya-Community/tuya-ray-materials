import { ScrollView, View } from '@ray-js/components';
import { hooks } from '@ray-js/panel-sdk';
import { usePageEvent, hideLoading, showToast } from '@ray-js/ray';
import to from 'await-to-js';
import _ from 'lodash';
import React, { FC, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import Strings from '@/i18n';
import { OperationType, DeviceCapability, DevInfo } from '@/types';
import {
  showModal,
  showLoading,
  showErrorMsgModal,
  getGatewayLimitation,
  hasBleCapability,
  hasManageMatterCapability,
  calcBluLimitation,
  setPageNavigationBar,
  getIsOnline,
  hasManageBleCapability,
  getAddableItemByGatewayInfo,
  getAddableBleItemByGatewayInfo,
  checkCapability,
  transformMac,
  parseQuery,
  isGateway,
} from '@/utils';
import { useSelector } from 'react-redux';
import { selectThemeByKey } from '@/redux/modules/themeSlice';
import { BottomButton, Empty, DragDeviceItem, SelectPopup, OperationProgress } from '@/components';
import {
  getGatewayAbility,
  getSubDeviceList,
  getCurrentHomeId,
  registerGateWaySubDeviceListener,
  unregisterGateWaySubDeviceListener,
  getDeviceList,
} from '@/api';
import { useGetRoomList, useGetOperationConfig, useGetDragDisplayedDevList } from '@/hooks';
import TopView from './topView';
import styles from './index.module.less';

const { useDevInfo } = hooks;
const TIMEOUT_INTERVAL = 30 * 1000;
const defaultBluLimitation = Infinity;
let timeout;

interface ISubDeviceProps {
  location?: { query: { operationType: number } };
}

const Drag: FC<ISubDeviceProps> = ({ location }) => {
  const devInfo = useDevInfo() || ({} as DevInfo);
  const themeType = useSelector(selectThemeByKey('type'));
  const isCurrentGatewayHasManageBleCapability = hasManageBleCapability(devInfo.protocolAttribute);
  const isCurrentGatewayHasManageMatterCapability = hasManageMatterCapability(
    devInfo.protocolAttribute
  );
  const { operationType } = useMemo(() => parseQuery(location.query), [location.query]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [subDeviceList, setSubDeviceList] = useState([]);
  const [migratableGatewayList, setMigratableGatewayList] = useState([]); // 可供迁移时选择的网关列表
  const [selectedIds, setSelectedIds] = useState([]);
  const [bluLimitationNum, setBluLimitationNum] = useState<number>(defaultBluLimitation);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [selectedGatewayId, setSelectedGatewayId] = useState('');
  const [showSelectGateway, setShowSelectGateway] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<number | string>(0);
  const homeId = useRef('');
  const { roomList = [], refreshAsync: refreshRoomListAsync } = useGetRoomList(homeId.current, {
    onError: e => showErrorMsgModal(e, 'Get room list fail: '),
  });

  const displayDataSource = useMemo(
    () =>
      operationType === OperationType.associate
        ? deviceList.filter(
            // 关联列表展示非网关设备、蓝牙子设备
            item =>
              !isGateway(item.protocolAttribute) &&
              isCurrentGatewayHasManageBleCapability &&
              getAddableBleItemByGatewayInfo(item, devInfo)
          )
        : subDeviceList,
    [deviceList, devInfo, subDeviceList, operationType]
  );

  const selectedDeviceList = useMemo(
    () => displayDataSource.filter(dev => selectedIds.includes(dev.devId)),
    [displayDataSource, selectedIds]
  );

  const restSelectableNum = useMemo(() => {
    // 如果当前操作类型是关联到网关或者迁移。并且已经获取了对应的子设备数量上限
    if (
      (operationType === OperationType.associate || operationType === OperationType.migrate) &&
      bluLimitationNum !== undefined
    ) {
      return Math.max(bluLimitationNum - selectedIds.length, 0);
    }
    return Infinity;
  }, [selectedIds.length, bluLimitationNum]);

  const isReachLimitation = useMemo(() => restSelectableNum <= 0, [restSelectableNum]);

  const refetchData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
    refreshRoomListAsync();
    fetchData(false, true);
    if (
      operationType === OperationType.migrate &&
      selectedGatewayId &&
      isCurrentGatewayHasManageBleCapability
    ) {
      getTargetGatewayCurrentBluLimitation(selectedGatewayId);
    }
  };

  const fetchData = async (isShowLoading = false, isRefresh = false) => {
    try {
      if (isShowLoading) {
        showLoading({
          title: Strings.getLang('requesting'),
        });
      }
      const promiseList: Promise<any>[] = [fetchCurrentHomeId(), fetchSubDeviceList()];
      if (operationType === OperationType.associate) {
        promiseList.push(getGatewayLimitation(devInfo.devId));
        const [tempHomeId, tempSubDevList, limitation] = await Promise.all(promiseList);
        fetchDeviceList();
        const bleList = tempSubDevList.filter(({ capability }) => hasBleCapability(capability));
        setBluLimitationNum(calcBluLimitation(limitation, bleList.length, tempSubDevList.length));
      } else if (operationType === OperationType.disassociate) {
        Promise.all(promiseList);
      } else if (operationType === OperationType.migrate) {
        await Promise.all(promiseList);
        const allDevList = await fetchDeviceList();
        const tempBleGatewayList = [];
        (allDevList as DevInfo[]).forEach(devItem => {
          if (getIsOnline(devItem) && devItem.devId !== devInfo.devId) {
            if (
              hasManageBleCapability(devItem.protocolAttribute) &&
              isCurrentGatewayHasManageBleCapability
            ) {
              tempBleGatewayList.push(devItem);
            }
          }
        });
        if (tempBleGatewayList.length) {
          getGatewayAbility(JSON.stringify(tempBleGatewayList.map(d => d.devId))).then(res => {
            const filterRes = tempBleGatewayList.filter(d => {
              const item = res.find(r => r.devId === d.devId);
              return item ? item?.subMaximum?.data?.blu > 0 : false;
            });
            setMigratableGatewayList(filterRes);
          });
        }
        if (!isRefresh) {
          setShowSelectGateway(true);
        }
      }
      setTimeout(() => {
        hideLoading();
      }, 1000);
    } catch (error) {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchData(true, false);
    setPageNavigationBar(currentOperation.title, themeType);
  }, []);

  const fetchCurrentHomeId = async () => {
    const res = await getCurrentHomeId();
    homeId.current = res;
    return res;
  };

  const fetchSubDeviceList = async () => {
    const [err, data] = await to(getSubDeviceList(devInfo.devId));
    if (!err) {
      setSubDeviceList(data);
      return data;
    }
    return [];
  };

  const fetchDeviceList = async () => {
    const [err, data] = await to(getDeviceList(homeId.current));
    if (!err) {
      const list = data.filter(item => getAddableItemByGatewayInfo(item, devInfo));
      // 这里存储可拖拽子设备，包含网关
      setDeviceList(list);
      return data;
    }
    return [];
  };

  const countDown = (gwId: string, progress?: number) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setIsEnd(true);
      unregisterGateWaySubDeviceListener(gwId);
      if (!progress) {
        showModal(Strings.getLang('tips'), Strings.getLang('noFeedbackTip'), {
          showCancel: false,
        });
      }
    }, TIMEOUT_INTERVAL);
  };

  // 拖拽成功后，要重新获取列表。因此要更新已选择设备列表，把已经不存在的剔除
  useEffect(() => {
    setSelectedIds(pre => pre.filter(id => displayDataSource.some(({ devId }) => id === devId)));
  }, [displayDataSource]);

  // 开始监听进度变化, gwId: 网关id
  const startListenProgressChange = useCallback(
    (gwId: string, repeatIds: string[] = []) => {
      setShowProgress(true);
      // 全部为重复拖拽，直接成功
      if (repeatIds.length === selectedIds.length) {
        setCurrentProgress(selectedIds.length);
        setIsEnd(true);
        unregisterGateWaySubDeviceListener(gwId);
        return;
      }
      setIsEnd(false);
      setCurrentProgress(0);
      const callback = _.throttle(
        async () => {
          const list = await getSubDeviceList(gwId);
          const successList = selectedIds.filter(item => {
            const deviceInfo = _.find(selectedDeviceList, { devId: item });
            const { capability, nodeId, devId, mac } = deviceInfo;
            let isRepeat = false;
            const isSigMesh = checkCapability(capability, [DeviceCapability.SIGMESH]);
            const isBeacon = checkCapability(capability, [DeviceCapability.BEACON]);
            if (isSigMesh) {
              isRepeat = repeatIds.includes(nodeId); // mesh设备判断nodeId
            } else if (isBeacon) {
              isRepeat = repeatIds.includes(transformMac(mac, true, false));
            } else {
              isRepeat = repeatIds.includes(devId);
            }
            return list.some(devItem => devItem.devId === item) || isRepeat;
          });
          const progress = successList.length;
          setCurrentProgress(progress);
          if (progress === selectedIds.length) {
            setIsEnd(true);
            clearTimeout(timeout);
            unregisterGateWaySubDeviceListener(gwId);
          } else {
            countDown(gwId, progress);
          }
        },
        300,
        { trailing: true }
      );
      countDown(gwId);
      registerGateWaySubDeviceListener(gwId, callback);
    },
    [selectedIds]
  );

  const disassociateCallBack = () => {
    setSubDeviceList(pre => pre.filter(d => !selectedIds.includes(d.devId)));
  };

  const currentOperation = useGetOperationConfig({
    operationType,
    selectedDeviceList,
    startListenProgressChange,
    devInfo,
    disassociateCallBack,
    migratableGatewayList,
    selectedGatewayId,
    setShowSelectGateway,
  });

  const displayedDevList = useGetDragDisplayedDevList({
    roomList,
    displayDataSource,
    currentRoomId,
    operationType,
    selectedGatewayId,
    migratableGatewayList,
    devInfo,
  });

  const toggleSelect = useCallback(
    (devId: string) => {
      if (selectedIds.includes(devId)) {
        setSelectedIds(pre => pre.filter(d => d !== devId));
      } else if (!isReachLimitation) {
        setSelectedIds(pre => [...pre, devId]);
      }
    },
    [isReachLimitation, selectedIds]
  );

  const renderList = () => {
    return (
      <ScrollView
        scrollY
        refresherEnabled
        refresherDefaultStyle={themeType === 'dark' ? 'white' : 'dark'}
        refresherBackground="transparent"
        refresherTriggered={isRefreshing}
        onRefresherrefresh={refetchData}
        className={styles['device-list']}
      >
        {displayedDevList.length ? (
          displayedDevList.map(d => {
            const { devId, iconUrl, disabled, disabledReason } = d;
            const isSelected = selectedIds.includes(devId);
            const isDisabled = (!isSelected && isReachLimitation) || disabled;
            return (
              <DragDeviceItem
                {...d}
                checked={isSelected}
                disabled={isDisabled}
                className={styles['device-item']}
                key={devId}
                itemKey={devId}
                disabledReason={disabledReason}
                icon={iconUrl}
                onItemClick={toggleSelect}
              />
            );
          })
        ) : (
          <View className={styles['empty-container']}>
            <Empty tips={Strings.getLang('noEquipment')} />
          </View>
        )}
      </ScrollView>
    );
  };

  const checkSelectedNum = useCallback(async () => {
    const callback = currentOperation.onButtonClick;
    if (!selectedIds.length) {
      showToast({
        title: Strings.getLang('noSelect'),
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    callback();
  }, [currentOperation.onButtonClick, selectedIds.length]);

  const renderBottomButtonLine = useCallback(() => {
    return (
      <BottomButton
        themeColor="var(--theme-color)"
        text={currentOperation.buttonText}
        onClick={() => checkSelectedNum()}
      />
    );
  }, [checkSelectedNum]);

  const handleSelectGatewayConfirm = useCallback(
    async (devItem: DevInfo) => {
      if (!migratableGatewayList.length) {
        setShowSelectGateway(false);
        return;
      }
      if (_.isEmpty(devItem)) {
        ty.showToast({
          title: Strings.getLang('selectGateway'),
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      if (isCurrentGatewayHasManageBleCapability) {
        getTargetGatewayCurrentBluLimitation(devItem.devId);
      }
      setSelectedGatewayId(devItem.devId);
      setShowSelectGateway(false);
    },
    [selectedGatewayId, migratableGatewayList.length]
  );

  usePageEvent('onShow', () => {
    refreshSubDeviceList();
  });

  const refreshSubDeviceList = () => {
    if (operationType === OperationType.migrate) {
      setSubDeviceList(pre => pre.filter(d => !selectedIds.includes(d.devId)));
    } else if (operationType === OperationType.associate) {
      refetchData();
    }
  };

  const handleProgressClose = () => {
    setShowProgress(false);
    refreshSubDeviceList(); // 迁移后不调用接口刷新，手动刷新。因为ios app上存在异步mqtt问题
  };

  const getTargetGatewayCurrentBluLimitation = (gatewayId: string) => {
    Promise.all([getSubDeviceList(gatewayId), getGatewayLimitation(gatewayId)])
      .then(([devList, limitation]) => {
        const bleDevList = devList.filter(({ capability, isTripartiteMatter }) =>
          isCurrentGatewayHasManageMatterCapability
            ? isTripartiteMatter
            : hasBleCapability(capability)
        );
        setBluLimitationNum(calcBluLimitation(limitation, bleDevList.length, devList.length));
      })
      .catch(showErrorMsgModal);
  };

  const renderSelectBar = () => {
    return (
      <TopView
        roomList={roomList}
        displayedDevList={displayedDevList}
        selectedIds={selectedIds}
        isReachLimitation={isReachLimitation}
        bluLimitationNum={bluLimitationNum}
        restSelectableNum={restSelectableNum}
        setSelectedIds={setSelectedIds}
        currentRoomId={currentRoomId}
        setCurrentRoomId={setCurrentRoomId}
      />
    );
  };

  const renderSelectPopup = () => {
    return (
      <SelectPopup
        show={showSelectGateway}
        title={Strings.getLang('selectGateway')}
        subtitle={
          isCurrentGatewayHasManageMatterCapability
            ? Strings.getLang('migrateMatterDeviceTips')
            : ''
        }
        options={migratableGatewayList}
        showCancel={false}
        onConfirm={handleSelectGatewayConfirm}
        onCancel={() => setShowSelectGateway(false)}
      />
    );
  };

  const renderProgress = () => (
    <OperationProgress
      show={showProgress}
      isEnd={isEnd}
      selectedIds={selectedIds}
      currentProgress={currentProgress}
      currentOperation={currentOperation}
      handleProgressClose={handleProgressClose}
    />
  );

  return (
    <View className={styles.container}>
      {!!displayDataSource.length && renderSelectBar()}
      {renderList()}
      {renderBottomButtonLine()}
      {renderSelectPopup()}
      {renderProgress()}
    </View>
  );
};

export default Drag;
