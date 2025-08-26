[English](./README.md) | 简体中文

# 停电勿扰功能页

## 基础概念

- 功能页： 表示一类特定的功能界面，如：登录页、注册页、忘记密码页、支付页等。此类页面的特点的功能单一、流程完整，可独立访问，具有明确的业务入口与出口。
- 停电勿扰功能接入：实现控制停电勿扰 DP 的设置页面。

## 路由列表

| 路由名称 | 路由地址 | 路由参数 | 路由描述     | 适用场景            |
| ------------ | -------- | -------- | --------- | ----------------- |
| 停电勿扰首页 | /home    | deviceId \/ groupId \/ activeColor | 设置停电勿扰页面 | 有停电勿扰 DP 的产品 |

## 路由参数

| 参数名称          | 参数描述 | 默认值 | 
| ----------------- | -------- | -------- | 
| deviceId | 设备 Id，和 `deviceId` 必须取取其一    | -  | 
| groupId | 群组 Id，和 `groupId` 必须取取其一    |  - | 
| activeColor | 开启停电勿扰后的按钮背景色    |  `"rgba(0, 190, 155, 1)"` | 

## 依赖 DP

宿主小程序关联产品所需要依赖的 DP

| 标识符 | 描述 | 数据传输类型  | 数据类型  | 功能点属性 | 是否必须 |
| ----------------- | -------- | -------- | -------- | -------- |  -------- |  
| do_not_disturb | 停电勿扰   | 可下发可上报（rw）  |  布尔型（Bool）	 |  - |  必须 | 

## 如何接入

### global.config.ts
配置功能页, src/global.config.ts 配置
```js
const tuya = {
  // ...其他配置
  functionalPages: {
    // 功能页跳转路由的名称 固定
     LampNoDisturbFunctional: {
      // typsxgb7vfl1unmkbt 为功能页的 Id
      appid: 'typsxgb7vfl1unmkbt',
      // 当前推荐版本
      version: "0.1.9",
    },
    // ...其他可能的功能页
  },
};
```

### 页面跳转

```ts
import { navigateTo } from '@ray-js/ray';

const jumpUrl = `functional://LampNoDisturbFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

navigateTo({
  url: jumpUrl,
});
```


### 修改功能页样式

```ts
import { navigateTo } from '@ray-js/ray';

const jumpUrl = `functional://LampNoDisturbFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

// 存储功能页数据Promise化
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

// 添加功能页预设数据
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
// 跳转功能页
navigateTo({ jumpUrl, fail: err => console.warn(err) });
```

### 清空预设数据

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

| 参数         | 参数描述          | 类型                   | 默认值   | 是否必填 |
| ----------- | ---------------- | ---------------------- | ------ | -------- |
| activeColor | 主题色           | _string_  | `rgba(0, 190, 155, 1)` | 非必填   |
| descStyle   | 描述文案样式      | _React.CSSProperties_ | -      | 非必填   |
| bgStyle   | 背景样式      | _React.CSSProperties_ | -      | 非必填   |
| cardStyle   | 整个页面卡片的样式  | _React.CSSProperties_  | -      | 非必填   |
| cardTitleStyle | 卡片标题样式 | _React.CSSProperties_ | -      | 非必填   |
| cardDescStyle  | 卡片描述样式 | _React.CSSProperties_ | -      | 非必填   |
| imgBoxStyle  `v0.1.8` | 图片盒子的样式 | _React.CSSProperties_ | -      | 非必填   |
| imgStyle  `v0.1.8` | 图片的样式 | _React.CSSProperties_ | -      | 非必填   |
| dpCode  | 功能点 | string | -      | 非必填   |
| title  | 标题 | string | -      | 非必填   |
| boxImgUrl  | 图片url | string | -      | 非必填   |
| boxDesc  | 图片描述 | string | -      | 非必填   |
| saveText `v0.1.8`  | 保存按钮的文案 | string | -      | 非必填   |
| buttonTitle  | 按钮标题 | string | -      | 非必填   |
| buttonDesc  | 按钮描述 | string | -      | 非必填   |
| smartUIThemeVars | smart-ui 组件的变量，参考 ConfigProvider 组件的`themeVars` 属性，可以修改的组件样式有：`NavBar, Switch` | `SmartConfigProviderProps['themeVars']` | -      | 非必填   |


## 多语言列表

可被宿主项目覆盖

```ts
export default {
  lndf_functionTitle: '停电勿扰',
  lndf_desc: '开启停电勿扰模式后。停电后通电，灯具不会突然亮灯产生惊扰，需要在5s内连续开关两次才能正常开启灯具。',
  lndf_itemTitle: '停电勿扰',
  lndf_itemDesc: '连续2次开关才能启动灯',
  lndf_save: '保存',
}
```

## 最小依赖版本

### TTT 能力

- App版本：5.0.0 及以上

- "BaseKit": "3.4.0",
- "MiniKit": "3.2.2",
- "BizKit": "3.5.6",
- "DeviceKit": "3.5.1"
- "baseversion": "2.12.18"

## 版本记录

### v0.1.9
- 修改进入默认背景色为 --app-B1 随app 主题

### v0.1.8
- 新增 imgBoxStyle、imgStyle、saveText 属性

### v0.1.7
- 对齐样式问题

### v0.1.6

- 新增 presetFunctionalData 方式发送数据
- 新增参数: descStyle、cardStyle、cardTitleStyle、cardDescStyle、bgStyle、smartUIThemeVars
- 修改部分页面样式

### v0.1.5

首个功能完整版本

## 注意事项

请确认产品必须有停电勿扰 DP，如果没有此 DP 请隐藏进入此功能页的入口。
