import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { getAppInfo, getSystemInfoSync } from '@ray-js/ray';
import { devices, dpKit } from './devices';
import { updateThemeType } from './redux/modules/themeSlice';
import { initializeSystemInfo } from './redux/modules/systemInfoSlice';
import { initializeEnergyMode } from './redux/modules/energyModeSlice';
import store from './redux';
import './styles/index.less';
import { initializeAppInfo } from './redux/modules/appInfoSlice';

interface Props {
  devInfo: DevInfo;
  extraInfo?: Record<string, any>;
}

interface State {
  devInfo: DevInfo;
}

function Panel(config: any) {
  return <>{config.children}</>;
}

const composeLayout = (SubComp: React.ComponentType<any>) => {
  const { dispatch } = store;
  return class PanelComponent extends Component<Props, State> {
    async onLaunch(object: any) {
      devices.common.onInitialized(device => {
        dpKit.init(device);
      });
      devices.common.init();
      const systemInfo = getSystemInfoSync();
      const { theme } = systemInfo;
      getAppInfo({
        success: data => {
          dispatch(initializeAppInfo(data));
        },
      });
      dispatch(initializeSystemInfo(systemInfo));
      dispatch(updateThemeType(theme));
      dispatch(initializeEnergyMode([]));
    }

    render() {
      const { extraInfo } = this.props;

      return (
        <Provider store={store}>
          <Panel>
            <SubComp extraInfo={extraInfo} {...this.props} />
          </Panel>
        </Provider>
      );
    }
  };
};

export default composeLayout;
