[English](README.md) | [简体中文](README_zh.md)

# Project Name: AI Lighting Scene

## 1. Notes for Use

Before developing with this template, you need a basic understanding of the [Ray](https://developer.tuya.com/en/ray) framework. It is recommended to read the [Ray Development Documentation](https://developer.tuya.com/en/miniapp-codelabs/codelabs/panelmore-guide/index.html#0) first.

## 2. Quick Start

- Create a project
- For detailed solutions, refer to [AI Generative Lighting Scene Solution](https://developer.tuya.com/en/miniapp/solution-ai/ability/lamp-solution/aiLightingScene/overview)

## 3. Capability Dependencies

- App Version
  - Tuya App, Smart Life App v7.1.0 and above
- Kit Dependencies
  - BaseKit: v3.10.1
  - MiniKit: v3.0.0
  - BizKit: v3.5.0
  - HomeKit: v3.1.2
  - AIKit: v1.9.1
  - baseversion: v2.29.16
- Component Dependencies
  - @ray-js/ray^1.7.58
  - @tuya-miniapp/cloud-api^1.2.0
  - @ray-js/smart-ui^2.8.0
  - @ray-js/ray-error-catch^0.0.26

## 4. Template Features

- AI-powered lighting scene generation on the client: Based on room and lighting capabilities, one-click generation of 9 sets of ambient lighting solutions, presented in real time, no complicated configuration required.
- AI action prediction engine: Automatically matches device control commands (actions) for each lighting scene to ensure executable results.
- Single and batch intelligent refresh: Supports replacing a single lighting solution, or refreshing only unselected lighting solutions, with selected content automatically retained.
- Real-time lighting preview: Click to execute lighting actions, devices respond instantly, what you see is what you get.
- Multi-select cloud scene saving: Supports saving multiple AI-generated scenes at once, stored long-term and callable at any time.
- Enhanced interactive experience: Built-in loading animation, success feedback, and disabled state prompts to avoid misoperation and conflicts.
- Scene quantity and permission verification: Supports upper limit control and administrator permission verification to ensure safe and compliant scene management.
- Inspiration supply mechanism: Provides gentle prompts when users frequently refresh, enhancing the warmth of AI interaction.

> If no specific roomId is passed in the path, the template defaults to the first room in the current household. Developers can adjust this according to their needs. We recommend choosing SMB-related homes to experience more professional lighting features.

## 5. Notes

- The template involves interfaces that depend on cloud capabilities. Authorization configuration is required in the [Mini Program Developer Platform](https://platform.tuya.com/miniapp/) under `Development Settings` - `Cloud Capabilities`. Specifically: Find the `Mini Program Lighting Scene Capabilities` card, click the `Authorize` button in the lower right corner of the card, and complete the cloud capability authorization.

- If the `roomId` of a specific room is not passed in the path, the template defaults to the first room under the current household. Developers can adjust this according to their needs.

- It is recommended to select SMB-related households to experience the complete process of creating lighting scenes and more professional lighting functions.

## 6. Feedback

If you have any questions, please visit the link and submit a post for feedback: https://tuyaos.com/viewforum.php?f=10

## 7. License

MIT
