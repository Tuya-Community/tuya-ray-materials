English[](README.md) | [简体中文](README_zh.md)

## Product name: AI Plush Toy Template

## 1. Prerequisites

- Have read the [Ray Novice Village Tasks](https://developer.tuya.com/en/miniapp-codelabs/codelabs/ray-guide/index.html#0) to get to know the basics of the Ray framework.
- Have read [Develop Universal Panel Based on Ray](https://developer.tuya.com/en/miniapp-codelabs/codelabs/panelmore-guide/index.html#0) to get to know the basics of Ray panel development.
- The AI toy template is developed with the `Smart Device Model (SDM)`. For more information, see the [documentation of Smart Device Model](https://developer.tuya.com/en/miniapp/develop/ray/extended/sdm).

## 2. Development environment

For more information, see [Panel MiniApp > Set up environment](https://developer.tuya.com/en/miniapp/develop/miniapp/guide/start/quick-start#set-up-environment).

## 3. Capability dependency

- Data center:

  - Available in all data centers

- App version:

  - Tuya Smart and Smart Life app v6.3.0 and later

- Kit dependency

  - BaseKit: v3.0.0
  - MiniKit: v3.0.0
  - DeviceKit: v3.0.0
  - BizKit: v3.0.1
  - baseversion: v2.19.0

- Dependent components

  - @ray-js/components-ty-input: "^0.0.5"
  - @ray-js/lamp-percent-slider: "^0.0.6"
  - @ray-js/log4js: "^0.0.5"
  - @ray-js/panel-sdk: "^1.13.1"
  - @ray-js/ray: "1.6.22-alpha.1"
  - @ray-js/ray-error-catch: "^0.0.25"
  - @ray-js/recycle-view: "^0.1.1"
  - @ray-js/smart-ui: "^2.1.8"
  - @ray-js/svg: "^0.2.0"

## 4. Panel function

- Homepage features:

  - Show the agent information.
  - Show the battery level.
  - Adjust the device volume.
  - Show by category and on pages on the Agent Square, and add a single agent to a chat.
  - Manage agent chats.
  - Bind a device with the agent.

- Show the agent chat history.
- Customize a single agent:

  - Switch voice tones
  - Clear the chat context.
  - Clear the chat history.

- Manage voice tones:

  - Clone voice tones.
    - Clone by reciting text.
    - Clone audio recorded on a phone.
  - Show voice tones on the Voice Tone Square.
  - Search for voice tones.
  - Switch voice tones.
  - Edit voice tones.
    - Edit the pitch.
    - Edit the speech speed.

## 5. Specific function implementation

- Reference [AI Toy Template](https://developer.tuya.com/en/miniapp-codelabs/codelabs/panel-ai-more-agent-guide/index.html#7)

## 6. Problem feedback

If you have any questions, please visit the link and submit post feedback: https://tuyaos.com/viewforum.php?f=22

## 7. License

[License details](LICENSE)

## 8.Changelog

### [1.0.1] - 2025-03-07

#### Changed

- The first available version.
