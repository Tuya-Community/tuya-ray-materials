[English](README.md) | 简体中文[](README_zh.md)

## 项目名称：出行两轮车通用模版

## 1、使用须知

使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)

## 2、 快速上手

- [创建产品](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-outdoor-guide/index.html#2)
- [创建项目并在 IDE 中导入项目代码](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-outdoor-guide/index.html#3)
- 更多详细内容可参考[出行两轮车模版教程](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-outdoor-guide/index.html#0)

## 3、能力依赖

- App 版本
  - 涂鸦智能 APP 6.6.0 及以上版本
- TTT 依赖
  - "BaseKit": "3.0.0",
  - "MiniKit": "3.0.1",
  - "DeviceKit": "4.19.5",
  - "BizKit": "4.3.1",
  - "MapKit": "3.0.7"
  - "baseversion": "2.27.1",
- 组件依赖
  - 暂无
- 功能页依赖
  - 设备详情功能页：settings => 'tycryc71qaug8at6yt'

## 4、面板功能

- 车辆解锁、开锁
- 车辆定位、体检
- 车辆灯控、档位、限速设置等
- 查看车辆里程、icon、电量等信息

## 5、功能实现

- 参见[出行两轮车模版教程](https://developer.tuya.com/cn/miniapp-codelabs/codelabs/panel-outdoor-guide/index.html#0)

## 6、问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7、许可

[许可详情](LICENSE)

## 8. 更新日志

### [1.0.2] - 2024-11-27

#### Refactored

- 更新 `@ray-js/ray` 版本至 `1.5.44`
- 更新 `@ray-js/smart-ui` 版本至 `2.0.0`
- 引入 `设备详情功能页`

### [2.0.0] - 2025-07-08

#### Feature

- 更新 `@ray-js/ray` 版本至 `1.7.23`
- 更新 `@ray-js/smart-ui` 版本至 `2.5.0`
- UI2.0 功能迭代

### [2.1.0] - 2025-09-30

#### Feature

- 更新 `@ray-js/ray` 版本至 `1.7.41`
- 移除 OutdoorKit 支持涂鸦智能 APP
