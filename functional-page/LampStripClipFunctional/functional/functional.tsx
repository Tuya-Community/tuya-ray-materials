import React from 'react';
import { SdmProvider, SmartGroupModel, SmartDeviceModel } from '@ray-js/panel-sdk';
import RayErrorCatch from '@ray-js/ray-error-catch'
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
    if (!groupId && !deviceId) {
      throw new Error('Missing groupId or deviceId');
    }
    const value = groupId ? new SmartGroupModel({ groupId }) : new SmartDeviceModel({ deviceId });
    value.init(groupId || deviceId);
    this.setState({
      modal: value,
    });
  }

  render() {
    if (!this.state.modal) {
      return null;
    }
    return (
      <RayErrorCatch>
        <SdmProvider value={this.state.modal}>{this.props.children}</SdmProvider>;
      </RayErrorCatch>
    )
  }
}

export default App;
