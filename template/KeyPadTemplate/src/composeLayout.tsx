import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { onDpDataChange, offDpDataChange } from '@ray-js/ray';
import {
  init as initFit,
  destroy as destroyFit,
  getActivePeriod,
  getAlarms,
  getAlarmUnreadCount,
  getBoundLockList,
  getCurrentUser,
  getDeviceStatus,
  onDeviceStatusChange,
  offDeviceStatusChange,
  UserType,
  type DeviceStatus,
} from '@ray-js/lock-sdk';
import { devices } from './devices';
import {
  setRecentAlarm,
  setAlarmUnReadCount,
  setBleOnline,
  setSaveTime,
  setHasBindLockList,
  setCurrentUser,
} from './redux/modules/lockHomeSlice';
import { alarmDpCodes } from './constant';
import store from './redux';

// 兼容 react-redux 7 与 SDK 依赖中不同版本的 React 类型声明。
const StoreProvider = Provider as unknown as React.ComponentType<{
  store: typeof store;
  children?: React.ReactNode;
}>;

const composeLayout = (SubComp: React.ComponentType<any>) => {
  const { dispatch } = store;
  return class PanelComponent extends Component {
    componentDidMount() {
      onDpDataChange(this.handleDpDataChange);
    }

    componentWillUnmount() {
      this.disposed = true;
      offDpDataChange(this.handleDpDataChange);
      if (this.initializedListenerId !== undefined) {
        devices.common.offInitialized(this.initializedListenerId);
      }
      if (this.alarmTimer) clearTimeout(this.alarmTimer);
      if (this.sdkReady) {
        offDeviceStatusChange(this.handleDeviceStatusChange);
        destroyFit();
      }
    }

    onLaunch() {
      // 先注册监听，再初始化设备，避免漏掉初始化回调。
      this.initializedListenerId = devices.common.onInitialized(async device => {
        if (this.disposed) return;
        const devInfo = device.getDevInfo() as DevInfo;
        (devInfo.schema || []).forEach((item: { id: number; code: string }) => {
          this.codesById[String(item.id)] = item.code;
        });

        try {
          await initFit({ devInfo, kind: 'fit' });
        } catch (error) {
          console.log('Accessory SDK initialization failed', error);
          return;
        }
        if (this.disposed) {
          destroyFit();
          return;
        }
        this.sdkReady = true;
        onDeviceStatusChange(this.handleDeviceStatusChange);
        this.handleDeviceStatusChange(getDeviceStatus());
        this.refreshHomeData();
      });
      devices.common.init();
    }

    onShow() {
      if (this.sdkReady) this.refreshHomeData();
    }

    private codesById: Record<string, string> = {};

    private initializedListenerId?: number;

    private sdkReady = false;

    private disposed = false;

    private alarmTimer?: ReturnType<typeof setTimeout>;

    private refreshAlarms = () => {
      getAlarms({ pageSize: 1 })
        .then(result => {
          if (!this.disposed) dispatch(setRecentAlarm(result.list[0] || null));
        })
        .catch(error => console.log('getAlarms failed', error));
      getAlarmUnreadCount()
        .then(count => {
          if (!this.disposed) dispatch(setAlarmUnReadCount(Number(count) || 0));
        })
        .catch(error => console.log('getAlarmUnreadCount failed', error));
    };

    private refreshHomeData = () => {
      this.refreshAlarms();
      getActivePeriod()
        .then(days => {
          if (!this.disposed) dispatch(setSaveTime(Number(days) || 0));
        })
        .catch(error => console.log('getActivePeriod failed', error));
      getCurrentUser()
        .then(user => {
          if (this.disposed) return;
          dispatch(setCurrentUser(user || null));
          const userType = Number(user?.userType);
          if (userType !== UserType.OWNER && userType !== UserType.ADMIN) {
            dispatch(setHasBindLockList(null));
            return;
          }
          getBoundLockList()
            .then(list => {
              if (!this.disposed) dispatch(setHasBindLockList(Array.isArray(list) ? list : []));
            })
            .catch(error => console.log('getBoundLockList failed', error));
        })
        .catch(error => console.log('getCurrentUser failed', error));
    };

    private handleDpDataChange = (params: { devId?: string; dps: Record<string, any> }) => {
      if (!this.sdkReady || this.disposed || !params.dps) return;
      if (params.devId && params.devId !== devices.common.getDevInfo().devId) return;
      const hasAlarm = Object.keys(params.dps).some(id =>
        alarmDpCodes.includes(this.codesById[id])
      );
      if (!hasAlarm) return;
      if (this.alarmTimer) clearTimeout(this.alarmTimer);
      this.alarmTimer = setTimeout(() => {
        if (!this.disposed) this.refreshAlarms();
      }, 500);
    };

    private handleDeviceStatusChange = (status: DeviceStatus) => {
      if (!this.disposed) dispatch(setBleOnline(!!status?.onlineTypes?.includes('ble')));
    };

    render() {
      return (
        <StoreProvider store={store}>
          <SubComp {...this.props} />
        </StoreProvider>
      );
    }
  };
};

export default composeLayout;
