import React, { FC, useState } from 'react';
import 'ray';
import '@/i18n';
import '@/res/iconfont/iconfont.css';
import './app.less';
import { SdmProvider, kit } from '@ray-js/panel-sdk';
import { initPanelEnvironment } from '@ray-js/ray';
import { devices } from '@/devices';
import composeLayout from './composeLayout';

const { useInitPanelEnv } = kit;

interface Props {
  children: React.ReactNode;
}

initPanelEnvironment({ useDefaultOffline: true });

const App: FC<Props> = ({ children }) => {
  const [inited, setInited] = useState(false);
  useInitPanelEnv(
    { useDefaultOffline: true },
    () => {
      devices.init();
      setInited(true);
    },
    () => {
      setInited(false);
    }
  );

  return <SdmProvider value={devices.common}>{inited && children}</SdmProvider>;
};

// class App extends React.Component<Props> {
//   componentDidMount() {
//     console.log('=== App did mount');
//   }

//   render() {
//     return <SdmProvider value={devices.common}>{this.props.children}</SdmProvider>;
//   }
// }

export default composeLayout(App);
