English | [简体中文](./README-zh_CN.md)

## Ipc MiniApp template

## 1. Instructions

Before using this template, you need to have a basic understanding of the Ray framework. It is recommended to refer to the [Ray development documentation](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview)

## 2. Quick start

- [Create product](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#2)
- [Create a project and import project code into the IDE](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#3)
- For more detailed content, please refer to [IPC Universal Template](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#0)

## 3. Capability dependency

- @ray-js/components-ty-ipc player

### Mini program kit dependencies (the following dependencies are the minimum version of kit)

- TTT dependency

  - BaseKit: 3.0.0
  - MiniKit: 3.0.0
  - DeviceKit: 3.0.0
  - BizKit: 3.0.1
  - baseversion: 2.10.1

- Function page dependency
  - Device Detail Functional Page: settings => 'tycryc71qaug8at6yt'

### APP version support

- Smart Life v4.5.0 and above

## 4. Panel function

- Theme: Support light and dark themes (follow APP)
- IPC basic functions: preview, recording, screen capture, intercom
- IPC extended functions: playback, photo album
- Other features: camera settings, PTZ, zoom

## 5. Specific function implementation

### interface

- ty.device.getCameraConfigInfo camera configuration information

### Player import

```tsx
import { IpcPlayer as Player } from '@ray-js/components-ty-ipc';

<View className={Styles.playerWrap}>
  {devInfo?.devId && (
    <Player
      defaultMute={isMute}
      devId={devInfo?.devId}
      onlineStatus={devInfo.isOnline}
      updateLayout={`${playerLayout}`}
      onChangeStreamStatus={onChangeStreamStatus}
      onCtx={getIpcPlayer}
      onPlayerTap={handlePlayerClick}
      clarity={videoClarityObj[mainDeviceCameraConfig.videoClarity]}
      privateState={dpState.basic_private || false}
    />
  )}
</View>;
```

## 6. Problem feedback

If you have any questions, please visit the link and submit post feedback: https://tuyaos.com/viewforum.php?f=37

## 7. License

[License details](LICENSE)

## 8. Changelog

## [3.13.3] - 2024-12-05

### Refactored

- Updated `@ray-js/ray` version to `1.5.44`
- Updated `@ray-js/panel-sdk` version to `1.13.1`
- Updated `@ray-js/smart-ui` version to `2.0.0`
- Replace the built-in `TopBar` component in the project with the `NavBar` component provided by `@ray-js/smart-ui`.
