[简体中文](./README-zh_CN.md) | English

# Power Outage Do Not Disturb Functional Page

## Basic Concepts

- Functional Page: Represents a specific type of functional interface, such as login page, registration page, forgot password page, payment page, etc. These pages are characterized by their single function, complete flow, independent access, and distinct business entry and exit points.
- Power Outage Do Not Disturb Function Access: Implement the settings page for controlling power outage do not disturb DP.

## Route List

| Route Name | Route Address | Route Parameters | Route Description | Applicable Scenarios |
| ------------ | -------- | -------- | --------- | ----------------- |
| Power Outage Do Not Disturb Homepage | /home | deviceId \/ groupId \/ activeColor | Set the power outage do not disturb page | Products with power outage do not disturb DP |

## Route Parameters

| Parameter Name       | Parameter Description | Default Value | 
| ----------------- | -------- | -------- | 
| deviceId | Device Id, must choose either `deviceId` or `groupId`    | -  | 
| groupId | Group Id, must choose either `deviceId` or `groupId`    |  - | 
| activeColor | Button background color after enabling power outage do not disturb    |  `"rgba(0, 190, 155, 1)"` | 

## Dependency DP

DP that the host app needs to associate the product with

| Identifier | Description | Data Transmission Type  | Data Type  | Function Point Attribute | Is Required |
| ----------------- | -------- | -------- | -------- | -------- |  -------- |  
| do_not_disturb | Power Outage Do Not Disturb   | Send and Report (rw)  |  Boolean (Bool)	 |  - |  Required | 

## How to Access

### global.config.ts
Configure functional page, configure in src/global.config.ts
```js
const tuya = {
  // ...other configurations
  functionalPages: {
    // Fixed name for functional page jump route
     LampNoDisturbFunctional: {
      // typsxgb7vfl1unmkbt is the Id of the functional page
      appid: 'typsxgb7vfl1unmkbt',
      // Currently recommended version
      version: "0.1.9",
    },
    // ...other possible functional pages
  },
};
```

### Page Jump

```ts
import { navigateTo } from '@ray-js/ray';

const jumpUrl = `functional://LampNoDisturbFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

navigateTo({
  url: jumpUrl,
});
```


### Modify Functional Page Style

```ts
import { navigateTo } from '@ray-js/ray';

const jumpUrl = `functional://LampNoDisturbFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

// Promisify functional page data storage
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

// Add preset data for functional page
await presetFunctionalData(jumpUrl, {
  activeColor: 'red',
  descStyle: {
    color: 'red'
  },
  cardStyle: {
    background: 'red',
  },
  cardTitleStyle: {
    color: 'red',
  },
  cardDescStyle: {
    color: 'red',
  },
})
// Jump to functional page
navigateTo({ jumpUrl, fail: err => console.warn(err) });
```

### Clear Preset Data

```ts
const jumpUrl = `functional://LampNoDisturbFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

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

| Parameter         | Parameter Description          | Type                   | Default Value   | Is Required |
| ----------- | ---------------- | ---------------------- | ------ | -------- |
| activeColor | Theme Color           | _string_  | `rgba(0, 190, 155, 1)` | Optional   |
| bgStyle   | Background Style      | _React.CSSProperties_ | -      | Optional   |
| descStyle   | Description Text Style      | _React.CSSProperties_ | -      | Optional   |
| cardStyle   | Style of the entire page card  | _React.CSSProperties_  | -      | Optional   |
| cardTitleStyle | Card Title Style | _React.CSSProperties_ | -      | Optional   |
| imgBoxStyle  `v0.1.8` | The style of the image box | _React.CSSProperties_ | -      | Optional   |
| imgStyle  `v0.1.8` | Style of the image | _React.CSSProperties_ | -      | Optional   |
| cardDescStyle  | Card Description Style | _React.CSSProperties_ | -      | Optional   |
| dpCode  | Function Point | string | -      | Optional   |
| title  | Title | string | -      | Optional   |
| boxImgUrl  | Image URL | string | -      | Optional   |
| boxDesc  | Image Description | string | -      | Optional   |
| saveText `v0.1.8`  | Save Button Text | string | -      | Optional   |
| buttonTitle  | Button Title | string | -      | Optional   |
| buttonDesc  | Button Description | string | -      | Optional   |
| smartUIThemeVars | Variables for smart-ui components, refer to the `themeVars` property of the ConfigProvider component. The styles of components that can be modified include: `NavBar, Switch` | `SmartConfigProviderProps['themeVars']` | -      | Optional   |

## Multilingual List

Can be overridden by host project

```ts
export default {
  lndf_functionTitle: 'Power Outage Do Not Disturb',
  lndf_desc: 'After enabling the power outage do not disturb mode, the lamp will not suddenly light up after a power outage, causing disturbance. You need to turn it on and off twice within 5 seconds to normally turn on the lamp.',
  lndf_itemTitle: 'Power Outage Do Not Disturb',
  lndf_itemDesc: 'Need to switch twice to start the lamp',
  lndf_save: 'Save',
}
```

## Minimum Dependency Version

### TTT Capability

- App version: 5.0.0 and above

- "BaseKit": "3.4.0",
- "MiniKit": "3.2.2",
- "BizKit": "3.5.6",
- "DeviceKit": "3.5.1"
- "baseversion": "2.12.18"

## Version History

### v0.1.9
- Modify to enter the default background color as --app-B1, following the app theme

### v0.1.8
- Add imgBoxStyle, imgStyle, saveText properties

### v0.1.7

- Alignment style issue

### v0.1.6

- Added the method presetFunctionalData for sending data
- Added parameters: descStyle, cardStyle, cardTitleStyle, cardDescStyle, bgStyle、smartUIThemeVars
- Modified some page styles

### v0.1.5

First complete functional version

## Notes

Please ensure the product must have the power outage do not disturb DP. If this DP is absent, please hide the entry to this functional page.