English[](README.md) | [简体中文](README_zh.md)

## Product name: Common Smart Device Model Template

## 1. Instructions

Before using this template, you need to have a basic understanding of the Ray framework. It is recommended to refer to the [Ray development documentation](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview)

## 2. Quick start

[Use Ray to develop a universal panel](https://developer.tuya.com/en/miniapp-codelabs/codelabs/panelmore-guide/index.html#0)

## 3. Capability dependency

- App version
  - Tuya Smart 4.5.0 and above
- TTT dependency
  - BaseKit: 3.0.0
  - MiniKit: 3.0.0
  - DeviceKit: 3.0.0
  - BizKit: 3.0.1
  - baseversion: 2.10.29
- Component dependency
  - None
- Function page dependency
  - Device Detail Functional Page: settings => 'tycryc71qaug8at6yt'

## 4. Panel function

- Multi-language
- SmartUI Component Library
- Smart Device Model
- Smart Group Model

## 5. Specific function implementation

- Refer to the [Smart Device Model](https://developer.tuya.com/en/miniapp/develop/ray/extended/common/sdm)

## 6. Problem feedback

If you have any questions, please visit the link and submit post feedback: https://tuyaos.com/viewforum.php?f=37

## 7. License

[License details](LICENSE)

## 8. Changelog

### [1.2.4] - 2024-12-17

- Remove some redundant code
- Update `@ray-js/ray` version to `1.6.1`
- Update `@ray-js/smart-ui` version to `2.1.5`

### [1.2.2] - 2024-11-19

- Access Device Details Feature Page

### [1.2.0] - 2024-11-18

#### Refactored

- Updated `@ray-js/ray` version to `1.5.44`
- Updated `@ray-js/panel-sdk` version to `1.13.1`
- Updated `@ray-js/smart-ui` version to `2.0.0`
- The background and top bar colors in the global configuration `global.config.ts` and page configuration `index.config.ts` now default to follow the App
