import React from 'react';
import { SdmProvider } from '@ray-js/panel-sdk';
import store from '@/redux';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { Provider } from 'react-redux';
import { View } from '@ray-js/ray';
import Strings from './i18n';
import { dpKit, getDevice } from './devices';

let value = null;

class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
    };
  }

  onLaunch(object) {
    const { query = {} } = object;
    console.log('🚀 ~ App ~ onLaunch ~ query:', query);
    const { groupId, deviceId } = query;
    if (groupId || deviceId) {
      value = getDevice(deviceId, groupId);
      value.init();
      value.onInitialized(() => {
        dpKit.init(value);
        this.setState({
          modal: value,
        });
      });
    } else {
      // throw
      console.error(`Missing device information parameter 'deviceId' or 'groupId'!`);
    }
  }

  render() {
    if (!this.state.modal) {
      return <View />;
    }

    return (
      <RayErrorCatch>
        {/* @ts-ignore */}
        <Provider store={store}>
          <SdmProvider value={this.state.modal}>{this.props.children}</SdmProvider>
        </Provider>
      </RayErrorCatch>
    );
  }
}

export default App;
