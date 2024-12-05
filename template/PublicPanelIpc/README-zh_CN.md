[English](./README.md) | 简体中文

## Ipc 小程序模板

## 1. 使用须知

使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)

## 2. 快速上手

- [创建产品](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#2)
- [创建项目并在 IDE 中导入项目代码](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#3)
- 更多详细内容可参考 [IPC 通用模板](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-ipc/index.html#0)

## 3. 能力依赖

- @ray-js/components-ty-ipc 播放器

### 小程序 Kit 依赖（以下依赖是 Kit 最低版本）

- TTT 依赖

  - BaseKit: 3.0.0
  - MiniKit: 3.0.0
  - DeviceKit: 3.0.0
  - BizKit: 3.0.1
  - baseversion: 2.10.1

- 功能页依赖
  - 设备详情功能页：settings => 'tycryc71qaug8at6yt'

### App 版本支持

- 智能生活 v4.5.0 及以上版本

## 4. 面板功能

- 主题：支持明、暗两种主题（跟随 App）
- 基础功能：预览、录制、截屏、对讲
- 扩展功能：回放、相册
- 其他功能：摄像头设置、云台、变焦

## 5. 功能实现

### 接口

- ty.device.getCameraConfigInfo 摄像头配置信息

### 播放器引入

```tsx
import { IpcPlayer as Player } from '@ray-js/components-ty-ipc';

<View className={Styles.playerWrap}>
  {devInfo?.devId && ( // 获取到设备id之后再渲染播放器，避免无法出流情况
    <Player
      defaultMute={isMute} // 静音状态
      devId={devInfo?.devId} // 设备id
      onlineStatus={devInfo.isOnline} // 设备在线状态
      updateLayout={`${playerLayout}`} // 更新播放器位置及大小时更新此值
      onChangeStreamStatus={onChangeStreamStatus} // 流状态变化事件
      onCtx={getIpcPlayer} // player组件实例
      onPlayerTap={handlePlayerClick} // 点击组件事件
      clarity={videoClarityObj[mainDeviceCameraConfig.videoClarity]} // 视频清晰度
      privateState={dpState.basic_private || false} // 隐私模式
    />
  )}
</View>;
```

## 6. 问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7. 许可

[许可详情](LICENSE)

## 8. 更新日志

## [3.13.3] - 2024-12-05

### Refactored

- 更新 `@ray-js/ray` 版本至 `1.5.44`
- 更新 `@ray-js/panel-sdk` 版本至 `1.13.1`
- 更新 `@ray-js/smart-ui` 版本至 `2.0.0`
- 使用 `@ray-js/smart-ui` 提供的 `NavBar` 组件替换项目内置的 `TopBar` 组件
