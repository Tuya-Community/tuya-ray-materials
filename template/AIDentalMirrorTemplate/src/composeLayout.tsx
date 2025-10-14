import './styles/index.less';

import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { getSystemInfoSync } from '@ray-js/ray';

import { devices, dpKit } from './devices';
import store from './redux';
import { initializeSystemInfo } from './redux/modules/systemInfoSlice';
import { updateThemeType } from './redux/modules/themeSlice';

interface Props {
  devInfo: DevInfo;
  extraInfo?: Record<string, any>;
}

interface State {
  devInfo: DevInfo;
}

const composeLayout = (SubComp: React.ComponentType<any>) => {
  const { dispatch } = store;
  return class PanelComponent extends Component<Props, State> {
    async onLaunch(object: any) {
      devices.common.init();
      devices.common.onInitialized(device => dpKit.init(device));
      const systemInfo = getSystemInfoSync();
      const { theme } = systemInfo;

      dispatch(initializeSystemInfo(systemInfo));
      dispatch(updateThemeType(theme));
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
