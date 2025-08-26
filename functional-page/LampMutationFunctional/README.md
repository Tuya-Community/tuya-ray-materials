[简体中文](./README-zh_CN.md) | English

# Light Gradient Function Page

## Basic Concepts

- Function Page: Represents a specific type of functional interface, such as: login page, registration page, forgot password page, payment page, etc. Such pages are characterized by single function, complete process, independently accessible, with clear business entry and exit points.
- Light Gradient Function Page: Implements a setting page for controlling the light gradient DP.

## Route List

| Route Name       | Route Address | Route Parameters | Route Description          | Applicable Scenarios                |
| ----------------- | ------------ | ---------------- | -------------------------- | ----------------------------------- |
| Light Gradient Home | /home        | deviceId \/ groupId | Setting Light Gradient Function Page | Products with Light Gradient Function DP |

### Route Parameters

| Parameter Name | Parameter Description | Default Value | 
| -------------- | --------------------- | ------------- | 
| deviceId       | Device Id, must choose one between `deviceId` and `groupId` | -  | 
| groupId        | Group Id, must choose one between `groupId` and `deviceId` |  - | 

## DP Dependencies

DPs required by the host mini-program associated product

| Identifier          | Description           | Data Transfer Type | Data Type  | Functional Attribute | Mandatory |
| ------------------- | --------------------- | ------------------ | ---------- | -------------------- | --------- |  
| switch_gradient     | Switch Gradient       | Readable and Writable (rw) | Raw Type   | -                  | Mandatory | 
| white_gradi_time    | White Light Gradient Time | Readable and Writable (rw) | Raw Type   | -                  | Not Mandatory | 
| colour_gradi_time   | Color Light Gradient Time | Readable and Writable (rw) | Raw Type   | -                  | Not Mandatory | 

## How to Connect

### global.config.ts

```js
export const tuya = {
  functionalPages: {
    // Name of the route to the function page, fixed
    LampMutationFunctional: {
      // tytj0ivsldjndnlnld is the Id of the function page, fixed
      appid: 'tytj0ivsldjndnlnld',
      // Current recommended version
      version: "1.0.10",
    },
  },
};
```

### Navigate to Function Page

```ts
import { navigateTo } from '@ray-js/ray';

const jumpUrl = `functional://LampMutationFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

navigateTo({ url, fail: err => console.warn(err) });
```

### Modify Function Page Style

```ts
import { navigateTo } from '@ray-js/ray';

const jumpUrl = `functional://LampMutationFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

// Promise to store function page data
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

// Add preset data to function page
await presetFunctionalData(jumpUrl, {
  cardStyle: {
    background: 'red',
  },
  descStyle: {
    background: 'red',
  },
})
// Navigate to function page
navigateTo({ jumpUrl, fail: err => console.warn(err) });
```

### Clear Preset Data

```ts
const jumpUrl = `functional://LampMutationFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

ty.presetFunctionalData({
  url: jumpUrl,
  data: null,
  success(res) {
    console.log(res);
  },
  fail(res) {
    console.log(res);
  },
});
```

### presetFunctionalData API

| Parameter          | Parameter Description       | Type                                     | Default Value | Required |
| ------------------ | -------------------------- | ---------------------------------------- | ------------- | -------- |
| bgStyle `v1.0.7`          | Background Style            | `React.CSSProperties`                    | -             | Optional |
| cardStyle          | Style of the entire page card | `React.CSSProperties`                    | -             | Optional |
| cardTitleStyle `v1.0.7`    | Card Title Style            | `React.CSSProperties`                    | -             | Optional |
| cardUnitStyle  `v1.0.7`    | Card Unit Style             | `React.CSSProperties`                    | -             | Optional |
| descStyle          | Description text line style and background style at the bottom of the page | `React.CSSProperties` | -         | Optional |
| descArrowStyle  `v1.0.7`   | Description text arrow style at the bottom of the page | `React.CSSProperties` | -         | Optional |
| smartUIThemeVars   | Variables for smart-ui components, refer to the `themeVars` attribute of ConfigProvider component, modifiable component styles include: `NavBar, Stepper` | `SmartConfigProviderProps['themeVars']` | -             | Optional |
| splitLineColor `v1.0.7`    | Split Line Style            | `string`                                  | -             | Optional |

## Multilingual List

Can be overridden by the host project

```ts
export default  {
  lmf_save: 'Save',
  lmf_gradientSetting: 'Lighting Gradient',
  lmf_gradient_unit: '(ms)',
  lmf_switchGradient_on: 'Light On Gradually',
  lmf_switchGradient_on_desc: 'Set to gradually brighten the light when turning it on, so it won't be dazzling in the morning.',
  lmf_switchGradient_off: 'Light Off Gradually',
  lmf_switchGradient_off_desc: 'Set to gradually dim the light when turning it off to avoid bumping into bed corners.',
  lmf_white_gradi_time: 'White Light Gradient',
  lmf_colour_gradi_time: 'Color Light Gradient',
  lmf_white_gradi_time_desc: 'The brightness and color temperature of the luminaire will no longer change instantaneously, but will take some time to gradually change to the specified brightness or color temperature',
  lmf_colour_gradi_time_desc:
    'The hue, saturation, and brightness of the luminaire will no longer change instantaneously, but will take some time to gradually change to the specified hue, saturation, and brightness',
  },
```

## Minimum Dependency Version

### TTT Capability

- App Version: 5.0.0 and above

- "BaseKit": "3.4.0",
- "MiniKit": "3.2.2",
- "BizKit": "3.5.6",
- "DeviceKit": "3.5.1"
- "baseversion": "2.12.18"

## Version Record

### v1.0.10

- Modify card style issue

### v1.0.8

- Modify the divider style

### v1.0.7

- Added bgStyle, cardTitleStyle, cardUnitStyle, descArrowStyle, splitLineColor attributes
- Adjust the overall style of the page, use rgba for transparency

### v1.0.6

First fully functional version

## Notes

Please ensure the product must have a switch gradient DP, if not, hide the entry to this function page.