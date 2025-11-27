import { SdmProvider } from '@ray-js/panel-sdk';
import { initPanelEnvironment } from '@ray-js/ray';
import RayErrorCatch from '@ray-js/ray-error-catch';
import React from 'react';

import { devices } from '@/devices';
import Strings from '@/i18n';
import composeLayout from './composeLayout';

import 'ray';
import './app.less';
import './global.less';

interface Props {
  children: React.ReactNode;
}

initPanelEnvironment({ useDefaultOffline: true });
class App extends React.Component<Props> {
  componentDidMount() {
    console.log('=== App did mount');
  }

  render() {
    return (
      // @ts-ignore
      <RayErrorCatch
        errorText={Strings.getLang('errorText')}
        errorTitle={Strings.getLang('errorTitle')}
        submitText={Strings.getLang('submitText')}
      >
        <SdmProvider value={devices.common}>{this.props.children}</SdmProvider>
      </RayErrorCatch>
    );
  }
}

export default composeLayout(App);
