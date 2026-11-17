# raytpl-key-pad-template

Bluetooth Accessory Panel Template

English | [简体中文](README_zh.md)

## 1. Usage Notes

Before developing with this template, you should have a basic understanding of the Ray framework. We recommend reading the [Ray Development Documentation](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview) first.

## 2. Quick Start

1. Install Node.js 18 or later and Yarn Classic, then install the project dependencies:

   ```sh
   yarn install --frozen-lockfile
   ```

2. Configure `project.tuya.json` for your miniapp project. Prepare a Bluetooth
   accessory product and a test device, and ensure the IDE provides the Kit
   versions listed below. Product cloud capabilities must be configured separately.
3. Start the development build:

   ```sh
   yarn start
   ```

   Import this repository into the Tuya MiniApp IDE. The miniapp root is
   `dist/tuya`, as configured in `project.tuya.json`. Select the corresponding
   product and device in the IDE to preview and debug the panel.

4. Run the local checks and create a production build:

   ```sh
   yarn typecheck
   yarn lint
   yarn build
   ```

   Build output is written to `dist/tuya`. Device communication, permissions and
   platform-specific behavior also require testing in the target App with a device.

## 3. Capability Dependencies

- App version
  - Tuya Smart 4.5.0 and above
- TTT dependency
  - BaseKit: 3.0.6
  - MiniKit: 3.0.0
  - DeviceKit: 3.0.0
  - BizKit: 3.0.1
  - HomeKit: 3.0.2
  - baseversion: 2.30.9

## 4. Panel Features

| Module                      | Features                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home                        | Device name, battery level, days protected, Bluetooth status and reconnection, alarm summary, unread badge, and feature entries                  |
| Alarms                      | Alarm grouping, pagination, deduplication, unread-count refresh, empty states, and retry handling                                                |
| Records                     | Lock/unlock record grouping, pagination, deduplication, empty states, and retry handling                                                         |
| Lock management             | Bound lock list, available lock list, binding, unbinding, and security key activation                                                            |
| Unlock methods              | Bluetooth keys, passwords, fingerprints, cards, faces, and palm veins displayed according to device capabilities                                 |
| Key and password management | Permanent and temporary Bluetooth keys; permanent, online temporary, offline, and dynamic passwords; invalid password queries and clearing codes |
| Biometric enrollment        | Guided enrollment, collection progress, results, renaming, editing, and deletion for supported unlock methods                                    |
| Accessory settings          | Boolean switches, enum settings, unlock mode configuration, and operation guide entry based on the device schema                                 |
| Permissions                 | Entries and management actions controlled by OWNER, ADMIN, MEMBER, and SHARE roles                                                               |

The project currently contains 20 page routes. Route definitions are in `src/routes.config.ts`, and home-page entries are mapped in `src/utils/homeEntry.ts`.

## 5. Feedback

Create an issue in this template's repository. Include the App and IDE versions,
device model, reproduction steps, expected and actual behavior, and relevant
screenshots or logs. Remove passwords, tokens and personal information before
sharing diagnostic data.

## 6. Implementation

| Area                         | Implementation                                                                                                                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App initialization           | [src/app.tsx](src/app.tsx) initializes the panel environment; [src/composeLayout.tsx](src/composeLayout.tsx) initializes the accessory SDK and manages shared listeners and home data. |
| Device model                 | [src/devices/index.ts](src/devices/index.ts) creates the device or group model from launch options.                                                                                    |
| Pages and navigation         | [src/routes.config.ts](src/routes.config.ts) declares page routes; [src/pages](src/pages) contains each feature page.                                                                  |
| Shared state and permissions | [src/redux](src/redux) stores shared data; [src/hooks/useUserPermission.ts](src/hooks/useUserPermission.ts) derives role-based permissions.                                            |
| Localization and resources   | [src/i18n](src/i18n) defines translations; [cdn/cdnImage.json](cdn/cdnImage.json) maps resources resolved with `getCdnUrl`.                                                            |
| Theme and settings           | [src/config/index.ts](src/config/index.ts) defines theme and password options; [src/pages/set/index.tsx](src/pages/set/index.tsx) renders settings from device schema.                 |
| Build configuration          | [ray.config.ts](ray.config.ts) enables Smart UI imports on demand; [src/global.config.ts](src/global.config.ts) configures the window and device details functional page.              |

## 7. License

This project is licensed under the [MIT License](LICENSE).

## 8. Changelog

### 0.1.0

- Initial Bluetooth accessory panel template.
