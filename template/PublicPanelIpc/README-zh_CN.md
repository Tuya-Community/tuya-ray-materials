[English](./README.md) | 简体中文

# Ipc 小程序模板

## 1. 使用须知

使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)

## 2. 快速上手

- [创建产品](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#2)
- [创建项目并在 IDE 中导入项目代码](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#3)
- 相关 IPC 品类开发信息 [IPC 垂直解决方案 ](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#0)
- 更多模版信息请参考 [IPC 通用模板](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#0)


## 3. 能力依赖

### 插件依赖

- `@ray-js/ipc-player-integration`：融合播放器组件，内置录制、对讲、截图、电量、温湿度、云台、信号强度、横屏等 widget 功能
- `@ray-js/ray-ipc-half-horizontal-drag`：半屏 Banner 运营组件
- `@ray-js/ipc-ptz-zoom`：云台控制与变焦组件
- `@ray-js/ray-ipc-decrypt-image`：AES 加密图片解密组件
- `@ray-js/ray-ipc-collect-edit`：收藏点编辑组件
- `@ray-js/delay-loading`：Loading 阈值组件
- `@ray-js/ray-ipc-utils`：工具库（跳转相册、获取信号强度、判断对讲能力等）

### 小程序 Kit 依赖（以下依赖是 Kit 最低版本）

- BaseKit：3.0.0  
- MiniKit：3.0.1  
- DeviceKit：4.11.8  
- BizKit：4.12.1  
- IPCKit：6.4.11（必须 ≥ 此版本）

### App 版本支持

- 智能生活 v6.5.0 及以上版本

## 4. 面板功能

- **主题切换**：支持明暗主题，自动跟随 App
- **融合播放器**：支持预览、录制、截屏、对讲、音频、电量、温湿度、云台控制、码率、信号强度、横屏等
- **运营推广**：可配置服务营销信息与产品运营内容
- **功能入口**：如相册、云台与收藏点、激光灯开关等
- **更多功能**：隐私模式、WDR、巡航、灯开关等
- **快捷操作栏**：如回放、对讲、消息等高频功能

## 5.设计理念

- **界面清爽，重点突出**  
  将画面窗口和功能分区展示，告别杂乱。画面上方是摄像头画面，下方为运营窗口及功能入口，操作更顺手
- **结构简洁，功能易找**
  改变以往功能需多个 Tab 切换，现针核心功能集中展示，常用服务一键直达，云存储、消息提醒等高频内容触手可及。低频设置（如灯开关）统一收纳到二级菜单，操作更聚焦，不打扰。
- **高效运营，直达服务**
  您可以自主定义配置相关运营信息，首页直接展示，大幅提升产品转化率


## 6. 关键功能示例


### 播放器引入

```tsx
import { useEffect } from 'react';
import { useCtx, Features, IPCPlayerIntegration } from '@ray-js/ipc-player-integration';

const Home = props => {
  // 通过 useCtx 获取播放器实例关联上下文信息
  const instance = useCtx({
      devId: props.location.query.deviceId, // 设备ID
  });
  // 初始化融合播放器内置功能， 若不调用此事件，内置控件则不展示 
  useEffect(() => {
    Features.initPlayerWidgets(instance, {
      verticalResolutionCustomClick: false,
      hideHorizontalMenu: false,
    });
  }, []);

  <View className={Styles.playerContainer}>
    <IPCPlayerIntegration
      instance={instance} // 传入播放器实例
      devId={devInfo.devId} // 设备ID
      onPlayStatus={onPlayStatus} // 简化监听播放器状态 (0: 连接中 1: 预览中)
      privateState={dpState.basic_private || false} // 是否开启隐私模式
      deviceOnline={devInfo.isOnline} // 设备在线
      brandColor={brandColor} // 品牌色
      playerFit='contain' // 竖屏模式下，播放器填充模式 可选值：contain | cover
      landscapeMode="standard" // 横屏模式下，播放器填充模式: standard | fill
      extend={{
        ptzControllable: true // 是否开启播放器云台控制
      }}
    />
  </View>
}

export default Home;

```

```less
  .playerContainer {
     width: 100%;
     height: calc(100vw * 9 / 16);
  }
  
```

## 6. 问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7. 许可

[许可详情](LICENSE)

## 8. 更新日志

## [4.0.0] - 2025-06-30

- 全新升级对外模版 UI 及架构
