# raytpl-key-pad-template

蓝牙配件面板模板

[English](README.md) | 简体中文

## 1. 使用须知

使用该模板开发前，需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)。

## 2. 快速上手

1. 安装 Node.js 18 及以上版本和 Yarn Classic，然后安装项目依赖：

   ```sh
   yarn install --frozen-lockfile
   ```

2. 按实际小程序项目填写 `project.tuya.json`，准备蓝牙配件产品及测试设备，
   并确保 IDE 中可使用下方列出的 Kit 版本。产品云能力需要单独配置。
3. 启动开发构建：

   ```sh
   yarn start
   ```

   在涂鸦小程序 IDE 中导入本仓库。小程序根目录为 `project.tuya.json` 中配置的
   `dist/tuya`，在 IDE 中选择对应产品及设备后预览和调试面板。
4. 执行本地检查并生成生产构建：

   ```sh
   yarn typecheck
   yarn lint
   yarn build
   ```

   构建产物输出到 `dist/tuya`。设备通信、用户权限及平台差异还需要在目标 App
   中连接设备验证。

## 3. 能力依赖

- App 版本
  - 智能生活 4.5.0 及以上版本
- TTT 依赖
  - BaseKit: 3.0.6
  - MiniKit: 3.0.0
  - DeviceKit: 3.0.0
  - BizKit: 3.0.1
  - HomeKit: 3.0.2
  - baseversion: 2.30.9

## 4. 面板功能

| 模块 | 功能 |
| --- | --- |
| 首页 | 设备名称、电量、安全守护天数、蓝牙状态与重连、告警摘要、未读角标及功能入口 |
| 告警 | 告警分组、分页、去重、未读数量刷新、空状态和失败重试 |
| 记录 | 开关门记录分组、分页、去重、空状态和失败重试 |
| 门锁管理 | 已绑定门锁列表、可绑定门锁列表、绑定、解绑及安全密钥激活 |
| 开锁方式 | 根据设备能力展示蓝牙钥匙、密码、指纹、门卡、人脸和掌静脉 |
| 钥匙与密码管理 | 永久/临时蓝牙钥匙，永久/在线临时/离线/动态密码，无效密码查询及清空码 |
| 生物识别录入 | 支持的开锁方式录入引导、采集进度、结果、重命名、编辑和删除 |
| 配件设置 | 根据设备 Schema 展示布尔开关、枚举设置、开锁模式配置和操作引导入口 |
| 权限控制 | 根据 OWNER、ADMIN、MEMBER、SHARE 角色控制入口和管理操作 |

项目目前包含 20 个页面路由，路由定义位于 `src/routes.config.ts`，首页入口映射位于 `src/utils/homeEntry.ts`。

## 5. 问题反馈

请在本模板仓库提交 Issue，提供 App 和 IDE 版本、设备型号、复现步骤、预期与实际结果，
以及相关截图或日志。分享诊断信息前，请移除密码、Token 和个人信息。

## 6. 功能实现

| 模块 | 实现位置与职责 |
| --- | --- |
| 应用初始化 | [src/app.tsx](src/app.tsx) 初始化面板环境；[src/composeLayout.tsx](src/composeLayout.tsx) 初始化配件 SDK，管理共享监听和首页数据。 |
| 设备模型 | [src/devices/index.ts](src/devices/index.ts) 根据启动参数创建设备或群组模型。 |
| 页面与路由 | [src/routes.config.ts](src/routes.config.ts) 声明页面路由；[src/pages](src/pages) 实现各业务页面。 |
| 共享状态与权限 | [src/redux](src/redux) 保存共享数据；[src/hooks/useUserPermission.ts](src/hooks/useUserPermission.ts) 根据用户角色派生权限。 |
| 多语言与资源 | [src/i18n](src/i18n) 定义多语言文案；[cdn/cdnImage.json](cdn/cdnImage.json) 保存通过 `getCdnUrl` 解析的资源映射。 |
| 主题与设置 | [src/config/index.ts](src/config/index.ts) 定义主题和密码选项；[src/pages/set/index.tsx](src/pages/set/index.tsx) 根据设备 Schema 展示设置项。 |
| 构建配置 | [ray.config.ts](ray.config.ts) 配置 Smart UI 按需加载；[src/global.config.ts](src/global.config.ts) 配置窗口及设备详情功能页。 |

## 7. 许可

本项目采用 [MIT 许可证](LICENSE)。

## 8. 更新日志

### 0.1.0

- 初始蓝牙配件面板模板。
