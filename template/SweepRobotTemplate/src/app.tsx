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

interface Props {
  children: React.ReactNode;
}

(ty as any).panel.initPanelKit({
  disableOtaDialog: true,
});
initPanelEnvironment({
  useDefaultOffline: true,
  disableOtaDialog: true,
} as any);
class App extends React.Component<Props> {
  componentDidMount() {
    console.log('=== App did mount');
  }

  render() {
    return (
      <RayErrorCatch
        errorTitle={Strings.getLang('dsc_error_title')}
        errorText={Strings.getLang('dsc_error_text')}
        submitText={Strings.getLang('dsc_submit_text')}
      >
        <SdmProvider value={devices.common}>{this.props.children}</SdmProvider>
      </RayErrorCatch>
    );
  }
}

export default composeLayout(App);
