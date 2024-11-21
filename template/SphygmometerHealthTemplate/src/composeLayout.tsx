import React, { Component } from 'react';
import { DevInfo, kit } from '@ray-js/panel-sdk';
import { connectBluetoothDevice, getSystemInfoSync, publishDps } from '@ray-js/ray';
import { Provider } from 'react-redux';

import { getDeviceCloudData } from './api';
import { dpCodes } from './config';
import { devices, dpKit } from './devices';
import store from './redux';
import { initData, initUserData, reportPanelData, updateUI } from './redux/action';
import { devInfoChange } from './redux/modules/devInfoSlice';
import { initializeSystemInfo } from './redux/modules/systemInfoSlice';
import { updateThemeType } from './redux/modules/themeSlice';

import './styles/index.less';

import { checkDpExist, formatDps, getDeviceOnlineState, getDevId } from './utils';

const { initDevInfo } = kit;

const { userMarkCode, userSetCode } = dpCodes;

interface Props {
  devInfo: DevInfo;
  extraInfo?: Record<string, any>;
}

interface State {
  devInfo: DevInfo;
}

// 蓝牙连接逻辑
let timerID = null;
const startConnectBleDevice = (deviceOnline: boolean, devId: string) => {
  timerID && clearInterval(timerID);
  // 如果设备在线则返回
  if (deviceOnline || !devId) {
    return;
  }
  const connect = () => {
    connectBluetoothDevice({
      devId,
      success: () => {
        console.log('connect success');
        timerID && clearInterval(timerID);
      },
      fail: err => {
        console.warn('connect fail', err);
      },
    });
  };
  // 先重连一次，再每隔 10 秒触发重连
  try {
    connect();
    timerID = setInterval(() => {
      try {
        console.log('connectBluetoothDevice ==>', devId);
        connect();
      } catch (e) {
        console.warn(e);
      }
    }, 10000);
  } catch (e) {
    console.warn(e);
  }
};

/**
 * 面板离线连接成功下发当前面板用户
 */
const onlinePutDp = async () => {
  if (!checkDpExist(userSetCode)) return;

  const { uiState } = store.getState();
  if (uiState.defaultUser) {
    publishDps({ [userSetCode]: uiState.defaultUser });
  }
};

const init = async (deviceOnline: boolean) => {
  try {
    const isCompleteUser = await getDeviceCloudData('isCompleteUser');
    if (!isCompleteUser) {
      updateUI({ isNeedToComplete: true });
    }

    updateUI({
      bleState: devices.common.getBluetooth().available,
      isBleOnline: deviceOnline,
    });

    // 首次进入初始化面板数据
    await initUserData();
    await initData();

    if (deviceOnline) {
      onlinePutDp();
      updateUI({ devOnlineTime: new Date().getTime() });
    }
  } catch (error) {
    console.warn('onApplyConfig Failed :>> ', error);
  }
};

const composeLayout = (SubComp: React.ComponentType<any>) => {
  const { dispatch } = store;
  return class PanelComponent extends Component<Props, State> {
    async onLaunch(object: any) {
      console.log('=== App onLaunch', object);
      devices.common.init();
      devices.common.onInitialized(device => dpKit.init(device));

      // 监听设备在线状态变化
      devices.common.onDeviceOnlineStatusUpdate(({ online }) => {
        updateUI({ isBleOnline: online });
        startConnectBleDevice(online, getDevId());

        if (!online) return;

        onlinePutDp();
        updateUI({ devOnlineTime: new Date().getTime() });
      });

      // 监听蓝牙适配器变化
      devices.common.onBluetoothAdapterStateChange(({ available }) => {
        updateUI({ bleState: available });
      });

      // 监听 DP 功能点变更
      devices.common.onDpDataChange(data => {
        console.log('data ==>', data);
        const ishaveUserMark = checkDpExist(userMarkCode);
        const { userList, devOnlineTime } = store.getState().uiState;

        const dpState = formatDps(data) as any;

        const { systolic_bp, diastolic_bp, pulse, arrhythmia, user_mark } = dpState;

        if (ishaveUserMark && user_mark) {
          updateUI({
            currentUserType: userList.find(item => item.userTypeCode === user_mark)?.userType,
          });
        }

        // reportPanelData({
        //   systolic_bp,
        //   diastolic_bp,
        //   pulse,
        //   arrhythmia: arrhythmia || false,
        //   user_mark: ishaveUserMark ? user_mark : '',
        //   dpsTime: +new Date(),
        // });
      });

      const systemInfo = getSystemInfoSync();
      const { theme } = systemInfo;

      dispatch(initializeSystemInfo(systemInfo));
      dispatch(updateThemeType(theme));

      const deviceInfo = await initDevInfo();
      dispatch(devInfoChange(deviceInfo));

      const deviceOnline = await getDeviceOnlineState();

      init(deviceOnline);

      startConnectBleDevice(deviceOnline, deviceInfo.devId);
    }

    render() {
      const { extraInfo } = this.props;

      return (
        <Provider store={store}>
          {/* @ts-ignore */}
          <SubComp extraInfo={extraInfo} {...this.props} />
        </Provider>
      );
    }
  };
};

export default composeLayout;
