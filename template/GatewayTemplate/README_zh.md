[English](README.md) | 简体中文[](README_zh.md)

## 项目名称：网关模版

## 1、使用须知

使用该模板开发前， 需要对 Ray 框架有基本的了解，建议先查阅 [Ray 开发文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview)

## 2、 快速上手

- [创建产品](https://developer.tuya.com/cn/miniapp/develop/ray/guide/start/quick-start#%E4%BA%8C%E5%88%9B%E5%BB%BA%E4%BA%A7%E5%93%81)

  教程中以大家电品类为例，实际开发时请换成网关品类。

- [创建项目并在 IDE 中导入项目代码](https://developer.tuya.com/cn/miniapp/develop/ray/guide/start/quick-start#%E4%B8%89%E5%88%9D%E5%A7%8B%E5%8C%96%E5%B7%A5%E7%A8%8B)

## 3、能力依赖

- App 版本
  - 涂鸦智能 4.5.0 及以上版本
- TTT 依赖
  - BaseKit: 3.0.0
  - MiniKit: 3.0.1
  - DeviceKit: 3.5.1
  - BizKit: 3.0.6
  - HomeKit: 3.1.3
  - baseversion: 2.23.0
- 组件依赖
  - @ray-js/gateway-add-device-progress: 2.0.6

## 4、面板功能

- 查询网关网络信息
- 管理 zigbee 子设备：添加子设备
- 管理蓝牙子设备：添加子设备、关联/取消关联子设备、迁移到其他网关

## 5、功能实现

### 5.1、通过 mqtt 查询网络状态

```ts
// 面板发送给网关
interface IPanelToGateway {
  reqType: 'gwNetStat';
  protocol: 64;
  data: {};
}

// 网关发送给面板
interface IGatewayToPanel {
  reqType: 'gwNetStat';
  protocol: 65;
  data: {
    connType: 0 | 1 | 2; // 网关的连接方式，0-有线， 1-wifi， 2-4G
    rssi: number; // 网关的信号强度
  };
}
```

### 5.2、网关管理子设备能力标位

通过 devInfo.protocolAttribute 字段判断。

```ts
enum ProtocolAttribute {
  /** sigmesh */
  SIGMESH = 0,
  /** zigbee */
  ZIGBEE = 1,
  /** subpieces */
  SUBPIECES = 2,
  /** beacon */
  BEACON = 3,
  /** tread */
  THREAD = 4,
  /** ty mesh */
  TYMESH = 5,
  /** 蓝牙 */
  BLUETOOTH = 6,
  /** beacon 2.0 */
  BEACON2 = 7,
  /** 漫游设备 */
  ROAMING = 8,
  /** Matter over WiFi设备接入 */
  MatterOverWiFi = 9,
}
```

### 5.3、子设备能力标位

通过 devInfo.capability 字段判断。

```ts
enum DeviceCapability {
  /** Wi-Fi */
  WIFI = 0,
  /** cable（以太网） */
  CABLE = 1,
  /** gprs（2/3/4G） */
  GPRS = 2,
  /** NB-IOT */
  NBIOT = 3,
  /** 蓝牙BLE */
  BLUETOOTH = 10,
  /** 涂鸦mesh */
  BLEMESH = 11,
  /** zigbee */
  ZIGBEE = 12,
  /** infrared（红外） */
  INFRARED = 13,
  /** subpieces（315，433等） */
  SUBPIECES = 14,
  /** Sigmesh */
  SIGMESH = 15,
  /** MCU */
  MCU = 16,
  /** 涂鸦Sub-G Mesh */
  TYMESH = 17,
  /** Zwave */
  ZWAVE = 18,
  /** 蓝牙mesh */
  PLMESH = 19,
  /** LTE Cat1 */
  CAT1 = 20,
  /** 蓝牙beacon */
  BEACON = 21,
  /** CAT4 */
  CAT4 = 22,
  /** CAT10 */
  CAT10 = 23,
  /** LTE CATM */
  CATM = 24,
  /** tread */
  THREAD = 25,
}
```

## 6、问题反馈

若有疑问，请访问链接，提交帖子反馈：https://tuyaos.com/viewforum.php?f=10

## 7、许可

[许可详情](LICENSE)

## 8、Changelog

[0.0.3] - 2024/11/27

网关面板模板完成.
