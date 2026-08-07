import { useEffect, useState } from 'react';
import { device } from '@ray-js/ray';
import { kit } from '@ray-js/panel-sdk';
import store from '@/redux';
import Res from '@/res';
import Strings from '@/i18n';
import { updateDevsSync } from '@/redux/modules/deviceListSlice';
import { devInfoChange, updateDeviceOnline } from '@/redux/modules/devInfoSlice';
import { formatDevSchema, getCustomDevType, getOnlineStatus } from '@/utils';
import { DEVTYPES } from '@/constant/enums';

const { initDevInfo } = kit;
const { onDeviceOnlineStatusUpdate, offDeviceOnlineStatusUpdate } = device;

/**
 * 设备面板：仅当前面板设备 + 手机麦克风，不再拉取家庭多设备列表
 */
const getIcon = (type: string) => {
  switch (type) {
    case DEVTYPES.entry:
      return Res.entryEarIon;
    case DEVTYPES.pro:
      return Res.proIcon;
    case DEVTYPES.card:
      return Res.cardIcon;
    case DEVTYPES.phone:
      return Res.devSelctIconL;
    case DEVTYPES.os:
      return Res.entryEarIon;
    case DEVTYPES.glasses:
      return Res.glassesIcon;
    case DEVTYPES.wifiTrans:
      return Res.wifiTransIcon;
    default:
      return null;
  }
};

const getIconName = (type: string) => {
  switch (type) {
    case DEVTYPES.entry:
      return 'entryEarIon';
    case DEVTYPES.pro:
      return 'proIcon';
    case DEVTYPES.card:
      return 'cardIcon';
    case DEVTYPES.phone:
      return 'devSelctIconL';
    case DEVTYPES.os:
      return 'entryEarIon';
    case DEVTYPES.glasses:
      return 'glassesIcon';
    case DEVTYPES.wifiTrans:
      return 'wifiTransIcon';
    default:
      return null;
  }
};

const buildPhoneDev = () => ({
  devId: 'PHONE',
  devType: 'phone',
  customDevType: DEVTYPES.phone,
  isOnline: true,
  name: Strings.getLang('phone'),
  icon: Res.devSelctIconL,
  iconName: 'devSelctIconL',
  dps: {},
  schema: [],
});

const enrichPanelDev = async (raw: any) => {
  const item = { ...raw };
  const customDevType = getCustomDevType(item);
  const isOnline = await getOnlineStatus(item, customDevType);
  return {
    ...item,
    icon: getIcon(customDevType),
    iconName: getIconName(customDevType) as string,
    customDevType,
    isOnline,
    previewUrl: item.icon || item.iconUrl,
  };
};

/**
 * 单设备面板版设备同步：仅维护 [面板设备, PHONE]
 * @param _isAddOrDel 兼容旧签名，面板维度忽略增删设备
 */
export default function useDevChange(_isAddOrDel: boolean) {
  const homeId = store.getState()?.homeInfo?.homeId || '';
  const [isChangedCurrentDev, setIsChangedCurrentDev] = useState(false);

  const syncPanelAndPhone = async () => {
    try {
      const raw = await initDevInfo();
      if (!raw) {
        const phoneDev = buildPhoneDev();
        store.dispatch(devInfoChange(formatDevSchema(phoneDev)));
        store.dispatch(updateDevsSync([phoneDev]));
        return;
      }
      const panelDev = await enrichPanelDev(raw);
      const phoneDev = buildPhoneDev();
      const homeIdFromStore = store.getState()?.homeInfo?.homeId;
      const withHome = homeIdFromStore ? { ...panelDev, homeId: homeIdFromStore } : panelDev;
      store.dispatch(devInfoChange(formatDevSchema(withHome)));
      store.dispatch(updateDevsSync([withHome, phoneDev]));
    } catch (error) {
      console.error('[panel] syncPanelAndPhone failed', error);
      const phoneDev = buildPhoneDev();
      store.dispatch(devInfoChange(formatDevSchema(phoneDev)));
      store.dispatch(updateDevsSync([phoneDev]));
    }
  };

  const handleDevOnlineChange = async (data: { online: boolean; deviceId: string }) => {
    const { online, deviceId } = data;
    const devObj = store.getState()?.devInfo;
    const devlist = store.getState()?.deviceList || [];
    const changedDev = devlist?.find(item => item.devId === deviceId);
    if (!changedDev) {
      return;
    }
    const isChangedCurDev = devObj?.devId === deviceId;
    setIsChangedCurrentDev(isChangedCurDev);
    if (isChangedCurDev) {
      const isOnline = await getOnlineStatus(devObj, devObj?.customDevType, online);
      store.dispatch(updateDeviceOnline({ isOnline }));
    }
    const rDevs = await Promise.all(
      devlist.map(async dev => {
        if (dev.devId === deviceId) {
          const isOnline = await getOnlineStatus(dev, dev.customDevType, online);
          return { ...dev, isOnline };
        }
        return dev;
      })
    );
    store.dispatch(updateDevsSync(rDevs));
  };

  useEffect(() => {
    syncPanelAndPhone();
  }, []);

  useEffect(() => {
    if (!homeId) {
      return undefined;
    }
    // homeId 就绪后补写到当前面板设备
    const current = store.getState()?.devInfo;
    if (current?.devId && current.devId !== 'PHONE') {
      store.dispatch(devInfoChange({ homeId }));
    }
    return undefined;
  }, [homeId]);

  useEffect(() => {
    offDeviceOnlineStatusUpdate(handleDevOnlineChange);
    onDeviceOnlineStatusUpdate(handleDevOnlineChange);
    return () => {
      offDeviceOnlineStatusUpdate(handleDevOnlineChange);
    };
  }, []);

  return { isChangedCurrentDev, activeSuccess: false };
}
