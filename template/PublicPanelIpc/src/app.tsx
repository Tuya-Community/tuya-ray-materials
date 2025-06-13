/* eslint-disable import/no-duplicates */
import React from 'react';
import { Dialog } from '@ray-js/smart-ui';
import 'ray';
import '@/i18n';
import '@/res/iconfont/iconfont.css';
import './app.less';
import { SdmProvider } from '@ray-js/panel-sdk';
import { initPanelEnvironment } from '@ray-js/ray';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { devices } from '@/devices';
import composeLayout from './composeLayout';

interface Props {
  children: React.ReactNode;
}

initPanelEnvironment({ useDefaultOffline: false });
class App extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.registerRef = React.createRef();
  }

  componentDidMount() {
    // 把 modalHandle 挂到一个全局变量下
    global.__registerRefHandle = this.registerRef;
  }

  registerRef;

  render() {
    return (
      <RayErrorCatch errorTitle="" errorText="" submitText="">
        <SdmProvider value={devices.common}>{this.props.children}</SdmProvider>
        <Dialog id="smart-dialog" />
      </RayErrorCatch>
    );
  }
}

export default composeLayout(App);
