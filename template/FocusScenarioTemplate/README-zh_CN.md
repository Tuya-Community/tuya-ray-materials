[English](./README.md) | 简体中文

## 涂鸦聚焦场景规范模版库

## 1. 使用须知

使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)

## 2. 快速上手

- [创建产品](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#2)
- [创建项目并在 IDE 中导入项目代码](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#3)
- 更多详细内容可参考 [照明光源模板](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#0)

## 3. 能力依赖

- App 版本
  - 智能生活 7.3.0 及以上版本
- TTT 依赖
  - BaseKit: 3.0.6,
  - MiniKit: 3.0.7,
  - DeviceKit: 4.6.0,
  - BizKit: 4.2.0
- 功能页依赖
  - 设备详情功能页：settings => 'tycryc71qaug8at6yt'
  - 定时倒计时生物节律功能页：LampScheduleSetFunction => 'ty56cr7pi6rxiucspo'
  - 酷玩吧功能页：rayPlayCoolFunctional => 'tyg0szxsm3vog8nf6n'

## 4. 面板功能

- 浏览/轻量输入框表单型+键盘自动收起（example1）
- 多输入框表单型+键盘固定（example2）
- 弹框轻量输入框表单型+键盘自动收起（example3）
- 弹窗多输入框表单型+键盘固定（example4）
- 弹窗聚焦（example5）
- 卡片高度固定+一屏固定+键盘固定（example6）
- 卡片高度自适应+超出一屏滚动+键盘固定（example7）

## 6. 问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7. 许可

[许可详情](LICENSE)

## 8. 更新日志

### [0.0.1] - 2026-2-26

- 初始化

#### Refactored

- 更新 `@ray-js/ray` 版本至 `1.7.62`
- 更新 `@ray-js/panel-sdk` 版本至 `1.14.1`
- 更新 `@ray-js/smart-ui` 版本至 `2.11.0`
