[English](README.md) | 简体中文[](README_zh.md)

## 项目名称：通用智能设备模型模版

## 1. 使用须知

使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)

## 2. 快速上手

[使用 Ray 开发万能面板](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panelmore-guide/index.html#0)

## 3. 能力依赖

- App 版本
  - 智能生活 4.5.0 及以上版本
- TTT 依赖
  - BaseKit: 3.0.0
  - MiniKit: 3.0.0
  - DeviceKit: 3.0.0
  - BizKit: 3.0.1
  - baseversion: 2.10.29
- 组件依赖
  - 暂无
- 功能页依赖
  - 设备详情功能页：settings => 'tycryc71qaug8at6yt'

## 4. 面板功能

- 多语言
- SmartUI 组件库
- 智能设备模型
- 智能群组模型

## 5. 功能实现

- 参考 [智能设备模型](https://developer.tuya.com/cn/miniapp/develop/ray/extended/common/sdm)

## 6. 问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7. 许可

[许可详情](LICENSE)

## 8. 更新日志

### [1.2.4] - 2024-12-17

- 移除一些冗余的代码
- 更新 `@ray-js/ray` 版本至 `1.6.1`
- 更新 `@ray-js/smart-ui` 版本至 `2.1.5`

### [1.2.2] - 2024-11-19

- 接入设备详情功能页

### [1.2.0] - 2024-11-18

#### Refactored

- 更新 `@ray-js/ray` 版本至 `1.5.44`
- 更新 `@ray-js/panel-sdk` 版本至 `1.13.1`
- 更新 `@ray-js/smart-ui` 版本至 `2.0.0`
- 全局配置 `global.config.ts` 及页面配置 `index.config.ts` 的背景及顶部栏颜色默认跟随 App
