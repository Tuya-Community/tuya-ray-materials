[English](README.md) | [简体中文](README_zh.md)

# 项目名称：AI 生成式灯光场景

## 1. 使用须知

使用该模板开发前， 需要对 [Ray](https://developer.tuya.com/cn/ray) 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panelmore-guide/index.html#0)

## 2. 快速上手

- 创建项目
- 详细方案可参考 [AI 生成式灯光场景方案](https://developer.tuya.com/cn/miniapp/solution-ai/ability/lamp-solution/aiLightingScene/overview)

## 3. 能力依赖

- App 版本
  - 涂鸦 App、智能生活 App v7.1.0 及以上版本
- Kit 依赖
  - BaseKit：v3.10.1
  - MiniKit：v3.0.0
  - BizKit：v3.5.0
  - HomeKit: v3.1.2
  - AIKit: v1.9.1
  - baseversion：v2.29.16
- 组件依赖
  - @ray-js/ray^1.7.58
  - @tuya-miniapp/cloud-api^1.2.0
  - @ray-js/smart-ui^2.8.0
  - @ray-js/ray-error-catch^0.0.26

## 4. 模板功能

- 端侧 AI 生成灯光场景: 基于房间与灯光能力，一键生成 9 组氛围灯光方案，实时呈现，无需繁琐配置。
- AI 动作预测引擎: 为每个灯光场景自动匹配设备控制指令（actions），确保效果可落地执行。
- 单个与批量智能刷新: 支持替换单个灯光方案，或仅刷新未选中的灯光方案，已选内容自动保留。
- 实时灯光预览: 点击即可执行灯光动作，设备即时反馈，所见即所得。
- 多选保存云端场景: 支持一次保存多个 AI 生成场景，长期留存并可随时调用。
- 交互体验增强: 内置加载动画、成功反馈、禁用态提示，避免误触与操作冲突
- 场景数量与权限校验: 支持上限控制与管理员权限校验，确保场景管理安全合规。
- 灵感补给机制: 当用户频繁刷新时提供温和提示，提升 AI 交互体验温度。

## 5. 注意

- 模板涉及的接口依赖云能力，需在 [小程序开发者平台](https://platform.tuya.com/miniapp/)`开发设置` - `云能力` 进行授权配置, 具体操作: 找到 `小程序照明场景能力` 卡片, 点击卡片右下角 `授权` 按钮, 完成该云能力授权。
- 如果路径中没有传入具体房间的 `roomId`, 模板默认以当前家庭下第一个房间为例, 开发者可以根据需求调整。
- 建议选择 SMB 相关家庭, 可体验灯光场景创建的完整流程和更多专业照明功能。

## 6. 问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7. 许可

MIT
