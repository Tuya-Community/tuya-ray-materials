[English](./README.md) | 简体中文

# @ray/ble-transparent-utils

[![latest](https://img.shields.io/npm/v/@ray/ble-transparent-utils/latest.svg)](https://www.npmjs.com/package/@ray/ble-transparent-utils) [![download](https://img.shields.io/npm/dt/@ray/ble-transparent-utils.svg)](https://www.npmjs.com/package/@ray/ble-transparent-utils)

> 蓝牙数据传输工具

## 安装

```sh
$ yarn add @ray-js/ble-transparent-utils
```

## 开发

```sh
# 安装依赖
yarn install

# 实时编译Demo代码
yarn start:tuya
```

## 方法说明

### `sendPackets`

**描述**：发送分包数据。

**参数**：

**Object object**

| 属性            | 类型            | 说明                                                   | 是否必填 | 默认值            |
| --------------- | --------------- | ------------------------------------------------------ | -------- | ----------------- |
| deviceId        | String          | 设备 ID                                                | 是       |                   |
| packets         | `Array<string>` | 分包数据, 十六进制字符串数组                           | 是       |                   |
| dpValue         | Any             | dp 值。需要先发 dp 再发分包数据时必须传入              | 否       |                   |
| dpId            | Number          | dp ID。需要先发 dp 再发分包数据时必须传入              | 否       |                   |
| timeout         | Number          | 超时时间                                               | 否       | 500               |
| maxRetries      | Number          | 最大重试次数                                           | 否       | 5                 |
| sendDp          | Function        | 发送 dp 数据的函数。需要先发 dp 再发分包数据时必须传入 | 否       |                   |
| parseReportData | Function        | 解析设备回复数据中的包号的函数                         | 否       | `parseReportData` |
| onProgress      | Function        | 进度回调函数                                           | 否       |                   |

**返回值**：`Promise<boolean>`，表示是否发送成功。

### `sendPacketsInOrder`

**描述**：发送分包数据，按顺序发送

**参数**：

**Object object**

| 属性            | 类型            | 说明                                                   | 是否必填 | 默认值            |
| --------------- | --------------- | ------------------------------------------------------ | -------- | ----------------- |
| deviceId        | String          | 设备 ID                                                | 是       |                   |
| packets         | `Array<string>` | 分包数据, 十六进制字符串数组                           | 是       |                   |
| dpValue         | Any             | dp 值。需要先发 dp 再发分包数据时必须传入              | 否       |                   |
| dpId            | Number          | dp ID。需要先发 dp 再发分包数据时必须传入              | 否       |                   |
| timeout         | Number          | 超时时间                                               | 否       | 500               |
| maxRetries      | Number          | 最大重试次数                                           | 否       | 5                 |
| sendDp          | Function        | 发送 dp 数据的函数。需要先发 dp 再发分包数据时必须传入 | 否       |                   |
| parseReportData | Function        | 解析设备回复数据中的包号的函数                         | 否       | `parseReportData` |
| onProgress      | Function        | 进度回调函数                                           | 否       |                   |

**返回值**：`Promise<boolean>`，表示是否发送成功。

### `createPackets`

**描述**：生成分包数据。

**参数**：

**Object object**

| 属性          | 类型   | 说明                       | 是否必填 | 默认值 |
| ------------- | ------ | -------------------------- | -------- | ------ |
| hexStringData | String | 需要发送的十六进制字符数据 | 是       |        |
| packetSize    | number | 分包的字节大小             | 否       | 1006   |

**返回值**：`Array<string>`，分包后的数据。

### `publishBLETransparentDataAsync`

**描述**：BLE(thing)下发透传数据, 基于 publishBLETransparentData 封装的异步函数

**参数**：

**Object object**

| 属性     | 类型   | 说明         | 是否必填 | 默认值 |
| -------- | ------ | ------------ | -------- | ------ |
| deviceId | String | 设备 ID      | 是       |        |
| data     | string | 要发送的数据 | 是       |        |

**返回值**：`Promise<boolean>`，表示发送的结果。

### `parseReportData`

**描述**：解析设备回复数据字符中的包号的函数。

**参数**：

| 参数       | 类型          | 说明                         | 是否必填 | 默认值 |
| ---------- | ------------- | ---------------------------- | -------- | ------ |
| reportData | `IReportData` | 设备回复数据                 | 是       |        |
| start      | number        | 返回数据字符中包号的起始位置 | 否       | 12     |
| end        | number        | 返回数据字符中包号的结束位置 | 否       | 16     |

**`IReportData`**

| 属性     | 类型   | 说明           | 是否必填 | 默认值 |
| -------- | ------ | -------------- | -------- | ------ |
| deviceId | string | 设备 ID        | 是       |        |
| data     | string | 设备回复的数据 | 是       |        |

**返回值**：`number`，表示解析出的包号。

## 使用

```js
import { sendPackets, createPackets, parseReportData } from '@ray/ble-transparent-utils';
import { devices, protocolUtils } from '@/devices';

const handleSendData = async () => {
  try {
    const deviceId = 'your-device-id';
    const dpCode = 'your-dpCode';
    const hexStringData ='your-hex-data';

    // 获取 dpId, dpValue
    const schema = devices.common.getDpSchema();
    const dpId = schema[dpCode].id;
    const dpValue = protocolUtils[dpCode].formatter({ ... });

    // 传入需要传输的十六进制数据, 生成分包数据
    const packets = createPackets({ hexStringData });

    // 发送分包数据
    const result = await sendPackets({
      deviceId,
      packets,
      dpValue,
      dpId,
      sendDp: () => {
        actions[dpCode].set({ ... });
      },
      parseReportData: (reportData) => parseReportData(reportData, 8, 12)
    });
    if (result) {
      console.log('Send successfully');
    } else {
      console.log('Send failed');
    }
  } catch (error) {
    console.log('Send failed', error);
  }
};
```
