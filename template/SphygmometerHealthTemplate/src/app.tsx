import React from 'react';
import { SdmProvider } from '@ray-js/panel-sdk';
import { initPanelEnvironment } from '@ray-js/ray';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { ConfigProvider } from '@ray-js/smart-ui';
import { defaultAppLightThemeVars } from '@ray-js/smart-ui/dist/common/theme';

import { devices } from '@/devices';
import Strings from '@/i18n';
import composeLayout from './composeLayout';

import './app.less';
import './global.less';
import 'ray';

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
        <ConfigProvider themeVars={{ ...defaultAppLightThemeVars }}>
          <SdmProvider value={devices.common}>{this.props.children}</SdmProvider>
        </ConfigProvider>
      </RayErrorCatch>
    );
  }
}

export default composeLayout(App);
