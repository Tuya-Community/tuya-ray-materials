/* eslint-disable import/no-duplicates */
import React from 'react';
import 'ray';
import '@/i18n';
import './app.less';
import { SdmProvider } from '@ray-js/panel-sdk';
import { initPanelEnvironment } from '@ray-js/ray';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { devices } from '@/devices';
import Strings from '@/i18n';
import composeLayout from './composeLayout';
import { getDevInfo } from './utils/devInfo';

interface Props {
  children: React.ReactNode;
}

initPanelEnvironment({ useDefaultOffline: true, showBLEToast: true });
class App extends React.Component<Props> {
  componentDidMount() {
    console.log('=== App did mount');
  }

  componentWillUnmount(): void {
    console.log('=== App will unmount');
    const deviceId = getDevInfo().devId;
    ty.device.unsubscribeBLETransparentDataReport({
      deviceId,
      success: () => {
        console.log('unsubscribeBLETransparentDataReport success');
      },
      fail: () => {
        console.log('unsubscribeBLETransparentDataReport fail');
      },
    });
  }

  render() {
    return (
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
