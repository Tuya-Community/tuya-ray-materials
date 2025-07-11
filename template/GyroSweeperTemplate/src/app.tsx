/* eslint-disable import/no-duplicates */
import React from 'react';
import '@/i18n';
import '@/res/iconfont/iconfont.css';
import './app.less';
import { SdmProvider } from '@ray-js/panel-sdk';
import { initPanelEnvironment } from '@ray-js/ray';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { devices } from '@/devices';
import Strings from '@/i18n';
import { QueryClient, QueryClientProvider } from '@ray-js/query';

import composeLayout from './composeLayout';

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

initPanelEnvironment({ useDefaultOffline: true, showFault: false });
class App extends React.Component<Props> {
  componentDidMount() {
    console.log('=== App did mount');
  }

  render() {
    return (
      <RayErrorCatch
        errorTitle={Strings.getLang('errorTitle')}
        errorText={Strings.getLang('errorText')}
        submitText={Strings.getLang('submitText')}
      >
        <QueryClientProvider client={queryClient}>
          <SdmProvider value={devices.common}>{this.props.children}</SdmProvider>
        </QueryClientProvider>
      </RayErrorCatch>
    );
  }
}

export default composeLayout(App);
