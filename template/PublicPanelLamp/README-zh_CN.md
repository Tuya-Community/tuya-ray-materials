[English](./README.md) | 简体中文

## 照明光源模板

## 1. 使用须知

使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)

## 2. 快速上手

- [创建产品](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#2)
- [创建项目并在 IDE 中导入项目代码](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#3)
- 更多详细内容可参考 [照明光源模板](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#0)

## 3. 能力依赖

- App 版本
  - 智能生活 4.5.0 及以上版本
- TTT 依赖
  - BaseKit: 3.3.13
  - MiniKit: 3.1.0
  - DeviceKit: 3.4.0
  - BizKit: 3.3.1
  - MediaKit: 3.2.0
  - baseversion: 2.15.6
- 功能页依赖
  - 设备详情功能页：settings => 'tycryc71qaug8at6yt'
  - 定时倒计时生物节律功能页：LampScheduleSetFunction => 'ty56cr7pi6rxiucspo'
  - 酷玩吧功能页：rayPlayCoolFunctional => 'tyg0szxsm3vog8nf6n'

## 4. 面板功能

- 白光/彩光调节
- 情景
- 音乐律动
- 收藏颜色
- 断电记忆
- 停电勿扰
- 开关渐变
- 云定时
- 倒计时
- 生物节律

## 5. 功能实现

- 参考 [照明光源模板](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-lamp/index.html#0)

## 6. 问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7. 许可

[许可详情](LICENSE)

## 8. 更新日志

### [1.4.1] - 2025-11-27

- 优化模版，接入 SmartUI 按需引入、骨架屏、升级依赖、图片压缩；修复@ray-js/components-ty-lamp 组件库全量引入问题

### [1.4.0] - 2025-03-26

- 修改 `断电记忆`、`停电勿扰`、`开关渐变`使用功能页方式接入
- 迭代酷玩情景库打开方式，适配新版本`酷玩情景库功能页`

### [1.2.1] - 2024-12-17

- 移除一些冗余的代码 & 修复部分代码 Lint 报警
- 更新 `@ray-js/ray` 版本至 `1.6.1`
- 更新 `@ray-js/smart-ui` 版本至 `2.1.6`
- 更新 `@ray-js/components-ty-lamp` 版本至 `2.0.1`

### [1.2.0] - 2024-11-18

#### Refactored

- 更新 `@ray-js/ray` 版本至 `1.5.44`
- 更新 `@ray-js/panel-sdk` 版本至 `1.13.1`
- 更新 `@ray-js/smart-ui` 版本至 `2.0.0`
- 使用 `@ray-js/smart-ui` 提供的 `NavBar` 组件替换项目内置的 `TopBar` 组件
