[简体中文](./README-zh_CN.md) | English

# Power Memory Functional Page Integration Documentation

## Basic Concepts

- Feature Page: Represents a specific functional interface, such as: login page, registration page, forgot password page, payment page, etc. These pages are characterized by single functionality, complete flow, can be independently accessed, and have clear business entry and exit points.
- Power-off Memory Feature Page: Sets the default state of the lamp from the lighting category when the power is cycled after an outage. Requires the standard DP `power_memory`.

## Route List

| Route Name          | Route Address | Route Parameters | Route Description                 | Applicable Scenarios                            |
| ----------------- | -------- | -------- | ------------------------ | ----------------------------------- |
| Power-off Memory Feature Page Home | /home    | deviceId \/ groupId | Set power-off memory page | Products with power-off memory DP |

## Route Parameters

| Parameter Name          | Parameter Description | Default Value | 
| ----------------- | -------- | -------- | 
| deviceId | Device Id    | -  | 
| groupId | Group Id, if both `deviceId` and `groupId` are provided, only `groupId` will be considered    |  - | 
| bgImgUrl | string   | -  | No   | Background image of the page, needs encodeURIComponent     |

## Dependency DP

DP dependencies required by the host app associated with the product

| Identifier | Description | Data Transmission Type  | Data Type  | Function Point Attributes | Mandatory |
| ----------------- | -------- | -------- | -------- | -------- |  -------- |  
| power_memory | Power-off Memory   | Writable and reportable (rw)  |  Pass-through (Raw) |  - |  Mandatory | 
| bright_value | White Light Brightness |  Writable and reportable (rw) |  Numeric (Value) |  Range: 10-1000, Interval: 1, Multiplier: 0 |   Not Mandatory | 
| temp_value | White Light Color Temperature |  Writable and reportable (rw) |  Numeric (Value) |  Range: 10-1000, Interval: 1, Multiplier: 0 |   Not Mandatory | 
| colour_data | Colored Light |  Writable and reportable (rw) |  Character (String)	 |  - |   Not Mandatory | 


## How to Integrate

### global.config.ts

```typescript
const tuya = {
  // ...other configurations
  functionalPages: {
    // Power-off Memory Feature Page
    LampPowerMemoryFunctional: {
      // tyabzhlpuchrkh7pe8 is the Id of the feature page
      appid: 'tyabzhlpuchrkh7pe8',
      // Current recommended version
      version: '1.3.1',
    },
    // ...other possible feature pages
  },
};
```
### Navigate to Feature Page

```typescript
import { navigateTo } from '@ray-js/ray';

// LampPowerMemoryFunctional is the name of the feature page configured in global.config.ts
const jumpUrl = `functional://LampPowerMemoryFunctional/home?deviceId=${deviceId || ''}&groupId=${
  groupId || ''
}`;
// Preset data
const data: PowerMemoryFunctionalData = {
  collectColors: [{ hue: 100, saturation: 1000, value: 1000 }],
  collectWhites: [{ brightness: 1000, temperature: 1000 }],
};

// Store feature page data in Promise
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

// Add preset data for feature page
await presetFunctionalData(jumpUrl, data)
// Navigate to feature page
navigateTo({ url: jumpUrl, fail: err => console.warn(err) });
```

### Listen for Feature Page Return

```ts
// Listen for sub-function changes
ty.device.onSubFunctionDataChange(item => {
  const { id } = item;
  if (id !== "tyabzhlpuchrkh7pe8") return;
  console.log('onSubFunctionDataChange', item);
});
// Remove listener
ty.device.offSubFunctionDataChange(res => {
  console.log('offSubFunctionDataChange', res);
});
```

### presetFunctionalData API

| Parameter  | Parameter Description | Type |  Default Value | Mandatory |
| ----------------- | -------- | -------- |  -------- |  -------- |
| customColor | Custom power-off memory value    | `Partial<CustomColor>`  |  `{ colorMode: 'white',hue: 0,saturation: 0,value: 0,brightness: 1000,temperature: 1000 }` |  Not Mandatory |
| collectColors | Colored light collection list    |  `ColourCustom[]` |  `[ { hue: 0, saturation: 1000, value: 1000 }, { hue: 120, saturation: 1000, value: 1000 }, { hue: 240, saturation: 1000, value: 1000 }];` |  Not Mandatory |
| collectWhites | White light collection list    |  `WhiteCustom[]` |  `[ { temperature: 0, brightness: 1000 }, { temperature: 500, brightness: 1000 }, { temperature: 1000, brightness: 1000 }]` |  Not Mandatory |
| bgStyle `v1.2.0` | Background style    |  `React.CSSProperties` |  - |  Not Mandatory |
| tabLineStyle `v1.2.0` | Tab line style    |  `React.CSSProperties` |  - |  Not Mandatory |
| cardStyle `v1.3.0` | The style of the entire card    |  `React.CSSProperties` |  - |  Not Mandatory |
| tabLineActiveStyle `v1.2.0` | Tab line active style    |  `React.CSSProperties` |  - |  Not Mandatory |
| smartUIThemeVars `v1.2.0` | Smart-UI component variables, refer to the `themeVars` property of the ConfigProvider component, modifiable component styles include: `NavBar`    |  `SmartConfigProviderProps['themeVars']` |  - |  Not Mandatory |
| dynamicDistribute `v1.3.1` | Dynamic real-time delivery   |  `boolean` |  `false` |  非必填 |

#### CustomColor

| Parameter  | Parameter Description | Type | Mandatory |
| ----------------- | -------- | -------- | -------- |
| colorMode | Mode: White or Colored    | `white` \| `colour`  | Not Mandatory |
| hue | Colored light hue 0-360    |  `number`  |  Not Mandatory |
| saturation | Colored light saturation 0-1000    |  `number` | Not Mandatory |
| value | Colored light value 0-1000    |  `number`  |  Not Mandatory |
| brightness | White light brightness 1-1000    |  `number` | Not Mandatory |
| temperature | White light color temperature 0-1000    |  `number` | Not Mandatory |

#### ColourCustom

| Parameter  | Parameter Description | Type | Mandatory |
| ----------------- | -------- | -------- | -------- |
| hue | Colored light hue 0-360    |  `number`  |  Not Mandatory |
| saturation | Colored light saturation 0-1000    |  `number` | Not Mandatory |
| value | Colored light value 0-1000    |  `number`  |  Not Mandatory |

#### WhiteCustom

| Parameter  | Parameter Description | Type | Mandatory |
| ----------------- | -------- | -------- | -------- |
| brightness | White light brightness 1-1000    |  `number` | Not Mandatory |
| temperature | White light color temperature 0-1000    |  `number` | Not Mandatory |

## Multi-language List

Can be overridden by the host project

```ts
export default {
  lpmf_colour: 'Colored Light',
  lpmf_white: 'White Light',
  lpmf_hue: 'H',
  lpmf_saturation: 'S',
  lpmf_value: 'V',
  lpmf_hsv: 'HSV',
  lpmf_temp: 'Color Temperature',
  lpmf_brightness: 'Brightness',
  lpmf_save: 'Save',
  lpmf_dimming: 'Dimming',
  lpmf_powerMemory: 'Power-off Memory',
  lpmf_needDeviceId: 'Missing Parameters',
  lpmf_powerMemory_desc: 'Light state after powering on',
  lpmf_recoverMemory: 'Restore Memory',
  lpmf_recoverMemory_desc: 'Last used color and brightness',
  lpmf_initialMemory: 'Initial Mode',
  lpmf_initialMemory_desc: 'Initial default color and brightness',
  lpmf_customMemory: 'User Customization',
  lpmf_customMemory_desc: 'Selected color and brightness',
  lpmf_initCloudDataFailed: 'Failed to initialize device data',
}
```

## TTT Capability

- App Version: 5.0.0 and above

- "BaseKit": "3.4.0",
- "MiniKit": "3.2.2",
- "BizKit": "3.5.6",
- "DeviceKit": "3.5.1"
- "baseversion": "2.12.18"

## Version History

### v1.3.1

New: dynamicDistribute attribute

### v1.3.0

New：bgStyle、smartUIThemeVars、themeColor、fontColor、background、collectBorderColor、tabLineStyle、tabLineActiveStyle attribute

### v1.1.0

First fully-featured version

## Notes

Please ensure the product must have a power-off memory DP. If there is no such DP, please hide the entry to this feature page.