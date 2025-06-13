English | [简体中文](./README-zh_CN.md)

# Ipc MiniApp template

## 1. Instructions

Before using this template, you need to have a basic understanding of the Ray framework. It is recommended to refer to the [Ray development documentation](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview)

## 2. Quick start

- [Create a Product](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#2)  
- [Create a Project and Import the Code in IDE](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#3)  
- Relevant IPC category development info: [IPC Vertical Solutions](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#0)  
- For more templates, refer to the [IPC General Template](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#0)

## 3. Capability dependency

### Plugin Dependencies

- `@ray-js/ipc-player-integration`: Integrated player component with built-in widgets for recording, intercom, screenshot, battery, temperature & humidity, PTZ, signal strength, landscape mode, etc.
- `@ray-js/ray-ipc-half-horizontal-drag`: Half-screen banner operation component
- `@ray-js/ipc-ptz-zoom`: PTZ control and zoom component
- `@ray-js/ray-ipc-decrypt-image`: AES encrypted image decryption component
- `@ray-js/ray-ipc-collect-edit`: Favorite points editing component
- `@ray-js/delay-loading`: Loading threshold component
- `@ray-js/ray-ipc-utils`: Utility library (jump to album, get signal strength, check intercom support, etc.)

### Miniapp Kit Dependencies (minimum required versions)

- BaseKit: 3.0.0  
- MiniKit: 3.0.1  
- DeviceKit: 4.11.8  
- BizKit: 4.12.1  
- IPCKit: 6.4.11 (must be ≥ this version)

- Function page dependency
  - Device Detail Functional Page: settings => 'tycryc71qaug8at6yt'

### APP version support

- Smart Life app version 6.5.0 and above

## 4. Panel Features

- **Theme Switching**: Supports light/dark themes and syncs with the app
- **Integrated Player**: Supports preview, recording, screenshot, intercom, audio, battery, temperature & humidity, PTZ control, bitrate, signal strength, landscape mode, etc.
- **Promotional Operations**: Configurable marketing and product operation content
- **Function Entry Points**: Album, PTZ and favorite points, laser light switch, etc.
- **More Features**: Privacy mode, WDR, cruise, light switch, etc.
- **Quick Action Bar**: High-frequency features such as playback, intercom, messages

## 5. Design Philosophy

- **Clean Interface, Highlighted Key Features**  
  The interface is divided into screen and function zones. The camera view is at the top, while the operation window and function entries are below — making operations more intuitive.

- **Simplified Structure, Easy Feature Discovery**  
  Unlike traditional designs that require multiple tab switches, key functions are now centralized, with one-click access to frequently used services like cloud storage and message alerts. Less frequent settings (e.g. light switch) are moved into a secondary menu for better focus and less distraction.

- **Efficient Operations, Direct Services**  
  You can define and configure related marketing info directly on the home page, significantly improving product conversion rates.



## 6. Key Feature Example

### Importing the Player

```tsx
import { useEffect } from 'react';
import { useCtx, Features, IPCPlayerIntegration } from '@ray-js/ipc-player-integration';

const Home = props => {
  // Retrieve player instance context via useCtx
  const instance = useCtx({
    devId: props.location.query.deviceId, // Device ID
  });

  // Initialize built-in player widgets. Without this call, the widgets won’t be displayed.
  useEffect(() => {
    Features.initPlayerWidgets(instance, {
      verticalResolutionCustomClick: false,
      hideHorizontalMenu: false,
    });
  }, []);

  return (
    <View className={Styles.playerContainer}>
      <IPCPlayerIntegration
        instance={instance} // Player instance
        devId={devInfo.devId} // Device ID
        onPlayStatus={onPlayStatus} // Simplified playback status listener (0: connecting, 1: previewing)
        privateState={dpState.basic_private || false} // Privacy mode status
        deviceOnline={devInfo.isOnline} // Device online status
        brandColor={brandColor} // Brand color
        playerFit='contain' // Player fit mode in portrait: contain | cover
        landscapeMode='standard' // Landscape player mode: standard | fill
        extend={{
          ptzControllable: true // Enable PTZ control
        }}
      />
    </View>
  );
};

export default Home;

```

```less
  .playerContainer {
    width: 100%;
    height: calc(100vw * 9 / 16);
}

```

## 6. Problem feedback

If you have any questions, please visit the link and submit post feedback: https://tuyaos.com/viewforum.php?f=37

## 7. License

[License details](LICENSE)

## 8. Changelog

## [4.0.0] - 2025-06-30

### Refactored

- Fully upgraded external-facing template UI and architecture
