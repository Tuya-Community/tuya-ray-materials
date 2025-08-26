import React from 'react';
import { SdmProvider, SmartDeviceModel, SmartGroupModel } from '@ray-js/panel-sdk';
let value = null;

export const AppQuery = {
  activeColor: "rgba(0, 190, 155, 1)"
}
class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      modal: null
    };
  }
  onLaunch(object) {
    const { query = {} } = object;
    console.log("🚀 ~ App ~ onLaunch ~ query:", query)
    const { groupId, deviceId, activeColor = AppQuery.activeColor } = query;
    AppQuery.activeColor = activeColor
    if (groupId || deviceId) {
      value = groupId ? new SmartGroupModel({ groupId: groupId }) : new SmartDeviceModel({ deviceId: deviceId });
      value.init();
      value.onInitialized(() => {
        this.setState({
          modal: value,
        });
      });
    } else {
      // throw
      console.error('Missing device information deviceId or groupId parameter!');
    }
  }

  render() {
    if(!this.state.modal) return null
    return <SdmProvider value={this.state.modal}>{this.props.children}</SdmProvider>;
  }
}

export default App;
