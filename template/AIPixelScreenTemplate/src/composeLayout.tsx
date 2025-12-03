import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { getSystemInfoSync, clearStorage } from '@ray-js/ray';
import { devices, dpKit } from './devices';
import { updateThemeType } from './redux/modules/themeSlice';
import { initializeSystemInfo } from './redux/modules/systemInfoSlice';
import { initPhotosAsync } from './redux/modules/albumSlice';
import { initDiyAsync } from './redux/modules/diySlice';
import { initMessageAsync, initLabelAsync } from './redux/modules/messageSlice';
import { setDevInfo } from './utils/devInfo';
import store from './redux';
import './styles/index.less';

type LaunchOption = {
  query: { deviceId: string; realFn?: string; active: number };
};

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
    async onLaunch(opt: LaunchOption) {
      console.log('=== App onLaunch', opt);
      const deviceId = opt?.query?.deviceId;
      devices.common.init();
      devices.common.onInitialized(device => {
        setDevInfo({ devId: deviceId });
        dpKit.init(device);
        dispatch(initPhotosAsync());
        dispatch(initDiyAsync());
        dispatch(initMessageAsync());
        dispatch(initLabelAsync());
      });

      const systemInfo = getSystemInfoSync();
      const { theme } = systemInfo;

      dispatch(initializeSystemInfo(systemInfo));
      dispatch(updateThemeType(theme));
      clearStorage();
      ty.device.subscribeBLETransparentDataReport({
        deviceId,
        success: () => {
          console.log('subscribeBLETransparentDataReport success');
        },
        fail: () => {
          console.log('subscribeBLETransparentDataReport fail');
        },
      });
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
