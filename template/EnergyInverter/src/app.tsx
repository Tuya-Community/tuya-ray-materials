import React from 'react';
import 'ray';
import Strings from '@/i18n';
import '@/res/iconfont/iconfont.css';
import './app.less';
import { showTabBar, initPanelEnvironment } from '@ray-js/ray';
import { SdmProvider } from '@ray-js/panel-sdk';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { devices } from '@/devices';
import composeLayout from './composeLayout';

interface Props {
  children: React.ReactNode;
}

initPanelEnvironment({ useDefaultOffline: true });
class App extends React.Component<Props> {
  componentDidMount() {
    showTabBar({
      animation: false,
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
