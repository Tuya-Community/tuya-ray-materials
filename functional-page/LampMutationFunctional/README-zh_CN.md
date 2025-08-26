[English](./README.md) | 简体中文

# 灯光渐变功能页

## 基础概念

- 功能页： 表示一类特定的功能界面，如：登录页、注册页、忘记密码页、支付页等。此类页面的特点的功能单一、流程完整，可独立访问，具有明确的业务入口与出口。
- 灯光渐变功能页：实现控制灯光渐变 DP 的设置页面。

## 路由列表

| 路由名称          | 路由地址 | 路由参数 | 路由描述                 | 适用场景                            |
| ----------------- | -------- | -------- | ------------------------ | ----------------------------------- |
| 灯光渐变首页 | /home    | deviceId \/ groupId | 设置灯光渐变功能页 | 有灯光渐变功能 DP 的产品 |

### 路由参数

| 参数名称    | 参数描述 | 默认值 | 
| ----------------- | -------- | -------- | 
| deviceId | 设备 Id，和 `deviceId` 必须取取其一    | -  | 
| groupId | 群组 Id，和 `groupId` 必须取取其一    |  - | 

## 依赖 DP

宿主小程序关联产品所需要依赖的 DP

| 标识符 | 描述 | 数据传输类型  | 数据类型  | 功能点属性 | 是否必须 |
| ----------------- | -------- | -------- | -------- | -------- |  -------- |  
| switch_gradient | 开关渐变   | 可下发可上报（rw）  |  透传型（Raw） |  - |  必须 | 
| white_gradi_time |  白光渐变时间 |  可下发可上报（rw） |  透传型（Raw） |  - |   非必须 | 
| colour_gradi_time |  彩光渐变时间 |  可下发可上报（rw） |  透传型（Raw） |  - |   非必须 | 

## 如何接入

### global.config.ts

```js
export const tuya = {
  functionalPages: {
    // 功能页跳转路由的名称 固定
    LampMutationFunctional: {
      // tytj0ivsldjndnlnld 为功能页的 Id 固定
      appid: 'tytj0ivsldjndnlnld',
      // 当前推荐版本
      version: "1.0.10",
    },
  },
};
```
### 跳转功能页

```ts
import { navigateTo } from '@ray-js/ray';

const jumpUrl = `functional://LampMutationFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

navigateTo({ url, fail: err => console.warn(err) });
```

### 修改功能页样式

```ts
import { navigateTo } from '@ray-js/ray';

const jumpUrl = `functional://LampMutationFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;

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
  cardStyle: {
    background: 'red',
  },
  descStyle: {
    background: 'red',
  },
})
// 跳转功能页
navigateTo({ jumpUrl, fail: err => console.warn(err) });
```

### 清空预设数据

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

| 参数             | 参数描述                                                        | 类型                                    | 默认值 | 是否必填 |
| ----------- | ---------------- | ---------- | ------ | -------- |
| bgStyle  `v1.0.7` | 背景样式      | `React.CSSProperties`   | -      | 非必填   |
| cardStyle   | 整个页面卡片的样式  | `React.CSSProperties` | -      | 非必填   |
| cardTitleStyle  `v1.0.7` | 卡片标题的样式  | `React.CSSProperties` | -      | 非必填 |
| cardUnitStyle  `v1.0.7` | 卡片单位的样式  | `React.CSSProperties` | -      | 非必填 |
| descStyle  | 页面下部的描述文案行和背景样式   | `React.CSSProperties`  | -   | 非必填   |
| descArrowStyle `v1.0.7`  | 页面下部的描述文案箭头样式  | `React.CSSProperties` | -    | 非必填 |
| smartUIThemeVars | smart-ui 组件的变量，参考 ConfigProvider 组件的`themeVars` 属性，可以修改的组件样式有：`NavBar, Stepper` | `SmartConfigProviderProps['themeVars']` | -      | 非必填   |
| splitLineColor `v1.0.7`  | 分割线样式i  | `string` | -    | 非必填 |

## 多语言列表

可被宿主项目覆盖

```ts
export default  {
  lmf_save: '保存',
  lmf_gradientSetting: '灯光渐变',
  lmf_gradient_unit: '(毫秒)',
  lmf_switchGradient_on: '开灯渐明',
  lmf_switchGradient_on_desc: '设置开灯渐亮，使灯光缓缓变亮，晨起不会刺眼。',
  lmf_switchGradient_off: '关灯渐暗',
  lmf_switchGradient_off_desc: '设置关灯渐暗，使灯光缓缓变暗，避免磕碰床脚。',
  lmf_white_gradi_time: '白光渐变',
  lmf_colour_gradi_time: '彩光渐变',
  lmf_white_gradi_time_desc: '灯具亮度和色温不再即时发生变化，而是需要一段时间来渐变至指定亮度或色温',
  lmf_colour_gradi_time_desc:
    '灯具色相、饱和度、亮度不再即时发生变化，而是需要一段时间来渐变至指定色相、饱和度、亮度',
  },
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

### v1.0.10

- 修改卡片样式问题

### v1.0.8

- 修改分割线样式

### v1.0.7

- 新增 bgStyle、cardTitleStyle、cardUnitStyle、descArrowStyle、splitLineColor属性
- 调整页面整体样式，透明度采用rgba实现

### v1.0.6

首个功能完整版本

## 注意事项

请确认产品必须有开关渐变 DP，如果没有此dp请隐藏进入此功能页的入口。

