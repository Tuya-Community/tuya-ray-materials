// eslint-disable-next-line import/no-duplicates
import '@/i18n';
import '@/res/iconfont/iconfont.css';
import './app.less';

/* eslint-disable import/no-duplicates */
import React from 'react';

import { devices } from '@/devices';
import { SdmProvider } from '@ray-js/panel-sdk';
import { initPanelEnvironment } from '@ray-js/ray';
import RayErrorCatch from '@ray-js/ray-error-catch';
import Strings from '@/i18n';

import composeLayout from './composeLayout';

interface Props {
  children: React.ReactNode;
}

initPanelEnvironment({ useDefaultOffline: true });

class App extends React.Component<Props> {
  render() {
    return (
      // @ts-ignore
      <RayErrorCatch
        errorTitle={Strings.getLang('errorTitle')}
        errorText={Strings.getLang('errorText')}
        submitText={Strings.getLang('submitText')}
      >
        <SdmProvider value={devices.common}>{this.props.children}</SdmProvider>
      </RayErrorCatch>
    );
  }
}

export default composeLayout(App);
