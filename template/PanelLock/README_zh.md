[English](README.md) | 简体中文[](README_zh.md)

## 项目名称：蓝牙门锁模版

## 1. 使用须知

使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)

## 2. 快速上手

- [创建产品](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lock-guide/index.html#2)
- [创建项目并在 IDE 中导入项目代码](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lock-guide/index.html#3)
- 更多详细内容可参考 [蓝牙门锁模板](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lock-guide/index.html#0)

## 3. 能力依赖

- App 版本
  - 智能生活 4.5.0 及以上版本
- TTT 依赖
  - BaseKit: 3.0.0
  - MiniKit: 3.1.0
  - DeviceKit: 3.1.0
  - BizKit: 3.0.6
- 功能页依赖
  - 设备详情功能页：settings => 'tycryc71qaug8at6yt'

## 4. 面板功能

- 主动连接蓝牙设备
- 长按 UI 按钮一键开关门
- 新增、编辑、删除开锁方式
- 门锁日志获取、筛选
- 临时密码新增、删除、修改
- 实现常规设置项

## 5. 功能实现

- 参考 [蓝牙门锁模板](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lock-guide/index.html#1)

## 6. 问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7. 许可

[许可详情](LICENSE)

## 8. 更新日志

## [1.1.0] - 2024-11-26

### Refactored

- 更新 `@ray-js/ray` 版本至 `1.5.44`
- 更新 `@ray-js/panel-sdk` 版本至 `1.13.1`
- 更新 `@ray-js/smart-ui` 版本至 `2.0.0`
- 使用 `@ray-js/smart-ui` 使用 smart-ui 的 `NavBar` 组件
