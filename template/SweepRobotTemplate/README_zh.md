[English](README.md) | 简体中文[](README_zh.md)

## 激光扫地机模版

## 1、使用须知

- 使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)
- 了解 [SDM 开发方式](https://developer.tuya.com/cn/miniapp/develop/ray/extended/common/sdm/usage)

## 2、 快速上手

- [创建产品](https://developer.tuya.com/cn/miniapp/develop/miniapp/guide/start/quick-start#%E4%BA%8C%E5%88%9B%E5%BB%BA%E4%BA%A7%E5%93%81)
- [创建小程序](https://developer.tuya.com/cn/miniapp/common/desc/platform)

## 3、开发注意事项

- ide 开发暂时不支持 p2p 通道进行数据传输，在 ide 上进行开发时，请安装[扫地机调试助手](https://developer.tuya.com/cn/miniapp/devtools/tools/extension/panel)

  该插件支持真实连接真实的扫地机设备，也可以自行模拟数据上报

- IndoorMap.Dynamic 组件无法使用扫地机调试助手进行调试，需要使用真实设备真机调试
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
  - IPCKit: 5.16.2
- 组件依赖

  - [Smart UI](https://developer.tuya.com/material/smartui?comId=help-getting-started)

- IDE 插件依赖
  - [扫地机调试助手](https://developer.tuya.com/cn/miniapp/devtools/tools/extension/panel)

## 5、关键模块依赖关系

为了能够让开发者更关注在 UI 层面的处理，而不需要过多关心一些其他的流程逻辑处理，我们将扫地机进行模块拆分，将底层实现与业务调用独立。目前扫地机面板主要依赖的包有以下几个

- @ray-js/robot-map-component 业务层直接调用， 提供了全屏地图和动态地图组件 [参考用法](src/components/MapView/index.tsx)，并且暴露了地图操作的常用方法。
- @ray-js/robot-data-stream 业务层直接调用，封装了面板与设备的 P2P 传输方法，开发者可以忽略 p2p 通信过程中的复杂过程，只需要关注业务本身逻辑
- @ray-js/robot-protocol 业务层直接调用，提供完整协议解析标准能力，将扫地机协议中比较复杂的 raw 类型 dp 点的解析、编码过程进行了封装
- @ray-js/webview-invoke 底层依赖，提供了小程序与底层 SDK 的通信能力，一般情况下不需要修改
- @ray-js/robot-middleware 底层依赖，提供逻辑层和 Webview 的业务中间处理
- @ray-js/hybrid-robot-map 底层依赖，扫地机基础 SDK，提供底层图层的渲染能力

对于普遍的扫地机需求，基本上只关注应用业务逻辑和 UI 展示，不需要关心内部依赖包中的实现，依赖包的升级会做到向下兼容，可以在项目中针对依赖包进行单独升级。

![模块依赖关系](src/res/diagram.png)

## 6、 地图组件选择

在地图组件的选用上，我们提供了 IndoorMap.Full 和 IndoorMap.Dynamic 两种模式的组件。

IndoorMap.Full 组件以原生 Webview 形式引入做为异层结构，只能设置为全屏，无法动态调整大小，是独立于小程序逻辑层和视图层的双线程架构，拥有更好的交互性能体验。如若需要在 WebView 上叠加视图按钮，请结合[CoverView](https://developer.tuya.com/cn/miniapp/develop/ray/component/view-container/cover-view)使用。详细可查看模板中的示例。

IndoorMap.Dynamic 组件以 RJS 组件形式作为视图层组件的扩充，拥有可以动态设置组件宽高的特性。IndoorMap.Dynamic 组件，运行与小程序的视图层，与页面元素位于同一层次结构，在频繁的地图数据交互中，可能对视图元素的交互响应产生影响。

## 7、面板功能

- 多模式清扫
- 地图管理
- 禁区/虚拟墙编辑
- 房间编辑
- 设备定时
- 勿扰模式
- 清扫记录
- 语音包设置

## 8、后续功能规划

- 模版支持房间属性设置
- 模板支持摄像头相关功能
- 模板支持 AI 物体识别功能
- 扫地机组件使用文档说明

## 9、问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 10、许可

[许可详情](LICENSE)
