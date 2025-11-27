[简体中文](./README-zh_CN.md) | English

## Lighting Source Template

## 1. Instructions

Before using this template, you need to have a basic understanding of the Ray framework. It is recommended to refer to the [Ray development documentation](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview)

## 2. Quick start

- Working in progress, please be patient.

## 3. Capability dependency

- App version
  - Tuya Smart 4.5.0 and above
- TTT dependency
  - BaseKit: 3.3.13
  - MiniKit: 3.1.0
  - DeviceKit: 3.4.0
  - BizKit: 3.3.1
  - MediaKit: 3.2.0
  - baseversion: 2.15.6
- Function page dependency
  - Device Detail Functional Page: settings => 'tycryc71qaug8at6yt'
  - Timer Countdown Biological Rhythm Functional Page: LampScheduleSetFunction => 'ty56cr7pi6rxiucspo'
  - Cool Play Bar Functional Page: rayPlayCoolFunctional => 'tyg0szxsm3vog8nf6n'

## 4. Panel function

- White/Color Light Adjustment
- Scene
- Music Rhythm
- Favorite Colors
- Power-off Memory
- Power Outage Do Not Disturb
- Switch Gradient
- Cloud Timing
- Countdown
- Biological Rhythm

## 5. Specific function implementation

- Working in progress, please be patient.

## 6. Problem feedback

If you have any questions, please visit the link and submit post feedback: https://tuyaos.com/viewforum.php?f=37

## 7. License

[License details](LICENSE)

## 8. Changelog

### [1.4.1] - 2025-11-27

- Optimize the template, integrate SmartUI for on-demand loading, skeleton screen, upgrade dependencies, image compression; fix the issue with the full import of @ray-js/components-ty-lamp component library.

### [1.4.0] - 2025-03-26

- Modify the `Power Outage Memory`, `Do Not Disturb During Power Outage`, `Switch Gradient` to use the function page access method
- Iterate the way of opening the Cool Play Scene Library, adapting to the new version of the `Cool Play Scene Library Function Page`

### [1.2.1] - 2024-12-17

- Remove some redundant code & Refactor the code to fix some Lint warnings
- Update `@ray-js/ray` version to `1.6.1`
- Update `@ray-js/smart-ui` version to `2.1.6`
- Update `@ray-js/components-ty-lamp` version to `2.0.1`

### [1.2.0] - 2024-11-18

#### Refactored

- Updated `@ray-js/ray` version to `1.5.44`
- Updated `@ray-js/panel-sdk` version to `1.13.1`
- Updated `@ray-js/smart-ui` version to `2.0.0`
- Replace the built-in `TopBar` component in the project with the `NavBar` component provided by `@ray-js/smart-ui`.
