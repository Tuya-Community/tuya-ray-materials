[English](README.md) | 简体中文[](README_zh.md)

## 项目名称：AI 毛绒玩具模版

## 1.准备工作

- 已阅读 [Ray 新手村任务](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/ray-guide/index.html#0)，了解 Ray 框架的基础知识。
- 已阅读 [使用 Ray 开发万能面板](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panelmore-guide/index.html#0)，了解 Ray 面板开发的基础知识。
- AI 毛绒玩具模版使用 `SDM(Smart Device Model)` 开发，关于 `SDM` 相关可以 [查看 SDM 文档](https://developer.tuya.com/cn/miniapp/develop/ray/extended/sdm)。

## 2.开发环境

详见 [面板小程序 > 搭建环境](https://developer.tuya.com/cn/miniapp/develop/miniapp/guide/start/quick-start#%E4%B8%80%E6%90%AD%E5%BB%BA%E7%8E%AF%E5%A2%83)。

## 3.能力依赖

- 区域：

  - 全区可用

- App 版本：

  - 涂鸦 App、智能生活 App v6.3.0 及以上版本

- Kit 依赖：

  - BaseKit: v3.0.0
  - MiniKit: v3.0.0
  - DeviceKit: v3.0.0
  - BizKit: v3.0.1
  - baseversion: v2.19.0

- 组件依赖：

  - @ray-js/components-ty-input: "^0.0.5"
  - @ray-js/lamp-percent-slider: "^0.0.6"
  - @ray-js/log4js: "^0.0.5"
  - @ray-js/panel-sdk: "^1.13.1"
  - @ray-js/ray: "1.6.22-alpha.1"
  - @ray-js/ray-error-catch: "^0.0.25"
  - @ray-js/recycle-view: "^0.1.1"
  - @ray-js/smart-ui: "^2.1.8"
  - @ray-js/svg: "^0.2.0"

## 4.面板功能

- 首页功能：

  - 当前智能体信息展示
  - 设备电量显示
  - 设备音量调节
  - 智能体广场分类分页展示、单个智能体添加到会话
  - 智能体会话管理
  - 设备智能体绑定

- 智能体会话记录展示
- 单个智能体自定义编辑：

  - 音色切换
  - 清除聊天上下文
  - 清除历史聊天记录

- 音色管理：

  - 音色克隆
    - 人声朗诵文本克隆
    - 手机录制音频克隆
  - 音色广场展示
  - 音色搜索
  - 音色切换
  - 音色编辑
    - 音调编辑
    - 语速编辑

## 5.功能实现

- 参考 [AI 毛绒玩具模版](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ai-more-agent-guide/index.html#7)

## 6.问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7.许可

[许可详情](LICENSE)

## 8.Changelog

### [1.0.1] - 2025-03-07

#### Changed

- 第一个可用版本
