[English](README.md) | 简体中文[](README_zh.md)

## Laser Sweeper Template

## 1. Usage Notes

- Before using this template for development, you need to have a basic understanding of the Ray framework. It is recommended to first review the [Ray Development Documentation](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview).
- Understand the [SDM Development Method](https://developer.tuya.com/en/miniapp/develop/ray/extended/common/sdm/usage).
- Learn [Vacuum Robot Codelab](https://developer.tuya.com/en/miniapp-codelabs/codelabs/panel-robot-sweeper-guide/index.html#0)

## 2. Quick Start

- [Create a Product](https://developer.tuya.com/en/miniapp/develop/miniapp/guide/start/quick-start#%E4%BA%8C%E5%88%9B%E5%BB%BA%E4%BA%A7%E5%93%81)
- [Create a Mini Program](https://developer.tuya.com/en/miniapp/common/desc/platform)

## 3. Development Notes

- IDE development temporarily does not support data transmission through the P2P channel. When developing on the IDE, please install the [Sweeper Debug Assistant](https://developer.tuya.com/en/miniapp/devtools/tools/extension/panel-plugins/dev-sweeper).

  This plugin supports real connections to real sweeper devices and can also simulate data reporting by itself.

- The IndoorMap.Dynamic component cannot be debugged with the Sweeper Debug Assistant. Real device debugging is required.
- If you are a new customer, please contact Tuya's project manager to obtain the protocol documentation for the sweeper.

## 4. Capability Dependencies

- App Version
  - Tuya Smart 5.15.0 and above
- TTT Dependencies
  - BaseKit: 3.0.0
  - MiniKit: 3.0.1
  - DeviceKit: 4.0.8
  - BizKit: 4.2.0
  - P2PKit: 2.1.1
  - IPCKit: 1.3.6
- Component Dependencies

  - [Smart UI](https://developer.tuya.com/material/smartui?comId=help-getting-started)

- IDE Plugin Dependencies
  - [Sweeper Debug Assistant](https://developer.tuya.com/en/miniapp/devtools/tools/extension/panel)

## 5. Key Module Dependencies

To allow developers to focus more on UI handling rather than other process logic handling, we have split the sweeper into modules, separating the underlying implementation from business calls. The following are the main packages that the sweeper panel currently depends on:

- @ray-js/robot-map-component: Directly called by the business layer, providing full-screen maps and dynamic map components [reference usage]src/components/MapView/index.tsx, and exposing common methods for map operations.
- @ray-js/robot-data-stream: Directly called by the business layer, encapsulating the P2P transmission methods between the panel and the device, allowing developers to ignore the complex process of P2P communication and focus only on the business logic itself.
- @ray-js/robot-protocol: Directly called by the business layer, providing a complete protocol parsing standard capability, encapsulating the parsing and encoding process of the complex raw type DP points in the sweeper protocol.
- @ray-js/webview-invoke: Underlying dependency, providing communication capabilities between the mini program and the underlying SDK, generally not requiring modification.
- @ray-js/robot-middleware: Underlying dependency, providing intermediate processing of logic layers and WebView business.
- @ray-js/hybrid-robot-map: Underlying dependency, the basic SDK for the sweeper, providing the ability to render the underlying layers.

For general sweeper requirements, you basically only need to focus on the application business logic and UI presentation, without needing to worry about the implementation in the internal dependency packages. Dependency package upgrades will be backward compatible, and you can individually upgrade the dependency packages in your project.

![Module Dependencies](https://developer.tuya.com/en/miniapp-codelabs/codelabs/panel-robot-sweeper-guide/img/61e4414579bb6763.png)

## 6. Map Component Selection

In terms of map component selection, we provide two modes of components, IndoorMap.Full and IndoorMap.Dynamic.

- The IndoorMap.Full component is introduced as a native WebView form as a different layer structure. It can only be set to full screen and cannot be dynamically resized. It is a dual-threaded structure independent of the logic layer and view layer of the mini program, providing a better interactive performance experience. Only one can be used in a single mini program page. If you need to overlay view buttons on the WebView, please use it in conjunction with [CoverView](https://developer.tuya.com/en/miniapp/develop/ray/component/view-container/cover-view). For details, you can refer to the examples in the template.

> **Please Note:** **IndoorMap.Full is a native component based on cross-layer rendering. Please read the [Native Component Usage Restrictions](https://developer.tuya.com/en/miniapp/develop/miniapp/component/native-component/native-component) in detail.**

- The IndoorMap.Dynamic component is used as an extension of the view layer component in the form of an RJS component, allowing dynamic setting of the component’s width and height. The IndoorMap.Dynamic component runs on the same layer as the view element of the mini program. In the case of frequent map data interaction, it may affect the interactive response of view elements. Multiple IndoorMap.Dynamic components can be introduced on a single mini program page.

## 7. Panel Functions

- Multi-mode cleaning
- Map management
- Map editing (no-go zones/virtual walls/floor materials)
- Room editing (splitting/merging/room naming/cleaning order)
- Cleaning preference settings
- Device scheduling
- Do not disturb mode
- Cleaning records
- Voice package settings
- Manual control
- Video surveillance
- AI object recognition

## 8. Future Function Plans

- Sweeper component usage documentation

## 9. Issue Feedback

If you have any questions, please visit the link and submit a post for feedback: https://tuyaos.com/viewforum.php?f=10

## 10. License

[License Details](LICENSE)

## Changelog

### [0.0.17] - 2025-5-15

#### Added

- Added an example of integrating AI object recognition functionality through dp points (36/37 protocol)
- Add support for configuring default room name
- Added support for configuring width and height for offline screenshots of multiple maps

#### Changed

- **@ray-js/robot-map-component** upgrade to **1.0.4**。
- **@ray-js/robot-map-middleware** upgrade to **1.0.5**。
- **@ray-js/robot-protocol** upgrade to **0.11.2**。

#### Fixed

- Fixed the issue of occasional download failure of cloud maps on Android (causing cleaning records/multiple maps, etc. to not display properly)
- Fixed the issue where AI object icons could not be cleared
- Fixed the issue where AI object icon became abnormally scaled when configured to follow map zooming
- Fix the issue where the font size of the region length unit cannot be set

### [0.0.16] - 2025-4-11

#### Added

- Support for charging pile warning circle radius configuration

#### Changed

- **@ray-js/robot-map-component** upgrade to **1.0.3**。
- **@ray-js/robot-map-middleware** upgrade to **1.0.3**。
- **@ray-js/robot-protocol** upgrade to **0.11.1**。

#### Fixed

- Fix the issue of possible path drift
- Fix the issue where off-screen screenshots might be affected by the `runtimeData` from the homepage map
- Fix the issue where two-finger zoom on the map may cause the map to disappear and zoom to fail
- Fixed issue where room properties were not visible in room editing functionality
- Fix the issue where the restricted area & virtual wall buttons are displayed too small on the large map
- Fixed the issue where multiple map screenshots may cause unlimited growth of App cache

### [0.0.15] - 2025-3-14

#### Added

- Added the capability for off-screen screenshots of maps, restructured the logic for multiple maps, and improved the loading performance of multiple maps.

#### Changed

- **@ray-js/robot-map-component** update to **1.0.0**
- **@ray-js/robot-map-middleware** update to **1.0.0**
- **@ray-js/robot-protocol** update to **0.10.7**

### [0.0.14] - 2025-3-6

#### Changed

- **@ray-js/robot-map-component** update to **1.0.0-beta-2**.
- **@ray-js/robot-map-middleware** update to **1.0.0-beta-2**.

#### Added

- Support custom room bubble pop-ups.
- Expose room default color configuration.
- Support special room background color configuration.

### [0.0.13] - 2025-2-27

#### Changed

- **@ray-js/robot-map-component** updated to v0.1.0-beta-17.
- **copy-script** script updated.

### [0.0.12] - 2025-02-21

#### Added

- Support dynamically showing/hiding paths through `pathVisible`.
- Upgrade ray version to 1.6+ (optimize package size).

#### Fixed

- Fixed the issue of 'function is not defined' error occurring occasionally on some Android phones.
- Fixed an occasional issue on iOS15 where the map could not be loaded.
- Fixed the occasional issue where P2P could not connect after switching from the background to the foreground on mobile devices.
- Fixed the method of obtaining the URL using the **Use Map** directive.
- Fix the sporadic issue of the map not being able to update (requires updating the App to 6.3.0+).
- Fix the issue where DialogInstance occasionally fails to open.

### [2024-12-10]

#### Added

- Add IconFont component

#### Fixed

- Fixed an issue where the Dynamic component might not update the real-time map.

### [2024-11-22]

#### Added

- Added manual control page
- Added video monitoring page
- Added AI object recognition feature
- Added room cleaning order feature
- Added cleaning preference settings page
- Added floor material settings feature
- Updated **@ray-js/robot-map-component** to **v0.0.18**, supporting configurable WebView map container size & position, fixed some issues.
- Updated **@ray-js/robot-protocol** to **v0.9.2**, adding support for `Virtual Wall Settings 0x48/49`, `No-go Zone Settings 0x1a/1b`, `Do Not Disturb Time Settings 0x32/33`, `Floor Material Settings 0x52/0x53` protocol, fixed some issues.

#### Changed

- Replaced map loading animation
- Unified and configurable map background color

#### Fixed

- Fixed the issue where protocol version v0 maps could not display properly
- Fixed the issue where lz4 compressed paths could not display properly

### [2024-11-12]

#### Fixed

- Fixed the issue where opening the room naming popup caused map gestures to become unresponsive

### [2024-11-11]

#### Added

- Added scheduling page
- Added do not disturb mode page
- Added room editing page
- Added cleaning record page
- Added voice package page
- Added support for IDE map debugging feature

#### Fixed

- Fixed the alignment issue between rjs maps and WebView maps
- Fixed some known issues

#### Changed

- Refactored some existing pages and components
