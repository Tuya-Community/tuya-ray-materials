import React, { FC, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { hooks } from '@ray-js/panel-sdk';
import { View, ScrollView, usePageEvent, home, openPanel, router } from '@ray-js/ray';
import _throttle from 'lodash/throttle';
import _cloneDeep from 'lodash/cloneDeep';
import _get from 'lodash/get';
import { isIOS } from '@ray-js/env';
import { DeviceItem, BottomButton, Empty, SelectBar, TopBar, ActionPopup } from '@/components';
import {
  toNativePage,
  hasBleCapability,
  hasZigbeeCapability,
  hasThreadCapability,
  getTypeIcon,
  showErrorMsgModal,
  setPageNavigationBar,
  getIsOnline,
  checkCapability,
  parseQuery,
} from '@/utils';
import Strings from '@/i18n';
import { selectThemeByKey } from '@/redux/modules/themeSlice';
import Res from '@/res';
import {
  useGetRoomList,
  useGetSubDevList,
  useGetGatewayCapability,
  useGetMigratableGatewayList,
} from '@/hooks';
import { DeviceManageOptions, ExtraInfo, DisplayedDevItem, DevInfo, IHomeInfo } from '@/types';
import {
  offlineDisabledOptions,
  manageMenuConfigList,
  SUB_DEVICE_LIST_CACHE_KEY_SUFFIX,
  subDevPageTitle,
} from '@/constant';
import styles from './index.module.less';

interface ISubDeviceProps {
  location?: { query: ExtraInfo };
}

const { getCurrentHomeInfo } = home;
const { useDevInfo } = hooks;

const Home: FC<ISubDeviceProps> = ({ location }) => {
  const devInfo = useDevInfo() || ({} as DevInfo);
  const { manageMenuList, deviceCapabilities } = useMemo(
    () => parseQuery(location.query),
    [location.query]
  );
  const subDeviceListCacheKey = `${devInfo.devId}${SUB_DEVICE_LIST_CACHE_KEY_SUFFIX}`;
  const themeType = useSelector(selectThemeByKey('type'));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customDevInfoMap, setCustomDevInfoMap] = useState({});
  const [homeInfo, setHomeInfo] = useState<IHomeInfo>({});
  const [visible, setVisible] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<number | string>(0);
  const homeId = useRef('');
  const changeDeviceDpsTimeout = useRef(-1) as any;
  const hideLoadingTimeout = useRef(-1) as any;

  const { list: migratableGatewayList, refresh: refreshMigratableGatewayList } =
    useGetMigratableGatewayList(devInfo as DevInfo);

  const {
    subDevList = [],
    runAsync,
    refreshAsync: refreshSubDevListAsync,
    mutate,
  } = useGetSubDevList(devInfo.devId, {
    manual: true,
    onSuccess: data => {
      if (isIOS) {
        const simpleData = data.map(d => ({
          devId: d.devId,
          pcc: d.pcc,
          isOnline: d.isOnline,
          name: d.name,
          icon: d.icon,
        }));
        ty.setStorageSync({
          key: subDeviceListCacheKey,
          data: JSON.stringify(simpleData),
        });
      }
    },
  });

  const { data = [], refreshAsync: refreshGatewayCapabilityAsync } = useGetGatewayCapability(
    JSON.stringify([devInfo.devId])
  );

  const [
    {
      isSupportBleSignalDetect = false,
      isSupportZigbeeSignalDetect = false,
      isSupportTreadSignalDetect: isSupportThreadSignalDetect = false,
      bluLimitation = 128,
    },
  ] = data.length ? data : [{}];
  const { roomList = [], refreshAsync: refreshRoomListAsync } = useGetRoomList(homeId.current, {
    onError: e => showErrorMsgModal(e, 'Get room list fail: '),
  });
  const options = useMemo(() => {
    const transformedList = roomList.map(({ roomId, name }) => ({
      label: name,
      value: roomId,
    }));
    return [{ label: Strings.getLang('allRooms'), value: 0 }, ...transformedList];
  }, [roomList]);

  const displayedSubDevList: DisplayedDevItem[] = useMemo(() => {
    const deviceListWithRoomId = subDevList.map(device => {
      const roomItem = roomList.find(room => (room.deviceIds || []).includes(device.devId));
      return { ...device, roomName: roomItem?.name || '', roomId: roomItem ? roomItem.roomId : 0 };
    });
    let devListInRoom =
      currentRoomId === 0
        ? deviceListWithRoomId
        : deviceListWithRoomId.filter(d => Number(d.roomId) === Number(currentRoomId));

    if (Array.isArray(deviceCapabilities) && deviceCapabilities.length) {
      devListInRoom = devListInRoom.filter(({ capability }) =>
        deviceCapabilities.some(item => checkCapability(capability, item))
      );
    }

    const res = devListInRoom
      // 按激活时间倒序排列
      .sort((a, b) => b.activeTime - a.activeTime)
      .map(devItem => {
        const { capability, switchDps, dps, schema, devId } = devItem;
        const hasBle = hasBleCapability(capability);
        const hasZigbee = hasZigbeeCapability(capability);
        const hasThread = hasThreadCapability(capability);
        const typeIcon = getTypeIcon(capability);
        const isOnline = getIsOnline(devItem);

        let isWriteOnly = false;
        let quickSwitchImage;
        let switchDpsStatus;

        if (isOnline && Array.isArray(switchDps) && switchDps.length) {
          let realDps = dps;
          if (customDevInfoMap[devId] && customDevInfoMap[devId].dps) {
            realDps = customDevInfoMap[devId].dps;
          }
          quickSwitchImage = Res.switchClose;
          switchDpsStatus = false;
          switchDps.forEach(dpId => {
            const item = schema.find(({ id }) => id === dpId);
            if (item && item.mode === 'wr') {
              isWriteOnly = true;
            }
            if (realDps[dpId]) {
              quickSwitchImage = Res.switchOpen;
              switchDpsStatus = true;
            }
          });
          if (isWriteOnly) {
            quickSwitchImage = Res[themeType].switchSpecial;
          }
          if (customDevInfoMap[devId] && customDevInfoMap[devId].quickSwitchImage) {
            // eslint-disable-next-line prefer-destructuring
            quickSwitchImage = customDevInfoMap[devId].quickSwitchImage;
          }
        }
        return {
          ...devItem,
          hasBle,
          hasZigbee,
          hasThread,
          isOnline,
          typeIcon,
          quickSwitchImage,
          switchDpsStatus,
          isWriteOnly,
        };
      });
    return res;
  }, [
    deviceCapabilities,
    roomList,
    subDevList,
    currentRoomId,
    isSupportBleSignalDetect,
    isSupportZigbeeSignalDetect,
    isSupportThreadSignalDetect,
    customDevInfoMap,
  ]);

  const deviceManageOptions = useMemo(() => {
    let finalList = [...manageMenuConfigList];
    if (Array.isArray(manageMenuList) && manageMenuList.length) {
      finalList = manageMenuList.map(item => {
        const menuItem = manageMenuConfigList.find(({ value }) => item === value);
        if (menuItem) {
          return { label: menuItem.label, value: item };
        }
        return item;
      });
    }
    if (!devInfo.isCloudOnline) {
      return finalList.filter(item => !offlineDisabledOptions.includes(item.value));
    }
    return finalList;
  }, [manageMenuList, devInfo.isCloudOnline]);

  useEffect(() => {
    if (isIOS) {
      const cache = ty.getStorageSync({ key: subDeviceListCacheKey });
      console.log('cache :>> ', cache);
      if (cache) {
        const res = JSON.parse(cache);
        if (Array.isArray(res)) {
          mutate(res);
        }
      }
    }
    fetchSubDevListData();
    setPageNavigationBar('', themeType);
    getCurrentHomeInfo({
      success: res => {
        setHomeInfo(res);
        homeId.current = res.homeId;
      },
    });
    return () => {
      clearTimeout(hideLoadingTimeout.current);
      hideLoadingTimeout.current = -1;
    };
  }, []);

  const getTitle = () => {
    let title = Strings.getLang('titleSubDevice');
    if (deviceCapabilities && deviceCapabilities.length) {
      const item = subDevPageTitle.find(page =>
        deviceCapabilities.every(devCap => page.capabilityList.includes(devCap))
      );
      if (item) {
        // eslint-disable-next-line prefer-destructuring
        title = item.title;
      }
    }
    return title;
  };

  usePageEvent('onShow', () => {
    refreshSubDevListAsync();
  });

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
    refreshGatewayCapabilityAsync();
    refreshSubDevListAsync();
    refreshRoomListAsync();
    refreshMigratableGatewayList();
  };

  const fetchSubDevListData = async () => {
    ty.showLoading({
      title: Strings.getLang('loading'),
      mask: false,
    });
    clearTimeout(hideLoadingTimeout.current);
    hideLoadingTimeout.current = setTimeout(() => {
      ty.hideLoading();
    }, 2 * 1000);
    await runAsync(devInfo.devId).finally(() => {
      // 增加延时，从数据获取完成到页面渲染有一段白屏的时间
      setTimeout(() => {
        ty.hideLoading();
      }, 1 * 500);
    });
  };

  const publishQuickSwitchDps = (devItem: DisplayedDevItem) => {
    const { devId, switchDps, switchDpsStatus, isWriteOnly } = devItem;
    const dps = {};
    const customDevInfo: Record<string, any> = {};
    if (Array.isArray(switchDps) && switchDps.length) {
      switchDps.forEach(d => {
        dps[d] = !switchDpsStatus;
      });
    }
    customDevInfo.dps = dps;
    if (isWriteOnly) {
      if (customDevInfoMap[devId] && customDevInfoMap[devId].loading) {
        return;
      }
      customDevInfo.quickSwitchImage = Res.sendDpsLoading;
      customDevInfo.loading = true;
    } else {
      clearTimeout(changeDeviceDpsTimeout.current);
      changeDeviceDpsTimeout.current = setTimeout(() => {
        setCustomDevInfoMap(pre => ({
          ...pre,
          [devId]: { ...pre[devId], dps: undefined },
        }));
      }, 10 * 1000);
    }

    setCustomDevInfoMap(pre => ({
      ...pre,
      [devId]: { ...pre[devId], ...customDevInfo },
    }));

    ty.device.publishDps({
      deviceId: devId,
      dps,
      mode: 2,
      pipelines: [0, 1, 2, 3],
      options: {},
      complete: () => {
        if (isWriteOnly) {
          setTimeout(() => {
            setCustomDevInfoMap(pre => ({
              ...pre,
              [devId]: { ...pre[devId], quickSwitchImage: Res.quickArrow, dps },
            }));
            setTimeout(() => {
              setCustomDevInfoMap(pre => ({
                ...pre,
                [devId]: { ...pre[devId], quickSwitchImage: undefined, loading: false },
              }));
            }, 1000);
          }, 2000);
        }
      },
    });
  };

  const throttlePublishQuickSwitchDps = _throttle(publishQuickSwitchDps, 1000, { trailing: false });

  const toDevicePanel = (devId: string) => {
    openPanel({
      deviceId: devId,
      fail: e => showErrorMsgModal(e, 'openPanel fail:'),
    });
  };

  const renderList = () => {
    return (
      <ScrollView
        scrollY
        refresherEnabled
        refresherBackground="transparent"
        refresherTriggered={isRefreshing}
        onRefresherrefresh={onRefresh}
        className={styles['device-list']}
      >
        {displayedSubDevList.length ? (
          displayedSubDevList.map(d => {
            const { devId, quickSwitchImage, name, iconUrl, roomName, typeIcon } = d;
            return (
              <DeviceItem
                key={devId}
                name={name}
                icon={iconUrl}
                isShowMore={false}
                className={styles['device-item']}
                leftImage={typeIcon}
                roomName={roomName}
                leftImageClassName={styles[`device-item-icon-type`]}
                onItemClick={() => toDevicePanel(devId)}
                onLeftImageClick={() => throttlePublishQuickSwitchDps(d)}
                onBottomQuickSwitchClick={() => throttlePublishQuickSwitchDps(d)}
                hasBottomQuickSwitch
                bottomQuickSwitchImage={quickSwitchImage}
              />
            );
          })
        ) : (
          <View className={styles['empty-container']}>
            <Empty tips={Strings.getLang('noEquipment')} tipsClassName={styles['empty-tips']} />
          </View>
        )}
      </ScrollView>
    );
  };

  const renderBottomButtonLine = () =>
    !!homeInfo.admin && (
      <BottomButton
        themeColor="var(--theme-color)"
        text={Strings.getLang('deviceManagement')}
        onClick={() => setVisible(true)}
      />
    );

  const handleDeviceManageActionSheetSelect = useCallback(
    (value: string | number) => {
      const bleList = subDevList.filter(({ capability }) => hasBleCapability(capability));
      const limit = bluLimitation - bleList.length;
      switch (value) {
        case DeviceManageOptions.addNewDevice:
        default:
          toNativePage(`thingsmart://device_only_search_config_gw_sub?gwId=${devInfo.devId}`);
          break;
        case DeviceManageOptions.associateDevice:
          if (limit <= 0) {
            ty.showModal({
              title: Strings.getLang('tips'),
              content: Strings.formatValue('maxLimitWithNumber', bluLimitation),
              showCancel: false,
              confirmText: Strings.getLang('confirm'),
            });
            return;
          }
          toDragSubPage(value);
          break;
        case DeviceManageOptions.disassociateDevice:
          toDragSubPage(value);
          break;
        case DeviceManageOptions.migrateToOtherGateways:
          if (!migratableGatewayList.length) {
            ty.showToast({
              title: Strings.getLang('noSelectableGateway'),
              icon: 'none',
              duration: 2000,
            });
            return;
          }
          toDragSubPage(value);
          break;
        case DeviceManageOptions.matterScanAdd:
          toNativePage(`thingsmart://scan?gwId=${devInfo.devId}&source=matter`);
          break;
      }
      setTimeout(() => {
        setVisible(false);
      }, 500);
    },
    [devInfo.devId, devInfo.isLocalOnline, subDevList, bluLimitation, migratableGatewayList.length]
  );

  const toDragSubPage = (operationType: DeviceManageOptions) => {
    router.push(`/drag?operationType=${encodeURIComponent(JSON.stringify(operationType))}`);
  };

  const renderSelectBar = () => {
    return (
      <SelectBar
        options={options}
        value={currentRoomId}
        onSelect={roomId => setCurrentRoomId(roomId)}
      />
    );
  };

  return (
    <>
      <View className={styles.view}>
        <TopBar title={getTitle()} />
        <View className={styles.container}>
          {!!subDevList.length && renderSelectBar()}
          {renderList()}
          {renderBottomButtonLine()}
        </View>
      </View>
      <ActionPopup
        visible={visible}
        deviceManageOptions={deviceManageOptions}
        handleClose={() => setVisible(false)}
        handleClickItem={handleDeviceManageActionSheetSelect}
      />
    </>
  );
};

export default Home;
