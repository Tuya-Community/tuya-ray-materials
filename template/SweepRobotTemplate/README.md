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
