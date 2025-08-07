[简体中文](./README-zh_CN.md) | English

# Light Strip Clipping Feature Page

## 1. Introduction to the Feature Page

1. The feature page is developed as a characteristic feature to extract some of the more common capabilities (such as payment, login, etc.) within mini programs.
2. Any host mini program can integrate and use them.

## 2. Usage Scenarios

1. As a relatively independent module, light strip clipping is used in almost all lighting strips. Conducting separate feature development for each instance can consume a lot of developers' efforts, so its functionality is extracted as a feature page capability, available for developers to use to enhance development and delivery efficiency.
2. Supported capabilities:
   1. Synchronize the clipped light strip length

## 3. Routing

| Route Name                             | Route URL | Route Parameters    | Route Description      | Applicable Scenarios  |
| -------------------------------------- | --------- | ------------------- | ---------------------- | --------------------- |
| Light Strip Clipping Feature Page Home | /home     | deviceId \/ groupId | Enter the feature page | See explanation above |

### Route Parameters

| Parameter Name | Parameter Description              | Default Value |
| -------------- | ---------------------------------- | ------------- |
| deviceId       | Device Id, choose one with groupId | -             |
| groupId        | Group Id, choose one with deviceId | -             |

## 4. Dependent DP

DPs that the host mini program needs to associate with the product.

| Identifier            | Description           | Data Transmission Type | Data Type       | Feature Point Attributes                                   | Required |
| --------------------- | --------------------- | ---------------------- | --------------- | ---------------------------------------------------------- | -------- |
| light_length          | Total length          | Send and report (rw)   | Numeric (Value) | Numeric range: 1-10000, Interval: 1, Multiple: 0, Unit: cm | Required |
| light_pixel           | Total points          | Send and report (rw)   | Numeric (Value) | Numeric range: 1-1024, Interval: 1, Multiple: 0            | Required |
| lightpixel_number_set | Points/Length setting | Send and report (rw)   | Numeric (Value) | Numeric range: 1-1000, Interval: 1, Multiple: 0            | Required |

## 5. How to Integrate

### global.config.ts file

```js
const tuya = {
  // ...other configurations
  functionalPages: {
    // Light Strip Clipping Feature Page
    rayStripClipFunctional: {
      // tyj0zkwgqubepk3r1h is the ID for the feature page
      appid: 'tyj0zkwgqubepk3r1h',
    },
    // ...other possible feature pages
  },
};
```

### Redirect to the Feature Page

```js
import { navigateTo } from '@ray-js/ray';
// deviceId for single device ID details, refer to the table above
// groupId for group ID details, refer to the table above
const jumpUrl = `functional://rayStripClipFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

navigateTo({
  url: jumpUrl,
  fail(e) {
    console.log(e);
  },
  success(e) {
    console.log(e);
  },
});
```

### presetData Jump to the function page
```js
import { navigateTo } from '@ray-js/ray';
const jumpUrl = `functional://rayStripClipFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

// Promise-based data handling for storage feature page
export const presetFunctionalData = (
  url: string,
  data: Record<string, any>
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    ty.presetFunctionalData({
      url,
      data,
      success: () => resolve(true),
      fail: err => reject(err),
    });
  });
};

// Add feature page preset data
await presetFunctionalData(jumpUrl, {
  themeColor: 'red',
  theme: 'light',
  backgroundStyle: {
    background: 'red',
  },
  hiddenBigIcon: true
})
navigateTo({
  url: jumpUrl,
  fail(e){console.log(e)},
  success(e){console.log(e)}
});
```

### presetFunctionalData API

| Parameter         | Parameter description          | type                   | Default Value   | Is it required |
| ----------- | ---------------- | ---------------------- | ------ | -------- |
| themeColor `v1.1.11` | Theme Color           | _string_  | `'rgba(16, 130, 254, 1)'` | Optional   |
| theme  `v1.1.11`  | Subject      | _'dark'\|'light'_ | `'dark'`      | 非必填   |
| backgroundStyle  `v1.1.11`  | Background Style      | _React.CSSProperties_ | -      | Optional   |
| hiddenBigIcon  `v1.1.11`  | Hide large icons (default hidden in white theme)      | _boolean_ | false      | Optional   |

## Multi-language List

Can be overridden by the host project

```ts
export default {
  lscf_functionTitle: 'Strip Length Setting',
  lscf_tips:
    'If you have done the strip length cutting, you can adjust the actual length to better set the strip length.',
  lscf_virtualDeviceTips:
    'The virtual device does not have the necessary data to adjust the strip length, Please use real devices',
  lscf_cardTitle: 'Actual Length',
  lscf_cardTitlePoints: 'Actual Points',
  lscf_confirm: 'Confirm',
  lscf_cancel: 'Cancel',
  lscf_unitMeter: 'm',
  lscf_pointNum: 'points',
};
```

## TTT Capabilities

- App Version: 5.0.0 and above

- "BaseKit": "3.4.0",
- "MiniKit": "3.2.2",
- "BizKit": "3.5.6",
- "DeviceKit": "3.5.1"
- "baseversion": "2.12.18"

## 7. Version History

### v1.1.11

- Align the RN unit display
- New presetFunctionalData API added with parameters: themeColor, theme, backgroundStyle, hiddenBigIcon

### v1.1.10

- Change the number of segments displayed by the LED strip to 20.

### v1.1.7

- First complete version of the feature

## Notes⚠️

- 1. Clipping feature page appid: tyj0zkwgqubepk3r1h This ID is fixed. Please ensure the ID is correct when navigating.
- 2. Clipping feature page: rayStripClipFunctional This name is fixed. Ensure the configuration is correct.
- 3. Please confirm that the product must have the relevant light strip length DP; if this DP is absent, please hide the entry to this feature page.
