[English](./README.md) | 简体中文

# 断电记忆功能页接入文档

## 基础概念

- 功能页： 表示一类特定的功能界面，如：登录页、注册页、忘记密码页、支付页等。此类页面的特点的功能单一、流程完整，可独立访问，具有明确的业务入口与出口。
- 断电记忆功能页：设置照明品类的灯断电后重新上电的灯的默认状态，需要标准 DP `power_memory`。

## 路由列表

| 路由名称          | 路由地址 | 路由参数 | 路由描述                 | 适用场景                            |
| ----------------- | -------- | -------- | ------------------------ | ----------------------------------- |
| 断电记忆功能页首页 | /home    | deviceId \/ groupId | 设置断电记忆页面 | 有断电记忆 DP 的产品 |

## 路由参数

| 参数名称          | 参数描述 | 默认值 | 
| ----------------- | -------- | -------- | 
| deviceId | 设备 Id    | -  | 
| groupId | 群组 Id，同时传入`deviceId`和`groupId`时只会受`groupId`控制    |  - | 
| bgImgUrl | string   | -  | 否   | 页面的背景图, 需要 encodeURIComponent     |

## 依赖 DP

宿主小程序关联产品所需要依赖的 DP

| 标识符 | 描述 | 数据传输类型  | 数据类型  | 功能点属性 | 是否必须 |
| ----------------- | -------- | -------- | -------- | -------- |  -------- |  
| power_memory | 断电记忆   | 可下发可上报（rw）  |  透传型（Raw） |  - |  必须 | 
| bright_value |  白光亮度 |  可下发可上报（rw） |  数值型（Value） |  数值范围: 10-1000, 间距: 1, 倍数: 0 |   非必须 | 
| temp_value |  白光色温 |  可下发可上报（rw） |  数值型（Value） |  数值范围: 10-1000, 间距: 1, 倍数: 0 |   非必须 | 
| colour_data |  彩光 |  可下发可上报（rw） |  字符型（String）	 |  - |   非必须 | 


## 如何接入

### global.config.ts

```typescript
const tuya = {
  // ...其他配置
  functionalPages: {
    // 断电记忆功能页
    LampPowerMemoryFunctional: {
      // tyabzhlpuchrkh7pe8 为功能页的 Id
      appid: 'tyabzhlpuchrkh7pe8',
      // Current recommended version
      version: '1.3.1',
    },
    // ...其他可能的功能页
  },
};
```
### 跳转功能页

```typescript
import { navigateTo } from '@ray-js/ray';

// LampPowerMemoryFunctional 是在 global.config.ts 配置的功能页名称
const jumpUrl = `functional://LampPowerMemoryFunctional/home?deviceId=${deviceId || ''}&groupId=${
  groupId || ''
}`;
// 预设数据
const data: PowerMemoryFunctionalData = {
  collectColors: [{ hue: 100, saturation: 1000, value: 1000 }],
  collectWhites: [{ brightness: 1000, temperature: 1000 }],
};

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
await presetFunctionalData(jumpUrl, data)
// 跳转功能页
navigateTo({ url: jumpUrl, fail: err => console.warn(err) });
```

### 监听功能页返回

```ts
// 监听子功能变化
ty.device.onSubFunctionDataChange(item => {
  const { id } = item;
  if (id !== "tyabzhlpuchrkh7pe8") return;
  console.log('onSubFunctionDataChange', item);
});
// 移除监听
ty.device.offSubFunctionDataChange(res => {
  console.log('offSubFunctionDataChange', res);
});
```

### presetFunctionalData API

| 参数  | 参数描述 | 类型 |  默认值 | 是否必填 |
| ----------------- | -------- | -------- |  -------- |  -------- |
| customColor | 自定义断电记忆值    | `Partial<CustomColor>`  |  `{ colorMode: 'white',hue: 0,saturation: 0,value: 0,brightness: 1000,temperature: 1000 }` |  非必填 |
| collectColors | 菜光收藏列表    |  `ColourCustom[]` |  `[ { hue: 0, saturation: 1000, value: 1000 }, { hue: 120, saturation: 1000, value: 1000 }, { hue: 240, saturation: 1000, value: 1000 }];` |  非必填 |
| collectWhites | 白光收藏列表    |  `WhiteCustom[]` |  `[ { temperature: 0, brightness: 1000 }, { temperature: 500, brightness: 1000 }, { temperature: 1000, brightness: 1000 }]` |  非必填 |
| bgStyle `v1.3.0` | 背景样式    |  `React.CSSProperties` |  - |  非必填 |
| tabLineStyle `v1.3.0` | tab列的样式    |  `React.CSSProperties` |  - |  非必填 |
| tabLineActiveStyle `v1.3.0` | tab列选中的样式    |  `React.CSSProperties` |  - |  非必填 |
| cardStyle `v1.3.0` | 整个卡片的样式    |  `React.CSSProperties` |  - |  非必填 |
| smartUIThemeVars `v1.3.0` | smart-ui 组件的变量，参考 ConfigProvider 组件的`themeVars` 属性，可以修改的组件样式有：`NavBar`    |  `SmartConfigProviderProps['themeVars']` |  - |  非必填 |
| collectBorderColor `v1.3.0` | 收藏色边框颜色，往往为了浅色主题防止收藏色和背景融为一体    |  `string` |  '' |  非必填 |
| background `v1.3.0` | 背景色，会参与动态生成整个页面相关颜色，优先级低于  bgStyle   |  `string` |  `black` |  非必填 |
| fontColor `v1.3.0` | 文字色，会参与动态生成整个页面相关颜色   |  `string` |  `white` |  非必填 |
| themeColor `v1.3.0` | 主题色，会参与动态生成整个页面相关颜色   |  `string` |  `#39A9FF` |  非必填 |
| dynamicDistribute `v1.3.1` | 动态实时下发   |  `boolean` |  `false` |  非必填 |


#### CustomColor

| 参数  | 参数描述 | 类型 | 是否必填 |
| ----------------- | -------- | -------- | -------- |
| colorMode | 模式 白光或者彩光    | `white` \| `colour`  | 非必填 |
| hue | 彩光 色值 0-360    |  `number`  |  非必填 |
| saturation | 彩光 饱和度 0-1000    |  `number` | 非必填 |
| value | 彩光 亮度 0-1000    |  `number`  |  非必填 |
| brightness | 白光 亮度 1-1000    |  `number` | 非必填 |
| temperature | 白光 色温 0-1000    |  `number` | 非必填 |

#### ColourCustom

| 参数  | 参数描述 | 类型 | 是否必填 |
| ----------------- | -------- | -------- | -------- |
| hue | 彩光 色值 0-360    |  `number`  |  非必填 |
| saturation | 彩光 饱和度 0-1000    |  `number` | 非必填 |
| value | 彩光 亮度 0-1000    |  `number`  |  非必填 |

#### WhiteCustom

| 参数  | 参数描述 | 类型 | 是否必填 |
| ----------------- | -------- | -------- | -------- |
| brightness | 白光 亮度 1-1000    |  `number` | 非必填 |
| temperature | 白光 色温 0-1000    |  `number` | 非必填 |

## 多语言列表

可被宿主项目覆盖

```ts
export default {
  lpmf_colour: '彩光',
  lpmf_white: '白光',
  lpmf_hue: 'H',
  lpmf_saturation: 'S',
  lpmf_value: 'V',
  lpmf_hsv: 'HSV',
  lpmf_temp: '色温',
  lpmf_brightness: '亮度',
  lpmf_save: '保存',
  lpmf_dimming: '调光',
  lpmf_powerMemory: '断电记忆',
  lpmf_needDeviceId: '缺少参数',
  lpmf_powerMemory_desc: '通电后灯光状态',
  lpmf_recoverMemory: '恢复记忆',
  lpmf_recoverMemory_desc: '上次使用的颜色和亮度',
  lpmf_initialMemory: '初识模式',
  lpmf_initialMemory_desc: '初始默认的颜色和亮度',
  lpmf_customMemory: '用户定制',
  lpmf_customMemory_desc: '选择的颜色和亮度',
  lpmf_initCloudDataFailed: '初始化设备数据失败',
}
```

## TTT 能力

- App版本：5.0.0 及以上

- "BaseKit": "3.4.0",
- "MiniKit": "3.2.2",
- "BizKit": "3.5.6",
- "DeviceKit": "3.5.1"
- "baseversion": "2.12.18"

## 版本记录

### v1.3.1

新增：dynamicDistribute 属性

### v1.3.0

新增：bgStyle、smartUIThemeVars、themeColor、fontColor、background、collectBorderColor、tabLineStyle、tabLineActiveStyle 属性

### v1.1.0

首个功能完整版本

## 注意事项

请确认产品必须有断电记 DP，如果没有此DP请隐藏进入此功能页的入口。
