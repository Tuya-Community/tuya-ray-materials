[English](README.md) | 简体中文[](README_zh.md)

## 项目名称：告警 SDK Demo

## 1. 使用须知

参考该 Demo 开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)

## 2. 快速上手

- 创建一个传感品类下的温湿度产品，添加 DP ID 1，功能点类型选择温度传感器，DP ID 1 的数据类型选择数值型，单位选择摄氏度。
- 导入该 Demo 示例文件至 Tuya MiniApp IDE，即可运行。

## 3. 能力依赖

- App 版本
  - 智能生活 4.5.0 及以上版本
- TTT 依赖
  - **HomeKit: 3.0.2**
  - BaseKit: 3.0.0
  - MiniKit: 3.0.0
  - DeviceKit: 3.0.0
  - BizKit: 3.0.1
  - baseversion: 2.10.29
- 产品依赖
  - 传感/温湿度传感器

| DP ID | 功能点名称 | 标识符       | 数据传输类型 | 数据类型 | 功能点属性                                    |
| ----- | ---------- | ------------ | ------------ | -------- | --------------------------------------------- |
| 1     | 温度       | temp_current | 只上报（ro） | value    | 数值范围: -200-600, 间距: 1, 倍数: 1, 单位: ℃ |

## 4. 面板功能

该 Demo 围绕温湿度传感器的温度上下限告警功能提供了简单的 Demo 示例，主要实现了以下功能：

- 温度上下限告警的新增及修改
- 温度上下限告警的启动及禁用
- 温度上下限告警的删除
- 温度上下限告警的列表展示

_注：该 Demo 示例仅供参考，具体功能可根据实际的需求进行修改_

## 5. 功能实现

更多可参考 [智能设备模型-告警推送通用](https://developer.tuya.com/cn/miniapp/solution-panel/ability/common/sdm/abilities/alarm/usage#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%91%8A%E8%AD%A6)

## 6. 问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7. 许可

[许可详情](LICENSE)

## 8. 更新日志

### [1.0.0] - 2025-04-18

第一个版本
