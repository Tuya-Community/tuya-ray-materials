English[](README.md) | [简体中文](README_zh.md)

## Product name: Gateway template

## 1、Instructions

Before using this template, you need to have a basic understanding of the Ray framework. It is recommended to refer to the [Ray development documentation](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview)

## 2、 Quick start:

- [Create a product](https://developer.tuya.com/en/miniapp/develop/ray/guide/start/quick-start#create-product)

  In the tutorial, the major appliance category is used as an example. Please switch to the gateway category during actual development.

- [Create a project and import the project code in the IDE](https://developer.tuya.com/en/miniapp/develop/ray/guide/start/quick-start#initialize-project)

## 3、Capability dependency

- App version
  - Tuya Smart 4.5.0 and above
- TTT dependency
  - BaseKit: 3.0.0
  - MiniKit: 3.0.1
  - DeviceKit: 3.5.1
  - BizKit: 3.0.6
  - HomeKit: 3.1.3
  - baseversion: 2.23.0
- components dependency
  - @ray-js/gateway-add-device-progress: 2.0.6

## 4、Panel function

- Query gateway network information
- Manage zigbee sub-devices: add sub-devices
- Manage Bluetooth sub-devices: Add sub-devices, associate/disassociate sub-devices, migrate to other gateways

## 5、Problem feedback

### 5.1、Query network status through mqtt

```ts
// Panel send to gateway
interface IPanelToGateway {
  reqType: 'gwNetStat';
  protocol: 64;
  data: {};
}

// Gateway send to panel
interface IGatewayToPanel {
  reqType: 'gwNetStat';
  protocol: 65;
  data: {
    connType: 0 | 1 | 2; // Gateway connection method, 0-wired, 1-wifi, 2-4G
    rssi: number; // Gateway signal strength
  };
}
```

### 5.2、Gateway management sub-device capability flag

Judged by the devInfo.protocolAttribute.

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
  /** bluetooth */
  BLUETOOTH = 6,
  /** beacon 2.0 */
  BEACON2 = 7,
  /** roaming device */
  ROAMING = 8,
  /** Matter over WiFi device access */
  MatterOverWiFi = 9,
}
```

### 5.3、Sub-device capability flag

Judged by the devInfo.capability.

```ts
enum DeviceCapability {
  /** Wi-Fi */
  WIFI = 0,
  /** cable */
  CABLE = 1,
  /** gprs（2/3/4G） */
  GPRS = 2,
  /** NB-IOT */
  NBIOT = 3,
  /** bluetooth BLE */
  BLUETOOTH = 10,
  /** 涂鸦mesh */
  BLEMESH = 11,
  /** zigbee */
  ZIGBEE = 12,
  /** infrared */
  INFRARED = 13,
  /** subpieces（315，433 etc.） */
  SUBPIECES = 14,
  /** Sigmesh */
  SIGMESH = 15,
  /** MCU */
  MCU = 16,
  /** tuya Sub-G Mesh */
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

## 6、Problem feedback

If you have any questions, please visit the link and submit post feedback: https://tuyaos.com/viewforum.php?f=22

## 7、License

[License details](LICENSE)

## 8、Changelog

[0.0.3] - 2024/11/27

Gateway panel template completed.
