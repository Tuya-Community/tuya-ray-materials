import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
  getSystemInfoSync,
  initDevInfo,
  onDeviceOnlineStatusUpdate,
  registerDeviceListListener,
} from '@ray-js/ray';
import log4js from '@ray-js/log4js';
import { devices, dpKit } from './devices';
import { updateThemeType } from './redux/modules/themeSlice';
import { initializeSystemInfo } from './redux/modules/systemInfoSlice';
import store from './redux';
import './styles/index.less';
import { APP_LOG_TAG } from './constant';

interface Props {
  devInfo: DevInfo;
  // eslint-disable-next-line react/require-default-props
  extraInfo?: Record<string, any>;
}

interface State {
  devInfo: DevInfo;
}

const composeLayout = (SubComp: React.ComponentType<any>) => {
  const { dispatch } = store;
  return class PanelComponent extends Component<Props, State> {
    async onLaunch(object: any) {
      console.log('=== App onLaunch', object);
      devices.common.init();
      devices.common.onInitialized(device => dpKit.init(device));
      const systemInfo = getSystemInfoSync();
      const { theme } = systemInfo;

      log4js.setTag(APP_LOG_TAG);

      dispatch(initializeSystemInfo(systemInfo));
      dispatch(updateThemeType(theme));

      // 监听设备离在线状态
      const devInfoInitial = await initDevInfo();
      const { devId } = devInfoInitial;

      const _onDeviceOnlineStatusUpdate = event => {
        log4js.info('==> onlineStatusUpdate', JSON.stringify(event));
      };

      registerDeviceListListener({
        deviceIdList: [devId],
        success: () => {
          console.log('registerDeviceListListener success');
        },
        fail: error => {
          console.log('registerDeviceListListener fail', error);
        },
      });
      onDeviceOnlineStatusUpdate(_onDeviceOnlineStatusUpdate);
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
