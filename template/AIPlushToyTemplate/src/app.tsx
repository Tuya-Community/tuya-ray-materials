/* eslint-disable import/no-duplicates */
import React from 'react';
import '@/i18n';
import '@/res/iconfont/iconfont.css';
import './app.less';
import { SdmProvider } from '@ray-js/panel-sdk';
import { initPanelEnvironment, onDpDataChange } from '@ray-js/ray';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { devices } from '@/devices';
import Strings from '@/i18n';
import log4js from '@ray-js/log4js';
import composeLayout from './composeLayout';

interface Props {
  children: React.ReactNode;
}

initPanelEnvironment({ useDefaultOffline: true });
class App extends React.Component<Props> {
  componentDidMount() {
    console.log('=== App did mount');

    const _onDpDataChange = event => {
      log4js.info('==> onDpDataChange', JSON.stringify(event));
    };
    onDpDataChange(_onDpDataChange);
  }

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
