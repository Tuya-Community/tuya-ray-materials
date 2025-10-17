import store from '@/redux';
import { getSystemInfoSync } from '@ray-js/ray';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import log4js from '@ray-js/log4js';

import { devices, dpKit, storage, support } from './devices';
import { initializeSystemInfo } from './redux/modules/systemInfoSlice';
import './styles/index.less';
import { APP_LOG_TAG } from './constant';

const composeLayout = (SubComp: React.ComponentType<any>) => {
  const { dispatch } = store;
  return class PanelComponent extends Component<Record<string, any>, any> {
    async onLaunch(object: any) {
      devices.common.init();
      support.init();
      storage.init();
      devices.common.onInitialized(device => dpKit.init(device));
      const systemInfo = getSystemInfoSync();

      log4js.setTag(APP_LOG_TAG);

      dispatch(initializeSystemInfo(systemInfo));
    }

    render() {
      return (
        <Provider store={store}>
          {/* @ts-ignore */}
          <SubComp {...this.props} />
        </Provider>
      );
    }
  };
};

export default composeLayout;
