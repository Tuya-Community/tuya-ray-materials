[简体中文](./README-zh_CN.md) | English

## Tuya Focus Scene Specification Template Library

## 1. Usage Notice

Before using this template for development, it is important to have a basic understanding of the Ray framework. It is recommended to first consult the [Ray Development Documentation](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview).

## 2. Quick Start

- [Create a Product](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#2)
- [Create a Project and Import Project Code in the IDE](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#3)
- For more detailed information, please refer to the [Lighting Source Template](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#0).

## 3. Capability Dependencies

- App Version
  - Smart Life version 7.3.0 and above
- TTT Dependencies
  - BaseKit: 3.0.6,
  - MiniKit: 3.0.7,
  - DeviceKit: 4.6.0,
  - BizKit: 4.2.0
- Functional Page Dependencies
  - Device Detail Functional Page: settings => 'tycryc71qaug8at6yt'
  - Timer Countdown Circadian Rhythm Functional Page: LampScheduleSetFunction => 'ty56cr7pi6rxiucspo'
  - Cool Play Functional Page: rayPlayCoolFunctional => 'tyg0szxsm3vog8nf6n'

## 4. Panel Functionality

- Browse/lightweight input form type + keyboard auto-hide (example1)
- Multiple input form type + fixed keyboard (example2)
- Popup lightweight input form type + keyboard auto-hide (example3)
- Popup multiple input form type + fixed keyboard (example4)
- Popup focus (example5)
- Fixed card height + fixed height per screen + fixed keyboard (example6)
- Adaptive card height + scroll beyond screen + fixed keyboard (example7)

## 6. Issue Feedback

If you have any questions, please visit the link to submit a post for feedback: https://tuyaos.com/viewforum.php?f=10

## 7. License

[License Details](LICENSE)

## 8. Change Log

### [0.0.1] - 2026-2-26

- Initialization

#### Refactored

- Updated `@ray-js/ray` version to `1.7.62`
- Updated `@ray-js/panel-sdk` version to `1.14.1`
- Updated `@ray-js/smart-ui` version to `2.11.0`
