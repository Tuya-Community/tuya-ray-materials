[English](README.md) | 简体中文[](README_zh.md)

## 激光扫地机模版

## 1、使用须知

- 使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)
- 了解 [SDM 开发方式](https://developer.tuya.com/cn/miniapp/develop/ray/extended/common/sdm/usage)
- 学习[扫地机器人 Codelab](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-robot-sweeper-guide/index.html#0)

## 2、 快速上手

- [创建产品](https://developer.tuya.com/cn/miniapp/develop/miniapp/guide/start/quick-start#%E4%BA%8C%E5%88%9B%E5%BB%BA%E4%BA%A7%E5%93%81)
- [创建小程序](https://developer.tuya.com/cn/miniapp/common/desc/platform)

## 3、开发注意事项

- IDE 开发暂时不支持 p2p 通道进行数据传输，在 IDE 上进行开发时，请安装[扫地机调试助手](https://developer.tuya.com/cn/miniapp/devtools/tools/extension/panel-plugins/dev-sweeper)

  该插件支持真实连接真实的扫地机设备，也可以自行模拟数据上报

- 如果您是新客户接入，请联系涂鸦的项目经理获取扫地机的协议文档

## 4、能力依赖

- App 版本
  - 涂鸦智能 5.15.0 及以上版本
- TTT 依赖
  - BaseKit: 3.0.0
  - MiniKit: 3.0.1
  - DeviceKit: 4.0.8
  - BizKit: 4.2.0
  - P2PKit: 2.1.1
  - IPCKit: 1.3.6
- 组件依赖

  - [Smart UI](https://developer.tuya.com/material/smartui?comId=help-getting-started)

- IDE 插件依赖
  - [扫地机调试助手](https://developer.tuya.com/cn/miniapp/devtools/tools/extension/panel)

## 5、 地图组件

你可以通过以下指令查看地图组件的文档

```sh
$ npx serve node_modules/@ray-js/robot-map-sdk/dist-docs
```

在地图组件的选用上，我们提供了 WebViewMap 和 RjsMap 两种模式的组件。

- WebViewMap 组件以原生 Webview 形式引入做为异层结构，默认铺满全屏，是独立于小程序逻辑层和视图层的双线程架构，拥有更好的交互性能体验。单个小程序页面限制只能使用一个。如若需要在 WebView 上叠加视图按钮，请结合[CoverView](https://developer.tuya.com/cn/miniapp/develop/ray/component/view-container/cover-view)使用。详细可查看模板中的示例。

> **请注意：** **WebViewMap 属于基于异层渲染的原生组件，请详细阅读[原生组件使用限制](https://developer.tuya.com/cn/miniapp/develop/miniapp/component/native-component/native-component)**

- RjsMap 组件以 RJS 组件形式作为视图层组件的扩充，拥有可以动态设置组件宽高的特性。RjsMap 组件，运行与小程序的视图层，与页面元素位于同一层次结构，在频繁的地图数据交互中，可能对视图元素的交互响应产生影响。单个小程序页面可以引入多个。

## 6、面板功能

- 多模式清扫
- 地图管理
- 地图编辑（禁区 / 虚拟墙 / 地板材质）
- 房间编辑（分割 / 合并 / 房间命名 / 清扫顺序）
- 清洁偏好设置
- 设备定时
- 勿扰模式
- 清扫记录
- 语音包设置
- 手动控制
- 视频监控
- AI 物体识别

## 7、后续功能规划

- 扫地机组件使用文档说明

## 8、问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 9、许可

[许可详情](LICENSE)

## Changelog

### [1.0.3] - 2025-10-31

#### Changed

- @ray-js/robot-map 更新到 **0.0.2-beta-36**，修复了若干问题。
- 更新了 runtime 的用法，需要使用 useMemo 来包裹以提升性能。

### [1.0.2] - 2025-10-29

#### Changed

- @ray-js/robot-map 更新到 **0.0.2-beta-32**，修复了若干问题。

### [1.0.1] - 2025-10-21

#### BREAKING CHANGE

- 地图组件更换为@ray-js/robot-map，涉及地图组件的页面都已经完成了接入重写。原有地图组件已废弃。

### [0.0.18] - 2025-6-19

#### **BREAKING CHANGE**

- **@ray-js/robot-map-component** 更新到 **2.0.0**，地图组件拆分为**WebViewComponent**和**RjsMapComponent**，升级后无法兼容原有模板，请参考模板 commit 进行业务上的改造

#### Added

- 升级了 Ray & Smart-UI 的版本，引入了**SmartUIAutoImport**提升页面加载速度

#### Changed

- **@ray-js/robot-map-middleware** 更新到 **1.0.7**
- **@ray-js/ray-error-catch** 更新到 **0.0.25**
- **@ray-js/robot-data-stream** 更新到 **0.0.12**

#### Fixed

- parseDataFromString 对于正则不匹配的情况修改为过滤这条数据

### [0.0.17] - 2025-5-15

#### Added

- 增加了通过 dp 点接入 AI 物体识别功能的示例(36/37 协议)
- 新增支持配置房间默认名称
- 新增多地图离屏截图支持配置宽高

#### Changed

- **@ray-js/robot-map-component** 更新到 **1.0.4**。
- **@ray-js/robot-map-middleware** 更新到 **1.0.5**。
- **@ray-js/robot-protocol** 更新到 **0.11.2**。

#### Fixed

- 修复安卓云端地图偶现下载失败的问题(导致清扫记录/多地图等不能正常展示)
- 修复了 AI 物体图标无法被清空的问题
- 修复了 AI 物体图标配置成跟随地图缩放后，图标比例异常的问题
- 修复无法设置区域长度单位字体大小的问题

### [0.0.16] - 2025-4-11

#### Added

- 支持充电桩预警圈配置半径

#### Changed

- **@ray-js/robot-map-component** 更新到 **1.0.3**。
- **@ray-js/robot-map-middleware** 更新到 **1.0.3**。
- **@ray-js/robot-protocol** 更新到 **0.11.1**。

#### Fixed

- 修复路径可能出现漂移的问题
- 修复离屏截图可能被首页地图的 `runtimeData` 影响的问题
- 修复地图双指缩放可能导致地图消失以及缩放失效的问题
- 修复房间编辑功能看不到房间属性的问题
- 修复大地图上禁区&虚拟墙按钮显示过小的问题
- 修复多地图截图造成的 App 缓存可能无限增长的问题

### [0.0.15] - 2025-3-14

#### Added

- 新增地图离屏截图的能力，重构了多地图逻辑，提升多地图加载性能。

#### Changed

- **@ray-js/robot-map-component** 更新到 **1.0.0**。
- **@ray-js/robot-map-middleware** 更新到 **1.0.0**。
- **@ray-js/robot-protocol** 更新到 **0.10.7**。

### [0.0.14] - 2025-3-6

#### Added

- 支持自定义房间气泡弹窗。
- 暴露房间常态颜色配置。
- 支持特殊房间背景颜色配置。

#### Changed

- **@ray-js/robot-map-component** 更新到 **1.0.0-beta-2**。
- **@ray-js/robot-map-middleware** 更新到 **1.0.0-beta-2**。

### [0.0.13] - 2025-2-27

#### Changed

- **@ray-js/robot-map-component** 更新到 **v0.1.0-beta-17**。
- **copy-script** 脚本更新。

### [0.0.12] - 2025-02-21

#### Added

- 支持通过 `pathVisible` 动态显示/隐藏路径
- 升级 ray 版本至 1.6+ (优化打包体积)

#### Fixed

- 修复了部分安卓手机偶现报错 `function is not defined` 的问题
- 修复了 iOS15 偶现无法加载地图的问题
- 修复了手机后台切换到前台后 P2P 偶现无法连接的问题
- 修正了 **使用地图** 指令 url 获取的方式
- 修复地图偶发性的无法更新问题(需要将 App 更新到 6.3.0+)
- 修复 `DialogInstance` 偶发性打不开的问题

### [2024-12-10]

#### Added

- 新增 IconFont 组件

#### Fixed

- 修复了 RjsMap 组件可能无法更新实时地图的问题

### [2024-11-22]

#### Added

- 新增手动控制页面
- 新增视频监控页面
- 新增 AI 物体识别功能
- 新增房间清扫顺序功能
- 新增清洁偏好设置页面
- 新增地板材质设置功能
- **@ray-js/robot-map-component** 更新到 **v0.0.18**，支持 WebView 地图容器尺寸&位置可配置，修复部分问题。
- **@ray-js/robot-protocol** 更新到 **v0.9.2**， 新增支持`虚拟墙设置 0x48/49` `禁区设置 0x1a/1b` `勿扰时间设置 0x32/33` `地板材质设置 0x52/0x53` 协议，修复部分问题。

#### Changed

- 更换了地图 Loading 的动画
- 地图背景颜色统一且可配置

#### Fixed

- 修复了协议版本 v0 的地图无法正常展示的问题
- 修复了 lz4 压缩的路径无法正常展示的问题

### [2024-11-12]

#### Fixed

- 修复了房间命名弹窗弹出后会导致地图手势失效的问题

### [2024-11-11]

#### Added

- 新增定时页面
- 新增勿扰模式页面
- 新增房间编辑页面
- 新增清扫记录页面
- 新增语音包页面
- 新增支持 IDE 地图调试功能

#### Fixed

- 修复了 rjs 地图与 WebView 地图之间不对齐的问题
- 修复一些已知问题

#### Changed

- 重构了已有的部分页面及组件
