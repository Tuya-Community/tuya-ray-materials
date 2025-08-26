import React from 'react';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { SdmProvider } from '@ray-js/panel-sdk';
import { dpKit, getDevice } from './devices';

class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
    };
  }
  onLaunch(object) {
    const { query = {} } = object;
    const { groupId, deviceId } = query;
    if (groupId || deviceId) {
      const value = getDevice(deviceId, groupId);
      value.init();
      value.onInitialized(() => {
        dpKit.init(value);
        this.setState({
          modal: value,
        });
      });
    } else {
      // throw
      console.error('Missing device information: deviceId or groupId parameter!');
    }
  }
  render() {
    if (!this.state.modal) return null;
    return (
      <RayErrorCatch>
        <SdmProvider value={this.state.modal}>{this.props.children}</SdmProvider>
      </RayErrorCatch>
    )
  }
}

export default App;
