English | [简体中文](./README-zh_CN.md)

# @ray/ble-transparent-utils

[![latest](https://img.shields.io/npm/v/@ray/ble-transparent-utils/latest.svg)](https://www.npmjs.com/package/@ray/ble-transparent-utils) [![download](https://img.shields.io/npm/dt/@ray/ble-transparent-utils.svg)](https://www.npmjs.com/package/@ray/ble-transparent-utils)

> Bluetooth Data Transfer Tool

## Installation

```sh
$ yarn add @ray-js/ble-transparent-utils
```

## Develop

```sh
# Install dependencies
yarn install

# Real-time compilation of demo code
yarn start:tuya
```

## Method Description

### `sendPackets`

**Description**：Send subpackage data.

**Parameter**：

**Object object**

| Property        | Type            | Instructions                                                                                   | Required | Default value     |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------- | -------- | ----------------- |
| deviceId        | String          | Device ID                                                                                      | Yes      |                   |
| packets         | `Array<string>` | Subpackage data, hexadecimal string array                                                      | Yes      |                   |
| dpValue         | Any             | Dp value。When sending sub-package data after sending dp, it must be passed in                 | No       |                   |
| dpId            | Number          | Dp ID。It is necessary to send DP first and then send the subpackage data.                     | No       |                   |
| timeout         | Number          | Timeout                                                                                        | No       | 500               |
| maxRetries      | Number          | Retry Count                                                                                    | No       | 5                 |
| sendDp          | Function        | Function to send dp data. It must be passed in when sending dp before sending subpackage data. | No       |                   |
| parseReportData | Function        | Function to parse the packet number in device response data                                    | No       | `parseReportData` |
| onProgress      | Function        | Progress Callback Function                                                                     | No       |                   |

**Return Value**：`Promise<boolean>`，Indicates whether the sending was successful。

### `sendPacketsInOrder`

**Description**：Send sub-package data, send in order

**Parameter**：

**Object object**

| Property        | Type            | Instructions                                                                                   | Required | Default value     |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------- | -------- | ----------------- |
| deviceId        | String          | Device ID                                                                                      | Yes      |                   |
| packets         | `Array<string>` | Subpackage data, hexadecimal string array                                                      | Yes      |                   |
| dpValue         | Any             | Dp value。When sending sub-package data after sending dp, it must be passed in                 | No       |                   |
| dpId            | Number          | Dp ID。It is necessary to send DP first and then send the subpackage data.                     | No       |                   |
| timeout         | Number          | Timeout                                                                                        | No       | 500               |
| maxRetries      | Number          | Retry Count                                                                                    | No       | 5                 |
| sendDp          | Function        | Function to send dp data. It must be passed in when sending dp before sending subpackage data. | No       |                   |
| parseReportData | Function        | Function to parse the packet number in device response data                                    | No       | `parseReportData` |
| onProgress      | Function        | Progress Callback Function                                                                     | No       |                   |

**Return Value**：`Promise<boolean>`，Indicates whether the sending was successful。

### `createPackets`

**Description**：Generate subpackage data.

**Parameter**：

**Object object**

| Property      | Type   | Instructions                                         | Required | Default value |
| ------------- | ------ | ---------------------------------------------------- | -------- | ------------- |
| hexStringData | String | The hexadecimal character data that needs to be sent | Yes      |               |
| packetSize    | number | Byte size of the subcontract                         | No       | 1006          |

**Return Value**：`Array<string>`，Data after subcontracting.

### `publishBLETransparentDataAsync`

**Description**：Send transparent data under BLE (thing), an asynchronous function encapsulated based on publishBLETransparentData

**Parameter**：

**Object object**

| Property | Type   | Instructions    | Required | Default value |
| -------- | ------ | --------------- | -------- | ------------- |
| deviceId | String | Device ID       | Yes      |               |
| data     | string | Data to be sent | Yes      |               |

**Return Value**：`Promise<boolean>`，Indicate the result of the sent message.

### `parseReportData`

**Description**：Function to parse the package number in the device response data string.

**Parameter**：

| Property   | Type          | Instructions                                                           | Required | Default value |
| ---------- | ------------- | ---------------------------------------------------------------------- | -------- | ------------- |
| reportData | `IReportData` | Device response data                                                   | Yes      |               |
| start      | number        | The starting position of the package number in the returned data       | No       | 12            |
| end        | number        | The end position of the package number in the returned data characters | No       | 16            |

**`IReportData`**

| Property | Type   | Instructions                | Required | Default value |
| -------- | ------ | --------------------------- | -------- | ------------- |
| deviceId | string | Device ID                   | Yes      |               |
| data     | string | Data returned by the device | Yes      |               |

**Return Value**：`number`，Indicating the parsed package number.

## Use

```js
import { sendPackets, createPackets, parseReportData } from '@ray/ble-transparent-utils';
import { devices, protocolUtils } from '@/devices';

const handleSendData = async () => {
  try {
    const deviceId = 'your-device-id';
    const dpCode = 'your-dpCode';
    const hexStringData ='your-hex-data';

    // Obtain dpId, dpValue
    const schema = devices.common.getDpSchema();
    const dpId = schema[dpCode].id;
    const dpValue = protocolUtils[dpCode].formatter({ ... });

    // Input the hexadecimal data to be transmitted and generate subpackage data
    const packets = createPackets({ hexStringData });

    // Send subcontract data
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
