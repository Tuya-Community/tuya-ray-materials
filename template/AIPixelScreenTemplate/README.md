[English](README.md) | [简体中文](README_zh.md)

# Project Name: AI Text-to-Image Pixel Screen Template

## 1. Instructions

Before using this template for development, you need to have a basic understanding of the [Ray](https://developer.tuya.com/cn/ray) framework. It is recommended to review the [Ray Development Documentation](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panelmore-guide/index.html#0) first.

## 2. Quick Start

- Create a product
- Create a project
- For detailed solutions, please refer to [AI Pixel Screen Text-to-Image Solution](https://developer.tuya.com/en/miniapp/solution-ai/ability/picture-solution/aiTextToImage/overview)

- For detailed tutorials, please refer to [AI Pixel Screen Text-to-Image Template Tutorial](https://developer.tuya.com/en/miniapp-codelabs/codelabs/on-app-ai-text-to-image/index.html)

## 3. Dependencies

- App Version
  - Smart Life v7.0.5 or above
- Kit Dependencies
  - BaseKit: v3.29.1
  - MiniKit: v3.12.0
  - DeviceKit: v4.6.1
  - BizKit: v4.10.0
  - HomeKit: 3.4.0
  - AIKit: 1.8.1
  - baseversion: v2.29.18
- Component Dependencies
  - @ray-js/ray^1.7.56
  - @ray-js/panel-sdk^1.14.1
  - @ray-js/smart-ui^2.7.3
  - @ray-js/lamp-color-slider^1.1.7
  - @ray-js/lamp-saturation-slider^1.1.7
  - @ray-js/ray-error-catch^0.0.26
  - omggif^1.0.10
  - md5^1.0.10

- Functional Page Dependencies

Device Details Functional Page: settings => tycryc71qaug8at6yt

## 4. Panel Features

- Client-side AI Text-to-Image: After selecting and sending tags from the client, the client invokes the local AI model to generate corresponding images based on the tag text.
- Pixel Doodle: Create content through the canvas doodle component, and save the generated drawings as images.
- Image Upload and Cropping: Supports users to select content from albums or take photos to obtain images, then perform image cropping.
- Bluetooth Large Data Transfer: Supports sending image content to the device for display via fragmented transparent transmission.
- Bluetooth Pixel Display Debugging: Introduces the overall debugging process for Bluetooth pixel displays, facilitating developers to quickly start development and debugging.


## 5. Feature Implementation

See [AI Pixel Screen Text-to-Image Template Tutorial](https://developer.tuya.com/en/miniapp-codelabs/codelabs/on-app-ai-text-to-image/index.html)

## 6. Feedback

If you have any questions, please visit the link and submit a post for feedback: https://tuyaos.com/viewforum.php?f=10

## 7. License

MIT
