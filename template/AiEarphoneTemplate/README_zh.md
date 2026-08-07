[English](README.md) | [简体中文](README_zh.md)

## AI 耳机设备面板

基于商业版音频助手体验重建的**设备面板**工程，范围限定为 **当前面板设备 + 手机麦克风**。已去掉家庭多设备管理能力。

## 快速开始

1. 按下方「接入必改」修改配置
2. `yarn`
3. `yarn start`

## 接入必改

开发者接入时优先改这些位置（业务逻辑一般不用动）：

| 配置项           | 位置                                                | 说明                                                                          |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| 产品 PID         | `project.tuya.json` → `productId`                   | 绑定到你的涂鸦产品                                                            |
| 小程序 / 面板 ID | `src/constant/index.ts` → `MINI_PROGRAM_ID`         | 商城绑定、Agent 渠道、音频源统一使用；开发态若仍为模板默认值会 `console.warn` |
| 商城目录         | `src/constant/index.ts` → `SHOP_CATALOG`            | 默认 `AI_WEARABLE_BT` / `AI_AUDIO_TRANS`，与云端 VAS 约定一致                 |
| 定制 / 公版 App  | `CUSTOM_APPS` / `PUBLIC_APPS`                       | 按需填入 appId；影响权益卡、引导等展示                                        |
| 引导视频         | `src/constant/url.ts` → `GUIDE_VIDEO_*`             | 可替换为自己的 CDN 资源                                                       |
| 系统设置功能页   | `src/global.config.ts` → `functionalPages.settings` | 设备面板未自定义设备详情时必填（平台公共页）                                  |

> 模板内默认的 `MINI_PROGRAM_ID` 为示例值，上线前务必换成自己的，否则商城与 Agent 会绑到他人配置。

## 能力依赖

- BaseKit 3.0.6 · MiniKit 3.9.8 · DeviceKit 4.14.0 · BizKit 3.9.0 · HomeKit 3.13.1 · WearKit 3.1.0
- baseversion 2.30.23
- @ray-js/ray 1.7.82

### 云端 / 业务前置（建议核对）

- 产品已关联本面板，真机可 `initDevInfo`
- VAS 商城：catalog、`bindingObjectCode`（= `MINI_PROGRAM_ID`）已配置
- Agent 渠道：与 `MINI_PROGRAM_ID` 绑定，接口 `getAgentChannel` 可返回
- 弹窗 / 功能开关：`getPopupSwitchConfig`（订阅引导、权益卡等）
- WearKit：录音、离线传输、悬浮窗等；公版若无商业版私有桥，相关能力会软降级（见 `src/api/ttt.ts`）

## 页面结构（可裁剪参考）

```
pages/home          首页（历史 / 我的 / 设置入口）
pages/recordingMode 录音
pages/detail        详情（转写 / 总结 / 思维导图）
pages/btOffline     蓝牙离线
pages/imagePreview  图片预览

pkgEntry            搜索 / 卡片传输 / 批量文件
pkgShop             商城 / 权益 / 自动续费协议
pkgSettings         设置 / 用量 / 云同步 / Web 版 / 小组件
pkgTemplate         自定义模板 / 更多模板 / 模板详情
```

## 范围说明

**包含：** 首页 / 录音 / 详情 / 设置 / 模板 / 商城（权益），面板 `initDevInfo`，手机作为录音音源。

**已移除：** pkgDevice（我的设备 / 激活 / 智能设备引导）、家庭设备列表同步、多设备增删 MQTT。

## 许可证

[License Details](LICENSE)
